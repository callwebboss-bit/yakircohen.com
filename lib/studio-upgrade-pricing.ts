import {
  STUDIO_RECORDING_UPGRADES,
  type StudioUpgradeId,
} from "@/lib/data/studio-recording-booking";

export const LAST_MINUTE_BTS_PROMO_PRICE = 99;
export const LAST_MINUTE_BTS_LIST_PRICE = 250;

export function upgradePriceExVat(
  id: StudioUpgradeId,
  opts?: { lastMinuteBtsDeal?: boolean },
): number {
  if (id === "bts" && opts?.lastMinuteBtsDeal) {
    return LAST_MINUTE_BTS_PROMO_PRICE;
  }
  return STUDIO_RECORDING_UPGRADES.find((u) => u.id === id)?.price ?? 0;
}

export function calcUpgradesTotalExVat(
  ids: readonly StudioUpgradeId[],
  opts?: { lastMinuteBtsDeal?: boolean },
): number {
  return ids.reduce((sum, id) => sum + upgradePriceExVat(id, opts), 0);
}
