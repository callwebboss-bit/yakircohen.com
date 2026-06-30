"use client";

import { useCallback, useEffect, useReducer } from "react";
import type { BookFullPathSelection } from "@/components/booking/BookAudienceRouter";
import {
  parseBookCategoryFromHash,
  parseBookCategoryFromPathname,
  parseBookEventItemFromSearch,
  parseBookPackageFromSearch,
  parseBookCatalogFromSearch,
  type BookCategoryId,
  type PricingBookTarget,
} from "@/lib/book-url";
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

export type UseBookFlowOptions = {
  /** מ-/book?item= — פותח אשף אירועים כשאין hash */
  itemParam?: string | null;
  /** מ-/book?pkg= — פותח אשף הגברה לזמרים כשאין hash */
  pkgParam?: string | null;
  /** מ-/book?catalog= — פותח אשף לפי מחירון */
  catalogParam?: string | null;
};

function categoryFromDeepLink(
  itemParam?: string | null,
  pkgParam?: string | null,
  catalogParam?: string | null,
): BookCategoryId | null {
  const fromCatalog = parseBookCatalogFromSearch(catalogParam ?? null);
  if (fromCatalog) return fromCatalog.category;
  if (parseBookEventItemFromSearch(itemParam ?? null)) return "events";
  if (parseBookPackageFromSearch(pkgParam ?? null)) return "singer";
  return null;
}

export function useBookFlow(options?: UseBookFlowOptions) {
  const [state, dispatch] = useReducer(bookFlowReducer, initialBookFlowState);

  useEffect(() => {
    function syncFromLocation() {
      const fromPath = parseBookCategoryFromPathname(window.location.pathname);
      if (fromPath) {
        const qs = window.location.search;
        if (!window.location.hash.includes(fromPath)) {
          window.history.replaceState(null, "", `${window.location.pathname}${qs}#${fromPath}`);
        }
        dispatch({ type: "SYNC_HASH", category: fromPath });
        scrollToWizardPanel();
        return;
      }

      const fromHash = parseBookCategoryFromHash(window.location.hash);
      if (fromHash) {
        dispatch({ type: "SYNC_HASH", category: fromHash });
        scrollToWizardPanel();
        return;
      }

      const fromQuery = categoryFromDeepLink(
        options?.itemParam,
        options?.pkgParam,
        options?.catalogParam,
      );
      if (!fromQuery) return;

      const qs = window.location.search;
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${qs}#${fromQuery}`,
      );
      dispatch({ type: "SYNC_HASH", category: fromQuery });
      scrollToWizardPanel();
    }

    queueMicrotask(syncFromLocation);
    window.addEventListener("hashchange", syncFromLocation);
    return () => window.removeEventListener("hashchange", syncFromLocation);
  }, [options?.itemParam, options?.pkgParam, options?.catalogParam]);

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

  const initialCatalogTarget: PricingBookTarget | null = parseBookCatalogFromSearch(
    options?.catalogParam ?? null,
  );

  const skipStudioGate =
    state.activeCategory === "studio" &&
    !!(state.filterPreset ?? initialCatalogTarget?.filterPreset);

  return {
    ...state,
    initialCatalogTarget,
    skipStudioGate,
    openFullPath,
    backToRouter,
  };
}
