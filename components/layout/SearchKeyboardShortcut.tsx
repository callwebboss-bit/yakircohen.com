"use client";

import { useEffect } from "react";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return target.isContentEditable;
}

/** האלמנט מוצג בפועל (לא display:none ולא visibility:hidden, כולל אב מוסתר). */
function isRendered(el: HTMLElement): boolean {
  if (el.getClientRects().length === 0) return false;
  return getComputedStyle(el).visibility !== "hidden";
}

/**
 * יש דיאלוג פתוח בדף: role=dialog או <dialog open> שלא מוסתרים. דיאלוג סגור
 * נשאר ב-DOM עם hidden (ווידג'ט הנגישות) או עם inert ו-aria-hidden (הצ'אט),
 * ולכן מדלגים עליו.
 */
function isDialogOpen(): boolean {
  const dialogs = document.querySelectorAll<HTMLElement>(
    '[role="dialog"], [role="alertdialog"], dialog[open]',
  );
  for (const dialog of dialogs) {
    if (dialog.closest('[hidden], [inert], [aria-hidden="true"]')) continue;
    if (isRendered(dialog)) return true;
  }
  return false;
}

/** המשתמש כיבה את הקיצור בתפריט הנגישות (yc_a11y_prefs.noShortcuts). */
function isShortcutDisabled(): boolean {
  try {
    const stored = localStorage.getItem("yc_a11y_prefs");
    return stored ? (JSON.parse(stored) as { noShortcuts?: boolean }).noShortcuts === true : false;
  } catch {
    return false;
  }
}

/**
 * Press `/` to focus the header site search (when not typing in a field).
 *
 * F-30 (7.10.2026): 2.1.4 דורש שקיצור של מקש בודד יהיה ניתן לכיבוי או לשינוי. הוא נשאר
 * פעיל כברירת מחדל, ואפשר לכבות אותו בתפריט הנגישות (8.10.2026). מה שכן: מתחת ל-1024px שדה החיפוש של
 * ה-header מוסתר, ואז "/" נבלע ולא קורה כלום. ואם דיאלוג פתוח (ווידג'ט הנגישות
 * למשל), "/" גנב ממנו את הפוקוס. בשני המקרים לא קוראים ל-preventDefault, כדי
 * שהדפדפן יטפל במקש כרגיל.
 */
export default function SearchKeyboardShortcut({
  inputId = "site-search-input",
}: {
  inputId?: string;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      if (isEditableTarget(e.target)) return;
      if (isShortcutDisabled()) return;
      const input = document.getElementById(inputId);
      if (!(input instanceof HTMLInputElement) || !isRendered(input)) return;
      if (isDialogOpen()) return;
      e.preventDefault();
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [inputId]);

  return null;
}
