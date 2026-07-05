"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CHATBOT_DATA,
  GUIDED_PATHS,
  PATHNAME_PRIORITY,
  getGreeting,
  isStudioOpen,
  type ChatQuestion,
  type GuidedOption,
} from "@/lib/chatbot-data";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { trackConversion } from "@/lib/analytics/conversion-events";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";

const FOCUSABLE_SELECTORS =
  'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

const LS_KEY = "yc_last_faq";

function ChatBubbleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4", className)}
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51 15.42 17.49M15.41 6.51 8.59 10.49" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

export default function ChatWidget({
  className,
  onOpenChange,
}: {
  className?: string;
  onOpenChange?: (open: boolean) => void;
}) {
  const [view, setView] = useState<"closed" | "list" | "answer">("closed");
  const [activeQuestion, setActiveQuestion] = useState<ChatQuestion | null>(null);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [offlineToast, setOfflineToast] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  // ─── Guided discovery ────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"faq" | "guided">("faq");
  const [guidedStep, setGuidedStep] = useState<string>("root");
  const [guidedHistory, setGuidedHistory] = useState<string[]>([]);

  const fabRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);
  const guidedFirstButtonRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname();

  // ─── Deep link: ?faq=question_id ─────────────────────────────────────────
  useEffect(() => {
    function openFaqFromUrl() {
      try {
        const faqId = new URLSearchParams(window.location.search).get("faq");
        if (!faqId) return;
        const found = CHATBOT_DATA.questions.find((q) => q.id === faqId);
        if (found) {
          setActiveQuestion(found);
          setView("answer");
        }
      } catch {
        /* ignore */
      }
    }

    openFaqFromUrl();
    window.addEventListener("popstate", openFaqFromUrl);
    return () => window.removeEventListener("popstate", openFaqFromUrl);
  }, [pathname]);

  // ─── Priority questions for current page ─────────────────────────────────
  const priorityIds: string[] = [];
  for (const [prefix, ids] of Object.entries(PATHNAME_PRIORITY)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      priorityIds.push(...ids);
      break;
    }
  }

  // Hidden questions are only shown when surfaced as page-priority items
  const visibleQuestions = CHATBOT_DATA.questions.filter(
    (q) => !q.hidden || priorityIds.includes(q.id),
  );

  const sortedQuestions =
    priorityIds.length > 0
      ? [
          ...visibleQuestions.filter((q) => priorityIds.includes(q.id)),
          ...visibleQuestions.filter((q) => !priorityIds.includes(q.id)),
        ]
      : visibleQuestions;

  const dynamicSub =
    priorityIds.length > 0
      ? `נמצאו ${priorityIds.length} תשובות מהירות לנושא זה`
      : CHATBOT_DATA.subGreeting;

  // ─── localStorage: restore last viewed ───────────────────────────────────
  useEffect(() => {
    try {
      const lastId = localStorage.getItem(LS_KEY);
      if (lastId) {
        const found = CHATBOT_DATA.questions.find((q) => q.id === lastId);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (found) setActiveQuestion(found);
      }
    } catch {
      // localStorage unavailable (SSR / privacy mode)
    }
  }, []);

  // ─── Escape closes panel ─────────────────────────────────────────────────
  useEffect(() => {
    if (view === "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setView("closed");
        setActiveQuestion(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view]);

  // ─── Focus management ─────────────────────────────────────────────────────
  useEffect(() => {
    if (view === "list") {
      if (activeTab === "guided") {
        guidedFirstButtonRef.current?.focus();
      } else {
        firstButtonRef.current?.focus();
      }
    } else if (view === "answer") {
      answerRef.current?.focus();
    } else {
      if (document.activeElement !== document.body) {
        fabRef.current?.focus();
      }
    }
  }, [view, activeTab]);

  // ─── Tab trap inside panel ────────────────────────────────────────────────
  const handlePanelKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [],
  );

  // ─── Pulse animation: once, 5s after mount, cleared on first open ────────
  useEffect(() => {
    const key = "yc_chat_pulse_shown";
    try {
      if (sessionStorage.getItem(key)) return;
    } catch { /* ignore */ }
    const t = setTimeout(() => {
      setShowPulse(true);
      // auto-stop after 3 cycles (~2.4s each = 8s total)
      setTimeout(() => setShowPulse(false), 8000);
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  // ─── Notify parent of open/close ─────────────────────────────────────────
  useEffect(() => {
    onOpenChange?.(view !== "closed");
  }, [view, onOpenChange]);

  // ─── Actions ──────────────────────────────────────────────────────────────
  const handleOpen = () => {
    trackConversion("chatbot_open");
    setShowPulse(false);
    try { sessionStorage.setItem("yc_chat_pulse_shown", "1"); } catch { /* ignore */ }
    setView("list");
  };

  const handleClose = () => {
    setView("closed");
    setActiveQuestion(null);
  };

  // ─── Guided navigation ────────────────────────────────────────────────────
  const handleGuidedOption = (opt: GuidedOption) => {
    if (opt.questionId) {
      const q = CHATBOT_DATA.questions.find((q) => q.id === opt.questionId);
      if (q) selectQuestion(q);
    } else if (opt.nextStep) {
      setGuidedHistory((h) => [...h, guidedStep]);
      setGuidedStep(opt.nextStep);
    }
  };

  const handleGuidedBack = () => {
    if (guidedHistory.length > 0) {
      const prev = guidedHistory[guidedHistory.length - 1];
      setGuidedHistory((h) => h.slice(0, -1));
      setGuidedStep(prev);
    } else {
      setActiveTab("faq");
      setGuidedStep("root");
    }
  };

  const handleSwitchToGuided = () => {
    setActiveTab("guided");
    setGuidedStep("root");
    setGuidedHistory([]);
  };

  const selectQuestion = (q: ChatQuestion) => {
    trackConversion("chatbot_question_click", {
      question_id: q.id,
      question_label: q.label,
    });
    setVisitedIds((prev) => new Set(prev).add(q.id));
    try {
      localStorage.setItem(LS_KEY, q.id);
    } catch {
      // ignore
    }
    setActiveQuestion(q);
    setView("answer");
  };

  const handleWhatsAppClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    campaign: string,
    questionId: string,
  ) => {
    if (!navigator.onLine) {
      e.preventDefault();
      setOfflineToast(true);
      setTimeout(() => setOfflineToast(false), 3500);
      return;
    }
    trackConversion("chatbot_wa_cta_click", {
      question_id: questionId,
      utm_campaign: campaign,
    });
  };

  const handleReadMore = (href: string) => {
    trackConversion("chatbot_read_more_click", { href });
    handleClose();
  };

  const handleShare = async (q: ChatQuestion) => {
    trackConversion("chatbot_share_click", { question_id: q.id });
    const url = `${window.location.origin}${window.location.pathname}?faq=${q.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: q.label, text: q.answer.text, url });
      } catch {
        // user cancelled share - not an error
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 1500);
      } catch {
        // clipboard unavailable
      }
    }
  };

  const handleCopy = async (q: ChatQuestion) => {
    trackConversion("chatbot_copy_click", { question_id: q.id });
    try {
      await navigator.clipboard.writeText(q.answer.whatsappMessage ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  const handleClearHistory = () => {
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      // ignore
    }
    setActiveQuestion(null);
    setVisitedIds(new Set());
    setView("list");
  };

  const open = isStudioOpen();
  const greeting = getGreeting();

  return (
    <div
      className={cn("fixed left-6 z-[52] font-sans", className)}
      dir="rtl"
    >
      {/* ── Offline Toast ──────────────────────────────────────────────── */}
      {offlineToast && (
        <div
          role="alert"
          aria-live="assertive"
          className="absolute bottom-[calc(100%+1rem)] left-0 w-64 rounded-xl border border-border bg-background p-3 text-xs text-foreground shadow-lg"
        >
          חיבור הרשת חלש כעת. ניתן לנסות שוב כשהקליטה תתחדש.
        </div>
      )}

      {/* ── Share Copied Toast ─────────────────────────────────────────── */}
      {shareCopied && (
        <div
          role="status"
          aria-live="polite"
          className="absolute bottom-[calc(100%+1rem)] left-0 w-44 rounded-xl border border-border bg-background p-3 text-xs text-foreground shadow-lg"
        >
          קישור הועתק ללוח
        </div>
      )}

      {/* ── FAB ───────────────────────────────────────────────────────── */}
      <div className="relative">
        {showPulse && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-[var(--service-accent,#d42b2b)] opacity-60 animate-ping"
          />
        )}
      <button
        ref={fabRef}
        onClick={() => (view === "closed" ? handleOpen() : handleClose())}
        aria-expanded={view !== "closed"}
        aria-haspopup="dialog"
        aria-label={
          view === "closed"
            ? "פתיחת מרכז מידע מהיר ושאלות נפוצות"
            : "סגירת מרכז מידע"
        }
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--service-accent,#d42b2b)] text-white shadow-[0_0_24px_color-mix(in_srgb,var(--service-accent,#d42b2b)_25%,transparent)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-luxury)] hover:scale-105 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]"
      >
        <ChatBubbleIcon />
      </button>
      </div>

      {/* ── Panel ─────────────────────────────────────────────────────── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="מרכז מידע מהיר - שאלות נפוצות"
        aria-modal="true"
        aria-hidden={view === "closed"}
        data-state={view !== "closed" ? "open" : "closed"}
        onKeyDown={handlePanelKeyDown}
        className="absolute bottom-[calc(100%+0.75rem)] left-0 flex w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl transition-all duration-200 ease-out data-[state=closed]:pointer-events-none data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100 max-h-[calc(100dvh-14rem)] sm:max-h-[75vh] sm:w-96"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-gradient-to-l from-[var(--service-accent,#d42b2b)]/5 to-background px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--service-accent,#d42b2b)]/10 text-lg" aria-hidden>
              🎙️
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground leading-none">
                יקיר כהן הפקות ⚡
              </h3>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground leading-none">
                <span
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    open ? "animate-pulse bg-green-500" : "bg-muted-foreground/40",
                  )}
                  aria-hidden
                />
                {open ? "זמין כעת" : "סגור כעת"}
              </p>
            </div>
          </div>
          {/* Quick close - prominent, easy to dismiss */}
          <button
            onClick={handleClose}
            aria-label="סגירת חלונית המידע וחזרה לעמוד הראשי"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-muted-foreground/40 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 scrollbar-thin"
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* ── LIST VIEW ──────────────────────────────────────────────── */}
          {view === "list" && (
            <div className="space-y-3">
              {/* Tab bar */}
              <div
                role="tablist"
                aria-label="בחר מצב"
                className="flex rounded-xl border border-border overflow-hidden"
              >
                <button
                  role="tab"
                  aria-selected={activeTab === "faq"}
                  onClick={() => setActiveTab("faq")}
                  className={cn(
                    "flex-1 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--service-accent,#d42b2b)]",
                    activeTab === "faq"
                      ? "bg-[var(--service-accent,#d42b2b)] text-white"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  שאלות נפוצות
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === "guided"}
                  onClick={handleSwitchToGuided}
                  className={cn(
                    "flex-1 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--service-accent,#d42b2b)]",
                    activeTab === "guided"
                      ? "bg-[var(--service-accent,#d42b2b)] text-white"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  עזרו לי לבחור ←
                </button>
              </div>

              {/* FAQ tab */}
              {activeTab === "faq" && (
                <>
                  <p className="text-xs text-muted-foreground">{dynamicSub}</p>
                  {sortedQuestions.map((q, idx) => {
                    const isPriority = priorityIds.includes(q.id);
                    const isVisited = visitedIds.has(q.id);
                    return (
                      <button
                        key={q.id}
                        ref={idx === 0 ? firstButtonRef : undefined}
                        onClick={() => selectQuestion(q)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-right text-sm transition-all focus-visible:bg-muted",
                          isPriority
                            ? "border-[var(--service-accent,#d42b2b)]/30 hover:border-[var(--service-accent,#d42b2b)]/50 hover:bg-muted/50"
                            : "border-border hover:border-muted-foreground/30 hover:bg-muted/50",
                          isVisited ? "text-muted-foreground/60" : "font-medium text-foreground",
                        )}
                      >
                        <span>{q.label}</span>
                        <span className="shrink-0 text-[10px] font-normal text-muted-foreground/50">
                          ⚡ מיידי
                        </span>
                      </button>
                    );
                  })}
                </>
              )}

              {/* Guided tab */}
              {activeTab === "guided" && (() => {
                const step = GUIDED_PATHS[guidedStep];
                if (!step) return null;
                return (
                  <div className="space-y-2">
                    {(guidedHistory.length > 0) && (
                      <button
                        onClick={handleGuidedBack}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <ArrowIcon />
                        חזרה לשלב הקודם
                      </button>
                    )}
                    <p className="text-sm font-semibold text-foreground pb-1">{step.question}</p>
                    {step.options.map((opt, idx) => (
                      <button
                        key={opt.label}
                        ref={idx === 0 ? guidedFirstButtonRef : undefined}
                        onClick={() => handleGuidedOption(opt)}
                        className="flex w-full items-center justify-between rounded-xl border border-border px-3 py-2.5 text-right text-sm font-medium text-foreground transition-all hover:border-[var(--service-accent,#d42b2b)]/40 hover:bg-muted/50 focus-visible:bg-muted"
                      >
                        <span>{opt.label}</span>
                        <span className="shrink-0 text-[10px] font-normal text-muted-foreground/50">
                          {opt.nextStep ? "→" : "לתשובה"}
                        </span>
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── ANSWER VIEW ────────────────────────────────────────────── */}
          {view === "answer" && activeQuestion && (
            <div
              ref={answerRef}
              tabIndex={-1}
              aria-live="polite"
              className="space-y-4 outline-none"
            >
              <button
                onClick={() => setView("list")}
                className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
              >
                <ArrowIcon />
                {activeTab === "guided" ? "חזרה לשלב הקודם" : "חזרה לרשימת השאלות"}
              </button>

              {/* Question title + Share */}
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-foreground leading-snug">
                  {activeQuestion.label}
                </h4>
                <button
                  onClick={() => handleShare(activeQuestion)}
                  title="שליחת תשובה זו"
                  aria-label="שיתוף קישור לתשובה זו"
                  className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]"
                >
                  <ShareIcon />
                </button>
              </div>

              <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                {activeQuestion.answer.text}
              </p>

              {activeQuestion.answer.readMoreHref && (
                <Link
                  href={activeQuestion.answer.readMoreHref}
                  onClick={() => handleReadMore(activeQuestion.answer.readMoreHref!)}
                  className="inline-block text-xs font-semibold text-[var(--service-accent,#d42b2b)] underline underline-offset-4 hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]"
                >
                  {activeQuestion.answer.readMoreLabel}
                </Link>
              )}

              {/* WhatsApp CTA */}
              {activeQuestion.answer.whatsappMessage && (
                <div className="space-y-2 pt-1">
                  <a
                    href={buildWhatsAppHref({
                      text: activeQuestion.answer.whatsappMessage,
                      utm_source: "chatbot_widget",
                      utm_campaign: activeQuestion.answer.utm_campaign,
                      source: `FAQ Chatbot: ${activeQuestion.label}`,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) =>
                      handleWhatsAppClick(
                        e,
                        activeQuestion.answer.utm_campaign ?? "",
                        activeQuestion.id,
                      )
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                  >
                    <span aria-hidden>📲</span>
                    {activeQuestion.answer.whatsappCta ?? "להמשך בוואטסאפ"}
                  </a>

                  {/* Copy inquiry text */}
                  <button
                    onClick={() => handleCopy(activeQuestion)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]"
                  >
                    <CopyIcon />
                    {copied ? "הנוסח הועתק ✓" : "העתקת נוסח הפנייה"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="space-y-2 border-t border-border bg-muted/30 px-4 py-3">
          <p className="text-center text-[10px] text-muted-foreground/70">
            *כל המחירים המוצגים אינם כוללים מע״מ (18%)
          </p>
          <a
            href={buildWhatsAppHref({
              text: "שלום יקיר, עברתי על השאלות הנפוצות בצ'אט באתר ולא מצאתי מענה מדויק. אשמח לעזרתך",
              utm_source: "chatbot_widget",
              utm_campaign: "chatbot_fallback",
              source: "FAQ Chatbot - No Match",
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]"
          >
            מחפשים מענה ישיר ומותאם אישית? יקיר יענה לכם בוואטסאפ, {TIME_CLAIMS.waResponseMinutes}
          </a>
          {visitedIds.size > 0 && (
            <button
              onClick={handleClearHistory}
              className="block w-full text-center text-[10px] text-muted-foreground/50 underline underline-offset-2 transition-colors hover:text-muted-foreground focus-visible:outline-none"
            >
              איפוס היסטוריית חיפושים
            </button>
          )}
        </div>
      </div>

      {/* ── Greeting tooltip (screen-reader only, for context) ─────────── */}
      <span className="sr-only">{greeting}</span>
    </div>
  );
}
