import { catalog } from "@/lib/places/catalog";
import type { Place } from "@/lib/places/types";

/**
 * Fuente actual de la guía: el catálogo local de `catalog.ts`.
 *
 * No hay cliente de Supabase en esta fase. Cuando exista, esta función
 * puede volverse async y leer solo filas con `status = publicado`,
 * respetando las políticas de acceso. El mapa y las fichas no deben
 * importar el catálogo directamente.
 */
export function getPublishedPlaces(): Place[] {
  return catalog
    .filter((place) => place.status === "publicado")
    .sort((a, b) => {
      const left = a.coordinates?.latitude ?? Number.NEGATIVE_INFINITY;
      const right = b.coordinates?.latitude ?? Number.NEGATIVE_INFINITY;
      return right - left;
    });
}
