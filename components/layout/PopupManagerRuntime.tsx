"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { notifyPopupRoute, startPopupRuntime } from "@/lib/popup-manager";

/** מפעיל את מדידת הזמן, הגלילה והמקלדת של מנהל הפופאפים. לא מרנדר כלום. */
export default function PopupManagerRuntime() {
  const pathname = usePathname() ?? "/";

  useEffect(() => startPopupRuntime(), []);
  useEffect(() => {
    notifyPopupRoute(pathname);
  }, [pathname]);

  return null;
}
