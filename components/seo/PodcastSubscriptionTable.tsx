"use client";

import { useId, useState } from "react";
import { withVat } from "@/lib/data/pricing";
import type { SubscriptionPlan, SubscriptionPlanId } from "@/lib/data/podcast-subscription-page";
import { fireLeadTouch } from "@/lib/lead-touch";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { buildSubscriptionWhatsAppText } from "@/lib/podcast-subscription";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const PRICE_PLACEHOLDER = "₪ XXX";

function priceCell(plan: SubscriptionPlan) {
  if (plan.priceExVat == null) {
    return (
      <>
        <span className="block text-base font-semibold text-foreground">{PRICE_PLACEHOLDER}</span>
        <span className="block text-xs text-muted-foreground">לחודש, המחיר ייקבע</span>
      </>
    );
  }
  return (
    <>
      <span className="block text-base font-semibold text-foreground">
        {withVat(plan.priceExVat).toLocaleString("he-IL")} ₪ לחודש
      </span>
      <span className="block text-xs text-muted-foreground">
        כולל מע״מ, {plan.priceExVat.toLocaleString("he-IL")} ₪ + מע״מ
      </span>
    </>
  );
}

function perEpisodeCell(plan: SubscriptionPlan) {
  if (plan.priceExVat == null) return PRICE_PLACEHOLDER;
  const perEpisodeExVat = Math.round(plan.priceExVat / plan.episodesPerMonth);
  return (
    <>
      <span className="block font-semibold text-foreground">
        {withVat(perEpisodeExVat).toLocaleString("he-IL")} ₪
      </span>
      <span className="block text-xs text-muted-foreground">כולל מע״מ</span>
    </>
  );
}

const yesNo = (included: boolean) => (included ? "כלולה" : "לא כלולה");

/**
 * טבלת השוואה אחת לשלושת המסלולים, וכפתור יחיד שפותח וואטסאפ עם המסלול שנבחר.
 * הטבלה בתוך אזור גלילה אופקית שאפשר להגיע אליו במקלדת, ועמודת התוויות
 * נדבקת לצד ההתחלה (ימין ב-RTL) כדי שהשורה לא תאבד את שמה בגלילה.
 */
export default function PodcastSubscriptionTable({ plans }: { plans: readonly SubscriptionPlan[] }) {
  const groupName = useId();
  const [selectedId, setSelectedId] = useState<SubscriptionPlanId | null>(null);
  const selected = plans.find((plan) => plan.id === selectedId) ?? null;

  function handleTalkAboutSubscription() {
    const href = buildWhatsAppHref({
      text: buildSubscriptionWhatsAppText(selected),
      utm_source: "website",
      utm_campaign: "podcast_subscription",
    });
    fireLeadTouch("podcast_subscription", selected ? `whatsapp:${selected.id}` : "whatsapp");
    openWhatsAppLead(href);
  }

  const labelCell = "sticky start-0 z-10 bg-surface px-4 py-3 text-start text-sm font-semibold text-foreground";
  const cellClass = (id: SubscriptionPlanId) =>
    `px-4 py-3 text-center text-sm text-foreground ${id === selectedId ? "bg-brand-red/8" : ""}`;

  const rows: { label: string; render: (plan: SubscriptionPlan) => React.ReactNode }[] = [
    { label: "פרקים בחודש", render: (plan) => plan.episodesPerMonth },
    { label: "עריכת אודיו", render: (plan) => yesNo(plan.audioEditing) },
    { label: "עריכת וידאו", render: (plan) => yesNo(plan.videoEditing) },
    { label: "מחיר לפרק", render: perEpisodeCell },
    { label: "מחיר לחודש", render: priceCell },
  ];

  return (
    <div dir="rtl">
      <p className="mb-2 text-xs text-muted-foreground sm:hidden">אפשר לגלול הצידה כדי לראות את כל המסלולים.</p>
      <div
        role="region"
        tabIndex={0}
        aria-label="השוואת מסלולי מנוי, אפשר לגלול הצידה"
        className="overflow-x-auto rounded-xl border border-border bg-background"
      >
        <table className="w-full min-w-[34rem] border-collapse text-start">
          <caption className="sr-only">השוואה בין שלושת מסלולי המנוי החודשי לפודקאסט</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="sticky start-0 z-10 bg-surface px-4 py-3 text-start text-sm font-medium text-muted-foreground">
                בחרו מסלול
              </th>
              {plans.map((plan) => (
                <th key={plan.id} scope="col" className={cellClass(plan.id)}>
                  <label className="flex cursor-pointer flex-col items-center gap-2">
                    <input
                      type="radio"
                      name={groupName}
                      value={plan.id}
                      checked={plan.id === selectedId}
                      onChange={() => setSelectedId(plan.id)}
                      className="size-4 accent-brand-red"
                    />
                    <span className="text-base font-semibold">{plan.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{plan.tagline}</span>
                  </label>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-b-0">
                <th scope="row" className={labelCell}>
                  {row.label}
                </th>
                {plans.map((plan) => (
                  <td key={plan.id} className={cellClass(plan.id)}>
                    {row.render(plan)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {selected ? `המסלול שנבחר: ${selected.name}` : "אפשר לבחור מסלול, ואפשר גם לדבר בלי לבחור."}
        </p>
        <button
          type="button"
          onClick={handleTalkAboutSubscription}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          בואו נדבר על מנוי
        </button>
      </div>
    </div>
  );
}
