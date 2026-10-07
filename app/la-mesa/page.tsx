import type { Metadata } from "next";
import { Photo } from "@/components/Photo";
import { media } from "@/lib/media";

export const metadata: Metadata = {
  title: "La mesa",
  description:
    "La comida de Isla Mujeres: pescado del día, cocina yucateca y la mesa sin ceremonia.",
};

const dishes = [
  {
    name: "El pescado",
    note: "Frito, al ajillo o abierto al fuego. El día decide.",
  },
  {
    name: "El ceviche",
    note: "Limón, chile y el mar de esa mañana.",
  },
  {
    name: "La tikinxic",
    note: "Pescado de esta costa, con achiote y plátano de hoja. Un modo yucateco de asarlo.",
  },
  {
    name: "La península",
    note: "Cochinita, panuchos, salbutes, sopa de lima. El recado también cruzó el agua.",
  },
  {
    name: "La langosta",
    note: "Tiene temporada. El resto del año no hace falta inventarla.",
  },
  {
    name: "Al paso",
    note: "Elote, marquesita, agua de chaya o de jamaica. La calle también alimenta.",
  },
];

export default function LaMesaPage() {
  return (
    <main id="contenido" className="mesa">
      <header className="text-hero tone-night">
        <p className="eyebrow">05 — La mesa</p>
        <h1>Se come como en una isla de pescadores que aprendió la península.</h1>
      </header>

      <section className="menu-block">
        <p className="lede">
          No hace falta una lista de restaurantes para entender la mesa. Hace
          falta sentarse donde se sienta el pueblo y pedir lo que el mar dio
          ese día.
        </p>
        <ul className="menu-list">
          {dishes.map((dish) => (
            <li key={dish.name}>
              <span className="menu-name">{dish.name}</span>
              <span className="menu-rule" aria-hidden="true" />
              <span className="menu-note">{dish.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="plate">
        <div className="plate-frame">
          <Photo image={media.comida} sizes="(max-width: 800px) 100vw, 80vw" />
        </div>
        <p className="plate-caption">
          Mediodía. La mesa de la isla no necesita mantel largo para ser
          exacta.
        </p>
      </section>
    </main>
  );
}
