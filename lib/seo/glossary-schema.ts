import type { GlossaryTerm } from "@/lib/data/glossary";
import { buildWebPageSchema } from "@/lib/seo/page-schema";
import { absoluteUrl } from "@/lib/site-url";

export function buildDefinedTermSetSchema(terms: readonly GlossaryTerm[]) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${absoluteUrl("glossary")}#defined-term-set`,
    url: absoluteUrl("glossary"),
    name: "מונחון אודיו, אולפן ואירועים",
    inLanguage: "he-IL",
    hasDefinedTerm: terms.map((term) => ({
      "@type": "DefinedTerm",
      name: term.termHe,
      ...(term.termEn ? { alternateName: [term.termEn, ...(term.aliases ?? [])] } : {}),
      description: term.definition,
      url: absoluteUrl(`glossary/${term.slug}`),
    })),
  };
}

export function buildDefinedTermSchema(term: GlossaryTerm) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `${absoluteUrl(`glossary/${term.slug}`)}#defined-term`,
    name: term.termHe,
    ...(term.termEn || term.aliases?.length
      ? {
          alternateName: [
            ...(term.termEn ? [term.termEn] : []),
            ...(term.aliases ?? []),
          ],
        }
      : {}),
    description: term.also ? `${term.definition} ${term.also}` : term.definition,
    inDefinedTermSet: {
      "@id": `${absoluteUrl("glossary")}#defined-term-set`,
    },
    inLanguage: "he-IL",
    url: absoluteUrl(`glossary/${term.slug}`),
    ...(term.relatedService
      ? {
          subjectOf: {
            "@type": "WebPage",
            url: absoluteUrl(term.relatedService.href.replace(/^\/+/, "")),
            name: term.relatedService.label,
          },
        }
      : {}),
  };
}

export function buildGlossaryHubWebPageSchema() {
  return buildWebPageSchema({
    slug: "glossary",
    title: "מונחון אודיו, אולפן ואירועים",
    description:
      "מיני-ויקיפדיה פרטית למונחי אודיו, אולפן, פודקאסט, DJ ואירועים.",
  });
}

export function buildGlossaryTermWebPageSchema(term: GlossaryTerm) {
  return buildWebPageSchema({
    slug: `glossary/${term.slug}`,
    title: `${term.termHe} - הגדרה קצרה`,
    description: term.also ? `${term.definition} ${term.also}` : term.definition,
  });
}
