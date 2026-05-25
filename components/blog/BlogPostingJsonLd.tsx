import { SITE_NAME } from "@/lib/constants";
import type { BlogPost } from "@/lib/data/blog";
import { absoluteUrl } from "@/lib/site-url";

export type BlogPostingJsonLdProps = {
  post: BlogPost;
};

export default function BlogPostingJsonLd({ post }: BlogPostingJsonLdProps) {
  const url = absoluteUrl(`blog/${post.slug}`);
  const imageUrl = absoluteUrl(post.thumbnail.replace(/^\//, ""));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo.description,
    image: [imageUrl],
    datePublished: post.seo.datePublished,
    dateModified: post.seo.datePublished,
    inLanguage: "he-IL",
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
