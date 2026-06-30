import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateBookingLead } from "@/lib/form-validation";

/** Ghost lead uses validateBookingLead before notify - verify normalized phone path */
describe("useWizardGhostLead prerequisites", () => {
  it("accepts valid Israeli mobile and returns normalized phone", () => {
    const result = validateBookingLead({
      name: "יקיר",
      phone: "050-123-4567",
      date: "",
      time: "",
      location: "",
      notes: "",
      requireLocation: false,
      requireDate: false,
      requireTime: false,
    });
    assert.equal(result.ok, true);
    assert.ok(result.normalizedPhone);
    assert.match(result.normalizedPhone!, /^05\d{8}$/);
  });

  it("rejects invalid phone so ghost lead does not fire", () => {
    const result = validateBookingLead({
      name: "יקיר",
      phone: "123",
      date: "",
      time: "",
      location: "",
      notes: "",
      requireLocation: false,
      requireDate: false,
      requireTime: false,
    });
    assert.equal(result.ok, false);
  });
});
