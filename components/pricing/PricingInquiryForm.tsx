"use client";
import { useState } from "react";
import { notifyLeadByEmailAsync } from "@/lib/lead-email-notify";

type Status = "idle" | "submitting" | "success" | "error";

export default function PricingInquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot) return;
    setStatus("submitting");
    try {
      await notifyLeadByEmailAsync({
        formId: "pricing_inquiry",
        subject: `פנייה ממחירון – ${name}`,
        body: `שם: ${name}\nטלפון: ${phone}${message ? `\nהודעה: ${message}` : ""}`,
        name,
        phone,
        website_verification: honeypot,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="rounded-2xl border border-border bg-surface px-6 py-5 text-center text-sm text-foreground">
        ✓ קיבלנו! נחזור אליך תוך 24 שעות.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <input
        type="text"
        name="website_verification"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="piq-name" className="mb-1 block text-xs font-semibold text-foreground">
            שם מלא *
          </label>
          <input
            id="piq-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-2 focus:outline-brand-red"
            placeholder="יקיר כהן"
          />
        </div>
        <div>
          <label htmlFor="piq-phone" className="mb-1 block text-xs font-semibold text-foreground">
            טלפון *
          </label>
          <input
            id="piq-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-2 focus:outline-brand-red"
            placeholder="058-7555456"
          />
        </div>
      </div>

      <div>
        <label htmlFor="piq-message" className="mb-1 block text-xs font-semibold text-foreground">
          שאלה / בקשה (אופציונלי)
        </label>
        <textarea
          id="piq-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-2 focus:outline-brand-red"
          placeholder="על איזה שירות אתם שואלים?"
        />
      </div>

      {status === "error" && (
        <p className="text-xs text-destructive">משהו השתבש. נסו שוב או פנו בוואטסאפ.</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-brand-red px-6 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {status === "submitting" ? "שולח..." : "שלח פנייה"}
      </button>
    </form>
  );
}
