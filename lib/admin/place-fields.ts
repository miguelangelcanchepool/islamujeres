import {
  placeCategories,
  type DataOrigin,
  type PlaceCategoryId,
  type PublicationStatus,
  type VisibilityLevel,
} from "@/lib/places/types";

export const publicationStatuses = ["borrador", "publicado", "inactivo"] as const;
export const dataOrigins = ["editorial", "openstreetmap", "demostracion"] as const;

export const statusLabel: Record<PublicationStatus, string> = {
  borrador: "Borrador",
  publicado: "Publicado",
  inactivo: "Inactivo",
};

export const originLabel: Record<DataOrigin, string> = {
  editorial: "Editorial",
  openstreetmap: "OpenStreetMap",
  demostracion: "Demostración",
};

export type PlaceDraft = {
  slug: string;
  name: string;
  category: PlaceCategoryId;
  visibility: VisibilityLevel;
  status: PublicationStatus;
  origin: DataOrigin;
  summary: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  locationNote: string;
  phone: string;
  whatsapp: string;
  website: string;
  hours: string;
  directions: string;
};

export const emptyPlaceDraft: PlaceDraft = {
  slug: "",
  name: "",
  category: "cultura",
  visibility: "informativo",
  status: "borrador",
  origin: "editorial",
  summary: "",
  description: "",
  address: "",
  latitude: "",
  longitude: "",
  locationNote: "",
  phone: "",
  whatsapp: "",
  website: "",
  hours: "",
  directions: "",
};

export type PlaceField = keyof PlaceDraft;

export type PlaceFormState = {
  error?: string;
  fields?: Partial<Record<PlaceField, string>>;
} | null;

export type PlaceWrite = {
  slug: string;
  name: string;
  category: PlaceCategoryId;
  visibility: VisibilityLevel;
  status: PublicationStatus;
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

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parsePlaceForm(
  formData: FormData,
): { ok: true; value: PlaceWrite } | { ok: false; state: PlaceFormState } {
  const fields: Partial<Record<PlaceField, string>> = {};
  const name = read(formData, "name");
  const slug = read(formData, "slug").toLowerCase();
  const summary = read(formData, "summary");
  const category = read(formData, "category");
  const visibility = read(formData, "visibility");
  const status = read(formData, "status");
  const origin = read(formData, "origin");

  if (!name) fields.name = "Escribe el nombre.";
  if (!slug) fields.slug = "Escribe el identificador.";
  else if (!slugPattern.test(slug)) {
    fields.slug = "Usa minúsculas, números y guiones. Por ejemplo: playa-norte.";
  }
  if (!summary) fields.summary = "Escribe el resumen.";
  if (!oneOf(placeCategories, category)) fields.category = "Elige una categoría.";
  if (!oneOf(["informativo", "aliado", "destacado"] as const, visibility)) {
    fields.visibility = "Elige la visibilidad.";
  }
  if (!oneOf(publicationStatuses, status)) fields.status = "Elige el estado.";
  if (!oneOf(dataOrigins, origin)) fields.origin = "Elige el origen.";

  const latitude = parseCoordinate(read(formData, "latitude"), 90);
  const longitude = parseCoordinate(read(formData, "longitude"), 180);
  if (latitude === "invalid") fields.latitude = "Escribe una latitud válida, entre -90 y 90.";
  if (longitude === "invalid") fields.longitude = "Escribe una longitud válida, entre -180 y 180.";
  if (latitude !== "invalid" && longitude !== "invalid") {
    if ((latitude == null) !== (longitude == null)) {
      const message = "La latitud y la longitud deben ir juntas, o dejarse vacías.";
      fields.latitude = message;
      fields.longitude = message;
    }
  }

  if (Object.keys(fields).length > 0) {
    return { ok: false, state: { error: "Revisa los campos marcados.", fields } };
  }

  return {
    ok: true,
    value: {
      slug,
      name,
      category: category as PlaceCategoryId,
      visibility: visibility as VisibilityLevel,
      status: status as PublicationStatus,
      origin: origin as DataOrigin,
      summary,
      description: optional(formData, "description"),
      address: optional(formData, "address"),
      latitude: latitude as number | null,
      longitude: longitude as number | null,
      location_note: optional(formData, "locationNote"),
      phone: optional(formData, "phone"),
      whatsapp: optional(formData, "whatsapp"),
      website: optional(formData, "website"),
      hours: optional(formData, "hours"),
      directions: optional(formData, "directions"),
    },
  };
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function read(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optional(formData: FormData, key: string): string | null {
  const value = read(formData, key);
  return value ? value : null;
}

function oneOf<T extends string>(allowed: readonly T[], value: string): value is T {
  return (allowed as readonly string[]).includes(value);
}

function parseCoordinate(value: string, limit: number): number | null | "invalid" {
  if (!value) return null;
  const normalized =
    value.includes(",") && !value.includes(".") ? value.replace(",", ".") : value;
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return "invalid";
  const number = Number(normalized);
  if (!Number.isFinite(number) || number < -limit || number > limit) return "invalid";
  return number;
}
