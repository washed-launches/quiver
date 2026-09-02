import type { SiteRecord } from "./site-types";

const sites = new Map<string, SiteRecord>();

export function getStoredSite(slug: string): SiteRecord | undefined {
  return sites.get(slug.toLowerCase());
}

export function listStoredSites(creator?: string): SiteRecord[] {
  const all = [...sites.values()];
  if (!creator) return all;
  return all.filter((s) => s.creator.toLowerCase() === creator.toLowerCase());
}

export function upsertStoredSite(input: Partial<SiteRecord> & { slug: string }): SiteRecord {
  const slug = input.slug.toLowerCase();
  const prev = sites.get(slug);
  const next: SiteRecord = {
    id: prev?.id ?? slug,
    slug,
    token: (input.token ?? prev?.token ?? "").toLowerCase(),
    curve: (input.curve ?? prev?.curve ?? "").toLowerCase(),
    creator: (input.creator ?? prev?.creator ?? "").toLowerCase(),
    name: input.name ?? prev?.name ?? slug,
    symbol: input.symbol ?? prev?.symbol ?? "",
    logo: input.logo ?? prev?.logo ?? "",
    description: input.description ?? prev?.description ?? "",
    twitter: input.twitter ?? prev?.twitter ?? "",
    telegram: input.telegram ?? prev?.telegram ?? "",
    website: input.website ?? prev?.website ?? "",
    theme: input.theme ?? prev?.theme ?? "forest",
    hostname: input.hostname ?? prev?.hostname ?? "",
    hostnameVerified: input.hostnameVerified ?? prev?.hostnameVerified ?? false,
    trades: input.trades ?? prev?.trades ?? [],
  };
  sites.set(slug, next);
  return next;
}

export function storedStats() {
  return {
    sites: sites.size,
    trades: [...sites.values()].reduce((n, s) => n + (s.trades?.length ?? 0), 0),
  };
}
