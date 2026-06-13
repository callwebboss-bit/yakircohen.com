"use client";

import { useId } from "react";
import {
  SCHEDULE_WINDOW_OPTIONS,
  type ScheduleWindowId,
} from "@/lib/data/studio-recording-booking";
import { bookFieldClass } from "@/lib/book-form-ui";
import { cn } from "@/lib/utils";

type BookingSchedulePickerProps = {
  scheduleWindow: ScheduleWindowId | "";
  onScheduleWindowChange: (value: ScheduleWindowId) => void;
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  minDate: string;
  /** תאריך ושעה אופציונליים - נתאם בשיחה */
  dateOptional?: boolean;
  /** רק חלונות זמן - בלי תאריך/שעה (quick path) */
  windowsOnly?: boolean;
  errors?: {
    scheduleWindow?: string;
    date?: string;
    time?: string;
  };
};

export default function BookingSchedulePicker({
  scheduleWindow,
  onScheduleWindowChange,
  date,
  time,
  onDateChange,
  onTimeChange,
  minDate,
  dateOptional = true,
  windowsOnly = false,
  errors = {},
}: BookingSchedulePickerProps) {
  const groupId = useId();
  const dateId = useId();
  const timeId = useId();
  const scheduleErrorId = `${groupId}-schedule-error`;
  const dateErrorId = `${dateId}-error`;
  const timeErrorId = `${timeId}-error`;

  return (
    <div className="space-y-4">
      <div>
        <p id={groupId} className="mb-2 text-xs font-semibold text-foreground">
          מועד מועדף *
        </p>
        <div
          role="radiogroup"
          aria-labelledby={groupId}
          aria-describedby={errors.scheduleWindow ? scheduleErrorId : undefined}
          className="grid grid-cols-1 gap-2 sm:grid-cols-2"
        >
          {SCHEDULE_WINDOW_OPTIONS.map((opt) => {
            const active = scheduleWindow === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onScheduleWindowChange(opt.id)}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-start text-sm transition-colors",
                  active
                    ? "border-brand-red bg-brand-red/5 text-brand-red"
                    : "border-border/60 hover:border-brand-red/30",
                )}
              >
                <span className="font-semibold">{opt.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{opt.detail}</span>
              </button>
            );
          })}
        </div>
        {errors.scheduleWindow ? (
          <p id={scheduleErrorId} className="mt-1 text-xs text-red-500" data-field-error="">
            {errors.scheduleWindow}
          </p>
        ) : null}
      </div>

      {scheduleWindow && windowsOnly ? (
        <p className="text-xs text-muted-foreground">
          💬 תאריך ושעה מדויקים - נתאם יחד בוואטסאפ אחרי השליחה
        </p>
      ) : null}

      {scheduleWindow && !windowsOnly ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={dateId} className="mb-1.5 block text-xs font-semibold">
              תאריך{dateOptional ? " (אופציונלי)" : " *"}
            </label>
            <input
              id={dateId}
              type="date"
              min={minDate}
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? dateErrorId : undefined}
              className={cn(bookFieldClass, errors.date && "border-red-400")}
            />
            {errors.date ? (
              <p id={dateErrorId} className="mt-1 text-xs text-red-500" data-field-error="">
                {errors.date}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor={timeId} className="mb-1.5 block text-xs font-semibold">
              שעה{dateOptional ? " (אופציונלי)" : " *"}
            </label>
            <input
              id={timeId}
              type="time"
              min={scheduleWindow === "motzash" ? "21:00" : undefined}
              value={time}
              onChange={(e) => onTimeChange(e.target.value)}
              aria-invalid={!!errors.time}
              aria-describedby={errors.time ? timeErrorId : undefined}
              className={cn(bookFieldClass, errors.time && "border-red-400")}
            />
            {errors.time ? (
              <p id={timeErrorId} className="mt-1 text-xs text-red-500" data-field-error="">
                {errors.time}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
