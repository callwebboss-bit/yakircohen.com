import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { describe, it } from "node:test";
import { getServiceBookMapSlugs, resolveServiceBookCta } from "@/lib/data/service-book-map";
import { getExVat, getPriceById } from "@/lib/data/pricing-catalog";
import {
  EVENTS_SERVICES,
  PHOTOGRAPHY_SERVICES,
  STUDIO_SERVICES,
  VIDEO_SERVICES,
  VOICEOVER_SERVICES,
} from "@/lib/data/services";

/* עמודים עם טופס הקלטת השיר מציגים את כפתור ההזמנה כולל מע״מ, כמו הטופס.
   קודם עמוד השיר הציג "מ-500 ₪ + מע״מ = 590 ₪" מתחת לטופס שאומר 590 כולל מע״מ. */
describe("resolveServiceBookCta VAT display", () => {
  for (const slug of ["studio", "studio/recording-song-modiin", "studio/pricing"]) {
    it(`${slug}: כולל מע״מ קודם, בלי "+ מע״מ ="`, () => {
      const cta = resolveServiceBookCta(slug);
      assert.ok(cta);
      assert.match(cta.bookLabel, /^הזמנה מקוונת מ-[\d,]+ ₪ כולל מע״מ$/);
    });
  }

  it("עמוד השיר מציג את מחיר השיר, 590 כולל מע״מ", () => {
    assert.equal(
      resolveServiceBookCta("studio/recording-song-modiin")?.bookLabel,
      "הזמנה מקוונת מ-590 ₪ כולל מע״מ",
    );
  });

  it("עמוד צרכן אחר: כולל מע״מ קודם ולפני מע״מ בסוגריים", () => {
    const cta = resolveServiceBookCta("events/dj-events");
    assert.equal(cta?.bookLabel, "הזמנה מקוונת מ-5,900 ₪ כולל מע״מ (5,000 ₪ + מע״מ)");
  });

  it("עמוד עסקים: לפני מע״מ קודם", () => {
    const cta = resolveServiceBookCta("business/professional-voiceover");
    assert.match(cta?.bookLabel ?? "", /^הזמנה מקוונת מ-1,200 ₪ \+ מע״מ/);
  });
});

/* שלב 4 WP5, סעיף 2G: כפתור ההזמנה שייך למוצר של העמוד */
describe("book button belongs to the page's own product", () => {
  const registries = [
    STUDIO_SERVICES,
    VOICEOVER_SERVICES,
    EVENTS_SERVICES,
    VIDEO_SERVICES,
    PHOTOGRAPHY_SERVICES,
  ];
  type Tier = { catalogId?: string; priceExVat?: number };
  const services = registries.flatMap(
    (r) => Object.values(r) as { slug: string; pricing?: readonly Tier[] }[],
  );

  it("every registry slug and every literal book slug has an explicit entry", () => {
    const explicit = new Set(getServiceBookMapSlugs());
    const literal = execSync(
      `git grep -hoE 'resolveServiceBookCta\\("[^"]+"\\)|bookSlug="[^"]+"' -- components app lib ':!*.test.ts'`,
    )
      .toString()
      .match(/"[^"]+"/g)
      ?.map((s) => s.slice(1, -1)) ?? [];
    const slugs = [...services.map((s) => s.slug.replace(/^\/+/, "")), ...literal];
    const missing = [...new Set(slugs)].filter((s) => !explicit.has(s));
    assert.deepEqual(missing, [], "עמודים בלי שורה מפורשת ב-SERVICE_BOOK_MAP");
  });

  it("a page with priced tiers shows one of its own tier prices", () => {
    const wrong: string[] = [];
    for (const service of services) {
      const tiers = (service.pricing ?? []).filter((t) => t.catalogId || t.priceExVat);
      if (tiers.length === 0) continue;
      const cta = resolveServiceBookCta(service.slug);
      if (!cta?.priceExVat) continue;
      const own = new Set<number>();
      for (const t of tiers) {
        if (t.priceExVat) own.add(t.priceExVat);
        if (t.catalogId) own.add(getExVat(t.catalogId as "dj_premium"));
      }
      if (!own.has(cta.priceExVat)) wrong.push(`${service.slug}: ${cta.priceExVat}`);
    }
    assert.deepEqual(wrong, []);
  });

  it("category must match: voiceover never shows a blessing, DJ never an attraction", () => {
    for (const slug of getServiceBookMapSlugs()) {
      const cta = resolveServiceBookCta(slug);
      if (!cta?.priceCatalogId) continue;
      const item = getPriceById(cta.priceCatalogId);
      if (slug.startsWith("voiceover")) assert.notEqual(cta.priceCatalogId, "blessing_recording", slug);
      if (slug.startsWith("events/dj")) assert.ok(!cta.priceCatalogId.startsWith("event_attraction"), slug);
      if (slug.startsWith("podcast/")) assert.notEqual(cta.priceCatalogId, "podcast_pilot", slug);
      assert.ok(item, slug);
    }
  });

  it("a page without an entry gets no button and no borrowed price", () => {
    assert.equal(resolveServiceBookCta("events/some-new-page"), null);
    assert.equal(resolveServiceBookCta("voiceover")?.priceExVat, null);
  });
});
