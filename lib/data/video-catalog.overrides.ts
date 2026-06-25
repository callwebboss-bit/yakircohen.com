/** Manual ordering and featured picks - survives catalog re-import */

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
    "P425XNK7z5M",
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
    "yjxF9pKzbr0",
    "lmYykgKAdUg",
    "zC0B9jwiIHY",
    "XSrLicVCaGM",
    "NA3Z54Bl-xM",
    "5pBisBkfTEg",
  ],
  "events-attractions": [
    "yjxF9pKzbr0",
    "hg5qW6nk0iU",
    "5pBisBkfTEg",
    "lmYykgKAdUg",
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
  "dj-voice-tags": [
    "7DEp-gnDTs4",
    "Vuz4m8OaDcA",
    "Mh3RosX3a8g",
    "hSGhpN_CR7s",
    "zHkq_5bXptg",
    "57FuI0EC_I4",
  ],
  "dry-hire": [
    "K1oAL8qg1W0",
    "9O0d3v1SqMc",
    "nBtKa0JZfL0",
    "B5wvK5x1i38",
  ],
  "bulk-production": [
    "q1Omi-3L3QM",
    "wa_mOrjJvK8",
    "XiiOcx8doz0",
    "cengTHzov5I",
  ],
  "mashup-fixer": [
    "U6LJERy6Wdk",
    "SvhfZK9Ribg",
    "FtzsXXnts_k",
    "5-PTfYMMlV4",
  ],
};

/** Titles for playlist IDs not always present in generated catalog */
export const PLAYLIST_VIDEO_FALLBACKS: Record<
  string,
  { title: string; description?: string }
> = {
  "q1Omi-3L3QM": { title: "פודקאסט מהאולפן, דוגמה מלאה" },
  wa_mOrjJvK8: { title: "לפני ואחרי עריכת זום" },
};

/** Curated playlists -only these IDs (order preserved), not auto-tagged remainder */
export const PLAYLIST_EXPLICIT_IDS: Record<string, readonly string[]> = {
  "dj-voice-tags": PLAYLIST_FEATURED_IDS["dj-voice-tags"]!,
  "dry-hire": PLAYLIST_FEATURED_IDS["dry-hire"]!,
  "bulk-production": PLAYLIST_FEATURED_IDS["bulk-production"]!,
  "mashup-fixer": PLAYLIST_FEATURED_IDS["mashup-fixer"]!,
};

/** Short descriptions for hero picks (optional) */
export const VIDEO_DESCRIPTION_OVERRIDES: Record<string, string> = {
  P425XNK7z5M:
    "כותבים ראפ מאפס באולפן - Flow, Bars ובניית שיר עם דניאל עוז. לשיר המלא - חפשו דניאל עוז.",
  XUr2e5S4JSA:
    "תיק עבודות - רון נשר וז'קו אייזנברג (הוקלט ביקיר כהן הפקות)",
  "8i4K2f5gQfM": "הקלטת שיר לחתונה - קאבר עם הפקה מותאמת אישית",
  q18Lu0MvXHo:
    "אירוח זמרים באולפן - פיצ'ר, שיתוף פעולה והקלטה משותפת",
  D3JV9SDY6GY: "קידום פודקאסט, קליפ AI ושיר מקורי בשעה",
  "7DEp-gnDTs4": "מיתוג סט DJ בכ-10 שניות",
  Vuz4m8OaDcA: "פתיחה לסט, שלושה תקליטנים יחד",
  Mh3RosX3a8g: "מדריך קצר לתקליטנים",
  hSGhpN_CR7s: "למה בכלל צריך קריינות לסט",
  zHkq_5bXptg: "הקלטה באולפן, בלי עריכה מסובכת",
  "57FuI0EC_I4": "מאחורי הקלעים, שני קריינים",
  K1oAL8qg1W0: "הגברה באירוע חי",
  "9O0d3v1SqMc": "RCF והקמה בשטח",
  nBtKa0JZfL0: "עמדת DJ ומערכת מלאה",
  B5wvK5x1i38: "הבדלים בין מיקסרים לאמנים",
  "q1Omi-3L3QM": "פרק שלם מהאולפן",
  wa_mOrjJvK8: "עריכה שהופכת זום לשמע נקי",
  XiiOcx8doz0: "פודקאסט מוקלט באולפן",
  cengTHzov5I: "איך מזמינים אורחים לפודקאסט",
  U6LJERy6Wdk: "איך בונים רמיקס לפתיחת ריקודים",
  SvhfZK9Ribg: "רמיקס חתונות - מאחורי הקלעים",
  FtzsXXnts_k: "רמיקס אירועים - דוגמה מהשטח",
  "5-PTfYMMlV4": "רמיקס רשמי - שילוב להיטים",
  yjxF9pKzbr0:
    "שני תותחי קונפטי על במה - הפעלה באירוע סיום שנת הלימודים בבית ספר",
};
