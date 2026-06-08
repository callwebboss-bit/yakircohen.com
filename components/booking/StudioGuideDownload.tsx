"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type StudioGuideDownloadProps = {
  emoji: string;
  title: string;
  subtitle: string;
  /** קישור תצוגה (Google Drive view) */
  viewUrl: string;
  /** מזהה קובץ Drive להורדה ישירה */
  driveFileId: string;
  className?: string;
};

export default function StudioGuideDownload({
  emoji,
  title,
  subtitle,
  viewUrl,
  driveFileId,
  className,
}: StudioGuideDownloadProps) {
  const [downloading, setDownloading] = useState(false);
  const directUrl = `https://drive.google.com/uc?export=download&id=${driveFileId}`;

  const handleDownload = () => {
    setDownloading(true);
    const anchor = document.createElement("a");
    anchor.href = directUrl;
    anchor.download = "";
    anchor.rel = "noopener";
    anchor.target = "_blank";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => setDownloading(false), 1200);
  };

  return (
    <aside
      className={cn(
        "rounded-2xl border border-brand-red/25 bg-gradient-to-br from-brand-red/8 to-surface p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <span className="text-3xl" aria-hidden="true">
            {emoji}
          </span>
          <div>
            <p className="text-sm font-bold text-foreground">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center justify-center rounded-xl bg-brand-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light disabled:opacity-70"
          >
            {downloading ? "מוריד..." : "הורידו לקבצים"}
          </button>
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-brand-red/40 bg-background px-4 py-2.5 text-sm font-semibold text-brand-red transition-colors hover:bg-brand-red/10"
          >
            צפייה בדפדפן
          </a>
        </div>
      </div>
    </aside>
  );
}
