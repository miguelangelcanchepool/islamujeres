export type SponsorDraft = {
  name: string;
  active: boolean;
  website: string | null;
};

export type SponsorFormState = {
  error?: string;
  fields?: Partial<Record<"name" | "logo" | "website", string>>;
} | null;

const nameLimit = 80;
const websiteLimit = 2000;

export function parseSponsorForm(
  formData: FormData,
): { ok: true; value: SponsorDraft } | { ok: false; state: SponsorFormState } {
  const name = String(formData.get("name") ?? "")
    .trim()
    .replace(/\s+/g, " ");
  const fields: Partial<Record<"name" | "website", string>> = {};

  if (!name) fields.name = "Escribe el nombre.";
  else if (name.length > nameLimit) fields.name = "El nombre admite hasta 80 caracteres.";

  const website = parseSponsorWebsite(String(formData.get("website_url") ?? ""));
  if (!website.ok) fields.website = website.error;

  if (fields.name || fields.website) {
    return { ok: false, state: { error: "Revisa los campos marcados.", fields } };
  }

  return {
    ok: true,
    value: {
      name,
      active: formData.get("is_active") === "on",
      website: website.ok ? website.website : null,
    },
  };
}

/** Enlace público http(s): sitio web, Facebook, Instagram o WhatsApp. Vacío significa sin enlace. */
export function parseSponsorWebsite(
  value: string,
): { ok: true; website: string | null } | { ok: false; error: string } {
  const raw = value.trim();
  if (!raw) return { ok: true, website: null };
  if (raw.length > websiteLimit) return { ok: false, error: "El enlace admite hasta 2000 caracteres." };
  if (/[\s]/.test(raw) || /^(javascript|data|file|blob|vbscript):/i.test(raw)) {
    return { ok: false, error: "Usa un enlace http o https de un sitio público." };
  }

  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return { ok: false, error: "El enlace no es válido. Incluye https://." };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, error: "Usa un enlace http o https." };
  }
  if (url.username || url.password) {
    return { ok: false, error: "El enlace no debe incluir usuario ni contraseña." };
  }
  if (!isPublicHost(url.hostname)) {
    return { ok: false, error: "Usa un sitio público: web, Facebook, Instagram o WhatsApp." };
  }

  return { ok: true, website: url.href };
}

function isPublicHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.+$/, "");
  if (!host || host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) return false;
  if (host === "0.0.0.0" || host === "::1" || host === "[::1]") return false;

  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const parts = ipv4.slice(1).map(Number);
    if (parts.some((part) => part > 255)) return false;
    const [a, b] = parts;
    if (a === 10 || a === 127 || a === 0) return false;
    if (a === 192 && b === 168) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 169 && b === 254) return false;
    return true;
  }

  return host.includes(".");
}

/** Solo para mostrar. La ruta del archivo se comprueba aparte, al borrar. */
export function safeLogoSrc(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    return parsed.href;
  } catch {
    return null;
  }
}
