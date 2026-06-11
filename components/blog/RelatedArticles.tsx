import Image from "next/image";
import Link from "next/link";
import { BLUR_DATA_URL } from "@/lib/blur";
import type { BlogPost } from "@/lib/data/blog";

type Props = {
  posts: readonly BlogPost[];
};

export default function RelatedArticles({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-12 border-t border-border pt-10 pb-4">
      <h2
        id="related-heading"
        className="text-lg font-semibold text-foreground"
      >
        מאמרים נוספים
      </h2>
      <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block overflow-hidden rounded-xl border border-border bg-surface hover-lift focus-within:border-brand-red/40"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-surface">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="group-hover-scale-md object-cover motion-reduce:transform-none"
                />
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-red">
                  {post.category}
                </p>
                <p className="mt-1.5 line-clamp-2 text-sm font-medium leading-snug text-foreground">
                  {post.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{post.date}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
