import Link from "next/link";
import { CurveGraphic } from "@/components/curve-graphic";

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto grid max-w-page items-start gap-10 px-4 pb-6 pt-10 sm:px-5 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:pt-24">
        <div>
          <p className="eyebrow">Robinhood Chain</p>
          <h1 className="mt-4 max-w-xl font-display text-[36px] leading-[1.08] tracking-tight text-forest sm:mt-5 sm:text-[56px]">
            A bonding curve
            <br />
            on your own site.
          </h1>
          <p className="mt-6 max-w-md font-body text-[18px] leading-8 text-ink/80">
            Pay a monthly fee, put the token on your domain, keep every trade. We don’t take a cut. That’s
            the whole product.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/launch" className="btn-primary w-full sm:w-auto">
              Start a site
            </Link>
            <Link href="/docs" className="btn-secondary w-full sm:w-auto">
              How it works
            </Link>
          </div>
        </div>
        <CurveGraphic caption="price goes up as people buy" />
      </section>

      <div className="mx-auto max-w-page px-4 sm:px-5">
        <div className="rule my-12 sm:my-16" />
      </div>

      <section className="mx-auto grid max-w-page gap-10 px-4 sm:px-5 md:grid-cols-3 md:gap-12">
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
            Lives at quiver.diy/yourname. Point your own domain at it later if you want.
          </p>
        </article>
      </section>

      <section className="mx-auto mt-14 max-w-page px-4 sm:mt-20 sm:px-5">
        <div className="grid items-start gap-10 border-t border-rule pt-12 sm:pt-16 lg:grid-cols-[0.42fr_1fr]">
          <CurveGraphic tall caption="same curve, no graduation" />
          <div className="max-w-xl lg:pt-4">
            <h2 className="font-display text-[28px] leading-tight text-forest sm:text-[34px]">
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
            <Link href="/quiver" className="btn-primary mt-8 w-full sm:w-auto">
              $QUIVER on PONS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
