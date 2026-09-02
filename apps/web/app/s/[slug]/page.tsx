import { notFound } from "next/navigation";
import { fetchSite } from "@/lib/api";
import { TradePanel } from "@/components/trade-panel";

export default async function SitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await fetchSite(slug);
  if (!site) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="overflow-hidden pixel-panel">
        <img src="/art/meadow.png" alt="" className="h-40 w-full object-cover" />
        <div className="p-6">
          <p className="font-pixel text-[10px] text-moss">White-label curve · 0% protocol fee</p>
          <h1 className="mt-2 font-pixel text-3xl text-forest">
            {site.name} <span className="text-mist">${site.symbol}</span>
          </h1>
          <p className="mt-3 max-w-2xl">{site.description || "A forever curve on its own site."}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <TradeChart trades={site.trades ?? []} symbol={site.symbol} />
        <TradePanel site={site} />
      </div>
    </div>
  );
}

function TradeChart({
  trades,
  symbol,
}: {
  trades: { side: string; quote: string; tokens: string; createdAt: string }[];
  symbol: string;
}) {
  return (
    <section className="pixel-panel p-5">
      <h2 className="font-pixel text-sm text-forest">Tape · {symbol}</h2>
      <div className="mt-4 min-h-48">
        {trades.length === 0 ? (
          <p className="text-mist">No indexed trades yet. Buys and sells will land here.</p>
        ) : (
          <ul className="space-y-2 font-body text-sm">
            {trades.slice(-20).reverse().map((t, i) => (
              <li key={`${t.createdAt}-${i}`} className="flex justify-between border-b border-forest/20 pb-1">
                <span className={t.side === "buy" ? "text-moss" : "text-bark"}>{t.side}</span>
                <span>{t.tokens} tok</span>
                <span>{t.quote} wei</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
