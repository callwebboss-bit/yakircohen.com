const FOCUSABLE_SELECTOR =
  'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * מעביר פוקוס לשדה השגוי הראשון (`aria-invalid="true"`) ומחזיר אותו, או null.
 * קבוצה שגויה (radiogroup) מעבירה את הפוקוס לפקד הראשון שבתוכה. השדה מפנה
 * בעצמו להודעה דרך aria-describedby, ולכן קורא המסך שומע שם, מצב והשגיאה.
 * בלי הצעד הזה השגיאה רק נצבעה ונגללה, והפוקוס נשאר על כפתור השליחה (F-11,
 * 7.10.2026). preventScroll: הגלילה נעשית אחר כך אל ההודעה, במרכז המסך.
 */
export function focusFirstInvalidField(
  root: ParentNode = document,
): HTMLElement | null {
  const invalid = Array.from(
    root.querySelectorAll<HTMLElement>('[aria-invalid="true"]'),
  );
  for (const el of invalid) {
    const target = el.matches(FOCUSABLE_SELECTOR)
      ? el
      : el.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    /* מוסתר (display:none) לא מקבל פוקוס, ממשיכים לשדה השגוי הבא */
    if (target && target.getClientRects().length > 0) {
      target.focus({ preventScroll: true });
      return target;
    }
  }
  return null;
}

/**
 * Scrolls to the first visible field error, moves focus to the first invalid
 * field and shakes the message to draw attention.
 * Works across all booking wizards. Relies on `data-field-error` attribute
 * being present on error message elements.
 *
 * `root` מצמצם את החיפוש לטופס שנשלח. בלעדיו מחפשים בכל המסמך, כמו קודם.
 *
 * שגיאה בלי שדה שאפשר למקד (למשל "בחרו לפחות שירות אחד" או אישור התנאים):
 * הפוקוס עובר להודעה עצמה, כדי שקורא מסך יקריא אותה. שגיאה כזו לא צריכה
 * role="alert", אחרת היא מוקראת פעמיים.
 *
 * הודעה שכבר מסומנת role="alert" (למשל בשלבי ה-intake, שעוד לא עברו ל-FieldError)
 * מוקראת בעצמה. שם לא מזיזים פוקוס, כדי לא להקריא אותה פעם שנייה.
 */
export function scrollAndHighlightFirstError(root?: ParentNode | null): void {
  setTimeout(() => {
    const scope = root ?? document;
    const el = scope.querySelector<HTMLElement>("[data-field-error]");
    const announced = el?.getAttribute("role") === "alert";
    const focused = announced ? null : focusFirstInvalidField(scope);
    const anchor = el ?? focused;
    if (!anchor) return;

    if (el && !focused && !announced) {
      el.tabIndex = -1;
      el.focus({ preventScroll: true });
    }

    anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    if (!el) return;

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
