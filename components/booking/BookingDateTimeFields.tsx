"use client";

import { useId } from "react";
import { bookFieldClass } from "@/lib/book-form-ui";
import { cn } from "@/lib/utils";

type BookingDateTimeFieldsProps = {
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  minDate: string;
  errors?: { date?: string; time?: string };
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
  const dateErrorId = `${dateId}-error`;
  const timeErrorId = `${timeId}-error`;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor={dateId} className="mb-1.5 block text-xs font-semibold">
          {dateLabel}
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
          {timeLabel}
        </label>
        <input
          id={timeId}
          type="time"
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
  );
}
