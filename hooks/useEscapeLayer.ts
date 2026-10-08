"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   useEscapeLayer: מחסנית שכבות משותפת למקש Escape.

   נולד ב-7.10.2026 מהממצא F-74 בדוח הנגישות. כל שכבה צפה (תפריט, צ'אט, פאנל
   נגישות, חלון קופץ) רשמה לעצמה מאזין Escape גלובלי, ולכן לחיצה אחת סגרה
   את כולן יחד: למשל Escape בתוצאות החיפוש של המגירה סגר גם את המגירה, ו-Escape
   על פאנל פתוח סגר גם את מאתר המתנות ושרף לו snooze של שלושה ימים.

   החוזה:
   - רק השכבה העליונה צורכת את המקש. שכבה צורכת = ה-hook קורא ל-
     event.preventDefault() לפני שהוא קורא ל-onEscape, כדי שמאזינים אחרים
     (Radix, קוד ישן) יידעו שהמקש כבר טופל.
   - ברירת המחדל היא שכבה "אינטראקטיבית": משהו שהגולש פתח בעצמו (תפריט, צ'אט,
     פאנל, חיפוש, tooltip). בין אינטראקטיביות העליונה היא האחרונה שנרשמה.
   - { ambient: true } היא שכבת "רקע": חלון שקופץ מעצמו (מאתר מתנות, התקנת
     PWA, סרגל שחזור טיוטה, בועת עזרה). שכבת רקע תמיד מתחת לכל שכבה
     אינטראקטיבית, בלי קשר למי נרשם קודם, ולכן Escape שנועד לצ'אט הפתוח לא
     יסגור גם את הפופ-אפ. בנוסף היא נסוגה כש:
       1. מישהו כבר קרא ל-preventDefault על האירוע (Radix, שכבה שאינה
          במחסנית וקוראת ל-preventDefault);
       2. חלון מודאלי פתוח ב-DOM (role=dialog aria-modal=true, או dialog[open]).
          useModalA11y מחזיק מחסנית משלו, ולכן הבדיקה היא על ה-DOM;
       3. המיקוד בשדה טקסט, אלא אם ביקשו allowInFields (Escape בשדה שייך לשדה).
     כדי לתת לכולם להשלים, שכבת רקע פועלת ב-setTimeout 0 אחרי שכל מאזיני
     האירוע רצו, ואז בודקת את defaultPrevented. אירוע חוזר (מקש לחוץ) מתעלמים.

   איך שכבה קיימת מצטרפת (למשל SiteNav, SiteSearch, ChatWidget,
   AccessibilityToggle, שעדיין רושמים מאזין משלהם):
     useEscapeLayer({ active: open, onEscape: () => setOpen(false) });
   ומסירים את ה-keydown הידני שלהם. אם שכבה נשארת עם מאזין ידני, היא חייבת
   לקרוא ל-event.preventDefault() כשהיא צורכת Escape, אחרת שכבת רקע גלויה
   תיסגר יחד איתה.

   הלוגיקה הטהורה (createEscapeStack) נבדקת ב-useEscapeLayer.test.ts.
   ───────────────────────────────────────────────────────────────────────────── */

/** מה שהמחסנית צריכה מאירוע מקלדת. KeyboardEvent עונה על זה כמו שהוא. */
export type EscapeEventLike = {
  key: string;
  defaultPrevented: boolean;
  isComposing?: boolean;
  repeat?: boolean;
  target?: EventTarget | null;
  preventDefault(): void;
};

type EscapeLayerSpec<E extends EscapeEventLike> = {
  handler: (event: E) => void;
  /** שכבת רקע: תמיד מתחת לכל שכבה אינטראקטיבית, ונסוגה בפני מודאל ושדות. */
  ambient?: boolean;
  /** שכבת רקע שצורכת Escape גם כשהמיקוד בשדה טקסט (בועת העזרה של האשף). */
  allowInFields?: boolean;
};

type EscapeStackEnv = {
  /** מריץ אחרי שכל מאזיני האירוע הנוכחי סיימו (בדפדפן: setTimeout 0). */
  defer: (fn: () => void) => void;
  /** האם חלון מודאלי פתוח כרגע. */
  modalOpen: () => boolean;
  /** האם היעד של האירוע הוא שדה טקסט. */
  isEditable: (target: EventTarget | null) => boolean;
  /** השכבה הראשונה נרשמה: זה הזמן להאזין ל-keydown. */
  onNonEmpty?: () => void;
  /** השכבה האחרונה הוסרה: זה הזמן להפסיק להאזין. */
  onEmpty?: () => void;
};

export type EscapeStack<E extends EscapeEventLike> = {
  /** רושם שכבה. מחזיר פונקציית הסרה, בטוחה לקריאה כפולה. */
  push: (spec: EscapeLayerSpec<E>) => () => void;
  /** מטפל באירוע keydown. */
  dispatch: (event: E) => void;
  /** כמה שכבות רשומות. */
  size: () => number;
};

export function createEscapeStack<E extends EscapeEventLike>(
  env: EscapeStackEnv,
): EscapeStack<E> {
  type Layer = {
    handler: (event: E) => void;
    ambient: boolean;
    allowInFields: boolean;
  };
  const layers: Layer[] = [];

  /** העליונה: האחרונה מבין האינטראקטיביות, ואם אין כאלה האחרונה מבין הרקע. */
  function top(): Layer | undefined {
    for (let i = layers.length - 1; i >= 0; i -= 1) {
      if (!layers[i].ambient) return layers[i];
    }
    return layers[layers.length - 1];
  }

  return {
    push(spec) {
      const layer: Layer = {
        handler: spec.handler,
        ambient: spec.ambient ?? false,
        allowInFields: spec.allowInFields ?? false,
      };
      layers.push(layer);
      if (layers.length === 1) env.onNonEmpty?.();
      let removed = false;
      return () => {
        if (removed) return;
        removed = true;
        const at = layers.indexOf(layer);
        if (at !== -1) layers.splice(at, 1);
        if (layers.length === 0) env.onEmpty?.();
      };
    },

    dispatch(event) {
      if (event.key !== "Escape") return;
      if (event.defaultPrevented || event.isComposing || event.repeat) return;
      const layer = top();
      if (!layer) return;

      if (!layer.ambient) {
        event.preventDefault();
        layer.handler(event);
        return;
      }

      // שכבת רקע לא מסמנת את האירוע כצרוך: שכבות שאינן במחסנית ירוצו כרגיל.
      // מצב המודאל נדגם בזמן ה-keydown ולא רק אחרי ה-defer: מודאל ששכבה אחרת
      // (תפריט, צ'אט, useModalA11y) סגרה באותו Escape כבר לא קיים ב-DOM כשה-defer
      // רץ, וה-Escape היה סוגר גם את הפופאפ שמאחוריו (F-74, 8.10.2026).
      const modalAtKeydown = env.modalOpen();
      env.defer(() => {
        if (event.defaultPrevented) return;
        if (top() !== layer) return;
        if (modalAtKeydown || env.modalOpen()) return;
        if (!layer.allowInFields && env.isEditable(event.target ?? null)) return;
        layer.handler(event);
      });
    },

    size: () => layers.length,
  };
}

/* ── קשירה לדפדפן ─────────────────────────────────────────────────────────── */

const MODAL_SELECTOR =
  '[role="dialog"][aria-modal="true"]:not([hidden]):not([inert]), dialog[open]';

const NON_TEXT_INPUT_TYPES = new Set([
  "button",
  "checkbox",
  "color",
  "file",
  "image",
  "radio",
  "range",
  "reset",
  "submit",
]);

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target instanceof HTMLTextAreaElement) return true;
  if (target instanceof HTMLSelectElement) return true;
  if (target instanceof HTMLInputElement) {
    return !NON_TEXT_INPUT_TYPES.has(target.type);
  }
  return false;
}

let browserStack: EscapeStack<KeyboardEvent> | null = null;

function onDocumentKeyDown(event: KeyboardEvent) {
  browserStack?.dispatch(event);
}

function getBrowserStack(): EscapeStack<KeyboardEvent> {
  browserStack ??= createEscapeStack<KeyboardEvent>({
    defer: (fn) => {
      window.setTimeout(fn, 0);
    },
    modalOpen: () => document.querySelector(MODAL_SELECTOR) !== null,
    isEditable: isEditableTarget,
    onNonEmpty: () => document.addEventListener("keydown", onDocumentKeyDown),
    onEmpty: () => document.removeEventListener("keydown", onDocumentKeyDown),
  });
  return browserStack;
}

export type EscapeLayerOptions = {
  /** השכבה פתוחה כרגע (לא רק mounted). */
  active: boolean;
  /** נקרא כשהשכבה העליונה צורכת Escape. הרכיב סוגר את עצמו כאן. */
  onEscape: (event: KeyboardEvent) => void;
  /** פופ-אפ שקופץ מעצמו: ראו ההסבר בראש הקובץ. */
  ambient?: boolean;
  /** לשכבת רקע: לצרוך Escape גם כשהמיקוד בשדה טקסט. */
  allowInFields?: boolean;
};

export function useEscapeLayer({
  active,
  onEscape,
  ambient = false,
  allowInFields = false,
}: EscapeLayerOptions): void {
  // ה-onClose של ההורים הוא לרוב חץ חדש בכל רינדור. שומרים אותו ב-ref כדי
  // שהשכבה לא תוסר ותירשם מחדש (ותאבד את מקומה במחסנית) בכל רינדור.
  const onEscapeRef = useRef(onEscape);
  useEffect(() => {
    onEscapeRef.current = onEscape;
  });

  useEffect(() => {
    if (!active) return undefined;
    return getBrowserStack().push({
      handler: (event) => onEscapeRef.current(event),
      ambient,
      allowInFields,
    });
  }, [active, ambient, allowInFields]);
}
