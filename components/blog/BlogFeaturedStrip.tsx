import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { BLUR_DATA_URL } from "@/lib/blur";
import type { BlogPost } from "@/lib/data/blog";

type BlogFeaturedStripProps = {
  posts: BlogPost[];
};

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

export default function BlogFeaturedStrip({ posts }: BlogFeaturedStripProps) {
  if (posts.length === 0) return null;

  return (
    <Section padding="sm" className="border-b border-border bg-surface/50">
      <Container>
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">
            מומלצים לקריאה
          </p>
          <h2 className="mt-2 font-serif text-section-title font-semibold text-foreground">
            שלושה מדריכי עומק
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            מיקס ומאסטרינג, בחירת DJ לחתונה והפקת פודקאסט בישראל - לפני שמדפדפים
            בכל המאמרים.
          </p>
        </header>

        <ul className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background transition-colors hover:border-brand-red/40">
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  {post.thumbnail ? (
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-normal ease-luxury group-hover:scale-[1.03] motion-reduce:transform-none"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-brand-red">
                      {post.category}
                    </span>
                    <h3 className="mt-2 font-semibold leading-snug text-foreground group-hover:text-brand-red">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <time
                      dateTime={post.seo.datePublished}
                      className="mt-4 text-xs text-muted-foreground"
                    >
                      {formatHebrewDate(post.seo.datePublished)}
                    </time>
                  </div>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
