import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parseBookCategoryFromHash,
  parseBookWizardStepFromHash,
} from "@/lib/book-url";

describe("book-url hash helpers", () => {
  it("parseBookCategoryFromHash ignores step segment", () => {
    assert.equal(parseBookCategoryFromHash("#studio/step/2"), "studio");
    assert.equal(parseBookCategoryFromHash("#podcast"), "podcast");
    assert.equal(parseBookCategoryFromHash("#unknown"), null);
  });

  it("parseBookWizardStepFromHash reads step index", () => {
    assert.equal(parseBookWizardStepFromHash("#studio/step/2"), 2);
    assert.equal(parseBookWizardStepFromHash("#events/step/0"), 0);
    assert.equal(parseBookWizardStepFromHash("#studio"), null);
    assert.equal(parseBookWizardStepFromHash("#studio/step/x"), null);
  });
});
