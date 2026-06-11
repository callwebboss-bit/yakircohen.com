/** Serialize JSON-LD without allowing script-tag breakout in HTML. */
export function safeJsonLdStringify(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
