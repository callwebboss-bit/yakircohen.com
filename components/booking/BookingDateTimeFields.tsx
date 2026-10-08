"use client";

import { useId } from "react";
import FieldError from "@/components/forms/FieldError";
import { bookFieldClass } from "@/lib/book-form-ui";
import { fieldErrorId, splitRequiredLabel } from "@/lib/field-error";
import { cn } from "@/lib/utils";

type BookingDateTimeFieldsProps = {
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  minDate: string;
  errors?: { date?: string; time?: string };
  /** " *" בסוף התווית מזוהה כחובה: aria-required וכוכבית aria-hidden (F-45) */
  dateLabel?: string;
  timeLabel?: string;
};

export default function BookingDateTimeFields({
  date,
  time,
  onDateChange,
  onTimeChange,
  minDate,
  errors = {},
  dateLabel = "תאריך *",
  timeLabel = "שעה *",
}: BookingDateTimeFieldsProps) {
  const dateId = useId();
  const timeId = useId();
  const dateErrorId = fieldErrorId(dateId);
  const timeErrorId = fieldErrorId(timeId);
  const dateParts = splitRequiredLabel(dateLabel);
  const timeParts = splitRequiredLabel(timeLabel);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor={dateId} className="mb-1.5 block text-xs font-semibold">
          {dateParts.text}
          {dateParts.required ? <span aria-hidden="true"> *</span> : null}
        </label>
        <input
          id={dateId}
          type="date"
          min={minDate}
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          aria-invalid={!!errors.date}
          aria-required={dateParts.required ? "true" : undefined}
          aria-describedby={errors.date ? dateErrorId : undefined}
          className={cn(bookFieldClass, errors.date && "border-red-400")}
        />
        <FieldError id={dateErrorId} message={errors.date} />
      </div>
      <div>
        <label htmlFor={timeId} className="mb-1.5 block text-xs font-semibold">
          {timeParts.text}
          {timeParts.required ? <span aria-hidden="true"> *</span> : null}
        </label>
        <input
          id={timeId}
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          aria-invalid={!!errors.time}
          aria-required={timeParts.required ? "true" : undefined}
          aria-describedby={errors.time ? timeErrorId : undefined}
          className={cn(bookFieldClass, errors.time && "border-red-400")}
        />
        <FieldError id={timeErrorId} message={errors.time} />
      </div>
    </div>
  );
}
