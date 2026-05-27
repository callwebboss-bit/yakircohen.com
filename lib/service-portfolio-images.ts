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
    .map((entry, index) => ({
      filename: entry.name,
      src: `${urlBasePath}/${entry.name}`,
      alt: deriveHebrewAlt(entry.name, indexOffset + index),
    }));
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
export function listServicePortfolioImageSet(
  assetsFolder: string,
): ServicePortfolioImageSet {
  const folder = assetsFolder.replace(/^\/+/, "").replace(/\\/g, "/");
  const absoluteDir = path.join(SERVICES_IMAGES_ROOT, ...folder.split("/"));

  if (!fs.existsSync(absoluteDir)) {
    return { primary: [], archive: [] };
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

  return { primary, archive };
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
