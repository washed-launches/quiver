import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const platformHosts = new Set([
  "localhost",
  "127.0.0.1",
  "quiver.app",
  "www.quiver.app",
  "sites.quiver.app",
  "quiver.diy",
  "www.quiver.diy",
]);

export function middleware(req: NextRequest) {
  const host = (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "")
    .split(":")[0]
    .toLowerCase();

  if (
    !host
    || platformHosts.has(host)
    || host.endsWith(".localhost")
    || host.endsWith(".up.railway.app")
    || host.endsWith(".railway.app")
  ) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith("/host")) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/host";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|art|quiver.pdf|favicon.ico).*)"],
};
