import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deletePlace } from "@/app/admin/lugares/actions";
import { isUuid, statusLabel } from "@/lib/admin/place-fields";
import { getAdminPlace } from "@/lib/admin/places";
import { categoryLabel } from "@/lib/places/categories";

export const metadata: Metadata = {
  title: "Eliminar lugar",
};

export default function DeletePlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main id="contenido" className="admin-panel">
          <p className="admin-note">Cargando el lugar…</p>
        </main>
      }
    >
      <DeletePlace params={params} />
    </Suspense>
  );
}

async function DeletePlace({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();

  const place = await getAdminPlace(id);
  if (!place) notFound();

  return (
    <main id="contenido" className="admin-panel">
      <p className="eyebrow">Lugares</p>
      <h1>Eliminar lugar.</h1>
      <p className="lede">{place.name}</p>
      <p>
        {categoryLabel[place.category]}. Estado: {statusLabel[place.status]}.
      </p>
      <p>
        Esta acción quita el lugar de la guía. También se eliminan sus fotos y sus enlaces. No se
        puede deshacer.
      </p>
      <form action={deletePlace} className="admin-signout">
        <input type="hidden" name="id" value={place.id} />
        <button className="admin-danger" type="submit">
          Eliminar definitivamente
        </button>
      </form>
      <p>
        <Link href={`/admin/lugares/${place.id}`}>Cancelar y volver a editar</Link>
      </p>
    </main>
  );
}
