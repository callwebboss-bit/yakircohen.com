import Link from "next/link";
import type { LegalSection } from "@/components/legal/LegalPageLayout";
import CatalogOfferPanel from "@/components/pricing/CatalogOfferPanel";
import { TIME_CLAIMS, TIME_PROMISE_DISCLAIMER } from "@/lib/data/conversion-copy";
import { CANCELLATION_SUMMARY, DELIVERY_TIME_FAQ } from "@/lib/data/home-faq";
import {
  FILES_RULES,
  ONLINE_SAMPLE_LINE,
  ONLINE_SAMPLE_RULES,
  REVISION_RULES,
} from "@/lib/data/legal-trust-copy";
import {
  getPriceById,
  getPriceTransparencyById,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";
import { formatConsumerPriceLine } from "@/lib/data/pricing-display";
import { REVISION_POLICIES } from "@/lib/data/revision-policy";

/*
 * הדף /whats-included (רעיון 10 מרשימת שירותי האקסטרה, החלטות הבעלים 11.10.2026).
 * הדף לא כותב שום רשימה משלו: מה כלול ומה לא מגיע מהקטלוג, סבבי התיקונים
 * מ-revision-policy.ts, והכללים, הביטול והזמנים מהמקורות המשותפים. אחריות
 * ותקלה בדיוק לפי התקנון (terms-content.tsx, סעיף 3), בלי הבטחה חדשה.
 */

const SERVICES: readonly { id: PriceItemId; href: string }[] = [
  { id: "song_recording", href: "/studio/recording-song-modiin" },
  { id: "blessing_recording", href: "/studio/blessings" },
  { id: "podcast_audio", href: "/podcast" },
  { id: "full_podcast_production", href: "/podcast/podcast-production" },
  { id: "online_home_mix", href: "/online/vocal-fix/mixing" },
  { id: "dj_premium", href: "/dj-events" },
];

const linkClass = "text-brand-red hover:underline";

function priceLine(id: PriceItemId): string {
  const item = getPriceById(id);
  return formatConsumerPriceLine(item.exVat, item.priceFrom === true);
}

/** שאלות קצרות: מוצגות בסוף הדף וגם נכנסות לסכמת FAQPage, באותו נוסח */
export const INCLUDED_FAQ: readonly { question: string; answer: string }[] = [
  {
    question: "כמה סבבי תיקונים כלולים?",
    answer: `${REVISION_POLICIES.map((p) => `${p.service}: ${p.summary}`).join(". ")}.`,
  },
  {
    question: "מה נחשב סבב תיקונים?",
    answer: `${REVISION_RULES[0]} ${REVISION_RULES[1]}`,
  },
  {
    question: "אפשר לקבל דוגמה לפני תשלום בשירותי אונליין?",
    answer: `כן. ${ONLINE_SAMPLE_LINE}`,
  },
  {
    question: "מקבלים את קבצי הפרויקט וחומרי הגלם?",
    answer: FILES_RULES[0],
  },
  {
    question: "כמה זמן הקבצים נשמרים אצלכם?",
    answer: FILES_RULES[1],
  },
];

export const INCLUDED_PAGE = {
  title: "מה כלול במחיר",
  intro: "כדי שתדעו בדיוק על מה אתם משלמים, ומה אפשר להוסיף אם רוצים יותר.",
  updatedLabel: "עודכן ב-11 באוקטובר 2026.",
  sections: [
    {
      id: "by-service",
      title: "מה כלול בכל שירות",
      content: (
        <>
          <p>
            לכל שירות: מה כלול, מה לא כלול, ואילו תוספות אפשר להזמין כדי לשפר אותו.
            כל השירותים והמחירים ב
            <Link href="/pricing" className={linkClass}>
              מחירון
            </Link>
            .
          </p>
          {SERVICES.map(({ id, href }) => (
            <div key={id}>
              <h3>
                <Link href={href} className={linkClass}>
                  {getPriceById(id).label}
                </Link>
              </h3>
              <p>{priceLine(id)}</p>
              <CatalogOfferPanel transparency={getPriceTransparencyById(id)} />
            </div>
          ))}
        </>
      ),
    },
    {
      id: "revisions",
      title: "סבבי תיקונים",
      content: (
        <>
          <ul>
            {REVISION_POLICIES.map((p) => (
              <li key={p.id}>
                <Link href={p.href} className={linkClass}>
                  {p.service}
                </Link>
                : {p.summary}.
                {p.extraRoundId ? ` סבב נוסף: ${priceLine(p.extraRoundId)}.` : null}
              </li>
            ))}
          </ul>
          <h3>מה נחשב תיקון</h3>
          <ul>
            {REVISION_RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: "online-sample",
      title: "שירותי אונליין: דוגמה לפני תשלום",
      content: (
        <ul>
          {ONLINE_SAMPLE_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      ),
    },
    {
      id: "files",
      title: "קבצים ושמירה",
      content: (
        <>
          <ul>
            {FILES_RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          <p>
            {getPriceById("cloud_storage_permanent").label}: {priceLine("cloud_storage_permanent")},
            תשלום חד-פעמי.
          </p>
        </>
      ),
    },
    {
      id: "times",
      title: "זמנים",
      content: (
        <>
          <p>תשובה להצעת מחיר: {TIME_CLAIMS.quoteHour}.</p>
          <p>{DELIVERY_TIME_FAQ.answer}</p>
          <p>{TIME_PROMISE_DISCLAIMER}</p>
        </>
      ),
    },
    {
      id: "if-something-goes-wrong",
      title: "ביטול ותקלה",
      content: (
        <>
          <p>{CANCELLATION_SUMMARY}</p>
          <ul>
            <li>
              תקלה שלא מאפשרת להפעיל את השירות בכלל: בודקים מיד, ואפשר לקבל החזר של עד
              מחצית מהתשלום, לפי שיקול דעתנו. אין החזר מלא אוטומטי.
            </li>
            <li>הפסקת חשמל או שיבוש חיצוני אינם באחריותנו.</li>
            <li>בשירותים בחוץ מזג האוויר עלול להשפיע. אנחנו מעדכנים מראש.</li>
          </ul>
          <p>
            הנוסח המלא ב
            <Link href="/terms#cancellation" className={linkClass}>
              תנאי השירות: ביטולים
            </Link>
            {" "}וב
            <Link href="/terms#liability" className={linkClass}>
              הגבלת אחריות
            </Link>
            .
          </p>
        </>
      ),
    },
    {
      id: "faq",
      title: "שאלות קצרות",
      content: (
        <>
          {INCLUDED_FAQ.map((item) => (
            <div key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </>
      ),
    },
  ] satisfies LegalSection[],
};
