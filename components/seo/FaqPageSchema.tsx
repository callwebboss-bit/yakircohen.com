type FaqSchemaItem = {
  question: string;
  answer: string;
};

/**
 * Injects FAQPage JSON-LD structured data into the page <head>.
 * Eligible for Google's FAQ rich results (accordion in SERP).
 * Only pass items whose `answer` is plain text — no HTML or JSX.
 */
export default function FaqPageSchema({ items }: { items: FaqSchemaItem[] }) {
  if (!items.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
