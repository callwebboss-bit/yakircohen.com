"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadPagefind, type PFApi, type PFResult } from "@/lib/pagefind-loader";

export type PagefindSearchStatus =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "unavailable";

export type PagefindSearchState = {
  status: PagefindSearchStatus;
  results: PFResult[];
  isStale: boolean;
};

type UsePagefindSearchOptions = {
  maxResults?: number;
  debounceMs?: number;
};

export function usePagefindSearch(
  query: string,
  { maxResults = 7, debounceMs = 220 }: UsePagefindSearchOptions = {},
): PagefindSearchState {
  const [status, setStatus] = useState<PagefindSearchStatus>("idle");
  const [results, setResults] = useState<PFResult[]>([]);
  const [isStale, setIsStale] = useState(false);
  const indexRef = useRef<PFApi | null | undefined>(undefined);
  const requestIdRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const resultsRef = useRef<PFResult[]>([]);
  resultsRef.current = results;

  const ensureIndex = useCallback(async (): Promise<PFApi | null> => {
    if (indexRef.current !== undefined) return indexRef.current;
    const pf = await loadPagefind();
    indexRef.current = pf;
    if (pf == null) setStatus("unavailable");
    return pf;
  }, []);

  const runSearch = useCallback(
    async (q: string, reqId: number) => {
      const trimmed = q.trim();
      if (!trimmed) {
        setStatus("idle");
        setResults([]);
        setIsStale(false);
        return;
      }

      const pf = await ensureIndex();
      if (pf == null) {
        setStatus("unavailable");
        return;
      }
      if (reqId !== requestIdRef.current) return;

      if (resultsRef.current.length > 0) setIsStale(true);
      setStatus("loading");

      try {
        const res = await pf.search(trimmed);
        if (reqId !== requestIdRef.current) return;
        const data = await Promise.all(
          res.results.slice(0, maxResults).map((r) => r.data()),
        );
        setResults(data);
        setStatus("success");
        setIsStale(false);
      } catch {
        if (reqId !== requestIdRef.current) return;
        setStatus("error");
        setIsStale(false);
      }
    },
    [ensureIndex, maxResults],
  );

  useEffect(() => {
    clearTimeout(timerRef.current);
    const reqId = ++requestIdRef.current;

    if (!query.trim()) {
      setStatus("idle");
      setResults([]);
      setIsStale(false);
      return;
    }

    timerRef.current = setTimeout(() => {
      void runSearch(query, reqId);
    }, debounceMs);

    return () => clearTimeout(timerRef.current);
  }, [query, debounceMs, runSearch]);

  return { status, results, isStale };
}

/** Call on input focus to warm the Pagefind bundle. */
export function warmPagefindIndex(): void {
  void loadPagefind();
}
