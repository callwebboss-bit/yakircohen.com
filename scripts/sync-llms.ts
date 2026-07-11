/**
 * Sync opening prices in public/llms.txt from pricing-catalog (single source of truth).
 * Run: npm run sync:llms
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getExVat } from "../lib/data/pricing-catalog";

const root = resolve(import.meta.dirname, "..");
const llmsPath = resolve(root, "public/llms.txt");

function nis(amount: number): string {
  return `${amount.toLocaleString("he-IL")} ₪`;
}

function meNis(amount: number): string {
  return `מ-${nis(amount)}`;
}

const half = getExVat("studio_half_hour");
const hour = getExVat("studio_hour");
const podcastAudio = getExVat("podcast_audio");
const podcastVideo = getExVat("podcast_video");
const podcastFull = getExVat("full_podcast_production");
const cover = getExVat("cover_song");
const blessing = getExVat("blessing_recording");
const dj = getExVat("dj_premium");
const attraction = getExVat("event_attraction_1");
const voucherFloor = half;

const pricesBlock = `## מחירי פתיחה (לפני מע״מ, מסונכרן מ-pricing-catalog)
- אולפן - חצי שעה: ${nis(half)} · שעת אולפן: ${nis(hour)}
- פודקאסט אודיו (עד שעה + עריכה): ${nis(podcastAudio)}
- פודקאסט וידאו (3 מצלמות): ${nis(podcastVideo)}
- הפקת פודקאסט מלאה: ${meNis(podcastFull)}
- הקלטת ברכה: ${meNis(blessing)} · הקלטת שיר (קאבר): ${meNis(cover)}
- DJ לאירועים (צוות, כ-4 שעות): ${meNis(dj)}
- אטרקציה בודדת לאירוע: ${meNis(attraction)}
- שובר מתנה לאולפן: ${meNis(voucherFloor)}
- חנות: https://yakircohen.com/shop
`;

const raw = readFileSync(llmsPath, "utf8");
const start = "## מחירי פתיחה";
const nextSection = "\n## מרכזי תוכן עיקריים";
const startIdx = raw.indexOf(start);
const nextIdx = raw.indexOf(nextSection);

if (startIdx === -1 || nextIdx === -1 || nextIdx <= startIdx) {
  console.error("sync:llms — could not find price section markers in llms.txt");
  process.exit(1);
}

const updated =
  raw.slice(0, startIdx) + pricesBlock.trimEnd() + "\n" + raw.slice(nextIdx);
writeFileSync(llmsPath, updated, "utf8");
console.log("sync:llms OK — public/llms.txt prices synced from pricing-catalog");
