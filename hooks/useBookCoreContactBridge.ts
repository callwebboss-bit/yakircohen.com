"use client";

import { useEffect } from "react";
import { saveBookCoreContact } from "@/lib/book-wizard-cro/shared-contact";

/** שומר שם/טלפון ל-sessionStorage משותף בין קטגוריות */
export function useBookCoreContactBridge(name: string, phone: string): void {
  useEffect(() => {
    if (!name.trim() && !phone.trim()) return;
    saveBookCoreContact({ name, phone });
  }, [name, phone]);
}
