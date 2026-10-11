# הנחיה לסוכן ה-API (Cursor): לינקים לתשלום במורנינג

להדביק ב-Cursor כפי שהוא, יחד עם הקובץ `docs/morning-items.json` מהריפו. הסוכן עובד מול ה-API של מורנינג (חשבונית ירוקה) עם המפתח שלך. בסוף הוא מחזיר קובץ JSON אחד (`morning-links.json`) שנכנס לדלפק המכירות. לא לשתף את המפתח או את הטוקן עם אף אחד, גם לא בפלט.

---

## ההנחיה (להדביק מכאן)

אתה עובד מול ה-API של morning (Green Invoice) בשם העסק "יקיר כהן הפקות". המטרה: ליצור במורנינג לינקים לתשלום לשירותים של האולפן, ולהחזיר קובץ JSON עם ה-URL של כל לינק. כתיבה בלבד: אסור לקרוא, לייצא או להדפיס נתוני לקוחות (שמות, מיילים, טלפונים, מסמכים). אסור להדפיס את ה-API ID, ה-secret או טוקן.

### חיבור
- בסיס: `https://api.greeninvoice.co.il/api/v1`
- טוקן: `POST /account/token` עם `{"id": "<API ID>", "secret": "<secret>"}`. התשובה מכילה `token` (או כותרת `X-Authorization-Bearer`). תוקף כ-30 דקות. כל בקשה: `Authorization: Bearer <token>`.
- קצב: עד 3 בקשות לשנייה. על 401 לרענן טוקן פעם אחת.
- המפתח: מורנינג > הגדרות > כלים למפתחים > API Keys. לקרוא אותו ממשתני סביבה, לא להדביק בקוד.

### שלב 1: גילוי (לדווח לפני שיוצרים משהו)
הרץ את הקריאות הבאות והדפס לכל אחת: סטטוס HTTP ושמות השדות בתשובה (בלי ערכים של לקוחות):
1. `POST /items/search` עם `{"page": 1, "pageSize": 1}`
2. `GET /payment/links?pageSize=1`, ואם 404 גם `GET /payments/links?pageSize=1` וגם `POST /payment/links/search` עם `{"page":1,"pageSize":1}`
3. `POST /payments/form` עם:
```json
{"description":"בדיקת מערכת, לא לתשלום","type":320,"lang":"he","currency":"ILS","vatType":1,"amount":1,"maxPayments":1,
 "income":[{"description":"בדיקת מערכת","quantity":1,"price":1,"currency":"ILS","vatType":1}],
 "remarks":"probe","custom":"probe","successUrl":"https://yakircohen.com/","failureUrl":"https://yakircohen.com/"}
```
הדפס את ה-`url` שחזר (זה דף תשלום לעסקה אחת, לא לשלם בו).

פענוח, להדפיס שורה אחת:
- **מסלול A**: סעיף 2 מחזיר 200 עם רשימה של לינקים קבועים (שדות כמו name/description/price/url/active). אפשר ליצור לינקים קבועים ב-API.
- **מסלול B**: סעיף 2 מחזיר 200 אבל הרשומות הן בקשות תשלום ללקוח מסוים (שדות client/document).
- **מסלול C**: 404/405 בכל הניסיונות. אין API ללינקים קבועים.

**עצור כאן ודווח.** ההמשך תלוי בתשובה.

### שלב 2 (מסלול A בלבד): ליצור לינקים
קלט: `docs/morning-items.json`. לכל פריט עם `"featured": true` (8 פריטים), ואחר כך רק אם התבקשת, השאר:
1. פריט: `POST /items/search` לפי `sku` = `id`. אם אין, `POST /items` עם `{"name": name, "description": description, "price": inclVat, "currency": "ILS", "vatType": 1, "sku": id, "active": true}`. `vatType: 1` = המחיר כולל מע״מ. אם יש והמחיר או התיאור שונים, `PUT /items/{id}`.
2. לינק קבוע לפריט: לפי השדות שהתגלו בשלב 1 (שם, תיאור, סכום inclVat, מטבע ILS, מע״מ כלול, `lang: "he"`, `remarks` = description). אם הלינק דורש `client`, זה מסלול B, עצור.
3. לינק מקדמה: מהשדה `deposit` בקובץ (200 ₪, שם "מקדמה לשמירת תאריך").
4. אל תיצור לינק סכום פתוח ב-API. הוא נוצר בממשק (תשלומים > לינקים לתשלום > לינק בסכום פתוח) עם "סכומים קבועים לבחירה" = `presetAmounts` מהקובץ.

פלט: קובץ `morning-links.json` בדיוק במבנה הזה (רק URL-ים, בלי שום דבר אחר):
```json
{
  "updated": "YYYY-MM-DD",
  "bankTransferLine": "",
  "deposit": { "url": "https://...", "inclVat": 200 },
  "open": { "url": "" },
  "cards": {
    "song_recording": { "url": "https://...", "inclVat": 590 }
  }
}
```
`inclVat` של כל כרטיס = `inclVat` מהקובץ שקיבלת. `open.url` נשאר ריק אם לא נוצר בממשק.

### שלב 2 (מסלול B או C): דף תשלום לעסקה
אל תיצור פריטים ולינקים. דווח רק: מה `POST /payments/form` מחזיר (שמות השדות), האם `custom` חוזר ב-webhook/בתשובה, ומה הכתובת של ה-webhook settings אם מצאת בתיעוד. את דפי התשלום ייצר האתר בעצמו מתוך דלפק המכירות.

### כללים
- לא למחוק שום דבר. ביטול = `active: false`.
- לא לגעת במסמכים (`/documents`), בלקוחות (`/clients`) ובהוצאות.
- כל שינוי שיצרת: שורה בלוג עם המזהה, כדי שאפשר יהיה לבטל.
- אם משהו בתיעוד סותר את ההנחיה הזו, עצור ודווח, אל תנחש.

## (סוף ההנחיה)

---

## מה לעשות עם מה שחוזר

1. את הדיווח של שלב 1 (A/B/C) מדביקים לי כאן. אני מעדכן את התוכנית לפי המסלול.
2. במסלול A: את `morning-links.json` שחזר מדביקים לי, או שומרים ב-`lib/data/morning-links.json` ומריצים `npm run morning:link -- --check`. הדלפק מציג את הלינקים אחרי הפריסה.
3. את לינק הסכום הפתוח יוצרים בממשק (5 דקות), ושומרים: `npm run morning:link -- --id open --url <הלינק>`.
