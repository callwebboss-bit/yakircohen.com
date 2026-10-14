"use client";

import { useRef, useState } from "react";
import { copyText } from "@/components/admin/sales-ui";
import { cn } from "@/lib/utils";
import type { AgentReply } from "@/lib/sales/agent-run";
import type { SelectionInput } from "@/lib/sales/selection-quote";

/**
 * "שאל את הסוכן" בעמדת המכירות (החלטת הבעלים 12.10.2026, סוכן מכירות).
 *
 * יקיר כותב או מדביק את מה שהלקוח שאל, והסוכן מחזיר הודעה מוכנה, "רק לוודא"
 * ושורה פנימית. כל מחיר מגיע מהכלים בשרת, כלומר מאותו מנוע של המחשבון. השיחה
 * חיה רק כאן, ב-state של הרכיב: רענון מוחק אותה, ושום דבר לא נשמר בשרת.
 */

type ChatEntry =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; reply: AgentReply | null; error?: boolean };

const NOT_CONFIGURED = "הסוכן לא מוגדר: חסר מפתח AI ב-Vercel";
/* השרת מקבל עד 20 הודעות. שולחים את האחרונות */
const HISTORY_SENT = 12;

const buttonClass =
  "inline-flex min-h-11 items-center justify-center rounded-md border border-border px-3 text-sm text-foreground hover:bg-muted/50 disabled:opacity-50";

function AssistantBubble({
  entry,
  onOpenCalc,
}: {
  entry: Extract<ChatEntry, { role: "assistant" }>;
  onOpenCalc: (cardId: string, preset: Partial<SelectionInput>) => void;
}) {
  const [copied, setCopied] = useState<"message" | "confirm" | "pay" | "failed" | null>(null);
  const reply = entry.reply;
  const blocks = reply?.blocks;
  const copy = async (what: "message" | "confirm" | "pay", text: string) => {
    const ok = await copyText(text);
    setCopied(ok ? what : "failed");
    window.setTimeout(() => setCopied(null), 2200);
  };

  if (!reply || !blocks) {
    return <p className={cn("whitespace-pre-line text-sm", entry.error ? "text-danger-text" : "text-foreground")}>{entry.content}</p>;
  }

  return (
    <div className="grid gap-2 text-sm">
      {blocks.intro ? <p className="whitespace-pre-line text-foreground">{blocks.intro}</p> : null}
      {reply.unverified.length ? (
        <p role="alert" className="rounded-md bg-accent p-2 text-xs font-semibold text-danger-text">
          בתשובה יש מספרים שלא הגיעו מהמחירון ({reply.unverified.join(", ")}). בודקים במחשבון לפני ששולחים.
        </p>
      ) : null}
      {blocks.message ? (
        <div className="grid gap-1.5 rounded-md border border-border bg-background p-2">
          <p className="whitespace-pre-line text-foreground">{blocks.message}</p>
          <button type="button" onClick={() => copy("message", blocks.message ?? "")} className={cn(buttonClass, "justify-self-start")}>
            {copied === "message" ? "הועתק" : "העתק הודעה"}
          </button>
        </div>
      ) : null}
      {blocks.confirm ? (
        <div className="flex flex-wrap items-center gap-2">
          <p className="flex-1 text-foreground">{blocks.confirm}</p>
          <button type="button" onClick={() => copy("confirm", blocks.confirm ?? "")} className={buttonClass}>
            {copied === "confirm" ? "הועתק" : "העתק"}
          </button>
        </div>
      ) : null}
      {reply.quote?.payMessage ? (
        <div className="grid gap-1.5 rounded-md border border-dashed border-border p-2">
          <p className="text-xs font-semibold text-muted-foreground">
            לינק לתשלום, הודעה שלישית{reply.quote.payLinkKind === "fixed" ? " (לינק קבוע לשירות)" : " (סכום פתוח)"}
          </p>
          <p className="whitespace-pre-line text-foreground [overflow-wrap:anywhere]">{reply.quote.payMessage}</p>
          <button type="button" onClick={() => copy("pay", reply.quote?.payMessage ?? "")} className={cn(buttonClass, "justify-self-start")}>
            {copied === "pay" ? "הועתק" : "העתק לינק לתשלום"}
          </button>
        </div>
      ) : null}
      {blocks.internal ? (
        <p dir="auto" className="font-mono text-xs text-muted-foreground">
          {blocks.internal}
        </p>
      ) : null}
      {copied === "failed" ? <p className="text-xs text-brand-red-text">ההעתקה נחסמה. מסמנים ומעתיקים ביד.</p> : null}
      {reply.quote ? (
        <button
          type="button"
          onClick={() => reply.quote && onOpenCalc(reply.quote.id, reply.quote.selection)}
          className={cn(buttonClass, "justify-self-start font-semibold")}
        >
          פתח במחשבון
        </button>
      ) : null}
    </div>
  );
}

export default function SalesAgentPanel({
  configured,
  onOpenCalc,
}: {
  configured: boolean;
  onOpenCalc: (cardId: string, preset: Partial<SelectionInput>) => void;
}) {
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [disabledReason, setDisabledReason] = useState<string | null>(configured ? null : NOT_CONFIGURED);
  const listRef = useRef<HTMLOListElement>(null);

  const send = async () => {
    const text = draft.trim();
    if (!text || busy || disabledReason) return;
    const next: ChatEntry[] = [...entries, { role: "user", content: text }];
    setEntries(next);
    setDraft("");
    setBusy(true);
    try {
      const messages = next
        .filter((e) => !(e.role === "assistant" && e.error))
        .slice(-HISTORY_SENT)
        .map((e) => ({ role: e.role, content: e.content }));
      const res = await fetch("/api/admin/sales-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; reply: AgentReply }
        | { ok: false; error: string; message?: string }
        | null;
      if (data?.ok) {
        setEntries((prev) => [...prev, { role: "assistant", content: data.reply.text, reply: data.reply }]);
      } else {
        if (data?.error === "not_configured") setDisabledReason(data.message ?? NOT_CONFIGURED);
        const message =
          res.status === 401
            ? "הכניסה פגה. נכנסים שוב ומנסים."
            : (data && !data.ok && data.message) || "הסוכן לא ענה הפעם. מנסים שוב, או עוברים למחשבון.";
        setEntries((prev) => [...prev, { role: "assistant", content: message, reply: null, error: true }]);
      }
    } catch {
      setEntries((prev) => [
        ...prev,
        { role: "assistant", content: "אין חיבור כרגע. מנסים שוב בעוד רגע.", reply: null, error: true },
      ]);
    } finally {
      setBusy(false);
      window.requestAnimationFrame(() => listRef.current?.lastElementChild?.scrollIntoView({ block: "nearest" }));
    }
  };

  return (
    <details className="rounded-xl border border-border bg-surface shadow-sm">
      <summary className="flex min-h-12 cursor-pointer items-center justify-between px-3 text-sm font-semibold text-foreground">
        <span>שאל את הסוכן</span>
        <span className="text-xs font-normal text-muted-foreground">מחירים רק מהמחירון</span>
      </summary>
      <div className="grid gap-3 p-3 pt-0">
        {disabledReason ? (
          <p role="status" className="rounded-md bg-muted p-2 text-sm text-foreground">
            {disabledReason}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            מדביקים את השאלה של הלקוח. טלפונים ומיילים נמחקים לפני שליחה, והשיחה נמחקת ברענון.
          </p>
        )}
        {entries.length ? (
          <ol ref={listRef} className="grid max-h-[60vh] gap-2 overflow-y-auto overscroll-contain" aria-live="polite">
            {entries.map((entry, i) => (
              <li
                key={i}
                className={cn(
                  "rounded-lg p-2",
                  entry.role === "user" ? "ms-6 bg-muted text-sm whitespace-pre-line text-foreground" : "me-2 border border-border bg-surface",
                )}
              >
                {entry.role === "user" ? entry.content : <AssistantBubble entry={entry} onOpenCalc={onOpenCalc} />}
              </li>
            ))}
          </ol>
        ) : null}
        <label htmlFor="sales-agent-input" className="sr-only">
          שאלה לסוכן
        </label>
        <textarea
          id="sales-agent-input"
          rows={3}
          value={draft}
          maxLength={2000}
          disabled={Boolean(disabledReason)}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              void send();
            }
          }}
          placeholder="למשל: כמה עולה שיר לשלושה עם קליפ ותיקון זיופים"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground disabled:opacity-50"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void send()}
            disabled={busy || !draft.trim() || Boolean(disabledReason)}
            className={cn(buttonClass, "font-semibold")}
          >
            {busy ? "חושב..." : "שלח"}
          </button>
          {entries.length ? (
            <button type="button" onClick={() => setEntries([])} disabled={busy} className={buttonClass}>
              שיחה חדשה
            </button>
          ) : null}
        </div>
      </div>
    </details>
  );
}
