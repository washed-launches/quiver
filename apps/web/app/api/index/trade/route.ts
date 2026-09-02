import { NextResponse } from "next/server";
import { getStoredSite, upsertStoredSite } from "@/lib/site-store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();
  const site = getStoredSite(body.slug);
  if (!site) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const trade = {
    id: body.txHash,
    side: body.side,
    actor: body.actor,
    quote: body.quote,
    tokens: body.tokens,
    txHash: body.txHash,
    createdAt: new Date().toISOString(),
  };
  upsertStoredSite({
    ...site,
    trades: [...(site.trades ?? []).filter((t) => t.txHash !== trade.txHash), trade],
  });
  return NextResponse.json(trade);
}
