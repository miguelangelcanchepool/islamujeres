import { media } from "@/lib/media";
import type { Place } from "@/lib/places/types";

/**
 * Catálogo de la fase 1. Sustituible por Supabase sin cambiar el mapa.
 *
 * Las coordenadas de lugares públicos salen de OpenStreetMap (consultadas
 * el 8 de octubre de 2026). No hay teléfonos, horarios, reseñas ni sitios
 * web: no estaban verificados y no se inventan.
 *
 * Los registros con `origin: "demostracion"` no son negocios reales.
 * El borrador permanece en el archivo para probar que no se publica.
 */
const osm = "Coordenadas tomadas de OpenStreetMap.";

export const catalog: Place[] = [
  {
    id: "playa-norte",
    name: "Playa Norte",
    category: "playas",
    visibility: "informativo",
    status: "publicado",
    origin: "editorial",
    summary: "El norte de la isla se disuelve en agua clara.",
    description:
      "La playa es ancha, la pendiente es suave y el color cambia a cada paso. Es la entrada más famosa y también el lugar donde la isla se siente más ligera.",
    coordinates: { latitude: 21.2606483, longitude: -86.750993 },
    locationNote: osm,
    directions:
      "Ocupa la orilla norte. Desde la calle Hidalgo se llega a pie en unos minutos.",
    photos: [media.playaNorte, media.aerial],
  },
  {
    id: "el-centro",
    name: "El centro",
    category: "cultura",
    visibility: "informativo",
    status: "publicado",
    origin: "editorial",
    summary: "El pueblo cabe en unas cuantas calles.",
    description:
      "La calle Hidalgo es el eje peatonal. La iglesia mira a la plaza, las fachadas se pintan sin pedir permiso y el mar vuelve a aparecer en pocos minutos. No es un distrito turístico separado del pueblo.",
    address: "Calle Hidalgo, centro de Isla Mujeres",
    coordinates: { latitude: 21.2575508, longitude: -86.7481226 },
    locationNote: `${osm} El punto cae sobre la calle Hidalgo, no en un portal.`,
    directions:
      "El centro está en el norte de la isla, inmediatamente al sur de Playa Norte.",
    photos: [media.iglesia, media.plaza, media.calles],
  },
  {
    id: "panteon",
    name: "El panteón",
    category: "cultura",
    visibility: "informativo",
    status: "publicado",
    origin: "editorial",
    summary: "El cementerio no está al margen del pueblo.",
    description:
      "Se ve entre palmas, pintado, junto a las casas del norte. En Isla Mujeres la memoria tiene calle y color, y forma parte del paisaje cotidiano.",
    coordinates: { latitude: 21.2583111, longitude: -86.7504425 },
    locationNote: `${osm} El punto es el centro del polígono de cementerio, junto a la zona de Playa Norte.`,
    directions:
      "Queda en el norte, entre el pueblo y los hoteles que miran a Playa Norte.",
    photos: [media.panteon],
  },
  {
    id: "costa-oriental",
    name: "Costa oriental",
    category: "playas",
    visibility: "informativo",
    status: "publicado",
    origin: "editorial",
    summary: "El Caribe abierto, del otro lado de la isla.",
    description:
      "Menos hamaca, más roca. El malecón acompaña este flanco y explica por qué la isla no es una sola playa. Conviene ver este lado aunque uno no se meta al agua.",
    coordinates: { latitude: 21.230767, longitude: -86.7276981 },
    locationNote: `${osm} Mirador en la zona de Payo Obispo, sobre la costa oriental.`,
    directions:
      "Se recorre de norte a sur por el lado este, a pie en el tramo del pueblo y en carrito hacia el sur.",
    photos: [media.malecon, media.mar],
  },
  {
    id: "punta-sur",
    name: "Punta Sur",
    category: "cultura",
    visibility: "informativo",
    status: "publicado",
    origin: "editorial",
    summary: "Acantilado, faro y el fin de la tierra.",
    description:
      "El parque escultórico ocupa la punta. Desde aquí el horizonte no tiene costa delante y el arrecife queda abajo, cerca.",
    coordinates: { latitude: 21.2026532, longitude: -86.7123588 },
    locationNote: osm,
    directions:
      "Está en el extremo sur. Se llega por la carretera de la isla, en carrito de golf o en taxi.",
    photos: [media.puntaSur, media.faro],
  },
  {
    id: "templo-ixchel",
    name: "Templo de Ixchel",
    category: "cultura",
    visibility: "informativo",
    status: "publicado",
    origin: "openstreetmap",
    summary: "Los vestigios del templo, en el mismo viento de Punta Sur.",
    description:
      "Un santuario maya ocupó este acantilado. Queda la huella del templo junto al faro y al parque escultórico, de cara al Caribe.",
    coordinates: { latitude: 21.202012, longitude: -86.710859 },
    locationNote: osm,
    directions: "Comparte la visita de Punta Sur: está en el extremo sur de la isla.",
  },
  {
    id: "hacienda-mundaca",
    name: "Hacienda Mundaca",
    category: "cultura",
    visibility: "informativo",
    status: "publicado",
    origin: "editorial",
    summary: "Los restos de una hacienda del siglo XIX, en el centro de la isla.",
    description:
      "La leyenda habla de un amor no correspondido. Al caminarla alcanza con entender que aquí hubo otra vida, de huertas y de silencio, antes de que el turismo le pusiera nombre de postal.",
    locationNote:
      "La ubicación precisa no está publicada en esta edición: no había un punto verificable en OpenStreetMap.",
    directions:
      "Se busca tierra adentro, al sur del pueblo, sobre la carretera que baja hacia Punta Sur.",
  },
  {
    id: "capilla-guadalupe",
    name: "Capilla de Guadalupe",
    category: "cultura",
    visibility: "informativo",
    status: "publicado",
    origin: "openstreetmap",
    summary: "Una capilla a mitad de la isla, distinta de la iglesia del pueblo.",
    description:
      "Está al sur del centro, en el camino largo de la isla. No sustituye a la parroquia de la plaza.",
    coordinates: { latitude: 21.2357209, longitude: -86.7315675 },
    locationNote: osm,
    directions: "Queda sobre la franja central de la isla, al sur del pueblo.",
  },
  {
    id: "monumento-tiburon-ballena",
    name: "Monumento al tiburón ballena",
    category: "cultura",
    visibility: "informativo",
    status: "publicado",
    origin: "openstreetmap",
    summary: "Un monumento en el camino entre el pueblo y el sur.",
    description:
      "Marca, en tierra, al animal que cada año cruza las aguas frente a la isla. La ficha no ofrece salidas ni reservas.",
    coordinates: { latitude: 21.247379, longitude: -86.7415944 },
    locationNote: osm,
    directions: "Está sobre la vía que recorre la isla hacia el sur, pasado el pueblo.",
  },
  {
    id: "terminal-ultramar",
    name: "Terminal Ultramar",
    category: "cultura",
    visibility: "informativo",
    status: "publicado",
    origin: "openstreetmap",
    summary: "El muelle donde entra y sale el ferry de pasajeros.",
    description:
      "Es la puerta práctica de la isla para quien llega desde Cancún. Conviene confirmar el horario con la naviera: aquí no se publica.",
    coordinates: { latitude: 21.2552554, longitude: -86.746526 },
    locationNote: osm,
    directions: "El muelle está en el centro, sobre la costa oeste, a unos minutos de Hidalgo.",
  },
  {
    id: "parque-de-los-suenos",
    name: "Parque de los Sueños",
    category: "playas",
    visibility: "informativo",
    status: "publicado",
    origin: "openstreetmap",
    summary: "Una playa al sur del pueblo.",
    description:
      "Aparece como playa en OpenStreetMap. El mar de este lado cambia con el viento: conviene mirarlo antes de entrar al agua.",
    coordinates: { latitude: 21.2103717, longitude: -86.7216823 },
    locationNote: osm,
    directions: "Queda al sur del centro, antes de llegar a Punta Sur.",
  },
  {
    id: "parque-garrafon",
    name: "Parque Natural Garrafón",
    category: "tours",
    visibility: "informativo",
    status: "publicado",
    origin: "openstreetmap",
    summary: "El arrecife del sur, junto a Punta Sur.",
    description:
      "Es un parque de snorkel en la costa suroeste. El acceso suele tener entrada. Esta ficha no publica precios, horarios ni reservas.",
    coordinates: { latitude: 21.2054119, longitude: -86.7169248 },
    locationNote: osm,
    directions: "Está en el sur de la isla, antes del acantilado de Punta Sur.",
  },
  {
    id: "mocambo",
    name: "Mocambo",
    category: "gastronomia",
    visibility: "informativo",
    status: "publicado",
    origin: "openstreetmap",
    summary: "Restaurante en el centro, cerca del ferry.",
    description:
      "Lugar informativo tomado de OpenStreetMap. Esta edición no publica menú, teléfono ni horario.",
    coordinates: { latitude: 21.2555751, longitude: -86.7469593 },
    locationNote: osm,
    directions: "Está en el centro, en la zona del muelle.",
  },
  {
    id: "mariscos-de-humo",
    name: "Mariscos de Humo",
    category: "gastronomia",
    visibility: "informativo",
    status: "publicado",
    origin: "openstreetmap",
    summary: "Restaurante de mariscos en el centro del pueblo.",
    description:
      "Lugar informativo tomado de OpenStreetMap. Esta edición no publica menú, teléfono ni horario.",
    coordinates: { latitude: 21.257031, longitude: -86.7469755 },
    locationNote: osm,
    directions: "Queda en el centro, a unas calles de Hidalgo.",
  },
  {
    id: "cafe-cito",
    name: "Cafe-Cito",
    category: "gastronomia",
    visibility: "informativo",
    status: "publicado",
    origin: "openstreetmap",
    summary: "Café en la zona de la calle Hidalgo.",
    description:
      "Lugar informativo tomado de OpenStreetMap. Esta edición no publica carta, teléfono ni horario.",
    coordinates: { latitude: 21.2574068, longitude: -86.7486837 },
    locationNote: osm,
    directions: "Está en el tejido peatonal del centro.",
  },
  {
    id: "neko-cafe",
    name: "Neko Cafe",
    category: "gastronomia",
    visibility: "informativo",
    status: "publicado",
    origin: "openstreetmap",
    summary: "Café a un paso de Playa Norte.",
    description:
      "Lugar informativo tomado de OpenStreetMap. Esta edición no publica carta, teléfono ni horario.",
    coordinates: { latitude: 21.2589895, longitude: -86.7507275 },
    locationNote: osm,
    directions: "Queda en el norte, entre el pueblo y la playa.",
  },
  {
    id: "ixchel-beach-hotel",
    name: "Ixchel Beach Hotel",
    category: "hoteles",
    visibility: "informativo",
    status: "publicado",
    origin: "openstreetmap",
    summary: "Hotel en el norte, frente a la zona de Playa Norte.",
    description:
      "Lugar informativo tomado de OpenStreetMap. Esta edición no publica tarifas, teléfono ni disponibilidad.",
    coordinates: { latitude: 21.259026, longitude: -86.7508703 },
    locationNote: osm,
    directions: "Está en la orilla norte, junto a Playa Norte.",
  },
  {
    id: "hotel-privilege-aluxes",
    name: "Hotel Privilege Aluxes",
    category: "hoteles",
    visibility: "informativo",
    status: "publicado",
    origin: "openstreetmap",
    summary: "Hotel en el norte de la isla.",
    description:
      "Lugar informativo tomado de OpenStreetMap. Esta edición no publica tarifas, teléfono ni disponibilidad.",
    coordinates: { latitude: 21.2578843, longitude: -86.7505739 },
    locationNote: osm,
    directions: "Queda en el norte, en la misma franja hotelera de Playa Norte.",
  },
  {
    id: "aliado-local-demo",
    name: "Aliado local de demostración",
    category: "aliados",
    visibility: "aliado",
    status: "publicado",
    origin: "demostracion",
    summary: "Ejemplo de un comercio aliado. No es un negocio real.",
    description:
      "Cuando un aliado publique su ficha, aquí aparecerán solo los datos que haya entregado. Este registro no tiene teléfono, dirección, horario ni coordenadas.",
    locationNote: "Dato de demostración. No corresponde a un local.",
  },
  {
    id: "aliado-destacado-demo",
    name: "Aliado destacado de demostración",
    category: "aliados",
    visibility: "destacado",
    status: "publicado",
    origin: "demostracion",
    summary: "Ejemplo de un aliado con mayor visibilidad. No es un negocio real.",
    description:
      "El nivel destacado distingue la ficha y, cuando existan coordenadas publicadas, también el marcador. Este ejemplo no tiene ubicación a propósito.",
    locationNote: "Dato de demostración. No corresponde a un local.",
  },
  {
    id: "borrador-demo",
    name: "Ficha en borrador",
    category: "aliados",
    visibility: "informativo",
    status: "borrador",
    origin: "demostracion",
    summary: "Registro interno. La guía pública no debe mostrarlo.",
  },
];
