import assert from "node:assert/strict";
import { test } from "node:test";
import { verifyBearerToken } from "./api-auth.ts";

function requestWithAuth(token: string): Request {
  return new Request("https://example.com", {
    headers: { authorization: `Bearer ${token}` },
  });
}

test("verifyBearerToken accepts matching secret", () => {
  assert.equal(verifyBearerToken(requestWithAuth("abc123"), "abc123"), true);
});

test("verifyBearerToken rejects missing secret", () => {
  assert.equal(verifyBearerToken(requestWithAuth("abc"), undefined), false);
});

test("verifyBearerToken rejects wrong token", () => {
  assert.equal(verifyBearerToken(requestWithAuth("wrong"), "expected"), false);
});

test("verifyBearerToken rejects missing header", () => {
  assert.equal(
    verifyBearerToken(new Request("https://example.com"), "expected"),
    false,
  );
});
