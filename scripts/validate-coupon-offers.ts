import { validateCouponConfig } from "../lib/data/coupon-offers";
import { validateDiscountPolicy } from "../lib/data/discount-policy";

try {
  validateCouponConfig();
  console.log("✓ coupon-offers config valid (cap, dates, catalog ids)");
  /* החלטת הבעלים 3.10.2026 (סבב שני): אין הנחה מעל 8%. חבילות קטלוג,
     תקרת קופון, מחיר ייחוס באשפים, מבצע הסושיאל והנחת חבילת ה-AI. */
  validateDiscountPolicy();
  console.log("✓ discount policy: no computed discount above 8%");
} catch (err) {
  console.error("✗ coupon-offers / discount validation failed:");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
