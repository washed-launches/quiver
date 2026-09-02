import { createPublicClient, http, zeroAddress } from "viem";
import { erc20Abi, registryAbi } from "@quiver/sdk";
import { addresses, isDeployed } from "./addresses";
import type { SiteRecord } from "./site-types";
import { robinhoodChain } from "./wagmi";

const client = createPublicClient({
  chain: robinhoodChain,
  transport: http(robinhoodChain.rpcUrls.default.http[0]),
});

function emptySite(partial: Partial<SiteRecord> & { slug: string; token: string; curve: string; creator: string }): SiteRecord {
  return {
    id: partial.slug,
    slug: partial.slug,
    token: partial.token,
    curve: partial.curve,
    creator: partial.creator,
    name: partial.name ?? partial.slug,
    symbol: partial.symbol ?? "",
    logo: "",
    description: partial.description ?? "",
    twitter: "",
    telegram: "",
    website: "",
    theme: "forest",
    hostname: "",
    hostnameVerified: false,
    trades: [],
  };
}

export async function fetchSiteOnchain(slug: string): Promise<SiteRecord | null> {
  if (!isDeployed(addresses.registry)) return null;
  try {
    const site = await client.readContract({
      address: addresses.registry,
      abi: registryAbi,
      functionName: "getBySlug",
      args: [slug],
    });
    if (!site.token || site.token === zeroAddress) return null;
    let name = site.slug;
    let symbol = "";
    try {
      [name, symbol] = await Promise.all([
        client.readContract({ address: site.token, abi: erc20Abi, functionName: "name" }),
        client.readContract({ address: site.token, abi: erc20Abi, functionName: "symbol" }),
      ]);
    } catch {
      // token metadata is optional
    }
    return emptySite({
      slug: site.slug || slug.toLowerCase(),
      token: site.token,
      curve: site.curve,
      creator: site.creator,
      name,
      symbol,
    });
  } catch {
    return null;
  }
}

export async function fetchCreatorSitesOnchain(creator: string): Promise<SiteRecord[]> {
  if (!isDeployed(addresses.registry)) return [];
  try {
    const count = await client.readContract({
      address: addresses.registry,
      abi: registryAbi,
      functionName: "siteCount",
    });
    const out: SiteRecord[] = [];
    for (let i = 0n; i < count; i++) {
      const token = await client.readContract({
        address: addresses.registry,
        abi: registryAbi,
        functionName: "tokens",
        args: [i],
      });
      const site = await client.readContract({
        address: addresses.registry,
        abi: registryAbi,
        functionName: "getSite",
        args: [token],
      });
      if (site.creator.toLowerCase() !== creator.toLowerCase()) continue;
      const resolved = await fetchSiteOnchain(site.slug);
      if (resolved) out.push(resolved);
    }
    return out;
  } catch {
    return [];
  }
}
