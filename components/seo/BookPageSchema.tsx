import {
  BOOK_OG_IMAGE_ALT,
  BOOK_OG_IMAGE_PATH,
  BOOK_PAGE_DESCRIPTION,
  BOOK_PAGE_TITLE,
} from "@/lib/seo/book-page";
import { absoluteUrl } from "@/lib/site-url";
import { SITE_NAME } from "@/lib/constants";

const BRAND_SUFFIX = ` | ${SITE_NAME}`;

export default function BookPageSchema() {
  const pageUrl = absoluteUrl("book");
  const imageUrl = absoluteUrl(BOOK_OG_IMAGE_PATH.replace(/^\//, ""));

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: `${BOOK_PAGE_TITLE}${BRAND_SUFFIX}`,
    description: BOOK_PAGE_DESCRIPTION,
    inLanguage: "he-IL",
    isPartOf: { "@id": `${absoluteUrl()}#website` },
    about: { "@id": `${absoluteUrl()}#organization` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: imageUrl,
      caption: BOOK_OG_IMAGE_ALT,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
