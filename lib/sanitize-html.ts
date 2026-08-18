import sanitizeHtml from "sanitize-html";
import {
  GLOSSARY_TOOLTIP_PHRASES,
  getGlossaryTermBySlug,
} from "@/lib/data/glossary";
import { KEYWORD_LINK_MAP } from "@/lib/internal-links/keyword-map";

const BLOG_ALLOWED_TAGS = [
  "h2",
  "h3",
  "p",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "a",
  "br",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "div",
] as const;

const BLOG_GLOSSARY_PHRASES = GLOSSARY_TOOLTIP_PHRASES.filter(({ phrase }) => {
  const existing = KEYWORD_LINK_MAP[phrase];
  return !existing || existing.href.startsWith("/glossary");
});

const BLOG_GLOSSARY_MATCH_RE = new RegExp(
  `(^|[^\\p{L}\\p{N}])(${BLOG_GLOSSARY_PHRASES.map(({ phrase }) =>
    escapeRegex(phrase),
  ).join("|")})(?=$|[^\\p{L}\\p{N}])`,
  "gu",
);

export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [...BLOG_ALLOWED_TAGS],
    allowedAttributes: {
      a: ["href"],
      div: ["class"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
  });
}

export function enhanceBlogHtmlWithGlossary(html: string): string {
  const sanitized = sanitizeBlogHtml(html);
  const parts = sanitized.split(/(<[^>]+>)/g);
  const seenSlugs = new Set<string>();
  let anchorDepth = 0;
  let headingDepth = 0;

  return parts
    .map((part) => {
      if (!part) return part;

      if (part.startsWith("<")) {
        if (/^<a\b/i.test(part)) anchorDepth += 1;
        if (/^<\/a/i.test(part)) anchorDepth = Math.max(0, anchorDepth - 1);
        if (/^<h[23]\b/i.test(part)) headingDepth += 1;
        if (/^<\/h[23]/i.test(part)) headingDepth = Math.max(0, headingDepth - 1);
        return part;
      }

      if (anchorDepth > 0 || headingDepth > 0) {
        return part;
      }

      return part.replace(
        BLOG_GLOSSARY_MATCH_RE,
        (fullMatch, prefix: string, phrase: string) => {
          const slug = BLOG_GLOSSARY_PHRASES.find(
            (entry) => entry.phrase === phrase,
          )?.slug;
          const term = slug ? getGlossaryTermBySlug(slug) : undefined;

          if (!term || seenSlugs.has(term.slug)) {
            return fullMatch;
          }

          seenSlugs.add(term.slug);
          const title = escapeHtml(term.definition);
          const safePhrase = escapeHtml(phrase);
          return `${prefix}<a href="/glossary/${term.slug}" class="glossary-inline" title="${title}" aria-label="${safePhrase}: ${title}">${safePhrase}</a>`;
        },
      );
    })
    .join("");
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
