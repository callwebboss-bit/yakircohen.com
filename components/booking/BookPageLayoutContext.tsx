"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { BookCategoryId } from "@/lib/book-url";

type BookPageLayoutContextValue = {
  activeCategory: BookCategoryId | null;
  activeRouteId: string | null;
  intakeInView: boolean;
  intakeExpanded: boolean;
  setBookFlowState: (category: BookCategoryId | null, routeId: string | null) => void;
  setIntakeInView: (inView: boolean) => void;
  setIntakeExpanded: (expanded: boolean) => void;
};

const BookPageLayoutContext = createContext<BookPageLayoutContextValue | null>(null);

export function BookPageLayoutProvider({ children }: { children: ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<BookCategoryId | null>(null);
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  const [intakeInView, setIntakeInView] = useState(false);
  const [intakeExpanded, setIntakeExpanded] = useState(true);

  const setBookFlowState = useCallback(
    (category: BookCategoryId | null, routeId: string | null) => {
      setActiveCategory(category);
      setActiveRouteId(routeId);
      if (category) {
        setIntakeExpanded(false);
      }
    },
    [],
  );

  const value = useMemo(
    () => ({
      activeCategory,
      activeRouteId,
      intakeInView,
      intakeExpanded,
      setBookFlowState,
      setIntakeInView,
      setIntakeExpanded,
    }),
    [
      activeCategory,
      activeRouteId,
      intakeInView,
      intakeExpanded,
      setBookFlowState,
    ],
  );

  return (
    <BookPageLayoutContext.Provider value={value}>
      {children}
    </BookPageLayoutContext.Provider>
  );
}

export function useBookPageLayout(): BookPageLayoutContextValue {
  const ctx = useContext(BookPageLayoutContext);
  if (!ctx) {
    throw new Error("useBookPageLayout must be used within BookPageLayoutProvider");
  }
  return ctx;
}

export function useBookPageLayoutOptional(): BookPageLayoutContextValue | null {
  return useContext(BookPageLayoutContext);
}
