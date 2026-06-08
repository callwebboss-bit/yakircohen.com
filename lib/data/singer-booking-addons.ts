import { SINGER_ADDONS } from "@/lib/data/singer-amplification-page";
import type { BookingUpsellItem } from "@/lib/data/booking-shared";

function parsePriceNis(price: string): number {
  const n = parseInt(price.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

export const SINGER_BOOKING_ADDONS: readonly BookingUpsellItem[] = SINGER_ADDONS.map(
  (addon, index) => ({
    id: `singer_addon_${index}`,
    name: addon.name,
    description: addon.price.includes("שעה") ? "תוספת לפי שעה" : undefined,
    price: parsePriceNis(addon.price),
  }),
);

export function sumSingerAddons(selected: ReadonlySet<string>): number {
  return SINGER_BOOKING_ADDONS.filter((a) => selected.has(a.id)).reduce(
    (sum, a) => sum + a.price,
    0,
  );
}
