import Link from "next/link";

export default function NotFound() {
  return (
    <main id="contenido" className="lost">
      <p className="eyebrow">Fuera del mapa</p>
      <h1>Esta orilla no existe.</h1>
      <p className="hero-lead">La isla es pequeña. El camino de vuelta también.</p>
      <Link href="/" className="link-arrow">
        Volver al inicio
      </Link>
    </main>
  );
}
