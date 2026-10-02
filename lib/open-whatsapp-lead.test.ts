import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";

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
    assert.deepEqual(stub.openArgs, [[HREF, "_blank"]]);
    assert.equal(popup.opener, null);
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
