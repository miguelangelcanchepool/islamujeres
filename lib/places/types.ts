import type { Media } from "@/lib/media";

export const placeCategories = [
  "playas",
  "cultura",
  "gastronomia",
  "hoteles",
  "tours",
  "aliados",
] as const;

export type PlaceCategoryId = (typeof placeCategories)[number];

/** Nivel de visibilidad de un lugar o aliado. */
export type VisibilityLevel = "informativo" | "aliado" | "destacado";

/** Solo `publicado` llega a la guía. */
export type PublicationStatus = "borrador" | "publicado" | "inactivo";

/**
 * `demostracion` identifica registros de ejemplo.
 * No deben tratarse como comercios reales.
 */
export type DataOrigin = "editorial" | "openstreetmap" | "demostracion";

export type PlaceCoordinates = {
  latitude: number;
  longitude: number;
};

export type PlaceLink = {
  label: string;
  href: string;
};

export type Place = {
  id: string;
  name: string;
  category: PlaceCategoryId;
  visibility: VisibilityLevel;
  status: PublicationStatus;
  origin: DataOrigin;
  summary: string;
  description?: string;
  address?: string;
  coordinates?: PlaceCoordinates;
  /** Texto sobre el origen de la ubicación. No sustituye a la dirección. */
  locationNote?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  social?: PlaceLink[];
  hours?: string;
  directions?: string;
  photos?: Media[];
};

export type PlaceFilter = "todos" | PlaceCategoryId;

/** Campos que cada categoría puede mostrar, además del nombre y la fotografía. */
export const categoryDetailFields = {
  playas: ["description", "directions", "coordinates"],
  cultura: ["description", "address", "hours", "directions", "coordinates"],
  gastronomia: [
    "description",
    "address",
    "hours",
    "phone",
    "whatsapp",
    "website",
    "social",
    "directions",
    "coordinates",
  ],
  hoteles: [
    "description",
    "address",
    "hours",
    "phone",
    "website",
    "directions",
    "coordinates",
  ],
  tours: [
    "description",
    "address",
    "hours",
    "phone",
    "website",
    "directions",
    "coordinates",
  ],
  aliados: [
    "description",
    "address",
    "hours",
    "phone",
    "whatsapp",
    "website",
    "social",
    "directions",
    "coordinates",
  ],
} as const satisfies Record<PlaceCategoryId, readonly string[]>;

export type PlaceDetailField = (typeof categoryDetailFields)[PlaceCategoryId][number];
