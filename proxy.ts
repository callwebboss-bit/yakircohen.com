import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Edge proxy (Next.js 16):
 * Rewrite `/home` → `/` to break redirect loops from legacy edge rules.
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
