"use client";

import dynamic from "next/dynamic";

/* אותו דפוס עטיפה כמו SessionRescuerBarLazy: מדידת הזמן והגלילה לא צריכה להיות
   בגרף הטעינה הראשון. הפופאפ הראשון יכול להופיע רק אחרי 25 שניות או 40 אחוז
   גלילה, וההידרציה מסיימת הרבה לפני. */
const PopupManagerRuntime = dynamic(
  () => import("@/components/layout/PopupManagerRuntime"),
  { ssr: false },
);

export default function PopupManagerRuntimeLazy() {
  return <PopupManagerRuntime />;
}
