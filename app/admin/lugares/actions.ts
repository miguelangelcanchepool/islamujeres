"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { isUuid, parsePlaceForm, type PlaceFormState } from "@/lib/admin/place-fields";
import { inspectImage, normalizeAlt, removeStoredPaths, storePlacePhoto, storedPathsForPlace } from "@/lib/admin/photos";
import { deleteAdminPlace, saveError } from "@/lib/admin/places";
import { requireAdminClient } from "@/lib/admin/session";

export async function createPlace(
  _state: PlaceFormState,
  formData: FormData,
): Promise<PlaceFormState> {
  const parsed = parsePlaceForm(formData);
  if (!parsed.ok) return parsed.state;

  const photo = await readOptionalPhoto(formData);
  if (!photo.ok) return { error: photo.error };

  const { supabase } = await requireAdminClient();
  const { data: created, error } = await supabase
    .from("places")
    .insert(parsed.value)
    .select("id")
    .single();
  if (error || !created) return { error: saveError(error ?? {}) };

  if (photo.image) {
    const saved = await storePlacePhoto(supabase, created.id, photo.image, photo.alt);
    updateTag("places");
    redirect(saved.ok ? `/admin/lugares/${created.id}?foto=subida` : `/admin/lugares/${created.id}?foto=error`);
  }

  updateTag("places");
  redirect("/admin/lugares?aviso=creado");
}

export async function updatePlace(
  _state: PlaceFormState,
  formData: FormData,
): Promise<PlaceFormState> {
  const id = String(formData.get("id") ?? "");
  if (!isUuid(id)) return { error: "No se encontró el lugar." };

  const parsed = parsePlaceForm(formData);
  if (!parsed.ok) return parsed.state;

  const { supabase } = await requireAdminClient();
  const { data, error } = await supabase
    .from("places")
    .update(parsed.value)
    .eq("id", id)
    .select("id");

  if (error) return { error: saveError(error) };
  if (!data?.length) return { error: "No se encontró el lugar o no tienes permiso para editarlo." };

  updateTag("places");
  redirect("/admin/lugares?aviso=actualizado");
}

export async function deletePlace(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!isUuid(id)) redirect("/admin/lugares?aviso=error");

  const { supabase } = await requireAdminClient();
  const storedPaths = await storedPathsForPlace(supabase, id);
  const { data, error } = await deleteAdminPlace(supabase, id);
  if (error || !data?.length) redirect("/admin/lugares?aviso=error");
  await removeStoredPaths(supabase, storedPaths);

  updateTag("places");
  redirect("/admin/lugares?aviso=eliminado");
}

async function readOptionalPhoto(formData: FormData) {
  const file = formData.get("photo");
  if (!(file instanceof File) || file.size <= 0) return { ok: true as const, image: null, alt: "" };

  const alt = normalizeAlt(String(formData.get("photoAlt") ?? ""));
  if (!alt.ok) return alt;

  const image = await inspectImage(file);
  if (!image.ok) return image;

  return { ok: true as const, image: image.image, alt: alt.alt };
}
