"use client";

import { useEffect } from "react";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return target.isContentEditable;
}

/** Press `/` to focus the header site search (when not typing in a field). */
export default function SearchKeyboardShortcut({
  inputId = "site-search-input",
}: {
  inputId?: string;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
      const input = document.getElementById(inputId);
      if (input instanceof HTMLInputElement) {
        input.focus();
        input.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [inputId]);

  return null;
}
