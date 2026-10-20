import Link from "next/link";
import type { Metadata } from "next";
import { SponsorForm } from "@/components/admin/SponsorForm";
import { createSponsor } from "@/app/admin/patrocinadores/actions";

export const metadata: Metadata = {
  title: "Nuevo patrocinador",
};

export default function NewSponsorPage() {
  return (
    <main id="contenido" className="admin-panel">
      <p className="eyebrow">Patrocinadores</p>
      <h1>Nuevo patrocinador.</h1>
      <p>El nombre y el logotipo quedan guardados para el carrusel. La página principal todavía no los muestra.</p>
      <SponsorForm action={createSponsor} submitLabel="Crear patrocinador" />
      <p>
        <Link href="/admin/patrocinadores">Volver a patrocinadores</Link>
      </p>
    </main>
  );
}
