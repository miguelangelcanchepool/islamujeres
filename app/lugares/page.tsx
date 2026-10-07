import type { Metadata } from "next";
import { Photo } from "@/components/Photo";
import { media, type Media } from "@/lib/media";

export const metadata: Metadata = {
  title: "Lugares",
  description:
    "Playa Norte, el centro, Punta Sur, la costa oriental, el panteón y Hacienda Mundaca: los lugares que explican Isla Mujeres.",
};

const places: {
  title: string;
  kicker: string;
  text: string;
  image?: Media;
  tone: string;
  focus?: string;
}[] = [
  {
    title: "Playa Norte",
    kicker: "El umbral",
    text: "El norte de la isla se disuelve en agua clara. La playa es ancha, la pendiente es suave y el color cambia a cada paso. Es la entrada más famosa y también el lugar donde la isla se siente más ligera.",
    image: media.aerial,
    tone: "tone-shell",
  },
  {
    title: "El centro",
    kicker: "Escala de pueblo",
    text: "Cabe en unas cuantas calles. La iglesia mira a la plaza, las fachadas se pintan sin pedir permiso y el mar vuelve a aparecer en pocos minutos. No es un distrito turístico separado del pueblo. Es el pueblo.",
    image: media.iglesia,
    tone: "tone-deep",
  },
  {
    title: "Punta Sur",
    kicker: "El fin de la tierra",
    text: "Acantilado, faro y los vestigios del templo de Ixchel comparten el mismo viento. Desde aquí el horizonte no tiene costa delante. El arrecife queda abajo, cerca.",
    image: media.faro,
    tone: "tone-palm",
    focus: "focus-top",
  },
  {
    title: "Costa oriental",
    kicker: "El otro carácter",
    text: "Menos hamaca, más roca. El malecón acompaña el Caribe abierto y explica por qué la isla no es una sola playa. Conviene ver este lado aunque uno no se meta al agua.",
    image: media.malecon,
    tone: "tone-sand",
    focus: "focus-left",
  },
  {
    title: "El panteón",
    kicker: "El pueblo, también aquí",
    text: "El cementerio no está al margen. Se ve entre palmas, pintado, junto a las casas. En Isla Mujeres la memoria tiene calle y color, y forma parte del paisaje cotidiano.",
    image: media.panteon,
    tone: "tone-deep",
  },
  {
    title: "Hacienda Mundaca",
    kicker: "Vista Alegre",
    text: "En el centro de la isla quedan los restos de una hacienda del siglo XIX. La leyenda habla de un amor no correspondido. Al caminarla alcanza con entender que aquí hubo otra vida, de huertas y de silencio, antes de que el turismo le pusiera nombre de postal.",
    tone: "tone-shell",
  },
];

export default function LugaresPage() {
  return (
    <main id="contenido">
      <header className="text-hero">
        <p className="eyebrow">04 — Lugares</p>
        <h1>Seis maneras de leer la isla.</h1>
        <p className="hero-lead">
          No es un directorio. Es una secuencia: del agua más clara al recuerdo
          más quieto.
        </p>
      </header>

      {places.map((place, index) => (
        <article
          key={place.title}
          className={`place ${place.tone}${index % 2 === 1 ? " is-flip" : ""}`}
        >
          {place.image ? (
            <div className="place-photo">
              <Photo
                image={place.image}
                className={place.focus ?? ""}
                sizes="(max-width: 800px) 100vw, 62vw"
                priority={index === 0}
              />
            </div>
          ) : (
            <div className="place-mark" aria-hidden="true">
              <span>Vista Alegre</span>
            </div>
          )}
          <div className="place-copy">
            <p className="chapter-kicker">
              {String(index + 1).padStart(2, "0")} — {place.kicker}
            </p>
            <h2>{place.title}</h2>
            <p>{place.text}</p>
          </div>
        </article>
      ))}
    </main>
  );
}
