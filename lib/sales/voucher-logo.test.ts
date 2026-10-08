import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { VOUCHER_LOGO_DATA_URL } from "@/lib/sales/voucher-logo.generated";

/*
 * הלוגו שבתוך החבילה של עמדת המכירות (בדיקת הלוגו 7.10.2026) הוא בדיוק
 * public/images/logo.svg. אם הלוגו משתנה, הבדיקה נכשלת עד שמריצים
 * node scripts/generate-voucher-logo.mjs
 */
describe("VOUCHER_LOGO_DATA_URL", () => {
  const prefix = "data:image/svg+xml;base64,";

  it("is an SVG data URL", () => {
    assert.ok(VOUCHER_LOGO_DATA_URL.startsWith(prefix));
  });

  it("matches public/images/logo.svg byte for byte", () => {
    const file = readFileSync(join(process.cwd(), "public", "images", "logo.svg"));
    const embedded = Buffer.from(VOUCHER_LOGO_DATA_URL.slice(prefix.length), "base64");
    assert.ok(embedded.equals(file), "להריץ: node scripts/generate-voucher-logo.mjs");
  });
});
