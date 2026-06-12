import fs from "node:fs";
import path from "node:path";
import { serviceImageBasePath } from "@/lib/data/services";
import { deriveHebrewAlt } from "@/lib/hebrew-image-alt";

const IMAGE_EXT = /\.(avif|gif|jpe?g|jfif|png|svg|webp)$/i;

/** Scoped to public/images/services so Turbopack does not trace the whole repo. */
const SERVICES_IMAGES_ROOT = path.join(
  /*turbopackIgnore: true*/ process.cwd(),
  "public",
  "images",
  "services",
);

/** Subfolder names for "load more" images (not shown in hero). */
export const PORTFOLIO_ARCHIVE_DIR_NAMES = ["archive", "arcive"] as const;

export type PortfolioImage = {
  src: string;
  alt: string;
  filename: string;
  /** IMPROVED: intrinsic dimensions for gallery CLS (read from file header at build time) */
  width?: number;
  height?: number;
};

export type ServicePortfolioImageSet = {
  /** Images in the service folder root - shown first in the gallery. */
  primary: PortfolioImage[];
  /** Images in `archive/` or `arcive/` - optional "load more" pool. */
  archive: PortfolioImage[];
};

/**
 * Derives accessible alt text from a descriptive asset filename.
 * Strips the extension and replaces dash separators with spaces.
 */
export function altTextFromAssetFilename(filename: string): string {
  const withoutExt = filename.replace(/\.[^.]+$/i, "");
  return withoutExt
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** IMPROVED: sync PNG/JPEG dimension probe — no extra dependency */
function readImageDimensions(
  absoluteFilePath: string,
): { width: number; height: number } | null {
  try {
    const buffer = fs.readFileSync(absoluteFilePath);

    if (
      buffer.length >= 24 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20),
      };
    }

    if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset + 9 < buffer.length) {
        if (buffer[offset] !== 0xff) break;
        const marker = buffer[offset + 1];
        const length = buffer.readUInt16BE(offset + 2);
        if (length < 2) break;
        if (marker >= 0xc0 && marker <= 0xc3) {
          return {
            height: buffer.readUInt16BE(offset + 5),
            width: buffer.readUInt16BE(offset + 7),
          };
        }
        offset += 2 + length;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function readImagesFromAbsoluteDir(
  absoluteDir: string,
  urlBasePath: string,
  indexOffset = 0,
): PortfolioImage[] {
  if (!fs.existsSync(absoluteDir)) {
    return [];
  }

  return fs
    .readdirSync(absoluteDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && IMAGE_EXT.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name, "he"))
    .map((entry, index) => {
      const dimensions = readImageDimensions(path.join(absoluteDir, entry.name));
      return {
        filename: entry.name,
        src: `${urlBasePath}/${entry.name}`,
        alt: deriveHebrewAlt(entry.name, indexOffset + index),
        ...(dimensions ?? {}),
      };
    });
}

function resolveArchiveDirName(absoluteServiceDir: string): string | null {
  for (const dirName of PORTFOLIO_ARCHIVE_DIR_NAMES) {
    const candidate = path.join(absoluteServiceDir, dirName);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return dirName;
    }
  }
  return null;
}

/**
 * Lists images for a service folder.
 *
 * **Convention (no code changes needed when you reorganize):**
 * - Put featured images in `public/images/services/{folder}/` (root only).
 * - Move extras to `public/images/services/{folder}/archive/` or `.../arcive/`.
 * - Root images appear first; archive loads on "הצג עוד מהארכיון".
 * - Subfolders other than archive/arcive are ignored.
 * - Sort order within each folder is alphabetical (Hebrew locale); use numeric
 *   prefixes in filenames (e.g. `01-`, `02-`) to control order.
 */
/** Avoids re-scanning the filesystem when both metadata and render paths
 * resolve the same service folder (e.g. hero image + OG image). */
const portfolioImageSetCache = new Map<string, ServicePortfolioImageSet>();

export function listServicePortfolioImageSet(
  assetsFolder: string,
): ServicePortfolioImageSet {
  const folder = assetsFolder.replace(/^\/+/, "").replace(/\\/g, "/");

  const cached = portfolioImageSetCache.get(folder);
  if (cached) return cached;

  const absoluteDir = path.join(SERVICES_IMAGES_ROOT, ...folder.split("/"));

  if (!fs.existsSync(absoluteDir)) {
    const empty: ServicePortfolioImageSet = { primary: [], archive: [] };
    portfolioImageSetCache.set(folder, empty);
    return empty;
  }

  const basePath = serviceImageBasePath(folder);
  const primary = readImagesFromAbsoluteDir(absoluteDir, basePath, 0);

  const archiveDirName = resolveArchiveDirName(absoluteDir);
  const archive = archiveDirName
    ? readImagesFromAbsoluteDir(
        path.join(absoluteDir, archiveDirName),
        `${basePath}/${archiveDirName}`,
        primary.length,
      )
    : [];

  const result: ServicePortfolioImageSet = { primary, archive };
  portfolioImageSetCache.set(folder, result);
  return result;
}

/** Primary + archive combined (e.g. structured data). */
export function listServicePortfolioImages(
  assetsFolder: string,
): PortfolioImage[] {
  const { primary, archive } = listServicePortfolioImageSet(assetsFolder);
  return [...primary, ...archive];
}

/** Featured images only - use for hero and first gallery screen. */
export function listServicePortfolioPrimaryImages(
  assetsFolder: string,
): PortfolioImage[] {
  return listServicePortfolioImageSet(assetsFolder).primary;
}
