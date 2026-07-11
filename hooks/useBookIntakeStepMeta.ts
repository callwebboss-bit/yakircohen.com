"use client";

import { useEffect } from "react";

const STEP_TITLES = [
  "פנייה מהירה - פרטי קשר",
  "בחירת שירותי אודיו ואונליין",
  "סיכום ושליחה",
] as const;

const BRAND_SUFFIX = " | יקיר כהן";

export function useBookIntakeStepMeta(step: number): void {
  useEffect(() => {
    const previousTitle = document.title;
    const title = STEP_TITLES[step] ?? STEP_TITLES[0];
    document.title = `${title}${BRAND_SUFFIX}`;
    return () => {
      document.title = previousTitle;
    };
  }, [step]);
}
