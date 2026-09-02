import { addresses, isDeployed } from "./addresses";

export const SITE_HOST = process.env.NEXT_PUBLIC_SITE_HOST ?? "quiver.diy";

export const reservedSlugs = new Set([
  "launch",
  "dashboard",
  "quiver",
  "docs",
  "whitepaper",
  "host",
  "api",
  "s",
  "art",
]);

export function contractsLive() {
  return isDeployed(addresses.factory) && isDeployed(addresses.subscription);
}

export function publicUrl(slug: string) {
  return `${SITE_HOST}/${slug.toLowerCase()}`;
}
