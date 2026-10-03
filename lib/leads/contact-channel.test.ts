import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CALLBACK_SUBJECT_PREFIX,
  contactChannelForWhatsAppMode,
  leadEmailFooter,
  leadSubjectChannelPrefix,
  parseLeadContactChannel,
} from "@/lib/leads/contact-channel";

describe("lead contact channel", () => {
  it("callback footer says the customer asked for a call and got no WhatsApp", () => {
    const footer = leadEmailFooter("callback");
    assert.match(footer, /ביקש שיחה חוזרת/);
    assert.match(footer, /לא נשלחה לו הודעת וואטסאפ/);
    assert.doesNotMatch(footer, /קיבל קישור לוואטסאפ/);
  });

  it("whatsapp footer keeps the WhatsApp line", () => {
    assert.match(leadEmailFooter("whatsapp"), /הלקוח גם קיבל קישור לוואטסאפ/);
  });

  it("an unknown channel makes no WhatsApp claim either way", () => {
    const footer = leadEmailFooter(undefined);
    assert.equal(footer, "נשלח אוטומטית מהאתר (גיבוי לידים).");
    assert.doesNotMatch(footer, /וואטסאפ/);
  });

  it("only callback marks the subject", () => {
    assert.equal(leadSubjectChannelPrefix("callback"), CALLBACK_SUBJECT_PREFIX);
    assert.equal(leadSubjectChannelPrefix("whatsapp"), "");
    assert.equal(leadSubjectChannelPrefix(undefined), "");
  });

  it("parse accepts only known channels from the network", () => {
    assert.equal(parseLeadContactChannel("callback"), "callback");
    assert.equal(parseLeadContactChannel("whatsapp"), "whatsapp");
    assert.equal(parseLeadContactChannel("WHATSAPP"), undefined);
    assert.equal(parseLeadContactChannel(""), undefined);
    assert.equal(parseLeadContactChannel(1), undefined);
    assert.equal(parseLeadContactChannel(undefined), undefined);
  });

  it("useLeadSubmit default follows the WhatsApp mode, not the formId", () => {
    assert.equal(contactChannelForWhatsAppMode("auto"), "whatsapp");
    assert.equal(contactChannelForWhatsAppMode("none"), "callback");
    assert.equal(contactChannelForWhatsAppMode("button"), undefined);
  });
});
