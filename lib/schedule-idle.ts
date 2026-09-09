/** Defer work until the main thread is idle - keeps INP budget for first taps. */
export function scheduleIdle(
  callback: () => void,
  options?: { timeout?: number },
): () => void {
  if (typeof window === "undefined") return () => {};

  const timeout = options?.timeout ?? 3000;

  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(id);
  }

  const id = globalThis.setTimeout(callback, Math.min(timeout, 1200));
  return () => globalThis.clearTimeout(id);
}
