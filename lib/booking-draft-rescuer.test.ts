import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";
import { scanBookingDrafts, sessionRescuerDismissKey } from "@/lib/booking-draft-rescuer";

const STORAGE_PREFIX = "yakir-booking-draft:";
const DRAFT_VERSION = 2;

function makeStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
    removeItem: (key: string) => {
      map.delete(key);
    },
    clear: () => map.clear(),
    key: (i: number) => [...map.keys()][i] ?? null,
    get length() {
      return map.size;
    },
  };
}

function writeDraft(
  storage: ReturnType<typeof makeStorage>,
  key: string,
  data: unknown,
  savedAt: string,
) {
  storage.setItem(
    STORAGE_PREFIX + key,
    JSON.stringify({ v: DRAFT_VERSION, savedAt, data }),
  );
}

describe("scanBookingDrafts", () => {
  let storage: ReturnType<typeof makeStorage>;
  let originalLocalStorage: Storage | undefined;
  let originalWindow: typeof globalThis.window | undefined;

  beforeEach(() => {
    storage = makeStorage();
    originalLocalStorage = globalThis.localStorage;
    originalWindow = globalThis.window;
    Object.defineProperty(globalThis, "localStorage", {
      value: storage,
      configurable: true,
    });
    Object.defineProperty(globalThis, "window", {
      value: globalThis,
      configurable: true,
    });
  });

  afterEach(() => {
    if (originalLocalStorage !== undefined) {
      Object.defineProperty(globalThis, "localStorage", {
        value: originalLocalStorage,
        configurable: true,
      });
    }
    if (originalWindow !== undefined) {
      Object.defineProperty(globalThis, "window", {
        value: originalWindow,
        configurable: true,
      });
    } else {
      // @ts-expect-error test cleanup
      delete globalThis.window;
    }
  });

  it("returns null when no drafts with step >= 1", () => {
    writeDraft(storage, "podcast", { packageId: "audio", step: 0 }, "2026-01-01T00:00:00.000Z");
    assert.equal(scanBookingDrafts(), null);
  });

  it("picks newest draft with package label and resume href", () => {
    writeDraft(
      storage,
      "podcast",
      { packageId: "audio", step: 1 },
      "2026-01-01T10:00:00.000Z",
    );
    writeDraft(
      storage,
      "singer_amplification",
      { packageId: "premium", step: 2 },
      "2026-01-02T10:00:00.000Z",
    );

    const found = scanBookingDrafts();
    assert.ok(found);
    assert.equal(found!.category, "singer");
    assert.equal(found!.packageLabel, "חבילה 2: פרימיום");
    assert.equal(found!.step, 2);
    assert.match(found!.resumeHref, /#singer\/step\/2$/);
  });

  it("sessionRescuerDismissKey is per category", () => {
    assert.equal(sessionRescuerDismissKey("studio"), "yc_session_rescuer_dismissed:studio");
    assert.notEqual(sessionRescuerDismissKey("studio"), sessionRescuerDismissKey("events"));
  });
});
