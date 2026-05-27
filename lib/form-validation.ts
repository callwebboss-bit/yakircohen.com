/**
 * Client-side lead validation - blocks bots, junk, and invalid contact details
 * before opening WhatsApp. Not a substitute for server-side checks if forms POST later.
 */

export const HONEYPOT_FIELD_NAME = "website_url_confirm";
export const MIN_FORM_FILL_MS = 4_000;
export const MAX_LEAD_SUBMITS_PER_HOUR = 4;
export const MAX_NOTES_LENGTH = 1_500;
export const MAX_MESSAGE_LENGTH = 2_000;

const SPAM_PATTERNS = [
  /\b(viagra|cialis|casino|forex|crypto\s*invest|bitcoin\s*profit)\b/i,
  /\b(click\s*here|buy\s*now|limited\s*offer|work\s*from\s*home)\b/i,
  /(http:\/\/|https:\/\/|www\.)/i,
  /\b\d{10,}\b.*\b\d{10,}\b/,
];

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "10minutemail.com",
  "yopmail.com",
]);

export type FieldErrors = Record<string, string>;

export type ValidationResult =
  | { ok: true; normalizedPhone?: string }
  | { ok: false; errors: FieldErrors; global?: string };

function hasSpamSignals(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  return SPAM_PATTERNS.some((re) => re.test(t));
}

function hasExcessiveRepeat(text: string): boolean {
  return /(.)\1{5,}/u.test(text);
}

/** Normalize Israeli mobile to 05XXXXXXXX (10 digits). */
export function normalizeIsraeliMobile(phone: string): string | null {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("972")) {
    digits = `0${digits.slice(3)}`;
  }
  if (digits.length === 9 && digits.startsWith("5")) {
    digits = `0${digits}`;
  }
  if (!/^05\d{8}$/.test(digits)) return null;
  return digits;
}

export function validateIsraeliMobile(phone: string): ValidationResult {
  const trimmed = phone.trim();
  if (!trimmed) {
    return { ok: false, errors: { phone: "נא להזין מספר טלפון נייד" } };
  }
  const normalized = normalizeIsraeliMobile(trimmed);
  if (!normalized) {
    return {
      ok: false,
      errors: { phone: "מספר לא תקין - השתמשו בפורמט 05X-XXXXXXX" },
    };
  }
  const allSame = /^(.)\1+$/.test(normalized.slice(1));
  if (allSame || normalized === "0500000000" || normalized === "0512345678") {
    return { ok: false, errors: { phone: "מספר הטלפון לא נראה תקין" } };
  }
  return { ok: true, normalizedPhone: normalized };
}

export function validatePersonName(name: string): ValidationResult {
  const trimmed = name.trim().replace(/\s+/g, " ");
  if (trimmed.length < 2) {
    return { ok: false, errors: { name: "נא להזין שם (לפחות 2 תווים)" } };
  }
  if (trimmed.length > 60) {
    return { ok: false, errors: { name: "השם ארוך מדי" } };
  }
  if (!/[\u0590-\u05FFa-zA-Z]/.test(trimmed)) {
    return { ok: false, errors: { name: "נא להזין שם בעברית או באנגלית" } };
  }
  if (hasExcessiveRepeat(trimmed) || hasSpamSignals(trimmed)) {
    return { ok: false, errors: { name: "השם לא נראה תקין" } };
  }
  return { ok: true };
}

export function validateEmailOptional(email: string): ValidationResult {
  const trimmed = email.trim();
  if (!trimmed) return { ok: true };
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(trimmed) ||
    trimmed.length > 120
  ) {
    return { ok: false, errors: { email: "כתובת מייל לא תקינה" } };
  }
  const domain = trimmed.split("@")[1]?.toLowerCase();
  if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { ok: false, errors: { email: "נא להשתמש במייל קבוע (לא זמני)" } };
  }
  if (hasSpamSignals(trimmed)) {
    return { ok: false, errors: { email: "כתובת המייל לא נראית תקינה" } };
  }
  return { ok: true };
}

export function validateFreeTextOptional(
  text: string,
  options?: { maxLength?: number; field?: string; label?: string },
): ValidationResult {
  const field = options?.field ?? "message";
  const label = options?.label ?? "הטקסט";
  const max = options?.maxLength ?? MAX_MESSAGE_LENGTH;
  const trimmed = text.trim();
  if (!trimmed) return { ok: true };
  if (trimmed.length < 3) {
    return { ok: false, errors: { [field]: `${label} קצר מדי` } };
  }
  if (trimmed.length > max) {
    return { ok: false, errors: { [field]: `${label} ארוך מדי` } };
  }
  if (hasSpamSignals(trimmed) || hasExcessiveRepeat(trimmed)) {
    return { ok: false, errors: { [field]: `${label} לא נראה תקין` } };
  }
  const urlCount = (trimmed.match(/https?:\/\/|www\./gi) ?? []).length;
  if (urlCount > 1) {
    return { ok: false, errors: { [field]: "נא לא להדביק קישורים מרובים" } };
  }
  return { ok: true };
}

export function validateVenue(venue: string, required = true): ValidationResult {
  const trimmed = venue.trim();
  if (!trimmed) {
    return required
      ? { ok: false, errors: { venue: "נא להזין מיקום / שם אולם" } }
      : { ok: true };
  }
  if (trimmed.length < 3 || trimmed.length > 120) {
    return { ok: false, errors: { venue: "מיקום האירוע קצר או ארוך מדי" } };
  }
  if (hasSpamSignals(trimmed)) {
    return { ok: false, errors: { venue: "מיקום האירוע לא נראה תקין" } };
  }
  return { ok: true };
}

export function validateEventDate(
  date: string,
  options?: { required?: boolean; maxYearsAhead?: number },
): ValidationResult {
  const required = options?.required ?? true;
  if (!date.trim()) {
    return required
      ? { ok: false, errors: { eventDate: "נא לבחור תאריך" } }
      : { ok: true };
  }
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return { ok: false, errors: { eventDate: "תאריך לא תקין" } };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (parsed < today) {
    return { ok: false, errors: { eventDate: "תאריך האירוע לא יכול להיות בעבר" } };
  }
  const maxYears = options?.maxYearsAhead ?? 3;
  const maxDate = new Date(today);
  maxDate.setFullYear(maxDate.getFullYear() + maxYears);
  if (parsed > maxDate) {
    return { ok: false, errors: { eventDate: "תאריך רחוק מדי - צרו קשר ישירות" } };
  }
  return { ok: true };
}

export function validateEventTime(time: string): ValidationResult {
  if (!time.trim()) {
    return { ok: false, errors: { eventTime: "נא לבחור שעה" } };
  }
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return { ok: false, errors: { eventTime: "שעה לא תקינה" } };
  }
  return { ok: true };
}

export function validateGuestCountOptional(count: string): ValidationResult {
  const trimmed = count.trim();
  if (!trimmed) return { ok: true };
  const n = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(n) || n < 1 || n > 50_000) {
    return { ok: false, errors: { guestCount: "מספר אורחים לא סביר" } };
  }
  return { ok: true };
}

export function validateHoneypot(value: string): boolean {
  return value.trim().length === 0;
}

export function validateFormTiming(startedAtMs: number): boolean {
  return Date.now() - startedAtMs >= MIN_FORM_FILL_MS;
}

const RATE_KEY_PREFIX = "yc_lead_rate_";

export function isSubmitRateLimited(formId: string): boolean {
  if (typeof sessionStorage === "undefined") return false;
  try {
    const key = `${RATE_KEY_PREFIX}${formId}`;
    const raw = sessionStorage.getItem(key);
    const stamps: number[] = raw ? (JSON.parse(raw) as number[]) : [];
    const hourAgo = Date.now() - 3_600_000;
    const recent = stamps.filter((t) => t > hourAgo);
    return recent.length >= MAX_LEAD_SUBMITS_PER_HOUR;
  } catch {
    return false;
  }
}

export function recordLeadSubmit(formId: string): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    const key = `${RATE_KEY_PREFIX}${formId}`;
    const raw = sessionStorage.getItem(key);
    const stamps: number[] = raw ? (JSON.parse(raw) as number[]) : [];
    const hourAgo = Date.now() - 3_600_000;
    const recent = stamps.filter((t) => t > hourAgo);
    recent.push(Date.now());
    sessionStorage.setItem(key, JSON.stringify(recent));
  } catch {
    /* ignore quota */
  }
}

function mergeResults(...results: ValidationResult[]): ValidationResult {
  const errors: FieldErrors = {};
  let normalizedPhone: string | undefined;
  for (const r of results) {
    if (r.ok) {
      if (r.normalizedPhone) normalizedPhone = r.normalizedPhone;
      continue;
    }
    Object.assign(errors, r.errors);
  }
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, normalizedPhone };
}

export type LeadGuardFailure =
  | "honeypot"
  | "timing"
  | "rate_limit"
  | "validation";

export function runLeadGuard(options: {
  formId: string;
  startedAtMs: number;
  honeypot: string;
  validateFields: () => ValidationResult;
}): ValidationResult & { failure?: LeadGuardFailure } {
  if (!validateHoneypot(options.honeypot)) {
    return {
      ok: false,
      errors: {},
      global: "לא הצלחנו לשלוח את הפרטים. נסו שוב או התקשרו אלינו.",
      failure: "honeypot",
    };
  }
  if (!validateFormTiming(options.startedAtMs)) {
    return {
      ok: false,
      errors: {},
      global: "נא למלא את הטופס לפחות כמה שניות לפני השליחה.",
      failure: "timing",
    };
  }
  if (isSubmitRateLimited(options.formId)) {
    return {
      ok: false,
      errors: {},
      global: "נשלחו כמה פניות מהדפדפן הזה. נסו שוב בעוד שעה או התקשרו.",
      failure: "rate_limit",
    };
  }
  const fields = options.validateFields();
  if (!fields.ok) {
    return { ...fields, failure: "validation" };
  }
  recordLeadSubmit(options.formId);
  return fields;
}

export const LEAD_GUARD_GENERIC_ERROR =
  "לא הצלחנו לשלוח את הפרטים. בדקו את השדות או צרו קשר בטלפון.";

export function validateContactQuiz(fields: {
  name: string;
  phone: string;
  email: string;
  message: string;
}): ValidationResult {
  return mergeResults(
    validatePersonName(fields.name),
    validateIsraeliMobile(fields.phone),
    validateEmailOptional(fields.email),
    validateFreeTextOptional(fields.message, {
      field: "message",
      label: "ההודעה",
      maxLength: MAX_MESSAGE_LENGTH,
    }),
  );
}

/** Booking form field names (`date` / `time`, not `eventDate`). */
export function validateBookingLead(fields: {
  name: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  requireLocation: boolean;
  /** Default true. Set false for intent-based flows where exact date is optional. */
  requireDate?: boolean;
  /** Default true. Automatically false when date is empty. */
  requireTime?: boolean;
}): ValidationResult {
  const requireDate = fields.requireDate !== false;
  const requireTime = fields.requireTime !== false;
  const dateResult = validateEventDate(fields.date, { required: requireDate });
  // Never require time when no date is entered
  const effectiveRequireTime = requireTime && fields.date.trim().length > 0;
  const timeResult: ValidationResult = fields.time.trim()
    ? validateEventTime(fields.time)
    : effectiveRequireTime
      ? { ok: false, errors: { eventTime: "נא לבחור שעה" } }
      : { ok: true };
  const rest = mergeResults(
    validatePersonName(fields.name),
    validateIsraeliMobile(fields.phone),
    fields.requireLocation
      ? validateVenue(fields.location, true)
      : validateVenue(fields.location, false),
    validateFreeTextOptional(fields.notes, {
      field: "notes",
      label: "הערות",
      maxLength: MAX_NOTES_LENGTH,
    }),
  );
  const merged = mergeResults(dateResult, timeResult, rest);
  if (!merged.ok) {
    const errors = { ...merged.errors };
    if (errors.eventDate) {
      errors.date = errors.eventDate;
      delete errors.eventDate;
    }
    if (errors.eventTime) {
      errors.time = errors.eventTime;
      delete errors.eventTime;
    }
    if (errors.venue) {
      errors.location = errors.venue;
      delete errors.venue;
    }
    return { ok: false, errors };
  }
  return merged;
}

export function validateAttractionsOrder(fields: {
  name: string;
  phone: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  guestCount: string;
  notes: string;
}): ValidationResult {
  const errors: FieldErrors = {};
  const nameR = validatePersonName(fields.name);
  const phoneR = validateIsraeliMobile(fields.phone);
  const dateR = validateEventDate(fields.eventDate);
  const timeR = validateEventTime(fields.eventTime);
  const venueR = validateVenue(fields.venue, true);
  const guestsR = validateGuestCountOptional(fields.guestCount);
  const notesR = validateFreeTextOptional(fields.notes, {
    field: "notes",
    label: "הערות",
    maxLength: MAX_NOTES_LENGTH,
  });

  if (!fields.eventType.trim()) {
    errors.eventType = "נא לבחור סוג אירוע";
  }

  for (const r of [nameR, phoneR, dateR, timeR, venueR, guestsR, notesR]) {
    if (!r.ok) Object.assign(errors, r.errors);
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  const phoneOk = phoneR.ok ? phoneR : null;
  return {
    ok: true,
    normalizedPhone: phoneOk?.normalizedPhone,
  };
}

export function validateDjReserve(fields: {
  name: string;
  phone: string;
  date: string;
  location: string;
}): ValidationResult {
  const dateR = validateEventDate(fields.date);
  const parts: ValidationResult[] = [
    validatePersonName(fields.name),
    validateIsraeliMobile(fields.phone),
    !dateR.ok && dateR.errors.eventDate
      ? { ok: false as const, errors: { date: dateR.errors.eventDate } }
      : dateR,
  ];
  if (fields.location.trim()) {
    const venueR = validateVenue(fields.location, true);
    if (!venueR.ok && venueR.errors.venue) {
      parts.push({ ok: false, errors: { location: venueR.errors.venue } });
    }
  }
  return mergeResults(...parts);
}

export function sanitizeLeadText(text: string, maxLen: number): string {
  return text
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLen);
}

export function formatPhoneForDisplay(e164Style: string): string {
  const n = normalizeIsraeliMobile(e164Style);
  if (!n) return e164Style.trim();
  return `${n.slice(0, 3)}-${n.slice(3, 6)}-${n.slice(6)}`;
}
