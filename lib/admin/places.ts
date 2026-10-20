import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { requireAdminClient } from "@/lib/admin/session";
import { dataOrigins, publicationStatuses, type PlaceDraft } from "@/lib/admin/place-fields";
import {
  placeCategories,
  type DataOrigin,
  type PlaceCategoryId,
  type PublicationStatus,
  type VisibilityLevel,
} from "@/lib/places/types";

const visibilityLevels = ["informativo", "aliado", "destacado"] as const;

export type AdminPlaceRow = {
  id: string;
  name: string;
  category: PlaceCategoryId;
  visibility: VisibilityLevel;
  status: PublicationStatus;
};

export type AdminPlace = AdminPlaceRow & {
  slug: string;
  origin: DataOrigin;
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
};

const listColumns = "id, name, category, visibility, status";
const detailColumns = `${listColumns}, slug, origin, summary, description, address, latitude, longitude, location_note, phone, whatsapp, website, hours, directions`;

export type PlaceListFilters = {
  status?: string;
  category?: string;
};

export type PlaceSummary = {
  total: number;
  published: number;
  drafts: number;
};

export async function listAdminPlaces(
  query: string,
  filters: PlaceListFilters = {},
): Promise<AdminPlaceRow[]> {
  const { supabase } = await requireAdminClient();
  const needle = query.trim().replace(/[%_\\]/g, "");
  let request = supabase.from("places").select(listColumns).order("name", { ascending: true });
  if (needle) request = request.ilike("name", `%${needle}%`);
  if (isPublicationStatus(filters.status)) request = request.eq("status", filters.status);
  if (isPlaceCategory(filters.category)) request = request.eq("category", filters.category);

  const { data, error } = await request;
  if (error) throw new Error("No se pudieron leer los lugares.");
  return (data ?? []).map((row) => toRow(row));
}

/** Conteos de todas las fichas visibles para el administrador, sin el filtro de búsqueda. */
export async function summarizeAdminPlaces(): Promise<PlaceSummary> {
  const { supabase } = await requireAdminClient();
  const { data, error } = await supabase.from("places").select("status");
  if (error) throw new Error("No se pudieron leer los lugares.");

  const statuses = data ?? [];
  return {
    total: statuses.length,
    published: statuses.filter((row) => row.status === "publicado").length,
    drafts: statuses.filter((row) => row.status === "borrador").length,
  };
}

export async function getAdminPlace(id: string): Promise<AdminPlace | null> {
  const { supabase } = await requireAdminClient();
  const { data, error } = await supabase
    .from("places")
    .select(detailColumns)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error("No se pudo leer el lugar.");
  if (!data) return null;
  return toPlace(data);
}

export function toDraft(place: AdminPlace): PlaceDraft {
  return {
    slug: place.slug,
    name: place.name,
    category: place.category,
    visibility: place.visibility,
    status: place.status,
    origin: place.origin,
    summary: place.summary,
    description: place.description ?? "",
    address: place.address ?? "",
    latitude: place.latitude == null ? "" : String(place.latitude),
    longitude: place.longitude == null ? "" : String(place.longitude),
    locationNote: place.location_note ?? "",
    phone: place.phone ?? "",
    whatsapp: place.whatsapp ?? "",
    website: place.website ?? "",
    hours: place.hours ?? "",
    directions: place.directions ?? "",
  };
}

export function saveError(error: { code?: string }): string {
  if (error.code === "23505") return "Ya existe un lugar con ese identificador.";
  if (error.code === "23514") return "Revisa las coordenadas y el origen del lugar.";
  if (error.code === "42501") return "No tienes permiso para modificar lugares.";
  return "No se pudo guardar el lugar.";
}

export async function deleteAdminPlace(supabase: SupabaseClient, id: string) {
  return supabase.from("places").delete().eq("id", id).select("id");
}

function toRow(row: Record<string, unknown>): AdminPlaceRow {
  return {
    id: requiredString(row.id),
    name: requiredString(row.name),
    category: oneOf(placeCategories, row.category),
    visibility: oneOf(visibilityLevels, row.visibility),
    status: oneOf(publicationStatuses, row.status),
  };
}

function toPlace(row: Record<string, unknown>): AdminPlace {
  return {
    ...toRow(row),
    slug: requiredString(row.slug),
    origin: oneOf(dataOrigins, row.origin),
    summary: requiredString(row.summary),
    description: optionalString(row.description),
    address: optionalString(row.address),
    latitude: optionalNumber(row.latitude),
    longitude: optionalNumber(row.longitude),
    location_note: optionalString(row.location_note),
    phone: optionalString(row.phone),
    whatsapp: optionalString(row.whatsapp),
    website: optionalString(row.website),
    hours: optionalString(row.hours),
    directions: optionalString(row.directions),
  };
}

function requiredString(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Un lugar llegó incompleto.");
  }
  return value;
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function optionalNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function isPublicationStatus(value: string | undefined): value is PublicationStatus {
  return publicationStatuses.some((status) => status === value);
}

function isPlaceCategory(value: string | undefined): value is PlaceCategoryId {
  return placeCategories.some((category) => category === value);
}

function oneOf<T extends string>(allowed: readonly T[], value: unknown): T {
  if (typeof value === "string" && (allowed as readonly string[]).includes(value)) {
    return value as T;
  }
  throw new Error("Un lugar tiene un valor no reconocido.");
}
