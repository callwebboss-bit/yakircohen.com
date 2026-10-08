import type { PortfolioVideo } from "@/lib/data/video-catalog";

/** Curated entries not yet in channel RSS import - merged into portfolio catalog */
export const PORTFOLIO_VIDEO_SUPPLEMENT: readonly PortfolioVideo[] = [
  {
    videoId: "LKg3pwdon_M",
    title: "הקלטת שיר מתנה לחברה עם הקדשה אישית באולפן",
    youtubeUrl: "https://www.youtube.com/watch?v=LKg3pwdon_M",
    tags: ["studio-recording"],
    services: [
      "recording-song-modiin",
      "studio-gifts",
      "blessings-video-clip",
    ],
    description:
      "קליפ מתננה - שיר בהפתעה לאישה, לחברה או לבן/בת הזוג. הקלטה ועריכה באולפן במודיעין.",
  },
  {
    videoId: "QRMxKVUOOl0",
    title: "הקלטה אמיתית באולפן - דוגמת קליפ מהסשן",
    youtubeUrl: "https://www.youtube.com/watch?v=QRMxKVUOOl0",
    tags: ["studio-recording"],
    services: ["recording-song-modiin", "recording-studio", "studio-gifts"],
    description: "צילום סשן הקלטה באולפן במודיעין. דוגמה לקליפ מההקלטה.",
  },
  {
    videoId: "1DUnuS_hv5Y",
    title: "מג'יק קאס (Magic Kass) - הקליפ הרשמי",
    youtubeUrl: "https://www.youtube.com/watch?v=1DUnuS_hv5Y",
    tags: ["studio-recording"],
    services: ["studio-hub", "recording-song-modiin"],
    description:
      "הפקה ועיבוד מוזיקלי: יקיר כהן הפקות ורועי מאנה · מילים: רועי מאנה, יקיר כהן ויקיר איזמירלי · שירה: עמית רבוח · כוריאוגרפיה: לירון אבדר · רקדניות: להקת בלרין · סטודיו לי דאנס בניהול לירון אבדר · מעל מיליון צפיות",
  },
  {
    videoId: "591H4EX6miM",
    title: "קורס גמגום - לדבר נכון ולקבל את עצמך בביטחון אמיתי",
    youtubeUrl: "https://www.youtube.com/shorts/591H4EX6miM",
    tags: ["education"],
    services: [],
    description:
      "סרטון קצר מתוך קורס הגמגום: איך לדבר נכון ולבנות ביטחון אמיתי בדיבור. שיטת NeverMind, באולפן במודיעין.",
  },
  {
    videoId: "yjxF9pKzbr0",
    title: "שני תותחי קונפטי על במה - סיום שנה בבית ספר",
    youtubeUrl: "https://www.youtube.com/shorts/yjxF9pKzbr0",
    tags: ["dj-events"],
    services: ["events-dj", "events-hub", "events-attractions"],
    description: "הפעלת שני תותחי קונפטי על במה באירוע סיום שנת הלימודים.",
  },
  {
    videoId: "8lfWwn0uJMg",
    title: "עריכת קליפ ילדים ממסך ירוק: לפני ואחרי",
    youtubeUrl: "https://www.youtube.com/watch?v=8lfWwn0uJMg",
    tags: ["video-editing"],
    services: ["video-editing"],
    description: "כמה עולה לערוך קליפ ילדים ממסך ירוק, והתוצאה לפני ואחרי.",
  },
  {
    videoId: "-nU3anctSJY",
    title: "קריינות ליקב פאסק: חוויית השתייה",
    youtubeUrl: "https://www.youtube.com/watch?v=-nU3anctSJY",
    tags: ["voiceover"],
    services: ["voiceover-hub", "voiceover-services"],
    description: "סרטון קבלת פנים ליקב פאסק (Pasek Cellars). קריינות: יקיר כהן.",
  },
  {
    videoId: "5JPLiE7IbpU",
    title: "קריינות ליקב פאסק: התאמת יין לאוכל, עם בשר",
    youtubeUrl: "https://www.youtube.com/watch?v=5JPLiE7IbpU",
    tags: ["voiceover"],
    services: ["voiceover-hub", "voiceover-services"],
    description: "הסברים והמלצות להתאמת יין לאוכל, ליקב פאסק. קריינות: יקיר כהן.",
  },
  {
    videoId: "vLxPpfoDWqc",
    title: "קריינות ליקב פאסק: ניחוח של אוכמניות",
    youtubeUrl: "https://www.youtube.com/watch?v=vLxPpfoDWqc",
    tags: ["voiceover"],
    services: ["voiceover-hub", "voiceover-services"],
    description: "סרטון מוצר ליקב פאסק. קריינות: יקיר כהן.",
  },
  {
    videoId: "0--BIes-66Y",
    title: "עריכת סושיאל ליקב: מרלו קברנה שירז",
    youtubeUrl: "https://www.youtube.com/watch?v=0--BIes-66Y",
    tags: ["video-editing"],
    services: ["video-editing"],
    description: "עריכה לרשתות החברתיות, ליקב.",
  },
  {
    videoId: "APKGwP3CO50",
    title: "עריכת סושיאל ליקב: קברנה מרלו ושירז",
    youtubeUrl: "https://www.youtube.com/watch?v=APKGwP3CO50",
    tags: ["video-editing"],
    services: ["video-editing"],
    description: "עריכה לרשתות החברתיות, ליקב.",
  },
  {
    videoId: "--_pBWzA5Hk",
    title: "שורט ליקב: זו רק ההתחלה",
    youtubeUrl: "https://www.youtube.com/shorts/--_pBWzA5Hk",
    tags: ["video-editing"],
    services: ["video-editing"],
    description: "שורט טיזר ליקב, לרשתות החברתיות.",
  },
] as const;
