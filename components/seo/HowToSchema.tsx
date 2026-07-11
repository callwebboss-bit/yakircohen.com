import { safeJsonLdStringify } from "@/lib/safe-json-ld";

interface HowToStep {
  name: string;
  text: string;
  /** Optional absolute URL of a representative image for this step */
  image?: string;
}

interface Props {
  /** e.g. "כיצד להזמין הקלטת שיר" */
  name: string;
  /** One-sentence description */
  description: string;
  steps: HowToStep[];
  /** ISO 8601 duration e.g. "P3D", "PT2H" */
  totalTime?: string;
}

/**
 * Injects HowTo JSON-LD structured data.
 * Eligible for Google's HowTo rich results (steps displayed in SERP).
 * Pair with an existing ProcessSteps component -- no UI change needed.
 */
export default function HowToSchema({ name, description, steps, totalTime }: Props) {
  if (!steps.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.image && { image: s.image }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(schema) }}
    />
  );
}
