import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  resolveHubGlow,
  resolveHubMesh,
  resolveServiceAccentColor,
  SERVICE_HUB_MESH,
} from "@/lib/theme/service-accent";

describe("hub atmosphere tokens", () => {
  it("returns precomputed studio mesh distinct from events", () => {
    assert.equal(resolveHubMesh("studio"), SERVICE_HUB_MESH.studio);
    assert.notEqual(resolveHubMesh("studio"), resolveHubMesh("events"));
    /* D135 (14.10.2026): האולפן הוא זהב המותג, #7A5C12 = rgb(122, 92, 18) */
    assert.match(resolveHubGlow("studio"), /122, 92, 18/);
  });

  it("falls back to the brand gold (studio), not the events red (D135)", () => {
    assert.equal(resolveServiceAccentColor(null), resolveServiceAccentColor("studio"));
    assert.equal(resolveHubMesh("unknown"), resolveHubMesh("studio"));
    assert.notEqual(resolveServiceAccentColor("dj"), resolveServiceAccentColor("events"));
  });

  it("pro merges into the brand gold, events stays red (D135)", () => {
    assert.equal(resolveServiceAccentColor("pro"), resolveServiceAccentColor("studio"));
    assert.equal(resolveServiceAccentColor("events"), "#d42b2b");
  });
});
