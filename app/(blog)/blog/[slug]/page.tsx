import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CTABanner from "@/components/blog/CTABanner";
import RelatedArticles from "@/components/blog/RelatedArticles";
import SocialShare from "@/components/blog/SocialShare";
import {
  getAllBlogSlugs,
  getBlogPostBySlug,
  getRelatedBlogPosts,
  getRelatedServiceCallout,
} from "@/lib/data/blog";
import { ensureImageAlt } from "@/lib/image-alt";
import { SITE_NAME } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import { absoluteUrl, SITE_URL } from "@/lib/site-url";
import { toYouTubeEmbedUrl } from "@/lib/youtube";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "מאמר לא נמצא" };
  }

  return constructMetadata({
    title: post.seo.title,
    description: post.seo.description,
    slug: `blog/${post.slug}`,
    keywords: [post.category, "בלוג", "פודקאסט", "אולפן"],
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  /* Canonical URL - pre-resolved server-side so SocialShare receives a static
     string prop. This eliminates any hydration delta between the server render
     (which has no window.location) and the first client paint. */
  const canonical = absoluteUrl(`blog/${slug}`);

  /* Resolve service-aware CTA content from the post's relatedServiceSlug.
     Returns null when no match is found; CTABanner uses its defaults in that
     case so the baseline conversion block always renders. */
  const callout = getRelatedServiceCallout(post.relatedServiceSlug);
  const relatedPosts = getRelatedBlogPosts(post.slug, 3);
  const youtubeEmbed = post.youtubeUrl ? toYouTubeEmbedUrl(post.youtubeUrl) : null;

  /* Inline BlogPosting JSON-LD - replaces the missing BlogPostingJsonLd
     component with equivalent structured data. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo.description,
    datePublished: post.seo.datePublished,
    dateModified: post.seo.datePublished,
    url: canonical,
    image: absoluteUrl(post.thumbnail),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
  };

  return (
    <>
      {/* BlogPosting structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="bg-background" aria-labelledby="article-heading">
        <header className="relative overflow-hidden border-b border-border bg-surface text-foreground">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_50%_-15%,rgba(212,43,43,0.14),transparent_60%)]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <Link
              href="/blog"
              className="text-sm font-medium text-brand-red transition-colors hover:text-brand-red-light"
            >
              ← חזרה למגזין
            </Link>
            <p className="mt-8 text-xs font-semibold tracking-[0.2em] text-brand-red/80 uppercase">
              {post.category}
            </p>
            <h1
              id="article-heading"
              className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
            >
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <time dateTime={post.seo.datePublished}>{post.date}</time>
              <span aria-hidden="true">·</span>
              <span>{SITE_NAME}</span>
            </div>
          </div>
        </header>

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-10 aspect-[16/9] overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
            <Image
              src={post.thumbnail}
              alt={ensureImageAlt(post.title, { fallback: post.title })}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 48rem"
              className="object-cover"
            />
          </div>

          {/*
           * SocialShare - placed between the thumbnail and the prose so it
           * sits in the white content area (correct contrast for the component)
           * while remaining visually proximate to the dark header metadata
           * (title, date, category) directly above. The canonical URL is
           * pre-resolved on the server, eliminating any hydration delta.
           */}
          <SocialShare
            title={post.title}
            url={canonical}
            excerpt={post.excerpt}
            className="mt-6"
          />

          {youtubeEmbed ? (
            <div className="mt-8 aspect-video overflow-hidden rounded-xl border border-border">
              <iframe
                src={youtubeEmbed}
                title={`וידאו: ${post.title}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}

          <div
            className="blog-prose mt-8 font-serif text-lg leading-relaxed tracking-normal text-foreground [&_a]:font-medium [&_a]:text-brand-red [&_a]:underline-offset-2 hover:[&_a]:underline [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:mt-2 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pe-6 [&_p]:mt-4 [&_strong]:font-semibold [&_strong]:text-brand-red [&_table]:mt-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-border [&_td]:p-3 [&_th]:border [&_th]:border-border [&_th]:bg-surface [&_th]:p-3 [&_th]:text-start [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pe-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/*
           * CTABanner - article baseline conversion block. Props are sourced
           * from getRelatedServiceCallout() which maps relatedServiceSlug to
           * service-aware heading, body, and WhatsApp pre-fill text from the
           * registry. Falls back to CTABanner built-in defaults when null.
           */}
          <div className="mt-14 border-t border-border pb-10 pt-12">
            <CTABanner
              heading={callout?.title}
              body={callout?.subtitle}
              whatsappMessage={callout?.whatsappText}
              utm_campaign={callout?.utmCampaign ?? "blog_article_cta"}
            />
          </div>

          <RelatedArticles posts={relatedPosts} />

          <div className="pb-16" />
        </div>
      </article>
    </>
  );
}
