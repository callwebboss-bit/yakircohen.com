const VIEWPORTS = [
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "Android", width: 360, height: 800 },
  { name: "iPad", width: 768, height: 1024 },
  { name: "Desktop 1080p", width: 1920, height: 1080 },
] as const;

const SOCIAL_PLATFORMS = ["instagram", "tiktok", "facebook", "youtube"] as const;

describe("Site QA — RTL, responsiveness, links, forms", () => {
  describe("RTL (Hebrew)", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("sets lang=he and dir=rtl on the document", () => {
      cy.get("html").should("have.attr", "lang", "he").and("have.attr", "dir", "rtl");
      cy.get("body").should("have.css", "direction", "rtl");
    });
  });

  describe("Live Status Bar", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/live-visitors", {
        statusCode: 200,
        body: { configured: true, visitors: 8, fetchedAt: new Date().toISOString() },
      }).as("liveVisitors");
      cy.visit("/");
    });

    it("displays live status bar with availability and trust stats", () => {
      cy.get('[data-testid="live-status-bar"]').should("be.visible");
      cy.wait("@liveVisitors");
      cy.get('[data-testid="live-visitor-count"]').should("be.visible");
      cy.contains("גולשים כרגע").should("be.visible");
      cy.get('[data-testid="live-status-availability"]').should("be.visible");
      cy.contains(/זמין|עסוק|ייעוץ|שבת|חוזרים/).should("be.visible");
      cy.contains("20+").should("be.visible");
    });
  });

  describe("Responsiveness — no horizontal overflow", () => {
    VIEWPORTS.forEach((vp) => {
      it(`${vp.name} (${vp.width}x${vp.height})`, () => {
        cy.viewport(vp.width, vp.height);
        cy.visit("/");

        cy.document().then((doc) => {
          const html = doc.documentElement;
          expect(html.scrollWidth).to.be.lte(html.clientWidth);
        });
      });
    });
  });

  describe("Links", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("external links open in a new tab with noopener noreferrer", () => {
      cy.get('a[target="_blank"]').each(($a) => {
        const href = $a.prop("href") as string;
        expect(href).to.match(/^https?:\/\//);

        const rel = ($a.attr("rel") ?? "").toLowerCase();
        expect(rel).to.include("noopener");
        expect(rel).to.include("noreferrer");
      });
    });

    it("footer social links are visible and valid", () => {
      cy.get('nav[aria-label="רשתות חברתיות"]').scrollIntoView();

      SOCIAL_PLATFORMS.forEach((platform) => {
        cy.get(`a[href*="${platform}"]`)
          .should("be.visible")
          .and("have.attr", "href")
          .and("not.be.empty");
      });
    });
  });

  describe("Lead form (homepage)", () => {
    beforeEach(() => {
      cy.intercept("POST", "/api/lead-notify", { statusCode: 200, body: { ok: true } }).as(
        "leadNotify",
      );
      cy.visit("/");
      cy.window().then((win) => {
        win.sessionStorage.clear();
        cy.stub(win, "open")
          .callsFake(() => ({ closed: false, close: () => undefined }))
          .as("waOpen");
      });
    });

    it("submits name and phone and shows success", () => {
      cy.get('form[aria-label="טופס יצירת קשר"]').scrollIntoView().should("be.visible");

      // Form anti-spam guard requires ~2s after mount before submit
      cy.wait(2500);

      cy.get('form[aria-label="טופס יצירת קשר"]').within(() => {
        cy.get('input[autocomplete="name"]').type("בדיקת QA אוטומטית");
        cy.get('input[type="tel"]').type("0587654321");
        cy.contains("button", "שלחו פרטים").click();
      });

      cy.contains("תודה").should("be.visible");
      cy.get("@waOpen").should("have.been.called");
      cy.wait("@leadNotify");
    });
  });

  describe("Basic accessibility", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("has skip-to-main-content link", () => {
      cy.get('a[href="#main-content"]').should("exist");
    });

    it("social buttons have aria-label", () => {
      cy.get('nav[aria-label="רשתות חברתיות"]').scrollIntoView();
      cy.get('nav[aria-label="רשתות חברתיות"] a[aria-label]').each(($a) => {
        expect($a.attr("aria-label")?.trim()).to.not.equal("");
      });
    });
  });
});
