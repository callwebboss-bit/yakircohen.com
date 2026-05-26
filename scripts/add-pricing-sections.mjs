import fs from "node:fs";
import path from "node:path";

const seoDir = path.join(import.meta.dirname, "..", "components", "seo");
const files = fs.readdirSync(seoDir).filter((f) => f.endsWith(".tsx"));

const pricingImport =
  'import ServicePagePricingSection from "@/components/services/ServicePagePricingSection";\n';

for (const f of files) {
  const file = path.join(seoDir, f);
  let src = fs.readFileSync(file, "utf8");
  if (!src.includes("ServicePricingBlock")) continue;
  if (src.includes("<ServicePagePricingSection")) continue;

  src = src.replace(
    /import ServicePricingBlock from "@\/components\/services\/ServicePricingBlock";\n/g,
    pricingImport,
  );

  const isSlideshow = f === "PhotoSlideshowPageContent.tsx";
  const block = isSlideshow
    ? `\n        <ServicePagePricingSection service={service} serviceTitle="מצגת תמונות לאירוע" />\n`
    : `\n        <ServicePagePricingSection service={service} />\n`;

  const faqMatch = src.match(/\n(\s+)\{service\.faqs\.length > 0 \?/);
  const relatedMatch = src.match(/\n(\s+)<PageRelatedFooter/);
  const ctaMatch = src.match(
    /\n(\s+)<section[^>]*\n[^]*?aria-labelledby="[^"]*-cta-heading"/,
  );

  if (faqMatch) {
    src = src.replace(faqMatch[0], `${block}${faqMatch[0]}`);
  } else if (relatedMatch) {
    src = src.replace(relatedMatch[0], `${block}${relatedMatch[0]}`);
  } else if (ctaMatch) {
    src = src.replace(ctaMatch[0], `${block}${ctaMatch[0]}`);
  } else {
    console.warn("skip (no anchor):", f);
    continue;
  }

  fs.writeFileSync(file, src);
  console.log("pricing added:", f);
}
