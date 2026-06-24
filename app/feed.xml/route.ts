import { BLOG_POSTS } from "@/lib/data/blog";
import { SITE_URL } from "@/lib/site-url";
import { SITE_NAME } from "@/lib/constants";

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  const posts = [...BLOG_POSTS].reverse().slice(0, 50);

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = new Date(post.seo.datePublished).toUTCString();
      const escapedTitle = post.seo.title
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const escapedDesc = post.seo.description
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `    <item>
      <title>${escapedTitle}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapedDesc}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} - בלוג</title>
    <link>${SITE_URL}/blog</link>
    <description>טיפים, מדריכים וסיפורים על הקלטות, פודקאסט, DJ ושחזור סאונד ב-AI</description>
    <language>he</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
