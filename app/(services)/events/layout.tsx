import type { ReactNode } from "react";
import HubAccentScope from "@/components/theme/HubAccentScope";

export default function EventsLayout({ children }: { children: ReactNode }) {
  return <HubAccentScope category="events">{children}</HubAccentScope>;
}
