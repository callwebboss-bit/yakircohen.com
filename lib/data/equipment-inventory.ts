export type InventoryCategory = "mixer" | "sub" | "speaker" | "lighting" | "dj";

export type InventoryItem = {
  id: string;
  label: string;
  category: InventoryCategory;
  qtyTotal: number;
  dailyRateExVat: number;
  riderAliases: readonly string[];
};

/** מקור אמת סטטי — עדכון זמינות דרך equipment-inventory-state.json בקלוזר */
export const EQUIPMENT_INVENTORY: readonly InventoryItem[] = [
  {
    id: "mixer_ah_qu",
    label: "מיקסר Allen & Heath QU-24",
    category: "mixer",
    qtyTotal: 1,
    dailyRateExVat: 850,
    riderAliases: ["Allen Heath QU", "AH QU", "QU-24"],
  },
  {
    id: "sub_rcf_15",
    label: "סאב RCF 15\" פעיל",
    category: "sub",
    qtyTotal: 2,
    dailyRateExVat: 450,
    riderAliases: ["RCF sub", "סאב 15", "2x sub"],
  },
  {
    id: "speaker_rcf_745",
    label: "זוג רמקולים RCF ART 745",
    category: "speaker",
    qtyTotal: 2,
    dailyRateExVat: 650,
    riderAliases: ["RCF 745", "ART 745", "זוג רמקולים"],
  },
  {
    id: "dj_cdj_pair",
    label: "זוג Pioneer CDJ 3000",
    category: "dj",
    qtyTotal: 1,
    dailyRateExVat: 1200,
    riderAliases: ["CDJ 3000", "Pioneer CDJ", "2x CDJ"],
  },
  {
    id: "led_wash",
    label: "תאורת Wash RGB (4 יח')",
    category: "lighting",
    qtyTotal: 1,
    dailyRateExVat: 550,
    riderAliases: ["wash rgb", "תאורת במה", "moving wash"],
  },
] as const;

export type InventoryBooking = {
  itemId: string;
  date: string;
  qty: number;
};

/** הזמנות פעילות — מסונכרן מ-export:closer */
import bookingsData from "@/lib/data/equipment-inventory-bookings.json";

export let INVENTORY_BOOKINGS: readonly InventoryBooking[] =
  (bookingsData as { bookings?: InventoryBooking[] }).bookings ?? [];

const inventoryById = new Map(EQUIPMENT_INVENTORY.map((i) => [i.id, i]));

export function getInventoryItem(id: string): InventoryItem | undefined {
  return inventoryById.get(id);
}

export function checkAvailability(
  date: string,
  itemIds: readonly string[],
): {
  date: string;
  items: {
    id: string;
    label: string;
    requested: number;
    available: number;
    dailyRateExVat: number;
    ok: boolean;
  }[];
  allAvailable: boolean;
} {
  const bookingsForDate = INVENTORY_BOOKINGS.filter((b) => b.date === date);
  const bookedQty = new Map<string, number>();
  for (const b of bookingsForDate) {
    bookedQty.set(b.itemId, (bookedQty.get(b.itemId) ?? 0) + b.qty);
  }

  const items = itemIds.map((id) => {
    const item = getInventoryItem(id);
    if (!item) {
      return {
        id,
        label: id,
        requested: 1,
        available: 0,
        dailyRateExVat: 0,
        ok: false,
      };
    }
    const booked = bookedQty.get(id) ?? 0;
    const available = Math.max(0, item.qtyTotal - booked);
    return {
      id,
      label: item.label,
      requested: 1,
      available,
      dailyRateExVat: item.dailyRateExVat,
      ok: available >= 1,
    };
  });

  return {
    date,
    items,
    allAvailable: items.every((i) => i.ok),
  };
}
