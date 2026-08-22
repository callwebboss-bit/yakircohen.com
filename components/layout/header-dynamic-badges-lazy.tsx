"use client";

import dynamic from "next/dynamic";

export const HeaderDynamicBadgesGroupLazy = dynamic(
  () =>
    import("@/components/layout/HeaderDynamicBadges").then(
      (m) => m.HeaderDynamicBadgesGroup,
    ),
  { ssr: false },
);

export const TimeGreetingLazy = dynamic(
  () => import("@/components/layout/TimeGreeting"),
  { ssr: false },
);
