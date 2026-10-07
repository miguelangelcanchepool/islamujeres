import Link from "next/link";
import { nav } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <p className="footer-brand">
          Descubre
          <span>Isla Mujeres</span>
        </p>
        <p className="footer-lead">
          Una guía para conocer la isla. Quintana Roo, en el Caribe mexicano.
        </p>
      </div>
      <nav className="footer-nav" aria-label="Pie de página">
        {nav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <Link href="/creditos">Créditos</Link>
      </nav>
      <p className="footer-note">
        Primera edición dedicada al descubrimiento. No hay reservas, cuentas ni
        pagos. Las fotografías pertenecen a sus autores y se usan con licencia
        Creative Commons.
      </p>
    </footer>
  );
}
