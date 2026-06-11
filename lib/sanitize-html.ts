import DOMPurify from "isomorphic-dompurify";

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

const BLOG_ALLOWED_ATTR = ["href", "class", "colspan", "rowspan"] as const;

export function sanitizeBlogHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [...BLOG_ALLOWED_TAGS],
    ALLOWED_ATTR: [...BLOG_ALLOWED_ATTR],
    ALLOW_DATA_ATTR: false,
  });
}
