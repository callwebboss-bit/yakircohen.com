import type { BookCategoryId } from "@/lib/book-url";

/** מזהה שירות ב-yakir-closer לפי קטגוריית /book */
export const BOOK_CLOSER_SERVICE: Record<BookCategoryId, string> = {
  studio: "recording",
  podcast: "podcast",
  events: "effects_only",
  dj: "dj",
  photography: "recording",
  clips: "recording",
  singer: "live_sound",
  academy: "academy",
  online: "online_ai",
};

/** פרמטר service ב-/thank-you */
export const BOOK_THANK_YOU_SERVICE: Record<BookCategoryId, string> = {
  studio: "studio",
  podcast: "podcast",
  events: "events",
  dj: "dj",
  photography: "photography",
  clips: "clips",
  singer: "singer",
  academy: "academy",
  online: "online",
};

/** מיפוי פרמטר service ב-/thank-you לקטגוריית /book */
export const THANK_YOU_TO_BOOK_CATEGORY: Record<string, BookCategoryId> = {
  studio: "studio",
  events: "events",
  podcast: "podcast",
  photography: "photography",
  dj: "dj",
  singer: "singer",
  academy: "academy",
  online: "online",
  clips: "clips",
};
