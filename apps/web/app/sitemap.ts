import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/launch", "/docs", "/quiver", "/whitepaper", "/docs/creator-guide", "/docs/contracts", "/docs/chain"];
  return pages.map((path) => ({
    url: `https://quiver.diy${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.6,
  }));
}
