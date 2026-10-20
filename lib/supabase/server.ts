import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { readSupabaseEnv } from "@/lib/supabase/env";

const missingConfigMessage =
  "La configuración de Supabase está incompleta. Define SUPABASE_URL y SUPABASE_ANON_KEY juntas, solo en el servidor. No uses la clave service_role ni el prefijo NEXT_PUBLIC_.";

/** Cliente con la sesión del administrador. La clave anónima no sale del servidor. */
export async function createClient() {
  const env = readSupabaseEnv();
  if (!env) {
    throw new Error(missingConfigMessage);
  }

  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // En un Server Component las cookies se refrescan desde proxy.ts.
        }
      },
    },
  });
}
