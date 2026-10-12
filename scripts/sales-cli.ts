/**
 * sales - סוכן המכירות בטרמינל, בשביל הסקיל /sales של Claude Code במק
 * (החלטת הבעלים 12.10.2026, סוכן מכירות).
 *
 * אותו מנוע כמו /admin/sales (lib/sales/agent-tools.ts), ולכן כל מספר כאן זהה
 * לאתר. אין כאן אף מחיר כתוב.
 *
 *   npm run -s sales -- search <טקסט>
 *   npm run -s sales -- card <id>
 *   npm run -s sales -- quote <id> [--addons a,b] [--participants N] [--region center|north_south|eilat_golan|north|south]
 *                                  [--attractions N] [--activations N]
 *   npm run -s sales -- paste < הודעה.txt
 *   npm run -s sales -- morning-preview <id> ...אותם דגלים... [--client "שם"] [--pdf-dir /tmp]
 *   npm run -s sales -- morning-json <id> ...אותם דגלים... [--client "שם"] --out <קובץ.json>
 *   --json   פלט JSON במקום טקסט
 *
 * מורנינג: morning-preview קורא רק ל-/account/token ול-/documents/preview, והמפתחות
 * לא מודפסים לעולם. morning-json רק כותב קובץ. יצירת מסמך אמיתי היא רק בסקריפט של
 * הבעלים (green-invoice-export.py), אחרי "צור במורנינג" מפורש.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  getServiceDetails,
  pasteToQuote,
  priceHash,
  quoteService,
  SalesToolError,
  searchServices,
  type QuoteToolResult,
} from "../lib/sales/agent-tools";
import { assertMorningPathAllowed, buildMorningQuoteDocument, type MorningDocument } from "../lib/sales/morning-document";

const MORNING_API = "https://api.greeninvoice.co.il/api/v1";
const MORNING_KEY_PATH = "/Users/studio/Documents/yakircohen-ai-local/data/green-invoice.key.json";

/* ─── ארגומנטים ─── */

type Flags = Record<string, string | true>;

function parseArgs(argv: string[]): { positional: string[]; flags: Flags } {
  const positional: string[] = [];
  const flags: Flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const [key, inline] = arg.slice(2).split("=", 2);
      if (inline !== undefined) flags[key] = inline;
      else if (argv[i + 1] !== undefined && !argv[i + 1].startsWith("--")) flags[key] = argv[++i];
      else flags[key] = true;
    } else positional.push(arg);
  }
  return { positional, flags };
}

function intFlag(flags: Flags, key: string): number | null {
  const v = flags[key];
  if (v === undefined || v === true) return null;
  const n = Number(v);
  if (!Number.isInteger(n)) throw new SalesToolError(`--${key} צריך מספר שלם`);
  return n;
}

function strFlag(flags: Flags, key: string): string | null {
  const v = flags[key];
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function quoteFromArgs(positional: string[], flags: Flags): QuoteToolResult {
  const id = positional[1];
  if (!id) throw new SalesToolError("חסר מזהה שירות. מחפשים קודם: search <טקסט>");
  return quoteService({
    id,
    addonIds: (strFlag(flags, "addons") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    participants: intFlag(flags, "participants"),
    region: strFlag(flags, "region"),
    attractionsCount: intFlag(flags, "attractions"),
    activations: intFlag(flags, "activations"),
  });
}

/* ─── פלט ─── */

const nis = (n: number) => `${n.toLocaleString("he-IL")} ₪`;

function printQuote(q: QuoteToolResult): void {
  console.log(`${q.title} (${q.id})`);
  console.log("\nשורות (לפני מע״מ):");
  for (const l of q.lines) console.log(`  ${l.label}${l.qty > 1 ? ` ×${l.qty}` : ""}: ${nis(l.qty * l.unitExVat)} [${l.id}]`);
  console.log(`\nסה״כ: ${nis(q.totalInclVat)} כולל מע״מ (${nis(q.totalExVat)} + מע״מ)${q.priceFrom ? " - מחיר התחלה" : ""}`);
  console.log("\nהודעה ללקוח:\n" + q.message);
  if (q.confirmLine) console.log("\n" + q.confirmLine);
  console.log("\nמורנינג (כולל מע״מ, כמות 1):");
  for (const l of q.morningInclLines) console.log(`  ${l.label}: ${nis(l.amountInclVat)}`);
  if (q.warnings.length) console.log("\nאזהרות:\n" + q.warnings.map((w) => `  ${w}`).join("\n"));
  console.log(`\n${[q.id, ...q.addonIds].join("+")} · סה״כ ${nis(q.totalInclVat)} · מחירון ${q.priceHash}`);
}

function output(json: boolean, data: unknown, pretty: () => void): void {
  if (json) console.log(JSON.stringify(data, null, 2));
  else pretty();
}

/* ─── מורנינג ─── */

function documentFor(q: QuoteToolResult, flags: Flags): MorningDocument {
  return buildMorningQuoteDocument({
    title: q.title,
    lines: q.morningInclLines,
    totalInclVat: q.totalInclVat,
    clientName: strFlag(flags, "client"),
    priceHash: q.priceHash,
  });
}

/* הקריאה היחידה לרשת. כל נתיב עובר את הרשימה הלבנה קודם */
async function morningPost(path: string, body: unknown, token?: string): Promise<Response> {
  const allowed = assertMorningPathAllowed(path);
  return fetch(MORNING_API + allowed, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, application/pdf",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

function loadMorningKeys(): { id: string; secret: string } {
  if (!existsSync(MORNING_KEY_PATH)) throw new SalesToolError(`אין קובץ מפתחות: ${MORNING_KEY_PATH}`);
  const data = JSON.parse(readFileSync(MORNING_KEY_PATH, "utf8")) as { id?: string; secret?: string };
  if (!data.id || !data.secret || data.id.includes("YOUR_")) throw new SalesToolError("קובץ המפתחות ריק");
  return { id: data.id, secret: data.secret };
}

/* "סה"כ לתשלום" מתוך ה-PDF, עם pypdf אם מותקן. רץ מתיקייה זמנית (בלי קבצי
   פייתון של הריפו בנתיב), ו-pypdf מותקן ב-user site, ולכן בלי -I */
function totalFromPdf(pdfPath: string): number | null {
  let text = "";
  try {
    text = execFileSync(
      "python3",
      ["-E", "-c", "import sys,pypdf;print('\\n'.join((p.extract_text() or '') for p in pypdf.PdfReader(sys.argv[1]).pages))", pdfPath],
      { encoding: "utf8", cwd: tmpdir(), stdio: ["ignore", "pipe", "ignore"], timeout: 20_000 },
    );
  } catch {
    return null;
  }
  /* בתצוגה של מורנינג: "₪2,063.00סה"כ לתשלום", המספר באותה שורה */
  for (const line of text.split("\n")) {
    if (!/לתשלום|םולשתל/.test(line)) continue;
    const nums = (line.match(/\d[\d,]*(?:\.\d{1,2})?/g) ?? []).map((n) => Number(n.replace(/,/g, ""))).filter((n) => n > 0);
    if (nums.length) return Math.max(...nums);
  }
  return null;
}

async function morningPreview(q: QuoteToolResult, flags: Flags, json: boolean): Promise<void> {
  const doc = documentFor(q, flags);
  const keys = loadMorningKeys();
  const tokenRes = await morningPost("/account/token", { id: keys.id, secret: keys.secret });
  const tokenBody = (await tokenRes.json().catch(() => ({}))) as { token?: string; access_token?: string };
  const token = tokenBody.token ?? tokenBody.access_token;
  if (!tokenRes.ok || !token) throw new SalesToolError(`מורנינג לא החזיר טוקן (HTTP ${tokenRes.status})`);

  const res = await morningPost("/documents/preview", doc, token);
  if (!res.ok) {
    const err = (await res.text()).slice(0, 300);
    throw new SalesToolError(`preview נכשל (HTTP ${res.status}): ${err}`);
  }
  let pdf: Buffer;
  if ((res.headers.get("content-type") ?? "").includes("pdf")) {
    pdf = Buffer.from(await res.arrayBuffer());
  } else {
    const body = (await res.json()) as { file?: string };
    if (!body.file) throw new SalesToolError(`preview החזיר תשובה בלי קובץ. שדות: ${Object.keys(body).join(", ")}`);
    pdf = Buffer.from(body.file, "base64");
  }
  const dir = resolve(strFlag(flags, "pdf-dir") ?? tmpdir());
  mkdirSync(dir, { recursive: true });
  const pdfPath = join(dir, `morning-preview-${q.id}-${Date.now()}.pdf`);
  writeFileSync(pdfPath, pdf);
  const pdfTotal = totalFromPdf(pdfPath);
  const site = Math.round(q.totalInclVat);
  const result = {
    pdf: pdfPath,
    siteTotal: site,
    pdfTotal,
    match: pdfTotal == null ? null : pdfTotal === site,
    lines: doc.income,
    priceHash: q.priceHash,
  };
  output(json, result, () => {
    console.log(`PDF: ${pdfPath}`);
    console.log(`סה״כ באתר: ${nis(site)}`);
    console.log(
      pdfTotal == null
        ? "סה״כ לתשלום ב-PDF: לא חולץ אוטומטית, פותחים את הקובץ ובודקים"
        : `סה״כ לתשלום ב-PDF: ${nis(pdfTotal)} ${pdfTotal === site ? "(זהה לאתר)" : "(שונה מהאתר. לא שולחים)"}`,
    );
    console.log("זו תצוגה מקדימה בלבד. שום מסמך לא נוצר במורנינג.");
  });
  if (pdfTotal != null && pdfTotal !== site) process.exitCode = 2;
}

/* ─── ראשי ─── */

const USAGE = `שימוש: npm run -s sales -- <search|card|quote|paste|morning-preview|morning-json> ... [--json]`;

async function main(): Promise<void> {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const json = flags.json === true;
  const command = positional[0];
  switch (command) {
    case "search": {
      const query = positional.slice(1).join(" ");
      const hits = searchServices(query);
      output(json, { query, results: hits, priceHash: priceHash() }, () => {
        if (!hits.length) console.log("לא נמצא שירות. מנסים מילה אחת, למשל שיר או DJ.");
        for (const h of hits) console.log(`${h.id}\t${h.title}\t${h.priceLine}`);
      });
      return;
    }
    case "card": {
      const id = positional[1];
      if (!id) throw new SalesToolError("חסר מזהה שירות");
      const d = getServiceDetails(id);
      output(json, d, () => {
        console.log(`${d.title} (${d.id})\nבסיס: ${d.priceLine}`);
        if (d.included?.length) console.log("כלול:\n" + d.included.map((x) => `  ${x}`).join("\n"));
        if (d.excluded?.length) console.log("לא כלול:\n" + d.excluded.map((x) => `  ${x}`).join("\n"));
        if (d.addons.length) console.log("שדרוגים:\n" + d.addons.map((a) => `  ${a.id}\t${a.label}\t${a.priceLine}${a.requires ? `\t(רק עם ${a.requires})` : ""}`).join("\n"));
        if (d.participants) console.log(`${d.participants.noun}: ${d.participants.min} עד ${d.participants.max}, ${d.participants.included} כלולים`);
        if (d.regions) console.log("אזורים: " + d.regions.map((r) => `${r.id} (${r.label})`).join(", "));
        if (d.attractions) console.log(`אטרקציות: ${d.attractions.min} עד ${d.attractions.max}`);
        if (d.confirmLine) console.log(d.confirmLine);
        console.log(`מחירון ${priceHash()}`);
      });
      return;
    }
    case "quote": {
      const q = quoteFromArgs(positional, flags);
      output(json, q, () => printQuote(q));
      return;
    }
    case "paste": {
      const text = readFileSync(0, "utf8");
      if (!text.trim()) throw new SalesToolError("לא הגיעה הודעה ב-stdin");
      const result = pasteToQuote(text);
      output(json, result, () => {
        if (!result.match) {
          console.log("לא זוהה שירות בהודעה. מחפשים: search <טקסט>");
          return;
        }
        console.log(`זוהה: ${result.match.title} (${result.match.id}), לפי ${result.match.via}`);
        if (result.code) console.log(`קוד פנייה: ${result.code}`);
        console.log("");
        if (result.quote) printQuote(result.quote);
      });
      return;
    }
    case "morning-preview": {
      await morningPreview(quoteFromArgs(positional, flags), flags, json);
      return;
    }
    case "morning-json": {
      const out = strFlag(flags, "out");
      if (!out) throw new SalesToolError("חסר --out <קובץ.json>");
      const q = quoteFromArgs(positional, flags);
      const doc = documentFor(q, flags);
      const path = resolve(out);
      writeFileSync(path, JSON.stringify(doc, null, 2) + "\n", "utf8");
      output(json, { out: path, totalInclVat: Math.round(q.totalInclVat), document: doc }, () => {
        console.log(`נכתב: ${path}`);
        console.log(`סה״כ ${nis(Math.round(q.totalInclVat))} כולל מע״מ, ${doc.income.length} שורות. לא הועלה למורנינג.`);
        console.log(`ליצירה אמיתית, רק אחרי "צור במורנינג":\n  python3 /Users/studio/Documents/yakircohen-ai-local/scripts/green-invoice-export.py "${path}"`);
      });
      return;
    }
    default:
      console.error(USAGE);
      process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof SalesToolError ? error.message : `שגיאה: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
