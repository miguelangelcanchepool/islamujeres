import type { Metadata } from "next";
import { ChapterHero } from "@/components/ChapterHero";
import { Photo } from "@/components/Photo";
import { media } from "@/lib/media";

export const metadata: Metadata = {
  title: "La isla",
  description:
    "Qué es Isla Mujeres, dónde está y de dónde viene su nombre: Ixchel, 1517 y un pueblo de escala humana.",
};

const times = [
  {
    year: "Antes",
    title: "Santuario",
    text: "La isla estaba consagrada a Ixchel, diosa maya de la Luna, la fertilidad y la medicina. En la punta sur hubo un templo. Las mujeres mayas peregrinaban hasta aquí.",
  },
  {
    year: "1517",
    title: "El nombre",
    text: "La expedición de Francisco Hernández de Córdoba encontró figuras femeninas. Por ellas, el lugar quedó como Isla Mujeres. Diego de Landa dejó después constancia del templo y de esas imágenes.",
  },
  {
    year: "Siglo XIX",
    title: "Pueblo",
    text: "Creció una población de pescadores. De esa época quedan los vestigios de la hacienda Vista Alegre, conocida como Hacienda Mundaca, asociada a Fermín Antonio Mundaca. La leyenda dice que la levantó por un amor que no le fue devuelto.",
  },
  {
    year: "Después",
    title: "Al lado de Cancún",
    text: "Cuando la costa de enfrente se volvió una de las más visitadas del mundo, la isla quedó a un cruce corto. Conservó calles cortas, una plaza y una vida que todavía cabe en una caminata.",
  },
];

export default function LaIslaPage() {
  return (
    <main id="contenido">
      <ChapterHero
        index="02 — La isla"
        title="Una tierra estrecha con memoria larga."
        lede="Municipio de Quintana Roo, santuario antiguo y pueblo de pescadores a seis kilómetros de Cancún."
        image={media.casa}
      />

      <article className="essay">
        <div className="essay-grid">
          <p className="lede">
            Isla Mujeres es pequeña en el mapa y antigua en el relato. Antes de
            los carritos y de los hoteles, ya era un destino: no de vacaciones,
            de peregrinación.
          </p>
          <div>
            <p>
              Mide unos siete kilómetros de largo y cerca de quinientos metros
              en su parte más angosta. El oeste mira a la bahía y a Cancún. El
              este recibe el Caribe sin protección. Esa diferencia, más que
              cualquier eslogan, organiza la isla.
            </p>
            <p>
              El pueblo sigue teniendo escala de pueblo. La iglesia de la
              Inmaculada Concepción da a la plaza. Las casas se pintan de
              turquesa, coral y blanco. El panteón no está escondido: se ve
              entre palmas, de colores, pegado a la vida de la calle.
            </p>
          </div>
        </div>
        <p className="pull">
          El nombre no es un adorno. Es el recuerdo de unas figuras, y de una
          diosa, en el extremo de la tierra.
        </p>
      </article>

      <section className="timeline-wrap">
        <div className="section-intro">
          <p className="chapter-kicker">Historia</p>
          <h2>Cuatro tiempos, una sola orilla.</h2>
        </div>
        <ol className="timeline">
          {times.map((item) => (
            <li key={item.year} className="time">
              <p className="time-year">{item.year}</p>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mosaic" aria-label="El pueblo">
        <Photo
          image={media.iglesia}
          className="span-tall"
          sizes="(max-width: 800px) 100vw, 55vw"
        />
        <Photo image={media.calles} sizes="(max-width: 800px) 100vw, 40vw" />
        <Photo image={media.panteon} sizes="(max-width: 800px) 100vw, 40vw" />
      </section>
    </main>
  );
}
