"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { resolveTabRescueTitle } from "@/lib/data/tab-rescue-titles";

const IDLE_MS = 30_000;
const ACTIVITY_EVENTS = ["mousemove", "keydown", "scroll", "click", "touchstart"] as const;

export default function TabRescueTitle() {
  const pathname = usePathname();
  const originalTitleRef = useRef("");

  useEffect(() => {
    if (pathname?.startsWith("/book")) return;

    originalTitleRef.current = document.title;
    const rescueTitle = resolveTabRescueTitle(pathname);

    const onVisibilityChange = () => {
      document.title = document.hidden ? rescueTitle : originalTitleRef.current;
    };

    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const showRescue = () => {
      if (!document.hidden) document.title = rescueTitle;
    };

    const resetIdle = () => {
      if (idleTimer !== null) clearTimeout(idleTimer);
      if (document.title === rescueTitle && !document.hidden) {
        document.title = originalTitleRef.current;
      }
      idleTimer = setTimeout(showRescue, IDLE_MS);
    };

    ACTIVITY_EVENTS.forEach((e) => document.addEventListener(e, resetIdle, { passive: true }));
    document.addEventListener("visibilitychange", onVisibilityChange);
    idleTimer = setTimeout(showRescue, IDLE_MS);

    return () => {
      if (idleTimer !== null) clearTimeout(idleTimer);
      ACTIVITY_EVENTS.forEach((e) => document.removeEventListener(e, resetIdle));
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.title = originalTitleRef.current;
    };
  }, [pathname]);

  return null;
}
