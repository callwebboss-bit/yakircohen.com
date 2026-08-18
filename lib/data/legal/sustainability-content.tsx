import Link from "next/link";
import {
  accessibilityWhatsAppHref,
  LEGAL_PHONE_DISPLAY,
} from "@/lib/legal-contact";
import type { LegalSection } from "@/components/legal/LegalPageLayout";

export const SUSTAINABILITY_PAGE = {
  title: "הצהרת מדיניות קיימות",
  intro: "אנו פועלים לצמצום שימוש בחומר פיזי ובנסיעות מיותרות דרך מסירה דיגיטלית, עבודה מרחוק והתנהלות ללא נייר.",
  updatedLabel:
    "דף זה עודכן ב-18 באוגוסט 2026. אנו נעדכן את ההצהרה רק כאשר נוסיף בפועל צעדים תפעוליים נוספים.",
  sections: [
    {
      id: "statement",
      title: "מה העמוד הזה",
      content: (
        <>
          <p>
            עמוד זה מסביר אילו צעדים מעשיים אנחנו מיישמים כיום כדי לצמצם חומר פיזי
            ונסיעות מיותרות בעבודה השוטפת.
          </p>
          <p>
            זו הצהרה תפעולית מצומצמת. אנו כותבים כאן רק מה שקיים בפועל בעסק כיום,
            בלי תווי תקן, בלי דירוגים ובלי טענות שלא נמדדו.
          </p>
        </>
      ),
    },
    {
      id: "current-practices",
      title: "מה אנחנו עושים בפועל",
      content: (
        <ul>
          <li>קבצי אודיו, פודקאסט וקול נמסרים דיגיטלית כקבצים, בלי דיסקים ובלי USB.</li>
          <li>חשבוניות, תיאומים והתכתבות עם לקוחות מתבצעים דיגיטלית, בלי נייר ככל הניתן.</li>
          <li>חלק משירותי העריכה, המיקס ותיקון הקול מתבצעים מרחוק, בלי הגעה פיזית לכל פרויקט.</li>
        </ul>
      ),
    },
    {
      id: "scope",
      title: "מה העמוד הזה לא מצהיר",
      content: (
        <ul>
          <li>העמוד אינו מציג תו תקן סביבתי, דירוג ESG או אישור צד שלישי.</li>
          <li>איננו מצהירים כאן על ניטרליות פחמן, אנרגיה ירוקה מאומתת או קיזוז פליטות.</li>
          <li>
            אם נוסיף בעתיד תהליך מדידה, ספק חיצוני או באדג&apos; מאומת - נעדכן את
            ההצהרה בהתאם.
          </li>
        </ul>
      ),
    },
    {
      id: "contact",
      title: "שאלות ופניות",
      content: (
        <>
          <p>
            אם נדרש מסמך מדיניות לצורכי רכש, ספקים או בדיקת תאימות, אפשר לפנות אלינו
            ונשלח את המידע הזמין כיום.
          </p>
          <ul>
            <li>
              WhatsApp / טלפון:{" "}
              <a
                href={accessibilityWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-red hover:underline"
              >
                {LEGAL_PHONE_DISPLAY}
              </a>
            </li>
            <li>
              מידע נוסף:{" "}
              <Link href="/contact" className="text-brand-red hover:underline">
                עמוד צור קשר
              </Link>
            </li>
          </ul>
          <p className="text-xs">
            לנושאי פרטיות ותנאי שימוש ראו{" "}
            <Link href="/privacy" className="text-brand-red hover:underline">
              מדיניות פרטיות
            </Link>{" "}
            ו-{" "}
            <Link href="/terms" className="text-brand-red hover:underline">
              תנאי שירות
            </Link>
            .
          </p>
        </>
      ),
    },
  ] satisfies LegalSection[],
};
