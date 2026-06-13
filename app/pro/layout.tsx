import type { ReactNode } from "react";
import HubAccentScope from "@/components/theme/HubAccentScope";

export default function ProLayout({ children }: { children: ReactNode }) {
  return <HubAccentScope category="pro">{children}</HubAccentScope>;
}
