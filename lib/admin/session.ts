import "server-only";

import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type AdminSession = {
  userId: string;
  email: string;
};

export type AdminAccess =
  | { kind: "anonymous" }
  | { kind: "forbidden" }
  | { kind: "admin"; session: AdminSession };

/** Comprueba la sesión con Auth y la fila propia en place_admins. RLS impide leer otras filas. */
export async function getAdminAccess(): Promise<AdminAccess> {
  const supabase = await openSession();
  return readAdminAccess(supabase);
}

export async function readAdminAccess(supabase: SupabaseClient): Promise<AdminAccess> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { kind: "anonymous" };

  const { data: row, error: rowError } = await supabase
    .from("place_admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (rowError) {
    throw new Error("No se pudo comprobar el permiso de administrador.");
  }

  if (!row) return { kind: "forbidden" };

  return {
    kind: "admin",
    session: {
      userId: data.user.id,
      email: data.user.email ?? "administrador",
    },
  };
}

/** Cliente de Supabase con la sesión ya comprobada. Las escrituras quedan sujetas a RLS. */
export async function requireAdminClient() {
  const supabase = await openSession();
  const access = await readAdminAccess(supabase);
  if (access.kind !== "admin") redirect("/admin/login");
  return { supabase, session: access.session };
}

export async function requireAdmin(): Promise<AdminSession> {
  const { session } = await requireAdminClient();
  return session;
}

async function openSession() {
  await connection();
  return createClient();
}
