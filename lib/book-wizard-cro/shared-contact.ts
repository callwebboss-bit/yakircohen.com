const CORE_CONTACT_KEY = "yc_book_core_contact";

export type BookCoreContact = {
  name: string;
  phone: string;
};

export function saveBookCoreContact(contact: Partial<BookCoreContact>): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    const existing = readBookCoreContact() ?? { name: "", phone: "" };
    const next: BookCoreContact = {
      name: contact.name?.trim() || existing.name,
      phone: contact.phone?.trim() || existing.phone,
    };
    if (!next.name && !next.phone) return;
    sessionStorage.setItem(CORE_CONTACT_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function readBookCoreContact(): BookCoreContact | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CORE_CONTACT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BookCoreContact;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      phone: typeof parsed.phone === "string" ? parsed.phone : "",
    };
  } catch {
    return null;
  }
}

export function clearBookCoreContact(): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.removeItem(CORE_CONTACT_KEY);
  } catch {
    /* ignore */
  }
}

/** ממזג שם/טלפון מטיוטה משותפת - לא דורס ערכים מלאים */
export function mergeCoreContactIntoDraft<T extends { name: string; phone: string }>(
  draft: T,
): T {
  const core = readBookCoreContact();
  if (!core) return draft;
  return {
    ...draft,
    name: draft.name.trim() ? draft.name : core.name,
    phone: draft.phone.trim() ? draft.phone : core.phone,
  };
}
