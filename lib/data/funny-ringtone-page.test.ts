import { test } from "node:test";
import assert from "node:assert/strict";
import { getExVat } from "@/lib/data/pricing-catalog";
import { RINGTONE_PRICE_FULL, RINGTONE_PRICE_LABEL, RINGTONE_PRICE_NIS, RINGTONE_HERO } from "@/lib/data/funny-ringtone-page";

test("מחיר הרינגטון שווה לקטלוג ומוצג כולל מע״מ, בלי מבצע", () => {
  assert.equal(RINGTONE_PRICE_NIS, getExVat("voiceover_funny_ringtone"));
  assert.match(RINGTONE_PRICE_LABEL, /353 ₪ כולל מע״מ/);
  assert.match(RINGTONE_PRICE_FULL, /\(299 ₪ \+ מע״מ\)/);
  assert.doesNotMatch(`${RINGTONE_HERO.priceBadge} ${RINGTONE_HERO.whatsappText}`, /מבצע/);
});
