"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  BUSINESS_HOURS,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
  FOOTER_LEGAL_LINKS,
  SITE_KICKER,
  SOCIAL_LINKS,
} from "@/lib/constants";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
  validateContactQuiz,
} from "@/lib/form-validation";
import { notifyLeadByEmail } from "@/lib/lead-email-notify";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type ServiceKey = "studio" | "dj" | "voice" | "podcast" | "clip" | "other";
type TimingKey = "urgent" | "month" | "flexible" | "future";
type BudgetKey = "minimal" | "standard" | "fullpower";

const SERVICE_LABELS: Record<ServiceKey, string> = {
  studio: "הקלטה באולפן",
  dj: "DJ לאירוע",
  voice: "קריינות",
  podcast: "הקלטת פודקאסט",
  clip: "הפקת קליפ / וידאו",
  other: "שירות אחר",
};

const TIMING_LABELS: Record<TimingKey, string> = {
  urgent: "דחוף - השבוע",
  month: "תוך חודש",
  flexible: "גמיש - נתאם יחד",
  future: "עתידי - רק בודקים",
};

const BUDGET_LABELS: Record<BudgetKey, string> = {
  minimal: "מינימליסטי ומדויק",
  standard: "סטנדרט מקצועי",
  fullpower: "הפקה מלאה",
};

const ROADMAPS: Record<ServiceKey, string[]> = {
  studio: [
    "שיחת ייעוץ קצרה בוואטסאפ",
    "תיאום תאריך באולפן במודיעין",
    "הקלטה עם ליווי",
    "עריכה ומסירת קובץ מוכן",
  ],
  dj: [
    "בדיקת זמינות לתאריך האירוע",
    "התאמת חבילת מוזיקה ואפקטים",
    "תיאום מול האולם",
    "הגעה, הפעלה וליווי בערב",
  ],
  voice: [
    "הבנת סגנון וטון הקריינות",
    "הקלטה באולפן או מרחוק",
    "עריכה ומיקס",
    "מסירת קבצים מוכנים לשימוש",
  ],
  podcast: [
    "אפיון פורמט ופרק ראשון",
    "הקלטה באולפן",
    "עריכה ומיתוג שמע",
    "העלאה לפלטפורמות",
  ],
  clip: [
    "תכנון קונספט ותסריט",
    "הקלטה / צילום",
    "עריכה וצבע",
    "מסירת קליפ מוכן",
  ],
  other: [
    "שיחת הבנה קצרה",
    "הצעת מחיר מותאמת",
    "תיאום לוח זמנים",
    "ביצוע והגשה",
  ],
};

const CONTACT_FAQ = [
  {
    q: "כמה עולה הקלטה באולפן?",
    a: "המחיר תלוי בסוג ההקלטה, משך הזמן ורמת ההפקה. נשלח הצעת מחיר מותאמת אחרי שיחה קצרה.",
  },
  {
    q: "אפשר לשמוע דוגמאות מהעבודות?",
    a: "כן. יש דוגמאות ביוטיוב ובאינסטגרם, ונשמח לשלוח קישורים רלוונטיים בוואטסאפ.",
  },
  {
    q: "כמה זמן לוקחת הפקה מלאה?",
    a: "קריינות ופודקאסט - לרוב ימים בודדים. אולפן - לפי היקף. DJ - לפי תאריך האירוע.",
  },
  {
    q: "איפה האולפן ממוקם?",
    a: "במודיעין, עם נגישות נוחה מהמרכז וירושלים. אפשר גם לתאם הקלטה מרחוק לפי הצורך.",
  },
] as const;

const emergencyHref = buildWhatsAppHref({
  text: buildServiceWhatsAppText("DJ לאירוע בדחיפות"),
  utm_source: "website",
  utm_campaign: "contact_emergency_dj",
});

const defaultWaHref = buildWhatsAppHref({
  text: buildServiceWhatsAppText("יצירת קשר"),
  utm_source: "website",
  utm_campaign: "contact_page",
});

function buildQuizWhatsAppMessage(params: {
  service: ServiceKey;
  timing: TimingKey;
  budget: BudgetKey;
  name: string;
  phone: string;
  email: string;
  message: string;
}): string {
  const serviceName = SERVICE_LABELS[params.service];
  const lines = [
    buildServiceWhatsAppText(serviceName),
    `תזמון: ${TIMING_LABELS[params.timing]}`,
    `רמה: ${BUDGET_LABELS[params.budget]}`,
    `שם: ${params.name}`,
    `טלפון: ${params.phone}`,
  ];
  if (params.email.trim()) lines.push(`מייל: ${params.email.trim()}`);
  if (params.message.trim()) lines.push(`הערות: ${params.message.trim()}`);
  return lines.join("\n");
}

function getAvailabilityLabel(): string {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  if ((day === 5 && hour >= 14) || day === 6) {
    return 'שבת שלום - נחזור במוצ"ש';
  }
  return hour >= 9 && hour <= 20
    ? "זמין עכשיו · ממוצע תגובה 15 דקות"
    : "חוזרים ב-9:00 · ממוצע תגובה 15 דקות";
}

export default function ContactPageContent() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<ServiceKey | null>(null);
  const [timing, setTiming] = useState<TimingKey | null>(null);
  const [budget, setBudget] = useState<BudgetKey | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [availability] = useState(getAvailabilityLabel);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { honeypot, setHoneypot, globalError, attemptSubmit } = useLeadFormGuard({
    formId: "contact_quiz",
  });

  const progressPercent = submitted
    ? 100
    : step === 1
      ? 12
      : step === 2
        ? 37
        : step === 3
          ? 62
          : 87;

  const successWaHref = useMemo(() => {
    if (!service || !timing || !budget) return defaultWaHref;
    return buildWhatsAppHref({
      text: buildQuizWhatsAppMessage({
        service,
        timing,
        budget,
        name,
        phone,
        email,
        message,
      }),
      utm_source: "website",
      utm_campaign: "contact_quiz_submit",
    });
  }, [service, timing, budget, name, phone, email, message]);

  const resetQuiz = useCallback(() => {
    setStep(1);
    setService(null);
    setTiming(null);
    setBudget(null);
    setName("");
    setPhone("");
    setEmail("");
    setMessage("");
    setSubmitted(false);
    setFieldErrors({});
  }, []);

  const submitForm = useCallback(() => {
    if (!service || !timing || !budget) return;

    const errs = attemptSubmit(
      () =>
        validateContactQuiz({
          name,
          phone,
          email,
          message,
        }),
      (result) => {
        const displayPhone = result.normalizedPhone
          ? formatPhoneForDisplay(result.normalizedPhone)
          : phone.trim();
        const waText = buildQuizWhatsAppMessage({
          service,
          timing,
          budget,
          name: sanitizeLeadText(name, 60),
          phone: displayPhone,
          email: email.trim(),
          message: sanitizeLeadText(message, 2000),
        });
        const href = buildWhatsAppHref({
          text: waText,
          utm_source: "website",
          utm_campaign: "contact_quiz_submit",
        });
        openWhatsAppLead(href);
        notifyLeadByEmail({
          formId: "contact_quiz",
          subject: "ליד חדש — יצירת קשר",
          body: waText,
          name: sanitizeLeadText(name, 60),
          phone: displayPhone,
        });
        setSubmitted(true);
      },
    );

    setFieldErrors(errs ?? {});
  }, [
    name,
    phone,
    email,
    message,
    service,
    timing,
    budget,
    attemptSubmit,
  ]);

  const micSteps = [
    { icon: "🎤", label: "שירות" },
    { icon: "📅", label: "תזמון" },
    { icon: "💰", label: "תקציב" },
    { icon: "✉️", label: "פרטים" },
  ];

  return (
    <div className="bg-background pb-24 md:pb-0">
      <a
        href={emergencyHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 border-b border-brand-red/30 bg-brand-red/8 px-4 py-3 transition-colors hover:bg-brand-red/12 sm:px-8"
        aria-label="קו חירום ל-DJ"
      >
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-red" />
        </span>
        <span className="min-w-0 flex-1 text-end">
          <span className="block text-sm font-bold text-foreground">
            DJ נפל ברגע האחרון?
          </span>
          <span className="block text-xs text-muted-foreground">
            קו חירום זמין עכשיו · תגובה מהירה
          </span>
        </span>
        <span className="shrink-0 text-brand-red" aria-hidden="true">
          ←
        </span>
      </a>

      <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        <header className="text-center">
          <p className="inline-block rounded-full border border-brand-red px-4 py-1 text-xs font-bold tracking-wider text-brand-red">
            ✦ {SITE_KICKER} ✦
          </p>
          <h1 className="mt-6 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            בואו <span className="text-brand-red">נדבר</span> על הפרויקט שלכם
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            אולפן הקלטות · DJ · קריינות · פודקאסטים · מודיעין
          </p>
        </header>

        <div
          className="mt-8 grid grid-cols-4 items-center gap-2 rounded-xl border border-border bg-surface px-3 py-4"
          role="list"
        >
          {[
            { num: "20+", label: "שנות ניסיון" },
            { num: "500+", label: "פרויקטים" },
            { num: "★ 5.0", label: "דירוג לקוחות" },
            { num: "15 דק׳", label: "זמן תגובה" },
          ].map((item, i) => (
            <div key={item.label} className="contents" role="listitem">
              {i > 0 ? (
                <div
                  className="hidden h-8 w-px bg-border sm:block sm:justify-self-center"
                  aria-hidden="true"
                />
              ) : null}
              <div className="text-center">
                <p className="text-lg font-bold text-brand-red">{item.num}</p>
                <p className="text-[0.65rem] text-muted-foreground">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        <p
          className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground"
          aria-live="polite"
        >
          <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.25)]" />
          {availability}
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div
            className="h-1 bg-border"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-brand-red transition-[width] duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-1 border-b border-border px-4 py-4">
            {micSteps.map((s, i) => {
              const stepNum = i + 1;
              const active = submitted ? stepNum <= 4 : step >= stepNum;
              return (
                <div key={s.label} className="flex flex-1 flex-col items-center gap-1">
                  {i > 0 ? (
                    <div
                      className={cn(
                        "absolute hidden h-px w-full sm:block",
                        active ? "bg-brand-red/40" : "bg-border",
                      )}
                      aria-hidden="true"
                    />
                  ) : null}
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors",
                      active
                        ? "bg-brand-red/15 text-brand-red ring-1 ring-brand-red/40"
                        : "bg-background text-muted-foreground",
                    )}
                  >
                    {s.icon}
                  </div>
                  <span className="text-[0.6rem] font-medium text-muted-foreground">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-5 sm:p-6">
            {!submitted ? (
              <>
                {step === 1 ? (
                  <QuestionBlock
                    label="שלב 1 מתוך 4"
                    title="במה אוכל לעזור לכם?"
                  >
                    <OptionGrid groupLabel="במה אוכל לעזור לכם?">
                      {(Object.keys(SERVICE_LABELS) as ServiceKey[]).map((key) => (
                        <OptionButton
                          key={key}
                          selected={service === key}
                          onClick={() => setService(key)}
                          icon={
                            key === "studio"
                              ? "🎙️"
                              : key === "dj"
                                ? "🎧"
                                : key === "voice"
                                  ? "🎚️"
                                  : key === "podcast"
                                    ? "🎵"
                                    : key === "clip"
                                      ? "🎬"
                                      : "💡"
                          }
                          label={SERVICE_LABELS[key]}
                        />
                      ))}
                    </OptionGrid>
                    <QuizNav
                      onNext={() => service && setStep(2)}
                      nextDisabled={!service}
                    />
                  </QuestionBlock>
                ) : null}

                {step === 2 ? (
                  <QuestionBlock label="שלב 2 מתוך 4" title="מתי אתם צריכים אותנו?">
                    <OptionGrid groupLabel="מתי אתם צריכים אותנו?">
                      {(Object.keys(TIMING_LABELS) as TimingKey[]).map((key) => (
                        <OptionButton
                          key={key}
                          selected={timing === key}
                          onClick={() => setTiming(key)}
                          icon={
                            key === "urgent"
                              ? "⚡"
                              : key === "month"
                                ? "📆"
                                : key === "flexible"
                                  ? "🗓️"
                                  : "🔭"
                          }
                          label={TIMING_LABELS[key]}
                        />
                      ))}
                    </OptionGrid>
                    <QuizNav
                      onBack={() => setStep(1)}
                      onNext={() => timing && setStep(3)}
                      nextDisabled={!timing}
                    />
                  </QuestionBlock>
                ) : null}

                {step === 3 ? (
                  <QuestionBlock
                    label="שלב 3 מתוך 4"
                    title="מה רמת ההפקה שאתם מחפשים?"
                  >
                    <OptionGrid columns={1} groupLabel="מה רמת ההפקה שאתם מחפשים?">
                      {(Object.keys(BUDGET_LABELS) as BudgetKey[]).map((key) => (
                        <OptionButton
                          key={key}
                          selected={budget === key}
                          onClick={() => setBudget(key)}
                          icon={
                            key === "minimal" ? "🎯" : key === "standard" ? "⭐" : "🚀"
                          }
                          label={BUDGET_LABELS[key]}
                          badge={
                            key === "minimal"
                              ? "חסכוני"
                              : key === "standard"
                                ? "פופולרי"
                                : "מלא"
                          }
                        />
                      ))}
                    </OptionGrid>
                    <QuizNav
                      onBack={() => setStep(2)}
                      onNext={() => budget && setStep(4)}
                      nextDisabled={!budget}
                    />
                  </QuestionBlock>
                ) : null}

                {step === 4 ? (
                  <QuestionBlock
                    label="שלב 4 מתוך 4 - כמעט שם"
                    title="השאירו פרטים ונחזור אליכם"
                  >
                    <div className="relative space-y-3">
                      <HoneypotField value={honeypot} onChange={setHoneypot} />
                      <LeadFormAlert message={globalError} />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (fieldErrors.name) {
                            setFieldErrors((prev) => {
                              const next = { ...prev };
                              delete next.name;
                              return next;
                            });
                          }
                        }}
                        placeholder="שם מלא *"
                        autoComplete="name"
                        className={cn(
                          "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-[border-color,box-shadow]",
                          fieldErrors.name
                            ? "border-brand-red ring-2 ring-brand-red/30"
                            : "border-border focus:border-brand-red focus:ring-2 focus:ring-brand-red/30",
                        )}
                        aria-label="שם מלא"
                        aria-invalid={Boolean(fieldErrors.name)}
                      />
                      {fieldErrors.name ? (
                        <p className="text-xs text-brand-red">{fieldErrors.name}</p>
                      ) : null}
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (fieldErrors.phone) {
                            setFieldErrors((prev) => {
                              const next = { ...prev };
                              delete next.phone;
                              return next;
                            });
                          }
                        }}
                        placeholder="050-0000000 *"
                        autoComplete="tel"
                        inputMode="tel"
                        className={cn(
                          "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-[border-color,box-shadow]",
                          fieldErrors.phone
                            ? "border-brand-red ring-2 ring-brand-red/30"
                            : "border-border focus:border-brand-red focus:ring-2 focus:ring-brand-red/30",
                        )}
                        aria-label="טלפון"
                        aria-invalid={Boolean(fieldErrors.phone)}
                      />
                      {fieldErrors.phone ? (
                        <p className="text-xs text-brand-red">{fieldErrors.phone}</p>
                      ) : null}
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (fieldErrors.email) {
                            setFieldErrors((prev) => {
                              const next = { ...prev };
                              delete next.email;
                              return next;
                            });
                          }
                        }}
                        placeholder="מייל (אופציונלי)"
                        autoComplete="email"
                        className={cn(
                          "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-[border-color,box-shadow]",
                          fieldErrors.email
                            ? "border-brand-red ring-2 ring-brand-red/30"
                            : "border-border focus:border-brand-red focus:ring-2 focus:ring-brand-red/30",
                        )}
                        aria-label="מייל"
                        aria-invalid={Boolean(fieldErrors.email)}
                      />
                      {fieldErrors.email ? (
                        <p className="text-xs text-brand-red">{fieldErrors.email}</p>
                      ) : null}
                      <textarea
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (fieldErrors.message) {
                            setFieldErrors((prev) => {
                              const next = { ...prev };
                              delete next.message;
                              return next;
                            });
                          }
                        }}
                        rows={3}
                        placeholder="ספרו לנו קצת על הפרויקט (אופציונלי)"
                        className={cn(
                          "w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-[border-color,box-shadow]",
                          fieldErrors.message
                            ? "border-brand-red ring-2 ring-brand-red/30"
                            : "border-border focus:border-brand-red focus:ring-2 focus:ring-brand-red/30",
                        )}
                        aria-label="הודעה"
                        aria-invalid={Boolean(fieldErrors.message)}
                      />
                      {fieldErrors.message ? (
                        <p className="text-xs text-brand-red">{fieldErrors.message}</p>
                      ) : null}
                      <p className="text-center text-xs text-muted-foreground">
                        הפרטים שלכם שמורים אצלנו בלבד
                      </p>
                    </div>
                    <QuizNav onBack={() => setStep(3)} onNext={submitForm} nextLabel="שלחו" />
                  </QuestionBlock>
                ) : null}
              </>
            ) : (
              <div className="py-4 text-center">
                <p className="text-4xl" aria-hidden="true">
                  🎉
                </p>
                <h2 className="mt-4 text-xl font-semibold text-foreground">
                  פתחנו לכם וואטסאפ עם כל הפרטים
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  שלחו את ההודעה בוואטסאפ ונחזור אליכם תוך כ-15 דקות (בשעות הפעילות).
                </p>
                {service ? (
                  <div className="mt-8 rounded-xl border border-border bg-background p-5 text-start">
                    <p className="text-xs font-bold tracking-wider text-brand-red uppercase">
                      המסלול מכאן
                    </p>
                    <ol className="mt-4 space-y-3">
                      {ROADMAPS[service].map((line, i) => (
                        <li key={line} className="flex gap-3 text-sm">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-xs font-bold text-brand-red">
                            {i + 1}
                          </span>
                          <span className="text-foreground">{line}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
                <a
                  href={successWaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-red px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light"
                >
                  שלחו בוואטסאפ עכשיו
                </a>
                <button
                  type="button"
                  onClick={resetQuiz}
                  className="mt-4 text-sm font-medium text-muted-foreground transition-colors hover:text-brand-red"
                >
                  שלחו פנייה נוספת
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <a
            href={`tel:${CONTACT_PHONE_E164}`}
            className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface px-4 py-4 text-center transition-colors hover:border-brand-red/40"
            aria-label="התקשרו"
          >
            <span className="text-xl" aria-hidden="true">
              📞
            </span>
            <span className="text-sm font-semibold text-foreground">
              {CONTACT_PHONE_DISPLAY}
            </span>
            <span className="text-xs text-muted-foreground">התקשרו</span>
          </a>
          <a
            href={defaultWaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface px-4 py-4 text-center transition-colors hover:border-brand-red/40"
            aria-label="וואטסאפ"
          >
            <span className="text-xl" aria-hidden="true">
              💬
            </span>
            <span className="text-sm font-semibold text-foreground">וואטסאפ</span>
            <span className="text-xs text-muted-foreground">זמין א׳–ו׳</span>
          </a>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            עקבו אחרינו
          </p>
          <div className="mt-3 flex justify-center gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-lg transition-colors hover:border-brand-red/40 hover:bg-brand-red/8"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        <section className="mt-12" aria-label="שאלות נפוצות">
          <h2 className="mb-4 text-center text-lg font-semibold text-foreground">
            שאלות נפוצות
          </h2>
          <div className="space-y-2">
            {CONTACT_FAQ.map((item, i) => (
              <div key={item.q} className="overflow-hidden rounded-xl border border-border bg-surface">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-start text-sm font-semibold text-foreground"
                  aria-expanded={openFaq === i}
                >
                  {item.q}
                  <span
                    className={cn(
                      "shrink-0 text-muted-foreground transition-transform",
                      openFaq === i && "rotate-180",
                    )}
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </button>
                {openFaq === i ? (
                  <p className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          <p>מודיעין · זמין 6 ימים בשבוע</p>
          <p className="mt-2">
            {BUSINESS_HOURS.map((h) => `${h.days}: ${h.hours}`).join(" · ")}
          </p>
          <nav
            className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1"
            aria-label="מסמכים משפטיים"
          >
            {FOOTER_LEGAL_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-brand-red hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </footer>
      </div>

      <a
        href={defaultWaHref}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center gap-2 bg-[#25D366] px-4 py-4 text-sm font-bold text-white shadow-[0_-4px_20px_rgba(0,0,0,0.12)] md:hidden"
        aria-label="שלחו וואטסאפ"
      >
        שלחו הודעה בוואטסאפ
      </a>
    </div>
  );
}

function QuestionBlock({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-wider text-brand-red uppercase">{label}</p>
      <h2 className="mt-2 text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function OptionGrid({
  children,
  columns = 2,
  groupLabel,
}: {
  children: React.ReactNode;
  columns?: 1 | 2;
  groupLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={groupLabel}
      className={cn(
        "grid gap-2",
        columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2",
      )}
    >
      {children}
    </div>
  );
}

function OptionButton({
  selected,
  onClick,
  icon,
  label,
  badge,
}: {
  selected: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-start text-sm font-medium transition-[border-color,background-color,box-shadow]",
        selected
          ? "border-brand-red bg-brand-red/8 text-foreground shadow-sm ring-1 ring-brand-red/30"
          : "border-border bg-background text-foreground hover:border-brand-red/40",
      )}
    >
      <span className="flex flex-col gap-0.5">
        <span>{label}</span>
        {badge ? (
          <span className="text-[0.65rem] font-bold text-brand-red">{badge}</span>
        ) : null}
      </span>
      <span className="text-lg" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}

function QuizNav({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "הבא",
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="mt-6 flex gap-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
        >
          חזור
        </button>
      ) : null}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className={cn(
          "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
          nextDisabled
            ? "cursor-not-allowed bg-border text-muted-foreground"
            : "bg-brand-red text-white hover:bg-brand-red-light",
        )}
      >
        {nextLabel} ←
      </button>
    </div>
  );
}
