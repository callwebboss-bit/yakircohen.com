"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { BookCategoryId } from "@/lib/book-url";

type QuizAnswer = string | null;

type Question = {
  id: string;
  text: string;
  options: { value: string; label: string; emoji: string }[];
};

const QUESTIONS: Question[] = [
  {
    id: "intent",
    text: "מה תרצה לייצר?",
    options: [
      { value: "song", label: "שיר או הקלטה", emoji: "🎤" },
      { value: "blessing", label: "ברכה / נאום", emoji: "💝" },
      { value: "content", label: "תוכן דיגיטלי / פודקאסט", emoji: "🎙️" },
      { value: "event", label: "אירוע / מסיבה", emoji: "🎉" },
    ],
  },
  {
    id: "budget",
    text: "מה התקציב המשוער?",
    options: [
      { value: "low", label: "עד ₪500", emoji: "💰" },
      { value: "mid", label: "₪500 – ₪2,000", emoji: "💳" },
      { value: "high", label: "₪2,000 – ₪5,000", emoji: "🏆" },
      { value: "open", label: "גמיש / לא יודע", emoji: "🤷" },
    ],
  },
  {
    id: "size",
    text: "כמה אנשים מעורבים?",
    options: [
      { value: "solo", label: "רק אני", emoji: "🙋" },
      { value: "couple", label: "זוג / בן משפחה", emoji: "👫" },
      { value: "group", label: "קבוצה קטנה", emoji: "👨‍👩‍👧" },
      { value: "event", label: "אירוע רחב", emoji: "🎊" },
    ],
  },
];

type Recommendation = {
  category: BookCategoryId;
  title: string;
  reason: string;
  icon: string;
};

function getRecommendation(answers: Record<string, string>): Recommendation {
  const { intent, budget, size } = answers;

  if (intent === "event" || size === "event") {
    if (budget === "low" || budget === "mid") {
      return {
        category: "events",
        title: "אטרקציות לאירועים",
        reason: "מגוון אטרקציות בתקציב נוח — עשן, בועות, כדורים ועוד.",
        icon: "🎉",
      };
    }
    return {
      category: "dj",
      title: "DJ לאירועים",
      reason: "חבילת DJ מלאה עם אפקטים ואיפיון מוזיקלי לאירוע שלך.",
      icon: "🎧",
    };
  }

  if (intent === "content") {
    return {
      category: "podcast",
      title: "פודקאסט",
      reason: "הקלטה, עריכה והפצה — הכל באולפן מקצועי.",
      icon: "🎙️",
    };
  }

  if (intent === "blessing") {
    return {
      category: "studio",
      title: "הקלטה באולפן",
      reason: "ברכות כלה, נאומי בר/בת מצווה וברכות כלליות — הקלטת ווקאל מוגמרת.",
      icon: "🎤",
    };
  }

  // intent === "song"
  if (size === "event") {
    return {
      category: "singer",
      title: "הגברה לזמרים",
      reason: "צ'ק סאונד וטכנאי בשטח — הקול שלך בכל אולם.",
      icon: "🎤",
    };
  }

  return {
    category: "studio",
    title: "הקלטה באולפן",
    reason: "הקלטת שיר קאבר, אורגינלי או כל סוג — מיקס ומאסטר כלולים.",
    icon: "🎤",
  };
}

type BookingDiagnosisQuizProps = {
  onNavigate: (category: BookCategoryId) => void;
};

export default function BookingDiagnosisQuiz({ onNavigate }: BookingDiagnosisQuizProps) {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});
  const [currentQ, setCurrentQ] = useState(0);

  const totalAnswered = Object.values(answers).filter(Boolean).length;
  const isDone = totalAnswered === QUESTIONS.length;
  const recommendation = isDone ? getRecommendation(answers as Record<string, string>) : null;

  function handleAnswer(qId: string, value: string) {
    const next = { ...answers, [qId]: value };
    setAnswers(next);
    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ((q) => q + 1), 200);
    }
  }

  function reset() {
    setAnswers({});
    setCurrentQ(0);
  }

  return (
    <div>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/5 px-5 py-2.5 text-sm font-semibold text-brand-red transition-colors hover:bg-brand-red/10"
        >
          🤔 לא יודע/ת מה מתאים לי — עזרו לי לבחור
        </button>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              מה מתאים לך? — {currentQ + 1} / {QUESTIONS.length}
            </h2>
            <button
              type="button"
              onClick={() => { setOpen(false); reset(); }}
              className="text-xs text-muted-foreground hover:text-foreground"
              aria-label="סגור"
            >
              ✕
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-1 rounded-full bg-brand-red transition-all duration-300"
              style={{ width: `${(totalAnswered / QUESTIONS.length) * 100}%` }}
            />
          </div>

          {!isDone ? (
            <div>
              <p className="mb-4 text-sm text-muted-foreground">
                {QUESTIONS[currentQ].text}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {QUESTIONS[currentQ].options.map((opt) => {
                  const chosen = answers[QUESTIONS[currentQ].id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleAnswer(QUESTIONS[currentQ].id, opt.value)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center text-sm font-medium transition-colors",
                        chosen
                          ? "border-brand-red bg-brand-red/10 text-brand-red"
                          : "border-border bg-background text-foreground hover:border-brand-red/40",
                      )}
                    >
                      <span className="text-2xl">{opt.emoji}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : recommendation ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-5">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-red">
                  המלצה עבורך
                </p>
                <p className="text-lg font-bold text-foreground">
                  {recommendation.icon} {recommendation.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{recommendation.reason}</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate(recommendation.category);
                    setOpen(false);
                    reset();
                  }}
                  className="flex-1 rounded-xl bg-brand-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light"
                >
                  קח/י אותי לשם ←
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  נסה שוב
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
