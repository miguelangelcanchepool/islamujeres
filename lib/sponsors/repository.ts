import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { parseSponsorWebsite, safeLogoSrc } from "@/lib/admin/sponsor-fields";
import { readSupabaseEnv } from "@/lib/supabase/env";
import type { PublicSponsor, PublicSponsorsResult } from "@/lib/sponsors/types";

const missingConfigMessage =
  "Supabase no está configurado. Define SUPABASE_URL y SUPABASE_ANON_KEY en el servidor, sin el prefijo NEXT_PUBLIC_. El carrusel no puede leer public.sponsors.";

type SponsorRow = {
  id: string | null;
  name: string | null;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number | null;
};

/**
 * Patrocinadores activos para el carrusel de la portada.
 * Usa la clave anónima y sponsors_public_read. Una lista vacía es una
 * consulta correcta. Un error no se convierte en lista vacía.
 */
export async function getPublicSponsors(): Promise<PublicSponsorsResult> {
  const env = readSupabaseEnv();
  if (!env) {
    console.error(`[patrocinadores] ${missingConfigMessage}`);
    return { ok: false };
  }

  try {
    const sponsors =
      process.env.NODE_ENV === "development"
        ? await readActiveSponsors(env.url)
        : await loadActiveSponsors(env.url);

    if (sponsors.length === 0) {
      console.info(
        "[patrocinadores] No hay patrocinadores activos. La portada conserva las marcas de demostración.",
      );
    } else {
      console.info(`[patrocinadores] Portada leída desde Supabase: ${sponsors.length} activos.`);
    }

    return { ok: true, sponsors };
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudieron leer los patrocinadores.";
    console.error(`[patrocinadores] ${message}`);
    return { ok: false };
  }
}

async function loadActiveSponsors(url: string): Promise<PublicSponsor[]> {
  "use cache";
  cacheTag("sponsors");
  cacheLife("hours");

  return readActiveSponsors(url);
}

async function readActiveSponsors(url: string): Promise<PublicSponsor[]> {
  const anonKey = process.env.SUPABASE_ANON_KEY?.trim();
  if (!anonKey) {
    throw new Error(missingConfigMessage);
  }

  const supabase = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { data, error } = await supabase
    .from("sponsors")
    .select("id, name, logo_url, website_url, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new Error(
      `No se pudieron leer los patrocinadores activos (${error.code ?? "sin código"}). Revisa public.sponsors y la política sponsors_public_read. Esto no es una lista vacía.`,
    );
  }

  if (!Array.isArray(data)) {
    throw new Error("Supabase no devolvió la lista de patrocinadores activos.");
  }

  return data.map((row) => toPublicSponsor(row as SponsorRow));
}

function toPublicSponsor(row: SponsorRow): PublicSponsor {
  const id = text(row.id);
  const name = text(row.name);
  if (!id || !name) {
    throw new Error("Un patrocinador activo llegó sin identificador o sin nombre.");
  }

  return {
    id,
    name,
    logoUrl: displayLogo(row.logo_url, name),
    websiteUrl: displayWebsite(row.website_url, name),
  };
}

function displayWebsite(url: string | null, name: string): string | null {
  if (!url?.trim()) return null;
  const parsed = parseSponsorWebsite(url);
  if (!parsed.ok || !parsed.website) {
    console.warn(`[patrocinadores] El enlace de «${name}» no es un sitio público y no se usa.`);
    return null;
  }
  return parsed.website;
}

function displayLogo(url: string | null, name: string): string | null {
  if (!url?.trim()) return null;
  const safe = safeLogoSrc(url);
  if (!safe || !isStoredLogo(safe)) {
    console.warn(
      `[patrocinadores] El logotipo de «${name}» no está en el almacén sponsor-logos y no se muestra.`,
    );
    return null;
  }
  return safe;
}

function isStoredLogo(url: string): boolean {
  const parsed = new URL(url);
  if (!parsed.pathname.includes("/storage/v1/object/public/sponsor-logos/")) return false;
  if (parsed.hostname.endsWith(".supabase.co")) return true;

  const configured = process.env.SUPABASE_URL?.trim();
  if (!configured) return false;
  try {
    return new URL(configured).hostname === parsed.hostname;
  } catch {
    return false;
  }
}

function text(value: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}
