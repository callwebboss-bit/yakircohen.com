import assert from "node:assert/strict";
import test from "node:test";
import { encodeCode39, isCode39Encodable } from "@/lib/code39";

/* ערך ייחוס שנוצר מהספרייה python-barcode (code39, בלי checksum) עבור EXAMPLE-0000 */
const REFERENCE_EXAMPLE_0000 =
  "1000101110111010111010111000101010001011101011101110101000101110111011101010001010111011101000101011101010001110111010111000101010001010111011101010001110111010101000111011101010100011101110101010001110111010100010111011101";

test("encodeCode39: זהה לפלט הספרייה עבור EXAMPLE-0000", () => {
  assert.equal(encodeCode39("EXAMPLE-0000"), REFERENCE_EXAMPLE_0000);
});

test("isCode39Encodable: דוחה אותיות קטנות, עברית וריק", () => {
  assert.equal(isCode39Encodable("ABC-123"), true);
  assert.equal(isCode39Encodable("abc"), false);
  assert.equal(isCode39Encodable("שובר"), false);
  assert.equal(isCode39Encodable(""), false);
  assert.throws(() => encodeCode39("a"));
});
