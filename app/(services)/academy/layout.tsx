import type { ReactNode } from "react";
import HubAccentScope from "@/components/theme/HubAccentScope";

export default function AcademyLayout({ children }: { children: ReactNode }) {
  return <HubAccentScope category="academy">{children}</HubAccentScope>;
}
