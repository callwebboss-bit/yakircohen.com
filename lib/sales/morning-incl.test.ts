/* החלטת הבעלים 12.10.2026, שורות כולל מע״מ למורנינג: סך השורות שווה בדיוק
   לסכום שהאתר והוואטסאפ מציגים, וכל שורה בשקלים שלמים */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { catalogWithVat, getExVat } from "@/lib/data/pricing-catalog";
import { EVENT_GIFT_THRESHOLD } from "@/lib/data/events-booking";
import { morningInclLines, type MorningInclLine } from "@/lib/sales/morning-incl";
import { buildSalesBook, type SalesCard } from "@/lib/sales/sales-book";
import { buildSelectionQuote, selectionOptions, type SelectionInput } from "@/lib/sales/selection-quote";

const { cards } = buildSalesBook();
function card(id: string): SalesCard {
  const found = cards.find((c) => c.id === id);
  assert.ok(found, id);
  return found;
}

function sum(lines: readonly MorningInclLine[]): number {
  return lines.reduce((s, l) => s + l.amountInclVat, 0);
}

function assertIncl(lines: readonly MorningInclLine[], total: number, label: string): void {
  assert.ok(lines.length > 0, label);
  assert.equal(sum(lines), total, label);
  for (const l of lines) {
    assert.ok(Number.isInteger(l.amountInclVat), `${label}: ${l.id} ${l.amountInclVat}`);
    assert.equal(l.qty, 1, label);
  }
}

describe("morningInclLines", () => {
  it("each line is the rounded withVat of its subtotal, the last absorbs the rounding", () => {
    const base = { id: "a", label: "בסיס", qty: 1, unitExVat: getExVat("blessing_recording") };
    const extra = { id: "b", label: "דובר", qty: 3, unitExVat: getExVat("blessing_extra_participant") };
    const total = catalogWithVat(base.unitExVat + extra.qty * extra.unitExVat);
    const out = morningInclLines([base, extra], total);
    assert.equal(out[0].amountInclVat, catalogWithVat(base.unitExVat));
    assert.equal(out[1].label, "דובר ×3");
    assert.equal(sum(out), total);
  });

  it("empty input gives no lines", () => {
    assert.deepEqual(morningInclLines([], 0), []);
  });
});

describe("sales book: incl-VAT lines sum to the card and combo totals", () => {
  it("every card base line equals card.inclVat", () => {
    for (const c of cards) assertIncl(c.morningInclLines, c.inclVat, c.id);
  });

  it("every combo sums to its totalInclVat", () => {
    let count = 0;
    for (const c of cards) {
      for (const combo of c.combos) {
        assertIncl(combo.morningInclLines, combo.totalInclVat, `${c.id}/${combo.key}`);
        count += 1;
      }
    }
    assert.ok(count > 20, String(count));
  });
});

describe("selection quote: incl-VAT lines sum to totalInclVat", () => {
  const cases: [string, SelectionInput][] = [
    ["song_recording", { addonIds: ["song_pitch_coaching", "studio_session_clip_edited"], participants: 3 }],
    ["song_recording", { addonIds: ["song_pitch_coaching"], participants: 12 }],
    ["blessing_recording", { addonIds: [], participants: 4 }],
    ["studio_remote", { addonIds: [], participants: 2 }],
    ["podcast_audio", { addonIds: [], participants: 5 }],
    ["dj_premium", { addonIds: [], region: "north_south" }],
    ["dj_premium", { addonIds: [], region: "eilat" }],
    ["mobile_podcast_at_home", { addonIds: [], participants: 4, region: "center" }],
    ["mobile_podcast_at_home", { addonIds: [], participants: 4, region: "north_south" }],
    ["event_attraction_1", { addonIds: [], attractionsCount: 2, activations: 3 }],
    ["event_attraction_1", { addonIds: [], attractionsCount: EVENT_GIFT_THRESHOLD }],
  ];

  for (const [id, input] of cases) {
    it(`${id} ${JSON.stringify(input)}`, () => {
      const q = buildSelectionQuote(card(id), input);
      assertIncl(q.morningInclLines, q.totalInclVat, id);
      assert.equal(q.totalInclVat, catalogWithVat(q.totalExVat));
    });
  }

  it("every card with all of its addons, every participant count and region", () => {
    for (const c of cards) {
      const options = selectionOptions(c);
      const addonIds = options.addons.map((a) => a.id);
      const counts = options.participants
        ? Array.from({ length: options.participants.max - options.participants.min + 1 }, (_, i) => options.participants!.min + i)
        : [null];
      const regions = options.regions ? options.regions.map((r) => r.id) : [null];
      for (const participants of counts) {
        for (const region of regions) {
          for (const ids of [[], addonIds]) {
            const q = buildSelectionQuote(c, { addonIds: ids, participants, region });
            assertIncl(q.morningInclLines, q.totalInclVat, `${c.id} p=${participants} r=${region} n=${ids.length}`);
          }
        }
      }
    }
  });
});
