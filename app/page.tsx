import Link from "next/link";
import { IslandSilhouette } from "@/components/IslandSilhouette";
import { Photo } from "@/components/Photo";
import { media } from "@/lib/media";

const gates = [
  {
    href: "/la-isla",
    index: "02",
    title: "La isla",
    text: "Un santuario maya, un nombre de 1517 y un pueblo que todavía se recorre a pie.",
    image: media.casa,
  },
  {
    href: "/el-mar",
    index: "03",
    title: "El mar",
    text: "Dos aguas en siete kilómetros: la bahía mansa y el Caribe que golpea al oriente.",
    image: media.mar,
  },
  {
    href: "/lugares",
    index: "04",
    title: "Lugares",
    text: "Playa Norte, el centro, Punta Sur y la costa que no cabe en una sola postal.",
    image: media.iglesia,
  },
  {
    href: "/la-mesa",
    index: "05",
    title: "La mesa",
    text: "Pescado del día, cocina de la península y lo que se come sin ceremonia.",
    image: media.comida,
  },
  {
    href: "/vivirla",
    index: "06",
    title: "Vivirla",
    text: "Un día entero, de la primera luz al oeste dorado.",
    image: media.plaza,
  },
];

const marks = [
  { name: "Playa Norte", note: "Agua que se camina" },
  { name: "Centro", note: "Plaza, iglesia, calles cortas" },
  { name: "Bahía", note: "El lado manso, de cara a Cancún" },
  { name: "Costa oriental", note: "El Caribe de frente" },
  { name: "Punta Sur", note: "Acantilado y templo de Ixchel" },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: "Isla Mujeres",
    description:
      "Isla del Caribe mexicano, en Quintana Roo, frente a Cancún. Guía de descubrimiento.",
    touristType: "Descubrimiento",
    geo: {
      "@type": "GeoCoordinates",
      latitude: 21.232,
      longitude: -86.731,
    },
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: "Quintana Roo, México",
    },
  };

  return (
    <main id="contenido">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="hero">
        <Photo image={media.aerial} priority credit="top" sizes="100vw" />
        <div className="hero-shade" />
        <p className="hero-edge">Caribe · 21° N</p>
        <div className="hero-copy">
          <p className="eyebrow">Quintana Roo · México</p>
          <h1 className="hero-title">
            Isla
            <em>Mujeres</em>
          </h1>
          <p className="hero-lead">
            Una guía para conocer la isla. El mar cambia de color antes de que
            termine la calle.
          </p>
        </div>
        <dl className="hero-meta">
          <div>
            <dt>Largo</dt>
            <dd>7 km</dd>
          </div>
          <div>
            <dt>Ancho</dt>
            <dd>500 m</dd>
          </div>
          <div>
            <dt>De Cancún</dt>
            <dd>6 km</dd>
          </div>
        </dl>
      </section>

      <section className="manifesto">
        <p className="watermark" aria-hidden="true">
          Mujeres
        </p>
        <p className="chapter-kicker">01 — La invitación</p>
        <h2>Entrar es cambiar de ritmo.</h2>
        <div className="manifesto-grid">
          <p className="lede">
            Isla Mujeres aparece baja, larga y verde cuando el ferry deja la
            costa. No empieza en un mostrador. Empieza en el agua.
          </p>
          <div>
            <p>
              Esta guía existe para que la isla se entienda antes de
              consumirse: qué es, de dónde viene su nombre, cómo cambia el mar
              de un lado al otro y cómo cabe un día entero en siete kilómetros.
            </p>
            <p>
              No es una plataforma de reservas. Es una manera de entrar.
            </p>
          </div>
        </div>
      </section>

      <section className="measure">
        <div className="measure-copy">
          <p className="chapter-kicker">La medida</p>
          <h2>Una isla que se aprende de norte a sur.</h2>
          <p>
            Está en el Caribe mexicano, al noreste de Cancún. Se llega en
            ferry —el cruce breve sale de Puerto Juárez— y se recorre, sobre
            todo, a pie o en carrito de golf.
          </p>
          <ul className="stats">
            <li>
              <b>7 km</b>
              <span>de largo</span>
            </li>
            <li>
              <b>500 m</b>
              <span>en lo más angosto</span>
            </li>
            <li>
              <b>6 km</b>
              <span>de tierra firme</span>
            </li>
          </ul>
        </div>
        <div className="atlas">
          <IslandSilhouette />
          <ol className="atlas-marks">
            {marks.map((mark) => (
              <li key={mark.name}>
                <strong>{mark.name}</strong>
                <span>{mark.note}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="gates" aria-label="Capítulos">
        {gates.map((gate) => (
          <Link
            key={gate.href}
            href={gate.href}
            className="gate"
            aria-label={`${gate.index}. ${gate.title}. ${gate.text}`}
          >
            <div className="gate-photo">
              <Photo
                image={gate.image}
                sizes="(max-width: 800px) 100vw, 58vw"
              />
            </div>
            <div className="gate-copy">
              <p className="chapter-kicker">{gate.index}</p>
              <h2>{gate.title}</h2>
              <p>{gate.text}</p>
              <span className="link-arrow">Entrar</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="close-band">
        <p className="chapter-kicker">Para empezar</p>
        <h2>La isla cabe en una mirada larga.</h2>
        <p>
          Si solo hay tiempo para un capítulo, que sea un día completo. El
          resto de la guía espera donde el mar cambia de lado.
        </p>
        <Link href="/vivirla" className="link-arrow">
          Recorrer un día
        </Link>
      </section>
    </main>
  );
}
