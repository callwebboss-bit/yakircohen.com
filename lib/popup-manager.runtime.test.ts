import assert from "node:assert/strict";
import { before, beforeEach, describe, it } from "node:test";

/**
 * בדיקת אינטגרציה של זמן הריצה של מנהל הפופאפים: שעון, גלילה, מקלדת ואחסון
 * מדומים. נכתבה כי בדפדפן המוסתר של הסשן אירועי גלילה ו-requestAnimationFrame
 * לא רצים, ולכן אי אפשר להפריד שם את שער הגלילה משער הזמן.
 */

type Listener = () => void;

function makeStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    clear: () => map.clear(),
  };
}

let now = 1_000_000;
let timers: { at: number; cb: () => void; id: number }[] = [];
let nextTimerId = 1;
const winListeners = new Map<string, Set<Listener>>();
const docListeners = new Map<string, Set<Listener>>();
const local = makeStorage();
const session = makeStorage();
const fakeWindow: Record<string, unknown> = {
  innerHeight: 800,
  scrollY: 0,
  visualViewport: undefined,
  matchMedia: () => ({ matches: true }),
  localStorage: local,
  sessionStorage: session,
  addEventListener: (t: string, l: Listener) => {
    if (!winListeners.has(t)) winListeners.set(t, new Set());
    winListeners.get(t)!.add(l);
  },
  removeEventListener: (t: string, l: Listener) => winListeners.get(t)?.delete(l),
  requestAnimationFrame: (cb: () => void) => {
    const id = nextTimerId++;
    timers.push({ at: now, cb, id });
    return id;
  },
  cancelAnimationFrame: (id: number) => {
    timers = timers.filter((t) => t.id !== id);
  },
  setTimeout: (cb: () => void, ms = 0) => {
    const id = nextTimerId++;
    timers.push({ at: now + ms, cb, id });
    return id;
  },
  clearTimeout: (id: number) => {
    timers = timers.filter((t) => t.id !== id);
  },
};
const fakeDocument = {
  documentElement: { scrollHeight: 4800 },
  activeElement: null,
  addEventListener: (t: string, l: Listener) => {
    if (!docListeners.has(t)) docListeners.set(t, new Set());
    docListeners.get(t)!.add(l);
  },
  removeEventListener: (t: string, l: Listener) => docListeners.get(t)?.delete(l),
};

Object.assign(globalThis, {
  window: fakeWindow,
  document: fakeDocument,
  setTimeout: fakeWindow.setTimeout,
  clearTimeout: fakeWindow.clearTimeout,
});
Date.now = () => now;

let mod: typeof import("@/lib/popup-manager");

before(async () => {
  mod = await import("@/lib/popup-manager");
});

async function flush() {
  await Promise.resolve();
  await Promise.resolve();
}

/** מריץ טיימרים שהגיע זמנם, ומקדם את השעון */
async function advance(ms: number) {
  const target = now + ms;
  for (;;) {
    const due = timers.filter((t) => t.at <= target).sort((a, b) => a.at - b.at)[0];
    if (!due) break;
    timers = timers.filter((t) => t !== due);
    now = Math.max(now, due.at);
    due.cb();
    await flush();
  }
  now = target;
  await flush();
}

async function scrollTo(ratio: number) {
  fakeWindow.scrollY = Math.round((4800 - 800) * ratio);
  winListeners.get("scroll")?.forEach((l) => l());
  await advance(20);
}

function active() {
  return mod.getPopupSnapshot();
}

let stopRuntime: () => void = () => {};

beforeEach(() => {
  stopRuntime();
  mod.resetPopupManagerForTests();
  local.clear();
  session.clear();
  timers = [];
  winListeners.clear();
  docListeners.clear();
  fakeWindow.scrollY = 0;
  fakeWindow.visualViewport = undefined;
  fakeDocument.activeElement = null;
});

async function start() {
  stopRuntime = mod.startPopupRuntime();
  await flush();
}

describe("שער הזמן והגלילה (זמן ריצה)", () => {
  it("לא מציג לפני 25 שניות או 40 אחוז גלילה", async () => {
    await start();
    mod.registerPopup({ id: "gift", priority: 20 });
    await advance(24_000);
    assert.equal(active().activeKey, null);
    await scrollTo(0.39);
    assert.equal(active().activeKey, null);
  });

  it("נפתח ב-40 אחוז גלילה לפני שעברו 25 שניות", async () => {
    await start();
    mod.registerPopup({ id: "gift", priority: 20 });
    await advance(3_000);
    await scrollTo(0.3);
    assert.equal(active().activeKey, null);
    await scrollTo(0.41);
    assert.equal(active().activeKey, "gift");
  });

  it("נפתח אחרי 25 שניות גם בלי גלילה", async () => {
    await start();
    mod.registerPopup({ id: "gift", priority: 20 });
    await advance(24_000);
    assert.equal(active().activeKey, null);
    await advance(2_000);
    assert.equal(active().activeKey, "gift");
  });

  it("ניווט מאפס את מד הגלילה לעמוד החדש", async () => {
    await start();
    await scrollTo(0.3);
    mod.notifyPopupRoute("/a");
    mod.notifyPopupRoute("/b");
    mod.registerPopup({ id: "gift", priority: 20 });
    await scrollTo(0.1);
    assert.equal(active().activeKey, null);
    await scrollTo(0.45);
    assert.equal(active().activeKey, "gift");
  });
});

describe("פופאפ אחד בכל רגע ואחד לביקור", () => {
  it("בוחר את העדיפות הגבוהה, ושני לא נפתח אחרי הסגירה", async () => {
    await start();
    mod.registerPopup({ id: "pwa", priority: 10 });
    mod.registerPopup({ id: "gift", priority: 20 });
    await scrollTo(0.5);
    assert.equal(active().activeKey, "gift");
    mod.dismissPopup("gift");
    await advance(60_000);
    assert.equal(active().activeKey, null, "ההתקנה לא קופצת באותו ביקור");
    assert.equal(session.getItem("yc_popup_visit_shown"), "1");
  });

  it("ביקור חדש אחרי סגירה: הפופאפ השני כן מוצג", async () => {
    await start();
    mod.registerPopup({ id: "pwa", priority: 10 });
    mod.registerPopup({ id: "gift", priority: 20 });
    await scrollTo(0.5);
    mod.dismissPopup("gift");
    stopRuntime();
    mod.resetPopupManagerForTests();
    session.clear();
    await start();
    mod.registerPopup({ id: "pwa", priority: 10 });
    mod.registerPopup({ id: "gift", priority: 20 });
    await scrollTo(0.5);
    assert.equal(active().activeKey, "pwa", "המתנות סגור ל-30 יום, ההתקנה מוצגת");
  });

  it("מועמד now נזרק אם אי אפשר להציג אותו כרגע", async () => {
    await start();
    mod.registerPopup({ id: "wizard-exit", priority: 50, mode: "now" });
    await advance(100);
    await scrollTo(0.5);
    assert.equal(active().activeKey, null, "השער היה סגור ברגע הרישום");
  });
});

describe("סגירה ל-30 יום", () => {
  it("סגירה בעבר מונעת הצגה", async () => {
    await start();
    local.setItem("yc_popup_dismissed:gift", String(now + 86_400_000));
    mod.registerPopup({ id: "gift", priority: 20 });
    await scrollTo(0.9);
    assert.equal(active().activeKey, null);
  });

  it("סגירה שפגה לא מונעת הצגה", async () => {
    await start();
    local.setItem("yc_popup_dismissed:gift", String(now - 1));
    mod.registerPopup({ id: "gift", priority: 20 });
    await scrollTo(0.9);
    assert.equal(active().activeKey, "gift");
  });

  it("המפתח הישן של מאתר המתנות עדיין נחשב", async () => {
    await start();
    local.setItem("yc_gift_finder_snooze", String(now + 86_400_000));
    mod.registerPopup({ id: "gift", priority: 20 });
    await scrollTo(0.9);
    assert.equal(active().activeKey, null);
  });
});

describe("מובייל בזמן מילוי טופס", () => {
  function keyboard(open: boolean) {
    fakeWindow.visualViewport = open
      ? { height: 380, scale: 1, addEventListener() {}, removeEventListener() {} }
      : undefined;
    winListeners.get("resize")?.forEach((l) => l());
  }

  it("לא נפתח כשהמקלדת פתוחה, גם כשהגלילה מספיקה", async () => {
    await start();
    mod.registerPopup({ id: "gift", priority: 20 });
    keyboard(true);
    await scrollTo(0.9);
    assert.equal(active().activeKey, null);
  });

  it("פופאפ גלוי מוסתר כשהמקלדת עולה וחוזר 5 שניות אחרי שנסגרה", async () => {
    await start();
    mod.registerPopup({ id: "gift", priority: 20 });
    await scrollTo(0.9);
    assert.equal(active().activeKey, "gift");
    assert.equal(active().suppressed, false);
    keyboard(true);
    await advance(100);
    assert.equal(active().suppressed, true);
    keyboard(false);
    await advance(100);
    assert.equal(active().suppressed, true, "בתוך חמש שניות החסד");
    await advance(5_100);
    assert.equal(active().suppressed, false);
    assert.equal(active().activeKey, "gift");
  });

  it("בדסקטופ מילוי טופס לא חוסם", async () => {
    fakeWindow.matchMedia = () => ({ matches: false });
    try {
      await start();
      mod.registerPopup({ id: "gift", priority: 20 });
      keyboard(true);
      await scrollTo(0.9);
      assert.equal(active().activeKey, "gift");
    } finally {
      fakeWindow.matchMedia = () => ({ matches: true });
    }
  });
});
