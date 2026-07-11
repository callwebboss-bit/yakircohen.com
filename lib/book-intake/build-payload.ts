import type { IntakeFileMeta } from "@/lib/book-intake/file-validation";
import { formatFileSizeMb } from "@/lib/book-intake/file-validation";
import {
  getPresetByTag,
  type ServiceTypeTag,
} from "@/lib/book-intake/presets";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
} from "@/lib/form-validation";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { appendYcLeadTag, type YcLeadTagInput } from "@/lib/yc-lead-tag";

export type BookIntakeCloserPayload = {
  ticket_code: string;
  lead_name: string;
  lead_phone: string;
  lead_email?: string;
  service_type_tag: ServiceTypeTag;
  urgency_flag: false;
  user_choice_preset: string;
  free_text_description: string;
  file_meta?: IntakeFileMeta;
};

export type BookIntakeFormData = {
  name: string;
  phone: string;
  email: string;
  serviceTypeTag: ServiceTypeTag | null;
  freeTextDescription: string;
  fileMeta?: IntakeFileMeta;
};

const TICKET_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateTicketCode(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  let random = "";
  for (let i = 0; i < 6; i++) {
    random += TICKET_CHARS[Math.floor(Math.random() * TICKET_CHARS.length)];
  }
  return `YAKIR-${dd}${mm}${yyyy}-${random}`;
}

export function buildPayload(formData: BookIntakeFormData): BookIntakeCloserPayload {
  const preset = getPresetByTag(formData.serviceTypeTag ?? "NEED_RECOMMENDATION");
  const payload: BookIntakeCloserPayload = {
    ticket_code: generateTicketCode(),
    lead_name: sanitizeLeadText(formData.name, 60),
    lead_phone: formData.phone.trim(),
    service_type_tag: preset.tag,
    urgency_flag: false,
    user_choice_preset: preset.userChoicePreset,
    free_text_description: sanitizeLeadText(formData.freeTextDescription, 1500),
  };

  const email = formData.email.trim();
  if (email) payload.lead_email = email;

  if (formData.fileMeta) {
    payload.file_meta = formData.fileMeta;
  }

  return payload;
}

export function buildIntakeWhatsAppBody(payload: BookIntakeCloserPayload): string {
  const preset = getPresetByTag(payload.service_type_tag);
  const lines = [
    "שלום, שלחתי פנייה מהירה מהאתר.",
    "",
    `כרטיס: ${payload.ticket_code}`,
    `שם: ${payload.lead_name}`,
    `טלפון: ${formatPhoneForDisplay(payload.lead_phone)}`,
  ];

  if (payload.lead_email) {
    lines.push(`אימייל: ${payload.lead_email}`);
  }

  lines.push(`צורך: ${preset.label}`);
  if (payload.free_text_description) {
    lines.push(`פרטים: ${payload.free_text_description}`);
  }

  if (payload.file_meta) {
    lines.push(
      "",
      `אצרף כעת את הקובץ "${payload.file_meta.name}" (${formatFileSizeMb(payload.file_meta.size_bytes)}) כאן בצ'אט`,
    );
  }

  const tagInput: YcLeadTagInput = {
    service: preset.closerService,
    source: "/book",
    step: 3,
    intent: "continue_chat",
    form: "book_intake",
  };

  return appendYcLeadTag(lines.join("\n"), tagInput);
}

export function buildIntakeWhatsAppHref(payload: BookIntakeCloserPayload): string {
  return buildWhatsAppHref({
    text: buildIntakeWhatsAppBody(payload),
    utm_source: "website",
    utm_campaign: "book_intake_wizard",
  });
}

export function buildIntakeEmailBody(payload: BookIntakeCloserPayload): string {
  const preset = getPresetByTag(payload.service_type_tag);
  const lines = [
    `כרטיס: ${payload.ticket_code}`,
    `שם: ${payload.lead_name}`,
    `טלפון: ${formatPhoneForDisplay(payload.lead_phone)}`,
    payload.lead_email ? `אימייל: ${payload.lead_email}` : null,
    `סוג שירות: ${preset.label} (${payload.service_type_tag})`,
    payload.free_text_description
      ? `תיאור: ${payload.free_text_description}`
      : "תיאור: לא צוין",
    payload.file_meta
      ? `קובץ (מטא): ${payload.file_meta.name} (${formatFileSizeMb(payload.file_meta.size_bytes)}, ${payload.file_meta.mime})`
      : "קובץ: לא צורף",
    "",
    "--- JSON ל-Closer ---",
    JSON.stringify(payload, null, 2),
    "",
    'להדבקה ב-yakir-closer: העתיקו את בלוק ה-JSON לשדה "קליטה מהירה".',
  ];
  return lines.filter((l): l is string => l !== null).join("\n");
}
