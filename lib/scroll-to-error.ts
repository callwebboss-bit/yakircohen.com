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
