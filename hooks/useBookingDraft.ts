"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_PREFIX = "yakir-booking-draft:";

export const DRAFT_VERSION = 2;

type DraftEnvelope<T> = {
  v: typeof DRAFT_VERSION;
  savedAt: string;
  data: T;
};

export type BookingDraftPersisted = {
  /** true if a draft was restored from localStorage */
  restored: boolean;
  /** ISO timestamp when draft was restored, null otherwise */
  savedAt: string | null;
  clear: () => void;
  dismissRestored: () => void;
};

function readDraft<T>(key: string): { data: T; savedAt: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DraftEnvelope<T>;
    if (parsed?.v !== DRAFT_VERSION || !parsed.data) return null;
    return { data: parsed.data, savedAt: parsed.savedAt };
  } catch {
    return null;
  }
}

function writeDraft<T>(key: string, data: T): string {
  const savedAt = new Date().toISOString();
  const envelope: DraftEnvelope<T> = {
    v: DRAFT_VERSION,
    savedAt,
    data,
  };
  window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(envelope));
  return savedAt;
}

function removeDraft(key: string): void {
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    /* ignore */
  }
}

/** שמירה ישירה לטיוטה (לפאנלים ללא useBookingWizard) */
export function persistBookingDraft<T>(storageKey: string, data: T): string {
  return writeDraft(storageKey, data);
}

/** מוחק את כל טיוטות /book (yakir-booking-draft:*) */
export function clearAllBookingDrafts(): void {
  if (typeof window === "undefined") return;
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    /* quota / private mode */
  }
}

/**
 * Persists booking wizard progress to localStorage (debounced).
 * serialize/deserialize are read from refs so inline lambdas don't retrigger effects.
 */
export function useBookingDraft<T>(
  storageKey: string,
  state: T,
  setState: (value: T) => void,
  serialize: (state: T) => unknown,
  deserialize: (raw: unknown) => T | null,
  enabled = true,
): BookingDraftPersisted {
  const hydrated = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const serializeRef = useRef(serialize);
  const deserializeRef = useRef(deserialize);
  const setStateRef = useRef(setState);
  const lastSavedAtRef = useRef<string | null>(null);

  useEffect(() => {
    serializeRef.current = serialize;
    deserializeRef.current = deserialize;
    setStateRef.current = setState;
  });

  const [restored, setRestored] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || hydrated.current) return;
    hydrated.current = true;

    try {
      const saved = readDraft<unknown>(storageKey);
      if (saved == null) return;
      const next = deserializeRef.current(saved.data);
      if (next != null) {
        queueMicrotask(() => {
          setStateRef.current(next);
          setRestored(true);
          setSavedAt(saved.savedAt);
          lastSavedAtRef.current = saved.savedAt;
        });
      }
    } catch (err) {
      console.error("[useBookingDraft] draft restore failed", err);
      removeDraft(storageKey);
    }
  }, [storageKey, enabled]);

  useEffect(() => {
    if (!enabled || !hydrated.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        lastSavedAtRef.current = writeDraft(storageKey, serializeRef.current(state));
      } catch {
        /* quota / private mode */
      }
    }, 500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [storageKey, state, enabled]);

  return {
    restored,
    savedAt,
    clear: () => {
      removeDraft(storageKey);
      setRestored(false);
      setSavedAt(null);
      lastSavedAtRef.current = null;
    },
    dismissRestored: () => setRestored(false),
  };
}
