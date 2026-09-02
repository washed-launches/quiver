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
    <div className="mx-auto max-w-page px-4 py-10 sm:px-5 sm:py-14">
      <p className="eyebrow break-all">{host}</p>
      <h1 className="mt-3 break-words font-display text-4xl text-forest sm:text-5xl">{site.name}</h1>
      <p className="mt-2 font-ui text-sm text-mist">${site.symbol}</p>
      <p className="mt-4 max-w-xl text-lg text-ink/75">{site.description}</p>
      <div className="mt-10 max-w-md">
        <TradePanel site={site} />
      </div>
    </div>
  );
}
