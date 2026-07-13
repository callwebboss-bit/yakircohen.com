"use client";

import type { ServiceType } from "@/lib/leads/types";

export type AutoQualifyValues = {
  eventDate?: string;
  budgetHint?: string;
  recordingType?: string;
  notes?: string;
};

type ServiceAutoQualifyFieldsProps = {
  serviceType: ServiceType | "";
  values: AutoQualifyValues;
  onChange: (next: AutoQualifyValues) => void;
};

export default function ServiceAutoQualifyFields({
  serviceType,
  values,
  onChange,
}: ServiceAutoQualifyFieldsProps) {
  if (!serviceType || serviceType === "unknown") return null;

  const showDate = ["events", "photography", "clips", "business"].includes(serviceType);
  const showBudget = ["events", "business", "photography", "studio"].includes(serviceType);
  const showRecording = ["studio", "podcast", "singer"].includes(serviceType);

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface/50 p-4">
      <p className="text-xs font-semibold text-muted-foreground">שאלות התאמה</p>
      {showDate ? (
        <div>
          <label htmlFor="aq-date" className="mb-1 block text-xs font-semibold text-foreground">
            תאריך משוער
          </label>
          <input
            id="aq-date"
            type="date"
            value={values.eventDate || ""}
            onChange={(e) => onChange({ ...values, eventDate: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
          />
        </div>
      ) : null}
      {showBudget ? (
        <div>
          <label htmlFor="aq-budget" className="mb-1 block text-xs font-semibold text-foreground">
            תקציב משוער (לפני מע״מ)
          </label>
          <input
            id="aq-budget"
            type="number"
            min={0}
            inputMode="numeric"
            value={values.budgetHint || ""}
            onChange={(e) => onChange({ ...values, budgetHint: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
            placeholder="למשל 1500"
          />
        </div>
      ) : null}
      {showRecording ? (
        <div>
          <label htmlFor="aq-rec" className="mb-1 block text-xs font-semibold text-foreground">
            סוג הקלטה
          </label>
          <select
            id="aq-rec"
            value={values.recordingType || ""}
            onChange={(e) => onChange({ ...values, recordingType: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
          >
            <option value="">בחרו</option>
            <option value="voice">דיבור / קריינות</option>
            <option value="song">שיר</option>
            <option value="podcast">פודקאסט</option>
            <option value="other">אחר</option>
          </select>
        </div>
      ) : null}
    </div>
  );
}
