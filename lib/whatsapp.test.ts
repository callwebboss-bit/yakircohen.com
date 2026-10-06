import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildServiceWhatsAppText, buildWhatsAppHref, toCustomerWhatsAppText } from "@/lib/whatsapp";
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

describe("buildServiceWhatsAppText: ברכה אחת בלבד", () => {
  const PRICE = "מחיר לדוגמה";

  it("נושא בלי ברכה נעטף בפתיחה, כמו קודם", () => {
    assert.equal(buildServiceWhatsAppText("הקלטת שיר"), "שלום, אשמח לשמוע על הקלטת שיר");
    assert.equal(
      buildServiceWhatsAppText("  הקלטת שיר  ", PRICE),
      `שלום, אשמח לשמוע על הקלטת שיר - מחיר: ${PRICE}`,
    );
  });

  it("נושא ריק נשאר הפתיחה הכללית", () => {
    assert.equal(buildServiceWhatsAppText(""), "שלום, אשמח לשמוע על השירות");
    assert.equal(buildServiceWhatsAppText("   ", PRICE), `שלום, אשמח לשמוע על השירות - מחיר: ${PRICE}`);
  });

  it("נושא שפותח בברכה נשלח כמו שהוא, בלי ברכה שנייה", () => {
    const subject = "שלום, מעוניין/ת בהגברה לזמר/להקה";
    assert.equal(buildServiceWhatsAppText(subject), subject);
    assert.equal(buildServiceWhatsAppText(`  ${subject}  `), subject);
    assert.doesNotMatch(buildServiceWhatsAppText(subject), /אשמח לשמוע על שלום/);
  });

  it("המחיר מתווסף באותה צורה גם כשהנושא פותח בברכה", () => {
    const subject = "שלום, מעוניין/ת בהגברה לזמר/להקה - חבילה 1";
    assert.equal(buildServiceWhatsAppText(subject, PRICE), `${subject} - מחיר: ${PRICE}`);
  });

  it("כל מילות הברכה, עם פסיק או רווח אחריהן", () => {
    for (const subject of ["שלום, רציתי לשאול", "היי, רציתי לשאול", "הי רציתי לשאול", "אהלן, רציתי לשאול", "שלום רציתי לשאול"]) {
      assert.equal(buildServiceWhatsAppText(subject), subject);
    }
  });

  it("מילה שרק מתחילה כמו ברכה אינה ברכה", () => {
    assert.equal(buildServiceWhatsAppText("הילוך איטי לסרטון"), "שלום, אשמח לשמוע על הילוך איטי לסרטון");
    assert.equal(buildServiceWhatsAppText("שלומית ושירים"), "שלום, אשמח לשמוע על שלומית ושירים");
  });

  it("הקישור לוואטסאפ נושא את הטקסט בלי הכפלה", () => {
    const text = decodeText(
      buildWhatsAppHref({ text: buildServiceWhatsAppText("היי, מעוניין בפודקאסט", PRICE) }),
    );
    assert.equal(text, `היי, מעוניין בפודקאסט - מחיר: ${PRICE}`);
  });
});
