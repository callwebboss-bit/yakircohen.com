import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isAllowedPublicOrigin,
  PUBLIC_API_ALLOWED_ORIGINS,
} from "./api-guard.ts";

test("allows yakircohen.com Origin", () => {
  const req = new Request("https://yakircohen.com/api/lead-touch", {
    method: "POST",
    headers: { origin: "https://yakircohen.com" },
  });
  assert.equal(isAllowedPublicOrigin(req), true);
});

test("rejects foreign Origin", () => {
  const req = new Request("https://yakircohen.com/api/lead-touch", {
    method: "POST",
    headers: { origin: "https://evil.example" },
  });
  assert.equal(isAllowedPublicOrigin(req), false);
});

test("allows matching Referer when Origin missing", () => {
  const req = new Request("https://yakircohen.com/api/lead-touch", {
    method: "POST",
    headers: { referer: "https://www.yakircohen.com/shop" },
  });
  assert.equal(isAllowedPublicOrigin(req), true);
});

test("PUBLIC_API_ALLOWED_ORIGINS includes canonical site", () => {
  assert.equal(PUBLIC_API_ALLOWED_ORIGINS.has("https://yakircohen.com"), true);
});
