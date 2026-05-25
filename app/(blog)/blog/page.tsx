import type { Metadata } from "next";
import ArticleFeed, {
  type BlogPost as FeedPost,
} from "@/components/blog/ArticleFeed";
import { BLOG_POSTS, type BlogPost } from "@/lib/data/blog";
import { SITE_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/site-url";

const canonical = absoluteUrl("blog");

export const metadata: Metadata = {
  title: `מגזין מקצועי | ${SITE_NAME}`,
  description:
    "טיפים, מדריכים ותובנות מהאולפן - פודקאסט, הקלטה ועריכת סאונד.",
  alternates: {
    canonical,
    languages: { "he-IL": canonical },
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: canonical,
    siteName: SITE_NAME,
    title: `מגזין מקצועי | ${SITE_NAME}`,
    description:
      "טיפים, מדריכים ותובנות מהאולפן - פודקאסט, הקלטה ועריכת סאונד.",
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Registry → ArticleFeed view-model adapter.

   The registry's BlogPost uses `thumbnail` for the image path and nests the
   ISO date inside `seo.datePublished`. ArticleFeed's BlogPost uses `imageSrc`
   and a top-level `publishedAt` string. We map between them here so the
   component stays decoupled from the data layer.
   ───────────────────────────────────────────────────────────────────────────── */

const feedPosts: FeedPost[] = [...BLOG_POSTS].map(
  (post: BlogPost): FeedPost => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.seo.datePublished,
    category: post.category,
    imageSrc: post.thumbnail,
    imageAlt: post.title,
  }),
);

/* ─────────────────────────────────────────────────────────────────────────────
   Decorative editorial mark - purely visual, aria-hidden.
   ───────────────────────────────────────────────────────────────────────────── */

function BlogEditorialMark() {
  return (
    <svg
      viewBox="0 0 120 24"
      className="h-5 w-auto text-brand-red"
      aria-hidden="true"
      focusable="false"
    >
      <line
        x1="0"
        y1="12"
        x2="40"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="50" cy="12" r="4" fill="currentColor" />
      <circle cx="60" cy="12" r="2" fill="currentColor" />
      <circle cx="70" cy="12" r="4" fill="currentColor" />
      <line
        x1="80"
        y1="12"
        x2="120"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   BlogFeedPage - Server Component.
   ───────────────────────────────────────────────────────────────────────────── */

export default function BlogFeedPage() {
  return (
    <div className="bg-background">
      {/* ── Dark hero ── */}
      <section
        className="relative overflow-hidden border-b border-border bg-surface text-foreground"
        aria-labelledby="blog-hero-heading"
      >
        {/* Gold radial glow */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_80%_-10%,rgba(212,43,43,0.18),transparent_55%)]"
          aria-hidden="true"
        />
        {/* Gold bottom edge line */}
        <div
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-red/50 to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[72rem] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <BlogEditorialMark />

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-brand-red">
            מגזין {SITE_NAME}
          </p>

          <h1
            id="blog-hero-heading"
            className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
          >
            ידע מקצועי מהאולפן והשטח
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            מדריכים פרקטיים לפודקאסט, הקלטה, שחזור סאונד והפקה - כתובים
            בבהירות, בלי רעש מיותר.
          </p>
        </div>
      </section>

      {/* ── Article feed ── */}
      {/*
       * ArticleFeed renders a featured hero article followed by compact editorial
       * rows. All images use next/image with blurDataURL placeholders - CLS = 0.
       * No client JS on this page - purely static Server Component.
       */}
      <div className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <ArticleFeed posts={feedPosts} />
      </div>
    </div>
  );
}
