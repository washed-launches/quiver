import { NextResponse } from "next/server";
import { listStoredSites } from "@/lib/site-store";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ host: string }> }) {
  const { host } = await params;
  const site = listStoredSites().find((s) => s.hostname === host.toLowerCase() && s.hostnameVerified);
  if (!site) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(site);
}
