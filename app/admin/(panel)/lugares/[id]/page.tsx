import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceForm } from "@/components/admin/PlaceForm";
import { PlacePhotos } from "@/components/admin/PlacePhotos";
import { updatePlace } from "@/app/admin/lugares/actions";
import { isUuid } from "@/lib/admin/place-fields";
import { listPlacePhotos } from "@/lib/admin/photos";
import { getAdminPlace, toDraft } from "@/lib/admin/places";
import { requireAdminClient } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "Editar lugar",
};

const photoNotices = {
  subida: "La fotografía se guardó. Si el lugar está publicado, la guía pública la tomará en la próxima consulta.",
  error: "El lugar se creó, pero la fotografía no se pudo guardar. Puedes subirla desde aquí.",
  eliminada: "La fotografía se eliminó. La guía pública tomará el cambio en la próxima consulta.",
  portada: "La portada quedó actualizada. La guía pública la mostrará primero.",
  "error-borrar": "No se pudo eliminar la fotografía.",
  "error-portada": "No se pudo actualizar la portada.",
} as const;

export default function EditPlacePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ foto?: string | string[] }>;
}) {
  return (
    <Suspense
      fallback={
        <main id="contenido" className="admin-panel">
          <p className="admin-note">Cargando el lugar…</p>
        </main>
      }
    >
      <EditPlace params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function EditPlace({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ foto?: string | string[] }>;
}) {
  const { id } = await params;
  if (!isUuid(id)) notFound();

  const place = await getAdminPlace(id);
  if (!place) notFound();

  const { supabase } = await requireAdminClient();
  const photos = await listPlacePhotos(supabase, place.id);
  const notice = photoNotice(first((await searchParams).foto));

  return (
    <main id="contenido" className="admin-panel">
      <p className="eyebrow">Lugares</p>
      <h1>Editar lugar.</h1>
      <p>{place.name}</p>
      {notice ? (
        <p className={notice.error ? "admin-field-error" : "admin-banner"} role={notice.error ? "alert" : "status"}>
          {notice.text}
        </p>
      ) : null}
      <PlaceForm
        action={updatePlace}
        place={toDraft(place)}
        placeId={place.id}
        submitLabel="Guardar cambios"
      />
      <PlacePhotos placeId={place.id} photos={photos} />
      <p className="admin-form-links">
        <Link href={`/admin/lugares/${place.id}/eliminar`}>Eliminar</Link>
        <Link href="/admin/lugares">Volver a lugares</Link>
      </p>
    </main>
  );
}

function first(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

function photoNotice(value: string): { text: string; error: boolean } | null {
  if (!(value in photoNotices)) return null;
  return {
    text: photoNotices[value as keyof typeof photoNotices],
    error: value.startsWith("error"),
  };
}
