import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/data/blog";

type Props = {
  posts: readonly BlogPost[];
  heading?: string;
};

export default function ServiceBlogStrip({
  posts,
  heading = "מדריכים שיעזרו לכם להחליט",
}: Props) {
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="service-blog-heading"
      className="my-10 rounded-2xl bg-surface/60 px-5 py-8 ring-1 ring-border"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2
          id="service-blog-heading"
          className="text-base font-semibold text-foreground sm:text-lg"
        >
          {heading}
        </h2>
        <Link
          href="/blog"
          className="shrink-0 text-sm font-medium text-brand-red hover:underline"
        >
          כל המאמרים &larr;
        </Link>
      </div>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background transition-colors hover:border-brand-red/40"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-red">
                  {post.category}
                </p>
                <p className="mt-1.5 line-clamp-2 flex-1 text-sm font-medium leading-snug text-foreground">
                  {post.title}
                </p>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
