/**
 * רעיונות מאשאפ - קטלוג השראה (לא הורדה).
 *
 * BPM / סולם / הרמוניה: `lib/data/dj-mashup-music-meta.ts`
 * בדיקת תאימות: `lib/mashup-music-theory.ts`
 */

import type {
  MashupMusic,
  MashupYoutubeDemo,
} from "@/lib/mashup-music-theory";
import { enrichMashupIdea } from "@/lib/data/dj-mashup-music-meta";

export type { MashupMusic, MashupYoutubeDemo };

export type MashupMoment =
  | "פתיחה"
  | "רחבה"
  | "מעבר"
  | "סלואו"
  | "בר_מצווה"
  | "חופה";

export type MashupEnergy = "גבוה" | "בינוני" | "רך";

export type MashupProCta = "ready" | "custom" | "consult";

/** רחבה = להיטים שעובדים באירוע. יצירתי = לדיג'ייז ומפיקים שמחפשים שילוב עם אוזן. */
export type MashupTier = "רחבה" | "יצירתי";

export type DjMashupIdea = {
  id: string;
  songA: string;
  songB: string;
  moment: MashupMoment;
  /** משפט קצר למה זה מעניין מוזיקלית */
  hook?: string;
  tier?: MashupTier;
  /** למה הקהל מגיב - 2–3 משפטים עם הקשר אירוע */
  whyItWorks: string;
  /** איפה לחבר: פתיחה, פזמון, דרופ, אאוטרו */
  mergeTip: string;
  /** למי זה הכי חזק באולם */
  crowdProfile: string;
  bpmHint?: string;
  keyHint?: string;
  /** הערת עריכה קצרה - סולם, קצב, stems */
  technicalNote?: string;
  energy: MashupEnergy;
  researchSource: string;
  proCta?: MashupProCta;
  /** מוזיקה מובנית - ממוזג מ-dj-mashup-music-meta */
  music?: MashupMusic;
  youtubeDemo?: MashupYoutubeDemo;
  technique?: "stems" | "acapella" | "percussion" | "time_sig" | "harmonic" | "drop_build";
  upgradePlus?: string;
};

export const MASHUP_MOMENT_LABELS: Record<MashupMoment, string> = {
  פתיחה: "פתיחה",
  רחבה: "רחבה",
  מעבר: "מעבר",
  סלואו: "סלואו",
  בר_מצווה: "בר/בת מצווה",
  חופה: "חופה",
};

export const MASHUP_MOMENT_ORDER: readonly MashupMoment[] = [
  "פתיחה",
  "חופה",
  "מעבר",
  "רחבה",
  "סלואו",
  "בר_מצווה",
] as const;

export const MASHUP_TIER_LABELS: Record<MashupTier, string> = {
  רחבה: "עובד ברחבה",
  יצירתי: "שילוב יצירתי",
};

export const MASHUP_TIER_ORDER: readonly MashupTier[] = ["יצירתי", "רחבה"] as const;

export const DJ_MASHUP_IDEAS: readonly DjMashupIdea[] = [
  {
    id: "omer_taapas_levitating",
    songA: "עומר אדם - טאפס וטריפונס",
    songB: "Dua Lipa - Levitating",
    moment: "רחבה",
    hook: "להיט 2026 על ביט מועדון - המילים קורמות לפני הדרופ.",
    whyItWorks:
      "טאפס וטריפונס הוא מהשירים הכי מבוקשים ברחבות 2025–26 - המילים יוצאות מהאורחים לפני שהביט נכנס. Levitating יושב על אותו BPM מועדוני, אז המעבר מרגיש כמו המשך טבעי ולא כמו קפיצה לסגנון אחר.",
    mergeTip: "פזמון עומר → דרופ Levitating אחרי השורה השנייה. לא להחליף את כל השיר - רק את השיא.",
    crowdProfile: "חתונות עם קהל צעיר + מזרחית. עובד מצוין אחרי כניסה לחופה.",
    bpmHint: "128",
    keyHint: "8B / 9A",
    technicalNote: "שני השירים ב-128 - מספיק pitch קטן אם צריך. ווקאל עומר על ביט Levitating.",
    energy: "גבוה",
    researchSource: "Slide Music טופ 60 חתונה 2026 + Serato wedding sets",
    proCta: "custom",
  },
  {
    id: "eyal_pantera_omer_kavod",
    songA: "אייל גולן - פנתרה",
    songB: "עומר אדם - יעשו לנו כבוד",
    moment: "רחבה",
    hook: "שני ענקי המזרחית - רגע «כולם יחד» שדיג'ייז מחפשים.",
    whyItWorks:
      "שני ענקי המזרחית באותו ערב - פנתרה מרים מייד, ויעשו לנו כבוד נותן את רגע ה\"כולם יחד\" שדיג'ייז מחפשים. זה בדיוק סוג המחרוזת ש-Walla ורשימות 2026 מגדירות כ\"מיינסטרים ישראלי\".",
    mergeTip: "אאוטרו פנתרה (8 השירים האחרונים) → כניסת פזמון יעשו לנו כבוד. שמור על קיק דחוף בין השירים.",
    crowdProfile: "רחבה מזרחית מלאה. הורים וילדים - שניהם מכירים את שני השירים.",
    bpmHint: "128–132",
    keyHint: "9A / 10A",
    technicalNote: "מעבר BPM של 2–4 נקודות - עדיף על pitch גדול. Hypeddit: Idan Sade עשה וריאציה דומה על יעשו לנו כבוד.",
    energy: "גבוה",
    researchSource: "Hypeddit DJ Idan Sade + Slide Music #4/#6",
    proCta: "ready",
  },
  {
    id: "eyal_doctor_lior_pantera",
    songA: "אייל גולן - דוקטור",
    songB: "ליאור נרקיס - פנתרה",
    moment: "רחבה",
    hook: "מוכח ב-Hypeddit: build לדרופ שכולם מכירים.",
    whyItWorks:
      "מאשאפ שכבר הוכח ב-Hypeddit (DJ Homba) - אותה תיבה אנרגטית, אותו קהל מזרחית. דוקטור נותן build-up, פנתרה סוגרת בדרופ שכולם מכירים.",
    mergeTip: "בridge דוקטור → פתיחת פנתרה. אל תדלג על ה-build - הקהל צריך את העלייה.",
    crowdProfile: "חתונות מזרחית קלאסית. עובד גם בבר מצווה עם קהל מבוגר יותר.",
    bpmHint: "128–130",
    technicalNote: "סולמות קרובים במפת Camelot - עריכה ידנית על הטומים עדיף על sync אוטומטי.",
    energy: "גבוה",
    researchSource: "Hypeddit - Homba Mashup (דוקטור × פנתרה)",
    proCta: "ready",
  },
  {
    id: "osher_chamishi_omer_tsamud",
    songA: "אושר כהן - חמישי שישי",
    songB: "עומר אדם, שרק, אודיה - צמוד צמוד",
    moment: "רחבה",
    hook: "טופ 10 חתונה 2026 - רחבה בלי לנשום.",
    whyItWorks:
      "חמישי שישי וצמוד צמוד שניהם בטופ 10 רשימות החתונה ל-2026. שניהם גרוב מזרחי מודרני - כשמחברים נכון, הרחבה לא נושמת ביניהם.",
    mergeTip: "סיום פזמון חמישי שישי → מילים \"צמוד צמוד\" בכניסה מלאה. שמור על אנרגיה גבוהה, בלי break ארוך.",
    crowdProfile: "קהל שמעדיף מזרחית עדכנית על פני נוסטלגיה. חזק אחרי האוכל.",
    bpmHint: "126–128",
    energy: "גבוה",
    researchSource: "Slide Music טופ 60 - #5 ו-#6",
    proCta: "custom",
  },
  {
    id: "omer_ahuvati_cant_hold",
    songA: "עומר אדם - אהובתי כבר לא רואה אותי",
    songB: "Macklemore - Can't Hold Us",
    moment: "רחבה",
    hook: "עומר רגשי → דרופ שמאחד גם מי שלא שומע מזרחית.",
    whyItWorks:
      "שיר עומר רגשי שמתפוצץ בפזמון - ואז Can't Hold Us נותן את הדרופ הבינלאומי שמאחד גם מי שלא שומע מזרחית כל הערב. קומבינציה שחוזרת בסטים של דיג'ייז ישראלים ב-Serato.",
    mergeTip: "אחרי הבית השני של עומר - כניסת Can't Hold Us מהדק הראשון. לא לערבב באמצע משפט.",
    crowdProfile: "חתונה מעורבת: מזרחית + מיינסטרים. נקודת שיא לפני סלואו.",
    bpmHint: "128",
    keyHint: "8A → 8B",
    technicalNote: "pitch עומר +1 או -1 סמitone לפי גרסה. בדוק ב-Tunebat לפני מיקס.",
    energy: "גבוה",
    researchSource: "Serato Nadav Agami + DJ Shlomi wedding lists",
    proCta: "custom",
  },
  {
    id: "eden_hurricane_german_avny",
    songA: "Eden Golan - Hurricane",
    songB: "German Avny - גרסת האוס (סגנון חתונה)",
    moment: "פתיחה",
    hook: "אירוויזיון × האוס - פתיחה שמרגישה עכשווית.",
    whyItWorks:
      "אנרגיית אירוויזיון + האוס חתונות 2025 - פתיחה שמרגישה עכשווית ולא \"עוד שיר מהרדיו\". עובד לפני שהזוג נכנס, כשהאולם מתמלא.",
    mergeTip: "פזמון Hurricane → דרופ האוס בלי לעצור. שמור על 8 תיבות מעבר מקסימום.",
    crowdProfile: "זוגות צעירים, קהל שמכיר פופ בינלאומי. פחות מתאים לחתונה חרדית.",
    bpmHint: "124–128",
    technicalNote: "German Avny חתימה בחתונות ישראליות - BPM מועדון עם מילים בעברית/אנגלית.",
    energy: "גבוה",
    researchSource: "DJ Shlomi - גרסאות האוס 2025",
    proCta: "custom",
  },
  {
    id: "daft_uptown_opener",
    songA: "Social Disco Club - Daft Funk",
    songB: "Bruno Mars - Uptown Funk",
    moment: "פתיחה",
    hook: "פתיחה בינלאומית שמחייכים לה עוד ליד האוכל.",
    whyItWorks:
      "זוג שמופיע בכל סט חתונה בינלאומי ב-Serato - Daft Funk מרים חיוך, Uptown Funk סוגר עם להיט שכולם יודעים. מושלם לקבלת פנים כשעדיין יש אוכל על השולחן.",
    mergeTip: "loop 16 תיבות Daft Funk → כניסת Uptown מהבית הראשון. BPM כמעט זהה - מעבר נקי.",
    crowdProfile: "קהל מעורב גילאים. פתיחה בינלאומית לפני מזרחית.",
    bpmHint: "116–120",
    keyHint: "7B / 8B",
    energy: "בינוני",
    researchSource: "Serato Nadav Agami 02/05/2025",
    proCta: "ready",
  },
  {
    id: "apt_cant_hold_youth",
    songA: "ROSÉ & Bruno Mars - APT.",
    songB: "Macklemore - Can't Hold Us",
    moment: "רחבה",
    hook: "להיט TikTok 2025 ישר לרחבה צעירה.",
    whyItWorks:
      "APT הוא מהפיצוצים של 2025–26 - צעירים קופצים מיד. Can't Hold Us ממשיך באותה נשימה בלי להוריד BPM. שילוב שמיועד לרגע \"רק הצעירים\" או לקראת סוף ערב.",
    mergeTip: "אחרי ה-hook של APT → ישר לדרופ Can't Hold Us. שני שירים ב-128 - אל תעצור.",
    crowdProfile: "בר מצווה, חתונה עם הרבה בני נוער. פחות לסלואו הורים.",
    bpmHint: "130",
    energy: "גבוה",
    researchSource: "Serato 2025 playlists + מגמת TikTok",
    proCta: "custom",
  },
  {
    id: "osher_plaster_nadav_mashup",
    songA: "אושר כהן - פלסטרים",
    songB: "נדב חנצ'ס - מאחל לך טוב (German Avny Mashup)",
    moment: "רחבה",
    hook: "שני להיטי 2025 - רגש שעובר לאנרגיה.",
    whyItWorks:
      "פלסטרים ומאחל לך טוב - שניהם רגש-לאנרגיה שעובד ברחבות ישראליות ב-2025. גרסת German Avny כבר מוכנה לקצב מועדון, אז המעבר מרגיש מקצועי.",
    mergeTip: "פזמון פלסטרים → כניסת מאחל לך טוב מהפזמון. שמור על ווליום עולה, לא יורד.",
    crowdProfile: "מזרחית עדכנית. חזק בשעה שבין 22:00 ל-23:30.",
    bpmHint: "100→128",
    technicalNote: "מעבר BPM מודע - 8–16 תיבות עליה. DJ Shlomi ממליץ על גרסאות Avny לרשימת 2025.",
    energy: "בינוני",
    researchSource: "DJ Shlomi מזרחית 2025 + German Avny mashups",
    proCta: "custom",
  },
  {
    id: "itay_fata_eyal_ir",
    songA: "איתי לוי - פאטה מורגנה",
    songB: "אייל גולן - עיר נמל",
    moment: "רחבה",
    hook: "חדש 2026 על קלאסיקה שתמיד מרימה.",
    whyItWorks:
      "פאטה מורגנה הוא מהלהיטים החמים של 2026 לפי Walla - עיר נמל הוא קלאסיקה שתמיד עובדת. יחד הם נותנים \"חדש + מוכר\" באותו סט מזרחית.",
    mergeTip: "בית אחרון של פאטה מורגנה → פתיחת עיר נמל. שני שירים באנרגיה גבוהה - בלי break.",
    crowdProfile: "חתונות מזרחית. עובד אחרי שיר איטי יותר כגשר.",
    bpmHint: "128",
    energy: "גבוה",
    researchSource: "Walla חתונה 2026 + Slide Music",
    proCta: "custom",
  },
  {
    id: "static_kubiot_beyonce",
    songA: "סטטיק ובן אל - קוביות (DJ Braindead Extended)",
    songB: "Beyoncé - Run the World (Girls)",
    moment: "מעבר",
    hook: "פופ ישראלי מעריך → אנרגיה נשית גלובלית.",
    whyItWorks:
      "קוביות הוא גשר ישראלי-פופ שכבר נערך לרחבה (Braindead). Run the World נותן את הדרופ הנשי הבינלאומי - עובד בחתונות עם חברות כלה גדולות.",
    mergeTip: "אאוטרו קוביות extended → Run the World מהפזמון. מופיע בסט Nadav Agami ליד שירי סטטיק.",
    crowdProfile: "חתונה עם קהל נשי חזק. מעבר לפני שיא ערב.",
    bpmHint: "126–128",
    energy: "בינוני",
    researchSource: "Serato - Braindead × Nadav Agami",
    proCta: "custom",
  },
  {
    id: "trapatoni_bailar",
    songA: "שלומי שבת × טיפקס - טרפטוני פרח (Braindead)",
    songB: "Deorro - Bailar",
    moment: "מעבר",
    hook: "נוסטלגיה ישראלית → ביט לטיני לפני השיא.",
    whyItWorks:
      "טרפטוני פרח מרים נוסטלגיה ישראלית, Bailar נותן ביט לטיני שמכניס את הרחבה למצב \"מסיבה\". מעבר BPM קלאסי לפני סט הלהיטים.",
    mergeTip: "8 תיבות אחרי הפזמון של טרפטוני → כניסת Bailar. העלה BPM בהדרגה, לא בבת אחת.",
    crowdProfile: "קהל מעורב גילאים. חזק לפני כניסת זוג לריקודים.",
    bpmHint: "100→128",
    technicalNote: "מעבר מודע - אחד המאשאפים הכי מבוקשים בעריכה מקצועית (לא quick mashup).",
    energy: "בינוני",
    researchSource: "Serato Braindead mashups",
    proCta: "custom",
  },
  {
    id: "simcha_darko_nostalgia",
    songA: "השמחות - איזה יום היה לי",
    songB: "דארקו רמיקס (גרסת רחבה)",
    moment: "רחבה",
    hook: "דודאים וצעירים על אותו רגע נוסטלגי.",
    whyItWorks:
      "נוסטלגיה ישראלית שמזקיקה לדודאים + רמיקס מודרני שמכניס את הצעירים. בסט Nadav Agami זה בא ממש אחרי שירי עומר - רגע \"כולם יחד\".",
    mergeTip: "פזמון השמחות → דארקו מהביט הראשון. שמור על מילים ברורות בחלק הראשון.",
    crowdProfile: "חתונה עם קהל ישראלי מגוון. עובד מעולה אחרי שיר בינלאומי.",
    bpmHint: "128",
    energy: "גבוה",
    researchSource: "Serato Nadav Agami",
    proCta: "ready",
  },
  {
    id: "marina_guy_beyachad_opening",
    songA: "מרינה מקסימיליאן & גיא מנטש - ביחד (רמיקס)",
    songB: "עומר אדם - רק שלך",
    moment: "מעבר",
    hook: "רגע זוגי רגשי לפני שהרחבה מתפוצצת.",
    whyItWorks:
      "ביחד ברמיקס הוא שיר חופה/כניסה פופולרי - רק שלך ממשיך לרגע זוגי לפני שהרחבה מתפוצצת. מעבר רגשי שמכין את האולם.",
    mergeTip: "סיום ביחד (רמיקס) → רק שלך מהבית. שמור על ווליום יציב, לא דרמטי מדי.",
    crowdProfile: "חתונה זוגית. מתאים אחרי חופה, לפני רחבה מלאה.",
    bpmHint: "95→128",
    energy: "בינוני",
    researchSource: "Slide Music חופה + DJ Shlomi",
    proCta: "custom",
  },
  {
    id: "rihanna_levitating_club",
    songA: "Rihanna & Calvin Harris - We Found Love",
    songB: "Dua Lipa - Levitating",
    moment: "רחבה",
    hook: "שני סטייפלס 128 - הקהל כבר יודע לרקוד.",
    whyItWorks:
      "שני סטייפלס מועדון ב-128 BPM - We Found Love פותח, Levitating ממשיך. בכל חתונה בינלאומית יש רגע כזה; הקהל לא צריך ללמוד את השיר.",
    mergeTip: "דרופ We Found Love → Levitating מהפזמון. אותו BPM - crossfade של 4 תיבות מספיק.",
    crowdProfile: "רחבה בינלאומית. עובד בין שירי מזרחית לסגירת ערב.",
    bpmHint: "128",
    keyHint: "8B",
    energy: "גבוה",
    researchSource: "International wedding staples + Serato",
    proCta: "ready",
  },
  {
    id: "slow_hora_mainstream",
    songA: "סלואו הזוג (לפי בקשה)",
    songB: "הורה / עומר אדם - יעשו לנו כבוד",
    moment: "סלואו",
    hook: "מסלואו להורה בלי שקט מביך באמצע.",
    whyItWorks:
      "אחרי רגע אינטימי, הרחבה צריכה להתפוצץ בלי עצירה מביכה. מעבר מסלואו להורה או ליעשו לנו כבוד הוא flow קלאסי שדיג'ייז מנוסים בונים מראש.",
    mergeTip: "30 שניות אחרי סוף הסלואו → הורה או יעשו לנו כבוד. תאם עם צלם ומנהל אירוע.",
    crowdProfile: "כל חתונה. רגע שדורש תכנון - לא improv.",
    bpmHint: "70→128",
    technicalNote: "העלאת BPM הדרגתית או cut חד - תלוי בסגנון הזוג.",
    energy: "רך",
    researchSource: "Wedding flow - DJ best practice",
    proCta: "custom",
  },
  {
    id: "simche_chupa_remix",
    songA: "שמחה פרידמן - בקרוב (יתגדל ויתקדש)",
    songB: "גרסת רמיקס אירועים (סגנון יקיר כהן)",
    moment: "חופה",
    hook: "חופה מסורתית עם עיבוד שלא שובר את הטקס.",
    whyItWorks:
      "קלאסיקה לחופה דתית/מסורתית - עם עיבוד מודרני שלא מפריע לטקס. כבר קיים בתיק העבודות של יקיר (Simche Friedman Remix).",
    mergeTip: "שמור על קטע חופה שלם - עיבוד עדין, לא דרופ מועדון. מעבר רק אחרי הטקס.",
    crowdProfile: "חופה מסורתית. משפחות שמכירות את המקור.",
    bpmHint: "90–100",
    energy: "רך",
    researchSource: "יקיר כהן portfolio - FtzsXXnts_k",
    proCta: "custom",
  },
  {
    id: "shked_kikar_first_dance",
    songA: "שקד קוממי - כיכר המדינה",
    songB: "פתיחת ריקודים / מיינסטרים 128",
    moment: "מעבר",
    hook: "רמיקס מהאולפן - גשר מריקוד ראשון לרחבה.",
    whyItWorks:
      "רמיקס שכבר נבנה באולפן יקיר - מוכר, נבדק, עם סיפור. מתאים לגשר מריקוד ראשון או כניסה לרחבה פתוחה.",
    mergeTip: "כיכר המדינה → מיינסטרים אחרי הסולו הווקאלי. שמור על 16 תיבות מעבר.",
    crowdProfile: "חתונה עם ריקוד ראשון ישראלי. קהל שאוהב פופ מקומי.",
    bpmHint: "118→128",
    energy: "בינוני",
    researchSource: "יקיר כהן portfolio - SvhfZK9Ribg",
    proCta: "custom",
  },
  {
    id: "ze_tov_apt_bar_mitzvah",
    songA: "שלמה ארצי - זה טוב",
    songB: "ROSÉ & Bruno Mars - APT.",
    moment: "בר_מצווה",
    hook: "סבים וילדים - נוסטלגיה פוגשת 2025.",
    whyItWorks:
      "זה טוב מדבר להורים ולסבים - APT מדבר לילדים. בבר מצווה זה בדיוק המתח שצריך: כבוד למבוגרים + אנרגיה לרחבה.",
    mergeTip: "פזמון זה טוב → APT מה-hook. קצר - 2–3 דקות מקסימום לפני סט מלא.",
    crowdProfile: "בר/בת מצווה עם דודים וילדים. גשר נוסטלגיה-עכשיו.",
    bpmHint: "118→130",
    energy: "בינוני",
    researchSource: "Bar mitzvah DJ sets 2025",
    proCta: "consult",
  },
  {
    id: "omer_ometz_bachata",
    songA: "עומר אדם - אוהבת אותי אמיתי",
    songB: "Bachata groove / רמיקס Dj Zorro style",
    moment: "רחבה",
    hook: "באצ'טה באמצע ערב מזרחית - מפתיע ומרענן.",
    whyItWorks:
      "ב-Hypeddit יש בקשות להורדה לבאצ'טה מאשאפ של אוהבת אותי אמיתי - סימן שהקהל רוצה גרוב שונה באמצע ערב מזרחית. מפתיע ומרענן.",
    mergeTip: "בית ראשון עומר → כניסת באצ'טה מהפזמון. לא לכל קהל - בדוק עם הזוג.",
    crowdProfile: "קהל צעיר, חתונות חופשיות. פחות לקהל שמרני.",
    bpmHint: "120–128",
    energy: "בינוני",
    researchSource: "Hypeddit - Dj Zorro Bachata Mashup",
    proCta: "custom",
  },
  {
    id: "static_baiana_latin",
    songA: "סטטיק - קוביות (Extended)",
    songB: "Baiana - Barbatuques",
    moment: "רחבה",
    hook: "ישראלי-לטיני שמחזיר גוף לרחבה באמצע ערב.",
    whyItWorks:
      "שילוב ישראלי-לטיני שחוזר בסטי Braindead - מרים רחבה כשיש שעמום באמצע ערב. הביט הלטיני מחזיר גוף לרחבה.",
    mergeTip: "אחרי drop קוביות → Baiana loop 32 תיבות. אפשר לחזור לעומר אחרי.",
    crowdProfile: "רחבה מעורבת. חזק בקיץ ובאולמות פתוחים.",
    bpmHint: "128",
    energy: "גבוה",
    researchSource: "Serato Braindead × Baiana",
    proCta: "custom",
  },
  {
    id: "ron_million_osher_2025",
    songA: "רון חיון - אחת למליון",
    songB: "אושר כהן - מאחל לך טוב",
    moment: "רחבה",
    hook: "שני להיטי 2025 - שיא ערב מזרחית מודרנית.",
    whyItWorks:
      "שני להיטי 2025–26 שמופיעים יחד ברשימות חתונה - אחת למליון נותן build, מאחל לך טוב סוגר ברגש שעובר לאנרגיה. טבעי באותו סט.",
    mergeTip: "פזמון רון → כניסת מאחל לך טוב. BPM דומה בגרסאות מועדון.",
    crowdProfile: "מזרחית מודרנית. שיא ערב.",
    bpmHint: "128",
    energy: "גבוה",
    researchSource: "Slide Music 2026 + DJ Shlomi",
    proCta: "ready",
  },
  {
    id: "omer_chaverot_sharon",
    songA: "עומר אדם - חברות שלך (DJ Sharon Yosefov Remix)",
    songB: "Icona Pop - I Love It",
    moment: "רחבה",
    hook: "רמיקס מוכן לרחבה → מיינסטרים בלי לעצור.",
    whyItWorks:
      "רמיקס שרון יוספוב כבר מוכן לרחבה - I Love It ממשיך באנרגיה בינלאומית. מופיע בסט Nadav Agami ליד שירי עומר.",
    mergeTip: "אאוטרו רמיקס שרון → I Love It מהפזמון. 128 BPM קבוע.",
    crowdProfile: "חתונה עם קהל נשי צעיר. אחרי כניסה או אחרי חופה.",
    bpmHint: "128",
    energy: "גבוה",
    researchSource: "Serato Nadav Agami",
    proCta: "ready",
  },

  // ─── שילובים יצירתיים - לדיג'ייז, מפיקים ומי שמחפש מוזיקאי עם אוזן ───
  {
    id: "zohar_ukg",
    songA: "זוהר ארגוב - הלילה הוא שיריים (acapella)",
    songB: "UK Garage / 2-step (130 BPM)",
    moment: "רחבה",
    tier: "יצירתי",
    hook: "קאנון מזרחי על גרוב שסינקופה - לא עוד house רובוטי.",
    whyItWorks:
      "הווקאל של זוהר נשאר במרכז, הביט זז בצד. מי שרק רוקד מרגיש משהו חדש; מי שמקשיב מבין שזה לא \"עוד רמיקס\".",
    mergeTip: "8 תיבות acapella נקי → כניסת 2-step עם kick+shaker. אל תשים את הקיק מתחת לכל המילים.",
    crowdProfile: "דיג'ייז שרוצים להבדיל. עובד גם בברים ובאירועים עם קהל מוזיקלי.",
    bpmHint: "130",
    keyHint: "8A–9A",
    technicalNote: "דורש stems נקיים או Fadr. המעבר הוא המוצר - לא quick sync.",
    energy: "בינוני",
    researchSource: "Crate-digger weddings + UKG revival 2024–26",
    proCta: "custom",
  },
  {
    id: "peer_ouf_breakbeat",
    songA: "פאר טסי - עוף מוזר (vocal + bass stem)",
    songB: "Breakbeat / UK club (126–128)",
    moment: "מעבר",
    tier: "יצירתי",
    hook: "היט ישראלי הופך לטראק מועדונים כשמפרידים ערוצים נכון.",
    whyItWorks:
      "עוף מוזר חי על ביט שבור - הפתעה אחרי שעה של 128 קבוע. מפיקים מזהים עריכה עם זמן השקעה.",
    mergeTip: "בס+קול מעוף מוזר על loop breakbeat - הוסף fill לפני כניסת פזמון מלא.",
    crowdProfile: "קהל צעיר, אירועים חילוניים, מועדונים פרטיים.",
    bpmHint: "126–128",
    technicalNote: "Stems מ-Fadr/UVR. שמור headroom - breakbeat דוחף את המיד.",
    energy: "גבוה",
    researchSource: "Hypeddit trends + producer mashup culture",
    proCta: "custom",
  },
  {
    id: "ethnix_baiana_live",
    songA: "אתניקס - סימן ו (break instrumental)",
    songB: "Baiana / Latin-tech percussion loop",
    moment: "רחבה",
    tier: "יצירתי",
    hook: "קלאסיקה ישראלית עם שכבת פרקושן חיה - נשמע כמו להקה, לא כמו לפטופ.",
    whyItWorks:
      "הברי סימן ו כבר מזמין תנועה; Baiana נותן גוף לטן. שילוב שמצלמים ושדיג'ייז מספרים עליו אחרי האירוע.",
    mergeTip: "תן לסימן ו 16 תיבות → הכנס פרקושן → החזר ווקאל אתניקס מעל. אפשר darbuka חיה מעל.",
    crowdProfile: "חתונות עם רמות אנרגיה גבוהות. מוזיקאים באולם ישימו לב.",
    bpmHint: "128",
    technicalNote: "אופציה: darbuka loop מוקלט באולפן - signature יקיר.",
    energy: "גבוה",
    researchSource: "Serato Braindead × Latin + live percussion trend",
    proCta: "custom",
  },
  {
    id: "viva_tehom_harmonic",
    songA: "Coldplay - Viva La Vida (harmonic bed)",
    songB: "עומר אדם - תהום (vocal)",
    moment: "מעבר",
    tier: "יצירתי",
    hook: "שינוי הרמוניה - שני עולמות באותו סולם, לא רק אותו BPM.",
    whyItWorks:
      "תהום רגשי על מצע אפי - הקהל לא תמיד יודע למה זה נוגע, אבל מרגיש. זה סוג העריכה שמחפשים כשלא רוצים גנרי.",
    mergeTip: "הסר drums מ-Viva, השאר strings+pads → שכבת ווקאל תהום. בנה tension לפני דרופ חזרה לרחבה.",
    crowdProfile: "זוגות שאוהבים רגע דרמטי לפני שיא. פחות לקהל שרוצה רק להיטים.",
    bpmHint: "75→128",
    keyHint: "סולם משותף - בדוק ב-Tunebat",
    technicalNote: "עריכה הרמונית ידנית - לא mashup אוטומטי.",
    energy: "בינוני",
    researchSource: "Harmonic mashup theory + emotional wedding arcs",
    proCta: "custom",
  },
  {
    id: "birds_kirel_chop",
    songA: "Billie Eilish - Birds of a Feather",
    songB: "נועה קירל - מיליון דולר (vocal chop)",
    moment: "רחבה",
    tier: "יצירתי",
    hook: "דור Z גלובלי × פופ ישראלי - chop, לא crossfade lazy.",
    whyItWorks:
      "שני קולות נשיים בדור שונה - כשחותכים נכון, זה נשמע כמו טראק אחד שיצא מהאולפן אתמול.",
    mergeTip: "chop מיליון דולר כ-stabs על גרוב Birds. שמור על מילה אחת ברורה כל 8 תיבות.",
    crowdProfile: "בר/בת מצווה, חתונות Gen-Z. אינסטגרם-ready.",
    bpmHint: "105–110",
    technicalNote: "ווקאל chops בקוואנטייז 1/8 - DAW, לא DJ software בלבד.",
    energy: "בינוני",
    researchSource: "TikTok mashup culture + Israeli pop crossover",
    proCta: "custom",
  },
  {
    id: "shir_alayim_drill",
    songA: "שירי עלום - ימים של ירוק (vocal phrase)",
    songB: "Drill / UK rap instrumental (140)",
    moment: "רחבה",
    tier: "יצירתי",
    hook: "קאנון ישראלי על ביט כבד - מפתיע את מי שחושב ש\"כבר שמע הכל\".",
    whyItWorks:
      "הניגוד בין נוסטלגיה לביט עכשווי יוצר רגע שאנשים מסתכלים על הדיג'יי. לא לכל אירוע - בדיוק למי שמחפש אומץ מוזיקלי.",
    mergeTip: "4–8 תיבות ווקאל נקי → כניסת drill מהסנר. אל תערבב - cut חד.",
    crowdProfile: "קהל צעיר עירוני. לא לחתונות שמרניות.",
    bpmHint: "140",
    technicalNote: "pitch vocal או instrumental לסולם משותף. בדוק עם הזוג מראש.",
    energy: "גבוה",
    researchSource: "Drill×nostalgia mashup trend (global)",
    proCta: "consult",
  },
  {
    id: "ninnet_deep_house",
    songA: "נינט טייבה - סערה (acapella)",
    songB: "Deep house groove (124–126)",
    moment: "מעבר",
    tier: "יצירתי",
    hook: "אייקון פופ נשי ישראלי על גרוב מינימלי - נשמע יוקרתי, לא זול.",
    whyItWorks:
      "סערה על ביט עמוק נותן לרחבה נשימה בלי לרדת באנרגיה. דיג'ייז שמכירים את נינט מעריכים עריכה שלא הורסת את השיר.",
    mergeTip: "acapella מלא 16 תיבות → הוסף kick+hat מינימליים. בנה לפני כניסת להיט עומתי.",
    crowdProfile: "חתונות אלגנטיות, קהל שמכיר פופ ישראלי לעומק.",
    bpmHint: "124–126",
    keyHint: "Am / 8A",
    energy: "בינוני",
    researchSource: "Vocal×deep house producer tradition",
    proCta: "custom",
  },
  {
    id: "darbuka_techno",
    songA: "לופ דרבוקה / טבילה (מוקלט או חי)",
    songB: "Melodic techno / progressive (128)",
    moment: "רחבה",
    tier: "יצירתי",
    hook: "מוזיקאי + אלקטרוניקה - בדיוק מה שמחפשים כש\"צריך מישהו עם אוזן\".",
    whyItWorks:
      "הפרקושן החי נותן תחושת הפקה שלא מגיעה מפלטפורמה. זה מוצר שמפיקים יכולים למכור - לא רק דיג'יי שמנגן שירים.",
    mergeTip: "דרבוקה 8 תיבות solo → כניסת kick techno. שמור על tuning של הדרבוקה ל-key של הטראק.",
    crowdProfile: "אירועים פרימיום, חתונות עם הפתעה מוזיקלית. מושך מפיקים כלקוחות.",
    bpmHint: "128",
    technicalNote: "הקלטה באולפן או שטח → עריכה+קוואנטייז. שירות PRO טבעי.",
    energy: "גבוה",
    researchSource: "Live×electronic wedding trend + יקיר studio angle",
    proCta: "custom",
  },
  {
    id: "dreams_osher_harmonic",
    songA: "Fleetwood Mac - Dreams (acapella)",
    songB: "אושר כהן - ככה וככה (instrumental bed)",
    moment: "רחבה",
    tier: "יצירתי",
    hook: "הטיקטוק הוכיח את הרעיון - הגרסה המקצועית לרחבה חכמה.",
    whyItWorks:
      "ווקאל מערבית קלאסית על מצע מזרחי מודרני - מוכר מספיק כדי לרקוד, מפתיע מספיק כדי לשתף.",
    mergeTip: "Dreams acapella 8 תיבות → fade in ככה וככה מהבס. שמור על ווליום ווקאל מעל.",
    crowdProfile: "קהל מעורב גילאים. Sweet spot בין נוסטלגיה לעכשיו.",
    bpmHint: "120–126",
    energy: "בינוני",
    researchSource: "Dreams mashup viral + Israeli wedding floor",
    proCta: "custom",
  },
  {
    id: "heat_waves_ir_namal",
    songA: "Glass Animals - Heat Waves",
    songB: "אייל גולן - עיר נמל (vocal overlay)",
    moment: "מעבר",
    tier: "יצירתי",
    hook: "אינדי-פופ מלנכולי × מזרחית - אותו mood, לא אותו שפה.",
    whyItWorks:
      "שני שירים \"עצובים שמרימים\" - כשמצליבים נכון, זה נשמע כמו עיבוד אחד ולא שני שירים ברצף.",
    mergeTip: "פזמון Heat Waves → שכבת ווקאל עיר נמל בפזמון השני. EQ נמוך על ווקאל אחד בכל פעם.",
    crowdProfile: "חתונות עם טעם. דיג'ייז שמשלבים אינדי בסט.",
    bpmHint: "100→128",
    keyHint: "בדוק Camelot - עריכה ידנית",
    energy: "בינוני",
    researchSource: "Indie×mizrahi DJ sets (Tel Aviv club scene)",
    proCta: "custom",
  },
  {
    id: "gospel_afro_hora",
    songA: "מקהלת / גשם חוזר (phrase)",
    songB: "Afro-house groove (122–124)",
    moment: "רחבה",
    tier: "יצירתי",
    hook: "מקהלה ישראלית על ביט אפרו - רגע שמצלמים ושמרגישים בטן.",
    whyItWorks:
      "הקול הקבוצתי על גרוב אפריקאי-אירופי יוצר אנרגיה שונה ממיינסטרים. מתאים לכניסות, הורות, רגעי שיא.",
    mergeTip: "8 תיבות מקהלה a cappella → כניסת kick+perc אפרו. אל תמהר לדרופ.",
    crowdProfile: "חתונות גדולות, קהל שאוהב הפתעה. חזק אחרי חופה.",
    bpmHint: "122–124",
    technicalNote: "Afro-house בנוי נכון - לא generic \"afro beat\" מסטוק.",
    energy: "גבוה",
    researchSource: "Afro-house wedding trend 2025–26",
    proCta: "custom",
  },
  {
    id: "disclosure_gaon",
    songA: "Disclosure - When a Fire Starts to Burn",
    songB: "יהורם גאון - חביב אלבי (vocal hook)",
    moment: "רחבה",
    tier: "יצירתי",
    hook: "UK house meets זהב ישראלי - דיג'ייז מדברים על זה אחרי הסט.",
    whyItWorks:
      "הגרוב של Disclosure מזמין תנועה; חביב אלבי מזמין זיכרון. ביחד - משהו שלא שומעים אצל כל תקליטן.",
    mergeTip: "instrumental Fire מלא → הכנס משפט ווקאל חביב אלבי כל 16 תיבות. לא לדחוף את כל השיר.",
    crowdProfile: "קהל 30–50 שמכיר גאון + קהל צעיר שמכיר Disclosure.",
    bpmHint: "124",
    keyHint: "9B / 10A",
    energy: "בינוני",
    researchSource: "UK house×Israeli golden age (crate-digger sets)",
    proCta: "custom",
  },
  {
    id: "balkan_mizrahi_9_8",
    songA: "Balkan brass / 9-8 groove",
    songB: "שכבת מזרחית (darbuka + strings sample)",
    moment: "רחבה",
    tier: "יצירתי",
    hook: "שינוי משקל - מי שמבין מוזיקה מרגיש מיד שמדובר במפיק.",
    whyItWorks:
      "9/8 מול 4/4 יוצר מתח מוזיקלי אמיתי. כשמחברים עם שכבה מזרחית, זה נשמע כמו ערב ים-תיכוני מודרני.",
    mergeTip: "התחל ב-4/4 מזרחית → הכנס אלמנט 9/8 בהדרגה → חזור ל-4/4 בדרופ.",
    crowdProfile: "אירועים עם קהל מוזיקלי. פסטיבלים, חתונות יוקרה.",
    bpmHint: "120–130",
    technicalNote: "דורש עריכת משקל - לא sync אוטומטי. פרויקט אולפן.",
    energy: "גבוה",
    researchSource: "Balkan×Middle East fusion (global DJ trend)",
    proCta: "custom",
  },
  {
    id: "stromae_itay",
    songA: "Stromae - Alors on danse (acapella)",
    songB: "איתי לוי - נחלת בנימין",
    moment: "מעבר",
    tier: "יצירתי",
    hook: "אירופה × ישראל 2026 - גשר שאף אחד לא ציפה לו.",
    whyItWorks:
      "שני שירים על זהות ושורשים - חיבור thematic, לא רק טכני. מי שמקשיב לטקסט מקבל שכבה נוספת.",
    mergeTip: "Alors acapella 8 תיבות → כניסת נחלת בנימין מהפזמון. שמור על צרפתית ברורה לפני המעבר.",
    crowdProfile: "קהל מעורב, חתונות עם אורחים מחו\"ל. חזק אחרי קבלת פנים.",
    bpmHint: "120–128",
    energy: "בינוני",
    researchSource: "Cross-language mashup culture + Itay Levi 2026 hits",
    proCta: "custom",
  },
  {
    id: "acapella_silence_drop",
    songA: "Acapella מותאם (משפט מזוהה מהסט)",
    songB: "Bass drop / intro מותאם אישית",
    moment: "רחבה",
    tier: "יצירתי",
    hook: "השקט לפני הדרופ - מוצר אולפן, לא טריק DJ.",
    whyItWorks:
      "כשבונים drop מותאם לשם הזוג או למשפט מהסט - זה signature שלא מתחרים מעתיקים ביוטיוב.",
    mergeTip: "3–5 שניות acapella + silence (high-pass sweep) → drop עם סאב מעוצב. תאם עם תאורה.",
    crowdProfile: "זוגות שרוצים רגע \"שלי\". מפיקים שמחפשים branding.",
    bpmHint: "128",
    technicalNote: "הפקה מלאה באולפן - תג קולי + עיבוד + drop. חבילה טבעית.",
    energy: "גבוה",
    researchSource: "Custom intro/drop producer market",
    proCta: "custom",
  },
  {
    id: "lil_nas_mizrahi_drill",
    songA: "נועה קירל - פאוף",
    songB: "Central Cee - Sprinter (instrumental)",
    moment: "רחבה",
    tier: "יצירתי",
    hook: "דור Z ישראלי על drill UK - chop, לא fade.",
    whyItWorks:
      "צעירים מכירים את שני הצדדים. ה-drill נותן משקל שהמזרחית הרגילה לא מביאה - בלי לאבד את המילים.",
    mergeTip: "8 תיבות פאוף acapella → כניסת 808 והיי-האטים. שמור על BPM 140 קבוע.",
    crowdProfile: "בר מצווה, חתונה צעירה, אירוע עם גילאי 16–25.",
    energy: "גבוה",
    researchSource: "Drill×Israeli pop trend 2025–26",
    proCta: "custom",
  },
  {
    id: "reggaeton_shir_yeladim",
    songA: "שיר ילדות ישראלי (נושן / אריק)",
    songB: "Bad Bunny - Tití Me Preguntó (intro)",
    moment: "בר_מצווה",
    tier: "יצירתי",
    hook: "נוסטלגיה להורים, reggaeton לילדים - שניהם קופצים.",
    whyItWorks:
      "בר מצווה = שני קהלים. השיר שגדלו עליו + ביט שמכירים מטיקטוק.",
    mergeTip: "מקור ישראלי איטי 4 תיבות → dembow loop. אל תדחוף pitch על המילים.",
    crowdProfile: "בר/בת מצווה עם הורים וילדים באותה רחבה.",
    energy: "גבוה",
    researchSource: "Latin×Israeli event mashups",
    proCta: "custom",
  },
  {
    id: "psy_omer_bridge",
    songA: "עומר אדם - מלכת הדור (breakdown)",
    songB: "1200 Micrograms - Psalm 23 (bridge)",
    moment: "מעבר",
    tier: "יצירתי",
    hook: "30 שניות שמשנות אווירה לפני שהרחבה חוזרת.",
    whyItWorks:
      "לא שיר שלם - רק גשר. הקהל לא מספיק לעייף, מספיק לפתוח עיניים.",
    mergeTip: "breakdown עומר 16 תיבות → psy bridge 16 תיבות → חזרה ל-128. תאם תאורה.",
    crowdProfile: "חתונות גדולות, דיג'ייז שלא מפחדים לצאת מהקופסה.",
    energy: "בינוני",
    researchSource: "Psy-trance bridges in wedding sets (EU trend)",
    proCta: "custom",
  },
  {
    id: "piano_mizrahi_live",
    songA: "דגימת פסנתר חי (סולו 8 תיבות)",
    songB: "אייל גולן - בלבלי אותו",
    moment: "חופה",
    tier: "יצירתי",
    hook: "נשמע כמו מוזיקאי באירוע - לא כמו לפטופ.",
    whyItWorks:
      "חופה רוצה רגש אמיתי. פסנתר חי מעל ביט מזרחית נותן את זה בלי להעסיק נגן שלם.",
    mergeTip: "הקלטת פסנתר ב-95 BPM → עלייה ל-128 בכניסת הפזמון. reverb קצר על הפסנתר.",
    crowdProfile: "חופה, כניסה, רגעים רגשיים לפני רחבה.",
    energy: "רך",
    researchSource: "Live element×Mizrahi production",
    proCta: "custom",
  },
] as const;

export type MashupIdeaFilters = {
  moment?: MashupMoment | "הכל";
  tier?: MashupTier | "הכל";
  hasDemo?: boolean;
};

function ideaTier(idea: DjMashupIdea): MashupTier {
  return idea.tier ?? "רחבה";
}

export function getMashupIdeas(filters: MashupIdeaFilters = {}): readonly DjMashupIdea[] {
  const moment = filters.moment ?? "הכל";
  const tier = filters.tier ?? "הכל";
  const hasDemo = filters.hasDemo ?? false;

  let list = DJ_MASHUP_IDEAS.map(enrichMashupIdea).filter((idea) => {
    if (moment !== "הכל" && idea.moment !== moment) return false;
    if (tier !== "הכל" && ideaTier(idea) !== tier) return false;
    if (hasDemo && !idea.youtubeDemo) return false;
    return true;
  });

  list = [...list].sort((a, b) => {
    const tierOrder = (t: MashupTier) => (t === "יצירתי" ? 0 : 1);
    return tierOrder(ideaTier(a)) - tierOrder(ideaTier(b));
  });

  return list;
}

/** @deprecated Use getMashupIdeas */
export function getMashupIdeasByMoment(moment: MashupMoment | "הכל"): readonly DjMashupIdea[] {
  return getMashupIdeas({ moment });
}

export function getMashupIdeaById(id: string): DjMashupIdea | undefined {
  const raw = DJ_MASHUP_IDEAS.find((i) => i.id === id);
  return raw ? enrichMashupIdea(raw) : undefined;
}

export function buildMashupIdeaWhatsAppText(idea: DjMashupIdea): string {
  const label = idea.tier === "יצירתי" ? "שילוב יצירתי" : "רעיון מאשאפ";
  const musicLine = idea.music
    ? `\n${idea.music.harmony.targetBpm} BPM, ${idea.music.trackA.keyCamelot}→${idea.music.trackB.keyCamelot}`
    : "";
  return `שלום, ראיתי באתר ${label}:\n${idea.songA} × ${idea.songB}${musicLine}\nרוצה גרסה מוכנה / עריכה מלאה.`;
}
