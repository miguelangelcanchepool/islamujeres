import type { Metadata } from "next";
import { Photo } from "@/components/Photo";
import { media } from "@/lib/media";

export const metadata: Metadata = {
  title: "Vivirla",
  description:
    "Un día en Isla Mujeres, del amanecer en el oriente al atardecer sobre la bahía.",
};

export default function VivirlaPage() {
  return (
    <main id="contenido">
      <header className="text-hero">
        <p className="eyebrow">06 — Vivirla</p>
        <h1>Un día, si la isla se recorre para conocerla.</h1>
        <p className="hero-lead">
          No es un itinerario de compra. Es el ritmo que la geografía ya trae
          escrito.
        </p>
      </header>

      <section className="day">
        <article className="hour">
          <h2>Amanecer</h2>
          <p>
            Punta Sur, o cualquier tramo del oriente donde el cielo se abra.
            El pueblo todavía no pide nada. En la isla se dice que por el sur
            entran algunos de los primeros rayos del país. Aunque la frase sea
            una costumbre, el viento de esa hora es real.
          </p>
        </article>

        <div className="day-photo">
          <Photo image={media.puntaSur} sizes="100vw" priority />
        </div>

        <article className="hour">
          <h2>Mañana</h2>
          <p>
            Playa Norte. Entrar hasta donde todavía se hace pie y quedarse más
            de lo que parece razonable. El norte es la versión más clara de la
            isla: poca profundidad, mucha luz, el pueblo a la espalda.
          </p>
        </article>

        <div className="day-photo">
          <Photo image={media.playaNorte} sizes="100vw" />
        </div>

        <article className="hour">
          <h2>Mediodía</h2>
          <p>
            El centro. Sombra, la plaza, algo de comer. Conviene mirar cómo se
            mueve quien vive aquí, no solo quien bajó del primer ferry. La
            iglesia, una calle pintada y una mesa alcanzan.
          </p>
        </article>

        <article className="hour">
          <h2>Tarde</h2>
          <p>
            Un carrito de golf hacia el sur. Es el vehículo de la isla: lento,
            abierto, un poco absurdo y perfectamente adecuado. En el camino la
            costa cambia de lado y de carácter. La Tortugranja y el arrecife
            pertenecen a esta mitad del día, si el cuerpo todavía quiere agua.
          </p>
        </article>

        <div className="day-photo day-photo-pair">
          <Photo image={media.calles} sizes="(max-width: 800px) 100vw, 50vw" />
          <Photo image={media.casa} sizes="(max-width: 800px) 100vw, 50vw" />
        </div>

        <article className="hour">
          <h2>Atardecer</h2>
          <p>
            El oeste. La bahía se dora y Cancún queda como una línea lejana.
            Por unas horas la isla vuelve a sentirse aparte, que es su
            condición verdadera: cerca de todo y, aun así, al otro lado del
            agua.
          </p>
        </article>

        <div className="day-photo">
          <Photo image={media.plaza} sizes="100vw" />
        </div>

        <article className="hour">
          <h2>Noche</h2>
          <p>
            Corta, si se quiere. Las calles del centro se encienden sin
            volverse otra ciudad. Mañana el mar sigue en el mismo lugar. Esa
            repetición es el lujo de una isla de siete kilómetros.
          </p>
        </article>
      </section>
    </main>
  );
}
