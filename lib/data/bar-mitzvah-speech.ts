/**
 * טופס העזר של מדריך הדרשה (/blog/bar-mitzvah-speech).
 *
 * החלטת הבעלים D100 (11.10.2026): הטופס זמין להורדה ישירה מהעמוד, ובוואטסאפ
 * נשארת השורה "רוצים שנעבור על הדרשה שכתבתם?". עד אז הטופס ניתן רק בוואטסאפ.
 *
 * הרשימה בעמוד והרשימה ב-PDF יוצאות מאותו מקור, ולכן אי אפשר שהן יתפצלו.
 * ה-PDF נוצר ב-scripts/generate-speech-form-pdf.ts, באותה שיטה כמו
 * scripts/generate-legacy-questions-pdf.ts. מריצים אחרי כל שינוי בשדות:
 *
 *   npx tsx scripts/generate-speech-form-pdf.ts
 */

export type SpeechFormField = {
  /** הכותרת המודגשת של השורה, עם סימן הפיסוק שלה כפי שהוא מופיע בעמוד */
  label: string;
  /** ההסבר שאחרי הכותרת. ריק כשאין */
  hint: string;
};

export const SPEECH_FORM_FIELDS: readonly SpeechFormField[] = [
  { label: "הערך המרכזי.", hint: "למשל אחריות, כבוד או נתינה." },
  { label: "פסוק או קטע מהפרשה,", hint: "ואיך הוא מתחבר לערך." },
  { label: "סיפור אישי.", hint: "זיכרון עם ההורים, התנדבות, או רגע שבו הרגשתם שגדלתם." },
  { label: "תודה מיוחדת.", hint: "למי?" },
  { label: "משפט סיום או ברכה.", hint: "" },
];

export const SPEECH_FORM_INTRO = "ממלאים חמש שורות, והדרשה כמעט כותבת את עצמה:";

/**
 * הקובץ להורדה. המאפיין נקרא path ולא href בכוונה: scripts/audit-links.mjs קורא
 * כל "href: /..." כקישור פנימי ומחפש לו page.tsx.
 * sizeBytes ו-pages נבדקים מול הקובץ בפועל ב-bar-mitzvah-speech.test.ts.
 */
export const SPEECH_FORM_PDF = {
  path: "/downloads/bar-mitzvah-speech-form.pdf",
  sizeBytes: 45732,
  pages: 1,
} as const;

function pagesLabel(pages: number): string {
  return pages === 1 ? "עמוד אחד" : `${pages} עמודים`;
}

/** "PDF, עמוד אחד, 40 KB", כמו ליד קובץ השאלות בעמוד ההקלטה למשפחה */
export function speechFormPdfSummary(): string {
  const kb = Math.max(1, Math.round(SPEECH_FORM_PDF.sizeBytes / 1024));
  return `PDF, ${pagesLabel(SPEECH_FORM_PDF.pages)}, ${kb} KB`;
}

/** הרשימה הממוספרת בעמוד. אותו HTML שהיה כתוב ידנית בפוסט עד 12.10.2026 */
export function speechFormListHtml(): string {
  const items = SPEECH_FORM_FIELDS.map(
    ({ label, hint }) => `<li><strong>${label}</strong>${hint ? ` ${hint}` : ""}</li>`,
  ).join("\n");
  return `<ol>\n${items}\n</ol>`;
}
