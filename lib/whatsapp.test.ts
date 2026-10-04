import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildWhatsAppHref, toCustomerWhatsAppText } from "@/lib/whatsapp";
import { buildClosingMessage } from "@/lib/whatsapp-closing";

function decodeText(href: string): string {
  return new URL(href).searchParams.get("text") ?? "";
}

describe("toCustomerWhatsAppText (LF-06)", () => {
  const owner = buildClosingMessage({
    serviceLabel: "הקלטה באולפן",
    contact: { name: "נועה", phone: "050-123-4567" },
    priceExVat: 3000,
    timing: "urgent",
    intent: "start_now",
    closerServiceId: "recording",
    ycForm: "contact_quiz",
  });

  it("the owner text still carries the internal lines", () => {
    assert.match(owner, /ליד פרימיום/);
    assert.match(owner, /⏰ דחוף/);
    assert.match(owner, /\*כוונה:\*/);
  });

  it("the customer's WhatsApp text drops premium, timing and intent lines", () => {
    const text = decodeText(buildWhatsAppHref({ text: owner }));
    assert.doesNotMatch(text, /ליד פרימיום/);
    assert.doesNotMatch(text, /⏰ דחוף/);
    assert.doesNotMatch(text, /\*כוונה:\*/);
    assert.ok(!text.startsWith("\n"), "no leading blank line");
    assert.match(text, /\*שירות:\* הקלטה באולפן/);
    assert.match(text, /\*שם:\* נועה/);
  });

  it("keeps the [YC:...] tag for the owner's parser", () => {
    const text = decodeText(buildWhatsAppHref({ text: owner }));
    assert.match(text, /\[YC:[^\]]*service=/);
  });

  it("does not touch customer text that only mentions the words", () => {
    const t = "אני דחוף לי להקליט\nכוונה שלי היא לשיר";
    assert.equal(toCustomerWhatsAppText(t), t);
  });

  it("removes every timing flag", () => {
    for (const flag of ["📆 תוך חודש", "🗓️ גמיש", "🔭 עתידי"]) {
      assert.equal(toCustomerWhatsAppText(`${flag}\n\nשלום`), "שלום");
    }
  });
});
