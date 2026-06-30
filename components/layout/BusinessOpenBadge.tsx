"use client";

import { useSyncExternalStore } from "react";
import { getBusinessOpenStatus } from "@/lib/business-hours";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return getBusinessOpenStatus();
}

function getServerSnapshot(): ReturnType<typeof getBusinessOpenStatus> {
  return { isOpen: true, label: "פתוח עכשיו" };
}

export default function BusinessOpenBadge() {
  const status = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <p className="mb-2 flex items-center gap-2 text-xs">
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${status.isOpen ? "bg-green-500" : "bg-yellow-500"}`}
        aria-hidden
      />
      <span className={status.isOpen ? "font-medium text-emerald-400" : "text-[var(--footer-muted)]"}>
        {status.label}
      </span>
    </p>
  );
}
