"use client";

import { useActionState } from "react";
import type { SponsorFormState } from "@/lib/admin/sponsor-fields";

const accept = "image/jpeg,image/png,image/webp";

type SponsorFormProps = {
  action: (state: SponsorFormState, formData: FormData) => Promise<SponsorFormState>;
  submitLabel: string;
  sponsor?: {
    id: string;
    name: string;
    active: boolean;
    logoUrl: string | null;
    websiteUrl: string | null;
  };
};

export function SponsorForm({ action, submitLabel, sponsor }: SponsorFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const editing = Boolean(sponsor);

  return (
    <form action={formAction} className="admin-form">
      {sponsor ? <input type="hidden" name="id" value={sponsor.id} /> : null}
      {state?.error ? (
        <p className="admin-note" role="alert">
          {state.error}
        </p>
      ) : null}

      <fieldset>
        <legend>Patrocinador</legend>
        <label>
          Nombre
          <input
            name="name"
            defaultValue={sponsor?.name ?? ""}
            maxLength={80}
            required
            aria-invalid={state?.fields?.name ? true : undefined}
          />
          {state?.fields?.name ? <span className="admin-field-error">{state.fields.name}</span> : null}
        </label>
        <label className="admin-check">
          <input name="is_active" type="checkbox" defaultChecked={sponsor?.active ?? true} />
          <span>Activo</span>
        </label>
        <span className="admin-hint">Solo los activos aparecen en el carrusel de la portada.</span>
        <label>
          Enlace del patrocinador
          <input
            name="website_url"
            type="text"
            inputMode="url"
            autoComplete="url"
            defaultValue={sponsor?.websiteUrl ?? ""}
            maxLength={2000}
            placeholder="https://instagram.com/tu-marca"
            aria-invalid={state?.fields?.website ? true : undefined}
          />
          <span className="admin-hint">
            Opcional. Sitio web, Facebook, Instagram o WhatsApp. Incluye https://.
          </span>
          {state?.fields?.website ? <span className="admin-field-error">{state.fields.website}</span> : null}
        </label>
      </fieldset>

      <fieldset>
        <legend>Logotipo</legend>
        {sponsor?.logoUrl ? (
          <img className="admin-logo-preview" src={sponsor.logoUrl} alt={`Logotipo de ${sponsor.name}`} />
        ) : null}
        <label>
          {editing ? "Sustituir logotipo" : "Logotipo"}
          <input
            name="logo"
            type="file"
            accept={accept}
            required={!editing}
            aria-invalid={state?.fields?.logo ? true : undefined}
          />
          <span className="admin-hint">JPG, PNG o WebP, hasta 5 MB.</span>
          {state?.fields?.logo ? <span className="admin-field-error">{state.fields.logo}</span> : null}
        </label>
      </fieldset>

      <button type="submit" disabled={pending}>
        {pending ? "Guardando…" : submitLabel}
      </button>
    </form>
  );
}
