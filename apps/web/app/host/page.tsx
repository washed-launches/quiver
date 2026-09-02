import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { TradePanel } from "@/components/trade-panel";
import { fetchSiteByHost } from "@/lib/api";

export default async function HostPage() {
  const headerStore = await headers();
  const host = (headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "")
    .split(":")[0]
    .toLowerCase();
  const site = await fetchSiteByHost(host);
  if (!site) notFound();

  return (
    <div className="mx-auto max-w-page px-5 py-14">
      <p className="eyebrow">{host}</p>
      <h1 className="mt-3 font-display text-5xl text-forest">{site.name}</h1>
      <p className="mt-2 font-ui text-sm text-mist">${site.symbol}</p>
      <p className="mt-4 max-w-xl text-lg text-ink/75">{site.description}</p>
      <div className="mt-10 max-w-md">
        <TradePanel site={site} />
      </div>
    </div>
  );
}
