---
name: whatsapp-closing
description: Build WhatsApp lead messages, needs-discovery scripts, and pricing checks for yakircohen.com. Use when editing booking forms, WhatsApp CTAs, lead messages, or pricing in customer-facing copy.
---

# WhatsApp Closing -- יקיר כהן הפקות

## When to use

- Editing booking wizards, contact forms, or WhatsApp CTA text
- Adding or changing prices in customer messages
- Reviewing lead message structure before deploy

## Source files

| File | Purpose |
|------|---------|
| `lib/data/pricing-catalog.ts` | Single source of truth for ex-VAT prices |
| `lib/whatsapp-closing.ts` | Message builders, needs script, trust footer |
| `lib/booking-messages.ts` | Booking wizard wrappers |
| `components/booking/NeedsDiscoveryStep.tsx` | UI for "מה חסר ביצירה שלך?" |

## Commands (prompt the agent)

### /needs-discovery

Before suggesting a package, ask clarifying questions:

1. מה באמת חסר ביצירה? (need)
2. מתי צריך את זה? (timing)
3. מה התקציב / רמת הפקה? (budget)
4. כמה משתתפים / אורך? (scope)

Do not push the most expensive package. Match need to catalog item.

### /price-check

1. Read price from `PRICING_CATALOG` or `getExVat(id)`
2. Verify with `npm run audit:pricing`
3. Display: `{exVat} ₪ + מע״מ {vat} ₪ = {total} ₪ סופי`

### /closing-message

Build full message via `buildClosingMessage()`:

```
🚨 ליד פרימיום     (if total ≥ 3,000)
⏰ דחוף            (if timing urgent)

*מה חסר ביצירה שלך?*
[customer need]

*כוונה:* ...
*שירות:* ...
*חבילה מוצעת:* ...
*מחיר:* 950 ₪ + מע״מ 171 ₪ = 1,121 ₪ סופי

*שם:* ...
*טלפון:* ...

*פרטים:* ...

📍 מקור: /book#podcast
```

## Needs discovery script (UI)

```
מה באמת חסר ביצירה שלך?
בלי לחץ, פשוט נדבר.
נקשיב, נבין את הצורך.
נתאים חבילה שתפורה לך.
בוא, נפיג כל חשש ביחד.
```

## Rules

- Never hardcode prices outside `pricing-catalog.ts`
- Always show VAT in WhatsApp price lines
- Use `buildPricingInquiryMessage` for static CTAs; `buildClosingMessage` for forms
- Lead tags: `🚨 ליד פרימיום`, `⏰ דחוף`, `💬 רק בודק/ת`
