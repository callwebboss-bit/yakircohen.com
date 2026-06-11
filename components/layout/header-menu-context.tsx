"use client";

import { createContext, useContext } from "react";

type HeaderMenuContextValue = {
  closeMenu: () => void;
};

const HeaderMenuContext = createContext<HeaderMenuContextValue>({
  closeMenu: () => {},
});

export function useHeaderMenu() {
  return useContext(HeaderMenuContext);
}

export const HeaderMenuProvider = HeaderMenuContext.Provider;
