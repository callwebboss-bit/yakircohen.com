"use client";

import { useEffect, useState } from "react";
import type { BookAudienceRoute, QualificationField } from "@/lib/data/book-audience-routes";
import { cn } from "@/lib/utils";

const INPUT_CLASS =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-fast ease-luxury focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20";

type BookQualificationMiniFormProps = {
  route: BookAudienceRoute;
  fields: readonly QualificationField[];
  open: boolean;
  initialAnswers?: Record<string, string>;
  onAnswersChange?: (answers: Record<string, string>) => void;
  onSubmit: (answers: Record<string, string>) => void;
  onFullPath: () => void;
  className?: string;
};

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: QualificationField;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = `qual-${field.id}`;

  if (field.type === "select" && field.options?.length) {
    return (
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT_CLASS}
        required={field.required !== false}
      >
        <option value="">בחרו…</option>
        {field.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      id={id}
      type={field.type === "tel" ? "tel" : field.type === "date" ? "date" : "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      maxLength={field.maxLength}
      required={field.required !== false}
      className={INPUT_CLASS}
      dir="rtl"
    />
  );
}

export default function BookQualificationMiniForm({
  route,
  fields,
  open,
  initialAnswers = {},
  onAnswersChange,
  onSubmit,
  onFullPath,
  className,
}: BookQualificationMiniFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setAnswers(initialAnswers);
  }, [initialAnswers, route.id]);

  if (!fields.length) return null;

  function setField(id: string, value: string) {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      onAnswersChange?.(next);
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    const missing = fields.filter(
      (f) => f.required !== false && !answers[f.id]?.trim(),
    );
    if (missing.length) return;
    onSubmit(answers);
  }

  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-normal ease-luxury",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        className,
      )}
      aria-hidden={!open}
    >
      <div className="min-h-0 overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-xl border border-brand-red/20 bg-brand-red/[0.03] p-4"
          noValidate
        >
          <p className="text-sm font-semibold text-foreground">
            כמה פרטים ונחזור עם הצעה מדויקת
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {route.title} · בדרך כלל תוך שעתיים בימי עבודה
          </p>

          <div className="mt-3 space-y-3">
            {fields.map((field) => (
              <div key={field.id}>
                <label htmlFor={`qual-${field.id}`} className="mb-1 block text-xs font-medium text-foreground">
                  {field.label}
                </label>
                <FieldControl
                  field={field}
                  value={answers[field.id] ?? ""}
                  onChange={(v) => setField(field.id, v)}
                />
                {touched && field.required !== false && !answers[field.id]?.trim() ? (
                  <p className="mt-1 text-xs text-brand-red">שדה חובה</p>
                ) : null}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1fba59] active:scale-[0.98]"
          >
            שלחו לוואטסאפ
          </button>

          <p className="mt-2 flex items-center gap-1 text-[0.65rem] text-muted-foreground">
            <span aria-hidden="true">🔒</span>
            נשמר בדפדפן עד השליחה לוואטסאפ — לא נשלח לשרת האתר
          </p>

          <button
            type="button"
            onClick={onFullPath}
            className="mt-3 inline-flex min-h-9 w-full items-center justify-center text-xs font-medium text-brand-red underline-offset-2 hover:underline"
          >
            רוצים מחשבון מפורט? בנו הצעה מפורטת
          </button>
        </form>
      </div>
    </div>
  );
}
