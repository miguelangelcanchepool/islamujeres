"use client";

import { useActionState, type ReactNode } from "react";
import type { PlaceDraft, PlaceField, PlaceFormState } from "@/lib/admin/place-fields";
import { dataOrigins, originLabel, publicationStatuses, statusLabel } from "@/lib/admin/place-fields";
import { categoryLabel, visibilityLabel } from "@/lib/places/categories";
import { placeCategories, type VisibilityLevel } from "@/lib/places/types";

const visibilities = ["informativo", "aliado", "destacado"] as const satisfies readonly VisibilityLevel[];

type PlaceFormProps = {
  action: (state: PlaceFormState, formData: FormData) => Promise<PlaceFormState>;
  place: PlaceDraft;
  placeId?: string;
  submitLabel: string;
  children?: ReactNode;
};

export function PlaceForm({ action, place, placeId, submitLabel, children }: PlaceFormProps) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="admin-form">
      {placeId ? <input type="hidden" name="id" value={placeId} /> : null}
      {state?.error ? (
        <p className="admin-note" role="alert">
          {state.error}
        </p>
      ) : null}

      <fieldset>
        <legend>Identidad</legend>
        <Field name="name" label="Nombre" error={state?.fields?.name} defaultValue={place.name} required />
        <Field
          name="slug"
          label="Identificador"
          error={state?.fields?.slug}
          defaultValue={place.slug}
          required
          hint="Minúsculas, números y guiones. Por ejemplo: terminal-ultramar."
        />
      </fieldset>

      <fieldset>
        <legend>Publicación</legend>
        <Select
          name="category"
          label="Categoría"
          error={state?.fields?.category}
          defaultValue={place.category}
          options={placeCategories.map((value) => [value, categoryLabel[value]])}
        />
        <Select
          name="visibility"
          label="Visibilidad"
          error={state?.fields?.visibility}
          defaultValue={place.visibility}
          options={visibilities.map((value) => [value, visibilityLabel[value]])}
        />
        <Select
          name="status"
          label="Estado"
          error={state?.fields?.status}
          defaultValue={place.status}
          hint="Solo «publicado» aparece en la guía."
          options={publicationStatuses.map((value) => [value, statusLabel[value]])}
        />
        <Select
          name="origin"
          label="Origen"
          error={state?.fields?.origin}
          defaultValue={place.origin}
          options={dataOrigins.map((value) => [value, originLabel[value]])}
        />
      </fieldset>

      <fieldset>
        <legend>Texto</legend>
        <Field
          name="summary"
          label="Resumen"
          error={state?.fields?.summary}
          defaultValue={place.summary}
          required
        />
        <TextArea name="description" label="Descripción" defaultValue={place.description} />
      </fieldset>

      <fieldset>
        <legend>Ubicación</legend>
        <Field name="address" label="Dirección" defaultValue={place.address} />
        <Field name="locationNote" label="Nota de ubicación" defaultValue={place.locationNote} />
        <TextArea name="directions" label="Cómo llegar" defaultValue={place.directions} />
        <Field
          name="latitude"
          label="Latitud"
          error={state?.fields?.latitude}
          defaultValue={place.latitude}
          inputMode="decimal"
        />
        <Field
          name="longitude"
          label="Longitud"
          error={state?.fields?.longitude}
          defaultValue={place.longitude}
          inputMode="decimal"
        />
      </fieldset>

      <fieldset>
        <legend>Contacto</legend>
        <Field name="phone" label="Teléfono" defaultValue={place.phone} />
        <Field name="whatsapp" label="WhatsApp" defaultValue={place.whatsapp} />
        <Field name="website" label="Sitio web" defaultValue={place.website} />
        <Field name="hours" label="Horario" defaultValue={place.hours} />
      </fieldset>

      {children}

      <button type="submit" disabled={pending}>
        {pending ? "Guardando…" : submitLabel}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  defaultValue,
  error,
  required,
  hint,
  inputMode,
}: {
  name: PlaceField;
  label: string;
  defaultValue: string;
  error?: string;
  required?: boolean;
  hint?: string;
  inputMode?: "decimal";
}) {
  return (
    <label>
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        required={required}
        aria-invalid={error ? true : undefined}
        inputMode={inputMode}
      />
      {hint ? <span className="admin-hint">{hint}</span> : null}
      {error ? <span className="admin-field-error">{error}</span> : null}
    </label>
  );
}

function TextArea({
  name,
  label,
  defaultValue,
}: {
  name: PlaceField;
  label: string;
  defaultValue: string;
}) {
  return (
    <label>
      {label}
      <textarea name={name} defaultValue={defaultValue} rows={5} />
    </label>
  );
}

function Select({
  name,
  label,
  defaultValue,
  options,
  error,
  hint,
}: {
  name: PlaceField;
  label: string;
  defaultValue: string;
  options: readonly (readonly [string, string])[];
  error?: string;
  hint?: string;
}) {
  return (
    <label>
      {label}
      <select name={name} defaultValue={defaultValue} aria-invalid={error ? true : undefined} required>
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
      {hint ? <span className="admin-hint">{hint}</span> : null}
      {error ? <span className="admin-field-error">{error}</span> : null}
    </label>
  );
}
