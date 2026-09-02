import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b-[3px] border-forest">
        <img
          src="/art/meadow.png"
          alt="Pixel forest clearing"
          className="h-[420px] w-full object-cover sm:h-[520px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-4 pb-12">
            <p className="font-pixel text-[10px] text-sun">Robinhood Chain · 0% protocol take</p>
            <h1 className="mt-3 max-w-3xl font-pixel text-3xl leading-tight text-cream sm:text-5xl">
              Three clicks. Your site. Your domain. One curve.
            </h1>
            <p className="mt-4 max-w-2xl font-body text-lg text-cream/90">
              Launchpads sell you their social moat and take a cut of every trade. QUIVER rents you the
              tooling. The market lives on your brand. We take nothing on volume.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/launch" className="pixel-btn-sun inline-block">
                Start a site
              </Link>
              <Link href="/docs" className="pixel-btn inline-block bg-cream text-forest">
                Read the thesis
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
        {[
          {
            title: "Not a launchpad",
            body: "No feed. No casino homepage. No one else's ticker next to yours. One token, one forever curve, your URL.",
          },
          {
            title: "Subscription, not take-rate",
            body: "0.05 ETH / 30 days or 0.45 ETH / year. 100% of that ETH buys $QUIVER on PONS. Zero bps on your traders.",
          },
          {
            title: "Your domain",
            body: "Ship on slug.quiver or point a CNAME. Traders never have to learn a launchpad to find you.",
          },
        ].map((card) => (
          <article key={card.title} className="pixel-panel p-5">
            <h2 className="font-pixel text-sm text-forest">{card.title}</h2>
            <p className="mt-3 font-body text-ink/85">{card.body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="pixel-panel grid gap-0 overflow-hidden md:grid-cols-2">
          <img src="/art/canopy.png" alt="Pixel tree canopy" className="h-full min-h-64 w-full object-cover" />
          <div className="p-8">
            <h2 className="font-pixel text-xl text-forest">The pricing flip</h2>
            <p className="mt-4 font-body text-lg leading-8">
              The curve itself is commoditized. Launchpads win on credibility, visibility, and a network
              that shows up on day one. If you already have distribution, you are paying a percentage of
              every trade for a moat you brought yourself — and wearing their brand while you do it.
            </p>
            <p className="mt-4 font-body text-lg leading-8">
              QUIVER charges for the software. $QUIVER, the protocol token, launched on PONS. That is the
              joke, and the point: we rented a social moat once. You do not have to.
            </p>
            <Link href="/quiver" className="pixel-btn-sun mt-6 inline-block">
              Trade $QUIVER on PONS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
