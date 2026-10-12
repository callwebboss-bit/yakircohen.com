import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MockLanguageModelV3 } from "ai/test";
import { getSalesCard } from "@/lib/sales/sales-book";
import { buildSelectionQuote } from "@/lib/sales/selection-quote";
import {
  buildSalesAgentSystemPrompt,
  cleanAgentCopy,
  getServiceDetails,
  NO_INVENTED_NUMBERS_RULE,
  pasteToQuote,
  quoteService,
  SalesToolError,
  searchServices,
  stripContactInfo,
  unverifiedNumbers,
} from "@/lib/sales/agent-tools";
import { buildSalesAgentTools, runSalesAgent, salesAgentConfigured, splitReply, type ToolLog } from "@/lib/sales/agent-run";
import { buildSongOfferQuote } from "@/lib/data/song-offer";

/* החלטת הבעלים 12.10.2026, סוכן מכירות: הכלים מחזירים בדיוק את מה שהמנוע מחשב */
const SONG = "song_recording";
const PITCH = "song_pitch_coaching";
const CLIP = "studio_session_clip_edited";

describe("sales agent tools: same numbers as the engine", () => {
  it("quote totals equal buildSelectionQuote for song + pitch + clip + 3 participants", () => {
    const card = getSalesCard(SONG);
    assert.ok(card);
    const engine = buildSelectionQuote(card, { addonIds: [PITCH, CLIP], participants: 3 });
    const tool = quoteService({ id: SONG, addonIds: [PITCH, CLIP], participants: 3 });
    assert.equal(tool.totalInclVat, engine.totalInclVat);
    assert.equal(tool.totalExVat, engine.totalExVat);
    assert.equal(tool.message, engine.message);
    assert.deepEqual(tool.morningInclLines, engine.morningInclLines);
    assert.equal(
      tool.morningInclLines.reduce((s, l) => s + l.amountInclVat, 0),
      Math.round(engine.totalInclVat),
    );
    assert.match(tool.priceHash, /^[0-9a-f]{8}$/);
  });

  it("quote maps eilat_golan to the engine's eilat region", () => {
    const dj = searchServices("DJ").find((h) => getServiceDetails(h.id).regions);
    assert.ok(dj, "a DJ card with regions");
    const card = getSalesCard(dj.id);
    assert.ok(card);
    const tool = quoteService({ id: dj.id, region: "eilat_golan" });
    const engine = buildSelectionQuote(card, { addonIds: [], region: "eilat" });
    assert.equal(tool.totalInclVat, engine.totalInclVat);
    assert.equal(tool.region, "eilat");
  });

  it("rejects unknown service ids, unknown addon ids and unknown regions", () => {
    assert.throws(() => quoteService({ id: "no_such_service" }), SalesToolError);
    assert.throws(() => getServiceDetails("no_such_service"), SalesToolError);
    assert.throws(() => quoteService({ id: SONG, addonIds: ["made_up_addon"] }), SalesToolError);
    assert.throws(() => quoteService({ id: SONG, region: "mars" }), SalesToolError);
  });

  it("search finds the song card and get_service lists its addons", () => {
    assert.ok(searchServices("הקלטת שיר").some((h) => h.id === SONG));
    const details = getServiceDetails(SONG);
    assert.ok(details.addons.some((a) => a.id === PITCH));
    assert.ok(details.participants);
  });

  it("paste: a song offer message gives the same total as the engine", () => {
    const quote = buildSongOfferQuote([CLIP], { source: "/studio", participants: 3 });
    const text = new URL(quote.waHref).searchParams.get("text") ?? "";
    const result = pasteToQuote(text);
    assert.equal(result.match?.id, SONG);
    const card = getSalesCard(SONG);
    assert.ok(card);
    assert.equal(
      result.quote?.totalInclVat,
      buildSelectionQuote(card, { addonIds: [CLIP], participants: 3 }).totalInclVat,
    );
  });
});

describe("sales agent: privacy and copy rules", () => {
  it("strips phone numbers and emails", () => {
    const out = stripContactInfo("היי זה דנה 050-123-4567, או +972 52 765 4321, מייל dana.k@example.co.il. כמה עולה שיר?");
    assert.ok(!/\d{3}.?\d{3}.?\d{4}/.test(out));
    assert.ok(!out.includes("765"));
    assert.ok(!out.includes("@"));
    assert.ok(out.includes("כמה עולה שיר"));
    /* מספר משתתפים ושעה לא נמחקים */
    assert.equal(stripContactInfo("3 משתתפים ב-18:30"), "3 משתתפים ב-18:30");
  });

  it("system prompt carries the no-invented-numbers rule and the price hash", () => {
    const prompt = buildSalesAgentSystemPrompt("abcd1234");
    assert.ok(prompt.includes(NO_INVENTED_NUMBERS_RULE));
    assert.ok(prompt.includes("רק מפלט של כלי"));
    assert.ok(prompt.includes("abcd1234"));
    assert.ok(!/[!\u2014\u2013\u2026\u201C\u201D]/.test(prompt));
  });

  it("cleans exclamation marks, long dashes, ellipsis and curly quotes", () => {
    assert.equal(cleanAgentCopy("מעולה! זה \u2014 \u201Cשיר\u201D\u2026"), "מעולה זה - \"שיר\"...");
  });

  it("flags numbers that did not come from a tool", () => {
    assert.deepEqual(unverifiedNumbers("סה״כ 2,063 ₪", ['{"totalInclVat":2063}']), []);
    assert.deepEqual(unverifiedNumbers("סה״כ 1,999 ₪ ל-3 משתתפים", ['{"totalInclVat":2063}']), [1999]);
  });

  it("is configured with a gateway key or on Vercel, not otherwise", () => {
    assert.equal(salesAgentConfigured({ AI_GATEWAY_API_KEY: "x" }), true);
    assert.equal(salesAgentConfigured({ VERCEL: "1" }), true);
    assert.equal(salesAgentConfigured({}), false);
  });
});

describe("sales agent: AI SDK wiring with a stubbed model", () => {
  const usage = {
    inputTokens: { total: 1, noCache: 1, cacheRead: undefined, cacheWrite: undefined },
    outputTokens: { total: 1, text: 1, reasoning: undefined },
  };

  it("the quote tool returns an error object for an unknown id instead of a price", async () => {
    const log: ToolLog = [];
    const tools = buildSalesAgentTools(log, () => undefined);
    const execute = tools.quote.execute;
    assert.ok(execute);
    const out = await execute({ id: "no_such_service" }, { toolCallId: "t", messages: [] });
    assert.ok(out && typeof out === "object" && "error" in out);
  });

  it("runs search -> quote and returns the engine total, with phones stripped before the model", async () => {
    const seenPrompts: string[] = [];
    let step = 0;
    const card = getSalesCard(SONG);
    assert.ok(card);
    const total = buildSelectionQuote(card, { addonIds: [PITCH, CLIP], participants: 3 }).totalInclVat;
    const model = new MockLanguageModelV3({
      doGenerate: async (options) => {
        seenPrompts.push(JSON.stringify(options.prompt));
        step += 1;
        if (step === 1) {
          return {
            content: [
              {
                type: "tool-call",
                toolCallId: "c1",
                toolName: "quote",
                input: JSON.stringify({ id: SONG, addonIds: [PITCH, CLIP], participants: 3 }),
              },
            ],
            finishReason: { unified: "tool-calls", raw: undefined },
            usage,
            warnings: [],
          };
        }
        return {
          content: [
            {
              type: "text",
              text: `הנה!\n[הודעה]\nסה״כ ${total.toLocaleString("he-IL")} ₪\n[רק לוודא]\nרק לוודא: שלושה משתתפים?\n[פנימי]\n${SONG} · סה״כ ${total} ₪`,
            },
          ],
          finishReason: { unified: "stop", raw: undefined },
          usage,
          warnings: [],
        };
      },
    });
    const reply = await runSalesAgent([{ role: "user", content: "שיר לשלושה עם קליפ, הטלפון שלי 054-555-1234" }], [model]);
    assert.ok(!seenPrompts.join("").includes("555"));
    assert.equal(reply.quote?.totalInclVat, total);
    assert.deepEqual(reply.quote?.selection.addonIds, [PITCH, CLIP]);
    assert.ok(reply.blocks.message?.includes(total.toLocaleString("he-IL")));
    assert.ok(reply.blocks.confirm?.startsWith("רק לוודא"));
    assert.ok(!reply.text.includes("!"));
    assert.deepEqual(reply.unverified, []);
  });

  it("splits a reply without headings into intro only", () => {
    assert.deepEqual(splitReply("זה לא במחירון."), { intro: "זה לא במחירון.", message: null, confirm: null, internal: null });
  });
});
