import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: photoRemotePatterns(),
  },
};

function photoRemotePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const storagePathnames = [
    "/storage/v1/object/public/place-photos/**",
    "/storage/v1/object/public/sponsor-logos/**",
  ] as const;
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = storagePathnames.map(
    (pathname) => ({
      protocol: "https",
      hostname: "*.supabase.co",
      pathname,
    }),
  );
  const raw = process.env.SUPABASE_URL?.trim();
  if (!raw) return patterns;

  try {
    const url = new URL(raw);
    if (url.hostname.endsWith(".supabase.co")) return patterns;
    for (const pathname of storagePathnames) {
      patterns.push({
        protocol: url.protocol === "http:" ? "http" : "https",
        hostname: url.hostname,
        pathname,
      });
    }
  } catch {
    return patterns;
  }

  return patterns;
}

export default nextConfig;
