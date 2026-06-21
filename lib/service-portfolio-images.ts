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

/** sync PNG/JPEG/WebP dimension probe - no extra dependency */
function readImageDimensions(
  absoluteFilePath: string,
): { width: number; height: number } | null {
  try {
    const buffer = fs.readFileSync(absoluteFilePath);

    // PNG: magic 89 50 4E 47, IHDR at offset 16
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

    // JPEG: SOF marker scan
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

    // WebP: RIFF????WEBP header
    if (
      buffer.length >= 30 &&
      buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 && // "RIFF"
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50   // "WEBP"
    ) {
      const chunkType = buffer.toString("ascii", 12, 16);
      if (chunkType === "VP8 " && buffer.length >= 30) {
        // Lossy VP8: start code at 23-25 (9D 01 2A), then width/height as 14-bit LE values
        if (buffer[23] === 0x9d && buffer[24] === 0x01 && buffer[25] === 0x2a) {
          const width = (buffer[26] | (buffer[27] << 8)) & 0x3fff;
          const height = (buffer[28] | (buffer[29] << 8)) & 0x3fff;
          if (width > 0 && height > 0) return { width, height };
        }
      } else if (chunkType === "VP8X" && buffer.length >= 30) {
        // Extended WebP: canvas width-1 at 24-26 (3 bytes LE), height-1 at 27-29
        const width = (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16)) + 1;
        const height = (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16)) + 1;
        if (width > 0 && height > 0) return { width, height };
      } else if (chunkType === "VP8L" && buffer.length >= 26) {
        // Lossless VP8L: signature byte 0x2F at offset 20, then width-1 (14 bits) + height-1 (14 bits)
        if (buffer[20] === 0x2f) {
          const bits = buffer[21] | (buffer[22] << 8) | (buffer[23] << 16) | (buffer[24] << 24);
          const width = (bits & 0x3fff) + 1;
          const height = ((bits >>> 14) & 0x3fff) + 1;
          if (width > 0 && height > 0) return { width, height };
        }
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
