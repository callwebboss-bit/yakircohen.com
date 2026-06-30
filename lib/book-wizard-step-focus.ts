/** כותרות שלבים בוויזארד אולפן - לפוקוס ונגישות אחרי מעבר שלב */
export const STUDIO_WIZARD_STEP_HEADING_IDS = [
  "book-step-heading-0",
  "book-step-heading-1",
  "book-step-heading-2",
] as const;

export function scrollToBookWizardPanelAndFocusStep(step: number): void {
  if (typeof document === "undefined") return;

  document.getElementById("book-wizard-panel")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  requestAnimationFrame(() => {
    const id = STUDIO_WIZARD_STEP_HEADING_IDS[step];
    if (!id) return;
    const el = document.getElementById(id);
    if (el instanceof HTMLElement) {
      el.focus({ preventScroll: true });
    }
  });
}
