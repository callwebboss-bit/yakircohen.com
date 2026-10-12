/**
 * שיר כניסה לחופה: מקור אמת יחיד לרשימות בפוסט /blog/wedding-songs-chuppah.
 *
 * אותה שיטה כמו lib/data/wedding-slow-songs.ts: כל שיר כאן הופיע ברשימה של
 * הבעלים באתר הישן (Wayback, 12.12.2025), או שהבעלים סימן "מאשר" ב-12.10.2026
 * (D112). שם ומבצע נבדקו מול מקור ציבורי (source). קובץ הסימון המלא, עם
 * הרשימות שמראות שזוגות בוחרים את השיר, נשמר מחוץ לריפו:
 * תכנון-פנימי/נתונים/שירים-לאישור-2026-10-12.md.
 *
 * החלוקה לפי סגנון ולא לפי "סקר" או "רוב הזוגות" (D100). מה שלא נכנס:
 * "היא לא דומה" ו"האחת שלי", שלושה ביצועים אחרים של "נשבע", ושישה שירים
 * מהעמוד הישן שלא נמצא להם מקור (שמע ישראל של איפרגן, נעימת הנווד, שיר
 * למעלות של להקת ילדים, ברכת הכוהנים של אלירן אביטל, ברכת האלוהים של
 * אורלב, בואי בשלום של אבישי אשל).
 *
 * קאברים שאושרו מופיעים כהערה מתחת לשיר המקורי. המקורות שלהם:
 * יונתן קלימי https://www.youtube.com/watch?v=xKVHrz26-jA ,
 * דיקלה (ניצחת איתי הכל) https://www.youtube.com/watch?v=foDbTPQjnY4 ,
 * דיקלה (מה שהלב בחר) https://www.youtube.com/watch?v=rlNM7jYcmTo ,
 * נדב סגרון https://www.youtube.com/watch?v=LkRirOgEJsc ,
 * יניב בן משיח (להינשא הלילה, 2007) https://www.youtube.com/watch?v=vW5SqnA45Ic .
 */

import type { BatMitzvahSongList as SongList } from "@/lib/data/bat-mitzvah-songs";

export const CHUPPAH_EMOTIONAL_SONGS: SongList = {
  id: "emotional",
  songs: [
    { title: "ממעמקים", artist: "הפרויקט של עידן רייכל", source: "https://www.youtube.com/watch?v=kmW2yAYhMmM" },
    { title: "ואם תבואי אליי", artist: "עידן רייכל", source: "https://www.youtube.com/watch?v=nI8n20UpaBY" },
    { title: "לפני שייגמר", artist: "עידן רייכל", source: "https://www.youtube.com/watch?v=dG3NAutpEoY" },
    {
      title: "הנך יפה",
      artist: "הפרויקט של עידן רייכל",
      note: "שיר אחר מ\"הנך יפה\" של בן צור, שגם הוא ברשימה",
      source: "https://www.youtube.com/watch?v=lyZCVjgyqV4",
    },
    {
      title: "משאפ משירי עידן רייכל",
      artist: "תמר ולידור",
      source: "https://www.youtube.com/watch?v=Jd4Lkcj_m0M",
    },
    { title: "בעולם שלה", artist: "התקווה 6", source: "https://www.youtube.com/watch?v=1lUqsvFyM6k" },
    { title: "לילותיי", artist: "יובל דיין", source: "https://www.youtube.com/watch?v=t-PhGnkn_hU" },
    { title: "איך אפשר שלא", artist: "ג'יין בורדו", source: "https://www.youtube.com/watch?v=-BR3ziVDazM" },
    { title: "ביום הזה", artist: "אגם בוחבוט", source: "https://www.youtube.com/watch?v=_nJ3IshxduY" },
    { title: "ברכת הדרך", artist: "סגיב כהן ואגם בוחבוט", source: "https://www.youtube.com/watch?v=xNZvQrZgWlg" },
    { title: "גן עדן", artist: "אגם בוחבוט", source: "https://www.youtube.com/watch?v=eGCx4h2UhzA" },
    { title: "אלך איתך", artist: "אור אדי", source: "https://www.youtube.com/watch?v=xKQJWmqttEc" },
    { title: "יש לי חלום", artist: "עמיר בניון", source: "https://www.youtube.com/watch?v=orpcf6GULO8" },
    { title: "פעם בחיים", artist: "עומר אדם", source: "https://www.youtube.com/watch?v=Iwv-aggzNbk" },
    { title: "רק שלך", artist: "עומר אדם", source: "https://www.youtube.com/watch?v=Jw02uPan7RU" },
    { title: "תמיד שלך", artist: "עומר אדם", source: "https://www.youtube.com/watch?v=PburljbL-fo" },
    {
      title: "חיים שלי",
      artist: "עדן בן זקן",
      note: "יש גם הגרסה של יונתן קלימי, שכתב את השיר עם תמר יהלומי",
      source: "https://www.youtube.com/watch?v=qEEzKfGa1oY",
    },
    { title: "מזל", artist: "תמר יהלומי ויונתן קלימי", source: "https://www.youtube.com/watch?v=tFW2alq3FMU" },
    { title: "משהו חדש מתחיל", artist: "דני רובס", source: "https://www.youtube.com/watch?v=8yfWmcGlVn8" },
    { title: "צעדים", artist: "עקיבא", source: "https://www.youtube.com/watch?v=XzeyFpGtCUE" },
    { title: "הנך יפה", artist: "בן צור", source: "https://www.youtube.com/watch?v=avPAL4Ctxtg" },
    { title: "מי אוהב אותך יותר ממני", artist: "אודיה", source: "https://www.youtube.com/watch?v=erRDboprxpA" },
    { title: "אהבה ממבט ראשון", artist: "עידן עמדי", source: "https://www.youtube.com/watch?v=EPoy7CmRfjA" },
    { title: "לאהוב אותך כל יום", artist: "דולי ופן ועדן חסון", source: "https://www.youtube.com/watch?v=th5Br6OAEbg" },
    { title: "אישתי", artist: "רועי סנדלר", source: "https://www.youtube.com/watch?v=TFawTJCzYBQ" },
    { title: "יחפים", artist: "יסמין מועלם", source: "https://www.youtube.com/watch?v=Dcvm3PpOuiA" },
  ],
};

export const CHUPPAH_MIZRAHI_SONGS: SongList = {
  id: "mizrahi",
  songs: [
    { title: "היום אני נושא אותך", artist: "נתי לוי", source: "https://www.youtube.com/watch?v=nsKEXJT_J_A" },
    { title: "ישקף", artist: "סגיב כהן", source: "https://www.youtube.com/watch?v=4b9S7kJCHuw" },
    { title: "את זה עולם", artist: "אבי גואטה", source: "https://www.youtube.com/watch?v=fTpMzGKtmWU" },
    { title: "בואי כלה", artist: "איציק קלה", source: "https://www.youtube.com/watch?v=gXUkYaEeMTo" },
    {
      title: "מה שהלב בחר",
      artist: "קובי אפללו",
      note: "יש גם הגרסאות של דיקלה ושל נדב סגרון",
      source: "https://www.youtube.com/watch?v=puZPWiF3KeU",
    },
    { title: "ליל כלולות", artist: "ליאור מיארה", source: "https://www.youtube.com/watch?v=Yc1BtovMlAI" },
    { title: "אישה", artist: "משה פרץ", source: "https://www.youtube.com/watch?v=mSrhLhQ9DRg" },
    { title: "קחי אותי אלייך", artist: "משה פרץ", source: "https://www.youtube.com/watch?v=LGiMY8nb-fM" },
    {
      title: "נשבע לך",
      artist: "משה פרץ",
      note: "לא \"נשבע\" של חיים משה",
      source: "https://www.youtube.com/watch?v=aHmkpyJCtWg",
    },
    { title: "ואולי", artist: "משה פרץ", source: "https://www.youtube.com/watch?v=P7wseUfayn0" },
    { title: "את אשתי", artist: "דודו אהרון", source: "https://www.youtube.com/watch?v=lm41OGvqmP0" },
    { title: "עד סוף העולם", artist: "חיים משה ויואב יצחק", source: "https://www.youtube.com/watch?v=lnVq29vA_Ko" },
    {
      title: "אהבת חיי",
      artist: "ארז לב ארי",
      note: "השיר המוכר בביצוע של חיים משה",
      source: "https://www.youtube.com/watch?v=rSzSW5H2tqY",
    },
    {
      title: "להינשא הלילה",
      artist: "עומר אדם",
      note: "המקור של יניב בן משיח, מ-2007",
      source: "https://www.youtube.com/watch?v=McQh8KURk_E",
    },
    { title: "היום הזה", artist: "עמיר בניון", source: "https://www.youtube.com/watch?v=RKYcxx9uVSM" },
    {
      title: "ניצחת איתי הכל",
      artist: "עמיר בניון",
      note: "יש גם הגרסה של דיקלה",
      source: "https://www.youtube.com/watch?v=pRQX6Xp2B48",
    },
    { title: "בריאת עולם", artist: "מאור אדרי", source: "https://www.youtube.com/watch?v=37a0IrfJTDw" },
    { title: "ואז תבואי", artist: "הראל מויאל", source: "https://www.youtube.com/watch?v=32oVRcayvSU" },
    { title: "עד שמצאתי אותך", artist: "מושיק עפיה", source: "https://www.youtube.com/watch?v=Hpz15mnv4RQ" },
    {
      title: "הפרח בגני",
      artist: "עידן עמדי",
      note: "בהופעה, 2023. השיר של זוהר ארגוב",
      source: "https://www.youtube.com/watch?v=qPvJEN5lH50",
    },
    { title: "אחד למיליון", artist: "ליאור נרקיס ונרקיס", source: "https://www.youtube.com/watch?v=u-9b-EMSLCY" },
    {
      title: "את לא יודעת כמה שאני אוהב אותך",
      artist: "אודיה",
      source: "https://www.youtube.com/watch?v=J-q28gVKEcA",
    },
    { title: "כוכבים", artist: "שילה בן סעדון", source: "https://www.youtube.com/watch?v=sCBUBR3mZAM" },
    { title: "קרן שמש", artist: "בניה ברבי", source: "https://www.youtube.com/watch?v=n5illsgvqKA" },
  ],
};

export const CHUPPAH_RELIGIOUS_SONGS: SongList = {
  id: "religious",
  songs: [
    { title: "שערי חופה", artist: "בן סנוף", source: "https://www.youtube.com/watch?v=9ODqFOFC_UI" },
    { title: "אחותי כלה", artist: "אליקם בוטה", source: "https://www.youtube.com/watch?v=dhCiBxNDVmc" },
    { title: "מקודשת", artist: "איציק אורלב", source: "https://www.youtube.com/watch?v=eNTYY_AZILM" },
    { title: "ברכת כלה", artist: "רינת בר", source: "https://www.youtube.com/watch?v=8o6_ZX0GP9s" },
    { title: "בראשית עולם", artist: "שלומי שבת", source: "https://www.youtube.com/watch?v=GYLU9leTAjE" },
    { title: "אם אשכחך ירושלים", artist: "יוסי אזולאי", source: "https://www.youtube.com/watch?v=gyEAfSGCTjk" },
    { title: "אנא בכוח", artist: "יוסי אזולאי", source: "https://www.youtube.com/watch?v=0NCJzA39qbA" },
    { title: "שיר למעלות", artist: "משה פרץ", source: "https://www.youtube.com/watch?v=TKh6UaBW7tE" },
    {
      title: "תפילה",
      artist: "גד אלבז",
      note: "ברכת הכוהנים",
      source: "https://www.youtube.com/watch?v=386iXHuzLEc",
    },
    { title: "אשת חיל", artist: "יעקב שוואקי", source: "https://www.youtube.com/watch?v=HRMyNfHSf5c" },
    {
      title: "ישימך אלוקים כאפרים וכמנשה",
      artist: "יעקב שוואקי",
      source: "https://www.youtube.com/watch?v=yQUc9rwewUA",
    },
    {
      title: "עוד ישמע",
      artist: "ישי ריבו",
      note: "גרסת החופה, 2025",
      source: "https://www.youtube.com/watch?v=u2FzBma7eIA",
    },
    { title: "תוכו רצוף אהבה", artist: "ישי ריבו", source: "https://www.youtube.com/watch?v=fQRgX3ivUKU" },
    { title: "סך הכל", artist: "יונתן רזאל", source: "https://www.youtube.com/watch?v=2NSWJzPhGrQ" },
    { title: "לב לבן", artist: "שולי רנד", source: "https://www.youtube.com/watch?v=c_rx1efu52w" },
  ],
};

export const CHUPPAH_QUIET_SONGS: SongList = {
  id: "quiet",
  songs: [
    { title: "פתחי לי את דלתך", artist: "אהוד בנאי וברי סחרוף", source: "https://www.youtube.com/watch?v=bMz8SBKg3HQ" },
    { title: "היום", artist: "אהוד בנאי", source: "https://www.youtube.com/watch?v=SV0vMu1tY2M" },
    { title: "אבל את", artist: "מאיר בנאי ואביתר בנאי", source: "https://www.youtube.com/watch?v=7VJ4piwmauA" },
    { title: "יפה כלבנה", artist: "אביתר בנאי", source: "https://www.youtube.com/watch?v=hwHPkNl-cxo" },
    { title: "אהבת נעורי", artist: "שלום חנוך", source: "https://www.youtube.com/watch?v=5zd_U6X0oEI" },
    { title: "גיטרה וכינור", artist: "אריק איינשטיין ושלום חנוך", source: "https://www.youtube.com/watch?v=klcPfnVuM7k" },
    { title: "אהבה ממבט ראשון", artist: "אריק איינשטיין", source: "https://www.youtube.com/watch?v=e6YRMd6-q78" },
    { title: "ברית עולם", artist: "מתי כספי", source: "https://www.youtube.com/watch?v=1mieEeD0Kfk" },
    { title: "ואיך שלא", artist: "מוש בן ארי", source: "https://www.youtube.com/watch?v=TeglTmk4Nhw" },
    { title: "יד ביד", artist: "עפרה חזה", source: "https://www.youtube.com/watch?v=fbB7z6UKq1g" },
    { title: "בא להציע את ליבי", artist: "פבלו רוזנברג", source: "https://www.youtube.com/watch?v=woq5KsyZszA" },
    { title: "יקירתי", artist: "אסף אמדורסקי", source: "https://www.youtube.com/watch?v=ymde117FMAA" },
    { title: "את החלום", artist: "אדי בטלר", source: "https://www.youtube.com/watch?v=SLdEvJK6k0U" },
    { title: "כשאת נוגעת בי", artist: "בעז שרעבי", source: "https://www.youtube.com/watch?v=UGSfr056MgE" },
    { title: "זכיתי לאהוב", artist: "עברי לידר", source: "https://www.youtube.com/watch?v=G2Mx2kYX4jw" },
    {
      title: "כל יום מחדש",
      artist: "הפרויקט של עידן רייכל עם גידי גוב",
      source: "https://www.youtube.com/watch?v=yHiblZ6N1wA",
    },
    { title: "שלווה בארמונותייך", artist: "רביד פלוטניק", source: "https://www.youtube.com/watch?v=4sSYkwkDGnk" },
  ],
};

export const CHUPPAH_FOREIGN_SONGS: SongList = {
  id: "foreign",
  songs: [
    { title: "Until I Found You", artist: "Stephen Sanchez", source: "https://www.youtube.com/watch?v=GxldQ9eX2wo" },
    { title: "Die With A Smile", artist: "Lady Gaga & Bruno Mars", source: "https://www.youtube.com/watch?v=kPa7bsKwL-c" },
    { title: "Ordinary", artist: "Alex Warren", source: "https://www.youtube.com/watch?v=u2ah9tWTkmk" },
    { title: "A Thousand Years", artist: "Christina Perri", source: "https://www.youtube.com/watch?v=rtOvBOTyX00" },
    {
      title: "You Are The Reason (Duet Version)",
      artist: "Calum Scott & Leona Lewis",
      source: "https://www.youtube.com/watch?v=ByfFurjQDb0",
    },
    { title: "Can't Help Falling in Love", artist: "Elvis Presley", source: "https://www.youtube.com/watch?v=vGJTaP6anOU" },
    { title: "Can't Take My Eyes Off You", artist: "Frankie Valli", source: "https://www.youtube.com/watch?v=J36z7AnhvOM" },
    { title: "Beyond", artist: "Leon Bridges", source: "https://www.youtube.com/watch?v=ELPOCJvDz3w" },
    {
      title: "Innerbloom",
      artist: "RÜFÜS DU SOL",
      note: "השיר ארוך, כמעט עשר דקות, ולכן מכינים לו גרסה קצרה לכניסה",
      source: "https://www.youtube.com/watch?v=Tx9zMFodNtA",
    },
    {
      title: "L'Amour Toujours (I'll Fly with You)",
      artist: "Gigi D'Agostino",
      source: "https://www.youtube.com/watch?v=w15oWDh02K4",
    },
  ],
};

/** "3 שכבר נמאס" (D100, 4.4). בסלואו הם נשארים (D112). */
export const CHUPPAH_OVERPLAYED_SONGS: SongList = {
  id: "overplayed",
  songs: [
    { title: "נשבע", artist: "חיים משה", source: "https://www.youtube.com/watch?v=yt5puIaWvzo" },
    { title: "יש לך", artist: "שלומי שבת", source: "https://www.youtube.com/watch?v=J2yMP7sgu9I" },
    { title: "בואי בשלום", artist: "יעקב שוואקי", source: "https://www.youtube.com/watch?v=dRQUsaKVIyg" },
  ],
};

/** הרשימה של מה שנמאס נשארת אחרונה: הטסט בודק שאף שיר ממנה לא מומלץ ברשימות האחרות. */
export const CHUPPAH_SONG_LISTS = [
  CHUPPAH_EMOTIONAL_SONGS,
  CHUPPAH_MIZRAHI_SONGS,
  CHUPPAH_RELIGIOUS_SONGS,
  CHUPPAH_QUIET_SONGS,
  CHUPPAH_FOREIGN_SONGS,
  CHUPPAH_OVERPLAYED_SONGS,
] as const;

/** שירים שהבעלים הוציא (4.10.2026 מהסלואו, 12.10.2026 גם מהחופה). */
export const CHUPPAH_EXCLUDED_TITLES = ["היא לא דומה", "האחת שלי"] as const;
