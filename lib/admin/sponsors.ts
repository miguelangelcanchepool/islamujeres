import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { isUuid } from "@/lib/admin/place-fields";
import { inspectImage, type InspectedImage } from "@/lib/admin/photos";
import type { SponsorDraft } from "@/lib/admin/sponsor-fields";

export const sponsorLogoBucket = "sponsor-logos";

const publicMarker = `/storage/v1/object/public/${sponsorLogoBucket}/`;

export type AdminSponsor = {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  active: boolean;
  sortOrder: number;
};

type SponsorQuery = { ok: true; sponsor: AdminSponsor | null } | { ok: false; error: string };
type SponsorList = { ok: true; sponsors: AdminSponsor[] } | { ok: false; error: string };
type SponsorWrite = { ok: true } | { ok: false; error: string };

const columns = "id, name, logo_url, website_url, is_active, sort_order";

export async function listAdminSponsors(supabase: SupabaseClient): Promise<SponsorList> {
  const { data, error } = await supabase
    .from("sponsors")
    .select(columns)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) return { ok: false, error: readError(error) };

  try {
    return { ok: true, sponsors: (data ?? []).map((row) => toSponsor(row)) };
  } catch (caught) {
    return { ok: false, error: caught instanceof Error ? caught.message : "Un patrocinador llegó incompleto." };
  }
}

export async function getAdminSponsor(supabase: SupabaseClient, id: string): Promise<SponsorQuery> {
  if (!isUuid(id)) return { ok: true, sponsor: null };

  const { data, error } = await supabase.from("sponsors").select(columns).eq("id", id).maybeSingle();
  if (error) return { ok: false, error: readError(error) };
  if (!data) return { ok: true, sponsor: null };

  try {
    return { ok: true, sponsor: toSponsor(data) };
  } catch (caught) {
    return { ok: false, error: caught instanceof Error ? caught.message : "Un patrocinador llegó incompleto." };
  }
}

export async function createAdminSponsor(
  supabase: SupabaseClient,
  draft: SponsorDraft,
  image: InspectedImage,
): Promise<SponsorWrite> {
  const order = await nextSortOrder(supabase);
  if (!order.ok) return order;

  const { data: created, error } = await supabase
    .from("sponsors")
    .insert({
      name: draft.name,
      is_active: false,
      sort_order: order.value,
      logo_url: null,
      website_url: draft.website,
    })
    .select("id")
    .single();

  if (error || !created?.id) return { ok: false, error: writeError(error ?? {}) };

  const stored = await uploadLogo(supabase, created.id, image);
  if (!stored.ok) {
    await supabase.from("sponsors").delete().eq("id", created.id);
    return stored;
  }

  const updated = await supabase
    .from("sponsors")
    .update({ logo_url: stored.url, is_active: draft.active, website_url: draft.website })
    .eq("id", created.id)
    .select("id");

  if (updated.error || !updated.data?.length) {
    await supabase.storage.from(sponsorLogoBucket).remove([stored.path]);
    await supabase.from("sponsors").delete().eq("id", created.id);
    return { ok: false, error: updated.error ? writeError(updated.error) : "No se pudo guardar el logotipo." };
  }

  return { ok: true };
}

export async function updateAdminSponsor(
  supabase: SupabaseClient,
  id: string,
  draft: SponsorDraft,
  image: InspectedImage | null,
): Promise<SponsorWrite> {
  const current = await getAdminSponsor(supabase, id);
  if (!current.ok) return current;
  if (!current.sponsor) return { ok: false, error: "No se encontró el patrocinador." };

  let logoUrl = current.sponsor.logoUrl;
  let uploaded: string | null = null;
  if (image) {
    const stored = await uploadLogo(supabase, id, image);
    if (!stored.ok) return stored;
    logoUrl = stored.url;
    uploaded = stored.path;
  }

  const updated = await supabase
    .from("sponsors")
    .update({
      name: draft.name,
      is_active: draft.active,
      logo_url: logoUrl,
      website_url: draft.website,
    })
    .eq("id", id)
    .select("id");

  if (updated.error || !updated.data?.length) {
    if (uploaded) await supabase.storage.from(sponsorLogoBucket).remove([uploaded]);
    return {
      ok: false,
      error: updated.error
        ? writeError(updated.error)
        : "No se encontró el patrocinador o no tienes permiso para editarlo.",
    };
  }

  if (uploaded) {
    const previous = storedLogoPath(current.sponsor.logoUrl, id);
    if (previous && previous !== uploaded) {
      await supabase.storage.from(sponsorLogoBucket).remove([previous]);
    }
  }

  return { ok: true };
}

export async function moveAdminSponsor(
  supabase: SupabaseClient,
  id: string,
  direction: "up" | "down",
): Promise<SponsorWrite> {
  const listed = await listAdminSponsors(supabase);
  if (!listed.ok) return listed;

  const index = listed.sponsors.findIndex((sponsor) => sponsor.id === id);
  if (index < 0) return { ok: false, error: "No se encontró el patrocinador." };

  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= listed.sponsors.length) return { ok: true };

  const next = [...listed.sponsors];
  const [moved] = next.splice(index, 1);
  next.splice(target, 0, moved);

  for (const [order, sponsor] of next.entries()) {
    if (sponsor.sortOrder === order) continue;
    const updated = await supabase
      .from("sponsors")
      .update({ sort_order: order })
      .eq("id", sponsor.id)
      .select("id");
    if (updated.error || !updated.data?.length) {
      return { ok: false, error: updated.error ? writeError(updated.error) : "No se pudo cambiar el orden." };
    }
  }

  return { ok: true };
}

export async function setAdminSponsorActive(supabase: SupabaseClient, id: string): Promise<SponsorWrite> {
  const current = await getAdminSponsor(supabase, id);
  if (!current.ok) return current;
  if (!current.sponsor) return { ok: false, error: "No se encontró el patrocinador." };

  const updated = await supabase
    .from("sponsors")
    .update({ is_active: !current.sponsor.active })
    .eq("id", id)
    .select("id");

  if (updated.error) return { ok: false, error: writeError(updated.error) };
  if (!updated.data?.length) {
    return { ok: false, error: "No se encontró el patrocinador o no tienes permiso para editarlo." };
  }

  return { ok: true };
}

export async function deleteAdminSponsor(supabase: SupabaseClient, id: string): Promise<SponsorWrite> {
  const current = await getAdminSponsor(supabase, id);
  if (!current.ok) return current;
  if (!current.sponsor) return { ok: false, error: "No se encontró el patrocinador." };

  const path = storedLogoPath(current.sponsor.logoUrl, id);
  if (path) {
    const removed = await supabase.storage.from(sponsorLogoBucket).remove([path]);
    if (removed.error && !isMissingObject(removed.error.message)) {
      return { ok: false, error: "No se pudo borrar el logotipo. El patrocinador sigue en la lista." };
    }
  }

  const deleted = await supabase.from("sponsors").delete().eq("id", id).select("id");
  if (deleted.error) return { ok: false, error: writeError(deleted.error) };
  if (!deleted.data?.length) return { ok: false, error: "No se pudo eliminar el patrocinador." };

  return { ok: true };
}

export async function inspectLogo(
  file: File,
): Promise<{ ok: true; image: InspectedImage } | { ok: false; error: string }> {
  const result = await inspectImage(file);
  if (result.ok) return result;
  return {
    ok: false,
    error: result.error.replaceAll("La fotografía", "El logotipo").replaceAll("fotografía", "logotipo"),
  };
}

async function nextSortOrder(
  supabase: SupabaseClient,
): Promise<{ ok: true; value: number } | { ok: false; error: string }> {
  const { data, error } = await supabase
    .from("sponsors")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .order("id", { ascending: false })
    .limit(1);

  if (error) return { ok: false, error: readError(error) };
  const current = data?.[0]?.sort_order;
  return { ok: true, value: typeof current === "number" ? current + 1 : 0 };
}

async function uploadLogo(
  supabase: SupabaseClient,
  sponsorId: string,
  image: InspectedImage,
): Promise<{ ok: true; url: string; path: string } | { ok: false; error: string }> {
  if (!isUuid(sponsorId)) return { ok: false, error: "No se encontró el patrocinador." };

  const path = `${sponsorId}/${crypto.randomUUID()}.${image.ext}`;
  const body = new Blob([new Uint8Array(image.bytes)], { type: image.mime });
  const uploaded = await supabase.storage.from(sponsorLogoBucket).upload(path, body, {
    contentType: image.mime,
    upsert: false,
  });

  if (uploaded.error) return { ok: false, error: storageErrorMessage(uploaded.error.message) };

  const url = supabase.storage.from(sponsorLogoBucket).getPublicUrl(path).data.publicUrl;
  return { ok: true, url, path };
}

function storedLogoPath(src: string | null, sponsorId: string): string | null {
  if (!src || !isUuid(sponsorId)) return null;
  const marker = src.indexOf(publicMarker);
  if (marker === -1) return null;
  const path = decodeURIComponent(src.slice(marker + publicMarker.length).split("?")[0] ?? "");
  const pattern = new RegExp(
    `^${sponsorId}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.(jpg|png|webp)$`,
    "i",
  );
  return pattern.test(path) ? path : null;
}

function toSponsor(row: Record<string, unknown>): AdminSponsor {
  const id = requiredText(row.id);
  if (!isUuid(id)) throw new Error("Un patrocinador llegó incompleto.");
  if (typeof row.is_active !== "boolean") throw new Error("Un patrocinador llegó incompleto.");
  if (typeof row.sort_order !== "number" || !Number.isInteger(row.sort_order)) {
    throw new Error("Un patrocinador llegó incompleto.");
  }

  return {
    id,
    name: requiredText(row.name),
    logoUrl: typeof row.logo_url === "string" && row.logo_url.trim() ? row.logo_url : null,
    websiteUrl: typeof row.website_url === "string" && row.website_url.trim() ? row.website_url : null,
    active: row.is_active,
    sortOrder: row.sort_order,
  };
}

function requiredText(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Un patrocinador llegó incompleto.");
  }
  return value;
}

function readError(error: { code?: string; message?: string }): string {
  return infraError(error) ?? "No se pudieron leer los patrocinadores.";
}

function writeError(error: { code?: string; message?: string }): string {
  return infraError(error) ?? "No se pudo guardar el patrocinador.";
}

function infraError(error: { code?: string; message?: string }): string | null {
  const code = error.code ?? "";
  const message = (error.message ?? "").toLowerCase();
  if (message.includes("website_url")) {
    return "Falta la columna website_url. Ejecuta supabase/sponsors-website.sql en el editor SQL de Supabase. No modifica las políticas ni los registros.";
  }
  if (
    code === "42P01" ||
    code === "PGRST205" ||
    message.includes("schema cache") ||
    message.includes("does not exist")
  ) {
    return "Falta la tabla sponsors. Ejecuta supabase/sponsors.sql en el editor SQL de Supabase. Ese archivo no modifica lugares ni sus políticas.";
  }
  if (code === "42501" || message.includes("row-level security") || message.includes("permission")) {
    return "No tienes permiso para gestionar patrocinadores.";
  }
  if (code === "23514") return "El nombre no es válido.";
  return null;
}

function storageErrorMessage(message: string): string {
  const text = message.toLowerCase();
  if (text.includes("bucket not found")) {
    return "Falta el almacén sponsor-logos. Ejecuta supabase/sponsors.sql en el editor SQL de Supabase. Ese archivo no cambia el almacén de las fotografías de lugares.";
  }
  if (text.includes("row-level security") || text.includes("permission") || text.includes("403")) {
    return "No tienes permiso para guardar el logotipo.";
  }
  if (text.includes("mime") || text.includes("invalid") || text.includes("payload")) {
    return "El almacén rechazó el archivo. Usa JPG, PNG o WebP de hasta 5 MB.";
  }
  return "No se pudo guardar el logotipo.";
}

function isMissingObject(message: string): boolean {
  const text = message.toLowerCase();
  return text.includes("not found") || text.includes("does not exist");
}
