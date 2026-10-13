/**
 * מחריג עמוד שלם מכניסת המקטעים בגלילה (site-reveal ב-app/globals.css).
 * לעמודי המרה: הזמנה, צור קשר, מחירים וחבילות. התוכן שם צריך להיות קריא מיד,
 * בלי שום עמעום. אלמנט ריק ומוסתר, בלי טקסט, ולכן אין לו השפעה על סורקים.
 * להחרגת מקטע בודד: data-no-reveal על ה-section או על עוטף שלו.
 */
export default function NoRevealPage() {
  return <span hidden data-no-reveal-page="" />;
}
