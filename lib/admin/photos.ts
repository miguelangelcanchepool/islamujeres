import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { AdminPhoto } from "@/lib/admin/photo-types";

export type { AdminPhoto } from "@/lib/admin/photo-types";

export const placePhotoBucket = "place-photos";
export const placePhotoMaxBytes = 5 * 1024 * 1024;

const publicMarker = `/storage/v1/object/public/${placePhotoBucket}/`;

const imageKinds = {
  "image/jpeg": {
    ext: "jpg",
    matches: (bytes: Uint8Array) =>
      bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  },
  "image/png": {
    ext: "png",
    matches: (bytes: Uint8Array) =>
      bytes.length > 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47,
  },
  "image/webp": {
    ext: "webp",
    matches: (bytes: Uint8Array) =>
      bytes.length > 12 &&
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50,
  },
} as const;

type ImageKind = keyof typeof imageKinds;

export type InspectedImage = {
  bytes: Uint8Array;
  mime: ImageKind;
  ext: string;
};

type PhotoResult = { ok: true; photo: AdminPhoto } | { ok: false; error: string };

export async function listPlacePhotos(
  supabase: SupabaseClient,
  placeId: string,
): Promise<AdminPhoto[]> {
  const { data, error } = await supabase
    .from("place_photos")
    .select("id, src, alt, sort_order")
    .eq("place_id", placeId)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw new Error("No se pudieron leer las fotografías.");

  return (data ?? []).map((row, index) => {
    const src = requiredText(row.src);
    return {
      id: requiredText(row.id),
      src,
      alt: requiredText(row.alt),
      cover: index === 0,
      stored: storedPath(src, placeId) != null,
    };
  });
}

export function normalizeAlt(value: string): { ok: true; alt: string } | { ok: false; error: string } {
  const alt = value.trim().replace(/\s+/g, " ");
  if (!alt) return { ok: false, error: "Escribe el texto alternativo de la fotografía." };
  if (alt.length > 180) return { ok: false, error: "El texto alternativo admite hasta 180 caracteres." };
  return { ok: true, alt };
}

export async function inspectImage(
  file: File,
): Promise<{ ok: true; image: InspectedImage } | { ok: false; error: string }> {
  if (file.size <= 0) return { ok: false, error: "El archivo está vacío." };
  if (file.size > placePhotoMaxBytes) {
    return { ok: false, error: "La fotografía supera 5 MB." };
  }

  const claimed = file.type.trim().toLowerCase();
  if (claimed && !(claimed in imageKinds)) {
    return { ok: false, error: "Usa JPG, PNG o WebP." };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = (Object.keys(imageKinds) as ImageKind[]).find((kind) => imageKinds[kind].matches(bytes));
  if (!mime) return { ok: false, error: "El archivo no es un JPG, PNG o WebP válido." };
  if (claimed && claimed !== mime) return { ok: false, error: "El formato del archivo no coincide." };

  return { ok: true, image: { bytes, mime, ext: imageKinds[mime].ext } };
}

/** Guarda el archivo en el bucket y una fila de place_photos para ese lugar. */
export async function storePlacePhoto(
  supabase: SupabaseClient,
  placeId: string,
  image: InspectedImage,
  alt: string,
): Promise<PhotoResult> {
  const { data: place, error: placeError } = await supabase
    .from("places")
    .select("id")
    .eq("id", placeId)
    .maybeSingle();

  if (placeError) return { ok: false, error: "No se pudo comprobar el lugar." };
  if (!place) return { ok: false, error: "No se encontró el lugar." };

  const { data: latest, error: orderError } = await supabase
    .from("place_photos")
    .select("sort_order")
    .eq("place_id", placeId)
    .order("sort_order", { ascending: false })
    .limit(1);

  if (orderError) return { ok: false, error: "No se pudo preparar la fotografía." };

  const sortOrder = typeof latest?.[0]?.sort_order === "number" ? latest[0].sort_order + 1 : 0;
  const path = `${placeId}/${crypto.randomUUID()}.${image.ext}`;
  const body = new Blob([new Uint8Array(image.bytes)], { type: image.mime });
  const uploaded = await supabase.storage.from(placePhotoBucket).upload(path, body, {
    contentType: image.mime,
    upsert: false,
  });

  if (uploaded.error) return { ok: false, error: storageErrorMessage(uploaded.error.message) };

  const src = supabase.storage.from(placePhotoBucket).getPublicUrl(path).data.publicUrl;
  const { data, error } = await supabase
    .from("place_photos")
    .insert({
      place_id: placeId,
      src,
      alt,
      sort_order: sortOrder,
    })
    .select("id, src, alt")
    .single();

  if (error || !data) {
    await supabase.storage.from(placePhotoBucket).remove([path]);
    return { ok: false, error: "No se pudo asociar la fotografía al lugar." };
  }

  return {
    ok: true,
    photo: {
      id: data.id,
      src: data.src,
      alt: data.alt,
      cover: sortOrder === 0,
      stored: true,
    },
  };
}

export async function deletePlacePhoto(
  supabase: SupabaseClient,
  placeId: string,
  photoId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data, error } = await supabase
    .from("place_photos")
    .select("id, src")
    .eq("id", photoId)
    .eq("place_id", placeId)
    .maybeSingle();

  if (error) return { ok: false, error: "No se pudo leer la fotografía." };
  if (!data?.src) return { ok: false, error: "No se encontró la fotografía." };

  const path = storedPath(data.src, placeId);
  if (path) {
    const removed = await supabase.storage.from(placePhotoBucket).remove([path]);
    if (removed.error && !isMissingObject(removed.error.message)) {
      return { ok: false, error: "No se pudo borrar el archivo. La ficha sigue igual." };
    }
  }

  const deleted = await supabase
    .from("place_photos")
    .delete()
    .eq("id", photoId)
    .eq("place_id", placeId)
    .select("id");

  if (deleted.error || !deleted.data?.length) {
    return { ok: false, error: "No se pudo quitar la fotografía del lugar." };
  }

  return { ok: true };
}

/** La portada es la fila con menor sort_order. No existe una columna aparte. */
export async function setPlaceCover(
  supabase: SupabaseClient,
  placeId: string,
  photoId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data, error } = await supabase
    .from("place_photos")
    .select("id, sort_order")
    .eq("place_id", placeId)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) return { ok: false, error: "No se pudieron ordenar las fotografías." };
  const photos = data ?? [];
  if (!photos.some((photo) => photo.id === photoId)) {
    return { ok: false, error: "No se encontró la fotografía." };
  }

  const ordered = [
    photoId,
    ...photos.filter((photo) => photo.id !== photoId).map((photo) => photo.id),
  ];

  for (const [index, id] of ordered.entries()) {
    const current = photos.find((photo) => photo.id === id);
    if (current?.sort_order === index) continue;
    const updated = await supabase
      .from("place_photos")
      .update({ sort_order: index })
      .eq("id", id)
      .eq("place_id", placeId)
      .select("id");
    if (updated.error || !updated.data?.length) {
      return { ok: false, error: "No se pudo actualizar la portada." };
    }
  }

  return { ok: true };
}

export async function storedPathsForPlace(supabase: SupabaseClient, placeId: string): Promise<string[]> {
  const { data, error } = await supabase.from("place_photos").select("src").eq("place_id", placeId);
  if (error || !data?.length) return [];

  return data.flatMap((row) => {
    const path = typeof row.src === "string" ? storedPath(row.src, placeId) : null;
    return path ? [path] : [];
  });
}

export async function removeStoredPaths(supabase: SupabaseClient, paths: string[]) {
  if (paths.length === 0) return;
  await supabase.storage.from(placePhotoBucket).remove(paths);
}

function storedPath(src: string, placeId: string): string | null {
  const marker = src.indexOf(publicMarker);
  if (marker === -1) return null;
  const path = decodeURIComponent(src.slice(marker + publicMarker.length).split("?")[0] ?? "");
  const pattern = new RegExp(
    `^${placeId}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.(jpg|png|webp)$`,
    "i",
  );
  return pattern.test(path) ? path : null;
}

function storageErrorMessage(message: string): string {
  const text = message.toLowerCase();
  if (text.includes("bucket not found")) {
    return "Falta el almacén place-photos. Ejecuta supabase/storage.sql en el editor SQL de Supabase. Ese archivo no cambia las tablas ni las políticas actuales.";
  }
  if (text.includes("row-level security") || text.includes("permission") || text.includes("403")) {
    return "No tienes permiso para guardar el archivo.";
  }
  if (text.includes("mime") || text.includes("invalid")) {
    return "El almacén rechazó el formato. Usa JPG, PNG o WebP de hasta 5 MB.";
  }
  return "No se pudo guardar la fotografía.";
}

function isMissingObject(message: string): boolean {
  const text = message.toLowerCase();
  return text.includes("not found") || text.includes("does not exist");
}

function requiredText(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Una fotografía llegó incompleta.");
  }
  return value;
}
