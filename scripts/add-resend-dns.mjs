/**
 * Adds Resend verification DNS + DMARC (p=none) to Cloudflare.
 * SAFE: does NOT modify root SPF or MX (Cloudflare Email Routing stays intact).
 *
 * Requires CLOUDFLARE_API_TOKEN with Zone → DNS → Edit on yakircohen.com.
 * Usage: node scripts/add-resend-dns.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ZONE_ID = "9fd7a914286c7af91685fb23bc53b33c";
const DOMAIN_ID = "c340145d-2ef4-458e-ab2e-dcf901a5fcf3";

function loadEnvLocal() {
  const p = resolve(process.cwd(), ".env.local");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^(RESEND_API_KEY|CLOUDFLARE_API_TOKEN)=(.+)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

async function cf(path, init = {}) {
  const r = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const j = await r.json();
  if (!j.success) {
    throw new Error(JSON.stringify(j.errors || j, null, 2));
  }
  return j;
}

async function addRecord(type, name, content, priority) {
  const body = {
    type,
    name,
    content,
    ttl: 1,
    proxied: false,
  };
  if (priority != null) body.priority = priority;
  try {
    const j = await cf(`/zones/${ZONE_ID}/dns_records`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    console.log(`OK ${type} ${name} → ${j.result.id}`);
  } catch (e) {
    const msg = String(e.message || e);
    if (msg.includes("81058") || msg.toLowerCase().includes("already exists")) {
      console.log(`SKIP ${type} ${name} (already exists)`);
      return;
    }
    throw e;
  }
}

loadEnvLocal();
if (!process.env.RESEND_API_KEY || !process.env.CLOUDFLARE_API_TOKEN) {
  console.error("Missing RESEND_API_KEY or CLOUDFLARE_API_TOKEN");
  process.exit(1);
}

const domainRes = await fetch(`https://api.resend.com/domains/${DOMAIN_ID}`, {
  headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
});
const domain = await domainRes.json();
if (!domain.records) {
  console.error(domain);
  process.exit(1);
}

const dkim = domain.records.find((r) => r.record === "DKIM");
const spfMx = domain.records.find((r) => r.type === "MX");
const spfTxt = domain.records.find((r) => r.type === "TXT" && r.name === "send");

console.log("Adding Resend DNS (send.* + resend._domainkey) + DMARC. Root SPF/MX untouched.");

await addRecord("TXT", "resend._domainkey", dkim.value);
await addRecord("MX", "send", spfMx.value, spfMx.priority ?? 10);
await addRecord("TXT", "send", spfTxt.value);
await addRecord(
  "TXT",
  "_dmarc",
  "v=DMARC1; p=none; rua=mailto:callwebboss@gmail.com",
);

console.log("\nTriggering Resend verification…");
const v = await fetch(`https://api.resend.com/domains/${DOMAIN_ID}/verify`, {
  method: "POST",
  headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
});
console.log("verify status", v.status, await v.text());

console.log("\nDone. Wait 5–15 min, then check Resend domain status = verified.");
