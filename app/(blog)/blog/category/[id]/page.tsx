import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleFeed, { type BlogPost as FeedPost } from "@/components/blog/ArticleFeed";
import AnswerBlock from "@/components/seo/AnswerBlock";
import PriceFactorsSection from "@/components/seo/PriceFactorsSection";
import HubPageSchema from "@/components/seo/HubPageSchema";
import SpeakableSchema from "@/components/seo/SpeakableSchema";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { BLOG_POSTS, type BlogPost } from "@/lib/data/blog";
import {
  BLOG_FILTER_CATEGORIES,
  getFilterCategoryId,
  type BlogFilterCategory,
} from "@/lib/data/blog-categories";
import { getKnowledgeHub } from "@/lib/data/blog-knowledge-hubs";
import { SITE_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/site-url";
import {
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
  type HubPageSeo,
} from "@/lib/seo/hub-pages";

/**
 * עמוד קטגוריה סטטי לכל דלי סינון בבלוג.
 *
 * למה זה קיים: עמוד המגזין מציג 8 פוסטים, והשאר היו נגישים רק דרך
 * ?page=2 שמסומן noindex. נמדד ב-15.9.2026: 18 פוסטים בלי אף קישור
 * פנימי, כלומר גוגל הגיע אליהם ממפת האתר בלבד. כאן כל פוסט בדלי מקושר
 * מעמוד סטטי שמותר לאינדוקס, ולכן לכל פוסט יש לפחות קישור נכנס אחד.
 *
 * הדליים והשמות מגיעים מ-blog-categories.ts כפי שהם. הכותרת והתיאור
 * נבנים מתבנית שאישר הבעלים ב-15.9.2026, בלי ניסוח חופשי.
 */

type Params = { id: string };

function getCategory(id: string): BlogFilterCategory | undefined {
  return BLOG_FILTER_CATEGORIES.find((c) => c.id === id);
}

function postsFor(category: BlogFilterCategory): FeedPost[] {
  return [...(BLOG_POSTS as readonly BlogPost[])]
    .filter((post) => getFilterCategoryId(post.category) === category.id)
    .sort(
      (a, b) =>
        new Date(b.seo.datePublished).getTime() - new Date(a.seo.datePublished).getTime(),
    )
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      publishedAt: post.seo.datePublished,
      category: post.category,
      imageSrc: post.thumbnail,
      imageAlt: post.title,
    }));
}

function seoFor(category: BlogFilterCategory, count: number): HubPageSeo {
  const hub = getKnowledgeHub(category.id);
  return {
    slug: `blog/category/${category.id}`,
    title: hub ? hub.heading : `מאמרים על ${category.label}`,
    description: hub
      ? `${hub.metaDescription} ${count} מדריכים.`
      : `כל המאמרים של מגזין ${SITE_NAME} על ${category.label}, ${count} מאמרים.`,
    keywords: [category.label, "מגזין", "מדריכים"],
    hub: "blog",
  };
}

export function generateStaticParams(): Params[] {
  return BLOG_FILTER_CATEGORIES.map((c) => ({ id: c.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const category = getCategory(id);
  if (!category) return {};
  return metadataForHubSeo(seoFor(category, postsFor(category).length));
}

export default async function BlogCategoryPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const category = getCategory(id);
  if (!category) notFound();

  const posts = postsFor(category);
  const seo = seoFor(category, posts.length);
  const hub = getKnowledgeHub(category.id);

  /* מקובץ לפי שאלה ולא לפי תאריך. קורא שמגיע עם שאלה אחת לא צריך לסרוק
     24 כרטיסים כדי למצוא את התשובה שלו. */
  const bySlug = new Map(posts.map((post) => [post.slug, post]));
  const groups = hub
    ? hub.groups.map((group) => ({
        ...group,
        posts: group.slugs
          .map((slug) => bySlug.get(slug))
          .filter((post): post is FeedPost => Boolean(post)),
      }))
    : [];

  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(seo)} />
      <SpeakableSchema
        url={absoluteUrl(`blog/category/${category.id}`)}
        cssSelector={["#blog-category-answer"]}
      />
      <div className="bg-background">
        <Section
          padding="none"
          className="border-b border-border bg-surface text-foreground"
          ariaLabelledby="blog-category-heading"
        >
          <Container className="py-14 sm:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-red-text">
              מגזין {SITE_NAME}
            </p>
            <h1
              id="blog-category-heading"
              className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl"
            >
              {seo.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {seo.description}
            </p>
            {/* אות AEO לעמוד. נבנה מתבנית ומנתונים אמיתיים בלבד, באותה
                מוסכמה של הכותרת והתיאור: בלי ניסוח חופשי ובלי טענה שאין
                לה כיסוי. מיועד להיות מוחלף בתשובה שהבעלים יכתוב, כשהדלי
                הזה יהפוך למרכז ידע. */}
            <div className="mt-4 max-w-2xl">
              <AnswerBlock id="blog-category-answer">
                {hub
                  ? hub.answer
                  : `${category.label}: ${posts.length} מאמרים במגזין של ${SITE_NAME}. כל מאמר עונה על שאלה אחת שחוזרת לפני הזמנת שירות. אם השאלה שלכם לא נמצאת כאן, אפשר לשאול אותה ישירות בוואטסאפ.`}
              </AnswerBlock>
            </div>
            <nav aria-label="קטגוריות המגזין" className="mt-8 flex flex-wrap gap-2">
              <Link
                href="/blog"
                className="inline-flex min-h-9 items-center rounded-full border border-border bg-background px-3 text-sm font-medium text-foreground hover:border-brand-red/40"
              >
                כל המאמרים
              </Link>
              {BLOG_FILTER_CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  href={`/blog/category/${c.id}`}
                  aria-current={c.id === category.id ? "page" : undefined}
                  className={
                    c.id === category.id
                      ? "inline-flex min-h-9 items-center rounded-full border border-brand-red bg-brand-red px-3 text-sm font-semibold text-white"
                      : "inline-flex min-h-9 items-center rounded-full border border-border bg-background px-3 text-sm font-medium text-foreground hover:border-brand-red/40"
                  }
                >
                  {c.label}
                </Link>
              ))}
            </nav>
          </Container>
        </Section>

        {hub?.showPriceFactors ? (
          <Section ariaLabelledby="price-factors-heading">
            <Container>
              <PriceFactorsSection />
            </Container>
          </Section>
        ) : null}

        {groups.length > 0 ? (
          groups.map((group) => (
            <Section key={group.id} ariaLabelledby={`group-${group.id}-heading`}>
              <Container>
                <h2
                  id={`group-${group.id}-heading`}
                  className="font-serif text-section-title font-semibold text-foreground"
                >
                  {group.title}
                </h2>
                <div className="mt-6">
                  <ArticleFeed posts={group.posts} />
                </div>
              </Container>
            </Section>
          ))
        ) : (
          <Section ariaLabelledby="blog-category-feed-heading">
            <Container>
              <h2 id="blog-category-feed-heading" className="sr-only">
                {posts.length} מאמרים על {category.label}
              </h2>
              <ArticleFeed posts={posts} />
            </Container>
          </Section>
        )}
      </div>
    </>
  );
}
