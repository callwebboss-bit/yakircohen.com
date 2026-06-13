import type { ReactNode } from "react";
import HubAccentScope from "@/components/theme/HubAccentScope";

export default function PhotoSlideshowLayout({ children }: { children: ReactNode }) {
  return <HubAccentScope category="video">{children}</HubAccentScope>;
}
