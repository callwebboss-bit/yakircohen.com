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
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
      { src: "/icon", sizes: "32x32", type: "image/png" },
      /* 192 ו-512 הם התנאי של כרום באנדרואיד להצעת התקנה (beforeinstallprompt).
         שני הקבצים ישבו ב-public מיוני ולא הוצהרו, ולכן ההצעה מעולם לא קפצה. */
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
