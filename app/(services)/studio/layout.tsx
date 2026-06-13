import type { ReactNode } from "react";
import HubAccentScope from "@/components/theme/HubAccentScope";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <HubAccentScope category="studio">{children}</HubAccentScope>;
}
