import Link from "next/link";
import { contractsLive } from "@/lib/site";

export function PreviewBanner() {
  if (contractsLive()) return null;
  return (
    <div className="border-b border-[#e4d3a0] bg-[#f3e6b8] px-4 py-2 sm:px-5">
      <p className="mx-auto max-w-page text-center font-ui text-[12px] leading-5 text-forest sm:text-[13px]">
        Preview only — not a live market.{" "}
        <Link href="/launch" className="underline underline-offset-2">
          Make your own page
        </Link>
        . Don’t trade someone else’s slug.
      </p>
    </div>
  );
}
