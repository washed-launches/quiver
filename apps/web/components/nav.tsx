import Link from "next/link";
import { WalletButton } from "./wallet-button";

export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b-[3px] border-forest bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-pixel text-lg text-forest">QUIVER</span>
          <span className="hidden font-body text-sm text-mist sm:inline">own your curve</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/launch" className="font-pixel text-[10px] text-forest hover:text-moss">
            Launch
          </Link>
          <Link href="/dashboard" className="font-pixel text-[10px] text-forest hover:text-moss">
            Site
          </Link>
          <Link href="/quiver" className="font-pixel text-[10px] text-forest hover:text-moss">
            $QUIVER
          </Link>
          <Link href="/docs" className="font-pixel text-[10px] text-forest hover:text-moss">
            Docs
          </Link>
          <Link href="/whitepaper" className="font-pixel text-[10px] text-forest hover:text-moss">
            Paper
          </Link>
          <WalletButton />
        </nav>
      </div>
    </header>
  );
}
