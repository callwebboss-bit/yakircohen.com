interface Props {
  /** CSS selector(s) targeting the speakable content. Default: "#answer" */
  cssSelector?: string | string[];
  /** Canonical URL of this page */
  url: string;
}

/**
 * Injects WebPage + SpeakableSpecification JSON-LD.
 * Signals to Google Assistant and AI answer engines which paragraph
 * contains the canonical answer for this page.
 * Must be rendered server-side (not via useEffect).
 */
export default function SpeakableSchema({ cssSelector = "#answer", url }: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: Array.isArray(cssSelector) ? cssSelector : [cssSelector],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
