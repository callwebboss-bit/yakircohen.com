/**
 * Scrolls to the first visible field error and shakes it to draw attention.
 * Works across all booking wizards. Relies on `data-field-error` attribute
 * being present on error message elements.
 */
export function scrollAndHighlightFirstError(): void {
  setTimeout(() => {
    const el = document.querySelector<HTMLElement>("[data-field-error]");
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    el.classList.remove("animate-error-shake");
    void el.offsetWidth; // force reflow so animation re-triggers
    el.classList.add("animate-error-shake");
    el.addEventListener(
      "animationend",
      () => el.classList.remove("animate-error-shake"),
      { once: true },
    );
  }, 60);
}

const HIGHLIGHT_CLASS = "wizard-scroll-highlight";

export function scrollToWizardTarget(targetId: string): void {
  if (typeof document === "undefined") return;

  setTimeout(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.remove(HIGHLIGHT_CLASS);
    void el.offsetWidth;
    el.classList.add(HIGHLIGHT_CLASS);
    window.setTimeout(() => el.classList.remove(HIGHLIGHT_CLASS), 2200);
  }, 40);
}

export function scrollToFirstWizardBlocker(
  scrollTargetId: string,
): void {
  scrollToWizardTarget(scrollTargetId);
}
