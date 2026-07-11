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
    ],
  };
}
