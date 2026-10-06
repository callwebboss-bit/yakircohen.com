import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExVat } from "@/lib/data/pricing-catalog";
import { SINGER_ADDONS, SINGER_PACKAGES } from "@/lib/data/singer-amplification-page";

/* אותו חילוץ כמו באשף ההזמנה וב-singer-booking-addons, שקוראים את price */
function digits(price: string): number {
  return Number(price.replace(/[^\d]/g, ""));
}

describe("הגברה לזמר: price לאשף ו-catalogId לתצוגה מתארים אותו מחיר", () => {
  it("כל חבילה: הסכום ב-price הוא בדיוק הסכום לפני מע״מ בקטלוג", () => {
    for (const pkg of SINGER_PACKAGES) {
      assert.equal(digits(pkg.price), getExVat(pkg.catalogId), pkg.id);
    }
  });

  it("כל תוספת: אותו דבר, ו-perHour רק לתוספת שה-price שלה לפי שעה", () => {
    for (const addon of SINGER_ADDONS) {
      assert.equal(digits(addon.price), getExVat(addon.catalogId), addon.name);
      assert.equal(addon.perHour === true, addon.price.includes("שעה"), addon.name);
    }
  });
});
