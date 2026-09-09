/**
 * תוכן עמוד הפקת בר מצווה ובת מצווה (/events/bar-mitzvah).
 * המחירים נשאבים מ-lib/data/pricing-catalog.ts דרך רשומת events-bar-mitzvah
 * ב-services.ts. כאן יושב רק התוכן שאינו תמחור.
 */

import type { ProcessStep } from "@/components/marketing/ProcessSteps";
import type { HubDecisionRow } from "@/lib/data/hub-decision-matrix";

/** ציר הזמן של הערב - הבסיס לאינפוגרפיקת השלבים */
export const BAR_MITZVAH_TIMELINE: readonly ProcessStep[] = [
  {
    number: 1,
    title: "פגישת תכנון",
    description:
      "עוברים על מבנה הערב: קבלת פנים, כניסה, דרשה, ברכות, ריקודים. מסמנים שירים שחייבים ושירים שלא מנגנים.",
  },
  {
    number: 2,
    title: "קבלת פנים והכניסה",
    description:
      "מוזיקת רקע בעוצמה שמאפשרת לדבר, ואז כניסה עם אפקט מתוזמן. זה הרגע שכולם מצלמים.",
  },
  {
    number: 3,
    title: "הדרשה והברכות",
    description:
      "מיקרופון אלחוטי, בדיקת סאונד מראש והנמכת מוזיקה מדורגת. הדרשה נשמעת בכל האולם, גם בשולחנות האחוריים.",
  },
  {
    number: 4,
    title: "רחבת הריקודים",
    description:
      "מעבר מדורג בין הדור המבוגר לנוער, קריאת קהל בזמן אמת ושמירת רגע שיא אחד לסוף.",
  },
] as const;

/** מה שמפריד בין הפקה שעובדת להפקה שמתפספסת - בלי סופרלטיבים */
export const BAR_MITZVAH_WHAT_MATTERS: readonly {
  id: string;
  title: string;
  description: string;
}[] = [
  {
    id: "generations",
    title: "רפרטואר לשלושה דורות",
    description:
      "רשימה שמחזיקה גם את חברי הכיתה וגם את הסבים, בגלים ולא בקפיצות חדות.",
  },
  {
    id: "speech",
    title: "סאונד לדיבור, לא רק למוזיקה",
    description:
      "הדרשה והברכות הן הליבה של הערב. הגברת דיבור דורשת כוונון נפרד ממוזיקה, כולל מיקום רמקולים ומניעת פידבק.",
  },
  {
    id: "timing",
    title: "לוח זמנים שמכבד את המעמד",
    description:
      "מתאמים מול האולם, הצלם והמשפחה מתי בדיוק כל שלב מתחיל, כדי שהדרשה לא תיפול באמצע הגשת מנה עיקרית. זה תיאום של חמש דקות שחוסך את הרגע המביך של הערב.",
  },
] as const;

/** בר מצווה מול בת מצווה - הבדל אמיתי בתכנון, לא בשיווק */
export const BAR_VS_BAT_MITZVAH: readonly {
  aspect: string;
  bar: string;
  bat: string;
}[] = [
  {
    aspect: "מרכז הערב",
    bar: "הדרשה וקטע התורה, עם מעמד שקט לפני הריקודים",
    bat: "ריקוד מתוכנן או מופע קצר, לרוב עם חזרות מראש",
  },
  {
    aspect: "רפרטואר",
    bar: "שילוב מוזיקה חסידית או ישראלית עם פופ לצעירים",
    bat: "משקל גדול יותר לפופ עדכני ולשירים מהרשתות",
  },
  {
    aspect: "אפקטים",
    bar: "עשן כבד או זיקוקים קרים בכניסה ובהרמה",
    bat: "קונפטי ובועות סביב הריקוד המרכזי",
  },
  {
    aspect: "תוספת מבוקשת",
    bar: "הקלטת דרשה מראש כגיבוי",
    bat: "מצגת גדילה וקליפ לרשתות",
  },
] as const;

/** ניתוב פנימי - כל שורה מובילה לעמוד קיים */
export const BAR_MITZVAH_DECISIONS: readonly HubDecisionRow[] = [
  {
    ifYouWant: "תקליטן בלבד, בלי אפקטים",
    thenGo: "DJ לאירועים",
    href: "/events/dj-events",
  },
  {
    ifYouWant: "להקליט את הדרשה באולפן מראש",
    thenGo: "הקלטת דרשה לבר מצווה",
    href: "/studio/blessings/bar-mitzvah",
  },
  {
    ifYouWant: "לבחור אפקטים אחד אחד",
    thenGo: "כל האטרקציות",
    href: "/events/attractions",
  },
  {
    ifYouWant: "מצגת מתמונות הילדות",
    thenGo: "מצגת ווידאו",
    href: "/video",
  },
  {
    ifYouWant: "מנחה שינהל את הערב",
    thenGo: "מנחה אירועים",
    href: "/events/host",
  },
  {
    ifYouWant: "לראות את כל המחירים במקום אחד",
    thenGo: "מחירון",
    href: "/pricing",
  },
] as const;
