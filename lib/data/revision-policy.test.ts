import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CORPORATE_VIDEO_PROOF } from "@/lib/data/corporate-video-page";
import { GROWTH_SLIDESHOW_FAQS } from "@/lib/data/growth-slideshow-page";
import { SLIDESHOW_PROCESS_STEPS } from "@/lib/data/photo-slideshow-page";
import { PODCAST_HUB_FAQS } from "@/lib/data/podcast-hub-page";
import { getPriceById, getPriceTransparencyById } from "@/lib/data/pricing-catalog";
import { REVISION_POLICIES } from "@/lib/data/revision-policy";
import { VOICEOVER_YAKIR_NOTE } from "@/lib/data/voiceover-narrator-compare";

const policy = (id: string) => {
  const p = REVISION_POLICIES.find((x) => x.id === id);
  assert.ok(p, `missing revision policy ${id}`);
  return p;
};

/* הדף /whats-included מציג את REVISION_POLICIES. אם דף שירות משנה את מספר
   הסבבים בלי revision-policy.ts (או להפך), הבדיקה הזו נכשלת. 11.10.2026 */
describe("revision policy matches the service pages", () => {
  it("song: the catalog line is the summary, 2 rounds", () => {
    const t = getPriceTransparencyById("song_recording");
    assert.ok(t.included.includes(policy("song").summary), t.included.join(" | "));
    assert.equal(policy("song").rounds, 2);
  });

  it("blessing: revisions are included without a count", () => {
    assert.ok(getPriceTransparencyById("blessing_recording").included.includes("תיקונים"));
    assert.equal(policy("blessing").rounds, null);
  });

  it("podcast: the hub FAQ answer is the summary", () => {
    const faq = PODCAST_HUB_FAQS.find((f) => f.id === "revisions");
    assert.ok(faq);
    assert.ok(faq.answer.startsWith(policy("podcast").summary), faq.answer);
  });

  it("online mix: one round in the catalog card", () => {
    assert.ok(getPriceTransparencyById("online_home_mix").included.includes(policy("online-mix").summary));
    assert.equal(policy("online-mix").rounds, 1);
  });

  it("voiceover and corporate video: 2 rounds", () => {
    assert.match(VOICEOVER_YAKIR_NOTE, /עד 2 סבבי תיקונים/);
    assert.match(CORPORATE_VIDEO_PROOF, /2 סבבי תיקונים/);
    assert.equal(policy("voiceover").rounds, 2);
    assert.equal(policy("corporate-video").rounds, 2);
  });

  it("slideshows: one round on both slideshow pages", () => {
    assert.ok(SLIDESHOW_PROCESS_STEPS.some((s) => s.body.includes("סבב תיקונים אחד כלול")));
    assert.ok(GROWTH_SLIDESHOW_FAQS.some((f) => f.answer.includes("סבב תיקונים אחד כלול")));
    assert.equal(policy("slideshow").rounds, 1);
  });

  it("every extra round points at a real add-on", () => {
    for (const p of REVISION_POLICIES) {
      if (p.extraRoundId) assert.equal(getPriceById(p.extraRoundId).category, "addons", p.id);
    }
  });

  it("no open-ended satisfaction promise is left in the copy", () => {
    for (const p of REVISION_POLICIES) {
      assert.doesNotMatch(p.summary, /100%|עד שתהיו מרוצים/, p.id);
    }
  });
});
