export const siteName = "Descubre Isla Mujeres";

export const siteDescription =
  "Guía digital para conocer Isla Mujeres, Quintana Roo: la isla, su historia, su mar, sus lugares y la manera de vivirla.";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const nav = [
  { href: "/la-isla", label: "La isla" },
  { href: "/el-mar", label: "El mar" },
  { href: "/lugares", label: "Lugares" },
  { href: "/la-mesa", label: "La mesa" },
  { href: "/vivirla", label: "Vivirla" },
] as const;
