"use client";

import { useState, type FormEvent } from "react";
import { RINGTONE_PRICE_NIS } from "@/lib/data/funny-ringtone-page";
import { formatNis } from "@/lib/data/pricing";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const CONTEXT_OPTIONS = [
  "יום הולדת",
  "הפתעה לחבר/ה",
  "אירוע מיוחד",
  "מתנה משפחתית",
  "אחר",
] as const;

export default function FunnyRingtoneOrderForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const lines = [
      `שלום, קיבלתי פנייה דרך האתר לרינגטון מצחיק (${formatNis(RINGTONE_PRICE_NIS)}):`,
      `שם: ${name.trim()}`,
      `טלפון: ${phone.trim()}`,
      recipient.trim() ? `למי המתנה: ${recipient.trim()}` : null,
      context ? `סוג מתנה: ${context}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const href = buildWhatsAppHref({
      text: lines,
      utm_source: "website",
      utm_campaign: "funny_ringtone_order_form",
    });

    window.open(href, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-brand-red/30 bg-brand-red/5 p-8 text-center">
        <p className="text-lg font-semibold text-foreground">
          תודה! מיד נחזור אליכם.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          פתחנו שיח בוואטסאפ — ספרו לנו על מי שמקבל את הרינגטון ואיזה סגנון מצחיק
          מתאים.
        </p>
      </div>
    );
  }

  return (
    <form
      id="ringtone-order-form"
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-8"
      aria-label="טופס הזמנת רינגטון מצחיק"
      noValidate
    >
      <h2 className="font-serif text-xl font-semibold text-foreground">
        הזמנת רינגטון — {formatNis(RINGTONE_PRICE_NIS)} מבצע
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        השאירו פרטים ונחזור אליכם תוך שעה. בלי התחייבות — רק כדי להבין את
        הרעיון.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="ringtone-name"
            className="block text-sm font-medium text-foreground"
          >
            שם מלא <span className="text-brand-red" aria-hidden>*</span>
          </label>
          <input
            id="ringtone-name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ישראל ישראלי"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
        </div>

        <div>
          <label
            htmlFor="ringtone-phone"
            className="block text-sm font-medium text-foreground"
          >
            טלפון <span className="text-brand-red" aria-hidden>*</span>
          </label>
          <input
            id="ringtone-phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="050-0000000"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
        </div>

        <div>
          <label
            htmlFor="ringtone-recipient"
            className="block text-sm font-medium text-foreground"
          >
            למי המתנה?
          </label>
          <input
            id="ringtone-recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="שם החבר/ה או בן/בת הזוג"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
        </div>

        <div>
          <label
            htmlFor="ringtone-context"
            className="block text-sm font-medium text-foreground"
          >
            סוג מתנה
          </label>
          <select
            id="ringtone-context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          >
            <option value="">בחרו (אופציונלי)</option>
            {CONTEXT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          שלחו הזמנה ←
        </button>
        <p className="text-xs text-muted-foreground">
          הטופס פותח שיח בוואטסאפ — נמשיך משם את כל הפרטים
        </p>
      </div>
    </form>
  );
}
