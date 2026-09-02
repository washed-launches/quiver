import { apiUrl } from "./addresses";

export type SiteRecord = {
  id: string;
  slug: string;
  token: string;
  curve: string;
  creator: string;
  name: string;
  symbol: string;
  logo: string;
  description: string;
  twitter: string;
  telegram: string;
  website: string;
  theme: string;
  hostname: string;
  hostnameVerified: boolean;
  trades?: {
    id: string;
    side: string;
    actor: string;
    quote: string;
    tokens: string;
    txHash: string;
    createdAt: string;
  }[];
};

export async function fetchSite(slug: string): Promise<SiteRecord | null> {
  const res = await fetch(`${apiUrl}/sites/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchSiteByHost(host: string): Promise<SiteRecord | null> {
  const res = await fetch(`${apiUrl}/sites/by-host/${host}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchCreatorSites(creator: string): Promise<SiteRecord[]> {
  const res = await fetch(`${apiUrl}/sites?creator=${creator}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function saveSite(body: Partial<SiteRecord> & { slug: string; token: string; curve: string; creator: string; name: string; symbol: string }) {
  const res = await fetch(`${apiUrl}/sites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to save site");
  return res.json();
}

export async function verifyDomain(slug: string, hostname: string) {
  const res = await fetch(`${apiUrl}/domains/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, hostname }),
  });
  return res.json();
}
