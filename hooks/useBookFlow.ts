"use client";

import { useCallback, useEffect, useReducer } from "react";
import type { BookFullPathSelection } from "@/components/booking/BookAudienceRouter";
import { parseBookCategoryFromHash, type BookCategoryId } from "@/lib/book-url";
import type { FilterAnswers } from "@/lib/data/filter-questions";
import { FILTER_STORAGE_KEY } from "@/lib/data/filter-questions";

export type BookFlowState = {
  activeCategory: BookCategoryId | null;
  activeRouteId: string | null;
  filterPreset?: Partial<FilterAnswers>;
  emotionalLabel: string | null;
};

export type BookFlowAction =
  | { type: "OPEN_FULL_PATH"; selection: BookFullPathSelection }
  | { type: "SYNC_HASH"; category: BookCategoryId }
  | { type: "BACK" };

export const initialBookFlowState: BookFlowState = {
  activeCategory: null,
  activeRouteId: null,
  filterPreset: undefined,
  emotionalLabel: null,
};

export function bookFlowReducer(
  state: BookFlowState,
  action: BookFlowAction,
): BookFlowState {
  switch (action.type) {
    case "OPEN_FULL_PATH":
      return {
        activeCategory: action.selection.categoryId,
        activeRouteId: action.selection.routeId,
        filterPreset: action.selection.filterPreset,
        emotionalLabel: action.selection.emotionalLabel,
      };
    case "SYNC_HASH":
      return {
        ...state,
        activeCategory: action.category,
        activeRouteId: null,
      };
    case "BACK":
      return initialBookFlowState;
    default:
      return state;
  }
}

function saveFilterPreset(preset?: Partial<FilterAnswers>) {
  if (!preset?.timeline || !preset?.purpose) return;
  try {
    const answers: FilterAnswers = {
      timeline: preset.timeline,
      purpose: preset.purpose,
    };
    sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(answers));
  } catch {
    /* ignore */
  }
}

function scrollToWizardPanel() {
  requestAnimationFrame(() => {
    document.getElementById("book-wizard-panel")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

export function useBookFlow() {
  const [state, dispatch] = useReducer(bookFlowReducer, initialBookFlowState);

  useEffect(() => {
    function syncFromHash() {
      const fromHash = parseBookCategoryFromHash(window.location.hash);
      if (!fromHash) return;
      dispatch({ type: "SYNC_HASH", category: fromHash });
      scrollToWizardPanel();
    }

    queueMicrotask(syncFromHash);
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const openFullPath = useCallback((selection: BookFullPathSelection) => {
    if (selection.filterPreset) saveFilterPreset(selection.filterPreset);
    dispatch({ type: "OPEN_FULL_PATH", selection });

    if (typeof window !== "undefined") {
      const qs = window.location.search;
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${qs}#${selection.categoryId}`,
      );
      scrollToWizardPanel();
    }
  }, []);

  const backToRouter = useCallback(() => {
    dispatch({ type: "BACK" });
    if (typeof window !== "undefined") {
      const qs = window.location.search;
      window.history.replaceState(null, "", `${window.location.pathname}${qs}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const skipStudioGate =
    state.activeCategory === "studio" && !!state.filterPreset;

  return {
    ...state,
    skipStudioGate,
    openFullPath,
    backToRouter,
  };
}
