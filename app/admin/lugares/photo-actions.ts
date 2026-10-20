"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { isUuid } from "@/lib/admin/place-fields";
import { deletePlacePhoto, setPlaceCover } from "@/lib/admin/photos";
import { requireAdminClient } from "@/lib/admin/session";

export async function removePlacePhoto(formData: FormData) {
  const placeId = String(formData.get("placeId") ?? "");
  const photoId = String(formData.get("photoId") ?? "");
  if (!isUuid(placeId) || !isUuid(photoId)) redirect("/admin/lugares?aviso=error");

  const { supabase } = await requireAdminClient();
  const result = await deletePlacePhoto(supabase, placeId, photoId);
  if (!result.ok) redirect(`/admin/lugares/${placeId}?foto=error-borrar`);

  updateTag("places");
  redirect(`/admin/lugares/${placeId}?foto=eliminada`);
}

export async function makePlaceCover(formData: FormData) {
  const placeId = String(formData.get("placeId") ?? "");
  const photoId = String(formData.get("photoId") ?? "");
  if (!isUuid(placeId) || !isUuid(photoId)) redirect("/admin/lugares?aviso=error");

  const { supabase } = await requireAdminClient();
  const result = await setPlaceCover(supabase, placeId, photoId);
  if (!result.ok) redirect(`/admin/lugares/${placeId}?foto=error-portada`);

  updateTag("places");
  redirect(`/admin/lugares/${placeId}?foto=portada`);
}
