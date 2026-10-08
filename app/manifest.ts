import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "יקיר כהן - אולפן הקלטות",
    short_name: "יקיר כהן",
    description: "אולפן הקלטות, תיקון זיופים, מיקס ומאסטרינג",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf8",
    theme_color: "#ffffff",
    lang: "he",
    dir: "rtl",
    icons: [
      /* 192 ו-512 הם התנאי של כרום באנדרואיד להצעת התקנה (beforeinstallprompt).
         שני הקבצים ישבו ב-public מיוני ולא הוצהרו, ולכן ההצעה מעולם לא קפצה.
         8.10.2026: האייקון שהבעלים בחר (העין מתוך הלוגו, scripts/generate-icons.mjs).
         ריבוע מלא עם הסימן בתוך אזור הבטיחות, ולכן אותו קובץ משמש גם כ-maskable.
         /icon ו-/apple-icon הוסרו מכאן: הם קבצים סטטיים עכשיו, ו-Next מצהיר עליהם ב-head. */
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
