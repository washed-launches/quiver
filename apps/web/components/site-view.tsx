import { TradePanel } from "@/components/trade-panel";
import type { SiteRecord } from "@/lib/api";
import { publicUrl } from "@/lib/site";

export function SiteView({ site }: { site: SiteRecord }) {
  const url = publicUrl(site.slug);

  return (
    <div className="mx-auto max-w-page px-4 py-10 sm:px-5 sm:py-14">
      <p className="eyebrow">{url}</p>
      <div className="mt-4 border-b border-rule pb-10">
        <h1 className="break-words font-display text-4xl text-forest sm:text-5xl">{site.name}</h1>
        <p className="mt-2 font-ui text-sm tracking-wide text-mist">${site.symbol}</p>
        <p className="mt-4 max-w-xl text-lg text-ink/75">
          {site.description || "Buy and sell against the curve."}
        </p>
        <p className="mt-5 max-w-xl text-[15px] leading-7 text-bark">
          This page is a preview of what a Quiver site looks like. It is not a real market. If you want
          a curve, create your own at /launch — don’t treat {url} as something to trade.
        </p>
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
          <p className="text-mist">No trades. Preview pages don’t have a live book.</p>
        ) : (
          <ul className="space-y-2 font-ui text-sm">
            {trades
              .slice(-20)
              .reverse()
              .map((t, i) => (
                <li key={`${t.createdAt}-${i}`} className="flex justify-between gap-3 border-b border-rule py-2">
                  <span className={t.side === "buy" ? "text-moss" : "text-bark"}>{t.side}</span>
                  <span className="min-w-0 truncate text-mist">{t.tokens}</span>
                  <span className="min-w-0 truncate text-right">{t.quote}</span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </section>
  );
}
