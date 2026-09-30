"use client";

import dynamic from "next/dynamic";

/* PwaInstallPrompt נשלח קודם כייבוא סטטי ב-app/layout.tsx, כלומר הוא נכנס לגרף
   הטעינה הראשון של כל עמוד, בשביל רכיב שמופיע הרבה אחר כך. אותו דפוס
   עטיפה שכבר עובד ב-SessionRescuerBarLazy. אין שינוי התנהגות. */
const PwaInstallPrompt = dynamic(() => import("./PwaInstallPrompt"), {
  ssr: false,
});

export default function PwaInstallPromptLazy() {
  return <PwaInstallPrompt />;
}
