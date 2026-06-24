import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "יקיר כהן - אולפן הקלטות",
    short_name: "יקיר כהן",
    description: "אולפן הקלטות, תיקון זיופים, מיקס ומאסטרינג",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf8",
    theme_color: "#d42b2b",
    lang: "he",
    dir: "rtl",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
