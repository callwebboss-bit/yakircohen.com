/**
 * Keyword rules for auto-tagging portfolio videos (Hebrew titles).
 */

/** @typedef {'studio-recording' | 'podcast' | 'blessings' | 'bat-bar-mitzvah' | 'dj-events' | 'voiceover' | 'education' | 'entertainment' | 'brand-tv'} PortfolioTag */

/** @type {readonly { tag: PortfolioTag; patterns: RegExp[] }[]} */
export const TAG_RULES = [
  {
    tag: "entertainment",
    patterns: [
      /פארודיה|פרודיה|חיקוי|חיקויים|מצחיק|קורע|הגרסה הלא מצונזרת|הגרסת הערסים/i,
    ],
  },
  {
    tag: "brand-tv",
    patterns: [/חוזרים לגן|האח הגדול|זמן להכיר|הפעמון|מרפסת:/i],
  },
  {
    tag: "podcast",
    patterns: [/פודקאסט|podcast|זמן להכיר|מרפסת/i],
  },
  {
    tag: "voiceover",
    patterns: [/קריינות|קריין|dj סט|סט dj|פרסומת ברדיו|תשדיר/i],
  },
  {
    tag: "dj-events",
    patterns: [/תקליטן|די ג'יי|dj\b|dj\s|חתונה.*dj|dj.*חתונה|אירוע|נשף|פורים/i],
  },
  {
    tag: "bat-bar-mitzvah",
    patterns: [/בת מצווה|בר מצווה|בת-מצווה|בר-מצווה/i],
  },
  {
    tag: "blessings",
    patterns: [/ברכת|ברכה|דרשה|חתן וכלה|חתן\/כלה/i],
  },
  {
    tag: "education",
    patterns: [
      /מיקס|מאסטר|מיקרופון|קורס|איך |מה זה|מה ההבדל|טיפים|מחיר|עולה|wav|mp3|מוניטור|קונטרולר/i,
    ],
  },
  {
    tag: "studio-recording",
    patterns: [
      /אולפן|הקלטת שיר|הקלטה|תיקון זיופים|זיופים|ווקאל|שיר מקורי|קליפ/i,
    ],
  },
];

/** @type {Record<PortfolioTag, string[]>} */
export const TAG_TO_PLAYLISTS = {
  "studio-recording": ["studio-hub", "recording-studio", "recording-song-modiin"],
  podcast: ["podcast-hub", "studio-hub"],
  blessings: ["blessings-hub", "blessings-bride-groom", "blessings-bar-mitzvah"],
  "bat-bar-mitzvah": [
    "blessings-bar-mitzvah",
    "blessings-video-clip",
    "recording-song-modiin",
    "studio-gifts",
  ],
  "dj-events": ["events-dj", "events-hub"],
  voiceover: ["voiceover-hub", "voiceover-services", "voiceover-course"],
  education: ["studio-hub", "recording-studio"],
  entertainment: ["studio-hub-entertainment"],
  "brand-tv": ["studio-hub-entertainment", "podcast-hub"],
};

export const CONVERSION_PLAYLISTS = new Set([
  "blessings-hub",
  "blessings-bride-groom",
  "blessings-bar-mitzvah",
  "blessings-video-clip",
  "events-dj",
  "events-hub",
  "recording-song-modiin",
  "voiceover-hub",
  "voiceover-services",
]);

/**
 * @param {string} title
 * @returns {PortfolioTag[]}
 */
export function tagTitle(title) {
  const tags = new Set();
  for (const { tag, patterns } of TAG_RULES) {
    if (patterns.some((p) => p.test(title))) tags.add(tag);
  }
  if (tags.size === 0) tags.add("studio-recording");
  return [...tags];
}

/**
 * @param {PortfolioTag[]} tags
 * @returns {string[]}
 */
export function playlistsForTags(tags) {
  const playlists = new Set();
  const isEntertainment =
    tags.includes("entertainment") || tags.includes("brand-tv");

  for (const tag of tags) {
    const mapped = TAG_TO_PLAYLISTS[tag] ?? [];
    for (const pl of mapped) {
      if (isEntertainment && CONVERSION_PLAYLISTS.has(pl)) continue;
      playlists.add(pl);
    }
  }

  if (playlists.size === 0) playlists.add("studio-hub");
  return [...playlists].sort();
}
