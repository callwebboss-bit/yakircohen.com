"use client";

import { useEffect, useRef } from "react";

const DEBUG_RENDERS =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_DEBUG_RENDERS === "1";

/** Dev-only render counter - gate with NEXT_PUBLIC_DEBUG_RENDERS=1 */
export function useRenderCount(componentName: string): void {
  const countRef = useRef(0);
  useEffect(() => {
    if (!DEBUG_RENDERS) return;
    countRef.current += 1;
    console.debug(`[render] ${componentName} #${countRef.current}`);
  });
}
