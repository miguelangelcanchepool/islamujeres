export type PublicSponsor = {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
};

export type PublicSponsorsResult = { ok: true; sponsors: PublicSponsor[] } | { ok: false };
