"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VoucherCanvas, { type VoucherCanvasHandle, type VoucherLogoStatus } from "@/components/admin/VoucherCanvas";
import type { SalesCard } from "@/lib/sales/sales-book";
import {
  buildVoucherData,
  generateVoucherCode,
  GIFT_VALIDITY_YEARS,
  normalizeVoucherCode,
  voucherAddons,
  type VoucherKind,
  type VoucherStatus,
} from "@/lib/sales/voucher";
import { VOUCHER_HEIGHT, VOUCHER_WIDTH, voucherBackground } from "@/lib/sales/voucher-canvas";

/**
 * אישור הזמנה ושובר מתנה מתוך כרטיס בעמדת המכירות (תוכנית עמדת המכירות, סעיף 4).
 *
 * ממלאים כמה שדות, התצוגה מתעדכנת תוך כדי הקלדה, ושולחים: "שתף" פותח את
 * חלון השיתוף של הטלפון עם התמונה, "שמור תמונה" מוריד אותה, ו-PDF מדפיס את
 * אותה תמונה בדף A5. אין כאן מחיר בשום שדה (החלטת הבעלים 6.10.2026), ואין
 * טלפון של הלקוח.
 *
 * הרכיב נטען רק בלחיצה (next/dynamic ב-SalesDesk), כי הוא מושך את כל ספר
 * המכירות ואת קוד הציור, ורוב הכניסות לעמוד הן רק להעתיק מחיר.
 */

export type VoucherFormState = {
  firstName: string;
  /** yyyy-mm-dd מתוך שדה התאריך. ריק: "המועד נקבע בתיאום" */
  dateIso: string;
  time: string;
  status: VoucherStatus;
  agreed: string;
  addonIds: string[];
  participants: number | null;
  giftTo: string;
  giftFrom: string;
  giftTitle: string;
};

/** מה שנשמר בדפדפן לשליחה חוזרת: הקלט, הקוד ותאריך ההנפקה. בלי טלפונים */
export type VoucherHistoryEntry = {
  kind: VoucherKind;
  cardId: string;
  cardTitle: string;
  code: string;
  issuedAt: string;
  form: VoucherFormState;
};

export type VoucherDialogRequest = {
  /** מספר חדש בכל פתיחה, כדי שהטופס יתחיל מחדש */
  key: number;
  kind: VoucherKind;
  card: SalesCard;
  form?: Partial<VoucherFormState>;
  /** קוד קיים: מהודעה שהודבקה או מהנפקה קודמת. לא תקין: נוצר קוד חדש */
  code?: string | null;
  codeSource?: "paste" | "history" | null;
  /** בשליחה חוזרת התאריך המקורי נשמר, כדי שתוקף שובר המתנה לא יתארך */
  issuedAt?: string;
};

type VoucherDialogProps = {
  request: VoucherDialogRequest | null;
  onClose: () => void;
  onIssued: (entry: VoucherHistoryEntry) => void;
};

/* מילות הפתיחה של שדרוג ("תיקון זיופים") שמופיעות ב"סיכמנו" האוטומטי: אם
   השדרוג נבחר, השורה ("תיקון זיופים לא כלול") כבר לא נכונה ולא נכנסת */
function clashesWithAddons(text: string, labels: readonly string[]): boolean {
  return labels.some((label) => {
    const lead = label.split(/\s+/).slice(0, 2).join(" ");
    return lead.length >= 4 && text.includes(lead);
  });
}

const WEEKDAY_LETTERS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳"] as const;

/** "2026-10-15" ל-"יום ה׳ 15.10.2026" */
function dateTextFromIso(iso: string): string | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return undefined;
  const [year, month, day] = match.slice(1).map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const dayName = weekday === 6 ? "שבת" : `יום ${WEEKDAY_LETTERS[weekday]}`;
  return `${dayName} ${day}.${month}.${year}`;
}

/* בטופס, null ב"סיכמנו" אומר "עדיין אוטומטי" (מ"רק לוודא" של הכרטיס). ברגע שמקלידים, הטקסט של יקיר */
type FormDraft = Omit<VoucherFormState, "agreed"> & { agreed: string | null };

function initialForm(request: VoucherDialogRequest): FormDraft {
  const { card } = request;
  const preset = request.form ?? {};
  const rows = card.participants;
  const min = rows?.[0]?.count ?? null;
  const max = rows?.[rows.length - 1]?.count ?? null;
  const wanted = preset.participants ?? min;
  const addonIds = new Set(voucherAddons(card).map((a) => a.id));
  return {
    firstName: preset.firstName ?? "",
    dateIso: preset.dateIso ?? "",
    time: preset.time ?? "",
    status: preset.status ?? "awaiting_deposit",
    agreed: preset.agreed ?? null,
    addonIds: (preset.addonIds ?? []).filter((id) => addonIds.has(id)),
    participants:
      wanted == null || min == null || max == null ? null : Math.min(max, Math.max(min, Math.trunc(wanted))),
    giftTo: preset.giftTo ?? "",
    giftFrom: preset.giftFrom ?? "",
    giftTitle: preset.giftTitle ?? card.title,
  };
}

/* ─── שיתוף, שמירה והדפסה ─── */

function downloadFile(file: File): void {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

const PRINT_SCOPE = "sales-voucher";
const PRINT_ROOT_ID = "sales-voucher-print";

/*
 * הדפסה בתוך העמוד ולא בחלון חדש: חלון קופץ נחסם בטלפון, ובאייפון הדפסה של
 * iframe מדפיסה את כל העמוד. app/globals.css מסתיר בהדפסה כל ילד של body חוץ
 * מ-main, ולכן הכללים כאן חלים רק כש-html מסומן ב-data-print-scope, באותו
 * דפוס כמו כרטיס פרטי הספק, וגוברים בספציפיות. A5 בלי שוליים, והתמונה
 * ממורכזת על רקע בצבע השובר.
 */
function printCss(background: string): string {
  const scope = `html[data-print-scope="${PRINT_SCOPE}"]`;
  return `
@media print {
  @page { size: A5; margin: 0; }
  ${scope}, ${scope} body { margin: 0 !important; padding: 0 !important; min-height: 0 !important; background: ${background} !important; }
  ${scope} body > * { display: none !important; }
  ${scope} body > #${PRINT_ROOT_ID} { display: flex !important; width: 148mm; height: 209mm; align-items: center; justify-content: center; background: ${background}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  ${scope} #${PRINT_ROOT_ID} img { width: 148mm; height: ${(148 * VOUCHER_HEIGHT) / VOUCHER_WIDTH}mm; display: block; }
}`;
}

function clearPrintScope(): void {
  if (document.documentElement.dataset.printScope === PRINT_SCOPE) {
    delete document.documentElement.dataset.printScope;
  }
}

/* ─── מדידה ─── */

type GtagFn = (...args: unknown[]) => void;

/* בלי פרטים אישיים: סוג המסמך ומזהה הכרטיס בלבד */
function trackVoucher(kind: VoucherKind, cardId: string): void {
  const w = window as Window & { gtag?: GtagFn };
  w.gtag?.("event", "sales_desk_voucher", { kind, card_id: cardId });
}

/* ─── הטופס ─── */

const fieldClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground focus-visible:outline-2 focus-visible:outline-brand-red";
const labelClass = "block text-xs font-semibold text-foreground";
const actionClass =
  "inline-flex min-h-12 flex-1 items-center justify-center rounded-md px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50";

function VoucherForm({ request, onIssued }: { request: VoucherDialogRequest; onIssued: VoucherDialogProps["onIssued"] }) {
  const { card, kind } = request;
  const formId = useId();
  const canvasRef = useRef<VoucherCanvasHandle>(null);
  const printImageRef = useRef<HTMLImageElement>(null);
  const trackedRef = useRef(false);
  const [form, setForm] = useState<FormDraft>(() => initialForm(request));
  const [issuedAt] = useState(() => {
    const parsed = request.issuedAt ? new Date(request.issuedAt) : null;
    return parsed && !Number.isNaN(parsed.getTime()) ? parsed : new Date();
  });
  const [initialCode] = useState(() => normalizeVoucherCode(request.code) ?? generateVoucherCode());
  const [codeInput, setCodeInput] = useState(initialCode);
  const [lastValidCode, setLastValidCode] = useState(initialCode);
  const [notice, setNotice] = useState<string | null>(null);
  /* שובר בלי לוגו לא יוצא: שיתוף, שמירה ו-PDF פתוחים רק כשהלוגו צויר
     (בדיקת הלוגו 7.10.2026). קודם כשל בטעינה נבלע, והתמונה נשלחה בלי לוגו */
  const [logoStatus, setLogoStatus] = useState<VoucherLogoStatus>("loading");
  const canExport = logoStatus === "ok";

  const typedCode = normalizeVoucherCode(codeInput);
  const code = typedCode ?? lastValidCode;
  const codeFromRequest = normalizeVoucherCode(request.code) === code;

  const update = <K extends keyof FormDraft>(key: K, value: FormDraft[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ברירת המחדל היא agreedLine של הכרטיס: אותה נקודה כמו "רק לוודא", כעובדה
     ובלי מחיר. מהשאלה עצמה יצא "אפקטים לא כלולים במחיר הזה" במסמך בלי מחיר */
  const autoAgreed = useMemo(() => {
    const text = card.agreedLine ?? "";
    /* בברכה "רק לוודא" הוא על מספר הדוברים ("דובר אחד"), ולכן כשסימנו יותר
       דוברים השורה כבר לא נכונה */
    const firstCount = card.participants?.[0]?.count;
    const morePeople = firstCount != null && form.participants != null && form.participants > firstCount;
    if (morePeople && card.family === "blessing") return "";
    const chosen = card.addons.filter((a) => form.addonIds.includes(a.id)).map((a) => a.label);
    return clashesWithAddons(text, chosen) ? "" : text;
  }, [card, form.addonIds, form.participants]);
  const addons = useMemo(() => voucherAddons(card), [card]);
  const agreed = form.agreed ?? autoAgreed;

  const toggleAddon = (id: string, checked: boolean) =>
    setForm((prev) => ({
      ...prev,
      addonIds: checked ? [...prev.addonIds, id] : prev.addonIds.filter((x) => x !== id),
    }));

  const data = useMemo(
    () =>
      buildVoucherData({
        kind,
        cardId: card.id,
        addonIds: form.addonIds,
        participants: form.participants ?? undefined,
        firstName: form.firstName,
        dateText: dateTextFromIso(form.dateIso),
        timeText: form.dateIso ? form.time : undefined,
        status: form.status,
        agreed,
        giftTo: form.giftTo,
        giftFrom: form.giftFrom,
        giftTitle: form.giftTitle,
        code,
        issuedAt,
      }),
    [kind, card.id, form, agreed, code, issuedAt],
  );

  const fileName = `yakircohen-${kind === "gift" ? "gift" : "order"}-${data.code}.png`;
  const shareTitle = `${data.title} ${data.code}`;
  const rows = card.participants;

  /* שמירה לשליחה חוזרת ומדידה, בכל פעולה שמוציאה את המסמך */
  const recordIssue = () => {
    onIssued({
      kind,
      cardId: card.id,
      cardTitle: card.title,
      code: data.code,
      issuedAt: issuedAt.toISOString(),
      form: { ...form, agreed },
    });
    if (!trackedRef.current) {
      trackedRef.current = true;
      trackVoucher(kind, card.id);
    }
  };

  const retryLogo = () => {
    setLogoStatus("loading");
    canvasRef.current?.retry();
  };

  const getFile = (): File | null => {
    const file = canvasRef.current?.getFile() ?? null;
    if (!file) setNotice("התמונה עוד נטענת. נסו שוב בעוד רגע.");
    return file;
  };

  const handleShare = () => {
    const file = getFile();
    if (!file) return;
    recordIssue();
    const shareData: ShareData = { files: [file], title: shareTitle };
    /* בתוך הלחיצה עצמה, בלי await לפני: אחרת Safari חוסם את חלון השיתוף */
    if (typeof navigator.canShare === "function" && navigator.canShare(shareData)) {
      navigator.share(shareData).catch((error: unknown) => {
        if ((error as { name?: string })?.name !== "AbortError") downloadFile(file);
      });
      return;
    }
    downloadFile(file);
    setNotice("אין כאן חלון שיתוף, אז התמונה ירדה למכשיר.");
  };

  const handleSave = () => {
    const file = getFile();
    if (!file) return;
    recordIssue();
    downloadFile(file);
  };

  const handlePrint = async () => {
    const file = getFile();
    const image = printImageRef.current;
    if (!file || !image) return;
    recordIssue();
    const url = URL.createObjectURL(file);
    const previous = image.dataset.url;
    image.src = url;
    image.dataset.url = url;
    if (previous) URL.revokeObjectURL(previous);
    try {
      await image.decode();
    } catch {
      /* התמונה תיטען בכל זאת לפני ההדפסה */
    }
    const root = document.documentElement;
    root.dataset.printScope = PRINT_SCOPE;
    const done = () => {
      clearPrintScope();
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
  };

  /* אם הדיאלוג נסגר באמצע הדפסה, העמוד לא נשאר במצב הדפסה של השובר */
  useEffect(() => {
    const image = printImageRef.current;
    return () => {
      clearPrintScope();
      const url = image?.dataset.url;
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  const onCodeChange = (value: string) => {
    setCodeInput(value);
    const valid = normalizeVoucherCode(value);
    if (valid) setLastValidCode(valid);
  };

  const newCode = () => {
    const next = generateVoucherCode();
    setCodeInput(next);
    setLastValidCode(next);
  };

  return (
    <>
      <form id={formId} className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
        {kind === "order" ? (
          <>
            <div className="grid gap-1">
              <label htmlFor={`${formId}-name`} className={labelClass}>
                שם פרטי
              </label>
              <input
                id={`${formId}-name`}
                className={fieldClass}
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                autoComplete="off"
                enterKeyHint="next"
                maxLength={30}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <label htmlFor={`${formId}-date`} className={labelClass}>
                  תאריך (ריק: בתיאום)
                </label>
                <input
                  id={`${formId}-date`}
                  type="date"
                  className={fieldClass}
                  value={form.dateIso}
                  onChange={(e) => update("dateIso", e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor={`${formId}-time`} className={labelClass}>
                  שעה
                </label>
                <input
                  id={`${formId}-time`}
                  type="time"
                  className={fieldClass}
                  value={form.time}
                  disabled={!form.dateIso}
                  onChange={(e) => update("time", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-1">
              <label htmlFor={`${formId}-status`} className={labelClass}>
                סטטוס
              </label>
              <select
                id={`${formId}-status`}
                className={fieldClass}
                value={form.status}
                onChange={(e) => update("status", e.target.value as VoucherStatus)}
              >
                <option value="awaiting_deposit">ממתין למקדמה</option>
                <option value="date_held">המועד שוריין</option>
              </select>
            </div>
            <div className="grid gap-1">
              <label htmlFor={`${formId}-agreed`} className={labelClass}>
                סיכמנו (מה שהלקוח אישר בכתב)
              </label>
              <textarea
                id={`${formId}-agreed`}
                className={`${fieldClass} min-h-20`}
                value={agreed}
                onChange={(e) => update("agreed", e.target.value)}
                maxLength={160}
              />
            </div>
            {rows?.length ? (
              <div className="grid gap-1">
                <label htmlFor={`${formId}-people`} className={labelClass}>
                  כמה משתתפים ({rows[0].count} עד {rows[rows.length - 1].count})
                </label>
                <input
                  id={`${formId}-people`}
                  type="number"
                  inputMode="numeric"
                  min={rows[0].count}
                  max={rows[rows.length - 1].count}
                  className={fieldClass}
                  value={form.participants ?? ""}
                  onChange={(e) => update("participants", e.target.value === "" ? null : Number(e.target.value))}
                />
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div className="grid gap-1">
              <label htmlFor={`${formId}-to`} className={labelClass}>
                לכבוד
              </label>
              <input
                id={`${formId}-to`}
                className={fieldClass}
                value={form.giftTo}
                onChange={(e) => update("giftTo", e.target.value)}
                autoComplete="off"
                maxLength={60}
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor={`${formId}-from`} className={labelClass}>
                מאת
              </label>
              <input
                id={`${formId}-from`}
                className={fieldClass}
                value={form.giftFrom}
                onChange={(e) => update("giftFrom", e.target.value)}
                autoComplete="off"
                maxLength={60}
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor={`${formId}-gift`} className={labelClass}>
                המתנה
              </label>
              <input
                id={`${formId}-gift`}
                className={fieldClass}
                value={form.giftTitle}
                onChange={(e) => update("giftTitle", e.target.value)}
                autoComplete="off"
                maxLength={80}
              />
            </div>
          </>
        )}

        {addons.length ? (
          <fieldset className="grid gap-1.5 rounded-md border border-border p-3">
            <legend className="px-1 text-xs font-semibold text-foreground">שדרוגים שהוזמנו</legend>
            {addons.map((addon) => {
              const blocked = Boolean(addon.requires && !form.addonIds.includes(addon.requires));
              return (
                <label key={addon.id} className="flex min-h-11 items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    className="size-5 shrink-0"
                    checked={form.addonIds.includes(addon.id)}
                    onChange={(e) => toggleAddon(addon.id, e.target.checked)}
                  />
                  <span>
                    {addon.label}
                    {blocked ? <span className="text-xs text-muted-foreground"> (נכנס רק עם השדרוג שהוא דורש)</span> : null}
                  </span>
                </label>
              );
            })}
          </fieldset>
        ) : null}

        <div className="grid gap-1">
          <label htmlFor={`${formId}-code`} className={labelClass}>
            קוד {codeFromRequest && request.codeSource === "paste" ? "(מההודעה שהודבקה)" : null}
            {codeFromRequest && request.codeSource === "history" ? "(מההנפקה הקודמת)" : null}
          </label>
          <div className="flex gap-2">
            <input
              id={`${formId}-code`}
              dir="ltr"
              className={`${fieldClass} font-mono uppercase`}
              value={codeInput}
              onChange={(e) => onCodeChange(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              aria-invalid={!typedCode}
              aria-describedby={typedCode ? undefined : `${formId}-code-error`}
            />
            <button
              type="button"
              onClick={newCode}
              className="shrink-0 rounded-md border border-border px-3 text-sm font-medium text-foreground hover:bg-muted/50"
            >
              קוד חדש
            </button>
          </div>
          {typedCode ? null : (
            <p id={`${formId}-code-error`} className="text-xs text-brand-red-text" role="alert">
              קוד לא תקין. נשאר {lastValidCode}.
            </p>
          )}
        </div>
      </form>

      <div className="grid gap-2">
        <p className="text-xs font-semibold text-foreground">תצוגה (זו התמונה שנשלחת)</p>
        <VoucherCanvas
          ref={canvasRef}
          data={data}
          fileName={fileName}
          statusTone={form.status === "date_held" ? "confirmed" : "pending"}
          label={`${data.title} ${data.code}: ${data.serviceTitle}`}
          onLogoStatus={setLogoStatus}
        />
      </div>

      <div className="sticky bottom-0 -mx-4 grid gap-2 border-t border-border bg-popover px-4 pt-3 pb-1">
        {logoStatus === "failed" ? (
          <div className="flex flex-wrap items-center justify-between gap-2" role="alert">
            <p className="text-sm font-semibold text-brand-red-text">הלוגו לא נטען. נסו שוב בעוד רגע.</p>
            <button
              type="button"
              onClick={retryLogo}
              className="min-h-11 shrink-0 rounded-md border border-border px-3 text-sm font-medium text-foreground hover:bg-muted/50"
            >
              טעינה מחדש
            </button>
          </div>
        ) : null}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleShare}
            disabled={!canExport}
            className={`${actionClass} bg-brand-red text-white hover:bg-brand-red-light`}
          >
            שתף
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canExport}
            className={`${actionClass} border border-border bg-background text-foreground hover:bg-muted/50`}
          >
            שמור תמונה
          </button>
          <button
            type="button"
            onClick={() => void handlePrint()}
            disabled={!canExport}
            aria-label="PDF: הדפסה או שמירה כ-PDF בדף A5"
            className={`${actionClass} border border-border bg-background text-foreground hover:bg-muted/50`}
          >
            PDF
          </button>
        </div>
        <p className="min-h-4 text-xs text-muted-foreground" role="status" aria-live="polite">
          {notice}
        </p>
      </div>

      {createPortal(
        /* מוסתר ב-style ולא ב-hidden: ה-preflight של Tailwind שם [hidden] עם !important
           בתוך @layer base, ו-!important בשכבה גובר על הכלל של ההדפסה שמחוץ לשכבה */
        <div id={PRINT_ROOT_ID} style={{ display: "none" }} aria-hidden>
          <style>{printCss(voucherBackground(kind))}</style>
          {/* eslint-disable-next-line @next/next/no-img-element -- קובץ blob מקומי להדפסה, לא תמונה של האתר */}
          <img ref={printImageRef} alt={`${data.title} ${data.code}`} />
        </div>,
        document.body,
      )}
    </>
  );
}

export default function VoucherDialog({ request, onClose, onIssued }: VoucherDialogProps) {
  return (
    <Dialog open={request != null} onOpenChange={(open) => (open ? undefined : onClose())}>
      {request ? (
        <DialogContent
          dir="rtl"
          showCloseButton={false}
          className="max-h-[92dvh] gap-4 overflow-y-auto p-4 sm:max-w-lg"
        >
          <DialogHeader className="flex-row items-start justify-between gap-3 text-start">
            <div className="grid gap-1.5">
              <DialogTitle className="text-lg font-semibold">
                {request.kind === "gift" ? "שובר מתנה" : "אישור הזמנה"}
                <span className="mt-1 block text-sm font-normal text-muted-foreground">{request.card.title}</span>
              </DialogTitle>
              <DialogDescription>
                {request.kind === "gift"
                  ? `שולחים לקונה, והוא מעביר הלאה. בלי מחיר. התוקף בשובר: ${GIFT_VALIDITY_YEARS} שנים, המינימום בחוק.`
                  : "שולחים מיד אחרי ה״כן״, ושוב באותו קוד אחרי המקדמה. בלי מחיר."}
              </DialogDescription>
            </div>
            <DialogClose
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-border text-lg text-foreground hover:bg-muted/50"
              aria-label="סגירה"
            >
              <span aria-hidden>×</span>
            </DialogClose>
          </DialogHeader>
          <VoucherForm key={request.key} request={request} onIssued={onIssued} />
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
