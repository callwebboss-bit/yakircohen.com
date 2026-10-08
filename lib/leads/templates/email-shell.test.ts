import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import { buildAutoReplyText } from "@/lib/leads/templates/auto-reply";
import {
  EMAIL_LOGO_HEIGHT,
  EMAIL_LOGO_SRC,
  EMAIL_LOGO_WIDTH,
  wrapCustomerEmail,
} from "@/lib/leads/templates/email-shell";
import { buildPreCallGuide } from "@/lib/leads/templates/pre-call-guide";

/* בדיקת הלוגו 7.10.2026: שני המיילים ללקוח נפתחים בלוגו, נסגרים בחתימה אחת
   ונשארים מימין לשמאל */
const LOGO_IMG =
  `<img src="https://yakircohen.com/images/logo-email.png" width="160" height="${EMAIL_LOGO_HEIGHT}" ` +
  `alt="יקיר כהן הפקות" style="display:block;border:0;margin:0 0 16px">`;
const SIGNATURE = /יקיר כהן הפקות · <a href="https:\/\/yakircohen\.com">yakircohen\.com<\/a><\/p>\s*<\/div>$/;

function assertCustomerEmail(html: string) {
  assert.match(html, /^<div dir="rtl" style="[^"]*direction:rtl;text-align:right;/);
  assert.match(html, /font-family:Arial,Helvetica,sans-serif/);
  /* הלוגו הוא הדבר הראשון בתוך המעטפת */
  assert.ok(html.indexOf(LOGO_IMG) > 0, "logo img missing");
  assert.equal(html.indexOf("<img"), html.indexOf(LOGO_IMG));
  assert.match(html, SIGNATURE);
  /* חתימה אחת בלבד: auto-reply החזיק קודם חתימה משלו */
  assert.equal(html.split("yakircohen.com</a>").length - 1, 1);
}

describe("customer email shell", () => {
  it("auto-reply html has the logo, one signature and stays RTL", () => {
    const r = buildAutoReplyText({ name: "נועה", serviceType: "podcast" });
    assertCustomerEmail(r.html);
    assert.match(r.html, /<p>נועה,<\/p>/);
    /* הגרסה הטקסטואלית לא השתנתה */
    assert.match(r.text, /יקיר כהן הפקות\nhttps:\/\/yakircohen\.com$/);
  });

  it("auto-reply still escapes the lead name inside the shell", () => {
    const r = buildAutoReplyText({ name: "<b>x</b>", serviceType: "studio" });
    assert.match(r.html, /&lt;b&gt;x&lt;\/b&gt;,/);
    assertCustomerEmail(r.html);
  });

  it("pre-call guide html has the logo, one signature and stays RTL", () => {
    for (const service of ["studio", "podcast", "events", "unknown"] as const) {
      const g = buildPreCallGuide(service);
      assertCustomerEmail(g.html);
      assert.ok(g.html.includes(`>${g.subject}</h2>`));
    }
  });

  it("declared logo size matches public/images/logo-email.png", () => {
    /* רוחב וגובה מכותרת IHDR של ה-PNG (בתים 16-23). אם הלוגו נוצר מחדש
       ביחס אחר, הגובה ב-email-shell.ts חייב להתעדכן איתו */
    const png = readFileSync(resolve(import.meta.dirname, "../../../public/images/logo-email.png"));
    assert.equal(png.toString("ascii", 1, 4), "PNG");
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    assert.equal(width, EMAIL_LOGO_WIDTH * 3);
    assert.equal(EMAIL_LOGO_HEIGHT, Math.round((height * EMAIL_LOGO_WIDTH) / width));
    assert.equal(EMAIL_LOGO_SRC.endsWith("/images/logo-email.png"), true);
  });

  it("wrapCustomerEmail trims the body", () => {
    const html = wrapCustomerEmail("\n  <p>x</p>\n");
    assert.match(html, /margin:0 0 16px">\n {2}<p>x<\/p>\n {2}<p style/);
  });
});
