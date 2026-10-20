import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { catalog } from "@/lib/places/catalog";
import {
  placeCategories,
  type Place,
  type PlaceCoordinates,
  type PlaceLink,
} from "@/lib/places/types";
import type { Media } from "@/lib/media";

const missingConfigMessage =
  "Supabase no está configurado. Define SUPABASE_URL y SUPABASE_ANON_KEY en el servidor, sin el prefijo NEXT_PUBLIC_. La guía usa el catálogo local y el mapa sigue disponible.";

const partialConfigMessage =
  "La configuración de Supabase está incompleta. Define SUPABASE_URL y SUPABASE_ANON_KEY juntas, solo en el servidor. No uses la clave service_role ni el prefijo NEXT_PUBLIC_.";

let warnedMissingConfig = false;

type PhotoRow = {
  src: string | null;
  alt: string | null;
  author: string | null;
  license: string | null;
  license_url: string | null;
  source_url: string | null;
  sort_order: number | null;
};

type LinkRow = {
  label: string | null;
  href: string | null;
  kind: string | null;
  sort_order: number | null;
};

type PlaceRow = {
  slug: string;
  name: string;
  category: string;
  visibility: string;
  status: string;
  origin: string;
  summary: string;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  location_note: string | null;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  hours: string | null;
  directions: string | null;
  place_photos: PhotoRow[] | null;
  place_links: LinkRow[] | null;
};

/**
 * Lugares publicados para el mapa, los filtros y las fichas.
 * Devuelve el mismo tipo `Place` del catálogo. El id público es el slug.
 *
 * Sin SUPABASE_URL y SUPABASE_ANON_KEY, responde el catálogo local.
 * Con ambas variables, lee solo filas `publicado` mediante la clave anónima
 * y las políticas de lectura. La clave no sale del servidor.
 */
export async function getPublishedPlaces(): Promise<Place[]> {
  const url = process.env.SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.SUPABASE_ANON_KEY?.trim() ?? "";

  if (!url && !anonKey) {
    if (!warnedMissingConfig) {
      warnedMissingConfig = true;
      console.warn(`[lugares] ${missingConfigMessage}`);
    }
    return publishedFrom(catalog);
  }

  if (!url || !anonKey) {
    throw new Error(partialConfigMessage);
  }

  // En desarrollo no se usa "use cache". Con cacheLife("hours") el servidor
  // local conserva la entrada hasta que expira (un día), y una recarga sigue
  // mostrando el resultado anterior. En producción la consulta queda cacheada.
  if (process.env.NODE_ENV === "development") {
    return readPublishedPlaces(url);
  }

  return loadPublishedPlaces(url);
}

async function loadPublishedPlaces(url: string): Promise<Place[]> {
  "use cache";
  cacheTag("places");
  cacheLife("hours");

  return readPublishedPlaces(url);
}

async function readPublishedPlaces(url: string): Promise<Place[]> {
  const anonKey = process.env.SUPABASE_ANON_KEY?.trim();
  if (!anonKey) {
    throw new Error(partialConfigMessage);
  }

  const supabase = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { data, error } = await supabase
    .from("places")
    .select(
      `
      slug,
      name,
      category,
      visibility,
      status,
      origin,
      summary,
      description,
      address,
      latitude,
      longitude,
      location_note,
      phone,
      whatsapp,
      website,
      hours,
      directions,
      place_photos (
        src,
        alt,
        author,
        license,
        license_url,
        source_url,
        sort_order
      ),
      place_links (
        label,
        href,
        kind,
        sort_order
      )
    `,
    )
    .eq("status", "publicado");

  if (error) {
    throw new Error(
      `No se pudieron leer los lugares publicados (${error.code ?? "sin código"}). Ejecuta supabase/schema.sql y supabase/seed.sql, y conserva la política de lectura pública. La clave service_role no hace falta para esta consulta.`,
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(
      "Supabase no devolvió lugares publicados. Ejecuta supabase/seed.sql y comprueba que places_public_read sigue permitiendo leer status = publicado. El mapa no se deja vacío.",
    );
  }

  const places = data.map((row) => toPlace(row as PlaceRow));
  const published = publishedFrom(places);
  if (published.length === 0) {
    throw new Error(
      "La consulta de lugares no incluyó fichas publicadas. Revisa el estado de los registros y la política places_public_read.",
    );
  }

  console.info(
    `[lugares] Guía leída desde Supabase: ${published.length} lugares publicados.`,
  );
  return published;
}

function publishedFrom(places: Place[]): Place[] {
  return places
    .filter((place) => place.status === "publicado")
    .sort((left, right) => {
      const leftLatitude = left.coordinates?.latitude ?? Number.NEGATIVE_INFINITY;
      const rightLatitude = right.coordinates?.latitude ?? Number.NEGATIVE_INFINITY;
      return rightLatitude - leftLatitude;
    });
}

function toPlace(row: PlaceRow): Place {
  const id = text(row.slug);
  if (!id) {
    throw new Error("Un lugar publicado llegó sin slug.");
  }

  const photos = toPhotos(row.place_photos);
  const social = toSocial(row.place_links);

  return {
    id,
    name: requiredText(row.name, id, "nombre"),
    category: oneOf(placeCategories, row.category, id, "categoría"),
    visibility: oneOf(
      ["informativo", "aliado", "destacado"] as const,
      row.visibility,
      id,
      "visibilidad",
    ),
    status: oneOf(
      ["borrador", "publicado", "inactivo"] as const,
      row.status,
      id,
      "estado",
    ),
    origin: oneOf(
      ["editorial", "openstreetmap", "demostracion"] as const,
      row.origin,
      id,
      "origen",
    ),
    summary: requiredText(row.summary, id, "resumen"),
    description: text(row.description),
    address: text(row.address),
    coordinates: toCoordinates(row.latitude, row.longitude, id),
    locationNote: text(row.location_note),
    phone: text(row.phone),
    whatsapp: text(row.whatsapp),
    website: text(row.website),
    social,
    hours: text(row.hours),
    directions: text(row.directions),
    photos,
  };
}

function toCoordinates(
  latitude: number | null,
  longitude: number | null,
  id: string,
): PlaceCoordinates | undefined {
  if (latitude == null && longitude == null) return undefined;
  if (
    latitude == null ||
    longitude == null ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    throw new Error(`El lugar «${id}» tiene coordenadas incompletas.`);
  }
  return { latitude, longitude };
}

function toPhotos(rows: PhotoRow[] | null): Media[] | undefined {
  const photos = [...(rows ?? [])]
    .sort((left, right) => (left.sort_order ?? 0) - (right.sort_order ?? 0))
    .flatMap((row) => {
      const src = text(row.src);
      const alt = text(row.alt);
      if (!src || !alt) return [];
      return [
        {
          src,
          alt,
          author: text(row.author) ?? "",
          license: text(row.license) ?? "",
          licenseUrl: text(row.license_url) ?? "",
          sourceUrl: text(row.source_url) ?? "",
        },
      ];
    });
  return photos.length > 0 ? photos : undefined;
}

function toSocial(rows: LinkRow[] | null): PlaceLink[] | undefined {
  const links = [...(rows ?? [])]
    .filter((row) => row.kind === "social")
    .sort((left, right) => (left.sort_order ?? 0) - (right.sort_order ?? 0))
    .flatMap((row) => {
      const label = text(row.label);
      const href = text(row.href);
      return label && href ? [{ label, href }] : [];
    });
  return links.length > 0 ? links : undefined;
}

function text(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function requiredText(value: string | null, id: string, field: string): string {
  const trimmed = text(value);
  if (!trimmed) {
    throw new Error(`El lugar «${id}» llegó sin ${field}.`);
  }
  return trimmed;
}

function oneOf<T extends string>(
  allowed: readonly T[],
  value: string,
  id: string,
  field: string,
): T {
  if ((allowed as readonly string[]).includes(value)) {
    return value as T;
  }
  throw new Error(`El lugar «${id}» tiene un valor de ${field} no reconocido.`);
}
