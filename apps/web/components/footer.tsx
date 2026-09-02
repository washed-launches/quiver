import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto flex max-w-page flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-ui text-[11px] uppercase tracking-[0.16em] text-mist">
          Quiver on Robinhood Chain. No cut on trades.
        </p>
        <div className="flex gap-5 font-ui text-[12px] text-mist">
          <Link href="/docs" className="hover:text-forest">
            Docs
          </Link>
          <Link href="/whitepaper" className="hover:text-forest">
            Whitepaper
          </Link>
          <Link href="/quiver" className="hover:text-forest">
            $QUIVER
          </Link>
        </div>
      </div>
    </footer>
  );
}
