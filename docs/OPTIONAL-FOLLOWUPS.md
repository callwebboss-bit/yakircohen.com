# Optional follow-ups (לא דחוף)

רשימת שיפורים אחרי בדיקת פרודקשן (2026-08-02). **אין באגים קריטיים.** לא ליישם בלי בקשה מפורשת.

## הפרדת עבודה

- חלון Cursor נפרד ל-Yakir (`YakirCohen.com`) וחלון נפרד ל-NeverMind (`NeverMind.co.il`)
- כלל תמידי: `.cursor/rules/yakir-nevermind-separation.mdc` בשורש ה-workspace של Yakir
- אל תפתח multi-root שמערבב את שני הפרויקטים

## ביצועי גלריה (lazy images)

בגלילה מהירה בדף הבית אפשר לראות לרגע ריבועים ריקים לפני שתמונות mid-page נטענות (lazy). האתר עצמו תקין; ה-hero וה-LCP נטענים.

שיפור אפשרי (overlay בלבד):

- להשאיר `priority` רק לתמונת LCP ב-hero
- skeleton / placeholder ברור יותר לכרטיסי גלריה מתחת לקיפול

## ענף lead-flow

הענף `cursor/lead-flow-packages-hold` מחזיק שינויי CRO (lead flow, Hold, portfolio). אחרי merge ל-`main` הפרודקשן יהיה יציב יותר מול Production Branch = `main`. ראה גם [DEPLOY.md](./DEPLOY.md) סעיף אימות Production Branch.

## מותג NeverMind באתר Yakir

להשאיר אזכורים/קישורים חיצוניים (`NEVERMIND_EXTERNAL_URL`) רק בדפי גמגום/אקדמיה הקיימים. לא להרחיב לדף הבית או לדפי DJ/אולפן לא-קשורים.
