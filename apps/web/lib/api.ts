import { fetchCreatorSitesOnchain, fetchSiteOnchain } from "./onchain-sites";
import { getStoredSite, listStoredSites, upsertStoredSite } from "./site-store";
import type { SiteRecord } from "./site-types";

export type { SiteRecord } from "./site-types";

function mergeSite(onchain: SiteRecord | null, stored?: SiteRecord): SiteRecord | null {
  if (!onchain && !stored) return null;
  if (!onchain) return stored ?? null;
  if (!stored) return onchain;
  return {
    ...onchain,
    description: stored.description || onchain.description,
    logo: stored.logo || onchain.logo,
    twitter: stored.twitter,
    telegram: stored.telegram,
    website: stored.website,
    theme: stored.theme,
    hostname: stored.hostname,
    hostnameVerified: stored.hostnameVerified,
    trades: stored.trades?.length ? stored.trades : onchain.trades,
  };
}

export async function resolveSite(slug: string): Promise<SiteRecord | null> {
  return mergeSite(await fetchSiteOnchain(slug), getStoredSite(slug));
}

export async function resolveCreatorSites(creator: string): Promise<SiteRecord[]> {
  const [onchain, stored] = await Promise.all([fetchCreatorSitesOnchain(creator), Promise.resolve(listStoredSites(creator))]);
  const bySlug = new Map<string, SiteRecord>();
  for (const site of [...onchain, ...stored]) {
    bySlug.set(site.slug, mergeSite(bySlug.get(site.slug) ?? null, site) ?? site);
  }
  return [...bySlug.values()];
}

export async function fetchSite(slug: string): Promise<SiteRecord | null> {
  if (typeof window === "undefined") return resolveSite(slug);
  const res = await fetch(`/api/sites/${slug}`, { cache: "no-store" });
  if (!res.ok) return resolveSite(slug);
  return res.json();
}

export async function fetchSiteByHost(host: string): Promise<SiteRecord | null> {
  if (typeof window === "undefined") {
    return listStoredSites().find((s) => s.hostname === host.toLowerCase() && s.hostnameVerified) ?? null;
  }
  const res = await fetch(`/api/sites/by-host/${host}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchCreatorSites(creator: string): Promise<SiteRecord[]> {
  if (typeof window === "undefined") return resolveCreatorSites(creator);
  const res = await fetch(`/api/sites?creator=${creator}`, { cache: "no-store" });
  if (!res.ok) return resolveCreatorSites(creator);
  return res.json();
}

export async function saveSite(
  body: Partial<SiteRecord> & { slug: string; token: string; curve: string; creator: string; name: string; symbol: string },
) {
  if (typeof window === "undefined") return upsertStoredSite(body);
  const res = await fetch("/api/sites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return upsertStoredSite(body);
  return res.json();
}

export async function verifyDomain(slug: string, hostname: string) {
  const res = await fetch("/api/domains/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, hostname }),
  });
  return res.json();
}
