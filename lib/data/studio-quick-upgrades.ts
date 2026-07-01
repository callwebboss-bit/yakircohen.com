import type { StudioUpgradeId } from "@/lib/data/studio-recording-booking";

export type StudioQuickUpgradeCard = {
  id: StudioUpgradeId;
  title: string;
  subtitle: string;
  emoji: string;
  /** תמונת יוטיוב או null לכרטיס עם אייקון בלבד */
  thumbSrc?: string;
};

export const STUDIO_QUICK_UPGRADE_CARDS: readonly StudioQuickUpgradeCard[] = [
  {
    id: "bts",
    title: "תמונות וסרטון קצר מהאולפן",
    subtitle: "לשמירה ולשיתוף עם המשפחה",
    emoji: "🎬",
    thumbSrc: "https://img.youtube.com/vi/8p22YCZEsmg/hqdefault.jpg",
  },
  {
    id: "express",
    title: "אקספרס וקדימות בשיבוץ",
    subtitle: "עדיפות בלו\"ז והגשה מהירה במיוחד",
    emoji: "⚡",
  },
  {
    id: "vocal_coaching",
    title: "הכנה קולית לפני הסשן",
    subtitle: "תגיעו לאולפן מוכנים ובטוחים",
    emoji: "🎤",
    thumbSrc: "https://img.youtube.com/vi/XUr2e5S4JSA/hqdefault.jpg",
  },
] as const;
