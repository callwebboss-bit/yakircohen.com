"use client";

import { memo, useEffect, useState } from "react";
import type { TierACategoryId } from "@/lib/book-wizard-cro/types";
import { extendHoldDeadlineSoft } from "@/lib/book-wizard-cro/urgency";
import { getCroConfig } from "@/lib/data/cro";

function WizardStep3HoldTimerInner({
  category,
  deadlineMs,
}: {
  category: TierACategoryId;
  deadlineMs: number;
}) {
  const config = getCroConfig(category);
  const [deadline, setDeadline] = useState(deadlineMs);
  const [remainingSec, setRemainingSec] = useState(() =>
    Math.max(0, Math.ceil((deadlineMs - Date.now()) / 1000)),
  );
  const [softExpired, setSoftExpired] = useState(false);

  useEffect(() => {
    const tick = () => {
      const sec = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemainingSec(sec);
      if (sec === 0 && !softExpired) {
        setSoftExpired(true);
        setDeadline(extendHoldDeadlineSoft(category));
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [deadline, category, softExpired]);

  if (softExpired) {
    return (
      <p
        className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-xs font-medium text-amber-950"
        role="status"
      >
        {config.urgency.holdExpiredSoft}
      </p>
    );
  }

  const mm = String(Math.floor(remainingSec / 60)).padStart(2, "0");
  const ss = String(remainingSec % 60).padStart(2, "0");
  const urgent = remainingSec > 0 && remainingSec < 60;

  return (
    <p
      className={`mb-4 rounded-xl border px-4 py-2.5 text-center text-xs font-medium ${
        urgent
          ? "border-amber-300 bg-amber-50 text-amber-900"
          : "border-amber-200 bg-amber-50 text-amber-950"
      }`}
      role="status"
    >
      {config.urgency.holdPrefix}{" "}
      <span className="tabular-nums font-bold">
        {mm}:{ss}
      </span>
    </p>
  );
}

export const WizardStep3HoldTimer = memo(WizardStep3HoldTimerInner);
