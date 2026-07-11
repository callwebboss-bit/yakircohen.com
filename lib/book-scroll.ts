const WIZARD_PANEL_ID = "book-wizard-panel";

/** Scroll to category wizard and focus the first visible empty input. */
export function scrollToBookWizardPanel(): void {
  const panel = document.getElementById(WIZARD_PANEL_ID);
  if (!panel) return;

  panel.scrollIntoView({ behavior: "smooth", block: "start" });

  requestAnimationFrame(() => {
    window.setTimeout(() => {
      const fields = panel.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
        'input:not([type="hidden"]):not([disabled]):not([readonly]), textarea:not([disabled]):not([readonly])',
      );

      for (const field of fields) {
        if (field.offsetParent === null) continue;
        if (!field.value.trim()) {
          field.focus({ preventScroll: true });
          return;
        }
      }

      const submit = panel.querySelector<HTMLElement>(
        'button[type="submit"], [data-wizard-submit]',
      );
      submit?.focus({ preventScroll: true });
    }, 80);
  });
}
