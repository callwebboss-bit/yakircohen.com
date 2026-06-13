import type { ReactNode } from "react";
import HubAccentScope from "@/components/theme/HubAccentScope";

export default function PhotographyLayout({ children }: { children: ReactNode }) {
  return <HubAccentScope category="photography">{children}</HubAccentScope>;
}
