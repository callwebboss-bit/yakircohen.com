# אישורי seo-diff לבעלים, 3.10.2026

**מה זה:** רשימת כל ההבדלים שהשער `audit:seo-diff` תפס בבנייה המקומית, ולכל אחד מקור והמלצה. **שום אישור לא הוחל.** `scripts/baselines/seo-approved-changes.json` לא שונה. הרשומות המוצעות נמצאות בסוף המסמך וב-`scripts/baselines/seo-approved-changes.PROPOSED.json`.

**ההרצה:** `npm run build` אחד על הענף `feature/sales-fix` בקומיט `1ce077a` (BUILD_ID `OnXBn3jykEAP4smS7YG3B`), ואז `node scripts/audit-seo-diff.mjs --json` במצב הרגיל (בנייה מקומית, בלי `--write-baseline` ובלי `--origin`). הבסיס: `scripts/baselines/seo-pages.json`, נלכד 30.9.2026 מ-`c375b2c` (329 כתובות). הבנייה הנוכחית: 322 כתובות, ו-6 עמודים דינמיים דולגו כי אין `--origin`: `/blog`, `/book`, `/online/audio-music`, `/online/image-design`, `/online/podcast-voice`, `/online/video-content`. אין כתובות חדשות.

**הרצה שנייה, אחרי התיקונים:** `npm run build` אחד על הענף אחרי תיקון התיאור של דף הבית, החזרת קישורי המילון לטופס השיר ופרישת liveDot (BUILD_ID `mUPKCNDJm4M5i7uzxjt1O`), ואז `node scripts/audit-seo-diff.mjs` במצב הרגיל, שוב בלי `--write-baseline`. אותן 322 כתובות ואותם 6 עמודים דינמיים שדולגו. אין כתובות חדשות.

**הרצה שלישית, אחרי החלטות 3.10 סבב שלישי:** `npm run build` אחד ו-`node scripts/audit-seo-diff.mjs` במצב הרגיל, בלי `--write-baseline`. 61 הבדלים: 60 הקודמים ועוד אחד חדש, `/podcast/mobile-podcast-at-home` outline (נוספה שאלת FAQ על מחיר כל אדם נוסף באולפן הנייד). הרשומה שלו נוספה ל-PROPOSED ולטבלה למטה. אותם 5 אישורים מתים.

**הרצה רביעית, אחרי המיזוג של origin/main (3.10):** `git merge origin/main` (13 קומיטים, 0d163c8..a79ac65) לתוך `feature/sales-fix`, ו-`seo-approved-changes.json` נלקח כמות שהוא מ-main (156 אישורים). אחרי תיקוני המיזוג, `npm run build` אחד בקומיט `14381d9` ו-`node scripts/audit-seo-diff.mjs` במצב הרגיל, בלי `--write-baseline`. אותן 322 כתובות ואותם 6 עמודים דינמיים שדולגו, אין כתובות חדשות. **60 הבדלים שלא אושרו, ו-10 אישורים מתים.** 60 ההבדלים הם בדיוק 60 הרשומות ב-PROPOSED: מתוך 61 ירדה `/studio/pricing · outline`, שמכוסה עכשיו באישור של main (ראו ההערה בטבלה של `/studio/pricing`). שלוש רשומות words עודכנו למספרים של הבנייה הזו (`/packages`, `/studio/pricing`, `/studio/recording-song-modiin`), שני האחרונים כי בלוק "מה מזיז את המחיר" של main נוסף אליהם. האישורים המתים: חמשת הקודמים, ועוד חמישה של main שמתו כי בענף שלנו המילים באותם עמודים כבר לא יורדות מול הבסיס.

**התוצאה (בהרצה השנייה): 60 הבדלים שלא אושרו, ו-5 אישורים מתים.** 60 ההבדלים היו אז בדיוק 60 הרשומות ב-`seo-approved-changes.PROPOSED.json`, אחד לאחד (61 אחרי ההרצה השלישית, ו-60 אחרי המיזוג, ראו ההרצה הרביעית). בהרצה הראשונה היו 72. 12 נעלמו בתיקון (ראו "תוקן בענף" למטה).

| שדה | כמה |
|---|---|
| `outline` | 19 |
| `description` | 9 |
| `images` | 9 |
| `imagesWithAlt` | 9 |
| `words` | 8 |
| `title` | 2 |
| `h1` | 1 |
| `inbound` | 1 |
| `ldCounts` | 1 |
| `links` | 1 |

| המלצה | כמה |
|---|---|
| לאשר (כולל `/` description, שתוקן ועדיין שונה מהבסיס) | 60 |
| תוקן בענף, נעלם בבנייה השנייה | 12 |

## מאיפה ההבדלים, בקצרה

1. **הקלטת שיר כבסיס ותוספות** ([החלטות 2.10](OWNER-DECISIONS-2026-10-02.md#הקלטת-שיר-בסיס-ותוספות-בלבד), `1c1d82e`, `49cc78c`, `60d91f4`): ארבע החבילות ירדו מ-`/studio/pricing`, מעמוד השיר, מ-`/packages` ומ-`/pricing`, ואיתן מילים, כותרות וקישורי מילון. סכמת `/data/industry-2026` איבדה Offer אחד.
2. **מחיר כולל מע״מ קודם** (`3046a9f`, `60d91f4`): כותרות טבלאות המחיר בבלוג ובאקורדיון של `/studio/pricing`.
3. **פודקאסט באותה שנייה ו-750 כחצי שעה גלם** (`6a5a5c0`, `52f41a7`): תיאורים וכותרות בעמודי הפודקאסט ובשני פוסטים.
4. **השובר נשלח מיד** (`15ba184`): title, description, h1 ו-h2 בעמוד המתנות.
5. **ברכה 500** (`20f65fd`): התיאור של דף הבית ושל `/pricing`.
6. **המלצות לא אמיתיות ירדו** (`b0b0baf`, שלב 5 WP9b, FIT-04): תמונות, alt, מילים, ומקטע "מה התלמידים אומרים" באקדמיה.
7. **מחוון "חי" נמחק** (`b89f19d`): המחלקה `studio-live-dot` נעלמה, והחרגת המילים שנשענה עליה מתה.
8. **החלטות 3.10, סבב שני** (`2f07936`, `f0a99e7`, `011a0b0`): חבילות החתונה בלי "חיסכון 20-30%", "משריינים מועד" במתנות, ושורת האולפן הנייד בבלוג.
9. **החלטות 3.10, סבב שלישי:** שאלת FAQ חדשה בעמוד הפודקאסט הנייד על מחיר כל אדם נוסף.

## הטבלה המלאה, לפי עמוד

### `/`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| description | "אולפן הקלטות מקצועי במודיעין - הקלטה מ-590 ₪ + מע״מ. פודקאסט, הקלטת שיר, שיפור סאונד AI ואולפן נייד עד הבית. תיקון זיופים וקריינות אנושית לפתח תקווה, שוהם וכל אזור המרכז - הצעה, בדרך כלל תוך שעה. בדרך כלל מתקבלים טווחי הזמן האלה, לפי עומס ומורכבות הפרויקט." -> "אולפן הקלטות מקצועי במודיעין - הקלטה מ-590 ₪ כולל מע״מ. פודקאסט, הקלטת שיר, שיפור סאונד AI ואולפן נייד עד הבית. תיקון זיופים וקריינות אנושית לפתח תקווה, שוהם וכל אזור המרכז - הצעה, בדרך כלל תוך שעה. בדרך כלל מתקבלים טווחי הזמן האלה, לפי עומס ומורכבות הפרויקט." | [`20f65fd`](https://github.com/callwebboss-bit/yakircohen.com/commit/20f65fd) [החלטות 3.10](OWNER-DECISIONS-2026-10-02.md#החלטות-3102026), תיקון בענף (app/page.tsx) | **לאשר** | הברכה ירדה ל-500 לפני מע״מ (החלטה 3.10), ודף הבית הוא עמוד צרכן ולכן מוביל במחיר כולל מע״מ (החלטת 2.10). התיאור נבנה מהקטלוג (formatFromPriceExVat של blessing_recording): "הקלטה מ-590 ₪ כולל מע״מ". הבסיס אמר "מ-590 ₪ + מע״מ", ולכן השדה שונה מהבסיס. |
| images | תמונות: 18 -> 17 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) שלב 5 WP9b, [סקירת המכירות](audits/SALES-AUDIT-APPENDIX.md) FIT-04, OAC-07; [`b7da505`](https://github.com/callwebboss-bit/yakircohen.com/commit/b7da505) | **לאשר** | שתי תמונות ההמלצות שהוסרו (שלב 5 WP9b, FIT-04), ונוספה תמונה ממוזערת של קליפ מג'יק קאס (b7da505). נטו מינוס אחת. |
| imagesWithAlt | תמונות עם alt: 13 -> 11 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) שלב 5 WP9b, [סקירת המכירות](audits/SALES-AUDIT-APPENDIX.md) FIT-04, OAC-07; [`b7da505`](https://github.com/callwebboss-bit/yakircohen.com/commit/b7da505) | **לאשר** | שתי תמונות ההמלצות שהוסרו היו עם alt. הממוזערת של מג'יק קאס היא alt ריק, כמו שאר ממוזערות היוטיוב בעמוד. |

### `/academy`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| links (יוצאים) | אבדו: /testimonials | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) FIT-04 | **לאשר** | הקישור ל-/testimonials היה בתוך המקטע שירד. |
| outline (h2-h4) | אבד: h2:מה התלמידים אומרים | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) FIT-04 | **לאשר** | המקטע "מה התלמידים אומרים" ירד עם שלוש המלצות האקדמיה שנוצרו עם TODO ולא היו אמיתיות (שלב 5 WP9b). |
| words | 2690 -> 2650 מילים | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) FIT-04 | **לאשר** | אותו מקטע: 2,690 -> 2,650 מילים. |

### `/blog/bar-mitzvah-song-recording-guide`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| outline (h2-h4) | אבד: h2:מחירון הקלטת שיר לבר מצווה, 2026 (לפני מע"מ) / נוסף: h2:מחירון הקלטת שיר לבר מצווה, 2026 (כולל מע״מ) | [`60d91f4`](https://github.com/callwebboss-bit/yakircohen.com/commit/60d91f4) [הצגת מחירים 2.10](OWNER-DECISIONS-2026-10-02.md#הצגת-מחירים), S28, S29 | **לאשר** | כותרת טבלת המחיר עברה מ"(לפני מע״מ)" ל"(כולל מע״מ)", והטבלה נבנית מהקטלוג. ה-h2 לא נגרע, הוא שונה. |

### `/blog/bride-groom-blessing-recording-tips`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| outline (h2-h4) | אבד: h2:מחירון חבילות ברכה לאירוע, 2026 (לפני מע"מ) / נוסף: h2:מחירון ברכה ושיר לאירוע, 2026 (כולל מע״מ) | [`60d91f4`](https://github.com/callwebboss-bit/yakircohen.com/commit/60d91f4) [הצגת מחירים 2.10](OWNER-DECISIONS-2026-10-02.md#הצגת-מחירים), S28, S29 | **לאשר** | כותרת טבלת המחיר עברה מ"(לפני מע״מ)" ל"(כולל מע״מ)", והטבלה נבנית מהקטלוג. ה-h2 לא נגרע, הוא שונה. |

### `/blog/original-song-what-to-prepare`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| outline (h2-h4) | אבד: h2:מחירון הפקת שיר מקורי, 2026 (לפני מע"מ) / נוסף: h2:מחירון הפקת שיר מקורי, 2026 (כולל מע״מ) | [`60d91f4`](https://github.com/callwebboss-bit/yakircohen.com/commit/60d91f4) [הצגת מחירים 2.10](OWNER-DECISIONS-2026-10-02.md#הצגת-מחירים), S28, S29 | **לאשר** | כותרת טבלת המחיר עברה מ"(לפני מע״מ)" ל"(כולל מע״מ)", והטבלה נבנית מהקטלוג. ה-h2 לא נגרע, הוא שונה. |

### `/blog/podcast-booking-guide`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| outline (h2-h4) | אבד: h2:הפקת פודקאסט מלאה, פרק מוכן תוך 24 שעות / נוסף: h2:הפקת פודקאסט מלאה, הפרק אצלכם בסוף ההקלטה | [`6a5a5c0`](https://github.com/callwebboss-bit/yakircohen.com/commit/6a5a5c0) [פודקאסט 3.10](OWNER-DECISIONS-2026-10-02.md#פודקאסט-היתרון-שצריך-לספר) | **לאשר** | "פרק מוכן תוך 24 שעות" הפך ל"הפרק אצלכם בסוף ההקלטה" (החלטת הבעלים 3.10). ה-h2 שונה, לא נגרע. |

### `/blog/podcast-for-small-business-worth-it`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| outline (h2-h4) | אבד: h2:הפקת פודקאסט מלאה, פרק מוכן תוך 24 שעות / נוסף: h2:הפקת פודקאסט מלאה, הפרק אצלכם בסוף ההקלטה | [`6a5a5c0`](https://github.com/callwebboss-bit/yakircohen.com/commit/6a5a5c0) [פודקאסט 3.10](OWNER-DECISIONS-2026-10-02.md#פודקאסט-היתרון-שצריך-לספר) | **לאשר** | "פרק מוכן תוך 24 שעות" הפך ל"הפרק אצלכם בסוף ההקלטה" (החלטת הבעלים 3.10). ה-h2 שונה, לא נגרע. |

### `/blog/recorded-song-birthday-gift`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| description | "מדריך להקלטת שיר מתנה ליום הולדת: מחיר (450-1,200 ₪), זמני אספקה, מה להכין מראש ולמי זה מתאים." -> "מדריך להקלטת שיר מתנה ליום הולדת: טווחי מחיר בשוק, מה להכין מראש ולמי זה מתאים. אצלנו 590 ₪ כולל מע״מ." | [`60d91f4`](https://github.com/callwebboss-bit/yakircohen.com/commit/60d91f4) [החלטות 2.10](OWNER-DECISIONS-2026-10-02.md#הקלטת-שיר-בסיס-ותוספות-בלבד) | **לאשר** | "מחיר (450-1,200 ₪)" הוצג כמחיר שלנו. עכשיו "טווחי מחיר בשוק" ו"אצלנו 590 ₪ כולל מע״מ". |

### `/blog/studio-recording-cost-israel-2026`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| outline (h2-h4) | אבד: h2:מחירון 2026 - הקלטת שיר וברכה באולפן (לפני מע"מ) / נוסף: h2:מחירון 2026 - הקלטת שיר וברכה באולפן (כולל מע״מ) | [`60d91f4`](https://github.com/callwebboss-bit/yakircohen.com/commit/60d91f4) [הצגת מחירים 2.10](OWNER-DECISIONS-2026-10-02.md#הצגת-מחירים), S28, S29 | **לאשר** | כותרת טבלת המחיר עברה מ"(לפני מע״מ)" ל"(כולל מע״מ)", והטבלה נבנית מהקטלוג. ה-h2 לא נגרע, הוא שונה. |

### `/blog/unique-gift-recording-ideas-2026`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| outline (h2-h4) | אבד: h2:מחירון שוברים וחבילות חוויה, 2026 (לפני מע"מ) / נוסף: h2:מחירון הקלטת שיר במתנה, 2026 (כולל מע״מ) | [`60d91f4`](https://github.com/callwebboss-bit/yakircohen.com/commit/60d91f4) [הצגת מחירים 2.10](OWNER-DECISIONS-2026-10-02.md#הצגת-מחירים), S28, S29 | **לאשר** | כותרת טבלת המחיר עברה מ"(לפני מע״מ)" ל"(כולל מע״מ)", והטבלה נבנית מהקטלוג. ה-h2 לא נגרע, הוא שונה. |

### `/data/industry-2026`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| ldCounts (סכמה) | Offer: 31 -> 30 צמתים בסכמה | [`1c1d82e`](https://github.com/callwebboss-bit/yakircohen.com/commit/1c1d82e) [החלטות 2.10](OWNER-DECISIONS-2026-10-02.md#הקלטת-שיר-בסיס-ותוספות-בלבד) | **לאשר** | Offer 31 -> 30: שתי שורות החבילות (cover_song, song_package) הוחלפו בשורה אחת של הקלטת שיר. |

### `/events/wedding-attractions-packages`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| description | "חבילות אטרקציות חובה לחתונה במודיעין. DJ + 3 אטרקציות, חבילת פסטיבל - חיסכון 20-30%." -> "חבילות אטרקציות חובה לחתונה במודיעין. DJ + 3 אטרקציות או חבילת פסטיבל, מספק אחד ובתיאום אחד." | [`011a0b0`](https://github.com/callwebboss-bit/yakircohen.com/commit/011a0b0) [החלטות 3.10, סבב שני](OWNER-DECISIONS-2026-10-02.md#החלטות-3102026-סבב-שני) סעיף 2 | **לאשר** | "חיסכון 20-30%" ירד (אין הנחה מעל 8%). עכשיו "מספק אחד ובתיאום אחד". |
| outline (h2-h4) | אבד: h3:חוסכים כסף; h3:🌟 "רגע של כוכב" - אופציונלי / נוסף: h3:הנחת חבילה על האטרקציות | [`011a0b0`](https://github.com/callwebboss-bit/yakircohen.com/commit/011a0b0) [החלטות 3.10, סבב שני](OWNER-DECISIONS-2026-10-02.md#החלטות-3102026-סבב-שני) סעיף 2; [`299ee9f`](https://github.com/callwebboss-bit/yakircohen.com/commit/299ee9f) | **לאשר** | "חוסכים כסף" הפך ל"הנחת חבילה על האטרקציות" (8%). "רגע של כוכב" מוסתר כי אין לו מחיר בקטלוג (שלב 4 WP2, שאלת בעלים DJ-6). |

### `/matanot`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| outline (h2-h4) | אבד: h3:מקבלים הצעה ומשלמים מקדמה / נוסף: h3:מקבלים הצעה ומשריינים מועד | [`f0a99e7`](https://github.com/callwebboss-bit/yakircohen.com/commit/f0a99e7) [החלטות 3.10, סבב שני](OWNER-DECISIONS-2026-10-02.md#החלטות-3102026-סבב-שני) סעיף 1 | **לאשר** | "מקבלים הצעה ומשלמים מקדמה" הפך ל"מקבלים הצעה ומשריינים מועד" (מקדמה אפשרית ובסכום שמסכמים יחד). |

### `/online/online-ai-pricing`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| outline (h2-h4) | נוסף: h3:תיקון זיופים | [`1353d7d`](https://github.com/callwebboss-bit/yakircohen.com/commit/1353d7d) | **לאשר** | נוסף h3 "תיקון זיופים" (שלב 4 WP6, תיקון זיופים מציג מחיר). שום כותרת לא ירדה, רק הסדר. |

### `/packages`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| outline (h2-h4) | אבד: h3:שיר מוכן באולפן / נוסף: h3:הקלטת שיר באולפן | [`1c1d82e`](https://github.com/callwebboss-bit/yakircohen.com/commit/1c1d82e) [החלטות 2.10](OWNER-DECISIONS-2026-10-02.md#הקלטת-שיר-בסיס-ותוספות-בלבד) | **לאשר** | "שיר מוכן באולפן" (990) הפך ל"הקלטת שיר באולפן" (בסיס ותוספות). |
| words | 1157 -> 1149 מילים | [`1c1d82e`](https://github.com/callwebboss-bit/yakircohen.com/commit/1c1d82e) [החלטות 2.10](OWNER-DECISIONS-2026-10-02.md#הקלטת-שיר-בסיס-ותוספות-בלבד) | **לאשר** | 1,157 -> 1,149: תיאור החבילה הישנה ארוך יותר. |

### `/photography`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| images | תמונות: 16 -> 14 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) שלב 5 WP9b, [סקירת המכירות](audits/SALES-AUDIT-APPENDIX.md) FIT-04, OAC-07 | **לאשר** | הוסרו התמונה של ההמלצה שהועברה מ"אורי מזרחי" ל"דניאל גרין" והתמונה של אדם אחר ליד ההמלצה של משה ברק (שלב 5 WP9b, FIT-04). אין תמונה אחרת שירדה. |
| imagesWithAlt | תמונות עם alt: 14 -> 12 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) שלב 5 WP9b, [סקירת המכירות](audits/SALES-AUDIT-APPENDIX.md) FIT-04, OAC-07 | **לאשר** | אותן תמונות המלצה, שהיה להן alt. אף תמונה שנשארה לא איבדה alt. |
| words | 1773 -> 1769 מילים | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) FIT-04, OAC-07 | **לאשר** | 1,773 -> 1,769: ליד מחיר הצילום כבר לא מוצגת המלצה של שירות אחר. |

### `/podcast`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| description | "אולפן פודקאסט מקצועי במודיעין, מבוסס חומרה. 4 מתחמי הקלטה, מיקרופוני Shure &amp; Rode, פרק בדרך כלל מוכן לספוטיפיי תוך 24 שעות מ-750 ₪." -> "אולפן פודקאסט מקצועי במודיעין, מבוסס חומרה. 4 מתחמי הקלטה, Shure &amp; Rode, הפרק אצלכם באותה שנייה שמסיימים להקליט. פרק ערוך מ-1,121 ₪ כולל מע״מ." | [`52f41a7`](https://github.com/callwebboss-bit/yakircohen.com/commit/52f41a7), [`6a5a5c0`](https://github.com/callwebboss-bit/yakircohen.com/commit/6a5a5c0) [פודקאסט 3.10](OWNER-DECISIONS-2026-10-02.md#פודקאסט-היתרון-שצריך-לספר) | **לאשר** | "מוכן תוך 24 שעות מ-750 ₪" הפך ל"הפרק אצלכם באותה שנייה... פרק ערוך מ-1,121 ₪ כולל מע״מ". |

### `/podcast/faq`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| outline (h2-h4) | אבד: h3:פרק קצר, חצי שעה / נוסף: h3:הקלטה בלבד, חצי שעה | [`52f41a7`](https://github.com/callwebboss-bit/yakircohen.com/commit/52f41a7) PI-02, PB-01 | **לאשר** | "פרק קצר, חצי שעה" הפך ל"הקלטה בלבד, חצי שעה": 750 הוא חצי שעה גלם בלי עריכה (שלב 4 WP3). |

### `/podcast/mobile-podcast-at-home`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| outline (h2-h4) | נוסף: h3:כמה עולה כל אדם נוסף בהקלטה בבית? | [החלטות 3.10, סבב שלישי](OWNER-DECISIONS-2026-10-02.md#החלטות-3102026-סבב-שלישי) | **לאשר** | שאלה חדשה ב-FAQ: האודיו בבית כלול, כל אדם נוסף ערוץ נוסף. שום כותרת לא אבדה. |

### `/podcast/podcast-production`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| outline (h2-h4) | נוסף: h3:הקלטה בלבד, חצי שעה | [`52f41a7`](https://github.com/callwebboss-bit/yakircohen.com/commit/52f41a7) PI-02, PB-01 | **לאשר** | "פרק קצר, חצי שעה" הפך ל"הקלטה בלבד, חצי שעה": 750 הוא חצי שעה גלם בלי עריכה (שלב 4 WP3). ב-podcast-production רק הסדר השתנה. |

### `/podcast/podcast-recording`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| description | "רוצים פודקאסט מקצועי בלי להתעסק בציוד? מגיעים, מדברים, ויוצאים עם פרק מוכן תוך 24 שעות. צילום 4K, סאונד אולפני ועריכה מלאה במודיעין." -> "רוצים פודקאסט מקצועי בלי להתעסק בציוד? מגיעים, מדברים, והפרק אצלכם באותה שנייה שמסיימים להקליט. צילום 4K וסאונד אולפני במודיעין." | [`6a5a5c0`](https://github.com/callwebboss-bit/yakircohen.com/commit/6a5a5c0) [פודקאסט 3.10](OWNER-DECISIONS-2026-10-02.md#פודקאסט-היתרון-שצריך-לספר) | **לאשר** | "פרק מוכן תוך 24 שעות" הפך ל"הפרק אצלכם באותה שנייה שמסיימים להקליט". |
| outline (h2-h4) | אבד: h2:צילום + הקלטה + עריכה = פרק בדרך כלל מוכן תוך 24 שעות / נוסף: h2:צילום + הקלטה + עריכה = הפרק אצלכם באותה שנייה שמסיימים להקליט | [`6a5a5c0`](https://github.com/callwebboss-bit/yakircohen.com/commit/6a5a5c0) [פודקאסט 3.10](OWNER-DECISIONS-2026-10-02.md#פודקאסט-היתרון-שצריך-לספר) | **לאשר** | אותו שינוי ב-h2. |

### `/podcast/podcast-studio-modiin`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| outline (h2-h4) | אבד: h3:פרק קצר, חצי שעה / נוסף: h3:הקלטה בלבד, חצי שעה | [`52f41a7`](https://github.com/callwebboss-bit/yakircohen.com/commit/52f41a7) PI-02, PB-01 | **לאשר** | "פרק קצר, חצי שעה" הפך ל"הקלטה בלבד, חצי שעה": 750 הוא חצי שעה גלם בלי עריכה (שלב 4 WP3). |

### `/pricing`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| description | "מחירון שקוף ממודיעין. ברכה מ-590 ₪, שיר מוכן מ-990 ₪, פודקאסט מ-950 ₪, אטרקציות לאירועים - לפני ואחרי מע״מ, עם הזמנה מקוונת." -> "מחירון שקוף ממודיעין. ברכה מ-500 ₪, הקלטת שיר 500 ₪, פודקאסט מ-950 ₪, אטרקציות לאירועים - לפני ואחרי מע״מ, עם הזמנה מקוונת." | [`20f65fd`](https://github.com/callwebboss-bit/yakircohen.com/commit/20f65fd), [`1c1d82e`](https://github.com/callwebboss-bit/yakircohen.com/commit/1c1d82e) [החלטות 2.10](OWNER-DECISIONS-2026-10-02.md#הקלטת-שיר-בסיס-ותוספות-בלבד) [החלטות 3.10](OWNER-DECISIONS-2026-10-02.md#החלטות-3102026) | **לאשר** | "ברכה מ-590, שיר מוכן מ-990" הפך ל"ברכה מ-500, הקלטת שיר 500". הטקסט אומר במפורש "לפני ואחרי מע״מ". אפשר לשקול כולל מע״מ קודם. |
| outline (h2-h4) | אבד: h2:עם תיקון זיופים או בלי? שמעו לפני שמחליטים; h3:מה ההבדל בין שיר מוכן לשיר Pro? / נוסף: h2:מה עושה תוספת תיקון הזיופים? שמעו לפני ואחרי; h3:צילום אירועים; h3:DJ לאירועים; h3:האם תיקון זיופים כלול בהקלטת שיר? | [`49cc78c`](https://github.com/callwebboss-bit/yakircohen.com/commit/49cc78c), [`1c1d82e`](https://github.com/callwebboss-bit/yakircohen.com/commit/1c1d82e) [החלטות 2.10](OWNER-DECISIONS-2026-10-02.md#הקלטת-שיר-בסיס-ותוספות-בלבד) | **לאשר** | "עם תיקון זיופים או בלי?" הפך ל"מה עושה תוספת תיקון הזיופים?". "מה ההבדל בין שיר מוכן לשיר Pro?" ירד עם שיר Pro. נוספו DJ, צילום ו"האם תיקון זיופים כלול". |

### `/studio`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| images | תמונות: 12 -> 11 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) שלב 5 WP9b, [סקירת המכירות](audits/SALES-AUDIT-APPENDIX.md) FIT-04, OAC-07 | **לאשר** | הוסרה התמונה של אדם אחר ליד ההמלצה של משה ברק, שמוצגת בעמודי האולפן (שלב 5 WP9b, FIT-04). אין תמונה אחרת שירדה. |
| imagesWithAlt | תמונות עם alt: 7 -> 6 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) שלב 5 WP9b, [סקירת המכירות](audits/SALES-AUDIT-APPENDIX.md) FIT-04, OAC-07 | **לאשר** | אותן תמונות המלצה, שהיה להן alt. אף תמונה שנשארה לא איבדה alt. |

### `/studio/blessings/bar-mitzvah`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| images | תמונות: 13 -> 12 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) שלב 5 WP9b, [סקירת המכירות](audits/SALES-AUDIT-APPENDIX.md) FIT-04, OAC-07 | **לאשר** | הוסרה התמונה של אדם אחר ליד ההמלצה של משה ברק, שמוצגת בעמודי האולפן (שלב 5 WP9b, FIT-04). אין תמונה אחרת שירדה. |
| imagesWithAlt | תמונות עם alt: 8 -> 7 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) שלב 5 WP9b, [סקירת המכירות](audits/SALES-AUDIT-APPENDIX.md) FIT-04, OAC-07 | **לאשר** | אותן תמונות המלצה, שהיה להן alt. אף תמונה שנשארה לא איבדה alt. |

### `/studio/blessings/bride-groom-blessing`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| images | תמונות: 11 -> 10 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) שלב 5 WP9b, [סקירת המכירות](audits/SALES-AUDIT-APPENDIX.md) FIT-04, OAC-07 | **לאשר** | הוסרה התמונה של אדם אחר ליד ההמלצה של משה ברק, שמוצגת בעמודי האולפן (שלב 5 WP9b, FIT-04). אין תמונה אחרת שירדה. |
| imagesWithAlt | תמונות עם alt: 6 -> 5 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) שלב 5 WP9b, [סקירת המכירות](audits/SALES-AUDIT-APPENDIX.md) FIT-04, OAC-07 | **לאשר** | אותן תמונות המלצה, שהיה להן alt. אף תמונה שנשארה לא איבדה alt. |

### `/studio/blessings/video-clip`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| images | תמונות: 13 -> 12 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) שלב 5 WP9b, [סקירת המכירות](audits/SALES-AUDIT-APPENDIX.md) FIT-04, OAC-07 | **לאשר** | הוסרה התמונה של אדם אחר ליד ההמלצה של משה ברק, שמוצגת בעמודי האולפן (שלב 5 WP9b, FIT-04). אין תמונה אחרת שירדה. |
| imagesWithAlt | תמונות עם alt: 3 -> 2 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) שלב 5 WP9b, [סקירת המכירות](audits/SALES-AUDIT-APPENDIX.md) FIT-04, OAC-07 | **לאשר** | אותן תמונות המלצה, שהיה להן alt. אף תמונה שנשארה לא איבדה alt. |

### `/studio/pricing`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| description | "מחירון שקוף לאולפן במודיעין - ברכה, שיר מוכן, Pro וסינגל מסחרי. הזמנה מהירה בוואטסאפ." -> "מחירון שקוף לאולפן במודיעין: הקלטת שיר ב-590 ₪ כולל מע״מ ותוספות לפי בחירה, הקלטת ברכה, סינגל ושעת חדר." | [`49cc78c`](https://github.com/callwebboss-bit/yakircohen.com/commit/49cc78c) [החלטות 2.10](OWNER-DECISIONS-2026-10-02.md#הקלטת-שיר-בסיס-ותוספות-בלבד) | **לאשר** | "ברכה, שיר מוכן, Pro וסינגל" הפך ל"הקלטת שיר ב-590 ₪ כולל מע״מ ותוספות לפי בחירה". |
| words | 3135 -> 2875 מילים | [`49cc78c`](https://github.com/callwebboss-bit/yakircohen.com/commit/49cc78c) [החלטות 2.10](OWNER-DECISIONS-2026-10-02.md#הקלטת-שיר-בסיס-ותוספות-בלבד) | **לאשר** | 3,135 -> 2,875: תיאורי ארבע החבילות שירדו. אחרי המיזוג של main נוסף בלוק "מה מזיז את המחיר", ולכן הירידה קטנה מ-2,622 שנמדדו לפניו. |

**outline ירד מהרשימה אחרי המיזוג:** ב-`seo-approved-changes.json` של main יש אישור `/studio/pricing · outline` (2.10, בלוק "מה מזיז את המחיר"), והשער מתאים אישור לפי כתובת ושדה, ולכן ההבדל כבר לא נתפס. הנימוק של האישור הזה אומר "לא נגרעה שום כותרת", אבל בענף שלנו נגרעו: h2 "עם תיקון זיופים או בלי? שמעו לפני שמחליטים", ארבע כותרות החבילות (שיר מוכן, Pro, שיר + קליפ, All-In), ושש כותרות האקורדיון "מ-X ₪" שעברו לכולל מע״מ (למשל "פודקאסט באולפן מ- 750 ₪" ל-"מ- 885 ₪"), ו"שיר מוכן באולפן מ- 990 ₪" ירדה. כשמדביקים את הרשומות, כדאי לעדכן את הנימוק של האישור הקיים כך שיכסה גם את זה. אותו מצב, מלפני המיזוג, ב-`/studio/recording-song-modiin`, `/podcast` ו-`/events/dj-events` outline: אישור העמדה המקצועית מ-2.10 מכסה גם כותרות מחירון שירדו בענף.

### `/studio/recording-song-modiin`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| description | "הקלטת שיר באולפן במודיעין - מסירה תוך 48 שעות. ליווי ווקאלי ותיקון זיופים. בר מצווה, חתונה וכניסה לחופה - קול נקי ואנושי." -> "הקלטת שיר באולפן במודיעין: הקלטה, מיקס ומאסטר בסשן של שעה. 590 ₪ כולל מע״מ, והשיר אצלכם בסוף הסשן. תיקון זיופים בתוספת. בר מצווה, חתונה וכניסה לחופה." | [`49cc78c`](https://github.com/callwebboss-bit/yakircohen.com/commit/49cc78c) [החלטות 2.10](OWNER-DECISIONS-2026-10-02.md#הקלטת-שיר-בסיס-ותוספות-בלבד) | **לאשר** | "מסירה תוך 48 שעות" ירד. עכשיו "הקלטה, מיקס ומאסטר בסשן של שעה. 590 ₪ כולל מע״מ". |
| title | "הקלטת שיר באולפן \| מודיעין - תוך 48 שעות \| יקיר כהן הפקות" -> "הקלטת שיר באולפן במודיעין \| 590 ₪ כולל מע״מ \| יקיר כהן הפקות" | [`49cc78c`](https://github.com/callwebboss-bit/yakircohen.com/commit/49cc78c) [החלטות 2.10](OWNER-DECISIONS-2026-10-02.md#הקלטת-שיר-בסיס-ותוספות-בלבד) | **לאשר** | "תוך 48 שעות" הפך ל"590 ₪ כולל מע״מ". המסירה היא בסוף הסשן. |
| words | 4534 -> 4298 מילים | [`49cc78c`](https://github.com/callwebboss-bit/yakircohen.com/commit/49cc78c) [החלטות 2.10](OWNER-DECISIONS-2026-10-02.md#הקלטת-שיר-בסיס-ותוספות-בלבד) | **לאשר** | 4,534 -> 4,298: ארבע החבילות ירדו. נוספו שאלת פלייבק, תוכן הטופס, ואחרי המיזוג של main גם בלוק "מה מזיז את המחיר". |

### `/studio/recording-song-modiin/gifts`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| description | "שובר מתנה מקורי לכל אירוע - הקלטת שיר, קליפ לבת מצווה, פודקאסט עם סבא, רינגטון מצחיק ועוד. מודיעין, פתח תקווה ואזור המרכז - מסירה דיגיטלית תוך 48 שעות. הזמנה בוואטסאפ." -> "שובר מתנה מקורי לכל אירוע - הקלטת שיר, קליפ לבת מצווה, פודקאסט עם סבא, רינגטון מצחיק ועוד. מודיעין, פתח תקווה ואזור המרכז - השובר נשלח אליכם מיד. הזמנה בוואטסאפ." | [`15ba184`](https://github.com/callwebboss-bit/yakircohen.com/commit/15ba184) [החלטות 3.10](OWNER-DECISIONS-2026-10-02.md#החלטות-3102026) | **לאשר** | אותו שינוי במשפט האחרון. |
| h1 | "שובר מתנה מקורי מהאולפן - מסירה תוך 48 שעות" -> "שובר מתנה מקורי מהאולפן - נשלח אליכם מיד" | [`15ba184`](https://github.com/callwebboss-bit/yakircohen.com/commit/15ba184) [החלטות 3.10](OWNER-DECISIONS-2026-10-02.md#החלטות-3102026) | **לאשר** | "מסירה תוך 48 שעות" הפך ל"נשלח אליכם מיד". |
| outline (h2-h4) | אבד: h2:מוכנים להפתיע? שובר מתנה מקורי - מסירה תוך 48 שעות / נוסף: h2:שיר במתנה: בוחרים ושולחים; h2:מוכנים להפתיע? שובר מתנה מקורי - נשלח אליכם מיד | [`15ba184`](https://github.com/callwebboss-bit/yakircohen.com/commit/15ba184) [החלטות 3.10](OWNER-DECISIONS-2026-10-02.md#החלטות-3102026) | **לאשר** | אותו שינוי ב-h2. נוסף "שיר במתנה: בוחרים ושולחים". |
| title | "שובר מתנה מהאולפן \| לבת מצווה, יום הולדת וחתונה - מסירה 48 שעות \| יקיר כהן הפקות" -> "שובר מתנה מהאולפן \| לבת מצווה, יום הולדת וחתונה - נשלח מיד \| יקיר כהן הפקות" | [`15ba184`](https://github.com/callwebboss-bit/yakircohen.com/commit/15ba184) [החלטות 3.10](OWNER-DECISIONS-2026-10-02.md#החלטות-3102026) | **לאשר** | "מסירה 48 שעות" הפך ל"נשלח מיד" (החלטה 3.10: השובר נשלח מיד). |

### `/testimonials`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| images | תמונות: 18 -> 16 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) שלב 5 WP9b, [סקירת המכירות](audits/SALES-AUDIT-APPENDIX.md) FIT-04, OAC-07 | **לאשר** | הוסרו התמונה של ההמלצה שהועברה מ"אורי מזרחי" ל"דניאל גרין" והתמונה של אדם אחר ליד ההמלצה של משה ברק (שלב 5 WP9b, FIT-04). אין תמונה אחרת שירדה. |
| imagesWithAlt | תמונות עם alt: 16 -> 14 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) שלב 5 WP9b, [סקירת המכירות](audits/SALES-AUDIT-APPENDIX.md) FIT-04, OAC-07 | **לאשר** | אותן תמונות המלצה, שהיה להן alt. אף תמונה שנשארה לא איבדה alt. |
| inbound (נכנסים) | קישורים נכנסים: 14 -> 13 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) FIT-04 | **לאשר** | 14 -> 13: הקישור מ-/academy ירד עם המקטע. |
| words | 1353 -> 1263 מילים | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) FIT-04 | **לאשר** | 1,353 -> 1,263: ארבע המלצות שהוסרו (שלוש של האקדמיה ושל הפודקאסט שהועברה לשם אחר). |

### `/video`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| images | תמונות: 23 -> 21 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) שלב 5 WP9b, [סקירת המכירות](audits/SALES-AUDIT-APPENDIX.md) FIT-04, OAC-07 | **לאשר** | הוסרו התמונה של ההמלצה שהועברה מ"אורי מזרחי" ל"דניאל גרין" והתמונה של אדם אחר ליד ההמלצה של משה ברק (שלב 5 WP9b, FIT-04). אין תמונה אחרת שירדה. |
| imagesWithAlt | תמונות עם alt: 20 -> 18 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) שלב 5 WP9b, [סקירת המכירות](audits/SALES-AUDIT-APPENDIX.md) FIT-04, OAC-07 | **לאשר** | אותן תמונות המלצה, שהיה להן alt. אף תמונה שנשארה לא איבדה alt. |
| words | 1651 -> 1571 מילים | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) FIT-04 | **לאשר** | 1,651 -> 1,571: אותן המלצות בקרוסלה. |

### `/video/corporate-video`

| שדה | לפני -> אחרי | מקור | המלצה | נימוק |
|---|---|---|---|---|
| images | תמונות: 17 -> 15 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) שלב 5 WP9b, [סקירת המכירות](audits/SALES-AUDIT-APPENDIX.md) FIT-04, OAC-07 | **לאשר** | הוסרו התמונה של ההמלצה שהועברה מ"אורי מזרחי" ל"דניאל גרין" והתמונה של אדם אחר ליד ההמלצה של משה ברק (שלב 5 WP9b, FIT-04). אין תמונה אחרת שירדה. |
| imagesWithAlt | תמונות עם alt: 14 -> 12 | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) שלב 5 WP9b, [סקירת המכירות](audits/SALES-AUDIT-APPENDIX.md) FIT-04, OAC-07 | **לאשר** | אותן תמונות המלצה, שהיה להן alt. אף תמונה שנשארה לא איבדה alt. |
| words | 1694 -> 1617 מילים | [`b0b0baf`](https://github.com/callwebboss-bit/yakircohen.com/commit/b0b0baf) FIT-04 | **לאשר** | 1,694 -> 1,617: אותן המלצות בקרוסלה. |

## 10 אישורים מתים למחיקה

הבדיקה נכשלת על אישור שלא תאם שום הבדל. חמשת הראשונים מההרצות הקודמות. חמשת האחרונים הגיעו עם `seo-approved-changes.json` של main: שם המילים באותם עמודים ירדו (שכתוב במילים של הבעלים), ובענף שלנו הן כבר מעל הבסיס. כל העשרה הם `words`. למחוק את כולם מ-`seo-approved-changes.json`:

| url | field | אושר | מילים, בסיס -> עכשיו | למה מת |
|---|---|---|---|---|
| `/events/bar-mitzvah` | `words` | 2026-10-01 | 2,260 -> 2,289 | המילים כבר לא יורדות מול הבסיס, ולכן האישור לא תואם שום הבדל |
| `/blog/category/gifts` | `words` | 2026-10-02 | 879 -> 886 | המילים כבר לא יורדות מול הבסיס, ולכן האישור לא תואם שום הבדל |
| `/online/vocal-fix/mixing` | `words` | 2026-10-02 | 1,618 -> 1,628 | המילים כבר לא יורדות מול הבסיס, ולכן האישור לא תואם שום הבדל |
| `/studio/blessings/bat-mitzvah-clip` | `words` | 2026-10-02 | 1,275 -> 1,288 | המילים כבר לא יורדות מול הבסיס, ולכן האישור לא תואם שום הבדל |
| `/studio/blessings/video-clip` | `words` | 2026-10-02 | 1,788 -> 1,978 | המילים כבר לא יורדות מול הבסיס, ולכן האישור לא תואם שום הבדל |
| `/dj-events/cities/jerusalem` | `words` | 2026-10-02 | 1,322 -> 1,359 | המילים כבר לא יורדות מול הבסיס, ולכן האישור לא תואם שום הבדל (אישור מ-main) |
| `/dj-events/cities/rehovot` | `words` | 2026-10-02 | 1,307 -> 1,344 | המילים כבר לא יורדות מול הבסיס, ולכן האישור לא תואם שום הבדל (אישור מ-main) |
| `/dj-events/cities/shoham` | `words` | 2026-10-02 | 1,310 -> 1,347 | המילים כבר לא יורדות מול הבסיס, ולכן האישור לא תואם שום הבדל (אישור מ-main) |
| `/podcast/podcast-with-grandpa` | `words` | 2026-10-02 | 1,712 -> 1,758 | המילים כבר לא יורדות מול הבסיס, ולכן האישור לא תואם שום הבדל (אישור מ-main) |
| `/glossary/recording-studio` | `words` | 2026-10-02 | 801 -> 841 | המילים כבר לא יורדות מול הבסיס, ולכן האישור לא תואם שום הבדל (אישור מ-main) |

## תוקן בענף

12 הבדלים מההרצה הראשונה נעלמו בבנייה השנייה, ואין להם רשומה:

1. **קישורי מילון בטופס השיר (7 פריטי "לתקן"):** ל-`song_recording` בקטלוג חזר המונחון של כרטיס "שיר מוכן" שירד: mixing, mastering, pitch-correction, autotune, wav, mp3. הוא מוצג בכרטיס ב-`/packages` ובמחירון, ומתחת לטופס השיר (`SongOfferSection showGlossary`) בעמוד השיר וב-`/studio/pricing` בשורה "מונחים שכדאי להכיר לפני הסשן". נעלמו: `links` ב-`/studio/recording-song-modiin`, `/studio/pricing` ו-`/packages`, ו-`inbound` ב-`/glossary/mastering`, `mp3`, `pitch-correction` ו-`wav`.
2. **autotune (2 שהיו "לאשר"):** אותו מונחון מחזיר את `/glossary/autotune` גם ל-`/pricing`, ולכן `/pricing · links` ו-`/glossary/autotune · inbound` חזרו לבסיס. שתי הרשומות ירדו מ-PROPOSED, אחרת היו אישורים מתים.
3. **אולפן נייד (2, `d9cb6ff`):** `/blog/mobile-recording-studio-guide · links` ו-`/glossary/recording-studio · inbound` אומתו בבנייה השנייה ונעלמו.
4. **liveDot (1):** ההחרגה נפרשה ב-`scripts/audit-seo-diff.mjs`: הערת המחוון וה-`text.replace` של `<aside>` ב-`visibleWordCount`, השדה `liveDot` ב-`extractHtml`, `site.liveDotPages` והבדיקה `note("site", "liveDot", ...)`. הבסיס הנוכחי עדיין מחזיק `liveDot` ו-`liveDotPages`, הסקריפט פשוט לא קורא אותם, ובבסיס הבא הם לא ייכתבו.

התיאור של דף הבית תוקן באותו ענף: "הקלטה מ-590 ₪ כולל מע״מ", מהקטלוג (`app/page.tsx`). הוא עדיין שונה מהבסיס ("מ-590 ₪ + מע״מ"), ולכן הרשומה שלו נשארת ב-PROPOSED.

הערה צדדית מהבדיקה, לא הבדל SEO: באקורדיון של `/studio/pricing` הכותרת "פודקאסט באולפן מ-885 ₪" נשענת על חצי שעה גלם, בזמן ש-WP3 קבע שהעוגן לפודקאסט הוא פרק ערוך.

## הרשומות המוצעות (60), להדבקה ב-`changes`

אותו תוכן ב-`scripts/baselines/seo-approved-changes.PROPOSED.json`. בלי 12 ההבדלים שתוקנו בענף.

```json
[
  {
    "url": "/",
    "field": "description",
    "why": "הברכה ירדה ל-500 לפני מע״מ (החלטה 3.10), ודף הבית הוא עמוד צרכן ולכן מוביל במחיר כולל מע״מ (החלטת 2.10). התיאור נבנה מהקטלוג (formatFromPriceExVat של blessing_recording): \"הקלטה מ-590 ₪ כולל מע״מ\". הבסיס אמר \"מ-590 ₪ + מע״מ\", ולכן השדה שונה מהבסיס.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/",
    "field": "images",
    "why": "שתי תמונות ההמלצות שהוסרו (שלב 5 WP9b, FIT-04), ונוספה תמונה ממוזערת של קליפ מג'יק קאס (b7da505). נטו מינוס אחת.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/",
    "field": "imagesWithAlt",
    "why": "שתי תמונות ההמלצות שהוסרו היו עם alt. הממוזערת של מג'יק קאס היא alt ריק, כמו שאר ממוזערות היוטיוב בעמוד.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/academy",
    "field": "links",
    "why": "הקישור ל-/testimonials היה בתוך המקטע שירד.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/academy",
    "field": "outline",
    "why": "המקטע \"מה התלמידים אומרים\" ירד עם שלוש המלצות האקדמיה שנוצרו עם TODO ולא היו אמיתיות (שלב 5 WP9b).",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/academy",
    "field": "words",
    "why": "אותו מקטע: 2,690 -> 2,650 מילים.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/blog/bar-mitzvah-song-recording-guide",
    "field": "outline",
    "why": "כותרת טבלת המחיר עברה מ\"(לפני מע״מ)\" ל\"(כולל מע״מ)\", והטבלה נבנית מהקטלוג. ה-h2 לא נגרע, הוא שונה.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/blog/bride-groom-blessing-recording-tips",
    "field": "outline",
    "why": "כותרת טבלת המחיר עברה מ\"(לפני מע״מ)\" ל\"(כולל מע״מ)\", והטבלה נבנית מהקטלוג. ה-h2 לא נגרע, הוא שונה.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/blog/original-song-what-to-prepare",
    "field": "outline",
    "why": "כותרת טבלת המחיר עברה מ\"(לפני מע״מ)\" ל\"(כולל מע״מ)\", והטבלה נבנית מהקטלוג. ה-h2 לא נגרע, הוא שונה.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/blog/podcast-booking-guide",
    "field": "outline",
    "why": "\"פרק מוכן תוך 24 שעות\" הפך ל\"הפרק אצלכם בסוף ההקלטה\" (החלטת הבעלים 3.10). ה-h2 שונה, לא נגרע.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/blog/podcast-for-small-business-worth-it",
    "field": "outline",
    "why": "\"פרק מוכן תוך 24 שעות\" הפך ל\"הפרק אצלכם בסוף ההקלטה\" (החלטת הבעלים 3.10). ה-h2 שונה, לא נגרע.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/blog/recorded-song-birthday-gift",
    "field": "description",
    "why": "\"מחיר (450-1,200 ₪)\" הוצג כמחיר שלנו. עכשיו \"טווחי מחיר בשוק\" ו\"אצלנו 590 ₪ כולל מע״מ\".",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/blog/studio-recording-cost-israel-2026",
    "field": "outline",
    "why": "כותרת טבלת המחיר עברה מ\"(לפני מע״מ)\" ל\"(כולל מע״מ)\", והטבלה נבנית מהקטלוג. ה-h2 לא נגרע, הוא שונה.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/blog/unique-gift-recording-ideas-2026",
    "field": "outline",
    "why": "כותרת טבלת המחיר עברה מ\"(לפני מע״מ)\" ל\"(כולל מע״מ)\", והטבלה נבנית מהקטלוג. ה-h2 לא נגרע, הוא שונה.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/data/industry-2026",
    "field": "ldCounts",
    "why": "Offer 31 -> 30: שתי שורות החבילות (cover_song, song_package) הוחלפו בשורה אחת של הקלטת שיר.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/events/wedding-attractions-packages",
    "field": "description",
    "why": "\"חיסכון 20-30%\" ירד (אין הנחה מעל 8%). עכשיו \"מספק אחד ובתיאום אחד\".",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/events/wedding-attractions-packages",
    "field": "outline",
    "why": "\"חוסכים כסף\" הפך ל\"הנחת חבילה על האטרקציות\" (8%). \"רגע של כוכב\" מוסתר כי אין לו מחיר בקטלוג (שלב 4 WP2, שאלת בעלים DJ-6).",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/matanot",
    "field": "outline",
    "why": "\"מקבלים הצעה ומשלמים מקדמה\" הפך ל\"מקבלים הצעה ומשריינים מועד\" (מקדמה אפשרית ובסכום שמסכמים יחד).",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/online/online-ai-pricing",
    "field": "outline",
    "why": "נוסף h3 \"תיקון זיופים\" (שלב 4 WP6, תיקון זיופים מציג מחיר). שום כותרת לא ירדה, רק הסדר.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/packages",
    "field": "outline",
    "why": "\"שיר מוכן באולפן\" (990) הפך ל\"הקלטת שיר באולפן\" (בסיס ותוספות).",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/packages",
    "field": "words",
    "why": "1,157 -> 1,149: תיאור החבילה הישנה ארוך יותר.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/photography",
    "field": "images",
    "why": "הוסרו התמונה של ההמלצה שהועברה מ\"אורי מזרחי\" ל\"דניאל גרין\" והתמונה של אדם אחר ליד ההמלצה של משה ברק (שלב 5 WP9b, FIT-04). אין תמונה אחרת שירדה.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/photography",
    "field": "imagesWithAlt",
    "why": "אותן תמונות המלצה, שהיה להן alt. אף תמונה שנשארה לא איבדה alt.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/photography",
    "field": "words",
    "why": "1,773 -> 1,769: ליד מחיר הצילום כבר לא מוצגת המלצה של שירות אחר.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/podcast",
    "field": "description",
    "why": "\"מוכן תוך 24 שעות מ-750 ₪\" הפך ל\"הפרק אצלכם באותה שנייה... פרק ערוך מ-1,121 ₪ כולל מע״מ\".",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/podcast/faq",
    "field": "outline",
    "why": "\"פרק קצר, חצי שעה\" הפך ל\"הקלטה בלבד, חצי שעה\": 750 הוא חצי שעה גלם בלי עריכה (שלב 4 WP3).",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/podcast/mobile-podcast-at-home",
    "field": "outline",
    "why": "נוספה שאלה ב-FAQ: \"כמה עולה כל אדם נוסף בהקלטה בבית?\" (h3 באקורדיון). החלטת הבעלים 3.10, סבב שלישי: הקלטת האודיו בבית כלולה ב-2,500, וכל אדם נוסף ערוץ נוסף 99 + מע״מ עד 12. שום כותרת לא אבדה, נוספה אחת.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/podcast/podcast-production",
    "field": "outline",
    "why": "\"פרק קצר, חצי שעה\" הפך ל\"הקלטה בלבד, חצי שעה\": 750 הוא חצי שעה גלם בלי עריכה (שלב 4 WP3). ב-podcast-production רק הסדר השתנה.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/podcast/podcast-recording",
    "field": "description",
    "why": "\"פרק מוכן תוך 24 שעות\" הפך ל\"הפרק אצלכם באותה שנייה שמסיימים להקליט\".",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/podcast/podcast-recording",
    "field": "outline",
    "why": "אותו שינוי ב-h2.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/podcast/podcast-studio-modiin",
    "field": "outline",
    "why": "\"פרק קצר, חצי שעה\" הפך ל\"הקלטה בלבד, חצי שעה\": 750 הוא חצי שעה גלם בלי עריכה (שלב 4 WP3).",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/pricing",
    "field": "description",
    "why": "\"ברכה מ-590, שיר מוכן מ-990\" הפך ל\"ברכה מ-500, הקלטת שיר 500\". הטקסט אומר במפורש \"לפני ואחרי מע״מ\". אפשר לשקול כולל מע״מ קודם.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/pricing",
    "field": "outline",
    "why": "\"עם תיקון זיופים או בלי?\" הפך ל\"מה עושה תוספת תיקון הזיופים?\". \"מה ההבדל בין שיר מוכן לשיר Pro?\" ירד עם שיר Pro. נוספו DJ, צילום ו\"האם תיקון זיופים כלול\".",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/studio",
    "field": "images",
    "why": "הוסרה התמונה של אדם אחר ליד ההמלצה של משה ברק, שמוצגת בעמודי האולפן (שלב 5 WP9b, FIT-04). אין תמונה אחרת שירדה.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/studio",
    "field": "imagesWithAlt",
    "why": "אותן תמונות המלצה, שהיה להן alt. אף תמונה שנשארה לא איבדה alt.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/studio/blessings/bar-mitzvah",
    "field": "images",
    "why": "הוסרה התמונה של אדם אחר ליד ההמלצה של משה ברק, שמוצגת בעמודי האולפן (שלב 5 WP9b, FIT-04). אין תמונה אחרת שירדה.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/studio/blessings/bar-mitzvah",
    "field": "imagesWithAlt",
    "why": "אותן תמונות המלצה, שהיה להן alt. אף תמונה שנשארה לא איבדה alt.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/studio/blessings/bride-groom-blessing",
    "field": "images",
    "why": "הוסרה התמונה של אדם אחר ליד ההמלצה של משה ברק, שמוצגת בעמודי האולפן (שלב 5 WP9b, FIT-04). אין תמונה אחרת שירדה.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/studio/blessings/bride-groom-blessing",
    "field": "imagesWithAlt",
    "why": "אותן תמונות המלצה, שהיה להן alt. אף תמונה שנשארה לא איבדה alt.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/studio/blessings/video-clip",
    "field": "images",
    "why": "הוסרה התמונה של אדם אחר ליד ההמלצה של משה ברק, שמוצגת בעמודי האולפן (שלב 5 WP9b, FIT-04). אין תמונה אחרת שירדה.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/studio/blessings/video-clip",
    "field": "imagesWithAlt",
    "why": "אותן תמונות המלצה, שהיה להן alt. אף תמונה שנשארה לא איבדה alt.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/studio/pricing",
    "field": "description",
    "why": "\"ברכה, שיר מוכן, Pro וסינגל\" הפך ל\"הקלטת שיר ב-590 ₪ כולל מע״מ ותוספות לפי בחירה\".",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/studio/pricing",
    "field": "words",
    "why": "3,135 -> 2,875: תיאורי ארבע החבילות שירדו. אחרי המיזוג של main נוסף בלוק \"מה מזיז את המחיר\", ולכן הירידה קטנה מ-2,622 שנמדדו לפניו.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/studio/recording-song-modiin",
    "field": "description",
    "why": "\"מסירה תוך 48 שעות\" ירד. עכשיו \"הקלטה, מיקס ומאסטר בסשן של שעה. 590 ₪ כולל מע״מ\".",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/studio/recording-song-modiin",
    "field": "title",
    "why": "\"תוך 48 שעות\" הפך ל\"590 ₪ כולל מע״מ\". המסירה היא בסוף הסשן.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/studio/recording-song-modiin",
    "field": "words",
    "why": "4,534 -> 4,298: ארבע החבילות ירדו. נוספו שאלת פלייבק, תוכן הטופס, ואחרי המיזוג של main גם בלוק \"מה מזיז את המחיר\".",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/studio/recording-song-modiin/gifts",
    "field": "description",
    "why": "אותו שינוי במשפט האחרון.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/studio/recording-song-modiin/gifts",
    "field": "h1",
    "why": "\"מסירה תוך 48 שעות\" הפך ל\"נשלח אליכם מיד\".",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/studio/recording-song-modiin/gifts",
    "field": "outline",
    "why": "אותו שינוי ב-h2. נוסף \"שיר במתנה: בוחרים ושולחים\".",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/studio/recording-song-modiin/gifts",
    "field": "title",
    "why": "\"מסירה 48 שעות\" הפך ל\"נשלח מיד\" (החלטה 3.10: השובר נשלח מיד).",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/testimonials",
    "field": "images",
    "why": "הוסרו התמונה של ההמלצה שהועברה מ\"אורי מזרחי\" ל\"דניאל גרין\" והתמונה של אדם אחר ליד ההמלצה של משה ברק (שלב 5 WP9b, FIT-04). אין תמונה אחרת שירדה.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/testimonials",
    "field": "imagesWithAlt",
    "why": "אותן תמונות המלצה, שהיה להן alt. אף תמונה שנשארה לא איבדה alt.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/testimonials",
    "field": "inbound",
    "why": "14 -> 13: הקישור מ-/academy ירד עם המקטע.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/testimonials",
    "field": "words",
    "why": "1,353 -> 1,263: ארבע המלצות שהוסרו (שלוש של האקדמיה ושל הפודקאסט שהועברה לשם אחר).",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/video",
    "field": "images",
    "why": "הוסרו התמונה של ההמלצה שהועברה מ\"אורי מזרחי\" ל\"דניאל גרין\" והתמונה של אדם אחר ליד ההמלצה של משה ברק (שלב 5 WP9b, FIT-04). אין תמונה אחרת שירדה.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/video",
    "field": "imagesWithAlt",
    "why": "אותן תמונות המלצה, שהיה להן alt. אף תמונה שנשארה לא איבדה alt.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/video",
    "field": "words",
    "why": "1,651 -> 1,571: אותן המלצות בקרוסלה.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/video/corporate-video",
    "field": "images",
    "why": "הוסרו התמונה של ההמלצה שהועברה מ\"אורי מזרחי\" ל\"דניאל גרין\" והתמונה של אדם אחר ליד ההמלצה של משה ברק (שלב 5 WP9b, FIT-04). אין תמונה אחרת שירדה.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/video/corporate-video",
    "field": "imagesWithAlt",
    "why": "אותן תמונות המלצה, שהיה להן alt. אף תמונה שנשארה לא איבדה alt.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  },
  {
    "url": "/video/corporate-video",
    "field": "words",
    "why": "1,694 -> 1,617: אותן המלצות בקרוסלה.",
    "approvedBy": "owner",
    "approvedAt": "2026-10-03"
  }
]
```

## אחרי האישור

1. להדביק את הרשומות ולמחוק את עשרת האישורים המתים. liveDot כבר נפרש בקוד.
2. בנייה אחת ו-`node scripts/audit-seo-diff.mjs`. צריך לצאת ירוק.
3. כשהבעלים מרוצה, לכתוב בסיס חדש מעותק נקי של HEAD (`~/yakir-clean-wt`) עם `--write-baseline`, ואז אפשר לרוקן את רשימת האישורים.
