import type { Metadata } from "next";
import Link from "next/link";
import ArticleFeed, {
  type BlogPost as FeedPost,
} from "@/components/blog/ArticleFeed";
import HubPageSchema from "@/components/seo/HubPageSchema";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { BLOG_POSTS, type BlogPost } from "@/lib/data/blog";
import { SITE_NAME } from "@/lib/constants";
import {
  BLOG_HUB_SEO,
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
} from "@/lib/seo/hub-pages";
import { cn } from "@/lib/utils";

/* ── Config ──────────────────────────────────────────────────────────────── */

const POSTS_PER_PAGE = 8;

/* ── Build sorted feed (newest first) once at module load ────────────────── */

const allFeedPosts: FeedPost[] = [...(BLOG_POSTS as readonly BlogPost[])]
  .sort(
    (a, b) =>
      new Date(b.seo.datePublished).getTime() -
      new Date(a.seo.datePublished).getTime(),
  )
  .map(
    (post): FeedPost => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      publishedAt: post.seo.datePublished,
      category: post.category,
      imageSrc: post.thumbnail,
      imageAlt: post.title,
    }),
  );

const totalPages = Math.max(1, Math.ceil(allFeedPosts.length / POSTS_PER_PAGE));

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function clampPage(raw?: string): number {
  const n = parseInt(raw ?? "1", 10);
  return Number.isFinite(n) ? Math.min(Math.max(n, 1), totalPages) : 1;
}

function pageHref(p: number): string {
  return p === 1 ? "/blog" : `/blog?page=${p}`;
}

/* ── Types ───────────────────────────────────────────────────────────────── */

type BlogFeedPageProps = {
  searchParams: Promise<{ page?: string }>;
};

/* ── Metadata ────────────────────────────────────────────────────────────── */

export async function generateMetadata({
  searchParams,
}: BlogFeedPageProps): Promise<Metadata> {
  const { page: pageParam } = await searchParams;
  const page = clampPage(pageParam);
  const base = metadataForHubSeo(BLOG_HUB_SEO);

  if (page <= 1) {
    return base;
  }

  const suffix = ` - עמוד ${page}`;
  const title = `${BLOG_HUB_SEO.title}${suffix}`;

  return {
    ...base,
    title: { absolute: `${title} | ${SITE_NAME}` },
    robots: { index: false, follow: true },
    openGraph: base.openGraph
      ? {
          ...base.openGraph,
          title: `${title} | ${SITE_NAME}`,
        }
      : undefined,
  };
}

/* ── BlogEditorialMark ───────────────────────────────────────────────────── */

function BlogEditorialMark() {
  return (
    <svg
      viewBox="0 0 120 24"
      className="h-5 w-auto text-brand-red"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="0" y1="12" x2="40" y2="12" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="12" r="4" fill="currentColor" />
      <circle cx="60" cy="12" r="2" fill="currentColor" />
      <circle cx="70" cy="12" r="4" fill="currentColor" />
      <line x1="80" y1="12" x2="120" y2="12" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/* ── BlogPagination ──────────────────────────────────────────────────────── */

function BlogPagination({
  currentPage,
  total,
}: {
  currentPage: number;
  total: number;
}) {
  if (total <= 1) return null;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < total;

  /* Window of page numbers to show (max 5 around current) */
  const delta = 2;
  const windowStart = Math.max(1, currentPage - delta);
  const windowEnd = Math.min(total, currentPage + delta);
  const pageNumbers: number[] = [];
  for (let i = windowStart; i <= windowEnd; i++) pageNumbers.push(i);

  const navBtnClass =
    "inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:border-brand-red hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";
  const pageBtnClass =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

  return (
    <nav
      aria-label="ניווט עמודים"
      className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8"
      dir="rtl"
    >
      {/* ── Prev (right side in RTL = start) ── */}
      {hasPrev ? (
        <Link href={pageHref(currentPage - 1)} className={navBtnClass}>
          <span aria-hidden="true">&#x2190;</span>
          עמוד קודם
        </Link>
      ) : (
        <span className={`${navBtnClass} text-muted-foreground select-none`}>
          <span aria-hidden="true">&#x2190;</span>
          עמוד קודם
        </span>
      )}

      {/* ── Page numbers ── */}
      <div className="flex items-center gap-1" aria-label="עמודים">
        {/* Leading ellipsis */}
        {windowStart > 1 && (
          <>
            <Link href={pageHref(1)} className={`${pageBtnClass} border-border bg-surface text-foreground hover:border-brand-red hover:text-brand-red`}>
              1
            </Link>
            {windowStart > 2 && (
              <span className="px-1 text-sm text-muted-foreground" aria-hidden="true">
                ...
              </span>
            )}
          </>
        )}

        {pageNumbers.map((p) => (
          <Link
            key={p}
            href={pageHref(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={cn(
              pageBtnClass,
              p === currentPage
                ? "border-brand-red bg-brand-red text-white"
                : "border-border bg-surface text-foreground hover:border-brand-red hover:text-brand-red",
            )}
          >
            {p}
          </Link>
        ))}

        {/* Trailing ellipsis */}
        {windowEnd < total && (
          <>
            {windowEnd < total - 1 && (
              <span className="px-1 text-sm text-muted-foreground" aria-hidden="true">
                ...
              </span>
            )}
            <Link href={pageHref(total)} className={`${pageBtnClass} border-border bg-surface text-foreground hover:border-brand-red hover:text-brand-red`}>
              {total}
            </Link>
          </>
        )}
      </div>

      {/* ── Next (left side in RTL = end) ── */}
      {hasNext ? (
        <Link href={pageHref(currentPage + 1)} className={navBtnClass}>
          עמוד הבא
          <span aria-hidden="true">&#x2192;</span>
        </Link>
      ) : (
        <span className={`${navBtnClass} text-muted-foreground select-none`}>
          עמוד הבא
          <span aria-hidden="true">&#x2192;</span>
        </span>
      )}
    </nav>
  );
}

/* ── BlogFeedPage ────────────────────────────────────────────────────────── */

export default async function BlogFeedPage({ searchParams }: BlogFeedPageProps) {
  const { page: pageParam } = await searchParams;
  const currentPage = clampPage(pageParam);

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = allFeedPosts.slice(start, start + POSTS_PER_PAGE);

  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(BLOG_HUB_SEO)} />
      <div className="bg-background">
        {/* ── Dark hero ── */}
        <Section
          padding="none"
          className="relative overflow-hidden border-b border-border bg-surface text-foreground"
          ariaLabelledby="blog-hero-heading"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_80%_-10%,rgba(212,43,43,0.18),transparent_55%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-red/50 to-transparent"
            aria-hidden="true"
          />

          <Container className="relative py-16 sm:py-20">
            <BlogEditorialMark />

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-brand-red">
              מגזין {SITE_NAME}
            </p>

            <h1
              id="blog-hero-heading"
              className="text-hero mt-4 max-w-3xl font-serif font-semibold"
            >
              ידע מקצועי מהאולפן והשטח
            </h1>

            <p className="text-lead mt-6 max-w-2xl text-muted-foreground">
              מדריכים פרקטיים לפודקאסט, הקלטה, DJ, אירועים, קריינות וסאונד -
              כתובים בבהירות, בלי רעש מיותר.
            </p>

            {/* Stats row */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span>
                <strong className="text-foreground">{allFeedPosts.length}</strong>{" "}
                מאמרים
              </span>
              {totalPages > 1 && currentPage > 1 && (
                <span>
                  עמוד{" "}
                  <strong className="text-foreground">{currentPage}</strong> מתוך{" "}
                  <strong className="text-foreground">{totalPages}</strong>
                </span>
              )}
            </div>
          </Container>
        </Section>

        {/* ── Article feed + pagination ── */}
        <Section padding="sm">
          <Container>
            <ArticleFeed posts={pagePosts} />
            <BlogPagination currentPage={currentPage} total={totalPages} />
          </Container>
        </Section>
      </div>
    </>
  );
}
