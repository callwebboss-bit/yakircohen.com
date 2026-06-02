/** Manual ordering and featured picks — survives catalog re-import */

/** Pinned order per playlist (IDs first, then auto-tagged remainder) */
export const PLAYLIST_FEATURED_IDS: Record<string, readonly string[]> = {
  "studio-hub": [
    "XUr2e5S4JSA",
    "8i4K2f5gQfM",
    "wfTY8Bz2uE4",
    "q18Lu0MvXHo",
    "D3JV9SDY6GY",
    "K8c9xAHWN-g",
    "c55HTqTArFo",
  ],
  "recording-song-modiin": [
    "8i4K2f5gQfM",
    "2apMsrmEsDs",
    "Fsy4Eg00dCA",
    "1ilgnokOS7Q",
    "wfTY8Bz2uE4",
    "sNZPrz-rasQ",
    "K8c9xAHWN-g",
  ],
  "recording-studio": [
    "J2i9mmBZrig",
    "UnBc2a3ve9w",
    "0XXeBgOm4XA",
    "c55HTqTArFo",
    "ne023hwMqH0",
  ],
  "podcast-hub": [
    "wa_mOrjJvK8",
    "XiiOcx8doz0",
    "cengTHzov5I",
    "1O0isV7Zljg",
    "zjoXk7QuLzY",
    "GFYoIU-UseE",
    "eKGkeVYzUl4",
  ],
  "blessings-hub": ["wfTY8Bz2uE4", "kLA-XVH3m4E", "y8w_BRwe_tg"],
  "blessings-bar-mitzvah": [
    "wfTY8Bz2uE4",
    "Fsy4Eg00dCA",
    "y8w_BRwe_tg",
    "KYAah8VSNg8",
    "7y7IQPL8k9M",
  ],
  "blessings-bride-groom": ["kLA-XVH3m4E", "qY67kRGsRnY", "2apMsrmEsDs"],
  "blessings-video-clip": [
    "1ilgnokOS7Q",
    "M6r7NzBiEpc",
    "8i4K2f5gQfM",
    "Fsy4Eg00dCA",
  ],
  "events-dj": [
    "lmYykgKAdUg",
    "zC0B9jwiIHY",
    "XSrLicVCaGM",
    "NA3Z54Bl-xM",
    "5pBisBkfTEg",
  ],
  "voiceover-hub": ["O2RHNRZCmZM", "7DEp-gnDTs4", "Tcv7Tb1uCfI"],
  "voiceover-services": ["7DEp-gnDTs4", "zHkq_5bXptg", "qYiuRdBJMuE"],
  "voiceover-course": ["wN4N0QsfDJo", "oVeIMBTmS_8"],
  "studio-gifts": [
    "8i4K2f5gQfM",
    "c55HTqTArFo",
    "1ilgnokOS7Q",
    "Fsy4Eg00dCA",
  ],
};

/** Short descriptions for hero picks (optional) */
export const VIDEO_DESCRIPTION_OVERRIDES: Record<string, string> = {
  XUr2e5S4JSA:
    "תיק עבודות - רון נשר וז'קו אייזנברג (הוקלט ביקיר כהן הפקות)",
  "8i4K2f5gQfM": "הקלטת שיר לחתונה - קאבר עם הפקה מותאמת אישית",
  q18Lu0MvXHo:
    "אירוח זמרים באולפן - פיצ'ר, שיתוף פעולה והקלטה משותפת",
  D3JV9SDY6GY: "קידום פודקאסט, קליפ AI ושיר מקורי בשעה",
};
