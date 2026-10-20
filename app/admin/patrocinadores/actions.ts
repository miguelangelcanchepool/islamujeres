"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { isUuid } from "@/lib/admin/place-fields";
import { parseSponsorForm, type SponsorFormState } from "@/lib/admin/sponsor-fields";
import {
  createAdminSponsor,
  deleteAdminSponsor,
  inspectLogo,
  moveAdminSponsor,
  setAdminSponsorActive,
  updateAdminSponsor,
} from "@/lib/admin/sponsors";
import { requireAdminClient } from "@/lib/admin/session";

export async function createSponsor(
  _state: SponsorFormState,
  formData: FormData,
): Promise<SponsorFormState> {
  const parsed = parseSponsorForm(formData);
  const logo = await readLogo(formData, true);
  const invalid = invalidForm(parsed, logo);
  if (invalid) return invalid;
  if (!parsed.ok || !logo.ok || !logo.image) return { error: "Revisa los campos marcados." };

  const { supabase } = await requireAdminClient();
  const result = await createAdminSponsor(supabase, parsed.value, logo.image);
  if (!result.ok) return { error: result.error };

  updateTag("sponsors");
  redirect("/admin/patrocinadores?aviso=creado");
}

export async function updateSponsor(
  _state: SponsorFormState,
  formData: FormData,
): Promise<SponsorFormState> {
  const id = String(formData.get("id") ?? "");
  if (!isUuid(id)) return { error: "No se encontró el patrocinador." };

  const parsed = parseSponsorForm(formData);
  const logo = await readLogo(formData, false);
  const invalid = invalidForm(parsed, logo);
  if (invalid) return invalid;
  if (!parsed.ok || !logo.ok) return { error: "Revisa los campos marcados." };

  const { supabase } = await requireAdminClient();
  const result = await updateAdminSponsor(supabase, id, parsed.value, logo.image);
  if (!result.ok) return { error: result.error };

  updateTag("sponsors");
  redirect("/admin/patrocinadores?aviso=actualizado");
}

export async function moveSponsor(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "up" ? "up" : formData.get("direction") === "down" ? "down" : "";
  if (!isUuid(id) || !direction) redirect("/admin/patrocinadores?aviso=error");

  const { supabase } = await requireAdminClient();
  const result = await moveAdminSponsor(supabase, id, direction);
  if (!result.ok) redirect("/admin/patrocinadores?aviso=error");

  updateTag("sponsors");
  redirect("/admin/patrocinadores?aviso=orden");
}

export async function setSponsorActive(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!isUuid(id)) redirect("/admin/patrocinadores?aviso=error");

  const { supabase } = await requireAdminClient();
  const result = await setAdminSponsorActive(supabase, id);
  if (!result.ok) redirect("/admin/patrocinadores?aviso=error");

  updateTag("sponsors");
  redirect("/admin/patrocinadores?aviso=estado");
}

export async function deleteSponsor(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!isUuid(id)) redirect("/admin/patrocinadores?aviso=error");

  const { supabase } = await requireAdminClient();
  const result = await deleteAdminSponsor(supabase, id);
  if (!result.ok) redirect("/admin/patrocinadores?aviso=error");

  updateTag("sponsors");
  redirect("/admin/patrocinadores?aviso=eliminado");
}

function invalidForm(
  parsed: ReturnType<typeof parseSponsorForm>,
  logo: Awaited<ReturnType<typeof readLogo>>,
): SponsorFormState {
  if (parsed.ok && logo.ok) return null;
  return {
    error: "Revisa los campos marcados.",
    fields: {
      ...(parsed.ok ? {} : parsed.state?.fields),
      ...(!logo.ok && logo.field ? { logo: logo.error } : {}),
    },
  };
}

async function readLogo(formData: FormData, required: boolean) {
  const file = formData.get("logo");
  if (!(file instanceof File) || file.size <= 0) {
    if (!required) return { ok: true as const, image: null };
    return { ok: false as const, error: "Elige un logotipo.", field: true as const };
  }

  const image = await inspectLogo(file);
  if (!image.ok) return { ok: false as const, error: image.error, field: true as const };
  return { ok: true as const, image: image.image };
}
