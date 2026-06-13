"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { resolveTabRescueTitle } from "@/lib/data/tab-rescue-titles";

export default function TabRescueTitle() {
  const pathname = usePathname();
  const originalTitleRef = useRef("");

  useEffect(() => {
    originalTitleRef.current = document.title;
    const rescueTitle = resolveTabRescueTitle(pathname);

    const onVisibilityChange = () => {
      document.title = document.hidden
        ? rescueTitle
        : originalTitleRef.current;
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.title = originalTitleRef.current;
    };
  }, [pathname]);

  return null;
}
