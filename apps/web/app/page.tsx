import Link from "next/link";
import { CurveGraphic } from "@/components/curve-graphic";

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto grid max-w-page items-end gap-12 px-5 pb-6 pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:pt-24">
        <div>
          <p className="eyebrow">Robinhood Chain</p>
          <h1 className="mt-5 max-w-xl font-display text-[44px] leading-[1.05] tracking-tight text-forest sm:text-[56px]">
            A bonding curve
            <br />
            on your own site.
          </h1>
          <p className="mt-6 max-w-md font-body text-[18px] leading-8 text-ink/80">
            Pay a monthly fee, put the token on your domain, keep every trade. We don’t take a cut. That’s
            the whole product.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/launch" className="btn-primary">
              Start a site
            </Link>
            <Link href="/docs" className="btn-secondary">
              How it works
            </Link>
          </div>
        </div>
        <CurveGraphic caption="price goes up as people buy" />
      </section>

      <div className="mx-auto max-w-page px-5">
        <div className="rule my-16" />
      </div>

      <section className="mx-auto grid max-w-page gap-12 px-5 md:grid-cols-3">
        <article>
          <h2 className="font-display text-[22px] text-forest">One token, one page</h2>
          <p className="mt-3 font-body text-[16px] leading-7 text-ink/75">
            No launchpad feed sitting next to you. Traders hit your URL and buy. That’s it.
          </p>
        </article>
        <article>
          <h2 className="font-display text-[22px] text-forest">0.05 ETH / month</h2>
          <p className="mt-3 font-body text-[16px] leading-7 text-ink/75">
            Or 0.45 ETH a year. Whatever you pay gets used to buy $QUIVER. We don’t skim your volume.
          </p>
        </article>
        <article>
          <h2 className="font-display text-[22px] text-forest">Use your domain</h2>
          <p className="mt-3 font-body text-[16px] leading-7 text-ink/75">
            Starts at /s/yourname. Point a CNAME at us when you want it on your own site.
          </p>
        </article>
      </section>

      <section className="mx-auto mt-20 max-w-page px-5">
        <div className="grid items-start gap-10 border-t border-rule pt-16 lg:grid-cols-[0.42fr_1fr]">
          <CurveGraphic tall caption="same curve, no graduation" />
          <div className="max-w-xl lg:pt-4">
            <h2 className="font-display text-[34px] leading-tight text-forest">
              If you already have an audience, a launchpad is a tax.
            </h2>
            <p className="mt-5 font-body text-[18px] leading-8 text-ink/80">
              Those sites are useful if you need people to show up. They charge you for that forever — a
              slice of every buy and sell — and your token lives under their name.
            </p>
            <p className="mt-4 font-body text-[18px] leading-8 text-ink/80">
              Quiver is just the curve and a page. $QUIVER itself is on PONS, because that’s where people
              already trade. We ate the fee once. You don’t have to.
            </p>
            <Link href="/quiver" className="btn-primary mt-8">
              $QUIVER on PONS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
