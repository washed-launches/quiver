import { notFound } from "next/navigation";
import { fetchSite } from "@/lib/api";
import { TradePanel } from "@/components/trade-panel";

export default async function SitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await fetchSite(slug);
  if (!site) notFound();

  return (
    <div className="mx-auto max-w-page px-5 py-14">
      <p className="eyebrow">Bonding curve · no protocol fee</p>
      <div className="mt-4 flex flex-col gap-6 border-b border-rule pb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-5xl text-forest">{site.name}</h1>
          <p className="mt-2 font-ui text-sm tracking-wide text-mist">${site.symbol}</p>
          <p className="mt-4 max-w-xl text-lg text-ink/75">
            {site.description || "Buy and sell against the curve."}
          </p>
        </div>
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
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
    <section>
      <p className="label">Tape · {symbol}</p>
      <div className="min-h-48 border-t border-rule pt-4">
        {trades.length === 0 ? (
          <p className="text-mist">No trades indexed yet.</p>
        ) : (
          <ul className="space-y-2 font-ui text-sm">
            {trades
              .slice(-20)
              .reverse()
              .map((t, i) => (
                <li key={`${t.createdAt}-${i}`} className="flex justify-between border-b border-rule py-2">
                  <span className={t.side === "buy" ? "text-moss" : "text-bark"}>{t.side}</span>
                  <span className="text-mist">{t.tokens}</span>
                  <span>{t.quote}</span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </section>
  );
}
