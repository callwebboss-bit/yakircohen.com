/**
 * שירים לבת מצווה: מקור אמת יחיד לרשימות בפוסט /blog/bat-mitzvah-songs.
 *
 * כל שיר כאן נבחר על ידי הבעלים, או הופיע ברשימה שלו באתר הישן, ונבדק
 * שם ומבצע מול מקור ציבורי (source). שיר שהמחקר הציע נכנס לכאן רק אחרי
 * "מאשר" של הבעלים, לא לפני. מחקר המועמדים, 4.10.2026, נשמר מחוץ לקוד.
 *
 * המאמר מאחד את ארבע הכתובות הישנות של המאמר (שירים-לבת-מצווה, -2,
 * רשימת-שירים-לבת-מצווה, שירי-בת-מצווה-להרים-את-הרחבה...) ושתי כתובות
 * עם תאריך מ-2021. ההפניות ב-lib/legacy-redirects.ts.
 */

export type BatMitzvahSong = {
  title: string;
  artist: string;
  /** הערה קצרה שמוצגת אחרי השם. בלי מחירים ובלי מילות השיר. */
  note?: string;
  /** איפה נבדקו השם והמבצע. לא מוצג באתר. */
  source: string;
};

export type BatMitzvahSongList = {
  id: string;
  songs: readonly BatMitzvahSong[];
};

/** שירי כניסה. חמשת הראשונים מהרשימה של הבעלים באתר הישן (2022), השאר מ-4.10.2026. */
export const BAT_MITZVAH_ENTRANCE_SONGS: BatMitzvahSongList = {
  id: "entrance",
  songs: [
    {
      title: "מה שאת אוהבת",
      artist: "גלי עטרי",
      source: "https://www.youtube.com/watch?v=nDk7kInbY90",
    },
    {
      title: "דרך ארוכה",
      artist: "משה פרץ",
      source: "https://www.youtube.com/watch?v=duxdN4IGF-A",
    },
    {
      title: "משהו חדש מתחיל",
      artist: "דני רובס",
      source: "https://www.youtube.com/watch?v=8yfWmcGlVn8",
    },
    {
      title: "אין עוד מלבדו",
      artist: "שלומי שבת",
      source: "https://www.youtube.com/watch?v=T_x5_OnpjsI",
    },
    {
      title: "הכל עוד לפניי",
      artist: "התקווה 6",
      source: "https://www.youtube.com/watch?v=dauW62xmwZQ",
    },
    {
      title: "נערה חשמלית",
      artist: "דנה פרידר",
      note: "מפסטיגל 2007",
      source: "https://www.youtube.com/watch?v=x97pI3E06os",
    },
    {
      title: "לעוף",
      artist: "הראל סקעת",
      note: "מפסטיגל 2004",
      source: "https://www.youtube.com/watch?v=4amB_v7uqKU",
    },
    /* מכאן: מחקר 4.10.2026, אושר על ידי הבעלים באותו יום. */
    {
      title: "קחי לך",
      artist: "ריטה ומשי קלינשטיין",
      note: "דואט של אמא ובת",
      source: "https://www.youtube.com/watch?v=Y0845qZjvAM",
    },
    {
      title: "מתנות קטנות",
      artist: "רמי קלינשטיין",
      note: "שיר תודה שכל הדורות מכירים",
      source: "https://www.youtube.com/watch?v=pn_p5_8taxg",
    },
    {
      title: "באה אליכם",
      artist: "מירי מסיקה",
      source: "https://www.youtube.com/watch?v=7IaJXfVY5Pk",
    },
  ],
};

/** שירים חדשים, סוף 2025 ו-2026. מחקר 4.10.2026, אושר על ידי הבעלים באותו יום. */
export const BAT_MITZVAH_2026_SONGS: BatMitzvahSongList = {
  id: "2026",
  songs: [
    {
      title: "רוצי ילדה",
      artist: "בן צור",
      note: "מילים שמעודדות ילדה",
      source: "https://www.youtube.com/watch?v=qXcXNXBJbp8",
    },
    {
      title: "אהבת השם",
      artist: "בן צור",
      source: "https://www.youtube.com/watch?v=5m-riTk7N2I",
    },
    {
      title: "או לה פופה",
      artist: "נועה קירל",
      source: "https://www.youtube.com/watch?v=aQfI0WP-fcE",
    },
    {
      title: "הלוואי",
      artist: "חנן בן ארי ופאר טסי",
      note: "לרגע מרגש, לא לריקוד",
      source: "https://www.youtube.com/watch?v=4DbqBFPv1aE",
    },
  ],
};

/** בת מצווה דתית. מחקר 4.10.2026, אושר על ידי הבעלים באותו יום. */
export const BAT_MITZVAH_RELIGIOUS_SONGS: BatMitzvahSongList = {
  id: "religious",
  songs: [
    {
      title: "תוכו רצוף אהבה",
      artist: "ישי ריבו",
      note: "לכניסה שקטה",
      source: "https://www.youtube.com/watch?v=fQRgX3ivUKU",
    },
    {
      title: "קטנתי",
      artist: "יונתן רזאל",
      note: "שיר תודה",
      source: "https://www.youtube.com/watch?v=HZYivKwVmJc",
    },
    {
      title: "נפשי",
      artist: "ישי ריבו ומוטי שטיינמץ",
      source: "https://www.youtube.com/watch?v=-6hnYAEUV2M",
    },
    {
      title: "ותיקח מרים",
      artist: "חנן בן ארי ולהקת קולות",
      note: "רגע ריקוד של הבנות",
      source: "https://he.wikipedia.org/wiki/חנן_בן_ארי",
    },
    {
      title: "לך אלי תשוקתי",
      artist: "מאיר בנאי",
      note: "פיוט, לכניסה שקטה",
      source: "https://www.youtube.com/watch?v=yb6xrWnEsxc",
    },
  ],
};

/** בת מצווה חרדית: קול גברי. מחקר 4.10.2026, אושר על ידי הבעלים באותו יום. */
export const BAT_MITZVAH_HAREDI_SONGS: BatMitzvahSongList = {
  id: "haredi",
  songs: [
    {
      title: "בת מלך",
      artist: "חיים ישראל ושלומי שבת",
      source: "https://www.youtube.com/watch?v=5EDeYowMZwE",
    },
    {
      title: "עלה קטן שלי",
      artist: "אברהם פריד",
      note: "אבא לילד שיוצא לדרך",
      source: "https://www.youtube.com/watch?v=ezSvfzIS7-w",
    },
  ],
};

/** שירים שהבעלים אומר שכבר נמאס לשמוע (4.10.2026). עדיין נחמדים, בגרסה חדשה. */
export const BAT_MITZVAH_OVERPLAYED_SONGS: BatMitzvahSongList = {
  id: "overplayed",
  songs: [
    {
      title: "מהפכה של שמחה",
      artist: "ליאור נרקיס ועומר אדם",
      source: "https://www.youtube.com/watch?v=tbNURvMcAiE",
    },
    {
      title: "מי שמאמין",
      artist: "אייל גולן",
      source: "https://www.youtube.com/watch?v=-CZqRKYznrM",
    },
    {
      title: "יעשו לנו כבוד",
      artist: "עומר אדם",
      source: "https://www.youtube.com/watch?v=8krJL1tuRVI",
    },
  ],
};

/** הרשימה של מה שנמאס נשארת אחרונה: הטסט בודק שאף שיר ממנה לא מומלץ ברשימות האחרות. */
export const BAT_MITZVAH_SONG_LISTS = [
  BAT_MITZVAH_ENTRANCE_SONGS,
  BAT_MITZVAH_2026_SONGS,
  BAT_MITZVAH_RELIGIOUS_SONGS,
  BAT_MITZVAH_HAREDI_SONGS,
  BAT_MITZVAH_OVERPLAYED_SONGS,
] as const;

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** רשימת <ul> לפוסט. רשימה ריקה מחזירה מחרוזת ריקה, כדי שלא תוצג כותרת בלי שירים. */
export function batMitzvahSongListHtml(list: BatMitzvahSongList): string {
  if (list.songs.length === 0) return "";
  const items = list.songs
    .map((song) => {
      const note = song.note ? `. ${escapeHtml(song.note)}` : "";
      return `<li><strong>${escapeHtml(song.title)}</strong>, ${escapeHtml(song.artist)}${note}</li>`;
    })
    .join("\n");
  return `<ul>\n${items}\n</ul>`;
}
