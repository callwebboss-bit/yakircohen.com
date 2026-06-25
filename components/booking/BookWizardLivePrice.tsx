"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type BookWizardLivePriceState = {
  /** מחיר לפני מע״מ מהאשף */
  totalExVat: number;
  /** כותרת קצרה לסרגל הנייד */
  title?: string;
  /** תווית מלאה לכפתור וואטסאפ (אופציונלי) */
  ctaLabel?: string;
};

type BookWizardLivePriceContextValue = {
  livePrice: BookWizardLivePriceState | null;
  setLivePrice: (price: BookWizardLivePriceState | null) => void;
};

const BookWizardLivePriceContext = createContext<BookWizardLivePriceContextValue | null>(
  null,
);

export function BookWizardLivePriceProvider({ children }: { children: ReactNode }) {
  const [livePrice, setLivePrice] = useState<BookWizardLivePriceState | null>(null);
  const value = useMemo(() => ({ livePrice, setLivePrice }), [livePrice]);
  return (
    <BookWizardLivePriceContext.Provider value={value}>
      {children}
    </BookWizardLivePriceContext.Provider>
  );
}

export function useBookWizardLivePrice() {
  const ctx = useContext(BookWizardLivePriceContext);
  if (!ctx) {
    throw new Error("useBookWizardLivePrice must be used within BookWizardLivePriceProvider");
  }
  return ctx;
}

export function useBookWizardLivePriceOptional() {
  return useContext(BookWizardLivePriceContext);
}

/** מדווח מחיר חי מהאשף לסרגל הנייד ול-CTA */
export function useReportBookWizardLivePrice(price: BookWizardLivePriceState | null) {
  const setLivePrice = useBookWizardLivePriceOptional()?.setLivePrice;

  useEffect(() => {
    if (!setLivePrice) return undefined;
    setLivePrice(price);
    return () => setLivePrice(null);
  }, [setLivePrice, price]);
}
