import { encodeCode39, isCode39Encodable } from "@/lib/code39";
import { VOUCHER_LOGO_DATA_URL } from "@/lib/sales/voucher-logo.generated";

/**
 * ציור תמונת שובר בצד הלקוח, על canvas. בלי שרת: שום פרט אישי לא יוצא מהדפדפן.
 * הפונקציה טהורה ביחס ל-DOM מלבד ה-canvas שמועבר אליה, ולכן ניתן לצייר גם
 * על canvas מחוץ לעץ.
 */

export type VoucherImageInput = {
  from: string;
  to: string;
  message: string;
  /** שורת החבילה והמחיר, כפי שמוצגת למשתמש */
  valueLabel: string;
  /** קוד השובר. ריק = מסגרת עם ברקוד להמחשה והסבר שהקוד יתווסף לאחר הרכישה */
  code?: string;
  /** שורת התוקף, למשל "תוקף: שנתיים מיום הרכישה" או "בתוקף עד 1 בינואר 2027" */
  validityLabel: string;
};

export const VOUCHER_IMAGE_SIZE = { width: 1600, height: 900 } as const;

const COLORS = {
  background: "#ffffff",
  surface: "#ffffff",
  ink: "#1a1a1a",
  muted: "#5c5c5c",
  red: "#d42b2b",
  redDark: "#9a2222",
  gold: "#8a6f2e",
  silver: "#9aa3ad",
  line: "#e3e1da",
} as const;

function fontStack(cssVar: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.body).getPropertyValue(cssVar).trim();
  return value ? `${value}, ${fallback}` : fallback;
}

/** מילה ארוכה מהרוחב (כתובת, רצף תווים בלי רווח) נשברת לפי תווים, ולא חורגת מהמסגרת. */
function breakLongWord(
  ctx: CanvasRenderingContext2D,
  word: string,
  maxWidth: number,
): string[] {
  const parts: string[] = [];
  let chunk = "";
  for (const ch of [...word]) {
    if (chunk && ctx.measureText(chunk + ch).width > maxWidth) {
      parts.push(chunk);
      chunk = ch;
    } else {
      chunk += ch;
    }
  }
  if (chunk) parts.push(chunk);
  return parts;
}

/** שבירת שורות לפי רוחב נמדד, כדי שההודעה לא תחרוג מהמסגרת. */
function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split(/\r?\n/)) {
    const words = paragraph
      .split(/\s+/)
      .filter(Boolean)
      .flatMap((word) =>
        ctx.measureText(word).width > maxWidth
          ? breakLongWord(ctx, word, maxWidth)
          : [word],
      );
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (ctx.measureText(candidate).width <= maxWidth || !line) {
        line = candidate;
      } else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }
  return lines;
}

/** גודל גופן שבו שורה אחת נכנסת לרוחב נתון (מקטינים עד minSize). */
function fitLineSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  weight: number,
  startSize: number,
  minSize: number,
  family: string,
): number {
  for (let size = startSize; size >= minSize; size -= 1) {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) return size;
  }
  return minSize;
}

/**
 * הודעה אישית שנכנסת תמיד: מקטינים את הגופן עד שהיא נכנסת ב-maxLines שורות.
 * קודם נחתכו בשקט שורות מעבר לשלוש, והמשפט האחרון של הברכה נעלם מהתמונה.
 */
function fitMessage(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
  sans: string,
): { lines: string[]; size: number; lineHeight: number } {
  for (let size = 30; size >= 20; size -= 2) {
    ctx.font = `400 ${size}px ${sans}`;
    const lines = wrapLines(ctx, text, maxWidth);
    if (lines.length <= maxLines || size === 20) {
      return { lines: lines.slice(0, maxLines), size, lineHeight: Math.round(size * 1.4) };
    }
  }
  return { lines: [], size: 20, lineHeight: 29 };
}

/** מיקרופון בציור ישיר: קפסולה, קשת תמיכה, רגל ובסיס. cx,cy במרכז האייקון. */
function drawMicrophone(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
): void {
  const w = size * 0.34;
  const h = size * 0.56;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "round";
  ctx.lineWidth = Math.max(3, size * 0.07);

  // קפסולה
  const top = cy - size * 0.36;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(cx - w / 2, top, w, h, w / 2);
  } else {
    /* דפדפנים ישנים בלי roundRect: קפסולה מקשת ושני קווים */
    const r = w / 2;
    ctx.moveTo(cx - r, top + r);
    ctx.arc(cx, top + r, r, Math.PI, 0, false);
    ctx.lineTo(cx + r, top + h - r);
    ctx.arc(cx, top + h - r, r, 0, Math.PI, false);
    ctx.closePath();
  }
  ctx.fill();

  // סורגים לבנים על הקפסולה
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = Math.max(2, size * 0.035);
  for (let i = 1; i <= 3; i += 1) {
    const y = top + (h * i) / 4;
    ctx.beginPath();
    ctx.moveTo(cx - w / 2 + size * 0.05, y);
    ctx.lineTo(cx + w / 2 - size * 0.05, y);
    ctx.stroke();
  }

  // קשת תמיכה, רגל ובסיס
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(3, size * 0.07);
  const arcR = w * 0.95;
  const arcY = top + h * 0.55;
  ctx.beginPath();
  ctx.arc(cx, arcY, arcR, 0, Math.PI, false);
  ctx.stroke();
  const stemTop = arcY + arcR;
  const stemBottom = cy + size * 0.42;
  ctx.beginPath();
  ctx.moveTo(cx, stemTop);
  ctx.lineTo(cx, stemBottom);
  ctx.moveTo(cx - w * 0.6, stemBottom);
  ctx.lineTo(cx + w * 0.6, stemBottom);
  ctx.stroke();
  ctx.restore();
}

/** טקסט לאורך קשת: כל תו מסובב לפי מקומו על המעגל. */
function drawTextOnArc(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  centerAngle: number,
  letterSpacing: number,
  inward: boolean,
): void {
  const chars = [...text];
  const widths = chars.map((ch) => ctx.measureText(ch).width + letterSpacing);
  const total = widths.reduce((sum, w) => sum + w, 0) - letterSpacing;
  let angle = centerAngle - (inward ? -1 : 1) * (total / radius / 2);
  chars.forEach((ch, index) => {
    const step = widths[index] / radius;
    const mid = angle + (inward ? -1 : 1) * (step / 2);
    ctx.save();
    ctx.translate(cx + radius * Math.cos(mid), cy + radius * Math.sin(mid));
    ctx.rotate(mid + (inward ? -Math.PI / 2 : Math.PI / 2));
    ctx.fillText(ch, 0, 0);
    ctx.restore();
    angle += (inward ? -1 : 1) * step;
  });
}

/** חותמת עגולה באנגלית: טבעת טקסט, מיקרופון במרכז, "EST. 2010" למטה. */
function drawStamp(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  sans: string,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((-9 * Math.PI) / 180);
  ctx.translate(-cx, -cy);
  ctx.globalAlpha = 0.88;
  ctx.strokeStyle = COLORS.redDark;
  ctx.fillStyle = COLORS.redDark;

  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
  ctx.stroke();

  ctx.direction = "ltr";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `700 15px ${sans}`;
  drawTextOnArc(ctx, "YAKIR COHEN PRODUCTIONS", cx, cy, r * 0.76, -Math.PI / 2, 1.5, false);
  ctx.font = `700 13px ${sans}`;
  drawTextOnArc(ctx, "RECORDING STUDIO", cx, cy, r * 0.8, Math.PI / 2, 1.5, true);

  drawMicrophone(ctx, cx, cy - 3, r * 0.62, COLORS.redDark);
  ctx.restore();
}

/** ברקוד Code 39: פסים שחורים בתוך המלבן הנתון. */
function drawBarcode(
  ctx: CanvasRenderingContext2D,
  modules: string,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  const unit = width / modules.length;
  ctx.fillStyle = COLORS.ink;
  let run = -1;
  for (let i = 0; i <= modules.length; i += 1) {
    const on = i < modules.length && modules[i] === "1";
    if (on && run < 0) run = i;
    if (!on && run >= 0) {
      ctx.fillRect(x + run * unit, y, (i - run) * unit, height);
      run = -1;
    }
  }
}

/** ברקוד להמחשה כשאין עדיין קוד: אותו קידוד, על טקסט קבוע שאינו קוד אמיתי. */
const PLACEHOLDER_BARCODE_TEXT = "YAKIR-COHEN";

/* הלוגו נטען מ-data URL שבתוך החבילה, כמו בעמדת המכירות: אין בקשת רשת שיכולה
   להיכשל. אם בכל זאת נכשל, מחזירים שגיאה ולא משמיטים את הלוגו בשקט, כדי שלא
   יצא שובר בלי לוגו מבלי שמישהו ידע. */
function loadLogo(): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("voucher logo failed to load"));
    img.src = VOUCHER_LOGO_DATA_URL;
  });
}

export async function drawVoucherImage(
  canvas: HTMLCanvasElement,
  input: VoucherImageInput,
): Promise<void> {
  const { width, height } = VOUCHER_IMAGE_SIZE;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas 2d context unavailable");

  const serif = fontStack("--font-noto-serif-hebrew", "Georgia, serif");
  const sans = fontStack("--font-heebo", "Arial, sans-serif");

  if (typeof document !== "undefined" && document.fonts) {
    await Promise.allSettled([
      document.fonts.load(`600 64px ${serif}`, "שובר מתנה"),
      document.fonts.load(`400 32px ${sans}`, "שובר מתנה"),
    ]);
  }
  const logo = await loadLogo();

  ctx.direction = "rtl";
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // כרטיס לבן עם מסגרת כפולה בצבעי המותג
  const pad = 56;
  ctx.fillStyle = COLORS.surface;
  ctx.fillRect(pad, pad, width - pad * 2, height - pad * 2);
  ctx.strokeStyle = COLORS.red;
  ctx.lineWidth = 6;
  ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 2;
  ctx.strokeRect(pad + 18, pad + 18, width - (pad + 18) * 2, height - (pad + 18) * 2);

  // פסי כסף בצדדים: פס רחב ופס דק בכל צד, בגרדיאנט מתכתי אנכי
  const stripeTop = pad + 40;
  const stripeBottom = height - pad - 40;
  const metal = ctx.createLinearGradient(0, stripeTop, 0, stripeBottom);
  metal.addColorStop(0, "#c9d0d6");
  metal.addColorStop(0.35, "#9aa3ad");
  metal.addColorStop(0.5, "#e6eaee");
  metal.addColorStop(0.65, "#9aa3ad");
  metal.addColorStop(1, "#c9d0d6");
  ctx.fillStyle = metal;
  for (const [x, w] of [
    [pad + 34, 12],
    [pad + 54, 4],
    [width - pad - 46, 12],
    [width - pad - 58, 4],
  ] as const) {
    ctx.fillRect(x, stripeTop, w, stripeBottom - stripeTop);
  }

  const right = width - pad - 70;
  const left = pad + 70;
  const innerWidth = right - left;

  const logoH = 150;
  const logoW = (logo.naturalWidth / logo.naturalHeight) * logoH;
  ctx.drawImage(logo, left, pad + 36, logoW, logoH);

  ctx.fillStyle = COLORS.red;
  ctx.font = `600 26px ${sans}`;
  ctx.fillText("יקיר כהן הפקות", right, pad + 92);

  ctx.fillStyle = COLORS.ink;
  ctx.font = `600 92px ${serif}`;
  ctx.fillText("שובר מתנה", right, pad + 240);

  ctx.fillStyle = COLORS.redDark;
  ctx.font = `600 48px ${sans}`;
  ctx.fillText(input.valueLabel, right, pad + 318);

  ctx.strokeStyle = COLORS.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left, pad + 358);
  ctx.lineTo(right, pad + 358);
  ctx.stroke();

  ctx.fillStyle = COLORS.ink;
  ctx.font = `500 36px ${sans}`;
  ctx.fillText(`עבור: ${input.to || "המקבל/ת"}`, right, pad + 420);

  ctx.fillStyle = COLORS.muted;
  const fitted = fitMessage(ctx, input.message || "", innerWidth, 3, sans);
  ctx.font = `400 ${fitted.size}px ${sans}`;
  fitted.lines.forEach((line, index) => {
    ctx.fillText(line, right, pad + 466 + index * fitted.lineHeight);
  });

  /* שם נותן ארוך נכנס לשטח שמימין לחותמת (עד x=1000), ולא עובר דרכה */
  const fromText = `מאת: ${input.from || "הנותן/ת"}`;
  const fromSize = fitLineSize(ctx, fromText, right - 1000, 500, 32, 20, sans);
  ctx.fillStyle = COLORS.ink;
  ctx.font = `500 ${fromSize}px ${sans}`;
  ctx.fillText(fromText, right, height - pad - 118);

  // תוקף
  ctx.fillStyle = COLORS.redDark;
  ctx.font = `600 26px ${sans}`;
  ctx.fillText(input.validityLabel, right, height - pad - 76);

  // מיקרופון באמבלמה במרכז העליון
  const emblemX = width / 2;
  const emblemY = pad + 150;
  ctx.strokeStyle = COLORS.red;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(emblemX, emblemY, 66, 0, Math.PI * 2);
  ctx.stroke();
  drawMicrophone(ctx, emblemX, emblemY, 92, COLORS.red);

  // חותמת
  drawStamp(ctx, 860, height - pad - 128, 100, sans);

  // קוד שובר + ברקוד, בצד שמאל למטה
  const codeW = 480;
  const codeH = 128;
  const codeX = left;
  const codeY = height - pad - 52 - codeH;
  ctx.setLineDash([10, 8]);
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 2;
  ctx.strokeRect(codeX, codeY, codeW, codeH);
  ctx.setLineDash([]);

  const code = input.code?.trim().toUpperCase() ?? "";
  const barcodeText = code && isCode39Encodable(code) ? code : PLACEHOLDER_BARCODE_TEXT;
  drawBarcode(ctx, encodeCode39(barcodeText), codeX + 24, codeY + 14, codeW - 48, 58);

  ctx.textAlign = "center";
  ctx.direction = "ltr";
  if (code) {
    ctx.fillStyle = COLORS.ink;
    ctx.font = `600 30px ${sans}`;
    ctx.fillText(code, codeX + codeW / 2, codeY + 104);
  } else {
    ctx.direction = "rtl";
    ctx.fillStyle = COLORS.muted;
    ctx.font = `400 23px ${sans}`;
    ctx.fillText("טיוטה. תקף רק עם קוד אחרי תשלום", codeX + codeW / 2, codeY + 104);
  }
  ctx.direction = "rtl";
  ctx.textAlign = "right";
  ctx.fillStyle = COLORS.muted;
  ctx.font = `400 22px ${sans}`;
  ctx.fillText("קוד שובר", codeX + codeW, codeY - 12);

  ctx.textAlign = "right";
  ctx.fillStyle = COLORS.muted;
  ctx.font = `400 22px ${sans}`;
  ctx.fillText("yakircohen.com", right, height - pad - 34);
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/png",
    );
  });
}

/**
 * שומר את תמונת השובר. בטלפון נפתח גיליון השיתוף (גלריה, וואטסאפ), כי הורדה
 * דרך קישור לא עובדת בדפדפן הפנימי של וואטסאפ ואינסטגרם ובחלק מגרסאות Safari
 * בנייד. בדסקטופ זו הורדה רגילה. זורק שגיאה אם יצירת התמונה נכשלה.
 */
export async function saveVoucherImage(
  canvas: HTMLCanvasElement,
  filename: string,
): Promise<void> {
  const blob = await canvasToPngBlob(canvas);
  const file = new File([blob], filename, { type: "image/png" });
  const isTouch =
    typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;
  if (
    isTouch &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      /* כשל אחר בשיתוף: ממשיכים להורדה רגילה */
    }
  }
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 10_000);
}
