"use client";

import { useCallback, useRef, useState } from "react";

export interface MediaFile {
  id: string;
  file: File;
  type: "image" | "video";
  previewUrl: string;
  width: number;
  height: number;
  status: "valid" | "rejected";
  error?: string;
}

interface Props {
  maxPhotos?: number;
  maxVideos?: number;
  onFilesChange?: (valid: MediaFile[]) => void;
}

function getImageDimensions(url: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve({ w: 0, h: 0 });
    img.src = url;
  });
}

function getVideoDimensions(url: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const v = document.createElement("video");
    v.onloadedmetadata = () => resolve({ w: v.videoWidth, h: v.videoHeight });
    v.onerror = () => resolve({ w: 0, h: 0 });
    v.src = url;
  });
}

async function validateFile(file: File): Promise<MediaFile> {
  const id = crypto.randomUUID();
  const isImage = file.type.startsWith("image/");
  const type: "image" | "video" = isImage ? "image" : "video";
  const previewUrl = URL.createObjectURL(file);
  const { w, h } = isImage
    ? await getImageDimensions(previewUrl)
    : await getVideoDimensions(previewUrl);

  const isHorizontal = w > 0 && h > 0 && w > h;
  return {
    id,
    file,
    type,
    previewUrl,
    width: w,
    height: h,
    status: isHorizontal ? "valid" : "rejected",
    error: !isHorizontal
      ? w === 0
        ? "לא ניתן לקרוא את מימדי הקובץ"
        : `פורמט אנכי (${w}×${h}) - נדרש אופקי בלבד`
      : undefined,
  };
}

export default function MediaUploadZone({
  maxPhotos = 30,
  maxVideos = 10,
  onFilesChange,
}: Props) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validPhotos = files.filter((f) => f.type === "image" && f.status === "valid");
  const validVideos = files.filter((f) => f.type === "video" && f.status === "valid");
  const rejected = files.filter((f) => f.status === "rejected");
  const overPhotoLimit = validPhotos.length > maxPhotos;
  const overVideoLimit = validVideos.length > maxVideos;
  const canSubmit =
    files.length > 0 &&
    rejected.length === 0 &&
    !overPhotoLimit &&
    !overVideoLimit &&
    !isProcessing;

  const processFiles = useCallback(
    async (incoming: FileList | File[]) => {
      const arr = Array.from(incoming).filter(
        (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
      );
      if (!arr.length) return;
      setIsProcessing(true);
      const results = await Promise.all(arr.map(validateFile));
      setFiles((prev) => {
        const merged = [...prev, ...results];
        onFilesChange?.(merged.filter((f) => f.status === "valid"));
        return merged;
      });
      setIsProcessing(false);
    },
    [onFilesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) processFiles(e.target.files);
      e.target.value = "";
    },
    [processFiles]
  );

  const removeFile = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const next = prev.filter((f) => f.id !== id);
        const removed = prev.find((f) => f.id === id);
        if (removed) URL.revokeObjectURL(removed.previewUrl);
        onFilesChange?.(next.filter((f) => f.status === "valid"));
        return next;
      });
    },
    [onFilesChange]
  );

  const photoColor =
    validPhotos.length > maxPhotos
      ? "text-red-600"
      : validPhotos.length > maxPhotos * 0.8
      ? "text-orange-500"
      : "text-green-600";

  const videoColor =
    validVideos.length > maxVideos
      ? "text-red-600"
      : validVideos.length > maxVideos * 0.8
      ? "text-orange-500"
      : "text-green-600";

  return (
    <div className="space-y-4" dir="rtl">
      {/* אזור Drag & Drop */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        aria-label="אזור העלאת קבצים"
        className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }`}
      >
        <p className="text-2xl">📤</p>
        <p className="mt-2 text-base font-medium text-gray-700">
          גרור קבצים לכאן או לחץ לבחירה
        </p>
        <p className="mt-1 text-sm text-gray-400">
          תמונות וסרטונים - <strong>פורמט אופקי בלבד</strong>
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* מונה מכסה */}
      {files.length > 0 && (
        <div className="flex gap-6 text-sm font-semibold">
          <span className={photoColor}>
            📷 {validPhotos.length} / {maxPhotos} תמונות
          </span>
          <span className={videoColor}>
            🎬 {validVideos.length} / {maxVideos} סרטונים
          </span>
          {isProcessing && (
            <span className="text-gray-400 animate-pulse">בודק קבצים...</span>
          )}
        </div>
      )}

      {/* גריד תצוגה מקדימה */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {files.map((mf) => (
            <div key={mf.id} className="relative group aspect-video">
              {mf.type === "image" ? (
                <img
                  src={mf.previewUrl}
                  alt={mf.file.name}
                  className={`h-full w-full rounded-lg object-cover ${
                    mf.status === "rejected" ? "opacity-50 ring-2 ring-red-500" : ""
                  }`}
                />
              ) : (
                <video
                  src={mf.previewUrl}
                  className={`h-full w-full rounded-lg object-cover ${
                    mf.status === "rejected" ? "opacity-50 ring-2 ring-red-500" : ""
                  }`}
                  muted
                />
              )}

              {/* badge סטטוס */}
              <span
                className={`absolute bottom-1 right-1 rounded px-1.5 py-0.5 text-xs font-bold text-white ${
                  mf.status === "valid" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {mf.status === "valid" ? "✓" : "✗"}
              </span>

              {/* הודעת שגיאה על hover */}
              {mf.error && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-center text-xs text-white">{mf.error}</p>
                </div>
              )}

              {/* כפתור הסרה */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(mf.id);
                }}
                aria-label={`הסר ${mf.file.name}`}
                className="absolute -left-1.5 -top-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-xs text-white group-hover:flex"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* הודעות שגיאה */}
      <div className="space-y-1">
        {rejected.length > 0 && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            ✗ {rejected.length} קבצים אנכיים - יש להחליפם בגרסאות אופקיות (
            {rejected.map((f) => f.file.name).join(", ")})
          </p>
        )}
        {overPhotoLimit && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            ✗ חרגת ממכסת התמונות ({validPhotos.length}/{maxPhotos}) - הסר{" "}
            {validPhotos.length - maxPhotos} תמונות
          </p>
        )}
        {overVideoLimit && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            ✗ חרגת ממכסת הסרטונים ({validVideos.length}/{maxVideos}) - הסר{" "}
            {validVideos.length - maxVideos} סרטונים
          </p>
        )}
      </div>

      {/* כפתור שליחה */}
      {files.length > 0 && (
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full rounded-xl px-6 py-3 text-base font-semibold transition-colors ${
            canSubmit
              ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
              : "cursor-not-allowed bg-gray-200 text-gray-400"
          }`}
        >
          {isProcessing
            ? "בודק קבצים..."
            : canSubmit
            ? `שלח חומרים לאולפן (${files.length} קבצים)`
            : "תקן שגיאות לפני שליחה"}
        </button>
      )}
    </div>
  );
}
