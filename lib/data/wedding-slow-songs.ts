/**
 * שירי סלואו לחתונה: מקור אמת יחיד לרשימות בפוסט /blog/wedding-slow-songs.
 *
 * אותה שיטה כמו lib/data/bat-mitzvah-songs.ts: כל שיר כאן הופיע ברשימה של
 * הבעלים באתר הישן (Wayback, 12.12.2025), או שהבעלים אישר אותו ב-4.10.2026.
 * שם ומבצע נבדקו מול מקור ציבורי (source). המחקר המלא, עם מספרי צפיות
 * וראיות לשימוש בחתונות, נשמר מחוץ לריפו (תכנון-פנימי/נתונים).
 *
 * תיקונים מול הרשימה הישנה (4.10.2026): כתיב של שמות (ארקדי דוכין, ליאור
 * מיארה, ליאור נרקיס, סטלוס, יעקב שוואקי, בעז שרעבי, אביהו שבת) ושל שירים
 * (כשאת נוגעת בי, שתיים בלילה, השער לגן עדן, חיים שלי, מיליון סיבות, את).
 * "אהיה לך אושר" הופיע פעמיים. שלושה שירים הופיעו כשני שירים והם מקור
 * וקאבר: אוהבת אותי אמיתי, מלאת אהבה, יש בי אהבה. "לי ולך - דורון בובמן"
 * לא נמצא, והבעלים אישר שהכוונה לשיר של אריק איינשטיין (ברשימת הנוסטלגיה).
 * "היא לא דומה" ו"האחת שלי" הוצאו לבקשת הבעלים.
 */

import type { BatMitzvahSongList as SongList } from "@/lib/data/bat-mitzvah-songs";

/** השירים שזוגות בוחרים אצלנו כבר שנים: המצעד והמומלצים מהרשימה הישנה. */
export const WEDDING_SLOW_CLASSIC_SONGS: SongList = {
  id: "classic",
  songs: [
    { title: "בראשית עולם", artist: "שלומי שבת", source: "https://www.youtube.com/watch?v=GYLU9leTAjE" },
    { title: "בואי בשלום", artist: "יעקב שוואקי", source: "https://www.youtube.com/watch?v=dRQUsaKVIyg" },
    { title: "ניצחת איתי הכל", artist: "עמיר בניון", source: "https://www.youtube.com/watch?v=pRQX6Xp2B48" },
    {
      title: "אוהבת אותי אמיתי",
      artist: "עומר אדם",
      note: "יש גם גרסה בקול נשי, של דנה לפידות",
      source: "https://www.youtube.com/watch?v=31DIsGbFVgY",
    },
    { title: "את היחידה", artist: "ניסים מרי", source: "https://www.youtube.com/watch?v=1XUjiStKzas" },
    { title: "אלייך", artist: "פיני חדד", source: "https://www.youtube.com/watch?v=NyFHWbtm1RU" },
    { title: "שלך", artist: "סטלוס ואורן חן", source: "https://www.youtube.com/watch?v=Ty0Iq8RPR8g" },
    { title: "בתלם אוהבים", artist: "רגב הוד", source: "https://www.youtube.com/watch?v=TZ8TMDU2a5U" },
    { title: "ואז תבואי", artist: "הראל מויאל", source: "https://www.youtube.com/watch?v=32oVRcayvSU" },
    {
      title: "מכל האהבות",
      artist: "הפרויקט של עידן רייכל, בשירת מאיה אברהם",
      source: "https://www.youtube.com/watch?v=Wa0Nmruih_A",
    },
    { title: "ביני לבינך", artist: "דודו אהרון", source: "https://www.youtube.com/watch?v=P9BN6csueRY" },
    { title: "עד שמצאתי אותך", artist: "מושיק עפיה", source: "https://www.youtube.com/watch?v=Hpz15mnv4RQ" },
    {
      title: "את המחר שלי",
      artist: "שמעון בוסקילה ושירי מימון",
      note: "דואט. יש גם הגרסה של בוסקילה לבד",
      source: "https://www.youtube.com/watch?v=7i3ZakEdPC8",
    },
    { title: "שתדעי", artist: "שלומי שבת", source: "https://www.youtube.com/watch?v=6qUQtevJ71k" },
    {
      title: "מלאת אהבה",
      artist: "רובי לוי",
      note: "יש גם הגרסה של אייל גולן",
      source: "https://www.youtube.com/watch?v=5TyhPGcnr9g",
    },
    { title: "האחת של חיי", artist: "ליאור מיארה", source: "https://www.youtube.com/watch?v=MJ69V9npP2s" },
    { title: "לעשות לך טוב", artist: "דודו אהרון", source: "https://www.youtube.com/watch?v=4uJRecrm4p8" },
    { title: "אהיה לך אושר", artist: "הראל מויאל", source: "https://www.youtube.com/watch?v=QNgJtvMyMCU" },
    { title: "קטנה", artist: "מאור אדרי", source: "https://www.youtube.com/watch?v=-zDWcPmedxg" },
    { title: "כמו שאת", artist: "מאור אדרי", source: "https://www.youtube.com/watch?v=qpr1D3u6Ces" },
  ],
};

/** עוד שירים מהרשימה הישנה ("עוד 40 שירי סלואו לחתונה"), אחרי איחוד כפילויות. */
export const WEDDING_SLOW_MORE_SONGS: SongList = {
  id: "more",
  songs: [
    { title: "יש לך", artist: "שלומי שבת", source: "https://www.youtube.com/watch?v=J2yMP7sgu9I" },
    { title: "רגע גדול", artist: "אייל גולן ושרית חדד", source: "https://www.youtube.com/watch?v=gyWFc9qD4tc" },
    { title: "את", artist: "אייל גולן", source: "https://www.youtube.com/watch?v=P1OV_I6-5Gw" },
    { title: "תודה", artist: "ישי לוי", source: "https://www.youtube.com/watch?v=wqK1cGYRsns" },
    { title: "השער לגן עדן", artist: "ישי לוי", source: "https://www.youtube.com/watch?v=YLoQZV_uDHQ" },
    { title: "כמה טוב שבאת", artist: "יואב יצחק", source: "https://www.youtube.com/watch?v=_9QlsZZAP64" },
    { title: "שתיים בלילה", artist: "משה פרץ", source: "https://www.youtube.com/watch?v=BvjpEnEMKLA" },
    { title: "כמו ילד", artist: "דודו אהרון", source: "https://www.youtube.com/watch?v=C34aGYUUGN8" },
    { title: "אור כוכב", artist: "שרית חדד", source: "https://www.youtube.com/watch?v=X_nDgZJDVPk" },
    { title: "התהיי לי", artist: "ליאור נרקיס", source: "https://www.youtube.com/watch?v=hi9chjGkUG0" },
    { title: "ואולי", artist: "משה פרץ", source: "https://www.youtube.com/watch?v=P7wseUfayn0" },
    { title: "עד יום מותי", artist: "איציק קלה", source: "https://www.youtube.com/watch?v=T5XPo8BOM-o" },
    { title: "תודה לך", artist: "רז חדד", source: "https://www.youtube.com/watch?v=2KDVQwur7HI" },
    { title: "את", artist: "מוש בן ארי", source: "https://www.youtube.com/watch?v=Rh56lJHjTcw" },
    { title: "יפה כלבנה", artist: "אביתר בנאי", source: "https://www.youtube.com/watch?v=hwHPkNl-cxo" },
    { title: "ירוק ודבש", artist: "דודו אהרון", source: "https://www.youtube.com/watch?v=F-uSqIXuUG4" },
    { title: "פעם בחיים", artist: "עומר אדם", source: "https://www.youtube.com/watch?v=Iwv-aggzNbk" },
    { title: "חיים שלי", artist: "עדן בן זקן", source: "https://www.youtube.com/watch?v=qEEzKfGa1oY" },
    { title: "בריאת עולם", artist: "מאור אדרי", source: "https://www.youtube.com/watch?v=37a0IrfJTDw" },
    { title: "מיליון סיבות", artist: "יואב יצחק", source: "https://www.youtube.com/watch?v=fvw3Cdv-xcc" },
    { title: "יום אחד תבקשי", artist: "שיר לוי", source: "https://www.youtube.com/watch?v=0SqlPODDWwE" },
    { title: "נצח לצידך", artist: "עומר אדם", source: "https://www.youtube.com/watch?v=f7UxyBhQUT0" },
    { title: "את יפה", artist: "עידן יניב", source: "https://www.youtube.com/watch?v=_z3ApXbHTwc" },
    { title: "יסמין", artist: "הפיל הכחול", source: "https://www.youtube.com/watch?v=HfDBAM2SFDE" },
    { title: "אין עוד אהבה כזאת", artist: "דיקלה", source: "https://www.youtube.com/watch?v=tJllvDwEg9s" },
    { title: "מוכרת לי מפעם", artist: "דין דין אביב", source: "https://www.youtube.com/watch?v=Nba8UzXpseQ" },
    { title: "אצלך בעולם", artist: "היהודים", source: "https://www.youtube.com/watch?v=Q2Oy_WOVPMY" },
    { title: "רק אותך", artist: "אביהו שבת", source: "https://www.youtube.com/watch?v=ihd6SLLp6xM" },
    { title: "זכיתי לאהוב", artist: "עברי לידר", source: "https://www.youtube.com/watch?v=G2Mx2kYX4jw" },
    { title: "מעליות", artist: "דודו טסה ורוני אלטר", source: "https://www.youtube.com/watch?v=yjE8RgR4m-c" },
    { title: "בשבילך נוצרתי", artist: "אייל גולן", source: "https://www.youtube.com/watch?v=PB-1m9aMWYE" },
    { title: "נתת לי אותה", artist: "דודו אהרון", source: "https://www.youtube.com/watch?v=UnkRCD9_b90" },
    { title: "לוחמת", artist: "אייל גולן", source: "https://www.youtube.com/watch?v=X308PIRPl88" },
    { title: "נשבע לך", artist: "משה פרץ", source: "https://www.youtube.com/watch?v=aHmkpyJCtWg" },
    { title: "אחת כמוך", artist: "איזי", source: "https://www.youtube.com/watch?v=qVMXpBfi28w" },
  ],
};

/** שירים חדשים, 2022 עד 2026. אושרו על ידי הבעלים 4.10.2026. */
export const WEDDING_SLOW_NEW_SONGS: SongList = {
  id: "new",
  songs: [
    { title: "גן עדן", artist: "אגם בוחבוט", source: "https://www.youtube.com/watch?v=eGCx4h2UhzA" },
    { title: "רק שלך", artist: "עומר אדם", source: "https://www.youtube.com/watch?v=Jw02uPan7RU" },
    { title: "צעדים", artist: "עקיבא", source: "https://www.youtube.com/watch?v=XzeyFpGtCUE" },
    { title: "הנך יפה", artist: "בן צור", source: "https://www.youtube.com/watch?v=avPAL4Ctxtg" },
    { title: "אישתי", artist: "בן צור", source: "https://www.youtube.com/watch?v=FP5Q27zGYsE" },
    { title: "לב לבן", artist: "שולי רנד", source: "https://www.youtube.com/watch?v=c_rx1efu52w" },
    { title: "להינשא הלילה", artist: "עומר אדם", source: "https://www.youtube.com/watch?v=McQh8KURk_E" },
    {
      title: "אבל את",
      artist: "מאיר בנאי ואביתר בנאי",
      note: "דואט חדש לשיר של מאיר בנאי",
      source: "https://www.youtube.com/watch?v=7VJ4piwmauA",
    },
    {
      title: "עוד לא אהבתי די",
      artist: "סאבלימינל ויהורם גאון",
      note: "גרסה מ-2026 לשיר של נעמי שמר, שיהורם גאון שר לראשונה ב-1977",
      source: "https://he.wikipedia.org/wiki/%D7%A2%D7%95%D7%93_%D7%9C%D7%90_%D7%90%D7%94%D7%91%D7%AA%D7%99_%D7%93%D7%99",
    },
    { title: "מי אוהב אותך יותר ממני", artist: "אודיה", source: "https://www.youtube.com/watch?v=erRDboprxpA" },
    { title: "אהבה ממבט ראשון", artist: "עידן עמדי", source: "https://www.youtube.com/watch?v=EPoy7CmRfjA" },
    { title: "לאהוב אותך כל יום", artist: "דולי ופן ועדן חסון", source: "https://www.youtube.com/watch?v=th5Br6OAEbg" },
    { title: "מזל", artist: "תמר יהלומי ויונתן קלימי", source: "https://www.youtube.com/watch?v=tFW2alq3FMU" },
    { title: "תמיד שלך", artist: "עומר אדם", source: "https://www.youtube.com/watch?v=PburljbL-fo" },
    { title: "כוכבים", artist: "שילה בן סעדון", source: "https://www.youtube.com/watch?v=sCBUBR3mZAM" },
    { title: "תפילות", artist: "תמר יהלומי", source: "https://www.youtube.com/watch?v=jCPTkvcuGSI" },
    { title: "קרן שמש", artist: "בניה ברבי", source: "https://www.youtube.com/watch?v=n5illsgvqKA" },
    { title: "האישה הכי יפה בעולם", artist: "אושר ביטון", source: "https://www.youtube.com/watch?v=5P9wOC8i_3Y" },
    { title: "פשוט אוהב אותך", artist: "מוש בן ארי", source: "https://www.youtube.com/watch?v=HHpGfaM8Zmk" },
    { title: "אישתי", artist: "רועי סנדלר", source: "https://www.youtube.com/watch?v=TFawTJCzYBQ" },
    { title: "חיים שלי את", artist: "אדיר גץ", source: "https://www.youtube.com/watch?v=I9oZZwD_Ui4" },
  ],
};

/** שירים נוסטלגיים. אושרו על ידי הבעלים 4.10.2026, כולל "מצייר אותך" שהוא הוסיף. */
export const WEDDING_SLOW_NOSTALGIC_SONGS: SongList = {
  id: "nostalgic",
  songs: [
    { title: "לי ולך", artist: "אריק איינשטיין וגאולה נוני", source: "https://www.youtube.com/watch?v=915-4EGLXb4" },
    { title: "אני ואתה", artist: "אריק איינשטיין", source: "https://www.youtube.com/watch?v=gP6PS-poyMg" },
    { title: "אף פעם לא תדעי", artist: "שלמה ארצי", source: "https://www.youtube.com/watch?v=8GmoiZ9j2YM" },
    { title: "הפרח בגני", artist: "זוהר ארגוב", source: "https://www.youtube.com/watch?v=SMkXTiPnwxk" },
    { title: "אהבת חיי", artist: "חיים משה", source: "https://www.youtube.com/watch?v=8vtrEFCpelU" },
    { title: "ירח", artist: "שלמה ארצי", source: "https://www.youtube.com/watch?v=hGiNUsSHkr0" },
    { title: "בואי נגיד", artist: "אלון אולארצ'יק", source: "https://www.youtube.com/watch?v=yR74-O9hycw" },
    {
      title: "יש בי אהבה",
      artist: "אריק איינשטיין ושם טוב לוי",
      note: "יש גם הגרסה של עמיר בניון",
      source: "https://www.youtube.com/watch?v=uS2KXqTIo84",
    },
    { title: "אהבה ממבט ראשון", artist: "אריק איינשטיין", source: "https://www.youtube.com/watch?v=e6YRMd6-q78" },
    { title: "לא יכול להוריד ממך את העיניים", artist: "מאיר אריאל", source: "https://www.youtube.com/watch?v=SDTHunBmslc" },
    { title: "כשאת נוגעת בי", artist: "בעז שרעבי", source: "https://www.youtube.com/watch?v=UGSfr056MgE" },
    { title: "מצייר אותך", artist: "עופר לוי", source: "https://www.youtube.com/watch?v=NqckQ6jrF40" },
  ],
};

export const WEDDING_SLOW_SONG_LISTS = [
  WEDDING_SLOW_CLASSIC_SONGS,
  WEDDING_SLOW_MORE_SONGS,
  WEDDING_SLOW_NEW_SONGS,
  WEDDING_SLOW_NOSTALGIC_SONGS,
] as const;

/** שירים שהבעלים ביקש להוציא (4.10.2026). הבדיקה מוודאת שלא יחזרו בטעות. */
export const WEDDING_SLOW_EXCLUDED_TITLES = ["היא לא דומה", "האחת שלי"] as const;
