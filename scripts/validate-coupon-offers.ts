import { validateCouponConfig } from "../lib/data/coupon-offers";

try {
  validateCouponConfig();
  console.log("✓ coupon-offers config valid (cap, dates, catalog ids)");
} catch (err) {
  console.error("✗ coupon-offers validation failed:");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
