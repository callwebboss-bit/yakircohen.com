import type { ServiceType } from "@/lib/leads/types";

const GUIDES: Partial<Record<ServiceType, { title: string; bullets: string[]; href: string }>> = {
  studio: {
    title: "לפני שיחת האולפן",
    bullets: [
      "הכינו רפרנס קצר (שיר / סגנון)",
      "ציינו תאריך יעד אם יש",
      "הגיעו עם קבצים בטלפון או בענן",
    ],
    href: "https://yakircohen.com/studio/recording-studio",
  },
  podcast: {
    title: "לפני הקלטת פודקאסט",
    bullets: [
      "סכמו נושא לפרק אחד",
      "בדקו אם צריך אורחים / מרחוק",
      "הכינו שאלות פתיחה",
    ],
    href: "https://yakircohen.com/podcast",
  },
  events: {
    title: "לפני תיאום אירוע",
    bullets: [
      "תאריך, מיקום ומספר אורחים",
      "סוג אירוע (חתונה / פרטי / עסקי)",
      "העדפות מוזיקה או תוכנית",
    ],
    href: "https://yakircohen.com/events",
  },
  business: {
    title: "לפני שיחת עסקים",
    bullets: [
      "מטרת ההקלטה (מודעה / הדרכה / מיתוג)",
      "אורך משוער",
      "דדליין",
    ],
    href: "https://yakircohen.com/business",
  },
  photography: {
    title: "לפני תיאום צילום",
    bullets: ["סוג צילום", "מיקום ותאריך", "היקף משוער"],
    href: "https://yakircohen.com/photography",
  },
  online: {
    title: "לפני שליחת קובץ לשחזור",
    bullets: [
      "שלחו קטע של עד 30 שניות",
      "ציינו מה מפריע בסאונד",
      "פורמט מקור אם ידוע",
    ],
    href: "https://yakircohen.com/online",
  },
};

export function buildPreCallGuide(serviceType: ServiceType): {
  subject: string;
  text: string;
  html: string;
  waSnippet: string;
} {
  const guide =
    GUIDES[serviceType] ||
    ({
      title: "לפני השיחה",
      bullets: ["ציינו שירות ותאריך", "הכינו שאלות", "אפשר גם מחירון: https://yakircohen.com/pricing"],
      href: "https://yakircohen.com/pricing",
    } as const);

  const text = [
    guide.title,
    "",
    ...guide.bullets.map((b) => `• ${b}`),
    "",
    `פרטים: ${guide.href}`,
  ].join("\n");

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;direction:rtl;text-align:right;">
  <h2 style="margin:0 0 8px;font-size:18px;">${guide.title}</h2>
  <ul>${guide.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
  <p><a href="${guide.href}">לפרטים באתר</a></p>
</div>`.trim();

  return {
    subject: guide.title,
    text,
    html,
    waSnippet: `\n\n---\n${guide.title}:\n${guide.bullets.map((b) => `• ${b}`).join("\n")}`,
  };
}
