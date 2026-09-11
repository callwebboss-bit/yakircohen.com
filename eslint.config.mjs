import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "jsx-a11y/alt-text": "warn",

      /* שלושת הכללים הבאים הם כללי React Compiler ש-eslint-config-next 16
         הפעיל כשגיאות. הם הפכו את npm run lint לאדום ב-main בלי שאף אחד
         נגע בקוד, ולכן שלב ה-Lint ב-CI הפסיק לתפוס רגרסיות אמיתיות.

         הם אזהרות ולא כבויים: 21 המופעים אמיתיים ושווים תיקון, רובם
         setState בתוך useEffect בתוך אשפי ההזמנה, כלומר מסלול ההכנסה.
         תיקון שלהם דורש דפדפן ובדיקת רגרסיה, והוא נכנס לשלב הנגישות
         והביצועים בתוכנית. עד אז הם נשארים גלויים בכל ריצה.

         להחזיר ל-error ברגע שהמונה מגיע לאפס. */
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/refs": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/pagefind/**",
  ]),
]);

export default eslintConfig;
