import { NextResponse } from "next/server";
import { storedStats } from "@/lib/site-store";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(storedStats());
}
