import { NextResponse } from "next/server";
import { resolveCreatorSites } from "@/lib/api";
import { listStoredSites, upsertStoredSite } from "@/lib/site-store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const creator = new URL(req.url).searchParams.get("creator");
  if (creator) return NextResponse.json(await resolveCreatorSites(creator));
  return NextResponse.json(listStoredSites());
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.slug || !body?.token || !body?.curve || !body?.creator) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  return NextResponse.json(upsertStoredSite(body));
}
