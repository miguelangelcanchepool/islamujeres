import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deleteSponsor } from "@/app/admin/patrocinadores/actions";
import { isUuid } from "@/lib/admin/place-fields";
import { getAdminSponsor } from "@/lib/admin/sponsors";
import { requireAdminClient } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "Eliminar patrocinador",
};

export default function DeleteSponsorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main id="contenido" className="admin-panel">
          <p className="admin-note">Cargando el patrocinador…</p>
        </main>
      }
    >
      <DeleteSponsor params={params} />
    </Suspense>
  );
}

async function DeleteSponsor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();

  const { supabase } = await requireAdminClient();
  const result = await getAdminSponsor(supabase, id);
  if (!result.ok) {
    return (
      <main id="contenido" className="admin-panel">
        <p className="admin-field-error" role="alert">
          {result.error}
        </p>
        <p>
          <Link href="/admin/patrocinadores">Volver a patrocinadores</Link>
        </p>
      </main>
    );
  }
  if (!result.sponsor) notFound();

  const sponsor = result.sponsor;

  return (
    <main id="contenido" className="admin-panel">
      <p className="eyebrow">Patrocinadores</p>
      <h1>Eliminar patrocinador.</h1>
      <p className="lede">{sponsor.name}</p>
      <p>Estado: {sponsor.active ? "activo" : "inactivo"}.</p>
      <p>Esta acción quita el patrocinador y borra su logotipo del almacén. No se puede deshacer.</p>
      <form action={deleteSponsor} className="admin-signout">
        <input type="hidden" name="id" value={sponsor.id} />
        <button className="admin-danger" type="submit">
          Eliminar definitivamente
        </button>
      </form>
      <p>
        <Link href={`/admin/patrocinadores/${sponsor.id}`}>Cancelar y volver a editar</Link>
      </p>
    </main>
  );
}
