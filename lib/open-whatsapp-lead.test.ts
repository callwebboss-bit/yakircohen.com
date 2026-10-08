import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { readWhatsAppLeadCode, stampWhatsAppLeadCode } from "@/lib/whatsapp";

const g = globalThis as Record<string, unknown>;

type Stub = {
  openArgs: unknown[][];
  locationAssigned: boolean;
  fallbackShown: boolean;
};

class FakeAnchor {
  href = "";
  classList = { remove: () => undefined };
  scrollIntoView() {}
}

function install(popup: unknown, withFallback = false): Stub {
  const stub: Stub = { openArgs: [], locationAssigned: false, fallbackShown: false };
  const anchor = new FakeAnchor();
  anchor.classList.remove = () => {
    stub.fallbackShown = true;
  };
  const location = {
    set href(_v: string) {
      stub.locationAssigned = true;
    },
    get href() {
      return "https://yakircohen.com/";
    },
  };
  g.window = {
    open: (...args: unknown[]) => {
      stub.openArgs.push(args);
      return popup;
    },
    location,
  };
  g.HTMLAnchorElement = FakeAnchor;
  g.document = { getElementById: () => (withFallback ? anchor : null) };
  return stub;
}

afterEach(() => {
  delete g.window;
  delete g.document;
  delete g.HTMLAnchorElement;
});

const HREF = "https://wa.me/972587555456?text=hi";

describe("openWhatsAppLead (LF-05)", () => {
  it("opens without a features string and clears opener", () => {
    const popup = { closed: false, opener: {} as unknown };
    const stub = install(popup);
    assert.equal(openWhatsAppLead(HREF), true);
    assert.equal(stub.openArgs.length, 1);
    assert.equal(stub.openArgs[0][1], "_blank");
    assert.equal(stub.openArgs[0].length, 2);
    assert.equal(popup.opener, null);
  });

  /* החלטת הבעלים D67, 7.10.2026 */
  it("adds a lead code as the last line, and keeps a code the link already has", () => {
    const stub = install({ closed: false, opener: null });
    openWhatsAppLead(HREF);
    const opened = String(stub.openArgs[0][0]);
    const text = new URL(opened).searchParams.get("text") ?? "";
    assert.match(text, /^hi\nקוד פנייה: [A-HJKMNP-Z2-9]{4}$/);

    const coded = stampWhatsAppLeadCode(HREF, "A7K2");
    openWhatsAppLead(coded);
    assert.equal(stub.openArgs[1][0], coded);
    assert.equal(readWhatsAppLeadCode(String(stub.openArgs[1][0])), "A7K2");
  });

  it("a blocked popup returns false and never navigates the site tab", () => {
    const stub = install(null);
    assert.equal(openWhatsAppLead(HREF), false);
    assert.equal(stub.locationAssigned, false);
  });

  it("a blocked popup reveals the fallback link when the page has one", () => {
    const stub = install(null, true);
    assert.equal(openWhatsAppLead(HREF), false);
    assert.equal(stub.fallbackShown, true);
    assert.equal(stub.locationAssigned, false);
  });
});
