"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { SITE_LOGO_SRC } from "@/lib/constants";
import type { VoucherData } from "@/lib/sales/voucher";
import {
  drawVoucher,
  GIFT_THEME,
  tintImage,
  VOUCHER_HEIGHT,
  VOUCHER_WIDTH,
  type VoucherAssets,
  type VoucherDrawOptions,
} from "@/lib/sales/voucher-canvas";

/**
 * התצוגה החיה של אישור ההזמנה או שובר המתנה. הקנבס עצמו הוא התצוגה, ואותו
 * קנבס הופך לקובץ לשיתוף, לשמירה ול-PDF.
 *
 * הקובץ נבנה מראש אחרי כל ציור (toBlob ברקע), כי navigator.share חייב לרוץ
 * מיד בתוך הלחיצה. המתנה לקובץ אחרי הלחיצה מאבדת את "פעולת המשתמש" ב-Safari,
 * והשיתוף נחסם. אם לוחצים לפני שהקובץ מוכן, נבנה קובץ סינכרוני מ-toDataURL.
 */

export type VoucherCanvasHandle = {
  /** הקובץ של מה שמוצג עכשיו, או null אם הגופן והלוגו עוד לא נטענו */
  getFile: () => File | null;
};

/* המשקלים של Heebo שהציור משתמש בהם */
const FONT_WEIGHTS = [400, 600, 700, 800] as const;
/* דוגמה עם עברית, לטינית וספרות, כדי שהדפדפן יטען את כל הטווחים */
const FONT_SAMPLE = "אישור הזמנה שובר מתנה YC-A7K2 058";
const LOGO_RASTER_WIDTH = 720;
const BLOB_DELAY_MS = 200;

/*
 * next/font שם את Heebo במשתנה --font-heebo על <html> (app/layout.tsx), עם שם
 * משפחה מגובב. קוראים אותו מהדף ולא כותבים "Heebo" ביד, אחרת הקנבס היה נופל
 * לגופן מערכת. אם המשתנה חסר, לוקחים את הגופן של body.
 */
function resolveFontFamily(): string {
  const fromVariable = getComputedStyle(document.documentElement).getPropertyValue("--font-heebo").trim();
  const family = fromVariable || getComputedStyle(document.body).fontFamily;
  return family ? `${family}, sans-serif` : "sans-serif";
}

async function loadFonts(family: string): Promise<void> {
  const fonts = document.fonts;
  if (!fonts?.load) return;
  await Promise.all(
    FONT_WEIGHTS.map((weight) => fonts.load(`${weight} 40px ${family}`, FONT_SAMPLE).catch(() => [])),
  );
  await fonts.ready;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

/* נטען פעם אחת לכל הדף: הגופן והלוגו לא משתנים בין שובר לשובר */
let assetsPromise: Promise<VoucherAssets> | null = null;

function loadVoucherAssets(): Promise<VoucherAssets> {
  assetsPromise ??= (async () => {
    const fontFamily = resolveFontFamily();
    const [, logo] = await Promise.all([loadFonts(fontFamily), loadImage(SITE_LOGO_SRC)]);
    /* ה-SVG מוגדר ב-pt, ולכן היחס נלקח מהמידות הטבעיות ולא מהקובץ */
    const logoAspect = logo && logo.naturalWidth && logo.naturalHeight ? logo.naturalWidth / logo.naturalHeight : 2;
    const logoGold = logo
      ? tintImage(logo, GIFT_THEME.accent, LOGO_RASTER_WIDTH, LOGO_RASTER_WIDTH / logoAspect)
      : null;
    return { fontFamily, logo, logoGold, logoAspect };
  })();
  return assetsPromise;
}

function dataUrlToFile(dataUrl: string, fileName: string): File {
  const binary = atob(dataUrl.slice(dataUrl.indexOf(",") + 1));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], fileName, { type: "image/png" });
}

type VoucherCanvasProps = {
  data: VoucherData;
  fileName: string;
  /** תיאור לקורא מסך: מה מוצג בתמונה */
  label: string;
  statusTone?: VoucherDrawOptions["statusTone"];
  ref?: Ref<VoucherCanvasHandle>;
};

export default function VoucherCanvas({ data, fileName, label, statusTone, ref }: VoucherCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* מספר הגרסה של הציור האחרון, והקובץ שנבנה לגרסה הזו */
  const versionRef = useRef(0);
  const drawnVersionRef = useRef(0);
  const fileRef = useRef<{ version: number; file: File } | null>(null);

  useEffect(() => {
    versionRef.current += 1;
    const version = versionRef.current;
    let cancelled = false;
    let timer: number | undefined;
    void loadVoucherAssets().then((assets) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (cancelled || !canvas || !ctx) return;
      drawVoucher(ctx, data, assets, { statusTone });
      drawnVersionRef.current = version;
      timer = window.setTimeout(() => {
        canvas.toBlob((blob) => {
          if (!blob || cancelled || versionRef.current !== version) return;
          fileRef.current = { version, file: new File([blob], fileName, { type: "image/png" }) };
        }, "image/png");
      }, BLOB_DELAY_MS);
    });
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [data, statusTone, fileName]);

  useImperativeHandle(
    ref,
    () => ({
      getFile() {
        const canvas = canvasRef.current;
        if (!canvas || drawnVersionRef.current === 0) return null;
        const ready = fileRef.current;
        if (ready && ready.version === drawnVersionRef.current) return ready.file;
        return dataUrlToFile(canvas.toDataURL("image/png"), fileName);
      },
    }),
    [fileName],
  );

  return (
    <canvas
      ref={canvasRef}
      width={VOUCHER_WIDTH}
      height={VOUCHER_HEIGHT}
      role="img"
      aria-label={label}
      className="block h-auto w-full rounded-lg border border-border bg-muted shadow-sm"
    />
  );
}
