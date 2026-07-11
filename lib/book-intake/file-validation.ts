export const MAX_INTAKE_FILE_BYTES = 524_288_000;

const ALLOWED_MIME_EXACT = new Set([
  "application/zip",
  "application/x-zip-compressed",
  "application/pdf",
]);

const ALLOWED_MIME_PREFIXES = ["audio/", "video/", "image/"] as const;

const EXTENSION_MIME: Record<string, string> = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  flac: "audio/flac",
  aac: "audio/aac",
  m4a: "audio/mp4",
  ogg: "audio/ogg",
  mp4: "video/mp4",
  mov: "video/quicktime",
  avi: "video/x-msvideo",
  mkv: "video/x-matroska",
  webm: "video/webm",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  zip: "application/zip",
  pdf: "application/pdf",
};

export type IntakeFileMeta = {
  name: string;
  size_bytes: number;
  mime: string;
};

export type FileValidationResult =
  | { valid: true; meta: IntakeFileMeta }
  | { valid: false; error: string };

function resolveMime(file: File): string {
  if (file.type.trim()) return file.type.trim().toLowerCase();
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext && EXTENSION_MIME[ext]) return EXTENSION_MIME[ext];
  return "";
}

function isAllowedMime(mime: string): boolean {
  if (!mime) return false;
  if (ALLOWED_MIME_EXACT.has(mime)) return true;
  return ALLOWED_MIME_PREFIXES.some((prefix) => mime.startsWith(prefix));
}

export function validateIntakeFile(file: File): FileValidationResult {
  if (file.size > MAX_INTAKE_FILE_BYTES) {
    return {
      valid: false,
      error: "הקובץ גדול מ-500MB. נסו לדחוס או לשלוח קטע קצר יותר.",
    };
  }

  const mime = resolveMime(file);
  if (!isAllowedMime(mime)) {
    return {
      valid: false,
      error: "סוג קובץ לא נתמך. אפשר: אודיו, וידאו, תמונה, ZIP או PDF.",
    };
  }

  return {
    valid: true,
    meta: {
      name: file.name,
      size_bytes: file.size,
      mime,
    },
  };
}

export function formatFileSizeMb(sizeBytes: number): string {
  const mb = sizeBytes / (1024 * 1024);
  if (mb < 0.1) return `${(sizeBytes / 1024).toFixed(0)} KB`;
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
}
