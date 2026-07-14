"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import KoalendarModal from "@/components/booking/KoalendarModal";
import {
  parseSmartFormFromSearch,
  readSmartFormSession,
} from "@/lib/smart-form-url";
import { saveBookCoreContact } from "@/lib/book-wizard-cro/shared-contact";
import { formatIlMobileDisplay, normalizeIlMobile } from "@/lib/leads/format-phone-il";

function contactToPhone(contactMethod: string): string {
  const trimmed = contactMethod.trim();
  if (!trimmed || trimmed.includes("@")) return "";
  const normalized = normalizeIlMobile(trimmed);
  return normalized ? formatIlMobileDisplay(normalized) : trimmed;
}

/**
 * כש-URL מכיל koalendar=1 (אחרי Smart Form) - פותח יומן פעם אחת
 * ומבצע prefill ל-shared-contact מה-URL / session.
 */
export default function SmartFormKoalendarBootstrap() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const parsed = parseSmartFormFromSearch(searchParams);
    if (!parsed.koalendar && !parsed.smart) return;
    if (!parsed.koalendar) return;

    const session = readSmartFormSession();
    const name = (parsed.name || session?.name || "").trim();
    const contact = (parsed.contactMethod || session?.contactMethod || "").trim();
    const phone = contactToPhone(contact);

    if (name || phone) {
      saveBookCoreContact({
        name,
        phone: phone || contact,
      });
    }

    setOpen(true);

    const url = new URL(window.location.href);
    url.searchParams.delete("koalendar");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [searchParams]);

  return <KoalendarModal open={open} onClose={() => setOpen(false)} />;
}
