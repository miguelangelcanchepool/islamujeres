import Link from "next/link";

export default function AdminPage() {
  return (
    <main id="contenido" className="admin-panel">
      <header className="admin-heading">
        <h1>Panel de control</h1>
        <p>Gestiona la guía pública de Isla Mujeres.</p>
      </header>
      <section className="admin-home-card" aria-labelledby="seccion-lugares">
        <h2 id="seccion-lugares">Lugares</h2>
        <p>Revisa, publica y corrige las fichas que aparecen en el mapa.</p>
        <Link className="admin-button" href="/admin/lugares">
          Abrir lugares
        </Link>
      </section>
      <section className="admin-home-card" aria-labelledby="seccion-patrocinadores">
        <h2 id="seccion-patrocinadores">Patrocinadores</h2>
        <p>Administra los logotipos, su orden y si quedan activos. La página principal todavía no los muestra.</p>
        <Link className="admin-button" href="/admin/patrocinadores">
          Abrir patrocinadores
        </Link>
      </section>
      <p className="admin-quiet">
        Comercios y configuración están en la barra lateral como pendientes.
      </p>
    </main>
  );
}
