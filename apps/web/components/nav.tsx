import Link from "next/link";
import { WalletButton } from "./wallet-button";

const links = [
  ["Launch", "/launch"],
  ["Site", "/dashboard"],
  ["$QUIVER", "/quiver"],
  ["Docs", "/docs"],
  ["Paper", "/whitepaper"],
] as const;

export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-page items-center justify-between gap-6 px-5 py-3.5">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-pixel text-[17px] leading-none tracking-wide text-forest">QUIVER</span>
          <span className="hidden font-ui text-[11px] uppercase tracking-[0.16em] text-mist sm:inline">
            bonding curves
          </span>
        </Link>
        <nav className="flex items-center gap-5">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`font-ui text-[12px] tracking-[0.04em] text-ink/80 hover:text-forest ${href === "/launch" ? "" : "hidden sm:inline"}`}
            >
              {label}
            </Link>
          ))}
          <WalletButton />
        </nav>
      </div>
    </header>
  );
}
