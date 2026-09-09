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

console.log(
  `audit:blog-categories OK -- ${counts.size} קטגוריות, כולן ממופות ל-${new Set(buckets).size} ערכי דלי`,
);
