import { HOME_FAQ_ITEMS } from "@/lib/data/home-faq";
import { buildFaqSchema } from "@/lib/seo/page-schema";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";

const FOOTER_FAQ_IDS = ["song-studio-price", "delivery-time"] as const;

const footerFaqSchema = buildFaqSchema(
  HOME_FAQ_ITEMS.filter((item) =>
    (FOOTER_FAQ_IDS as readonly string[]).includes(item.id),
  ).map((item) => ({
    question: item.question,
    answer: item.answerPlain,
  })),
);

export default function FooterFaqSchema() {
  if (!footerFaqSchema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(footerFaqSchema) }}
    />
  );
}
