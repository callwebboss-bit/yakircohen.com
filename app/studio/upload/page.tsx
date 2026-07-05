"use client";

import MediaUploadZone, { MediaFile } from "@/components/media/MediaUploadZone";

export default function StudioUploadPage() {
  function handleFilesChange(valid: MediaFile[]) {
    // placeholder: wire to actual upload logic when ready
    console.log("valid files:", valid.length);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12" dir="rtl">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">העלאת חומרי גלם</h1>
      <p className="mb-6 text-sm text-gray-500">יקיר כהן הפקות - חומרים לפרויקט</p>

      <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        <p className="mb-2 font-semibold text-gray-800">תנאי העלאה:</p>
        <ul className="list-inside list-disc space-y-1">
          <li>עד 30 תמונות</li>
          <li>עד 10 סרטונים</li>
          <li>פורמט אופקי בלבד (landscape) - לא portrait</li>
        </ul>
      </div>

      <MediaUploadZone onFilesChange={handleFilesChange} />
    </main>
  );
}
