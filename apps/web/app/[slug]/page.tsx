import { notFound } from "next/navigation";
import { SiteView } from "@/components/site-view";
import { fetchSite } from "@/lib/api";
import { reservedSlugs } from "@/lib/site";

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (reservedSlugs.has(slug.toLowerCase())) notFound();
  const site = await fetchSite(slug);
  if (!site) notFound();
  return <SiteView site={site} />;
}
