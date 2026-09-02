import { ponsTradeUrl } from "@quiver/sdk";
import { CurveGraphic } from "@/components/curve-graphic";
import { addresses, ponsApp } from "@/lib/addresses";

export default function QuiverTokenPage() {
  const url = ponsTradeUrl(addresses.quiverToken);
  return (
    <div className="mx-auto grid max-w-page items-start gap-12 px-5 py-16 lg:grid-cols-[0.42fr_1fr]">
      <CurveGraphic tall caption="$QUIVER trades on PONS, not here" />
      <div className="max-w-xl lg:pt-2">
        <p className="eyebrow">On PONS</p>
        <h1 className="mt-4 font-display text-5xl text-forest">$QUIVER</h1>
        <p className="mt-6 font-body text-[18px] leading-8 text-ink/80">
          The token isn’t on a Quiver curve. It’s a PONS launch. Sub payments buy it there and the
          tokens sit in the treasury.
        </p>
        <p className="mt-4 font-body text-[18px] leading-8 text-ink/80">
          Yeah, we used a launchpad. That’s kind of the point — we needed their crowd. If you already
          have one, skip that.
        </p>
        <a href={url} className="btn-primary mt-8" target="_blank" rel="noreferrer">
          Trade on PONS
        </a>
        <p className="mt-4 font-ui text-[12px] text-mist">Sends you to {ponsApp}.</p>
      </div>
    </div>
  );
}
