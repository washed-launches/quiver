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
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="pixel-panel p-6">
        <p className="font-pixel text-[10px] text-moss">{host}</p>
        <h1 className="mt-2 font-pixel text-3xl text-forest">
          {site.name} <span className="text-mist">${site.symbol}</span>
        </h1>
        <p className="mt-3">{site.description}</p>
      </div>
      <div className="mt-6">
        <TradePanel site={site} />
      </div>
    </div>
  );
}
