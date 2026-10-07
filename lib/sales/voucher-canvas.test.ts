import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { alphaHasInk, canvasHasInk, LOGO_MIN_INK, memoUnlessFailed, tintImage } from "@/lib/sales/voucher-canvas";

/* בדיקת הלוגו 7.10.2026: לוגו שלא נטען לא נשמר לכל חיי העמוד, ורסטר ריק לא נחשב לוגו */

/** RGBA של pixels פיקסלים, inked מהם באטימות alpha */
function rgba(pixels: number, inked: number, alpha = 255): Uint8ClampedArray {
  const data = new Uint8ClampedArray(pixels * 4);
  for (let i = 0; i < inked; i += 1) data[i * 4 + 3] = alpha;
  return data;
}

describe("alphaHasInk", () => {
  it("an empty or fully transparent raster has no ink", () => {
    assert.equal(alphaHasInk(new Uint8ClampedArray(0)), false);
    assert.equal(alphaHasInk(rgba(1000, 0)), false);
  });

  it("counts only pixels at half opacity or more", () => {
    assert.equal(alphaHasInk(rgba(1000, 1000, 127)), false);
    assert.equal(alphaHasInk(rgba(1000, 1000, 128)), true);
  });

  it("the bar is LOGO_MIN_INK of the area", () => {
    const pixels = 10_000;
    const needed = Math.ceil(pixels * LOGO_MIN_INK);
    assert.equal(alphaHasInk(rgba(pixels, needed - 1)), false);
    assert.equal(alphaHasInk(rgba(pixels, needed)), true);
  });

  it("the real logo (about 17% ink in Chromium) passes easily", () => {
    assert.equal(alphaHasInk(rgba(720 * 361, Math.round(720 * 361 * 0.17))), true);
  });
});

describe("canvasHasInk", () => {
  it("no canvas, no context, or a read that throws: false", () => {
    assert.equal(canvasHasInk(null), false);
    const noContext = { width: 10, height: 10, getContext: () => null } as unknown as HTMLCanvasElement;
    assert.equal(canvasHasInk(noContext), false);
    const tainted = {
      width: 10,
      height: 10,
      getContext: () => ({
        getImageData: () => {
          throw new Error("SecurityError");
        },
      }),
    } as unknown as HTMLCanvasElement;
    assert.equal(canvasHasInk(tainted), false);
  });

  it("reads the whole canvas and decides by ink", () => {
    const make = (inked: number) =>
      ({
        width: 10,
        height: 10,
        getContext: () => ({ getImageData: () => ({ data: rgba(100, inked) }) }),
      }) as unknown as HTMLCanvasElement;
    assert.equal(canvasHasInk(make(0)), false);
    assert.equal(canvasHasInk(make(50)), true);
  });
});

describe("tintImage", () => {
  const realDocument = (globalThis as { document?: unknown }).document;
  afterEach(() => {
    (globalThis as { document?: unknown }).document = realDocument;
  });

  it("without a 2d context returns null, not a blank canvas", () => {
    (globalThis as { document?: unknown }).document = {
      createElement: () => ({ width: 0, height: 0, getContext: () => null }),
    };
    assert.equal(tintImage({} as CanvasImageSource, "#c9a46c", 720, 360), null);
  });
});

describe("memoUnlessFailed", () => {
  it("a good load is kept: the second call does not load again", async () => {
    let calls = 0;
    const load = memoUnlessFailed(async () => {
      calls += 1;
      return { ok: true };
    }, (v) => v.ok);
    await load();
    await load();
    assert.equal(calls, 1);
  });

  it("calls during a load share the same promise", async () => {
    let calls = 0;
    const load = memoUnlessFailed(async () => {
      calls += 1;
      return { ok: false };
    }, (v) => v.ok);
    const a = load();
    const b = load();
    assert.equal(a, b);
    await a;
    assert.equal(calls, 1);
  });

  it("a failed result is forgotten and the next call loads again", async () => {
    const results = [false, true];
    let calls = 0;
    const load = memoUnlessFailed(async () => ({ ok: results[calls++] }), (v) => v.ok);
    assert.equal((await load()).ok, false);
    assert.equal((await load()).ok, true);
    assert.equal((await load()).ok, true);
    assert.equal(calls, 2);
  });

  it("a rejection is forgotten and the next call loads again", async () => {
    let calls = 0;
    const load = memoUnlessFailed(async () => {
      calls += 1;
      if (calls === 1) throw new Error("network");
      return { ok: true };
    }, (v) => v.ok);
    await assert.rejects(load());
    assert.equal((await load()).ok, true);
    assert.equal(calls, 2);
  });
});
