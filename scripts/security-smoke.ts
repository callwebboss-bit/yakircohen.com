import { isAllowedEmbedUrl } from "../lib/embed-url";
import { safeJsonLdStringify } from "../lib/safe-json-ld";
import { sanitizeBlogHtml } from "../lib/sanitize-html";

const jsonLd = safeJsonLdStringify({ x: "</script>" });
if (jsonLd.includes("</script>")) {
  throw new Error("JSON-LD still contains </script>");
}

const html = sanitizeBlogHtml('<p>ok</p><script>alert(1)</script><a href="javascript:alert(1)">x</a>');
if (/<script|javascript:/i.test(html)) {
  throw new Error("Blog HTML sanitizer allowed dangerous content");
}

if (!isAllowedEmbedUrl("https://www.youtube.com/embed/abc")) {
  throw new Error("YouTube embed URL should be allowed");
}
if (isAllowedEmbedUrl("https://evil.example/embed")) {
  throw new Error("Unknown embed host should be blocked");
}

console.log("security smoke ok");
