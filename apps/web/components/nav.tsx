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
      <div className="mx-auto flex max-w-page items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <Link href="/" className="shrink-0">
          <span className="font-pixel text-[17px] leading-none tracking-wide text-forest">QUIVER</span>
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="font-ui text-[12px] tracking-[0.04em] text-ink/80 hover:text-forest">
              {label}
            </Link>
          ))}
          <WalletButton />
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <WalletButton />
          <details className="relative">
            <summary className="btn-secondary cursor-pointer list-none px-3 py-2 text-[12px] [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <div className="absolute right-0 z-30 mt-2 w-44 border border-rule bg-paper p-3 shadow-sm">
              {links.map(([label, href]) => (
                <Link key={href} href={href} className="block py-2 font-ui text-[13px] text-ink hover:text-forest">
                  {label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
