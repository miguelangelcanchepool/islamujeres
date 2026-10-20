"use server";

import { redirect } from "next/navigation";
import { readAdminAccess } from "@/lib/admin/session";
import { createClient } from "@/lib/supabase/server";

export type SignInState = { error: string } | null;

export async function signIn(
  _state: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Escribe el correo y la contraseña." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "El acceso no está configurado en el servidor." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Correo o contraseña incorrectos." };
  }

  const access = await readAdminAccess(supabase);
  if (access.kind !== "admin") {
    await supabase.auth.signOut();
    return { error: "Esta cuenta no puede administrar la guía." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
