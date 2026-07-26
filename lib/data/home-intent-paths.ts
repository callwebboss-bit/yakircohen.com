import type { PriceItemId } from "@/lib/data/pricing-catalog";
import { INTENT_NAV_ITEMS } from "@/lib/data/intent-nav";

export type HomeIntentPath = {
  id: string;
  /** כותרת קצרה - זהה ל-Intent-nav לשפה אחידה */
  title: string;
  /** תוצאה - מה מקבלים בסוף */
  outcome: string;
  /** עוגן מחיר מקטלוג המחירים */
  priceId?: PriceItemId;
  /** מחיר התחלתי כשאין פריט קטלוג מתאים (לפני מע״מ) */
  fromPriceExVat?: number;
  /** כשאין מחיר מספרי - שורת עוגן טקסטואלית */
  priceNote?: string;
  href: string;
};

const BY_INTENT_ID: Record<
  string,
  Pick<HomeIntentPath, "outcome" | "priceId" | "fromPriceExVat" | "priceNote">
> = {
  song: {
    outcome: "קאבר או שיר מקורי, כולל ליווי מקצועי",
    priceId: "cover_song",
  },
  blessing: {
    outcome: "הקלטה באולפן במודיעין, קובץ מוכן לאירוע",
    priceId: "blessing_recording",
  },
  podcast: {
    outcome: "פרק מוקלט וערוך, מוכן להעלאה לספוטיפיי",
    priceId: "podcast_audio",
  },
  mobile: {
    outcome: "מגיעים עם הציוד אליכם הביתה או למשרד",
    fromPriceExVat: 999,
  },
  business: {
    outcome: "רילז, קריינות ופודקאסט עם חשבונית מס",
    priceNote: "הצעה תוך 24 שעות",
  },
  pricing: {
    outcome: "כל המחירים במקום אחד, לפני ואחרי מע״מ",
    priceNote: "לפי מסלול",
  },
};

/**
 * מסלולי כניסה בדף הבית - אותן תוויות ויעדים כמו Intent-nav.
 */
export const HOME_INTENT_PATHS: readonly HomeIntentPath[] = INTENT_NAV_ITEMS.map(
  (item) => {
    const extras = BY_INTENT_ID[item.id] ?? { outcome: item.label };
    return {
      id: item.id,
      title: item.label,
      href: item.href,
      ...extras,
    };
  },
);
