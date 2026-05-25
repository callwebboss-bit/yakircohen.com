import Link from "next/link";
import {
  accessibilityWhatsAppHref,
  LEGAL_PHONE_DISPLAY,
  legalWhatsAppHref,
} from "@/lib/legal-contact";
import type { LegalSection } from "@/components/legal/LegalPageLayout";

export const PRIVACY_PAGE = {
  title: "מדיניות פרטיות",
  intro:
    "אנחנו מכבדים את פרטיותכם ומחויבים לשקיפות מלאה באיסוף ושימוש במידע.",
  updatedLabel: "מדיניות זו עודכנה ב־29 באפריל 2026. שינויים עתידיים יפורסמו בעמוד זה.",
  sections: [
    {
      id: "overview",
      title: "מדיניות פרטיות",
      content: (
        <>
          <p>
            באתר של יקיר כהן הפקות אנחנו מכבדים את פרטיותכם וזוכים את המידע בצורה
            שקופה ובטוחה.
          </p>
          <p>
            המידע שנאסף באתר משמש רק כדי לענות לפניות, לתאם שירותים ולשפר את חוויית
            השימוש. אין אנו שומרים פרטי כרטיס אשראי באתר, והתשלומים מתבצעים דרך
            ספקים חיצוניים מאובטחים.
          </p>
          <p className="text-xs">
            לתנאי הזמנה וביטולים ראו{" "}
            <Link href="/terms" className="text-brand-red hover:underline">
              תנאי שירות
            </Link>
            . לנגישות האתר ראו{" "}
            <Link href="/accessibility" className="text-brand-red hover:underline">
              הצהרת נגישות
            </Link>
            .
          </p>
        </>
      ),
    },
    {
      id: "collected",
      title: "איזה מידע אנו אוספים",
      content: (
        <ul>
          <li>פרטי קשר שהזנתם בטפסים: שם, טלפון, דוא&quot;ל ומידע על השירות.</li>
          <li>פרטים שמסרתם בעת שליחת הודעת WhatsApp או בקשת שירות.</li>
          <li>מידע טכני בסיסי שנאסף על ידי הדפדפן להבטחת תפקוד האתר.</li>
        </ul>
      ),
    },
    {
      id: "usage",
      title: "לשם מה אנו משתמשים במידע",
      content: (
        <ul>
          <li>להגיב לפניות ולהתקשר אליכם בהקדם.</li>
          <li>לתאם עםכם שירותים, תאריכים והצעות מחיר.</li>
          <li>לשפר את חוויית השימוש באתר ולוודא שהטפסים והקישורים פועלים כראוי.</li>
          <li>לטפל בבקשות נגישות או בקשות פרטיות מיוחדות.</li>
        </ul>
      ),
    },
    {
      id: "payments",
      title: "תשלומים וספקים חיצוניים",
      content: (
        <>
          <p>
            אנו משתמשים בספקי תשלום חיצוניים לאחסון ולעיבוד פרטי כרטיסי אשראי. אנחנו
            לא שומרים פרטי אשראי באתר.
          </p>
          <p>קישורי תשלום ומערכות סליקה כפופים למדיניות הפרטיות של אותם ספקים.</p>
        </>
      ),
    },
    {
      id: "accessibility-data",
      title: "נתונים בקשר לנגישות",
      content: (
        <ul>
          <li>בקשות נגישות עשויות לכלול פרטים מזהים. נשמור אותם אך ורק לצורך מענה לבקשה.</li>
          <li>
            לא נשמור מידע זה מעבר לצורך המתמשך של הטיפול בבקשה, אלא אם נקבל הסכמה
            מפורשת.
          </li>
          <li>ניתן לבקש הסרה של המידע עבור בקשת נגישות בכל זמן באמצעות יצירת קשר.</li>
        </ul>
      ),
    },
    {
      id: "external",
      title: "קישורים וחיצוניים",
      content: (
        <>
          <p>
            האתר מכיל קישורים לאתרים חיצוניים ושירותים של צד שלישי. איננו אחראים
            למדיניות הפרטיות שלהם.
          </p>
          <p>מומלץ לקרוא את מדיניות הפרטיות של ספקים חיצוניים לפני שימוש בשירותים שלהם.</p>
        </>
      ),
    },
    {
      id: "contact",
      title: "איך ליצור קשר",
      content: (
        <>
          <p>נשמח לענות על שאלות פרטיות או לבקשות להסרת מידע.</p>
          <ul>
            <li>
              טלפון / WhatsApp:{" "}
              <a
                href={legalWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-red hover:underline"
              >
                {LEGAL_PHONE_DISPLAY}
              </a>
            </li>
          </ul>
          <p className="text-xs">
            לבקשות נגישות ניתן גם לפנות דרך{" "}
            <a href={accessibilityWhatsAppHref} className="text-brand-red hover:underline">
              וואטסאפ עם נושא נגישות
            </a>
            {" "}או בעמוד{" "}
            <Link href="/accessibility" className="text-brand-red hover:underline">
              הצהרת נגישות
            </Link>
            .
          </p>
        </>
      ),
    },
  ] satisfies LegalSection[],
};
