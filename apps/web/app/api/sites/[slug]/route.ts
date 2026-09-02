import { NextResponse } from "next/server";
import { resolveSite } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await resolveSite(slug);
  if (!site) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(site);
}
