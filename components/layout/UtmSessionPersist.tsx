"use client";

import { useEffect } from "react";
import { persistUtmBoostFromUrl } from "@/hooks/useBookUtmBoost";

/** שומר utm_campaign ב-sessionStorage מכל דף באתר (לא רק /book). */
export default function UtmSessionPersist() {
  useEffect(() => {
    persistUtmBoostFromUrl();
  }, []);
  return null;
}
