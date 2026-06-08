"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_PREFIX = "yakir-booking-draft:";

const DRAFT_VERSION = 2;

type DraftEnvelope<T> = {
  v: typeof DRAFT_VERSION;
  savedAt: string;
  data: T;
};

export type BookingDraftPersisted<T> = {
  /** true אם נטענה טיוטה מ-localStorage */
  restored: boolean;
  /** ISO timestamp of the last persisted save, null if no draft exists */
  savedAt: string | null;
  /** מחיקה אחרי שליחה מוצלחת */
  clear: () => void;
};

function readDraft<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DraftEnvelope<T>;
    if (parsed?.v !== DRAFT_VERSION || !parsed.data) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeDraft<T>(key: string, data: T): void {
  try {
    const envelope: DraftEnvelope<T> = {
      v: DRAFT_VERSION,
      savedAt: new Date().toISOString(),
      data,
    };
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(envelope));
  } catch {
    /* quota / private mode */
  }
}

function removeDraft(key: string): void {
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    /* ignore */
  }
}

/**
 * שומר התקדמות אשף הזמנה ב-localStorage.
 * @param serialize — המרה ל-JSON (למשל Set → מערך)
 * @param deserialize — שחזור מהטיוטה
 */
export function useBookingDraft<T>(
  storageKey: string,
  state: T,
  setState: (value: T) => void,
  serialize: (state: T) => unknown,
  deserialize: (raw: unknown) => T | null,
  enabled = true,
): BookingDraftPersisted<T> {
  const hydrated = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [restored, setRestored] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || hydrated.current) return;
    hydrated.current = true;
    const saved = readDraft<unknown>(storageKey);
    if (saved == null) return;
    const next = deserialize(saved);
    if (next != null) {
      queueMicrotask(() => {
        setState(next);
        setRestored(true);
      });
    }
  }, [storageKey, setState, deserialize, enabled]);

  useEffect(() => {
    if (!enabled || !hydrated.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      writeDraft(storageKey, serialize(state));
      setSavedAt(new Date().toISOString());
    }, 400);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [storageKey, state, serialize, enabled]);

  return {
    restored,
    savedAt,
    clear: () => removeDraft(storageKey),
  };
}
