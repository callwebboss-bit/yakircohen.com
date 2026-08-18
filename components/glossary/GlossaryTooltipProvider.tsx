"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";

type GlossaryTooltipRegistry = {
  claimFirstUse: (slug: string) => boolean;
};

const GlossaryTooltipContext = createContext<GlossaryTooltipRegistry | null>(
  null,
);

export default function GlossaryTooltipProvider({
  children,
}: {
  children: ReactNode;
}) {
  const seenSlugsRef = useRef<Set<string>>(new Set());

  const claimFirstUse = useCallback((slug: string) => {
    if (seenSlugsRef.current.has(slug)) {
      return false;
    }
    seenSlugsRef.current.add(slug);
    return true;
  }, []);

  return (
    <GlossaryTooltipContext.Provider value={{ claimFirstUse }}>
      {children}
    </GlossaryTooltipContext.Provider>
  );
}

export function useGlossaryTooltipRegistry(): GlossaryTooltipRegistry {
  const context = useContext(GlossaryTooltipContext);
  if (!context) {
    throw new Error(
      "useGlossaryTooltipRegistry must be used within GlossaryTooltipProvider",
    );
  }
  return context;
}
