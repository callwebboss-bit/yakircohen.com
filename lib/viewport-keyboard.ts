/**
 * זיהוי מקלדת פתוחה / מילוי שדה, מקור אחד לפס הפעולה התחתון ולמנהל הפופאפים.
 *
 * שני אותות, כי אף אחד מהם לבדו לא מספיק:
 * - visualViewport מתכווץ כשהמקלדת עולה (iOS Safari ו-Chrome באנדרואיד). הוא
 *   מגיע באיחור של כמה עשרות אלפיות שנייה אחרי הפוקוס, ובמקלדת חומרה (אייפד)
 *   לא מתכווץ בכלל.
 * - פוקוס על שדה עריכה במסך צר או במגע. מגיע מיד, ולכן הפס לא "קופץ" מעל
 *   המקלדת לרגע לפני שהוא נעלם.
 *
 * הכיווץ נמדד מול scale כדי ש-pinch-zoom לא ייחשב מקלדת: בזום, height קטן
 * אבל height * scale נשאר כגובת החלון.
 */

const KEYBOARD_MIN_PX = 120;
/** מקלדת וירטואלית שאינה מופיעה: כפתורים, תיבות סימון וכדומה */
const NON_TEXT_INPUT_TYPES = new Set([
  "button",
  "checkbox",
  "color",
  "file",
  "hidden",
  "image",
  "radio",
  "range",
  "reset",
  "submit",
]);
/** השהיה אחרי focusout: מעבר בין שני שדות לא צריך להבהב כ"מקלדת נסגרה" */
const FOCUSOUT_SETTLE_MS = 60;

export function isEditableElement(el: Element | null): boolean {
  if (!el) return false;
  if (el instanceof HTMLTextAreaElement) return !el.readOnly && !el.disabled;
  if (el instanceof HTMLInputElement) {
    return !NON_TEXT_INPUT_TYPES.has(el.type) && !el.readOnly && !el.disabled;
  }
  if (el instanceof HTMLSelectElement) return !el.disabled;
  return el instanceof HTMLElement && el.isContentEditable;
}

function measureKeyboardOpen(): boolean {
  if (typeof window === "undefined") return false;
  const vv = window.visualViewport;
  const shrunk = vv
    ? window.innerHeight - vv.height * vv.scale > KEYBOARD_MIN_PX
    : false;
  if (shrunk) return true;
  const touchOrNarrow = window.matchMedia(
    "(max-width: 767px), (pointer: coarse)",
  ).matches;
  return touchOrNarrow && isEditableElement(document.activeElement);
}

let current = false;
const listeners = new Set<() => void>();
let detach: (() => void) | null = null;
let settleTimer: ReturnType<typeof setTimeout> | undefined;

function update() {
  const next = measureKeyboardOpen();
  if (next === current) return;
  current = next;
  listeners.forEach((l) => l());
}

function attach() {
  const onFocusIn = () => {
    if (settleTimer) clearTimeout(settleTimer);
    update();
  };
  const onFocusOut = () => {
    if (settleTimer) clearTimeout(settleTimer);
    settleTimer = setTimeout(update, FOCUSOUT_SETTLE_MS);
  };
  const vv = window.visualViewport;
  document.addEventListener("focusin", onFocusIn);
  document.addEventListener("focusout", onFocusOut);
  vv?.addEventListener("resize", update);
  window.addEventListener("resize", update);
  return () => {
    if (settleTimer) clearTimeout(settleTimer);
    document.removeEventListener("focusin", onFocusIn);
    document.removeEventListener("focusout", onFocusOut);
    vv?.removeEventListener("resize", update);
    window.removeEventListener("resize", update);
  };
}

export function subscribeKeyboard(listener: () => void): () => void {
  listeners.add(listener);
  if (!detach) detach = attach();
  update();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && detach) {
      detach();
      detach = null;
      current = false;
    }
  };
}

export function getKeyboardSnapshot(): boolean {
  return current;
}
