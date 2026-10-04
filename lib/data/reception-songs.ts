/**
 * שירים לקבלת פנים: מקור אמת יחיד לרשימות בפוסט /blog/reception-songs.
 *
 * אותה שיטה כמו wedding-slow-songs.ts: ארבע ההמלצות מהמדריך הישן של הבעלים
 * (Wayback, 11.11.2025), ועוד שירים שהמחקר מצא ושהבעלים אישר ב-4.10.2026
 * ("מאשר הכל"). לכל שיר מקור ציבורי (source), ולכל שיר במחקר גם ראיה שהוא
 * מתנגן בקבלות פנים (כתבות ופלייליסטים). המחקר המלא נשמר מחוץ לריפו
 * (תכנון-פנימי/נתונים).
 *
 * תיקון מול המדריך הישן: "דוד אוהב אותך - דוד לוי" הוא "דוד" של דודי לוי.
 */

import type { BatMitzvahSongList as SongList } from "@/lib/data/bat-mitzvah-songs";

/** ארבע ההמלצות מהמדריך הישן של הבעלים. */
export const RECEPTION_OUR_PICKS: SongList = {
  id: "picks",
  songs: [
    { title: "דוד", artist: "דודי לוי", note: "מוכר גם כ\"דוד אוהב אותך\"", source: "https://www.youtube.com/watch?v=2YvaVD8CbNc" },
    { title: "אני אשיר לך שיר", artist: "התקווה 6", note: "גרסה לשיר של אריק לביא", source: "https://www.youtube.com/watch?v=0ICikMG6OQA" },
    { title: "היום", artist: "אהוד בנאי", source: "https://www.youtube.com/watch?v=vYq_WREF1hs" },
    { title: "בא מן השתיקה", artist: "קובי אפללו", source: "https://www.youtube.com/watch?v=74Mjiq-weAg" },
  ],
};
/** קלאסיקות ישראליות, ושלושה שירים מ-2007 עד 2014 עם ראיה חזקה. */
export const RECEPTION_ISRAELI_CLASSICS: SongList = {
  id: "classics",
  songs: [
    { title: "עטור מצחך", artist: "אריק איינשטיין", source: "https://www.youtube.com/watch?v=WZM4iXT3-ic" },
    { title: "ברית עולם", artist: "מתי כספי", source: "https://www.youtube.com/watch?v=1mieEeD0Kfk" },
    { title: "סיגליות", artist: "דויד ברוזה", source: "https://www.youtube.com/watch?v=mHndiWsfc2U" },
    { title: "היא כל כך יפה", artist: "כוורת", source: "https://www.youtube.com/watch?v=vf9I1dT_umc" },
    { title: "יש בי אהבה", artist: "אריק איינשטיין", source: "https://www.youtube.com/watch?v=OB6Poma04XE" },
    { title: "נבראתי לך", artist: "שלמה ארצי", source: "https://www.youtube.com/watch?v=QD8pkh2tVd4" },
    { title: "לאט לאט", artist: "שלום חנוך", source: "https://www.youtube.com/watch?v=zCP25DuIXRk" },
    { title: "כשאת נוגעת בי", artist: "בעז שרעבי", source: "https://www.youtube.com/watch?v=3OdPLc8E_uM" },
    { title: "בכל פעם שאני מתאהב בך מחדש", artist: "יזהר אשדות", source: "https://www.youtube.com/watch?v=qRKjWL5a2-E" },
    { title: "לא יכול להוריד ממך את העיניים", artist: "מאיר אריאל", source: "https://www.youtube.com/watch?v=SDTHunBmslc" },
    { title: "אני שוב מתאהב", artist: "גידי גוב", source: "https://www.youtube.com/watch?v=qoGurrdtz6Q" },
    { title: "עכשיו התור לאהבה", artist: "אריק איינשטיין", note: "יש גם הגרסה של עוזי חיטמן", source: "https://www.youtube.com/watch?v=vl8t5jnQgUs" },
    { title: "מתנות קטנות", artist: "רמי קלינשטיין", source: "https://www.youtube.com/watch?v=pn_p5_8taxg" },
    { title: "משהו חדש מתחיל", artist: "דני רובס", source: "https://www.youtube.com/watch?v=8yfWmcGlVn8" },
    { title: "איך אפשר שלא", artist: "ג'יין בורדו", source: "https://www.youtube.com/watch?v=-BR3ziVDazM" },
  ],
};
/** ישראלי עדכני, 2018 עד 2026. */
export const RECEPTION_ISRAELI_RECENT: SongList = {
  id: "recent",
  songs: [
    { title: "שיר של קיץ", artist: "תומר ישעיהו", source: "https://www.youtube.com/watch?v=ZZKOQN4_TdM" },
    { title: "שמש", artist: "חנן בן ארי", source: "https://www.youtube.com/watch?v=AmKkovDO1_w" },
    { title: "רגעים", artist: "מארינה מקסימיליאן", source: "https://www.youtube.com/watch?v=UhNVfJrcdWs" },
    { title: "תל אביב זה אני ואת", artist: "אמיר ובן עם ג'יין בורדו", source: "https://www.youtube.com/watch?v=ctHXPuEMASs" },
    { title: "בסוף יהיה טוב", artist: "אסף הרוש", source: "https://www.youtube.com/watch?v=PCZuNTdniDM" },
    { title: "שלום בבית", artist: "עקיבא", source: "https://www.youtube.com/watch?v=2PeA7obEV0U" },
    { title: "הכל עוד אפשרי", artist: "עקיבא", source: "https://www.youtube.com/watch?v=bAc8yqh514M" },
    { title: "את לא נשארת לבד", artist: "עידן רייכל", source: "https://www.youtube.com/watch?v=i00PfybyQw0" },
    { title: "רחוק מכולם", artist: "עומר אדם", source: "https://www.youtube.com/watch?v=4g2kexLp2qg" },
    { title: "תכף יפתח", artist: "ישי ריבו", source: "https://www.youtube.com/watch?v=ozO_rKRYeMY" },
    { title: "מה פספסתי", artist: "עדן חסון", source: "https://www.youtube.com/watch?v=fA8B_xKXo9k" },
    { title: "יש לי חור בלב בצורה שלך", artist: "ג'ירפות", source: "https://www.youtube.com/watch?v=r4S7MyWjKIs" },
  ],
};
/** מזרחי וים תיכוני. */
export const RECEPTION_MIZRAHI: SongList = {
  id: "mizrahi",
  songs: [
    { title: "הפרח בגני", artist: "זוהר ארגוב", source: "https://www.youtube.com/watch?v=vcpgpEUlKfk" },
    { title: "צל עץ תמר", artist: "זוהר ארגוב", source: "https://www.youtube.com/watch?v=kGoYq_TN5FY" },
    { title: "ואני שר", artist: "שלומי שבת", source: "https://www.youtube.com/watch?v=u1i5IxDJEKE" },
    { title: "מה שהלב בחר", artist: "קובי אפללו", source: "https://www.youtube.com/watch?v=puZPWiF3KeU" },
    { title: "יש לי אותך", artist: "משה פרץ", source: "https://www.youtube.com/watch?v=6vuflEkqW20" },
    { title: "בחלומות שלנו", artist: "דודו אהרון ועדן מאירי", source: "https://www.youtube.com/watch?v=BoH1OvaaXM4" },
    { title: "לנשום", artist: "שמעון בוסקילה ואליעד", source: "https://www.youtube.com/watch?v=XDKym_DdU-c" },
    { title: "עיוני לך", artist: "ציון גולן", source: "https://www.youtube.com/watch?v=cTBWp7mavDI" },
    { title: "באת עם השקט", artist: "דודו טסה", source: "https://www.youtube.com/watch?v=NWQ-DylMyHQ" },
    { title: "יהיה לנו טוב", artist: "אתניקס", source: "https://www.youtube.com/watch?v=Op-xn5xP_bk" },
  ],
};
/** כלי, ג'אז וקלאסי. */
export const RECEPTION_INSTRUMENTAL: SongList = {
  id: "instrumental",
  songs: [
    { title: "Canon in D", artist: "פכלבל", source: "https://www.youtube.com/watch?v=Ptk_1Dc2iPY" },
    { title: "Eine kleine Nachtmusik", artist: "מוצרט", source: "https://www.youtube.com/watch?v=QZWKUszkbXU" },
    { title: "Clair de lune", artist: "דביסי", source: "https://www.youtube.com/watch?v=-Bxpm0EmOMU" },
    { title: "Méditation, מתוך האופרה תאיס", artist: "מסנה", source: "https://www.youtube.com/watch?v=nGjaXzVzZlo" },
    { title: "Brandenburg Concerto No. 3", artist: "באך", source: "https://www.youtube.com/watch?v=Czsd13Mmcg0" },
    { title: "האביב, מתוך ארבע העונות", artist: "ויואלדי", source: "https://www.youtube.com/watch?v=3LiztfE1X7E" },
    { title: "Journey", artist: "מארק אליהו", source: "https://www.youtube.com/watch?v=RgKKgzVhMgY" },
    { title: "Todas las Palabras", artist: "הפרויקט של עידן רייכל", source: "https://www.youtube.com/watch?v=hzGH_oZmtxU" },
    { title: "Don't Know Why", artist: "נורה ג'ונס", source: "https://www.youtube.com/watch?v=tO4dxvguQDk" },
    { title: "Fly Me to the Moon", artist: "פרנק סינטרה עם קאונט בייסי", source: "https://www.youtube.com/watch?v=JYuyWrkwpok" },
    { title: "The Girl from Ipanema", artist: "סטן גץ, ז'ואאו ואסטרוד ז'ילברטו", source: "https://www.youtube.com/watch?v=kLO8XoNf5EM" },
  ],
};
/** לאירוע דתי. */
export const RECEPTION_RELIGIOUS: SongList = {
  id: "religious",
  songs: [
    { title: "לשוב הביתה", artist: "ישי ריבו", source: "https://www.youtube.com/watch?v=Y30pfWIQfoo" },
    { title: "פשוטים", artist: "עקיבא", source: "https://www.youtube.com/watch?v=e8LX8SxYWdI" },
    { title: "מחשבות טובות", artist: "מוטי וייס", source: "https://www.youtube.com/watch?v=8d1NXx3Z5EQ" },
    { title: "ניגון הצמח צדק", artist: "אברהם פריד", source: "https://www.youtube.com/watch?v=9xUHOpqeYLU" },
    { title: "סיבת הסיבות", artist: "ישי ריבו", source: "https://www.youtube.com/watch?v=T5Wf3gmF6Do" },
    { title: "שלום לך דודי", artist: "מאיר בנאי", source: "https://www.youtube.com/watch?v=D3vuNqUOeb8" },
    { title: "הבוקר יעלה", artist: "ישי ריבו", source: "https://www.youtube.com/watch?v=7mmu6EzLZfM" },
    { title: "אנה אפנה", artist: "ארז לב ארי", source: "https://www.youtube.com/watch?v=fTRm3nyNpro" },
  ],
};
export const RECEPTION_SONG_LISTS = [
  RECEPTION_OUR_PICKS,
  RECEPTION_ISRAELI_CLASSICS,
  RECEPTION_ISRAELI_RECENT,
  RECEPTION_MIZRAHI,
  RECEPTION_INSTRUMENTAL,
  RECEPTION_RELIGIOUS,
] as const;
