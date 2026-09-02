import { ponsTradeUrl } from "@quiver/sdk";
import { addresses } from "@/lib/addresses";
import { ponsApp } from "@/lib/addresses";

export default function QuiverTokenPage() {
  const url = ponsTradeUrl(addresses.quiverToken);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="overflow-hidden pixel-panel">
        <img src="/art/canopy.png" alt="Pixel trees" className="h-56 w-full object-cover" />
        <div className="p-8">
          <p className="font-pixel text-[10px] text-moss">Protocol token · launched on PONS</p>
          <h1 className="mt-2 font-pixel text-4xl text-forest">$QUIVER</h1>
          <p className="mt-4 font-body text-lg leading-8">
            We did not put the protocol token on our own forever curve. We launched it on PONS, the
            social moat on Robinhood Chain. Subscription ETH from QUIVER sites buys $QUIVER on that
            venue — curve first, Uniswap v4 after graduation — and sits in the protocol treasury.
          </p>
          <p className="mt-4 font-body text-lg leading-8">
            That is the product in one line: we rented distribution once. You rent software, not a
            storefront.
          </p>
          <a href={url} className="pixel-btn-sun mt-6 inline-block" target="_blank" rel="noreferrer">
            Trade on PONS
          </a>
          <p className="mt-4 text-sm text-mist">
            Opens {ponsApp}. There is no QUIVER bonding curve on this site.
          </p>
        </div>
      </div>
    </div>
  );
}
