/**
 * ציור מותג משותף לכל שוברי האתר: מיקרופון, חותמת עגולה באנגלית ופסי כסף בצדדים.
 * משמש גם את תמונת השובר באתר (lib/gift-voucher-canvas.ts) וגם את שובר המתנה של
 * עמדת המכירות (lib/sales/voucher-canvas.ts), כדי שיהיה עיצוב אחד (החלטת הבעלים
 * 8.10.2026: לבן, פסי כסף, מיקרופון וחותמת). מקבל רק הקשר ציור, בלי DOM.
 */

export const BRAND_RED_DARK = "#9a2222";
const SILVER_STOPS = ["#c9d0d6", "#9aa3ad", "#e6eaee", "#9aa3ad", "#c9d0d6"] as const;

/** גרדיאנט מתכתי אנכי בין top ל-bottom */
function silverGradient(ctx: CanvasRenderingContext2D, top: number, bottom: number): CanvasGradient {
  const g = ctx.createLinearGradient(0, top, 0, bottom);
  [0, 0.35, 0.5, 0.65, 1].forEach((offset, i) => g.addColorStop(offset, SILVER_STOPS[i]));
  return g;
}

/** פס רחב ופס דק בכל צד. leftX/rightX הם הקצה החיצוני של כל קבוצה, לכיוון מרכז השובר. */
export function drawSilverStripes(
  ctx: CanvasRenderingContext2D,
  opts: { width: number; top: number; bottom: number; inset: number },
): void {
  const { width, top, bottom, inset } = opts;
  ctx.save();
  ctx.fillStyle = silverGradient(ctx, top, bottom);
  for (const [x, w] of [
    [inset, 12],
    [inset + 20, 4],
    [width - inset - 12, 12],
    [width - inset - 24, 4],
  ] as const) {
    ctx.fillRect(x, top, w, bottom - top);
  }
  ctx.restore();
}

/** מיקרופון בציור ישיר: קפסולה, קשת תמיכה, רגל ובסיס. cx,cy במרכז האייקון. */
export function drawMicrophone(
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
export function drawStamp(
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
  ctx.strokeStyle = BRAND_RED_DARK;
  ctx.fillStyle = BRAND_RED_DARK;

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
  /* הכתב והמרווחים גדלים וקטנים עם הרדיוס. בגודל 100 הכתב הוא 15 ו-13 פיקסלים */
  const k = r / 100;
  ctx.font = `700 ${15 * k}px ${sans}`;
  drawTextOnArc(ctx, "YAKIR COHEN PRODUCTIONS", cx, cy, r * 0.76, -Math.PI / 2, 1.5 * k, false);
  ctx.font = `700 ${13 * k}px ${sans}`;
  drawTextOnArc(ctx, "RECORDING STUDIO", cx, cy, r * 0.8, Math.PI / 2, 1.5 * k, true);

  drawMicrophone(ctx, cx, cy - 3, r * 0.62, BRAND_RED_DARK);
  ctx.restore();
}
