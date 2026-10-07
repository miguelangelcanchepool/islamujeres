export type Media = {
  src: string;
  alt: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
};

export const media = {
  aerial: {
    src: "/media/aerial.jpg",
    alt: "Vista aérea de Playa Norte: agua turquesa, arena clara y el pueblo al fondo",
    author: "dronepicr",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Mexican_island_Isla_Mujeres_(42882051294).jpg",
  },
  mar: {
    src: "/media/mar.jpg",
    alt: "Acantilado de la costa oriental y el Caribe pasando del turquesa al azul profundo",
    author: "Isabel A01706197",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Isla_Mujeres_mar.jpg",
  },
  puntaSur: {
    src: "/media/punta-sur.jpg",
    alt: "Roca de Punta Sur, con el oleaje del Caribe entrando entre el arrecife",
    author: "Suwanosejima",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Punta_Sur,_Isla_Mujeres,_Quintana_Roo.jpg",
  },
  playaNorte: {
    src: "/media/playa-norte-wide.jpg",
    alt: "Playa Norte, una franja de agua clara con palmeras al fondo",
    author: "Bernard DUPONT",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Playa_Norte,_Isla_Mujeres_QR_2020_01.jpg",
  },
  caleta: {
    src: "/media/caleta.jpg",
    alt: "Agua baja y transparente junto a la arena, en una caleta de la isla",
    author: "Bernard DUPONT",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Hermosa_Caleta_beach_Isla_Mujeres_QR_01.jpg",
  },
  iglesia: {
    src: "/media/iglesia.jpg",
    alt: "Iglesia de la Inmaculada Concepción, blanca, entre palmeras",
    author: "Larry D. Moore",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Church_of_the_Immaculate_Conception_Isla_Mujeres_2017.jpg",
  },
  plaza: {
    src: "/media/plaza.jpg",
    alt: "Plaza del pueblo al amanecer, con palmeras y luz baja",
    author: "Larry D. Moore",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Town_Square_Isla_Mujeres_Morning_2022.jpg",
  },
  calles: {
    src: "/media/calles.jpg",
    alt: "Calle del centro, con casas bajas, plantas y sombra de mediodía",
    author: "diaper",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Walking_back_streets_of_Isla_Mujeres.jpg",
  },
  casa: {
    src: "/media/casa.jpg",
    alt: "Casa del pueblo pintada de coral y turquesa, con un sol en la fachada",
    author: "diaper",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Isla_Mujeres_home.jpg",
  },
  malecon: {
    src: "/media/malecon.jpg",
    alt: "Malecón de la costa oriental, de cara al Caribe abierto",
    author: "Rayttc",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Malec%C3%B3n_Isla_Mujeres_1.jpg",
  },
  faro: {
    src: "/media/faro.jpg",
    alt: "Faro blanco de Punta Sur contra el cielo",
    author: "Bernard DUPONT",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Punta_Sur_Lighthouse,_Isla_Mujeres.jpg",
  },
  panteon: {
    src: "/media/desde-hotel.jpg",
    alt: "El panteón del pueblo, de colores, entre palmas y casas",
    author: "Larry D. Moore",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Isla_Mujeres_from_the_Ixchel_Beach_Hotel.jpg",
  },
  comida: {
    src: "/media/comida.jpg",
    alt: "Comida de mediodía sobre una mesa de madera: torta, taco y salsas",
    author: "Bernard DUPONT",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Street_Food,_Isla_Mujeres_-_Yummie_!!!.jpg",
  },
} as const satisfies Record<string, Media>;

export const mediaList = Object.values(media);
