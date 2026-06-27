import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

const PRICING_QUICK_NAV = [
  {
    title: "חבילות מוכנות",
    description: "אולפן, פודקאסט וחתונות",
    href: "/packages",
  },
  {
    title: "הזמנה עם מחיר סופי",
    description: "בוחרים שירות, רואים מחיר מיד",
    href: "/book",
  },
  {
    title: "מחשבון פודקאסט",
    description: "חבילות הקלטה ועריכה",
    href: "/podcast",
  },
  {
    title: "מחירון אולפן",
    description: "שעות, ברכות ושירים",
    href: "/pricing#studio",
  },
  {
    title: "DJ ואירועים",
    description: "תקליטן, הגברה ואפקטים",
    href: "/events/dj-events",
  },
  {
    title: "שירותי AI מקוונים",
    description: "שחזור, מיקס ותיקון זיופים",
    href: "/pricing#online",
  },
  {
    title: "אטרקציות לאירועים",
    description: "עשן, בועות, זיקוקים",
    href: "/pricing#events",
  },
] as const;

export default function PricingHubQuickNav() {
  return (
    <Section padding="sm" className="border-b border-border bg-surface">
      <Container className="max-w-3xl">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          מחשבונים ומחירים לפי שירות
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          קפיצה מהירה למחשבון או לעמוד המחיר הרלוונטי. הטבלאות למטה נשארות לעיון מלא.
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PRICING_QUICK_NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-12 flex-col justify-center rounded-xl border border-border bg-background px-4 py-3 transition-colors hover:border-brand-red/40 hover:bg-brand-red/5"
              >
                <span className="text-sm font-semibold text-foreground">
                  {item.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
