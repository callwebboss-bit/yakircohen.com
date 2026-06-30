/** Pagefind client index - singleton loader shared across SiteSearch instances. */

export interface PFResult {
  url: string;
  meta: { title?: string; image?: string };
  excerpt: string;
}

export interface PFApi {
  search: (
    query: string,
  ) => Promise<{ results: Array<{ id: string; data: () => Promise<PFResult> }> }>;
}

declare global {
  interface Window {
    pagefind?: PFApi;
  }
}

let loadPromise: Promise<PFApi | null> | null = null;

/** Load Pagefind once; returns null if index missing (dev) or load fails. */
export function loadPagefind(): Promise<PFApi | null> {
  if (typeof window === "undefined") return Promise.resolve(null);

  if (window.pagefind) return Promise.resolve(window.pagefind);

  if (!loadPromise) {
    loadPromise = (async () => {
      try {
        const pf = (await new Function("path", "return import(path)")(
          "/pagefind/pagefind.js",
        )) as PFApi;
        window.pagefind = pf;
        return pf;
      } catch (err) {
        console.error("[pagefind] load failed", err);
        return null;
      }
    })();
  }

  return loadPromise;
}
