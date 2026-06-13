import type { CSSProperties, ReactNode } from "react";
import { resolveServiceAccentColor } from "@/lib/theme/service-accent";

export type HubAccentScopeProps = {
  category?: string | null;
  children: ReactNode;
};

/**
 * Activates the contextual --service-accent color for a route subtree and
 * lifts it to :root so Header/Footer/FloatingFabs (rendered outside this
 * subtree by the root layout) sync to the same hub color - pure CSS.
 */
export default function HubAccentScope({ category, children }: HubAccentScopeProps) {
  if (!category) return <>{children}</>;

  const accentColor = resolveServiceAccentColor(category);
  const accentStyle = { "--service-accent": accentColor } as CSSProperties;

  return (
    <div style={accentStyle}>
      <style
        dangerouslySetInnerHTML={{
          __html: `:root{--service-accent:${accentColor}}`,
        }}
      />
      {children}
    </div>
  );
}
