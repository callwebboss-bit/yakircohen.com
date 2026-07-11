"use client";

import { useCallback, useRef, useState } from "react";
import {
  formatFileSizeMb,
  validateIntakeFile,
  type IntakeFileMeta,
} from "@/lib/book-intake/file-validation";
import { cn } from "@/lib/utils";

type IntakeFilePickerProps = {
  file: File | null;
  fileMeta: IntakeFileMeta | null;
  fileError: string | null;
  onFileChange: (file: File | null, meta: IntakeFileMeta | null, error: string | null) => void;
  className?: string;
};

export default function IntakeFilePicker({
  file,
  fileMeta,
  fileError,
  onFileChange,
  className,
}: IntakeFilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(
    (incoming: File | null) => {
      if (!incoming) {
        onFileChange(null, null, null);
        return;
      }
      const result = validateIntakeFile(incoming);
      if (!result.valid) {
        onFileChange(null, null, result.error);
        return;
      }
      onFileChange(incoming, result.meta, null);
    },
    [onFileChange],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) processFile(dropped);
    },
    [processFile],
  );

  return (
    <div className={cn("space-y-2", className)}>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors duration-200",
          isDragging
            ? "border-brand-red bg-brand-red/5"
            : "border-border bg-surface hover:border-brand-red/40",
          fileError && "border-brand-red/50",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept="audio/*,video/*,image/*,.zip,.pdf"
          onChange={(e) => {
            const picked = e.target.files?.[0] ?? null;
            processFile(picked);
            e.target.value = "";
          }}
        />
        {fileMeta ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{fileMeta.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSizeMb(fileMeta.size_bytes)}
            </p>
            <button
              type="button"
              className="mt-2 text-xs font-medium text-brand-red underline-offset-2 hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                processFile(null);
              }}
            >
              הסר קובץ
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-foreground">
              גררו קובץ לכאן או לחצו לבחירה
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              אודיו, וידאו, תמונה, ZIP או PDF — עד 500MB
            </p>
          </>
        )}
      </div>

      {fileError ? (
        <p className="text-xs text-brand-red" role="alert">
          {fileError}
        </p>
      ) : null}

      {file && fileMeta ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          הקובץ מאובטח ונבדק מקומית במכשיר שלך. הוא לא יועלה לשרתים חיצוניים - מיד
          לאחר השליחה תוכל לצרף אותו ישירות לחלון הוואטסאפ שייפתח.
        </p>
      ) : (
        <p className="text-xs leading-relaxed text-muted-foreground">
          הקובץ מאובטח ונבדק מקומית במכשיר שלך. הוא לא יועלה לשרתים חיצוניים - מיד
          לאחר השליחה תוכל לצרף אותו ישירות לחלון הוואטסאפ שייפתח.
        </p>
      )}
    </div>
  );
}
