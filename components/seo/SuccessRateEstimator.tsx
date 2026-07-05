"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { buildWhatsAppHref } from "@/lib/whatsapp";

type Device = {
  id: string;
  icon: string;
  label: string;
  sub: string;
};

type NoiseLevel = {
  id: string;
  color: string;
  label: string;
  sub: string;
};

type Result = {
  rate: string;
  headline: string;
  body: string;
  waMessage: string;
};

const DEVICES: Device[] = [
  {
    id: "phone",
    icon: "📱",
    label: "טלפון נייד",
    sub: "וויס נוט, מצלמה, Recorder",
  },
  {
    id: "zoom",
    icon: "💻",
    label: "זום / Teams",
    sub: "שיחת וידאו, ישיבה מקוונת",
  },
  {
    id: "pro-mic",
    icon: "🎙️",
    label: "מיקרופון מקצועי",
    sub: "USB, XLR, Rode, Blue",
  },
  {
    id: "hidden",
    icon: "🕵️",
    label: "מקליט סמוי",
    sub: "ציוד קטן בכיס, מסתיר",
  },
];

const NOISE_LEVELS: NoiseLevel[] = [
  {
    id: "quiet",
    color: "text-green-600",
    label: "שקט יחסית",
    sub: "אפשר לשמוע את הקול בברור",
  },
  {
    id: "moderate",
    color: "text-yellow-600",
    label: "קצת רעש",
    sub: "יש המהום, אבל הקול בולט",
  },
  {
    id: "loud",
    color: "text-red-500",
    label: "הרבה רעש",
    sub: "קשה להבין, רעש חזק ברקע",
  },
];

function getResult(deviceId: string, noiseId: string): Result {
  if (deviceId === "pro-mic" && noiseId === "quiet") {
    return {
      rate: "מעל 95%",
      headline: "סיכויי שחזור מצוינים",
      body: "מיקרופון איכותי + סביבה שקטה - אנחנו נוציא ממנו את המקסימום. תוצאה אולפנית מלאה.",
      waMessage:
        "היי יקיר! מילאתי את האבחון - הקלטה ממיקרופון מקצועי בסביבה שקטה. אשמח לשלוח קובץ.",
    };
  }
  if (noiseId === "quiet") {
    return {
      rate: "85-95%",
      headline: "סיכויי שחזור גבוהים מאוד",
      body: "הקלטה שקטה מאפשרת ניקוי מדויק והעשרה מקסימלית. רוב הקבצים מסוג זה יוצאים מצוינים.",
      waMessage:
        "היי יקיר! מילאתי את האבחון - הקלטה בסביבה שקטה. אשמח לשלוח קובץ לבדיקה.",
    };
  }
  if (deviceId === "pro-mic" && noiseId === "moderate") {
    return {
      rate: "80-90%",
      headline: "סיכויי שחזור גבוהים",
      body: "מיקרופון טוב מפצה על רוב הרעש. ניקוי ממוקד יפתור את מרבית הבעיות.",
      waMessage:
        "היי יקיר! מילאתי את האבחון - מיקרופון מקצועי עם קצת רעש. אשמח לשלוח קובץ.",
    };
  }
  if ((deviceId === "phone" || deviceId === "zoom") && noiseId === "moderate") {
    return {
      rate: "75-85%",
      headline: "סיכויי שחזור טובים",
      body: "רוב ההקלטות מסוג זה משתפרות משמעותית. שלחו קטע קצר לבדיקת סקיצה חינם לפני ההזמנה.",
      waMessage:
        "היי יקיר! מילאתי את האבחון - הקלטה מ" +
        (deviceId === "phone" ? "טלפון" : "זום") +
        " עם קצת רעש. אשמח לקבל סקיצה חינם.",
    };
  }
  if (deviceId === "hidden" && noiseId !== "quiet") {
    return {
      rate: "50-70%",
      headline: "אפשרי - תלוי במקור",
      body: "מקליט סמוי עם רעש הוא האתגר הגדול ביותר. עם זאת - מצבים רבים ניתנים לשחזור חלקי. שלחו לבדיקה.",
      waMessage:
        "היי יקיר! מילאתי את האבחון - מקליט סמוי עם רעש. אשמח לבדיקת הקובץ לפני הזמנה.",
    };
  }
  if (noiseId === "loud") {
    return {
      rate: "55-75%",
      headline: "מורכב - אבל שווה לנסות",
      body: "רעש חזק מגביל את התוצאה, אבל ב-2026 הכלים שלנו מפיקים גם ממקורות קשים. שלחו קטע קצר לבדיקה.",
      waMessage:
        "היי יקיר! מילאתי את האבחון - הקלטה עם הרבה רעש. אשמח לסקיצה חינם לבדיקת הפוטנציאל.",
    };
  }
  return {
    rate: "80-90%",
    headline: "סיכויי שחזור גבוהים",
    body: "לפי הנתונים שהזנת - יש סיכוי טוב לתוצאה מקצועית. שלחו קובץ ונראה יחד.",
    waMessage: "היי יקיר! מילאתי את האבחון באתר. אשמח לשלוח קובץ לבדיקה.",
  };
}

export default function SuccessRateEstimator() {
  const [device, setDevice] = useState<string | null>(null);
  const [noise, setNoise] = useState<string | null>(null);

  const result =
    device && noise ? getResult(device, noise) : null;

  const waHref = result
    ? buildWhatsAppHref({
        text: result.waMessage,
        utm_source: "online",
        utm_campaign: "vocal_fix_estimator",
      })
    : null;

  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-red">
        אבחון חינם
      </p>
      <h3 className="mt-1 text-lg font-semibold text-foreground">
        מה הסיכוי שנציל את ההקלטה שלך?
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        ענו על שתי שאלות - קבלו הערכה מקצועית תוך שניות.
      </p>

      <div className="mt-6 space-y-6">
        {/* Step 1 */}
        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">
            1. מאיזה מכשיר בוצעה ההקלטה?
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DEVICES.map((d) => (
              <button
                key={d.id}
                onClick={() => setDevice(device === d.id ? null : d.id)}
                aria-pressed={device === d.id}
                className={cn(
                  "rounded-xl border p-3 text-start text-xs transition-all",
                  device === d.id
                    ? "border-brand-red bg-brand-red/5"
                    : "border-border bg-background hover:border-brand-red/40",
                )}
              >
                <span className="text-xl" aria-hidden>
                  {d.icon}
                </span>
                <p className="mt-1.5 font-semibold text-foreground leading-tight">
                  {d.label}
                </p>
                <p className="mt-0.5 text-muted-foreground leading-snug">
                  {d.sub}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 */}
        {device && (
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">
              2. מה רמת רעשי הרקע בהקלטה?
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {NOISE_LEVELS.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setNoise(noise === n.id ? null : n.id)}
                  aria-pressed={noise === n.id}
                  className={cn(
                    "rounded-xl border p-3 text-start text-xs transition-all",
                    noise === n.id
                      ? "border-brand-red bg-brand-red/5"
                      : "border-border bg-background hover:border-brand-red/40",
                  )}
                >
                  <p
                    className={cn(
                      "font-semibold text-sm",
                      noise === n.id ? "text-brand-red" : n.color,
                    )}
                  >
                    {n.label}
                  </p>
                  <p className="mt-0.5 text-muted-foreground leading-snug">
                    {n.sub}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {result && waHref && (
          <div className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-5">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-brand-red tabular-nums">
                {result.rate}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {result.headline}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {result.body}
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex rounded-xl bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              שלחו קובץ לבדיקה
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
