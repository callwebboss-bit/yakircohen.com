import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/site-url";

const INDEXNOW_KEY = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6";

/**
 * POST /api/indexnow
 * Submits all sitemap URLs to IndexNow (Bing + Google via Bing).
 * Call this after each production deploy via a Vercel Deploy Hook.
 *
 * Secured by CRON_SECRET env var to prevent unauthorized submissions.
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sitemapRes = await fetch(`${SITE_URL}/sitemap.xml`);
  const sitemapXml = await sitemapRes.text();

  const urlMatches = sitemapXml.match(/<loc>(.*?)<\/loc>/g) ?? [];
  const urls = urlMatches.map((m) => m.replace(/<\/?loc>/g, ""));

  const body = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  return NextResponse.json(
    { submitted: urls.length, indexnowStatus: res.status },
    { status: res.ok ? 200 : 502 },
  );
}
