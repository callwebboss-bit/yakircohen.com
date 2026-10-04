import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PODCAST_HUB_CTA_LABEL, PODCAST_HUB_STARTING_PRICE } from "@/lib/data/podcast-hub-page";
import { PODCAST_HUB_TRACKS_STUDIO } from "@/lib/data/podcast-hub-tracks";
import { PODCAST_HUB_SEO } from "@/lib/seo/hub-pages";
import { BOOK_AUDIENCE_ROUTES } from "@/lib/data/book-audience-routes";
import { getExVat } from "@/lib/data/pricing-catalog";
import { withVat } from "@/lib/data/pricing";

/* WP3 (PI-02, PB-01, PJ-16, S08): "פרק מוכן מ-750" היה מחיר חצי שעה גלם */
describe("podcast price anchor is the edited episode", () => {
  const audio = withVat(getExVat("podcast_audio")).toLocaleString("he-IL");
  const raw = getExVat("studio_half_hour").toLocaleString("he-IL");

  it("hub CTA, starting price and meta description anchor on podcast_audio", () => {
    for (const text of [PODCAST_HUB_CTA_LABEL, PODCAST_HUB_STARTING_PRICE, PODCAST_HUB_SEO.description]) {
      assert.ok(text.includes(audio), text);
      assert.ok(!text.includes(`מ-${raw}`), text);
    }
  });

  it("/book podcast route anchors on podcast_audio", () => {
    const route = BOOK_AUDIENCE_ROUTES.find((r) => r.id === "podcast-content");
    assert.equal(route?.priceExVat, getExVat("podcast_audio"));
  });

  it("the half-hour price only appears labelled as raw, no editing", () => {
    const studio = PODCAST_HUB_TRACKS_STUDIO.find((t) => t.href === "/podcast/podcast-studio-modiin");
    assert.match(studio?.description ?? "", /בלי עריכה/);
  });
});
