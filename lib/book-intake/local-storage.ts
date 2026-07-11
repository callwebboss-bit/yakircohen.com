export const INTAKE_KNOWN_STORAGE_KEY = "yakir_intake_known_v1";

export type IntakeKnownContact = {
  name: string;
  phone: string;
  email: string;
};

export function readIntakeKnownContact(): IntakeKnownContact | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(INTAKE_KNOWN_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof (parsed as IntakeKnownContact).name !== "string" ||
      typeof (parsed as IntakeKnownContact).phone !== "string" ||
      typeof (parsed as IntakeKnownContact).email !== "string"
    ) {
      return null;
    }
    const contact = parsed as IntakeKnownContact;
    if (!contact.name.trim() || !contact.phone.trim()) return null;
    return contact;
  } catch {
    return null;
  }
}

export function saveIntakeKnownContact(contact: IntakeKnownContact): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      INTAKE_KNOWN_STORAGE_KEY,
      JSON.stringify({
        name: contact.name.trim(),
        phone: contact.phone.trim(),
        email: contact.email.trim(),
      }),
    );
  } catch {
    /* quota / private mode */
  }
}

export const INTAKE_DRAFT_STORAGE_KEY = "yakir_intake_draft_v1";

export type IntakeDraft = {
  name: string;
  phone: string;
  email: string;
  serviceTypeTag: string | null;
  freeTextDescription: string;
  step: number;
};

export function readIntakeDraft(): IntakeDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(INTAKE_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const draft = parsed as IntakeDraft;
    if (
      typeof draft.name !== "string" ||
      typeof draft.phone !== "string" ||
      typeof draft.email !== "string" ||
      typeof draft.freeTextDescription !== "string" ||
      typeof draft.step !== "number"
    ) {
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

export function saveIntakeDraft(draft: IntakeDraft): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INTAKE_DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* quota / private mode */
  }
}

export function clearIntakeDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(INTAKE_DRAFT_STORAGE_KEY);
  } catch {
    /* private mode */
  }
}
