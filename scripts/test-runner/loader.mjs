/**
 * Resolve hook שמאפשר להריץ את חבילת הבדיקות בלי tsx.
 *
 * Node 22 מפשיט טיפוסים בעצמו (--experimental-strip-types), ולכן הדבר היחיד
 * ש-tsx נתן כאן הוא פתרון מודולים. כשה-node_modules מותקן על מערכת הפעלה אחרת
 * (קורה הרבה, הריפו מסונכרן ב-Dropbox בין מק לווינדוס) esbuild נשבר ו-tsx לא
 * רץ בכלל. ההוק הזה מחליף אותו:
 *   1. ממפה "@/x" לשורש הריפו ומוסיף סיומת .ts/.tsx או /index.ts
 *   2. מחזיר format: "json" לייבוא JSON, שאחרת דורש import attribute
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

function withExt(p) {
  if (/\.(ts|tsx|json|mjs|js)$/.test(p)) return p;
  for (const cand of [`${p}.ts`, `${p}.tsx`, path.join(p, "index.ts")]) {
    if (fs.existsSync(cand)) return cand;
  }
  return p;
}

export async function resolve(spec, ctx, next) {
  let target = null;
  if (spec.startsWith("@/")) {
    target = withExt(path.join(ROOT, spec.slice(2)));
  } else if (spec.startsWith(".") && ctx.parentURL?.startsWith("file://")) {
    const base = new URL(spec, ctx.parentURL);
    const resolved = withExt(base.pathname);
    if (resolved !== base.pathname) target = resolved;
  }

  const finalSpec = target ?? spec;
  const attrs = finalSpec.endsWith(".json")
    ? { ...ctx.importAttributes, type: "json" }
    : ctx.importAttributes;

  const result = await next(finalSpec, { ...ctx, importAttributes: attrs });
  if (finalSpec.endsWith(".json")) {
    return { ...result, format: "json", importAttributes: { type: "json" } };
  }
  return result;
}
