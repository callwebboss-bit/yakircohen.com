"use client";

import dynamic from "next/dynamic";

/* GiftFinderPopup נשלח קודם כייבוא סטטי ב-app/layout.tsx, כלומר הוא נכנס לגרף
   הטעינה הראשון של כל עמוד, בשביל רכיב שמופיע הרבה אחר כך. אותו דפוס
   עטיפה שכבר עובד ב-SessionRescuerBarLazy. אין שינוי התנהגות. */
const GiftFinderPopup = dynamic(() => import("./GiftFinderPopup"), {
  ssr: false,
});

export default function GiftFinderPopupLazy() {
  return <GiftFinderPopup />;
}
