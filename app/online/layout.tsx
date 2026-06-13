import type { ReactNode } from "react";
import HubAccentScope from "@/components/theme/HubAccentScope";

export default function OnlineLayout({ children }: { children: ReactNode }) {
  return <HubAccentScope category="online">{children}</HubAccentScope>;
}
