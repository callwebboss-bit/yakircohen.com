import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Edge proxy (Next.js 16):
 * - Rewrite `/home` → `/` to break redirect loops from legacy edge rules
 * - Inject `x-pathname` for server-rendered BreadcrumbList JSON-LD
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/home" || pathname === "/home/") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.rewrite(url);
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/home",
    "/home/",
    "/((?!api|_next/static|_next/image|favicon.ico|images|pagefind|.*\\..*).*)",
  ],
};
