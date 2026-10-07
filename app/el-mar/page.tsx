import type { Metadata } from "next";
import { ChapterHero } from "@/components/ChapterHero";
import { Photo } from "@/components/Photo";
import { media } from "@/lib/media";

export const metadata: Metadata = {
  title: "El mar",
  description:
    "Los dos mares de Isla Mujeres: la bahía mansa, la costa oriental, el arrecife, las tortugas y la temporada del tiburón ballena.",
};

const lexicon = [
  {
    term: "La bahía",
    text: "Al oeste el agua baja, se aclara y deja ver la arena. Se camina mar adentro y el turquesa sigue siendo poco profundo. De ese lado la isla se siente ligera.",
  },
  {
    term: "El oriente",
    text: "La costa este recibe el Caribe de frente. Hay roca, oleaje y un malecón para acompañar el mar sin pedirle calma. Es el otro carácter de la misma isla.",
  },
  {
    term: "Garrafón",
    text: "En el sur el arrecife se acerca a la superficie. El fondo se deja mirar. Estas aguas forman parte del Sistema Arrecifal Mesoamericano, la gran barrera del Caribe occidental.",
  },
  {
    term: "Punta Sur",
    text: "Aquí termina la tierra y la isla alcanza su punto más alto, apenas unos veinte metros sobre el mar. Quedan el acantilado, el faro y la memoria del templo de Ixchel. En la isla se cuenta que por esta punta entran algunos de los primeros rayos del día.",
  },
  {
    term: "Tortugas",
    text: "La Tortugranja es un centro dedicado a la tortuga marina: cuida huevos y acompaña a las crías hasta devolverlas al agua. No es un espectáculo. Es una orilla que todavía trabaja con el ciclo del mar.",
  },
  {
    term: "Contoy",
    text: "Al norte, Isla Contoy es parque nacional: aves, mangle y una isla que se visita sin quedarse a vivir en ella. Se alcanza en barco desde Isla Mujeres.",
  },
  {
    term: "El ballena",
    text: "Entre mayo y septiembre, en las aguas de esta costa, aparece el tiburón ballena. No está siempre. Es una temporada, y es un animal salvaje. La isla es uno de los lugares desde donde se sale a encontrarlo.",
  },
];

export default function ElMarPage() {
  return (
    <main id="contenido">
      <ChapterHero
        index="03 — El mar"
        title="Dos mares, una isla estrecha."
        lede="Al oeste se hace pie. Al este el Caribe no pide permiso."
        image={media.mar}
      />

      <section className="sea-intro">
        <p className="lede">
          Quien recuerda Isla Mujeres suele recordar un color. Ese color no es
          uno solo. Cambia con el lado, con la hora y con la profundidad.
        </p>
      </section>

      <section className="sea-band">
        <Photo
          image={media.playaNorte}
          sizes="100vw"
          className="focus-center"
        />
        <div className="hero-shade" />
        <div className="sea-band-copy">
          <p className="chapter-kicker">Norte</p>
          <h2>El agua en la que todavía se camina.</h2>
        </div>
      </section>

      <section className="sea-band">
        <Photo image={media.caleta} sizes="100vw" />
        <div className="hero-shade" />
        <div className="sea-band-copy">
          <p className="chapter-kicker">Poniente</p>
          <h2>La bahía guarda el turquesa cerca de la arena.</h2>
        </div>
      </section>

      <section className="sea-band">
        <Photo image={media.puntaSur} sizes="100vw" className="focus-top" />
        <div className="hero-shade" />
        <div className="sea-band-copy">
          <p className="chapter-kicker">Sur</p>
          <h2>Donde la isla se acaba, empieza el arrecife.</h2>
        </div>
      </section>

      <section className="lexicon-wrap">
        <div className="section-intro">
          <p className="chapter-kicker">Nombres del agua</p>
          <h2>El mar de esta isla tiene vocablos propios.</h2>
        </div>
        <dl className="lexicon">
          {lexicon.map((item) => (
            <div key={item.term}>
              <dt>{item.term}</dt>
              <dd>{item.text}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
