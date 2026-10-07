/**
 * ציור אישור ההזמנה ושובר המתנה ב-Canvas 2D (תוכנית עמדת המכירות, סעיף 4).
 *
 * למה בדפדפן ולא ב-next/og: באתר החי /opengraph-image מציג את השם הפוך
 * ("תוקפה ןהכ ריקי"). כאן הגופן הוא Heebo שהאתר כבר טוען, והכיוון מנוהל ביד:
 * כל פסקה נשברת לשורות לפי מילים, ואחר כך כל שורה מחולקת לקטעים. עברית נכתבת
 * ב-rtl, וקטע לטיני או מספרי (קוד, טלפון, תאריך, כתובת אתר) נכתב כקטע ltr
 * נפרד, כדי ש-YC-A7K2 לא ייצא 2K7A-CY ו-15.10.2026 לא ייצא 2026.10.15.
 *
 * תמונה אחת, 1080 על 1350 (יחס 4:5 שוואטסאפ מציג בלי חיתוך), משמשת לשיתוף,
 * לשמירה ול-PDF. כך יש מקור ציור אחד בלבד.
 *
 * המודול מקבל VoucherData, שאין בו מחיר, ומצייר. את הגופן ואת הלוגו טוען
 * הרכיב (components/admin/VoucherCanvas.tsx), כי טעינה תלויה ב-document.
 */
import { SITE_NAME } from "@/lib/constants";
import type { VoucherData } from "@/lib/sales/voucher";

export const VOUCHER_WIDTH = 1080;
export const VOUCHER_HEIGHT = 1350;

/* גופן הגוף לא יורד מ-30 ברוחב 1080: בטלפון התמונה מוצגת ברוחב של כ-360
   נקודות, כלומר כ-10 נקודות לטקסט, וזה הגבול התחתון לקריאה נוחה */
const MIN_BODY = 30;
const BODY = 34;
const SIDE = 84;

export type VoucherTheme = {
  background: string;
  ink: string;
  soft: string;
  accent: string;
  title: string;
  hairline: string;
};

/* הזמנה: בהיר, פס אדום וקו זהב, הצבעים של האתר (app/globals.css) */
export const ORDER_THEME: VoucherTheme = {
  background: "#fafaf8",
  ink: "#1a1a1a",
  soft: "#5c5c5c",
  accent: "#d42b2b",
  title: "#1a1a1a",
  hairline: "#8a6f2e",
};

/* מתנה: כהה וזהב, בהשראת השובר שיקיר הכין ביד ב-5.10 */
export const GIFT_THEME: VoucherTheme = {
  background: "#0c0b0a",
  ink: "#e8dcc8",
  soft: "rgba(232, 220, 200, 0.74)",
  accent: "#c9a46c",
  title: "#e8c98a",
  hairline: "#c9a46c",
};

/** צבע הרקע של המסמך, גם לדף ההדפסה סביב התמונה */
export function voucherBackground(kind: VoucherData["kind"]): string {
  return kind === "gift" ? GIFT_THEME.background : ORDER_THEME.background;
}

/* שורת התיאור של העסק בראש אישור ההזמנה. בלי מספרים ובלי הבטחות */
const BRAND_TAGLINE = "אולפן הקלטות · פודקאסט · DJ ואטרקציות · מודיעין";

export type VoucherAssets = {
  /** שרשרת הגופנים המלאה, כמו ש-getComputedStyle מחזיר אותה. Heebo ראשון */
  fontFamily: string;
  /** הלוגו בשחור (לאישור ההזמנה) */
  logo: CanvasImageSource | null;
  /** הלוגו צבוע בזהב (לשובר המתנה) */
  logoGold: CanvasImageSource | null;
  /** רוחב חלקי גובה של הלוגו */
  logoAspect: number;
  /**
   * הלוגו נטען וגם הרסטר הצבוע שלו באמת מכיל דיו. בלי זה התמונה יוצאת בלי
   * לוגו, ולכן עמדת המכירות לא מאפשרת לשתף, לשמור או להדפיס (בדיקת הלוגו
   * 7.10.2026). הציור עצמו לא בודק את הדגל: מה שיש, מצויר
   */
  logoOk: boolean;
};

export type VoucherDrawOptions = {
  /** "המועד שוריין" מודגש בצבע מלא, "ממתין למקדמה" במסגרת בלבד */
  statusTone?: "pending" | "confirmed";
};

/* ─── כיוון: קטעי rtl ו-ltr ─── */

export type BidiRun = { text: string; ltr: boolean };

/* קטע ltr מתחיל ונגמר באות לטינית או בספרה. פיסוק בקצה (פסיק אחרי קוד) נשאר
   בצד העברי, ולכן מופיע בצד הנכון של הקוד */
const LTR_RUN = /[A-Za-z0-9](?:[A-Za-z0-9.:/@+_-]*[A-Za-z0-9])?/g;

/** מחלק טקסט לקטעים: לטינית ומספרים (ltr) וכל השאר (rtl), בסדר הלוגי */
export function splitBidiRuns(text: string): BidiRun[] {
  const runs: BidiRun[] = [];
  let last = 0;
  for (const match of text.matchAll(LTR_RUN)) {
    const start = match.index ?? 0;
    if (start > last) runs.push({ text: text.slice(last, start), ltr: false });
    runs.push({ text: match[0], ltr: true });
    last = start + match[0].length;
  }
  if (last < text.length) runs.push({ text: text.slice(last), ltr: false });
  return runs;
}

type TextStyle = { size: number; weight: number; color: string };
type Span = { text: string; style: TextStyle };
type Piece = { text: string; style: TextStyle };
type Word = { pieces: Piece[]; width: number; spaceAfter: number; spaceStyle: TextStyle };
type Line = { words: Word[]; width: number; size: number };
type Align = "right" | "center";
type Para = {
  spans: Span[];
  align: Align;
  gapBefore: number;
  lineHeight: number;
  /** 1 יורד ראשון כשאין מקום, 2 אחריו. בלי: תמיד מופיע */
  optional?: 1 | 2;
};
type Atom = { text: string; style: TextStyle; ltr: boolean; space: boolean; width: number };
type Chunk = { ltr: boolean; atoms: Atom[]; width: number };

const STRONG_RTL = /[֐-׿؀-ۿיִ-﷿ﹰ-﻿]/;
const HAS_LATIN = /[A-Za-z]/;
/* מפריד בין שדות. לא מתמזג לקטע לטיני גם כשמשני צדיו לטינית, כדי שטלפון
   ואתר בשורה אחת יישארו בסדר הקריאה מימין לשמאל */
const FIELD_SEPARATOR = "·";
const STICKY_NUMBER = /^\d{1,4}$/;

class Painter {
  private cache = new Map<string, number>();

  constructor(
    readonly ctx: CanvasRenderingContext2D,
    readonly family: string,
  ) {}

  font(style: TextStyle): string {
    return `${style.weight} ${style.size}px ${this.family}`;
  }

  measure(text: string, style: TextStyle): number {
    const font = this.font(style);
    const key = `${font}|${text}`;
    const hit = this.cache.get(key);
    if (hit != null) return hit;
    this.ctx.font = font;
    const width = this.ctx.measureText(text).width;
    this.cache.set(key, width);
    return width;
  }

  fill(text: string, style: TextStyle, rightX: number, baseline: number, ltr: boolean): void {
    const { ctx } = this;
    ctx.font = this.font(style);
    ctx.fillStyle = style.color;
    ctx.direction = ltr ? "ltr" : "rtl";
    ctx.textAlign = "right";
    ctx.fillText(text, rightX, baseline);
  }

  /* פסקה למילים. רווח הוא נקודת שבירה, ומילה יכולה להכיל כמה סגנונות
     (כותרת מודגשת שצמודה לערך בלי רווח) */
  words(spans: readonly Span[]): Word[] {
    const words: Word[] = [];
    let pieces: Piece[] = [];
    const flush = () => {
      if (pieces.length === 0) return;
      const last = pieces[pieces.length - 1].style;
      words.push({
        pieces,
        width: pieces.reduce((sum, p) => sum + this.measure(p.text, p.style), 0),
        spaceAfter: this.measure(" ", last),
        spaceStyle: last,
      });
      pieces = [];
    };
    for (const span of spans) {
      for (const part of span.text.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) flush();
        else pieces.push({ text: part, style: span.style });
      }
    }
    flush();
    return words;
  }

  lines(spans: readonly Span[], maxWidth: number): Line[] {
    /* מספר נדבק למילה שאחריו: "4 משתתפים" לא נשבר בין השורות */
    const units: Word[][] = [];
    for (const word of this.words(spans)) {
      const prevUnit = units[units.length - 1];
      const prev = prevUnit?.[prevUnit.length - 1];
      if (prev && STICKY_NUMBER.test(prev.pieces.map((p) => p.text).join(""))) prevUnit.push(word);
      else units.push([word]);
    }
    const unitWidth = (unit: Word[]) =>
      unit.reduce((sum, w, i) => sum + w.width + (i > 0 ? unit[i - 1].spaceAfter : 0), 0);

    const lines: Line[] = [];
    let current: Word[] = [];
    let width = 0;
    const push = () => {
      if (current.length === 0) return;
      const size = Math.max(...current.flatMap((w) => w.pieces.map((p) => p.style.size)));
      lines.push({ words: current, width, size });
    };
    for (const unit of units) {
      const w = unitWidth(unit);
      const extra = current.length ? current[current.length - 1].spaceAfter + w : w;
      if (current.length && width + extra > maxWidth) {
        push();
        current = [...unit];
        width = w;
      } else {
        current.push(...unit);
        width += extra;
      }
    }
    push();
    return lines;
  }

  private atoms(line: Line): Atom[] {
    const atoms: Atom[] = [];
    line.words.forEach((word, index) => {
      if (index > 0) {
        const prev = line.words[index - 1];
        atoms.push({ text: " ", style: prev.spaceStyle, ltr: false, space: true, width: prev.spaceAfter });
      }
      for (const piece of word.pieces) {
        for (const run of splitBidiRuns(piece.text)) {
          atoms.push({ ...run, style: piece.style, space: false, width: this.measure(run.text, piece.style) });
        }
      }
    });
    return atoms;
  }

  /*
   * הסדר החזותי של שורה בכיוון בסיס rtl, בקירוב של אלגוריתם ה-bidi: קטעים
   * בסדר הלוגי מימין לשמאל. קטע לטיני שאחריו רק רווחים ופיסוק ועוד קטע ltr
   * מתמזג איתו ("Pro Session, 90"), כמו בדפדפן, כדי שמילים באנגלית לא יתהפכו.
   * מספר שלפניו אין לטינית ("15.10.2026, 18:00") נשאר קטע נפרד.
   */
  chunks(line: Line): Chunk[] {
    const chunks: Chunk[] = [];
    let pending: Atom[] = [];
    const flushPending = () => {
      for (const atom of pending) chunks.push({ ltr: false, atoms: [atom], width: atom.width });
      pending = [];
    };
    for (const atom of this.atoms(line)) {
      if (atom.ltr) {
        const last = chunks[chunks.length - 1];
        const joins =
          pending.length > 0 &&
          last?.ltr === true &&
          last.atoms.some((a) => HAS_LATIN.test(a.text)) &&
          pending.every((a) => !a.text.includes(FIELD_SEPARATOR));
        if (joins && last) {
          last.atoms.push(...pending, atom);
          last.width += pending.reduce((sum, a) => sum + a.width, 0) + atom.width;
          pending = [];
        } else {
          flushPending();
          chunks.push({ ltr: true, atoms: [atom], width: atom.width });
        }
      } else if (atom.space || !STRONG_RTL.test(atom.text)) {
        pending.push(atom);
      } else {
        flushPending();
        chunks.push({ ltr: false, atoms: [atom], width: atom.width });
      }
    }
    flushPending();
    return chunks;
  }

  drawLine(line: Line, rightX: number, baseline: number): void {
    let x = rightX;
    for (const chunk of this.chunks(line)) {
      if (chunk.ltr) {
        let cursor = x - chunk.width;
        for (const atom of chunk.atoms) {
          cursor += atom.width;
          if (!atom.space) this.fill(atom.text, atom.style, cursor, baseline, true);
        }
      } else {
        const [atom] = chunk.atoms;
        if (!atom.space) this.fill(atom.text, atom.style, x, baseline, false);
      }
      x -= chunk.width;
    }
  }

  lineWidth(line: Line): number {
    return this.chunks(line).reduce((sum, c) => sum + c.width, 0);
  }

  /** שורה אחת בלי שבירה. ב-right ה-x הוא הקצה הימני, ב-center הוא מרכז השורה */
  single(spans: readonly Span[], x: number, baseline: number, align: Align = "right"): void {
    const line = this.lines(spans, Infinity)[0];
    if (!line) return;
    this.drawLine(line, align === "center" ? x + this.lineWidth(line) / 2 : x, baseline);
  }

  /* שורה אחת בלי שבירה, מוקטנת עד שהיא נכנסת ברוחב */
  fitSingle(text: string, style: TextStyle, maxWidth: number, minSize: number): TextStyle {
    let fitted = style;
    while (fitted.size > minSize && this.measure(text, fitted) > maxWidth) {
      fitted = { ...fitted, size: fitted.size - 1 };
    }
    return fitted;
  }
}

/* ─── פסקאות והתאמה לגובה ─── */

type Laid = { para: Para; lines: Line[]; gap: number };

function layout(p: Painter, paras: readonly Para[], width: number): { laid: Laid[]; height: number } {
  let height = 0;
  const laid = paras.map((para, index) => {
    const lines = p.lines(para.spans, width);
    const gap = index === 0 ? 0 : para.gapBefore;
    height += gap + lines.reduce((sum, l) => sum + l.size * para.lineHeight, 0);
    return { para, lines, gap };
  });
  return { laid, height };
}

function drawLaid(p: Painter, laid: readonly Laid[], top: number, left: number, width: number): void {
  let y = top;
  for (const item of laid) {
    y += item.gap;
    for (const line of item.lines) {
      const lineBox = line.size * item.para.lineHeight;
      /* קו הבסיס באמצע תיבת השורה, מתוקן לגובה האותיות העבריות (כ-0.7 מהגופן) */
      const baseline = y + lineBox / 2 + line.size * 0.35;
      const right =
        item.para.align === "center" ? left + width / 2 + p.lineWidth(line) / 2 : left + width;
      p.drawLine(line, right, baseline);
      y += lineBox;
    }
  }
}

const SCALES = [1, 0.95, 0.9, 0.85, 0.8] as const;

/*
 * קודם מקטינים (עד גופן גוף של 30), ורק אם עדיין אין מקום מורידים שדות
 * משניים: חניה ואז מה להביא. שניהם נשלחים גם בתשובה המהירה /מגיעים.
 */
function fitParas(
  p: Painter,
  build: (scale: number) => Para[],
  width: number,
  available: number,
): Laid[] {
  let last: Laid[] = [];
  for (const drop of [0, 1, 2]) {
    for (const scale of SCALES) {
      const paras = build(scale).filter((para) => !para.optional || para.optional > drop);
      const { laid, height } = layout(p, paras, width);
      last = laid;
      if (height <= available) return laid;
    }
  }
  return last;
}

function bodySize(scale: number): number {
  return Math.max(MIN_BODY, Math.round(BODY * scale));
}

/** "סיכמנו: X" ל-[כותרת, ערך], כדי שהכותרת תודגש */
function splitLabel(text: string): [string, string] | null {
  const index = text.indexOf(": ");
  if (index <= 0 || index > 24) return null;
  return [text.slice(0, index + 1), text.slice(index + 2)];
}

function labeled(label: string, value: string, labelStyle: TextStyle, valueStyle: TextStyle): Span[] {
  return [
    { text: `${label} `, style: labelStyle },
    { text: value, style: valueStyle },
  ];
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  const radius = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

function hairline(ctx: CanvasRenderingContext2D, color: string, x1: number, x2: number, y: number, width = 2): void {
  ctx.fillStyle = color;
  ctx.fillRect(x1, y - width / 2, x2 - x1, width);
}

/* ─── אישור הזמנה ─── */

function drawOrder(p: Painter, data: VoucherData, assets: VoucherAssets, options: VoucherDrawOptions): void {
  const { ctx } = p;
  const t = ORDER_THEME;
  const W = VOUCHER_WIDTH;
  const H = VOUCHER_HEIGHT;
  const contentWidth = W - SIDE * 2;
  const bar = 18;

  ctx.fillStyle = t.background;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = t.accent;
  ctx.fillRect(0, 0, W, bar);
  ctx.fillRect(0, H - bar, W, bar);

  /* כותרת העסק: לוגו מימין, שם ותיאור משמאלו */
  const logoH = 92;
  const logoW = logoH * assets.logoAspect;
  const headerTop = 60;
  if (assets.logo) ctx.drawImage(assets.logo, W - SIDE - logoW, headerTop, logoW, logoH);
  const brandRight = W - SIDE - (assets.logo ? logoW + 30 : 0);
  const brandWidth = brandRight - SIDE;
  const nameStyle = p.fitSingle(SITE_NAME, { size: 38, weight: 800, color: t.ink }, brandWidth, 28);
  const tagStyle = p.fitSingle(BRAND_TAGLINE, { size: MIN_BODY, weight: 400, color: t.soft }, brandWidth, 24);
  p.single([{ text: SITE_NAME, style: nameStyle }], brandRight, headerTop + 40);
  p.single([{ text: BRAND_TAGLINE, style: tagStyle }], brandRight, headerTop + 84);
  hairline(ctx, t.hairline, SIDE, W - SIDE, 186);

  /* שורת הכותרת: "אישור הזמנה" מימין, הסטטוס משמאל */
  const titleBaseline = 278;
  const titleStyle: TextStyle = { size: 70, weight: 800, color: t.title };
  p.single([{ text: data.title, style: titleStyle }], W - SIDE, titleBaseline);
  if (data.statusLabel) {
    const confirmed = options.statusTone === "confirmed";
    const chipStyle: TextStyle = { size: MIN_BODY, weight: 700, color: confirmed ? "#ffffff" : t.accent };
    const padX = 28;
    const chipH = 60;
    const chipW = p.measure(data.statusLabel, chipStyle) + padX * 2;
    const chipY = titleBaseline - 26 - chipH / 2;
    roundedRect(ctx, SIDE, chipY, chipW, chipH, chipH / 2);
    if (confirmed) {
      ctx.fillStyle = t.accent;
      ctx.fill();
    } else {
      ctx.lineWidth = 3;
      ctx.strokeStyle = t.accent;
      ctx.stroke();
    }
    p.fill(data.statusLabel, chipStyle, SIDE + chipW - padX, chipY + chipH / 2 + MIN_BODY * 0.35, false);
  }

  /* קוד ותאריך הנפקה */
  const metaSoft: TextStyle = { size: 32, weight: 400, color: t.soft };
  const metaCode: TextStyle = { size: 32, weight: 700, color: t.accent };
  p.single(
    [
      { text: "קוד: ", style: metaSoft },
      { text: data.code, style: metaCode },
      { text: ` · ${data.issuedText}`, style: metaSoft },
    ],
    W - SIDE,
    titleBaseline + 58,
  );

  /* תחתית: קו זהב, "אינו חשבונית", טלפון ואתר */
  const footerBaseline = H - bar - 40;
  const disclaimerBaseline = footerBaseline - 52;
  const footerRule = disclaimerBaseline - 50;
  hairline(ctx, t.hairline, SIDE, W - SIDE, footerRule);
  const disclaimerStyle = p.fitSingle(data.disclaimer, { size: MIN_BODY, weight: 400, color: t.soft }, contentWidth, 26);
  p.single([{ text: data.disclaimer, style: disclaimerStyle }], W - SIDE, disclaimerBaseline);
  p.single([{ text: data.footer, style: { size: 34, weight: 700, color: t.ink } }], W - SIDE, footerBaseline);

  const bodyTop = titleBaseline + 96;
  const bodyBottom = footerRule - 30;
  const laid = fitParas(
    p,
    (scale) => {
      const size = bodySize(scale);
      const label: TextStyle = { size, weight: 700, color: t.accent };
      const value: TextStyle = { size, weight: 400, color: t.ink };
      const gap = Math.round(16 * scale);
      const paras: Para[] = [];
      if (data.greeting) {
        paras.push({
          spans: [{ text: data.greeting, style: { size: Math.round(40 * scale), weight: 600, color: t.ink } }],
          align: "right",
          gapBefore: 0,
          lineHeight: 1.35,
        });
      }
      paras.push({
        spans: [{ text: data.serviceTitle, style: { size: Math.round(46 * scale), weight: 800, color: t.ink } }],
        align: "right",
        gapBefore: gap,
        lineHeight: 1.25,
      });
      if (data.included.length) {
        paras.push({
          spans: labeled("כלול:", data.included.join(" · "), label, value),
          align: "right",
          gapBefore: Math.round(28 * scale),
          lineHeight: 1.38,
        });
      }
      if (data.agreed) {
        const parts = splitLabel(data.agreed);
        paras.push({
          spans: parts ? labeled(parts[0], parts[1], label, value) : [{ text: data.agreed, style: value }],
          align: "right",
          gapBefore: gap,
          lineHeight: 1.38,
        });
      }
      if (data.when || data.where) {
        const when = [data.when, data.where].filter(Boolean).join(" · ");
        paras.push({
          spans: labeled(data.whenLabel ?? "מתי:", when, label, value),
          align: "right",
          gapBefore: gap,
          lineHeight: 1.38,
        });
      }
      if (data.bring) {
        paras.push({
          spans: labeled("מה להביא:", data.bring, label, value),
          align: "right",
          gapBefore: gap,
          lineHeight: 1.38,
          optional: 2,
        });
      }
      if (data.parking) {
        paras.push({
          spans: labeled("חניה:", data.parking, label, value),
          align: "right",
          gapBefore: gap,
          lineHeight: 1.38,
          optional: 1,
        });
      }
      paras.push({
        spans: labeled("ביטול ושינוי מועד:", `${data.cancellation} התנאים המלאים: ${data.termsUrl}`, label, {
          ...value,
          color: t.soft,
        }),
        align: "right",
        gapBefore: gap,
        lineHeight: 1.38,
      });
      return paras;
    },
    contentWidth,
    bodyBottom - bodyTop,
  );
  drawLaid(p, laid, bodyTop, SIDE, contentWidth);
}

/* ─── שובר מתנה ─── */

function drawDiamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string): void {
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r, cy);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - r, cy);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawGift(p: Painter, data: VoucherData, assets: VoucherAssets): void {
  const { ctx } = p;
  const t = GIFT_THEME;
  const W = VOUCHER_WIDTH;
  const H = VOUCHER_HEIGHT;
  const contentWidth = W - SIDE * 2 - 40;
  const left = (W - contentWidth) / 2;

  ctx.fillStyle = t.background;
  ctx.fillRect(0, 0, W, H);

  /* מסגרת כפולה בזהב, עם יהלום באמצע הצלע העליונה והתחתונה */
  ctx.strokeStyle = t.accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 1;
  ctx.strokeRect(54, 54, W - 108, H - 108);
  ctx.globalAlpha = 1;
  drawDiamond(ctx, W / 2, 40, 9, t.accent);
  drawDiamond(ctx, W / 2, H - 40, 9, t.accent);

  const logoH = 96;
  const logoW = logoH * assets.logoAspect;
  if (assets.logoGold) ctx.drawImage(assets.logoGold, (W - logoW) / 2, 96, logoW, logoH);

  const center = (text: string, style: TextStyle, baseline: number) =>
    p.single([{ text, style }], W / 2, baseline, "center");
  center(data.title, { size: 86, weight: 800, color: t.title }, 300);
  center(data.code, { size: 44, weight: 700, color: t.accent }, 368);
  hairline(ctx, t.hairline, W / 2 - 90, W / 2 + 90, 404);

  /* תחתית: מתי הונפק ואיפה התנאים, "אינו חשבונית", טלפון ואתר */
  const footerBaseline = H - 104;
  const disclaimerBaseline = footerBaseline - 50;
  const metaBaseline = disclaimerBaseline - 46;
  const softStyle: TextStyle = { size: MIN_BODY, weight: 400, color: t.soft };
  const meta = `הונפק ב-${data.issuedText} · תנאים: ${data.termsUrl}`;
  center(meta, p.fitSingle(meta, softStyle, contentWidth, 26), metaBaseline);
  center(data.disclaimer, p.fitSingle(data.disclaimer, softStyle, contentWidth, 26), disclaimerBaseline);
  center(data.footer, { size: 34, weight: 700, color: t.accent }, footerBaseline);
  hairline(ctx, t.hairline, W / 2 - 90, W / 2 + 90, metaBaseline - 52, 1);

  const bodyTop = 436;
  const bodyBottom = metaBaseline - 80;
  const laid = fitParas(
    p,
    (scale) => {
      const size = bodySize(scale);
      const label: TextStyle = { size, weight: 600, color: t.accent };
      const gap = Math.round(30 * scale);
      const paras: Para[] = [];
      const field = (name: string, value: string | null, valueSize: number, weight: number, color: string) => {
        if (!value) return;
        paras.push({
          spans: [{ text: name, style: label }],
          align: "center",
          gapBefore: paras.length ? gap : 0,
          lineHeight: 1.3,
        });
        paras.push({
          spans: [{ text: value, style: { size: Math.round(valueSize * scale), weight, color } }],
          align: "center",
          gapBefore: 0,
          lineHeight: 1.25,
        });
      };
      field("לכבוד", data.giftTo, 56, 700, t.ink);
      field("מאת", data.giftFrom, 42, 600, t.ink);
      field("המתנה", data.serviceTitle, 50, 800, t.title);
      if (data.included.length) {
        paras.push({
          spans: labeled("כולל:", data.included.join(" · "), label, { size, weight: 400, color: t.soft }),
          align: "center",
          gapBefore: Math.round(16 * scale),
          lineHeight: 1.38,
          optional: 1,
        });
      }
      if (data.validUntilText) {
        paras.push({
          spans: labeled("בתוקף עד:", data.validUntilText, label, { size: size + 2, weight: 700, color: t.title }),
          align: "center",
          gapBefore: gap,
          lineHeight: 1.38,
        });
      }
      if (data.redemption) {
        const parts = splitLabel(data.redemption);
        const value: TextStyle = { size, weight: 400, color: t.ink };
        paras.push({
          spans: parts ? labeled(parts[0], parts[1], label, value) : [{ text: data.redemption, style: value }],
          align: "center",
          gapBefore: Math.round(14 * scale),
          lineHeight: 1.38,
        });
      }
      return paras;
    },
    contentWidth,
    bodyBottom - bodyTop,
  );
  drawLaid(p, laid, bodyTop, left, contentWidth);
}

/** מצייר את אישור ההזמנה או את שובר המתנה על קנבס של 1080 על 1350 */
export function drawVoucher(
  ctx: CanvasRenderingContext2D,
  data: VoucherData,
  assets: VoucherAssets,
  options: VoucherDrawOptions = {},
): void {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, VOUCHER_WIDTH, VOUCHER_HEIGHT);
  ctx.textBaseline = "alphabetic";
  const painter = new Painter(ctx, assets.fontFamily);
  if (data.kind === "gift") drawGift(painter, data, assets);
  else drawOrder(painter, data, assets, options);
  ctx.restore();
}

/**
 * הלוגו (שחור) צבוע בצבע אחד: מציירים אותו על קנבס צדדי ומשאירים את הצבע
 * רק איפה שיש לוגו (source-in). מצויר בגודל קבוע וגדול, כדי שיישאר חד.
 *
 * null כשאין הקשר ציור. קודם הוחזר כאן קנבס ריק, והשובר יצא עם "לוגו"
 * שקוף בלי שאיש ידע (בדיקת הלוגו 7.10.2026).
 */
export function tintImage(
  image: CanvasImageSource,
  color: string,
  width: number,
  height: number,
): HTMLCanvasElement | null {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
}

/**
 * טעינה שנשמרת לכל הדף, חוץ מטעינה שנכשלה. קריאות בזמן טעינה מקבלות את
 * אותה הבטחה. תוצאה ש-ok מחזיר עליה false, או דחייה, נשכחות, והקריאה הבאה
 * טוענת מחדש. קודם assetsPromise ??= שמר גם לוגו null לכל חיי העמוד (בדיקת
 * הלוגו 7.10.2026).
 */
export function memoUnlessFailed<T>(load: () => Promise<T>, ok: (value: T) => boolean): () => Promise<T> {
  let cached: Promise<T> | null = null;
  return () => {
    if (cached) return cached;
    const promise = load();
    cached = promise;
    const forget = () => {
      if (cached === promise) cached = null;
    };
    promise.then((value) => {
      if (!ok(value)) forget();
    }, forget);
    return promise;
  };
}

/*
 * כמה מהשטח צריך להיות דיו כדי שהלוגו ייחשב מצויר. ברסטר של 720 על 361
 * הלוגו מכסה כ-17% מהפיקסלים באטימות של חצי ומעלה (נמדד ב-Chromium,
 * 7.10.2026). כשל מחזיר 0, ולכן רף של 1% מפריד בלי להיות עדין מדי.
 */
export const LOGO_MIN_INK = 0.01;

/** האם בערוץ האטימות (RGBA, כמו ש-getImageData מחזיר) יש מספיק דיו */
export function alphaHasInk(rgba: ArrayLike<number>, minFraction = LOGO_MIN_INK): boolean {
  const pixels = Math.floor(rgba.length / 4);
  if (pixels === 0) return false;
  const needed = Math.max(1, Math.ceil(pixels * minFraction));
  let ink = 0;
  for (let i = 3; i < rgba.length; i += 4) {
    if (rgba[i] >= 128 && ++ink >= needed) return true;
  }
  return false;
}

/**
 * האם הרסטר של הלוגו באמת מכיל דיו. false גם כשהקריאה נכשלת: קנבס "מוכתם"
 * (SecurityError) היה מפיל גם את toBlob של השובר, אז עדיף לדעת כבר כאן.
 */
export function canvasHasInk(canvas: HTMLCanvasElement | null): boolean {
  if (!canvas) return false;
  try {
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;
    return alphaHasInk(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
  } catch {
    return false;
  }
}
