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
    assert.match(resolveHubGlow("studio"), /217/);
  });

  it("falls back to events accent and mesh", () => {
    assert.equal(resolveServiceAccentColor(null), resolveServiceAccentColor("events"));
    assert.equal(resolveHubMesh("unknown"), resolveHubMesh("events"));
  });
});
