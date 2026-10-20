import { revalidateTag } from "next/cache";
import { connection } from "next/server";
import { isUuid } from "@/lib/admin/place-fields";
import { inspectImage, normalizeAlt, storePlacePhoto } from "@/lib/admin/photos";
import { readAdminAccess } from "@/lib/admin/session";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  await connection();
  const { id } = await context.params;
  if (!isUuid(id)) {
    return Response.json({ error: "No se encontró el lugar." }, { status: 404 });
  }
  if (!sameOrigin(request)) {
    return Response.json({ error: "La solicitud no es válida." }, { status: 403 });
  }

  const supabase = await createClient();
  const access = await readAdminAccess(supabase);
  if (access.kind !== "admin") {
    return Response.json({ error: "La sesión de administrador caducó." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size <= 0) {
    return Response.json({ error: "Selecciona una imagen." }, { status: 400 });
  }

  const alt = normalizeAlt(String(form.get("alt") ?? ""));
  if (!alt.ok) return Response.json({ error: alt.error }, { status: 400 });

  const image = await inspectImage(file);
  if (!image.ok) return Response.json({ error: image.error }, { status: 400 });

  const saved = await storePlacePhoto(supabase, id, image.image, alt.alt);
  if (!saved.ok) return Response.json({ error: saved.error }, { status: 400 });

  revalidateTag("places", { expire: 0 });
  return Response.json({ photo: saved.photo });
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
