import Image from "next/image";
import Link from "next/link";
import { BLUR_DATA_URL } from "@/lib/blur";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────────────────────── */

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO 8601 date string, e.g. "2025-04-18" */
  publishedAt: string;
  category: string;
  readingTimeMinutes?: number;
  imageSrc?: string;
  imageAlt?: string;
  author?: string;
};

export type ArticleFeedProps = {
  posts: BlogPost[];
  /** Optional section heading rendered above the feed */
  heading?: string;
  className?: string;
};

/* ─────────────────────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────────────────────── */

function formatHebrewDate(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat("he-IL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

function readingLabel(minutes: number): string {
  return `${minutes} דקות קריאה`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   CategoryBadge
   ───────────────────────────────────────────────────────────────────────────── */

function CategoryBadge({
  label,
  size = "sm",
}: {
  label: string;
  size?: "sm" | "xs";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border border-brand-red/40 bg-brand-red/8 font-semibold uppercase tracking-widest text-brand-red",
        size === "sm"
          ? "px-2.5 py-0.5 text-[0.65rem]"
          : "px-2 py-0.5 text-[0.6rem]",
      )}
    >
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FeaturedArticle - first post, displayed with full-width lead image and
   larger typography to anchor the feed visually.
   ───────────────────────────────────────────────────────────────────────────── */

function FeaturedArticle({ post }: { post: BlogPost }) {
  const date = formatHebrewDate(post.publishedAt);

  return (
    <article className="group border-b border-border pb-10" aria-label={post.title}>
      <Link
        href={`/blog/${post.slug}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red"
      >
        {/* Lead image */}
        {post.imageSrc && (
          <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-surface">
            <Image
              src={post.imageSrc}
              alt={post.imageAlt ?? post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1152px) 80vw, 72rem"
              className="group-hover-scale-sm object-cover motion-reduce:transform-none"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              priority
            />
          </div>
        )}

        {/* Meta row */}
        <div className="mb-3 flex flex-wrap items-center gap-2.5">
          <CategoryBadge label={post.category} size="sm" />
          {post.readingTimeMinutes != null && (
            <span className="text-xs text-muted-foreground">
              {readingLabel(post.readingTimeMinutes)}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="font-serif text-section-title font-semibold leading-tight text-foreground transition-colors duration-normal ease-luxury group-hover:text-brand-red">
          {post.title}
        </h2>

        {/* Excerpt - up to 3 lines */}
        <p className="mt-3 line-clamp-3 text-base leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        {/* Footer: date - author - read-more cue */}
        <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
          <time dateTime={post.publishedAt}>{date}</time>
          {post.author && (
            <>
              <span aria-hidden="true">-</span>
              <span>{post.author}</span>
            </>
          )}
          {/* Read-more cue fades in on hover */}
          <span
            className="ms-auto flex items-center gap-1 font-medium text-brand-red opacity-0 transition-opacity duration-normal ease-luxury group-hover:opacity-100"
            aria-hidden="true"
          >
            קרא עוד </span>
        </div>
      </Link>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ArticleRow - compact horizontal row for every post after the first.
   Image sits on the inline-start side (right in RTL); content fills the rest.
   ───────────────────────────────────────────────────────────────────────────── */

function ArticleRow({ post }: { post: BlogPost }) {
  const date = formatHebrewDate(post.publishedAt);

  return (
    <article
      className="group border-b border-border py-6 last:border-b-0"
      aria-label={post.title}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="flex items-start gap-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red sm:gap-6"
      >
        {/*
         * Thumbnail - first flex child renders on the RIGHT in RTL, which is the
         * natural start side for Hebrew editorial layouts (image anchors the row).
         */}
        {post.imageSrc && (
          <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-surface sm:w-32 lg:w-36">
            <Image
              src={post.imageSrc}
              alt={post.imageAlt ?? post.title}
              fill
              sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 144px"
              className="group-hover-scale-md object-cover motion-reduce:transform-none"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Meta row */}
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <CategoryBadge label={post.category} size="xs" />
            {post.readingTimeMinutes != null && (
              <span className="text-[0.65rem] text-muted-foreground">
                {readingLabel(post.readingTimeMinutes)}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors duration-normal ease-luxury group-hover:text-brand-red sm:text-xl">
            {post.title}
          </h2>

          {/* Excerpt - up to 2 lines */}
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <time dateTime={post.publishedAt}>{date}</time>
            {post.author && (
              <>
                <span aria-hidden="true">-</span>
                <span>{post.author}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ArticleFeed - static Server Component.
   First post is rendered as a featured hero article; remaining posts appear
   as compact editorial rows beneath it.
   ───────────────────────────────────────────────────────────────────────────── */

export default function ArticleFeed({
  posts,
  heading,
  className,
}: ArticleFeedProps) {
  if (posts.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-surface px-6 py-16 text-center text-muted-foreground",
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <p className="text-sm">אין מאמרים להצגה כרגע - חיזרו בקרוב.</p>
      </div>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <section
      className={cn("", className)}
      aria-labelledby={heading ? "feed-heading" : undefined}
    >
      {heading && (
        <header className="mb-8 border-b border-border pb-6">
          <h1
            id="feed-heading"
            className="font-serif text-section-title font-semibold text-foreground"
          >
            {heading}
          </h1>
        </header>
      )}

      {/* Featured article */}
      <FeaturedArticle post={featured} />

      {/* Remaining rows */}
      {rest.length > 0 && (
        <div className="mt-2">
          {rest.map((post) => (
            <ArticleRow key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
