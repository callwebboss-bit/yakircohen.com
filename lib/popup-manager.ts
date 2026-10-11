/**
 * מנהל פופאפים יחיד לכל האתר. מחליף את lib/bottom-overlay-slot.ts, שתיאם רק
 * את הסרגלים התחתונים (שחזור טיוטה, מאתר מתנה, התקנה) ולא את מה שנפתח מעליהם.
 *
 * הכללים, כולם כאן ובשום מקום אחר:
 * 1. פופאפ אחד פעיל בכל רגע.
 * 2. לא לפני 25 שניות באתר, או 40 אחוז גלילה בעמוד. הראשון מביניהם פותח את השער.
 * 3. מקסימום אחד לכל ביקור. נספר מרגע שפופאפ הוצג, גם אם נסגר או נעלם בניווט.
 * 4. במובייל, לא בזמן מילוי טופס: מקלדת פתוחה או שדה בפוקוס (ועוד חמש שניות
 *    אחרי). פופאפ שכבר על המסך מוסתר באותו זמן וחוזר כשהמילוי נגמר.
 * 5. סגירה נשמרת 30 יום, לפי פופאפ (ולפי `scope` כשהסגירה היא על פריט ספציפי,
 *    כמו טיוטה מסוימת).
 *
 * הרכיבים לא סופרים זמן, לא מודדים גלילה ולא קוראים localStorage בעצמם. הם
 * רושמים מועמדות דרך usePopupSlot ומציגים רק כש-`visible` נכון.
 */

import { getKeyboardSnapshot, subscribeKeyboard } from "@/lib/viewport-keyboard";

export type PopupId = "pwa" | "gift" | "rescuer" | "wizard-exit" | "wizard-idle";

/**
 * eligible: מחכה בתור עד שהשער נפתח (התקנה, מתנות, שחזור טיוטה).
 * now: נבדק פעם אחת ברגע הרישום ונזרק אם אי אפשר להציג אותו עכשיו. מיועד
 * לפופאפ שהרגע שלו חולף, כמו יציאה מהאשף. בלי זה הוא היה קופץ דקה אחרי
 * שהגולש כבר חזר לעבודה.
 */
export type PopupMode = "eligible" | "now";

export const POPUP_MIN_DWELL_MS = 25_000;
export const POPUP_MIN_SCROLL_RATIO = 0.4;
export const POPUP_DISMISS_MS = 30 * 24 * 60 * 60 * 1000;
export const POPUP_FORM_GRACE_MS = 5_000;

const MOBILE_QUERY = "(max-width: 767px)";
const DISMISS_PREFIX = "yc_popup_dismissed:";
const VISIT_KEY = "yc_popup_visit_shown";
/** מפתחות ישנים, בפורמט "עד מתי" במילישניות. נקראים בלבד, כך שמי שסגר לפני
    המעבר לא רואה את הפופאפ שוב. */
const LEGACY_DISMISS_KEYS: Partial<Record<PopupId, string>> = {
  pwa: "pwa-install-dismissed-until",
  gift: "yc_gift_finder_snooze",
};

type StorageLike = Pick<Storage, "getItem" | "setItem">;

export type PopupCandidate = {
  key: string;
  id: PopupId;
  scope?: string;
  priority: number;
  mode: PopupMode;
  order: number;
};

export function popupKey(id: PopupId, scope?: string): string {
  return scope ? `${id}:${scope}` : id;
}

/* ───────────── כללים טהורים (נבדקים ב-popup-manager.test.ts) ───────────── */

export type GateInput = {
  dwellMs: number;
  scrollRatio: number;
  shownThisVisit: boolean;
  /** מובייל וגם מילוי טופס. החישוב נעשה מחוץ לפונקציה כדי שתישאר טהורה. */
  mobileFormBusy: boolean;
};

export function isGateOpen(input: GateInput): boolean {
  if (input.shownThisVisit) return false;
  if (input.mobileFormBusy) return false;
  return (
    input.dwellMs >= POPUP_MIN_DWELL_MS ||
    input.scrollRatio >= POPUP_MIN_SCROLL_RATIO
  );
}

export function pickCandidate(
  candidates: readonly PopupCandidate[],
  isDismissed: (candidate: PopupCandidate) => boolean,
): PopupCandidate | null {
  let best: PopupCandidate | null = null;
  for (const candidate of candidates) {
    if (isDismissed(candidate)) continue;
    if (
      !best ||
      candidate.priority > best.priority ||
      (candidate.priority === best.priority && candidate.order < best.order)
    ) {
      best = candidate;
    }
  }
  return best;
}

function parseUntil(raw: string | null): number {
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function readDismissedUntil(
  id: PopupId,
  scope: string | undefined,
  storage: StorageLike,
): number {
  let until = parseUntil(storage.getItem(DISMISS_PREFIX + popupKey(id, scope)));
  const legacyKey = scope ? undefined : LEGACY_DISMISS_KEYS[id];
  if (legacyKey) until = Math.max(until, parseUntil(storage.getItem(legacyKey)));
  return until;
}

export function writeDismissed(
  id: PopupId,
  scope: string | undefined,
  now: number,
  storage: StorageLike,
): void {
  storage.setItem(
    DISMISS_PREFIX + popupKey(id, scope),
    String(now + POPUP_DISMISS_MS),
  );
}

/* ───────────────────────────── מאגר ריצה ───────────────────────────── */

type Snapshot = { activeKey: string | null; suppressed: boolean };

const SERVER_SNAPSHOT: Snapshot = { activeKey: null, suppressed: false };
let snapshot: Snapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();
const candidates = new Map<string, PopupCandidate>();
let orderCounter = 0;

let runtimeStartedAt: number | null = null;
let scrollRatio = 0;
let lastPath: string | null = null;
let formBusyUntil = 0;
let evaluateQueued = false;

function safeStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function visitShown(): boolean {
  try {
    return window.sessionStorage.getItem(VISIT_KEY) === "1";
  } catch {
    return visitShownFallback;
  }
}

/** גיבוי לזיכרון כש-sessionStorage חסום, כדי ש"אחד לביקור" יישמר לפחות עד רענון */
let visitShownFallback = false;

function markVisitShown() {
  visitShownFallback = true;
  try {
    window.sessionStorage.setItem(VISIT_KEY, "1");
  } catch {
    /* ignore */
  }
}

function isDismissed(candidate: PopupCandidate, now: number): boolean {
  const storage = safeStorage();
  if (!storage) return false;
  try {
    return readDismissedUntil(candidate.id, candidate.scope, storage) > now;
  } catch {
    return false;
  }
}

function isMobileViewport(): boolean {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function emit(next: Snapshot) {
  if (next.activeKey === snapshot.activeKey && next.suppressed === snapshot.suppressed) {
    return;
  }
  snapshot = next;
  listeners.forEach((l) => l());
}

function evaluate() {
  evaluateQueued = false;
  if (typeof window === "undefined" || runtimeStartedAt === null) return;
  const now = Date.now();
  const mobileFormBusy =
    isMobileViewport() && (getKeyboardSnapshot() || now < formBusyUntil);

  let next = snapshot;
  if (next.activeKey && !candidates.has(next.activeKey)) {
    next = { activeKey: null, suppressed: false };
  }
  if (next.activeKey && next.suppressed !== mobileFormBusy) {
    next = { activeKey: next.activeKey, suppressed: mobileFormBusy };
  }

  if (!next.activeKey) {
    const open = isGateOpen({
      dwellMs: now - runtimeStartedAt,
      scrollRatio,
      shownThisVisit: visitShown(),
      mobileFormBusy,
    });
    if (open) {
      const pick = pickCandidate([...candidates.values()], (c) =>
        isDismissed(c, now),
      );
      if (pick) {
        next = { activeKey: pick.key, suppressed: false };
        markVisitShown();
      }
    }
  }
  /* מועמד "now" נבדק פעם אחת. מי שלא נבחר בסבב הזה כבר לא רלוונטי, גם כשפופאפ
     אחר פעיל. */
  for (const c of [...candidates.values()]) {
    if (c.mode === "now" && c.key !== next.activeKey) candidates.delete(c.key);
  }
  emit(next);
}

/** microtask ולא קריאה סינכרונית: ב-StrictMode האפקט נרשם, מתנקה ונרשם שוב,
    וקריאה סינכרונית הייתה מבזבזת את "אחד לביקור" על הרישום הראשון. */
function scheduleEvaluate() {
  if (evaluateQueued) return;
  evaluateQueued = true;
  queueMicrotask(evaluate);
}

export function registerPopup(input: {
  id: PopupId;
  scope?: string;
  priority: number;
  mode?: PopupMode;
}): () => void {
  const key = popupKey(input.id, input.scope);
  candidates.set(key, {
    key,
    id: input.id,
    scope: input.scope,
    priority: input.priority,
    mode: input.mode ?? "eligible",
    order: orderCounter++,
  });
  scheduleEvaluate();
  return () => {
    candidates.delete(key);
    scheduleEvaluate();
  };
}

/** מסתיר ומשחרר בלי לשמור סגירה, למשל בניווט. "אחד לביקור" כבר נספר. */
export function releasePopup(id: PopupId, scope?: string): void {
  if (snapshot.activeKey === popupKey(id, scope)) {
    emit({ activeKey: null, suppressed: false });
  }
}

/** סגירה על ידי הגולש: נשמרת 30 יום ומשחררת את המשבצת. */
export function dismissPopup(id: PopupId, scope?: string): void {
  const storage = safeStorage();
  if (storage) {
    try {
      writeDismissed(id, scope, Date.now(), storage);
    } catch {
      /* מצב פרטי: הסגירה תחזיק לביקור הזה בלבד */
    }
  }
  candidates.delete(popupKey(id, scope));
  releasePopup(id, scope);
}

/** האם הפופאפ נסגר ב-30 הימים האחרונים. לבדיקות מקדימות של רכיב, לפני שהוא
    מתחבר למשהו חיצוני כמו beforeinstallprompt. */
export function isPopupDismissed(id: PopupId, scope?: string): boolean {
  return isDismissed(
    { key: popupKey(id, scope), id, scope, priority: 0, mode: "eligible", order: 0 },
    Date.now(),
  );
}

export function subscribePopups(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getPopupSnapshot(): Snapshot {
  return snapshot;
}

export function getPopupServerSnapshot(): Snapshot {
  return SERVER_SNAPSHOT;
}

/* ───────────────────── חיווט הדפדפן: זמן, גלילה, ניווט, מילוי ───────────────────── */

function measureScrollRatio(): number {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  return window.scrollY / max;
}

/** מתחיל מדידה. נקרא פעם אחת מ-PopupManagerRuntime, ומחזיר ניקוי. */
export function startPopupRuntime(): () => void {
  if (runtimeStartedAt === null) runtimeStartedAt = Date.now();
  scrollRatio = Math.max(scrollRatio, measureScrollRatio());

  let rafId = 0;
  const onScroll = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = 0;
      const before = scrollRatio;
      scrollRatio = Math.max(scrollRatio, measureScrollRatio());
      if (before < POPUP_MIN_SCROLL_RATIO && scrollRatio >= POPUP_MIN_SCROLL_RATIO) {
        scheduleEvaluate();
      }
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  const dwellTimer = window.setTimeout(
    scheduleEvaluate,
    Math.max(0, POPUP_MIN_DWELL_MS - (Date.now() - runtimeStartedAt)) + 50,
  );

  let graceTimer: ReturnType<typeof setTimeout> | undefined;
  const unsubscribeKeyboard = subscribeKeyboard(() => {
    if (graceTimer) clearTimeout(graceTimer);
    if (getKeyboardSnapshot()) {
      formBusyUntil = Number.POSITIVE_INFINITY;
    } else {
      formBusyUntil = Date.now() + POPUP_FORM_GRACE_MS;
      graceTimer = setTimeout(scheduleEvaluate, POPUP_FORM_GRACE_MS + 50);
    }
    scheduleEvaluate();
  });

  scheduleEvaluate();
  return () => {
    window.removeEventListener("scroll", onScroll);
    if (rafId) window.cancelAnimationFrame(rafId);
    window.clearTimeout(dwellTimer);
    if (graceTimer) clearTimeout(graceTimer);
    unsubscribeKeyboard();
  };
}

/** לבדיקות בלבד: מאפס את כל מצב המודול בין תרחישים. */
export function resetPopupManagerForTests(): void {
  candidates.clear();
  snapshot = SERVER_SNAPSHOT;
  runtimeStartedAt = null;
  scrollRatio = 0;
  lastPath = null;
  formBusyUntil = 0;
  evaluateQueued = false;
  visitShownFallback = false;
}

/** ניווט בתוך האתר: הגלילה נמדדת מחדש לעמוד החדש. הזמן והביקור לא מתאפסים. */
export function notifyPopupRoute(pathname: string): void {
  if (lastPath === pathname) return;
  const firstCall = lastPath === null;
  lastPath = pathname;
  if (firstCall) return;
  /* 0 ולא מדידה: ברגע הניווט עדיין עשויה להישאר גלילה של העמוד הקודם. מאזין
     הגלילה ימדוד את העמוד החדש. */
  scrollRatio = 0;
  scheduleEvaluate();
}
