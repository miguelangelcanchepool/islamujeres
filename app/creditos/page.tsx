import type { Metadata } from "next";
import { mediaList } from "@/lib/media";

export const metadata: Metadata = {
  title: "Créditos",
  description:
    "Autores y licencias de las fotografías de Descubre Isla Mujeres.",
};

export default function CreditosPage() {
  return (
    <main id="contenido" className="credits-page">
      <header className="text-hero">
        <p className="eyebrow">Fotografías</p>
        <h1>Créditos</h1>
        <p className="hero-lead">
          Las imágenes son de Isla Mujeres y se publican aquí con licencias
          Creative Commons. El autor y la licencia viajan con cada foto.
        </p>
      </header>
      <ul className="credit-list">
        {mediaList.map((item) => (
          <li key={item.src}>
            <p className="credit-author">{item.author}</p>
            <p>{item.alt}</p>
            <p className="credit-links">
              <a href={item.licenseUrl}>{item.license}</a>
              <a href={item.sourceUrl}>Archivo original</a>
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
