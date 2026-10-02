/**
 * כל ערך category בפוסט חייב להשתייך לדלי סינון ב-blog-categories.ts.
 * הקובץ הזה additive בלבד, ולכן קטגוריה חדשה בפוסט לא שוברת כלום, היא פשוט
 * הופכת את הפוסט לבלתי ניתן לסינון בעמוד הבלוג. כישלון שקט, ולכן אודיט.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const blog = fs.readFileSync(path.join(ROOT, "lib/data/blog.ts"), "utf8");
const norm = fs.readFileSync(path.join(ROOT, "lib/data/blog-categories.ts"), "utf8");

const counts = new Map();
for (const m of blog.matchAll(/^\s*category:\s*"([^"]+)"/gm)) {
  counts.set(m[1], (counts.get(m[1]) ?? 0) + 1);
}

const buckets = [...norm.matchAll(/matches:\s*\[([\s\S]*?)\]/g)].flatMap((m) =>
  [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]),
);
const bucketSet = new Set(buckets);

const orphans = [...counts].filter(([c]) => !bucketSet.has(c));

if (orphans.length) {
  const posts = orphans.reduce((n, [, c]) => n + c, 0);
  console.error(
    `audit:blog-categories -- ${orphans.length} קטגוריות ללא דלי סינון (${posts} פוסטים לא ניתנים לסינון):`,
  );
  for (const [c, n] of orphans.sort((a, b) => b[1] - a[1])) {
    console.error(`  ${n}x  ${c}`);
  }
  process.exit(1);
}

/**
 * מרכזי הידע: כל סלאג ברשימה חייב להתקיים ולהשתייך לדלי הנכון, וכל פוסט
 * בדלי חייב להופיע באחת הקבוצות. בלי זה פוסט חדש נופל בין הכיסאות: הוא
 * קיים בבלוג אבל לא מקושר משום מקום במרכז הידע, וזו בדיוק הבעיה שהמרכז
 * נבנה כדי לפתור.
 */
const hubsPath = "lib/data/blog-knowledge-hubs.ts";
if (fs.existsSync(hubsPath)) {
  const hubs = fs.readFileSync(hubsPath, "utf8");
  const allSlugs = new Set(
    [...blog.matchAll(/^\s{4}slug:\s*"([a-z0-9-]+)"/gm)].map((m) => m[1]),
  );

  const bucketOf = new Map();
  for (const m of norm.matchAll(
    /id:\s*"([a-z]+)",[\s\S]*?matches:\s*\[([\s\S]*?)\]/g,
  )) {
    for (const c of m[2].matchAll(/"([^"]+)"/g)) bucketOf.set(c[1], m[1]);
  }
  const postBucket = new Map();
  for (const chunk of blog.split(/\n {4}slug: "/).slice(1)) {
    const slug = chunk.slice(0, chunk.indexOf('"'));
    const cat = chunk.match(/\n {4}category: "([^"]+)"/);
    if (cat) postBucket.set(slug, bucketOf.get(cat[1]));
  }

  const problems = [];
  for (const hub of hubs.matchAll(
    /categoryId:\s*"([a-z]+)",[\s\S]*?groups:\s*\[([\s\S]*?)\n  \],/g,
  )) {
    const [, categoryId, groupsRaw] = hub;
    const listed = [...groupsRaw.matchAll(/slugs:\s*\[([\s\S]*?)\]/g)].flatMap(
      (g) => [...g[1].matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]),
    );
    const seen = new Set();
    for (const slug of listed) {
      if (seen.has(slug)) problems.push(`${categoryId}: ${slug} מופיע פעמיים`);
      seen.add(slug);
      if (!allSlugs.has(slug)) {
        problems.push(`${categoryId}: ${slug} לא קיים בבלוג`);
      } else if (postBucket.get(slug) !== categoryId) {
        problems.push(
          `${categoryId}: ${slug} שייך לדלי ${postBucket.get(slug) ?? "לא ידוע"}`,
        );
      }
    }
    for (const [slug, bucket] of postBucket) {
      if (bucket === categoryId && !seen.has(slug)) {
        problems.push(`${categoryId}: ${slug} בדלי אבל לא באף קבוצה`);
      }
    }
  }

  if (problems.length) {
    console.error(`\naudit:blog-categories -- מרכזי הידע לא מסונכרנים:\n`);
    for (const x of problems) console.error(`  ✗ ${x}`);
    console.error(
      `\nכל פוסט בדלי חייב להופיע בקבוצה ב-${hubsPath}. פוסט חדש מצטרף לקבוצה המתאימה.\n`,
    );
    process.exit(1);
  }
}

console.log(
  `audit:blog-categories OK -- ${counts.size} קטגוריות, כולן ממופות ל-${new Set(buckets).size} ערכי דלי`,
);
