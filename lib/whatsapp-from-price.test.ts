import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PRICING_CATALOG, formatPriceLine, getExVat, isCatalogPriceFrom } from "@/lib/data/pricing-catalog";
import { buildLeadFlowWhatsAppText } from "@/lib/data/lead-flow/build-whatsapp";
import { buildClosingMessage, buildPricingInquiryMessage } from "@/lib/whatsapp-closing";

/*
 * מחיר התחלה ("מ-") לא נקרא "סופי" בהודעת הוואטסאפ (הבעלים 11.10.2026). עד אז
 * הודעה מעמוד חידוש שיר ישן אמרה "₪1,003 סופי", בזמן שהעמוד אומר שהמחיר הסופי
 * נקבע אחרי שבודקים את ההקלטה.
 */
describe("WhatsApp price line: from-prices are not final", () => {
  it("a fixed price keeps the explicit final total", () => {
    assert.match(formatPriceLine(500), /= ₪590 סופי$/);
  });

  it("a from-price says מ- on both numbers and never סופי", () => {
    const line = formatPriceLine(850, undefined, { from: true });
    assert.equal(line, "מ-₪850 + מע״מ ₪153 = מ-₪1,003 (מחיר התחלה)");
    assert.doesNotMatch(line, /סופי/);
  });

  it("every priceFrom catalog item gets the from wording by its id", () => {
    const fromIds = (PRICING_CATALOG as readonly { id: string; priceFrom?: boolean }[])
      .filter((item) => item.priceFrom)
      .map((item) => item.id);
    assert.ok(fromIds.length > 0);
    for (const id of fromIds) {
      const text = buildPricingInquiryMessage({
        packageLabel: id,
        priceExVat: getExVat(id as Parameters<typeof getExVat>[0]),
        closerServiceId: id,
      });
      assert.doesNotMatch(text, /סופי/, id);
      assert.match(text, /\(מחיר התחלה\)/, id);
    }
  });

  it("a fixed catalog item still says סופי", () => {
    assert.equal(isCatalogPriceFrom("song_recording"), false);
    const text = buildPricingInquiryMessage({
      packageLabel: "הקלטת שיר",
      priceExVat: getExVat("song_recording"),
      closerServiceId: "song_recording",
    });
    assert.match(text, /סופי/);
  });

  it("an explicit page flag wins over the catalog", () => {
    const text = buildPricingInquiryMessage({
      packageLabel: "סשן קבוצתי",
      priceExVat: getExVat("song_recording"),
      priceFrom: true,
      closerServiceId: "song_recording",
    });
    assert.doesNotMatch(text, /סופי/);
  });

  it("the closing message reads the catalog through closerServiceId", () => {
    const text = buildClosingMessage({
      serviceLabel: "חידוש שיר ישן",
      contact: { name: "בדיקה", phone: "0500000000" },
      priceExVat: getExVat("old_song_renewal"),
      closerServiceId: "old_song_renewal",
    });
    assert.doesNotMatch(text, /סופי/);
  });

  it("unknown or missing ids are not from-prices", () => {
    assert.equal(isCatalogPriceFrom(undefined), false);
    assert.equal(isCatalogPriceFrom("not_a_catalog_id"), false);
  });

  it("the lead flow marks a from-price tier, and keeps סופי on a fixed one", () => {
    const base = { answers: {}, answerLabels: {}, selectedUpsellIds: [] } as const;
    /* האולפן הנייד (mobile_podcast_at_home) הוא מחיר התחלה בקטלוג */
    const mobile = buildLeadFlowWhatsAppText({
      ...base,
      serviceId: "mobile-studio",
      tierId: "economy",
      tierCatalogExVat: getExVat("mobile_podcast_at_home"),
    });
    assert.doesNotMatch(mobile, /סופי/);
    assert.match(mobile, /\(מחיר התחלה\)/);
    const song = buildLeadFlowWhatsAppText({
      ...base,
      serviceId: "song",
      tierId: "economy",
      tierCatalogExVat: getExVat("song_recording"),
    });
    assert.match(song, /סופי/);
  });
});
