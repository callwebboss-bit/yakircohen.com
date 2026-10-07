import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createScrollLock, nextTrapIndex } from "@/hooks/useModalA11y";

describe("nextTrapIndex (Tab loop)", () => {
  it("returns null when there is nothing to focus", () => {
    assert.equal(nextTrapIndex(0, -1, false), null);
    assert.equal(nextTrapIndex(0, 0, true), null);
  });

  it("Tab from the last control wraps to the first", () => {
    assert.equal(nextTrapIndex(3, 2, false), 0);
  });

  it("Shift+Tab from the first control wraps to the last", () => {
    assert.equal(nextTrapIndex(3, 0, true), 2);
  });

  it("leaves the browser's natural order alone in the middle of the list", () => {
    assert.equal(nextTrapIndex(3, 0, false), null);
    assert.equal(nextTrapIndex(3, 1, false), null);
    assert.equal(nextTrapIndex(3, 1, true), null);
    assert.equal(nextTrapIndex(3, 2, true), null);
  });

  it("pulls focus in from outside the list (body, the dialog itself, the page behind)", () => {
    assert.equal(nextTrapIndex(3, -1, false), 0);
    assert.equal(nextTrapIndex(3, -1, true), 2);
  });

  it("a single control loops onto itself in both directions", () => {
    assert.equal(nextTrapIndex(1, 0, false), 0);
    assert.equal(nextTrapIndex(1, 0, true), 0);
  });
});

function makeLockEnv(initial: Partial<Record<string, string>> = {}) {
  const style = {
    overflow: "",
    position: "",
    top: "",
    width: "",
    ...initial,
  };
  const scrolls: Array<{ top?: number; left?: number; behavior?: string }> = [];
  const win = {
    scrollY: 0,
    scrollTo(options: ScrollToOptions) {
      scrolls.push(options);
    },
  };
  return { style, win, scrolls, lock: createScrollLock({ style }, win) };
}

describe("createScrollLock (ref-counted body scroll lock)", () => {
  it("locks on the first holder and unlocks on the last", () => {
    const { style, lock } = makeLockEnv();
    const releaseA = lock.acquire();
    assert.equal(style.overflow, "hidden");
    assert.equal(lock.count(), 1);
    const releaseB = lock.acquire();
    assert.equal(lock.count(), 2);

    releaseA();
    assert.equal(style.overflow, "hidden", "second holder still holds the lock");
    releaseB();
    assert.equal(style.overflow, "");
    assert.equal(lock.count(), 0);
  });

  it("restores the inline value that was there before the first lock", () => {
    const { style, lock } = makeLockEnv({ overflow: "scroll" });
    const release = lock.acquire();
    assert.equal(style.overflow, "hidden");
    release();
    assert.equal(style.overflow, "scroll");
  });

  it("does not snapshot its own lock when a second holder arrives", () => {
    const { style, lock } = makeLockEnv({ overflow: "auto" });
    const releaseA = lock.acquire();
    const releaseB = lock.acquire();
    releaseB();
    releaseA();
    assert.equal(style.overflow, "auto");
  });

  it("release is idempotent and cannot free another holder's lock", () => {
    const { style, lock } = makeLockEnv();
    const releaseA = lock.acquire();
    const releaseB = lock.acquire();
    releaseA();
    releaseA();
    assert.equal(lock.count(), 1);
    assert.equal(style.overflow, "hidden");
    releaseB();
    assert.equal(style.overflow, "");
  });

  it("fixed mode pins the page at the current scroll and scrolls back, instantly", () => {
    const { style, win, scrolls, lock } = makeLockEnv();
    win.scrollY = 640;
    const release = lock.acquire("fixed");
    assert.equal(style.overflow, "hidden");
    assert.equal(style.position, "fixed");
    assert.equal(style.top, "-640px");
    assert.equal(style.width, "100%");

    release();
    assert.equal(style.overflow, "");
    assert.equal(style.position, "");
    assert.equal(style.top, "");
    assert.equal(style.width, "");
    assert.deepEqual(scrolls, [{ top: 640, left: 0, behavior: "instant" }]);
  });

  it("an overflow-only holder never scrolls the page back", () => {
    const { win, scrolls, lock } = makeLockEnv();
    win.scrollY = 300;
    lock.acquire()();
    assert.deepEqual(scrolls, []);
  });

  it("an overflow holder outliving a fixed holder keeps overflow hidden but drops the fixed pin", () => {
    const { style, win, scrolls, lock } = makeLockEnv();
    win.scrollY = 200;
    const releaseOverflow = lock.acquire("overflow");
    const releaseFixed = lock.acquire("fixed");
    assert.equal(style.position, "fixed");
    assert.equal(style.top, "-200px");

    releaseFixed();
    assert.equal(style.overflow, "hidden");
    assert.equal(style.position, "");
    assert.equal(style.top, "");
    assert.deepEqual(scrolls, [{ top: 200, left: 0, behavior: "instant" }]);

    releaseOverflow();
    assert.equal(style.overflow, "");
  });

  it("a fixed holder outliving an overflow holder stays pinned (no wipe of the other's lock)", () => {
    const { style, win, lock } = makeLockEnv();
    win.scrollY = 90;
    const releaseFixed = lock.acquire("fixed");
    const releaseOverflow = lock.acquire("overflow");

    releaseOverflow();
    assert.equal(style.overflow, "hidden");
    assert.equal(style.position, "fixed");
    assert.equal(style.top, "-90px");

    releaseFixed();
    assert.equal(style.overflow, "");
    assert.equal(style.position, "");
  });

  it("can lock again after a full release", () => {
    const { style, lock } = makeLockEnv();
    lock.acquire()();
    assert.equal(style.overflow, "");
    const release = lock.acquire();
    assert.equal(style.overflow, "hidden");
    release();
    assert.equal(style.overflow, "");
  });
});
