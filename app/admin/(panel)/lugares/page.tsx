import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { categoryLabel, visibilityLabel } from "@/lib/places/categories";
import { placeCategories, type PlaceCategoryId, type PublicationStatus } from "@/lib/places/types";
import { listAdminPlaces, summarizeAdminPlaces } from "@/lib/admin/places";
import { publicationStatuses, statusLabel } from "@/lib/admin/place-fields";

export const metadata: Metadata = {
  title: "Lugares",
};

const notices = {
  creado: "El lugar se creó. La guía pública tomará el cambio en la próxima consulta.",
  actualizado: "Los cambios se guardaron. La guía pública tomará el cambio en la próxima consulta.",
  eliminado: "El lugar se eliminó. La guía pública tomará el cambio en la próxima consulta.",
  error: "No se pudo eliminar el lugar.",
} as const;

export default function AdminPlacesPage({
  searchParams,
}: {
  searchParams: Promise<{
    aviso?: string | string[];
    q?: string | string[];
    estado?: string | string[];
    categoria?: string | string[];
  }>;
}) {
  return (
    <Suspense
      fallback={
        <main id="contenido" className="admin-panel">
          <p className="admin-quiet">Cargando lugares…</p>
        </main>
      }
    >
      <PlacesList searchParams={searchParams} />
    </Suspense>
  );
}

async function PlacesList({
  searchParams,
}: {
  searchParams: Promise<{
    aviso?: string | string[];
    q?: string | string[];
    estado?: string | string[];
    categoria?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const query = first(params.q);
  const status = knownStatus(first(params.estado));
  const category = knownCategory(first(params.categoria));
  const notice = noticeFor(first(params.aviso));
  const [summary, places] = await Promise.all([
    summarizeAdminPlaces(),
    listAdminPlaces(query, { status, category }),
  ]);
  const filtered = Boolean(query || status || category);

  return (
    <main id="contenido" className="admin-panel admin-wide">
      <header className="admin-heading">
        <div>
          <h1>Lugares</h1>
          <p>Fichas de la guía: publicadas, en borrador e inactivas.</p>
        </div>
        <Link className="admin-button" href="/admin/lugares/nuevo">
          + Nuevo lugar
        </Link>
      </header>
      {notice ? (
        <p className="admin-banner" role="status">
          {notice}
        </p>
      ) : null}
      <section className="admin-stats" aria-label="Resumen de lugares">
        <article>
          <p>Total</p>
          <strong>{summary.total}</strong>
        </article>
        <article>
          <p>Publicados</p>
          <strong>{summary.published}</strong>
        </article>
        <article>
          <p>Borradores</p>
          <strong>{summary.drafts}</strong>
        </article>
      </section>
      <form className="admin-filters" action="/admin/lugares" method="get">
        <label>
          Buscar por nombre
          <input name="q" defaultValue={query} type="search" placeholder="Nombre del lugar" />
        </label>
        <label>
          Estado
          <select name="estado" defaultValue={status}>
            <option value="">Todos</option>
            {publicationStatuses.map((value) => (
              <option key={value} value={value}>
                {statusLabel[value]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Categoría
          <select name="categoria" defaultValue={category}>
            <option value="">Todas</option>
            {placeCategories.map((value) => (
              <option key={value} value={value}>
                {categoryLabel[value]}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Buscar</button>
        {filtered ? <Link href="/admin/lugares">Limpiar</Link> : null}
      </form>
      {places.length === 0 ? (
        <p className="admin-empty">
          {filtered ? "Ningún lugar coincide con esa búsqueda." : "Todavía no hay lugares."}
        </p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Categoría</th>
                <th scope="col">Estado</th>
                <th scope="col">Visibilidad</th>
                <th scope="col">
                  <span className="admin-sr">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {places.map((place) => (
                <tr key={place.id}>
                  <th scope="row">{place.name}</th>
                  <td>{categoryLabel[place.category]}</td>
                  <td>
                    <span className={`admin-status admin-status-${place.status}`}>
                      {statusLabel[place.status]}
                    </span>
                  </td>
                  <td>{visibilityLabel[place.visibility]}</td>
                  <td className="admin-actions">
                    <Link href={`/admin/lugares/${place.id}`}>Editar</Link>
                    <Link href={`/admin/lugares/${place.id}/eliminar`}>Eliminar</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function first(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

function knownStatus(value: string): PublicationStatus | "" {
  return publicationStatuses.find((status) => status === value) ?? "";
}

function knownCategory(value: string): PlaceCategoryId | "" {
  return placeCategories.find((category) => category === value) ?? "";
}

function noticeFor(value: string): string | null {
  if (value in notices) return notices[value as keyof typeof notices];
  return null;
}
