/**
 * Conservative same-origin prefetch for high-traffic hub routes only.
 * Excludes /book, forms, external actions, and query strings.
 */
export default function SpeculationRules() {
  const rules = {
    prefetch: [
      {
        source: "list",
        urls: ["/studio", "/podcast", "/events", "/photography", "/pricing"],
        eagerness: "moderate" as const,
      },
    ],
  };

  return (
    <script
      type="speculationrules"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(rules) }}
    />
  );
}
