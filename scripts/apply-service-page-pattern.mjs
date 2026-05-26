import fs from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const seoDir = path.join(root, "components", "seo");

const earlyPricingRe =
  /\r?\n      \{service\.pricing && service\.pricing\.length > 0 \? \(\r?\n        <ServicePricingBlock[\s\S]*?\r?\n      \) : null\}\r?\n\r?\n/;

const pricingImport =
  'import ServicePagePricingSection from "@/components/services/ServicePagePricingSection";\n';
const heroImport =
  'import { withServicePageHeroDefaults } from "@/lib/service-page-ui";\n';

const files = fs
  .readdirSync(seoDir)
  .filter((f) => f.endsWith("PageContent.tsx"))
  .map((f) => path.join(seoDir, f));

let changed = 0;

for (const file of files) {
  let src = fs.readFileSync(file, "utf8");
  if (!src.includes("ServicePageLayout")) continue;

  let updated = src;

  if (earlyPricingRe.test(updated)) {
    updated = updated.replace(earlyPricingRe, "\n");
    if (!updated.includes("ServicePagePricingSection")) {
      if (updated.includes('from "@/components/services/ServicePricingBlock"')) {
        updated = updated.replace(
          'import ServicePricingBlock from "@/components/services/ServicePricingBlock";\n',
          pricingImport,
        );
      } else if (updated.includes("ServicePageLayout")) {
        updated = updated.replace(
          /(import ServicePageLayout[^\n]+\n)/,
          `$1${pricingImport}`,
        );
      }
    }

    if (
      !updated.includes("<ServicePagePricingSection") &&
      updated.includes("service.pricing")
    ) {
      const insertBeforeFaq = updated.match(
        /\r?\n(\s+)\{service\.faqs\.length > 0 \?/,
      );
      const insertBeforeRelated = updated.match(
        /\r?\n(\s+)<PageRelatedFooter/,
      );
      const indent = (insertBeforeFaq ?? insertBeforeRelated)?.[1] ?? "        ";
      const block = `\n${indent}<ServicePagePricingSection service={service} />\n`;
      if (insertBeforeFaq) {
        updated = updated.replace(insertBeforeFaq[0], `${block}${insertBeforeFaq[0]}`);
      } else if (insertBeforeRelated) {
        updated = updated.replace(insertBeforeRelated[0], `${block}${insertBeforeRelated[0]}`);
      }
    }
  }

  if (
    updated.includes("resolveServicePageHeroFromEntity") &&
    updated.includes("const pageHero = resolveServicePageHeroFromEntity")
  ) {
    if (!updated.includes("withServicePageHeroDefaults")) {
      updated = updated.replace(
        /(import \{ resolveServicePageHeroFromEntity \}[^\n]+\n)/,
        `$1${heroImport}`,
      );
    }
    if (!updated.includes("const heroProps = withServicePageHeroDefaults")) {
      updated = updated.replace(
        /const pageHero = resolveServicePageHeroFromEntity\([^)]+\);/,
        (m) => `${m}\nconst heroProps = withServicePageHeroDefaults(pageHero);`,
      );
      updated = updated.replace(/\{\.\.\.pageHero\}/g, "{...heroProps}");
    }
  }

  if (
    updated.includes("resolvePodcastFolderHero") &&
    updated.includes("const pageHero = resolvePodcastFolderHero")
  ) {
    if (!updated.includes("withServicePageHeroDefaults")) {
      updated = updated.replace(
        /(import \{ resolvePodcastFolderHero \}[^\n]+\n)/,
        `$1${heroImport}`,
      );
    }
    if (!updated.includes("const heroProps = withServicePageHeroDefaults")) {
      updated = updated.replace(
        /const pageHero = resolvePodcastFolderHero\([\s\S]*?\);/,
        (m) => `${m}\nconst heroProps = withServicePageHeroDefaults(pageHero);`,
      );
      updated = updated.replace(/\{\.\.\.pageHero\}/g, "{...heroProps}");
    }
  }

  if (updated !== src) {
    fs.writeFileSync(file, updated);
    changed++;
    console.log("updated:", path.basename(file));
  }
}

console.log(`done: ${changed} files`);
