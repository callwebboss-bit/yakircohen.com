import fs from "node:fs";
import path from "node:path";

const file = path.resolve(import.meta.dirname, "../../local-tools/yakir-closer.html");

function normalizeText(text) {
  let out = text;
  out = out.replace(/\u2014/g, "-");
  out = out.replace(/\u2013/g, "-");
  out = out.replace(/\u2015/g, "-");
  out = out.replace(/[\u201C\u201D\u2033\u2036]/g, '"');
  out = out.replace(/[\u2018\u2019\u2032\u2035]/g, "'");
  out = out.replace(/\u00B7/g, "-");
  out = out.replace(/\u2219/g, "-");
  out = out.replace(/\s*←\s*/g, " ");
  out = out.replace(/\s*→\s*/g, " ");
  return out;
}

const before = fs.readFileSync(file, "utf8");
const after = normalizeText(before);
if (after !== before) {
  fs.writeFileSync(file, after, "utf8");
  console.log("[normalize-closer] updated yakir-closer.html");
} else {
  console.log("[normalize-closer] no changes");
}
