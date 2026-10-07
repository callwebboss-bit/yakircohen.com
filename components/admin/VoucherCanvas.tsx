"use client";

import { useEffect, useEffectEvent, useImperativeHandle, useRef, useState, type Ref } from "react";
import { SITE_LOGO_SRC } from "@/lib/constants";
import type { VoucherData } from "@/lib/sales/voucher";
import {
  canvasHasInk,
  drawVoucher,
  GIFT_THEME,
  memoUnlessFailed,
  tintImage,
  VOUCHER_HEIGHT,
  VOUCHER_WIDTH,
  type VoucherAssets,
  type VoucherDrawOptions,
} from "@/lib/sales/voucher-canvas";
import { VOUCHER_LOGO_DATA_URL } from "@/lib/sales/voucher-logo.generated";

/**
 * התצוגה החיה של אישור ההזמנה או שובר המתנה. הקנבס עצמו הוא התצוגה, ואותו
 * קנבס הופך לקובץ לשיתוף, לשמירה ול-PDF.
 *
 * הקובץ נבנה מראש אחרי כל ציור (toBlob ברקע), כי navigator.share חייב לרוץ
 * מיד בתוך הלחיצה. המתנה לקובץ אחרי הלחיצה מאבדת את "פעולת המשתמש" ב-Safari,
 * והשיתוף נחסם. אם לוחצים לפני שהקובץ מוכן, נבנה קובץ סינכרוני מ-toDataURL.
 */

export type VoucherCanvasHandle = {
  /**
   * הקובץ של מה שמוצג עכשיו, או null אם הגופן והלוגו עוד לא נטענו, או
   * שהלוגו לא נטען בכלל: שובר בלי לוגו לא יוצא מהעמדה (בדיקת הלוגו 7.10.2026)
   */
  getFile: () => File | null;
  /** טוען שוב את הגופן ואת הלוגו ומצייר מחדש, אחרי כשל בלוגו */
  retry: () => void;
};

/** loading עד הציור הראשון, ואחריו ok או failed לפי logoOk */
export type VoucherLogoStatus = "loading" | "ok" | "failed";

/* המשקלים של Heebo שהציור משתמש בהם */
const FONT_WEIGHTS = [400, 600, 700, 800] as const;
/* דוגמה עם עברית, לטינית וספרות, כדי שהדפדפן יטען את כל הטווחים */
const FONT_SAMPLE = "אישור הזמנה שובר מתנה YC-A7K2 058";
const LOGO_RASTER_WIDTH = 720;
const BLOB_DELAY_MS = 200;
/* תמונה שלא נטענה ולא נכשלה עד אז נחשבת כשל, כדי שהעמדה לא תחכה בלי סוף */
const LOGO_TIMEOUT_MS = 8000;

/*
 * מקורות הלוגו לפי הסדר. קודם הקובץ שבתוך החבילה, בלי בקשת רשת: בדיקת הלוגו
 * 7.10.2026 מצאה שטעינה מהרשת נכשלת בשקט. הכתובת באתר נשארת גיבוי, למקרה
 * שדפדפן כלשהו לא מצייר את ה-data URL לקנבס.
 */
const LOGO_SOURCES = [VOUCHER_LOGO_DATA_URL, SITE_LOGO_SRC] as const;

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

/** התוצאה של ההבטחה, או fallback אם היא נדחתה או לא הסתיימה בזמן */
function settleWithin<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => resolve(fallback), ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      () => {
        window.clearTimeout(timer);
        resolve(fallback);
      },
    );
  });
}

async function loadImage(src: string): Promise<HTMLImageElement | null> {
  const image = new Image();
  image.decoding = "async";
  const loaded = new Promise<boolean>((resolve) => {
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
  });
  image.src = src;
  if (!(await settleWithin(loaded, LOGO_TIMEOUT_MS, false))) return null;
  /* פענוח לפני הציור (בדיקת הלוגו 7.10.2026). אם decode נדחה אחרי onload לא
     מוותרים על התמונה: בדיקת הדיו של הרסטר היא שמכריעה */
  if (typeof image.decode === "function") {
    await settleWithin(image.decode().then(() => true), LOGO_TIMEOUT_MS, false);
  }
  return image;
}

type LogoAssets = Pick<VoucherAssets, "logo" | "logoGold" | "logoAspect" | "logoOk">;

/*
 * לוגו נחשב תקין רק אם הרסטר הזהוב שלו מכיל דיו בפועל. זה תופס גם תמונה
 * שנטענה וצוירה ריקה, וגם קנבס צדדי בלי הקשר ציור. כשאף מקור לא עובר,
 * הציור יוצא בלי לוגו, כמו שההודעה בעמדה אומרת.
 */
async function loadLogo(): Promise<LogoAssets> {
  for (const src of LOGO_SOURCES) {
    const logo = await loadImage(src);
    if (!logo) continue;
    /* ה-SVG מוגדר ב-pt, ולכן היחס נלקח מהמידות הטבעיות ולא מהקובץ */
    const logoAspect = logo.naturalWidth && logo.naturalHeight ? logo.naturalWidth / logo.naturalHeight : 2;
    let logoGold: HTMLCanvasElement | null = null;
    try {
      logoGold = tintImage(logo, GIFT_THEME.accent, LOGO_RASTER_WIDTH, LOGO_RASTER_WIDTH / logoAspect);
    } catch {
      logoGold = null;
    }
    if (canvasHasInk(logoGold)) return { logo, logoGold, logoAspect, logoOk: true };
  }
  return { logo: null, logoGold: null, logoAspect: 2, logoOk: false };
}

/*
 * נטען פעם אחת לכל הדף: הגופן והלוגו לא משתנים בין שובר לשובר. טעינה שהלוגו
 * בה לא עבר לא נשמרת. קודם null מטעינה שנכשלה נשמר לכל חיי העמוד (בדיקת
 * הלוגו 7.10.2026), ועכשיו הציור הבא, או "טעינה מחדש", מנסה שוב.
 */
const loadVoucherAssets = memoUnlessFailed(
  async (): Promise<VoucherAssets> => {
    const fontFamily = resolveFontFamily();
    const [, logo] = await Promise.all([loadFonts(fontFamily), loadLogo()]);
    return { fontFamily, ...logo };
  },
  (assets) => assets.logoOk,
);

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
  /** אחרי כל ציור: ok או failed לפי הלוגו */
  onLogoStatus?: (status: VoucherLogoStatus) => void;
  ref?: Ref<VoucherCanvasHandle>;
};

export default function VoucherCanvas({ data, fileName, label, statusTone, onLogoStatus, ref }: VoucherCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* מספר הגרסה של הציור האחרון, והקובץ שנבנה לגרסה הזו */
  const versionRef = useRef(0);
  const drawnVersionRef = useRef(0);
  const fileRef = useRef<{ version: number; file: File } | null>(null);
  /* האם בציור האחרון היה לוגו תקין. getFile בודק אותו (בדיקת הלוגו 7.10.2026) */
  const logoOkRef = useRef(false);
  /* כל הגדלה מריצה שוב את הציור, וטעינה שנכשלה לא שמורה, ולכן היא נטענת מחדש */
  const [attempt, setAttempt] = useState(0);
  /* useEffectEvent ולא תלות של האפקט: פונקציה חדשה בכל רינדור של ההורה הייתה
     מציירת מחדש, מדווחת, מרנדרת את ההורה, וחוזר חלילה */
  const reportLogo = useEffectEvent((status: VoucherLogoStatus) => onLogoStatus?.(status));

  useEffect(() => {
    versionRef.current += 1;
    const version = versionRef.current;
    let cancelled = false;
    let timer: number | undefined;
    loadVoucherAssets().then(
      (assets) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (cancelled || !canvas || !ctx) return;
        drawVoucher(ctx, data, assets, { statusTone });
        drawnVersionRef.current = version;
        logoOkRef.current = assets.logoOk;
        reportLogo(assets.logoOk ? "ok" : "failed");
        timer = window.setTimeout(() => {
          canvas.toBlob((blob) => {
            if (!blob || cancelled || versionRef.current !== version) return;
            fileRef.current = { version, file: new File([blob], fileName, { type: "image/png" }) };
          }, "image/png");
        }, BLOB_DELAY_MS);
      },
      () => {
        if (!cancelled) reportLogo("failed");
      },
    );
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [data, statusTone, fileName, attempt]);

  useImperativeHandle(
    ref,
    () => ({
      getFile() {
        const canvas = canvasRef.current;
        if (!canvas || drawnVersionRef.current === 0 || !logoOkRef.current) return null;
        const ready = fileRef.current;
        if (ready && ready.version === drawnVersionRef.current) return ready.file;
        return dataUrlToFile(canvas.toDataURL("image/png"), fileName);
      },
      retry() {
        setAttempt((n) => n + 1);
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
