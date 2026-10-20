import Link from "next/link";
import type { Metadata } from "next";
import { PlaceForm } from "@/components/admin/PlaceForm";
import { createPlace } from "@/app/admin/lugares/actions";
import { emptyPlaceDraft } from "@/lib/admin/place-fields";

export const metadata: Metadata = {
  title: "Nuevo lugar",
};

export default function NewPlacePage() {
  return (
    <main id="contenido" className="admin-panel">
      <p className="eyebrow">Lugares</p>
      <h1>Nuevo lugar.</h1>
      <p>
        Quedará como borrador hasta que elijas el estado publicado. Puedes adjuntar una fotografía
        ahora y añadir más al editar. Los enlaces no se editan en este formulario.
      </p>
      <PlaceForm action={createPlace} place={emptyPlaceDraft} submitLabel="Crear lugar">
        <fieldset>
          <legend>Fotografía</legend>
          <p className="admin-hint">
            Opcional. JPG, PNG o WebP de hasta 5 MB. Si la adjuntas, será la portada.
          </p>
          <label>
            Imagen
            <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" />
          </label>
          <label>
            Texto alternativo
            <input name="photoAlt" type="text" maxLength={180} placeholder="Qué se ve en la imagen" />
          </label>
        </fieldset>
      </PlaceForm>
      <p>
        <Link href="/admin/lugares">Volver a lugares</Link>
      </p>
    </main>
  );
}
