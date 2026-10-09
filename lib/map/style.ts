/**
 * OpenFreeMap sirve estilos de MapLibre sin clave.
 * La atribución viaja en el estilo y MapLibre la muestra.
 * @see https://openfreemap.org/
 */
export const mapStyleUrl =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL ??
  "https://tiles.openfreemap.org/styles/fiord";

export const islandCenter: [number, number] = [-86.731, 21.232];

/** Margen alrededor de la isla para poder desplazarse sin perder el Caribe. */
export const islandMaxBounds: [[number, number], [number, number]] = [
  [-86.92, 21.1],
  [-86.58, 21.38],
];
