"use client";

import { useCallback, useSyncExternalStore } from "react";

const listenersByKey = new Map<string, Set<() => void>>();

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = sessionStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function subscribeStorage(key: string, onStoreChange: () => void) {
  let set = listenersByKey.get(key);
  if (!set) {
    set = new Set();
    listenersByKey.set(key, set);
  }
  set.add(onStoreChange);

  const crossTabHandler = (e: StorageEvent) => {
    if (e.key === null || e.key === key) onStoreChange();
  };
  window.addEventListener("storage", crossTabHandler);

  return () => {
    set!.delete(onStoreChange);
    window.removeEventListener("storage", crossTabHandler);
  };
}

function notifyKey(key: string) {
  listenersByKey.get(key)?.forEach((fn) => fn());
}

/**
 * Sync React state with sessionStorage via useSyncExternalStore.
 * Same-tab writes call notifyKey so subscribers re-read the snapshot.
 */
export function useSessionStorageState<T>(
  key: string,
  defaultValue: T,
  serialize: (value: T) => string = JSON.stringify,
) {
  const getSnapshot = useCallback(() => readJson(key, defaultValue), [key, defaultValue]);

  const value = useSyncExternalStore(
    (onStoreChange) => subscribeStorage(key, onStoreChange),
    getSnapshot,
    () => defaultValue,
  );

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function" ? (next as (prev: T) => T)(getSnapshot()) : next;
      try {
        sessionStorage.setItem(key, serialize(resolved));
        notifyKey(key);
      } catch {
        /* private mode / quota */
      }
    },
    [key, serialize, getSnapshot],
  );

  const hydrated = typeof window !== "undefined";

  return { value, setValue, hydrated };
}
