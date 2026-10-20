import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { moveSponsor, setSponsorActive } from "@/app/admin/patrocinadores/actions";
import { safeLogoSrc } from "@/lib/admin/sponsor-fields";
import { listAdminSponsors } from "@/lib/admin/sponsors";
import { requireAdminClient } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "Patrocinadores",
};

const notices = {
  creado: "El patrocinador se creó. La página principal todavía no lo muestra.",
  actualizado: "Los cambios se guardaron. La página principal todavía no usa estos datos.",
  eliminado: "El patrocinador se eliminó.",
  orden: "El orden se actualizó.",
  estado: "La visibilidad se actualizó.",
  error: "No se pudo completar la acción.",
} as const;

export default function AdminSponsorsPage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string | string[] }>;
}) {
  return (
    <Suspense
      fallback={
        <main id="contenido" className="admin-panel">
          <p className="admin-quiet">Cargando patrocinadores…</p>
        </main>
      }
    >
      <SponsorList searchParams={searchParams} />
    </Suspense>
  );
}

async function SponsorList({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string | string[] }>;
}) {
  const params = await searchParams;
  const notice = noticeFor(first(params.aviso));
  const { supabase } = await requireAdminClient();
  const result = await listAdminSponsors(supabase);
  const sponsors = result.ok ? result.sponsors : [];
  const active = sponsors.filter((sponsor) => sponsor.active).length;

  return (
    <main id="contenido" className="admin-panel admin-wide">
      <header className="admin-heading">
        <div>
          <h1>Patrocinadores</h1>
          <p>Logotipos, visibilidad y orden. La página principal todavía no usa estos datos.</p>
        </div>
        <Link className="admin-button" href="/admin/patrocinadores/nuevo">
          + Nuevo patrocinador
        </Link>
      </header>
      {notice ? (
        <p className="admin-banner" role="status">
          {notice}
        </p>
      ) : null}
      {result.ok ? (
        <section className="admin-stats" aria-label="Resumen de patrocinadores">
          <article>
            <p>Total</p>
            <strong>{sponsors.length}</strong>
          </article>
          <article>
            <p>Activos</p>
            <strong>{active}</strong>
          </article>
          <article>
            <p>Inactivos</p>
            <strong>{sponsors.length - active}</strong>
          </article>
        </section>
      ) : (
        <p className="admin-field-error" role="alert">
          {result.error}
        </p>
      )}
      {result.ok && sponsors.length === 0 ? (
        <p className="admin-empty">Todavía no hay patrocinadores.</p>
      ) : null}
      {sponsors.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table admin-sponsors">
            <thead>
              <tr>
                <th scope="col">Logotipo</th>
                <th scope="col">Nombre</th>
                <th scope="col">Estado</th>
                <th scope="col">Orden</th>
                <th scope="col">
                  <span className="admin-sr">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sponsors.map((sponsor, index) => {
                const logo = safeLogoSrc(sponsor.logoUrl);
                return (
                  <tr key={sponsor.id}>
                    <td>
                      {logo ? (
                        <img className="admin-logo" src={logo} alt="" />
                      ) : (
                        <span className="admin-quiet">Sin logotipo</span>
                      )}
                    </td>
                    <th scope="row">
                      {sponsor.name}
                      {sponsor.websiteUrl ? (
                        <span className="admin-sponsor-link">{sponsor.websiteUrl}</span>
                      ) : null}
                    </th>
                    <td>
                      <span className={sponsor.active ? "admin-status admin-status-activo" : "admin-status admin-status-inactivo"}>
                        {sponsor.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>{index + 1}</td>
                    <td className="admin-actions">
                      <form action={moveSponsor}>
                        <input type="hidden" name="id" value={sponsor.id} />
                        <input type="hidden" name="direction" value="up" />
                        <button type="submit" disabled={index === 0} aria-label={`Subir ${sponsor.name}`}>
                          Subir
                        </button>
                      </form>
                      <form action={moveSponsor}>
                        <input type="hidden" name="id" value={sponsor.id} />
                        <input type="hidden" name="direction" value="down" />
                        <button
                          type="submit"
                          disabled={index === sponsors.length - 1}
                          aria-label={`Bajar ${sponsor.name}`}
                        >
                          Bajar
                        </button>
                      </form>
                      <form action={setSponsorActive}>
                        <input type="hidden" name="id" value={sponsor.id} />
                        <button type="submit">{sponsor.active ? "Desactivar" : "Activar"}</button>
                      </form>
                      <Link href={`/admin/patrocinadores/${sponsor.id}`}>Editar</Link>
                      <Link href={`/admin/patrocinadores/${sponsor.id}/eliminar`}>Eliminar</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </main>
  );
}

function first(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

function noticeFor(value: string): string | null {
  if (value in notices) return notices[value as keyof typeof notices];
  return null;
}
