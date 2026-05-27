import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Break a redirect loop on www.yakircohen.com:
 * - `/` -> `/home` (301 from edge rules)
 * - `/home` -> `/` (Next legacy redirect)
 *
 * When Cloudflare/Vercel forces `/home`, we rewrite it to `/` so the page renders.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/home" || pathname === "/home/") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home", "/home/"],
};
