"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buildWhatsAppHref } from "@/lib/whatsapp";

type DemoState = "idle" | "processing" | "done" | "error";

const STEPS = [
  "מנתח תדרים...",
  "מסנן רעשים ורובוטיות...",
  "מאזן דינמיקה...",
  "מוכן!",
];

function writeStr(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}

function toWav(buf: AudioBuffer): Blob {
  const ch = Math.min(buf.numberOfChannels, 2);
  const sr = buf.sampleRate;
  const len = buf.length;
  const data = len * ch * 2;
  const ab = new ArrayBuffer(44 + data);
  const v = new DataView(ab);
  writeStr(v, 0, "RIFF"); v.setUint32(4, 36 + data, true); writeStr(v, 8, "WAVE");
  writeStr(v, 12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true);
  v.setUint16(22, ch, true); v.setUint32(24, sr, true); v.setUint32(28, sr * ch * 2, true);
  v.setUint16(32, ch * 2, true); v.setUint16(34, 16, true);
  writeStr(v, 36, "data"); v.setUint32(40, data, true);
  let off = 44;
  for (let i = 0; i < len; i++) {
    for (let c = 0; c < ch; c++) {
      const s = Math.max(-1, Math.min(1, buf.getChannelData(c)[i]));
      v.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      off += 2;
    }
  }
  return new Blob([ab], { type: "audio/wav" });
}

async function enhance(input: AudioBuffer): Promise<AudioBuffer> {
  const ctx = new OfflineAudioContext(input.numberOfChannels, input.length, input.sampleRate);
  const src = ctx.createBufferSource();
  src.buffer = input;
  const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 80; hp.Q.value = 0.7;
  const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 15000; lp.Q.value = 0.7;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -24; comp.knee.value = 8; comp.ratio.value = 3;
  comp.attack.value = 0.003; comp.release.value = 0.25;
  src.connect(hp); hp.connect(lp); lp.connect(comp); comp.connect(ctx.destination);
  src.start(0);
  return ctx.startRendering();
}

function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export default function SoundCleaningDemo() {
  const [state, setState] = useState<DemoState>("idle");
  const [errMsg, setErrMsg] = useState("");
  const [step, setStep] = useState(0);
  const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
  const [afterUrl, setAfterUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const waHref = buildWhatsAppHref({
    text: "היי יקיר! ניסיתי את הדמו לניקוי סאונד - רוצה תוצאה מקצועית. אשמח לשמוע.",
    utm_source: "online",
    utm_campaign: "sound_demo_cta",
  });

  useEffect(() => {
    return () => {
      if (beforeUrl) URL.revokeObjectURL(beforeUrl);
      if (afterUrl) URL.revokeObjectURL(afterUrl);
    };
  }, [beforeUrl, afterUrl]);

  const run = useCallback(async (file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      setErrMsg("הקובץ גדול מדי - מקסימום 8MB");
      setState("error");
      return;
    }

    setState("processing");
    setStep(0);

    try {
      const raw = await file.arrayBuffer();

      await wait(380);
      setStep(1);

      const decCtx = new AudioContext();
      const decoded = await decCtx.decodeAudioData(raw.slice(0));
      await decCtx.close();

      if (decoded.duration < 5) throw new Error("הקובץ קצר מדי - נסה קטע של לפחות 5 שניות");
      if (decoded.duration > 15) throw new Error("הקובץ ארוך מדי - גרור קטע של עד 15 שניות");

      await wait(380);
      setStep(2);

      const processed = await enhance(decoded);

      await wait(300);
      setStep(3);
      await wait(440);

      setBeforeUrl(URL.createObjectURL(new Blob([raw], { type: file.type || "audio/mpeg" })));
      setAfterUrl(URL.createObjectURL(toWav(processed)));
      setState("done");
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : "שגיאה בעיבוד הקובץ");
      setState("error");
    }
  }, []);

  const pick = useCallback(
    (file: File) => {
      if (!file.type.startsWith("audio/") && !/\.(mp3|wav|m4a|ogg|aac|flac|opus)$/i.test(file.name)) {
        setErrMsg("אנא העלה קובץ אודיו (MP3, WAV, M4A...)");
        setState("error");
        return;
      }
      run(file);
    },
    [run],
  );

  const reset = () => {
    if (beforeUrl) URL.revokeObjectURL(beforeUrl);
    if (afterUrl) URL.revokeObjectURL(afterUrl);
    setBeforeUrl(null);
    setAfterUrl(null);
    setState("idle");
    setErrMsg("");
    setStep(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="rounded-2xl border border-[#06b6d4]/30 bg-surface p-6 sm:p-8">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#04768a]">
          ניקוי סאונד חינמי בדפדפן
        </p>
        <h2 className="mt-2 font-serif text-2xl font-semibold text-foreground sm:text-3xl">
          נקה סאונד ב-AI עכשיו - תוך שניות!
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          גרור קובץ קצר (5-15 שניות) ותראה איך אנחנו מנקים רעש, הדהוד וזיופים
          תוך שניות ספורות. זו תוצאה חינמית ואוטומטית.{" "}
          <span className="font-medium text-foreground">
            מחפשים תוצאה נקייה, מהירה ומקצועית באמת? כזו שדורשת מנועי AI
            מתקדמים + ידע וניסיון - כתבו לנו.
          </span>
        </p>
      </div>

      {state === "idle" && (
        <div
          role="button"
          tabIndex={0}
          aria-label="גרור קובץ אודיו לכאן או לחץ לבחירה"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files[0];
            if (f) pick(f);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
            dragging
              ? "border-[#06b6d4] bg-[#06b6d4]/5"
              : "border-[#06b6d4]/40 hover:border-[#06b6d4] hover:bg-[#06b6d4]/5"
          }`}
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#06b6d4]/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-[#06b6d4]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">גרור קובץ אודיו לכאן</p>
          <p className="mt-1 text-xs text-muted-foreground">או לחץ לבחירה מהמחשב</p>
          <p className="mt-3 text-xs text-muted-foreground">MP3, WAV, M4A - 5 עד 15 שניות, עד 8MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) pick(f);
            }}
            aria-hidden
          />
        </div>
      )}

      {state === "processing" && (
        <div className="rounded-xl border border-border bg-background p-8 text-center">
          <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-[#06b6d4]/20 border-t-[#06b6d4]" />
          <div className="space-y-3 text-right">
            {STEPS.map((label, i) => (
              <div
                key={label}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all ${
                  i < step
                    ? "text-[#04768a]"
                    : i === step
                      ? "font-medium text-foreground"
                      : "text-muted-foreground/40"
                }`}
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    i < step ? "bg-[#06b6d4]" : i === step ? "animate-pulse bg-[#06b6d4]" : "bg-border"
                  }`}
                />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/30 dark:bg-red-900/10">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">{errMsg}</p>
          <button
            onClick={reset}
            className="mt-4 rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-surface"
          >
            נסה שוב
          </button>
        </div>
      )}

      {state === "done" && beforeUrl && afterUrl && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                המקור
              </p>
              <audio
                controls
                src={beforeUrl}
                className="w-full"
                aria-label="קובץ מקור לפני ניקוי"
                preload="auto"
              />
            </div>
            <div className="rounded-xl border border-[#06b6d4]/40 bg-[#06b6d4]/5 p-4">
              <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-[#04768a]">
                אחרי ניקוי AI
              </p>
              <audio
                controls
                src={afterUrl}
                className="w-full"
                aria-label="קובץ אחרי ניקוי AI"
                preload="auto"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-5 text-sm leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground">חשוב להבין את ההבדל</p>
            <p className="mt-1">
              הדמו הזה משתמש בכלים בסיסיים שזמינים לכולם. בשירות המקצועי שלנו
              אנחנו משלבים מנועי AI חזקים בהרבה (שמסוגלים לנתח אלגוריתמים
              מורכבים) + עריכה אנושית מדויקת. תוצאה נקייה יותר - במהירות
              מקצועית.
            </p>
          </div>

          <div className="rounded-xl border border-brand-red/20 bg-brand-red/5 p-6 text-center">
            <p className="font-semibold text-foreground">
              רוצים תיקון מלא + תוצאה ברמה גבוהה תוך זמן קצר?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              שלחו לנו את הקובץ וקבלו הצעת מחיר מיוחדת (למי שמנסה את הדמו).
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-red-light"
            >
              שלחו קובץ וקבלו הצעת מחיר מיוחדת
            </a>
            <div className="mt-3">
              <button
                onClick={reset}
                className="text-xs text-muted-foreground hover:text-foreground hover:underline"
              >
                נסה קובץ אחר
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
