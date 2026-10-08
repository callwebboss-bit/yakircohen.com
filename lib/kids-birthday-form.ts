/**
 * לוגיקה טהורה של טופס ההזמנה ב-/studio/kids-birthday: אימות והודעת וואטסאפ.
 * יושבת ב-lib ולא ברכיב כדי שתיבדק בלי דפדפן.
 *
 * מינימום הילדים מגיע מ-lib/data/kids-birthday.ts. כשהוא null האימות מדלג
 * עליו, ולא ממציא מגבלה. מקסימום ילדים לא נקבע: הבעלים אמר שהמקום מאכלס עד
 * 14 איש, ומספר האנשים אינו מספר הילדים, ולכן הטופס לא חוסם מעל 14. ההערה
 * על הקיבולת מוצגת ליד השדה והשליחה נשארת אפשרית.
 */
import { formatHebrewDate } from "@/lib/format-hebrew-date";
import {
  validateEventDate,
  validateIsraeliMobile,
  validatePersonName,
  type FieldErrors,
  type ValidationResult,
} from "@/lib/form-validation";
import {
  KIDS_BIRTHDAY_FORM_ID,
  KIDS_BIRTHDAY_PATH,
  KIDS_BIRTHDAY_SERVICE_LABEL,
  type KidsBirthdayLimits,
} from "@/lib/data/kids-birthday";
import { buildSimpleLeadMessage } from "@/lib/whatsapp-closing";

/**
 * תקרת שפיות נגד ספאם ומספרים מופרכים. זה לא כלל עסקי, והיא לא מוצגת לגולש
 * כמגבלה של האירוע. מעל הקיבולת של המקום (14 איש) מותר לשלוח: מחלקים לקבוצות.
 */
export const CHILDREN_SANITY_CAP = 200;

export type KidsBirthdayFormFields = {
  name: string;
  phone: string;
  /** YYYY-MM-DD, כפי ש-input מסוג date מחזיר */
  date: string;
  /** המחרוזת מהשדה. מומרת למספר באימות. */
  children: string;
};

/** מחזיר את הכמות כמספר שלם, או null כשהקלט אינו מספר שלם חיובי */
export function parseChildrenCount(raw: string): number | null {
  const trimmed = raw.trim();
  if (!/^\d{1,4}$/.test(trimmed)) return null;
  const n = Number.parseInt(trimmed, 10);
  return n >= 1 ? n : null;
}

export function validateChildrenCount(
  raw: string,
  limits: KidsBirthdayLimits,
): ValidationResult {
  if (!raw.trim()) {
    return { ok: false, errors: { children: "נא להזין מספר ילדים" } };
  }
  const n = parseChildrenCount(raw);
  if (n === null) {
    return {
      ok: false,
      errors: { children: "מספר הילדים צריך להיות מספר שלם, מ-1 ומעלה" },
    };
  }
  if (limits.min !== null && n < limits.min) {
    return {
      ok: false,
      errors: { children: `מספר הילדים המינימלי הוא ${limits.min}` },
    };
  }
  if (n > CHILDREN_SANITY_CAP) {
    return { ok: false, errors: { children: "מספר הילדים לא נראה סביר" } };
  }
  return { ok: true };
}

/** אימות מלא של הטופס. מפתחות השגיאות זהים לשמות השדות: name, phone, date, children. */
export function validateKidsBirthdayLead(
  fields: KidsBirthdayFormFields,
  limits: KidsBirthdayLimits,
): ValidationResult {
  const errors: FieldErrors = {};
  let normalizedPhone: string | undefined;

  const name = validatePersonName(fields.name);
  if (!name.ok) Object.assign(errors, name.errors);

  const phone = validateIsraeliMobile(fields.phone);
  if (!phone.ok) Object.assign(errors, phone.errors);
  else normalizedPhone = phone.normalizedPhone;

  const date = validateEventDate(fields.date, { required: true });
  if (!date.ok) {
    /* validateEventDate מדווח תחת eventDate. בטופס השדה נקרא date. */
    errors.date = date.errors.eventDate ?? "תאריך לא תקין";
  }

  const children = validateChildrenCount(fields.children, limits);
  if (!children.ok) Object.assign(errors, children.errors);

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, normalizedPhone };
}

/** סדר השדות בטופס: משמש להעברת מיקוד לשדה השגוי הראשון */
export const KIDS_BIRTHDAY_FIELD_ORDER = [
  "name",
  "phone",
  "date",
  "children",
] as const;

export type KidsBirthdayMessageInput = {
  name: string;
  phone: string;
  /** YYYY-MM-DD */
  date: string;
  children: number;
};

/**
 * ההודעה לוואטסאפ ולמייל לבעלים, דרך מנוע ההודעות המשותף
 * (lib/whatsapp-closing.ts), שמצמיד גם את תג [YC:...] ל-yakir-closer.
 *
 * מספר הילדים נכנס לטקסט ההודעה ולא ל-ycChildren: בכלי הסגירה השדה הזה הוא
 * "ילדים מקליטים" שמזינים את חישוב מחיר ההקלטה, וזה לא אותו דבר כמו מספר
 * הילדים באירוע.
 */
export function buildKidsBirthdayLeadMessage(
  input: KidsBirthdayMessageInput,
): string {
  return buildSimpleLeadMessage({
    contact: { name: input.name, phone: input.phone },
    serviceLabel: KIDS_BIRTHDAY_SERVICE_LABEL,
    summaryLines: [
      {
        label: "תאריך מבוקש",
        /* צהריים ולא חצות: new Date("YYYY-MM-DD") הוא UTC, ובאזור זמן מערבי
           היום מתגלגל אחורה. */
        value: formatHebrewDate(`${input.date}T12:00:00`),
      },
      { label: "מספר ילדים", value: String(input.children) },
    ],
    source: KIDS_BIRTHDAY_PATH,
    closerServiceId: "recording",
    ycForm: KIDS_BIRTHDAY_FORM_ID,
  });
}
