import assert from "node:assert/strict";
import { test } from "node:test";
import { BLOG_POSTS, type BlogPost } from "./blog";

/* BLOG_POSTS מוגדר as const, ולכן כל פוסט מצומצם לצורה המילולית שלו
   ושדה אופציונלי שלא מולא לא קיים בטיפוס. קוראים דרך BlogPost. */
const POSTS = BLOG_POSTS as readonly BlogPost[];

/*
 * תאריך עדכון שאי אפשר לסמוך עליו גרוע מאין תאריך עדכון.
 *
 * מה שהיה: הסכמה הצהירה dateModified ששווה לתאריך הפרסום בכל 87 הפוסטים,
 * כלומר האתר אמר לגוגל "עודכן" על עדכון שלא קרה.
 *
 * למה השדה ידני: כל 87 הפוסטים בקובץ אחד, ו-git עוקב אחרי הקובץ. גזירה
 * אוטומטית הייתה נותנת לכולם את תאריך הקומיט האחרון שנגע בקובץ.
 */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

test("תאריך עדכון, כשהוא קיים, תקין והגיוני", () => {
  assert.ok(POSTS.length > 0, "אין פוסטים, הבדיקה חסרת ערך");

  const problems: string[] = [];
  /* גבול עליון רחב במקום "היום", כדי שהבדיקה לא תיכשל מעצם חלוף הזמן */
  const upperBound = new Date("2100-01-01").getTime();

  for (const post of POSTS) {
    const { datePublished, dateModified } = post.seo;

    if (!ISO_DATE.test(datePublished)) {
      problems.push(`${post.slug}: datePublished "${datePublished}" אינו YYYY-MM-DD`);
    }
    if (dateModified === undefined) continue;

    if (!ISO_DATE.test(dateModified)) {
      problems.push(`${post.slug}: dateModified "${dateModified}" אינו YYYY-MM-DD`);
      continue;
    }
    const published = new Date(datePublished).getTime();
    const modified = new Date(dateModified).getTime();
    if (Number.isNaN(modified)) {
      problems.push(`${post.slug}: dateModified "${dateModified}" אינו תאריך אמיתי`);
    } else if (modified < published) {
      problems.push(
        `${post.slug}: עודכן (${dateModified}) לפני שפורסם (${datePublished})`,
      );
    } else if (modified > upperBound) {
      problems.push(`${post.slug}: dateModified "${dateModified}" בעתיד הרחוק`);
    }
  }

  assert.deepEqual(problems, [], `בעיות בתאריכי הבלוג:\n${problems.join("\n")}`);
});

test("אף פוסט לא מצהיר עדכון שזהה לתאריך הפרסום", () => {
  const same = POSTS.filter(
    (p) => p.seo.dateModified !== undefined && p.seo.dateModified === p.seo.datePublished,
  ).map((p) => p.slug);

  assert.deepEqual(
    same,
    [],
    "dateModified ששווה ל-datePublished אינו אות טריות, הוא רעש.\n" +
      `להסיר את השדה מהפוסטים האלה:\n${same.join("\n")}`,
  );
});
