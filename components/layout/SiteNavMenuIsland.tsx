"use client";

import { type ReactNode } from "react";
import { SiteNavMenuButton, useSiteNavMenu } from "@/components/layout/SiteNav";
import { SiteNavMobileDrawerLazy } from "@/components/layout/header-lazy";
import { HeaderMenuProvider } from "@/components/layout/header-menu-context";
import { useRenderCount } from "@/hooks/useRenderCount";

type SiteNavMenuIslandProps = {
  children: (menu: {
    menuOpen: boolean;
    closeMenu: () => void;
    toggleMenu: () => void;
    drawerId: string;
    buttonId: string;
  }) => ReactNode;
};

/** Isolated menu open state + mobile drawer (does not re-render on search toggle). */
export function SiteNavMenuIsland({ children }: SiteNavMenuIslandProps) {
  useRenderCount("SiteNavMenuIsland");
  const menu = useSiteNavMenu();

  return (
    <HeaderMenuProvider value={{ closeMenu: menu.closeMenu }}>
      {children(menu)}
      {menu.menuOpen ? (
        <SiteNavMobileDrawerLazy
          menuOpen={menu.menuOpen}
          onCloseMenu={menu.closeMenu}
          drawerId={menu.drawerId}
        />
      ) : null}
    </HeaderMenuProvider>
  );
}

export function SiteNavMenuButtonSlot({
  menuOpen,
  buttonId,
  drawerId,
  onToggleMenu,
}: {
  menuOpen: boolean;
  buttonId: string;
  drawerId: string;
  onToggleMenu: () => void;
}) {
  return (
    <SiteNavMenuButton
      menuOpen={menuOpen}
      buttonId={buttonId}
      drawerId={drawerId}
      onToggleMenu={onToggleMenu}
    />
  );
}
