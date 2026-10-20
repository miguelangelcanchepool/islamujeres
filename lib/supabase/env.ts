/**
 * Variables de Supabase solo en el servidor.
 * No uses el prefijo NEXT_PUBLIC_ ni la clave service_role.
 */
export function readSupabaseEnv(): { url: string; anonKey: string } | null {
  const url = process.env.SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.SUPABASE_ANON_KEY?.trim() ?? "";
  if (!url || !anonKey) return null;
  return { url, anonKey };
}
