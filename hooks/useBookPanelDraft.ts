"use client";

import { useEffect, useRef } from "react";
import { persistBookingDraft } from "@/hooks/useBookingDraft";
import { isRecord } from "@/lib/wizard-draft-parse";

const STORAGE_PREFIX = "yakir-booking-draft:";
const DRAFT_VERSION = 2;

function readPanelDraft<T>(storageKey: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { v?: number; data?: unknown };
    if (parsed?.v !== DRAFT_VERSION || !isRecord(parsed.data)) return null;
    return parsed.data as T;
  } catch {
    return null;
  }
}

type UseBookPanelDraftOptions<T extends { step: number }> = {
  storageKey: string;
  data: T;
  shouldPersist: (data: T) => boolean;
  onRestore: (data: T) => void;
  enabled?: boolean;
};

/**
 * שמירה/שחזור טיוטה לפאנלי /book ללא useBookingWizard (מחשבונים, טפסים קצרים).
 */
export function useBookPanelDraft<T extends { step: number }>({
  storageKey,
  data,
  shouldPersist,
  onRestore,
  enabled = true,
}: UseBookPanelDraftOptions<T>) {
  const hydrated = useRef(false);
  const onRestoreRef = useRef(onRestore);
  const shouldPersistRef = useRef(shouldPersist);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onRestoreRef.current = onRestore;
    shouldPersistRef.current = shouldPersist;
  });

  useEffect(() => {
    if (!enabled || hydrated.current) return;
    hydrated.current = true;
    const saved = readPanelDraft<T>(storageKey);
    if (saved && typeof saved.step === "number" && saved.step >= 1) {
      queueMicrotask(() => onRestoreRef.current(saved));
    }
  }, [storageKey, enabled]);

  useEffect(() => {
    if (!enabled || !hydrated.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (shouldPersistRef.current(data)) {
        persistBookingDraft(storageKey, data);
      }
    }, 500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [storageKey, data, enabled]);
}

export function clearPanelBookingDraft(storageKey: string): void {
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + storageKey);
  } catch {
    /* ignore */
  }
}
