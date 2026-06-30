"use client";

import { useEffect, useState } from "react";
import { getBusinessOpenStatus, type BusinessOpenStatus } from "@/lib/business-hours";

function subscribeOpenStatus(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const id = window.setInterval(onStoreChange, 60_000);
  const onVisibility = () => onStoreChange();
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
    window.clearInterval(id);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}

export default function BusinessOpenBadge() {
  const [status, setStatus] = useState<BusinessOpenStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getBusinessOpenStatus());
    update();
    return subscribeOpenStatus(update);
  }, []);

  if (!status) {
    return <p className="mb-2 h-5" aria-hidden />;
  }

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
