import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

const PRICING_QUICK_NAV = [
  {
    title: "אולפן והקלטות",
    description: "שעות אולפן, ברכות, שירים וספרי שמע",
    href: "/pricing#pricing-super-studio",
  },
  {
    title: "פודקאסט",
    description: "הקלטה, עריכה וחבילות",
    href: "/pricing#pricing-super-podcast",
  },
  {
    title: "תוכן לעסקים",
    description: "רילז, תוכן ארגוני וסדנאות",
    href: "/pricing#pricing-super-business",
  },
  {
    title: "אירועים והפקות",
    description: "אטרקציות ומצגות תמונות",
    href: "/pricing#pricing-super-events",
  },
  {
    title: "שירותי AI ועריכה",
    description: "שחזור קול, תמלול ושיבוט",
    href: "/pricing#pricing-super-online",
  },
  {
    title: "הזמנה עם מחיר סופי",
    description: "בוחרים שירות, רואים מחיר מיד",
    href: "/book",
  },
] as const;

export default function PricingHubQuickNav() {
  return (
    <Section padding="sm" className="border-b border-border bg-surface">
      <Container className="max-w-3xl">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          מחירון לפי קטגוריה
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          קפיצה מהירה לקטגוריה. פתחו מקטע ואז שורה לראות מחיר.
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
