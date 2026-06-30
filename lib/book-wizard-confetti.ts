"use client";

/** קונפטי קליל אחרי שליחה מוצלחת לוואטסאפ */
export async function fireBookingConfetti(): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  try {
    const confetti = (await import("canvas-confetti")).default;
    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999";
    document.body.appendChild(canvas);

    void confetti.create(canvas, { resize: true, disableForReducedMotion: true })({
      particleCount: 70,
      spread: 62,
      origin: { y: 0.72 },
      colors: ["#d42b2b", "#25D366", "#f5c542", "#ffffff"],
    });

    window.setTimeout(() => {
      canvas.remove();
    }, 3000);
  } catch {
    /* optional enhancement */
  }
}
