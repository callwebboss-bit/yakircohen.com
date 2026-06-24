import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildCloserDeepLink,
  decodeWhatsAppTextFromHref,
  encodeCloserLeadParam,
} from "./closer-deep-link";

describe("closer-deep-link", () => {
  it("round-trips lead payload in query param", () => {
    const body = "שלום\n[YC:service=recording|source=/book]";
    const param = encodeCloserLeadParam({ v: 1, waBody: body });
    const link = buildCloserDeepLink(body);
    assert.match(link, /^yakir-closer\.html\?lead=/);
    assert.ok(param.length > 10);
  });

  it("decodes wa.me text param", () => {
    const href = "https://wa.me/972501234567?text=" + encodeURIComponent("שלום עולם");
    assert.equal(decodeWhatsAppTextFromHref(href), "שלום עולם");
  });
});
