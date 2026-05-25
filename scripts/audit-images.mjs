import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "public", "images", "services");
const IMG = /\.(webp|jpe?g|png|svg|avif|gif|jfif)$/i;
const ARCHIVE_NAMES = ["archive", "arcive"];

/** Folders referenced in lib/data/services.ts — keep in sync when adding services */
const EXPECTED_ASSET_FOLDERS = [
  "studio/hub",
  "studio/recording-song-modiin",
  "studio/jerusalem",
  "studio/blessings/bride-groom-blessing",
  "studio/blessings/bar-mitzvah",
  "studio/blessings/video-clip",
  "podcast",
  "dj-course",
  "events/dj-events",
  "events/equipment",
  "events/equipment/singer-amplification",
  "events/wedding-packages",
  "events/attractions/led-booth",
  "events/attractions/bubble-machine",
  "events/attractions/cold-fireworks",
  "events/attractions/confetti-cannon",
  "events/attractions/giant-balloons",
  "events/attractions/wedding-smoking-machine",
  "events/attractions/smoke-cannons-for-events",
  "video/photo-slideshow",
  "video/corporate-video",
  "photography/wedding",
  "voiceover",
  "photography/events",
  "academy/music-production",
];

function countImages(dir) {
  if (!fs.existsSync(dir)) return { exists: false, primary: 0, archive: 0, archiveDir: null };
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const primary = entries.filter((e) => e.isFile() && IMG.test(e.name)).length;
  let archive = 0;
  let archiveDir = null;
  for (const name of ARCHIVE_NAMES) {
    const sub = path.join(dir, name);
    if (fs.existsSync(sub) && fs.statSync(sub).isDirectory()) {
      archiveDir = name;
      archive = fs.readdirSync(sub).filter((n) => IMG.test(n)).length;
      break;
    }
  }
  return { exists: true, primary, archive, archiveDir };
}

function isAssetFolderLeaf(full) {
  const subdirs = fs
    .readdirSync(full, { withFileTypes: true })
    .filter((x) => x.isDirectory())
    .map((x) => x.name);
  const nonArchive = subdirs.filter((n) => !ARCHIVE_NAMES.includes(n));
  return nonArchive.length === 0;
}

function listLeafDirs(dir, base = "") {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const rel = base ? `${base}/${e.name}` : e.name;
    const full = path.join(dir, e.name);
    if (isAssetFolderLeaf(full)) {
      const { primary, archive } = countImages(full);
      if (primary > 0 || archive > 0) {
        out.push({ folder: rel, primary, archive });
      }
    } else {
      out.push(...listLeafDirs(full, rel));
    }
  }
  return out;
}

console.log("=== Expected folders (from services registry) ===\n");
for (const folder of EXPECTED_ASSET_FOLDERS) {
  const dir = path.join(root, ...folder.split("/"));
  const { exists, primary, archive, archiveDir } = countImages(dir);
  const status = !exists
    ? "MISSING_DIR"
    : primary === 0 && archive === 0
      ? "EMPTY"
      : archive > 0
        ? `OK (${primary}+${archive} ${archiveDir})`
        : `OK (${primary})`;
  console.log(`${status.padEnd(22)}\t${folder}`);
}

console.log("\n=== All leaf folders on disk ===\n");
const leaves = listLeafDirs(root)
  .filter((x) => x.primary > 0 || x.archive > 0)
  .sort((a, b) => a.folder.localeCompare(b.folder, "he"));
for (const { folder, primary, archive } of leaves) {
  console.log(`${folder}\tprimary:${primary}\tarchive:${archive}`);
}
