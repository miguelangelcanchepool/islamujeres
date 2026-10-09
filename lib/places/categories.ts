import type { PlaceCategoryId, VisibilityLevel } from "@/lib/places/types";

export const categoryLabel: Record<PlaceCategoryId, string> = {
  playas: "Playas y naturaleza",
  cultura: "Cultura y lugares de interés",
  gastronomia: "Gastronomía",
  hoteles: "Hoteles",
  tours: "Tours y experiencias",
  aliados: "Aliados locales",
};

export const visibilityLabel: Record<VisibilityLevel, string> = {
  informativo: "Lugar informativo",
  aliado: "Aliado local",
  destacado: "Aliado destacado",
};
