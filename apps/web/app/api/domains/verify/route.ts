import { NextResponse } from "next/server";
import { verifyCname } from "@/lib/dns";
import { getStoredSite, upsertStoredSite } from "@/lib/site-store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.slug || !body?.hostname) return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  const hostname = String(body.hostname).trim().toLowerCase();
  const dns = await verifyCname(hostname);
  const prev = getStoredSite(body.slug);
  const site = upsertStoredSite({
    slug: body.slug,
    token: prev?.token ?? "",
    curve: prev?.curve ?? "",
    creator: prev?.creator ?? "",
    name: prev?.name ?? body.slug,
    symbol: prev?.symbol ?? "",
    hostname,
    hostnameVerified: dns.ok,
  });
  return NextResponse.json({ site, dns });
}
