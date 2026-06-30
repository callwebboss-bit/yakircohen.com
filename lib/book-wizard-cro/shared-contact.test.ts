import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  saveBookCoreContact,
  readBookCoreContact,
  clearBookCoreContact,
  mergeCoreContactIntoDraft,
} from "@/lib/book-wizard-cro/shared-contact";

describe("shared-contact", () => {
  const storage = new Map<string, string>();

  it("saves and reads core contact", () => {
    const g = globalThis as typeof globalThis & {
      sessionStorage?: Storage;
    };
    g.sessionStorage = {
      getItem: (k) => storage.get(k) ?? null,
      setItem: (k, v) => {
        storage.set(k, v);
      },
      removeItem: (k) => {
        storage.delete(k);
      },
      clear: () => storage.clear(),
      key: () => null,
      length: storage.size,
    };

    saveBookCoreContact({ name: "יקיר", phone: "0501234567" });
    const read = readBookCoreContact();
    assert.equal(read?.name, "יקיר");
    assert.equal(read?.phone, "0501234567");

    clearBookCoreContact();
    assert.equal(readBookCoreContact(), null);
  });

  it("mergeCoreContactIntoDraft does not overwrite filled fields", () => {
    saveBookCoreContact({ name: "שרה", phone: "0509999999" });
    const merged = mergeCoreContactIntoDraft({ name: "דני", phone: "" });
    assert.equal(merged.name, "דני");
    assert.equal(merged.phone, "0509999999");
    clearBookCoreContact();
  });

  it("studio contact prefill flows into empty events draft fields", () => {
    saveBookCoreContact({ name: "יעל מהאולפן", phone: "0501234567" });
    const eventsDraft = mergeCoreContactIntoDraft({ name: "", phone: "" });
    assert.equal(eventsDraft.name, "יעל מהאולפן");
    assert.equal(eventsDraft.phone, "0501234567");
    clearBookCoreContact();
  });
});
