# מפת אתר — יקיר כהן הפקות

מקור אמת בקוד: [`lib/site-architecture.ts`](../lib/site-architecture.ts)

## מרכזי תוכן (Hubs)

| קטגוריה | URL | תפריט |
|---------|-----|--------|
| פודקאסט | `/podcast` | כן |
| סטודיו וברכות | `/studio` | כן |
| קריינות | `/voiceover` | כן |
| אירועים | `/events` | כן |
| וידאו | `/video` | כן |
| צילום | `/photography` | כן |
| אקדמיה | `/academy` | כן |
| מגזין | `/blog` | כן (קישור גלובלי) |

## עמודים שאוחדו (301 → קנוני)

| ישן (לא לקשר) | קנוני (לקשר) | סיבה |
|---------------|--------------|------|
| `/podcast/podcast-studio` | `/podcast/podcast-studio-modiin` | אותו אולפן, עמוד SEO אחד |
| `/courses` | `/academy` | אותה רשימת קורסים |

## כללי קישורים פנימיים

1. **בתוך עמודי פודקאסט** — קישורי "מסלולים" רק ל-`/podcast/*` (לא לסטודיו/אירועים).
2. **בתוך אירועים** — אטרקציות מקשרות ל-`/events/*`.
3. **חוצה קטגוריות** — רק בפוטר, מגזין, CTA כללי, או דף הבית.

## פודקאסט — מבנה

```
/podcast                          ← Hub + מחשבון
├── podcast-recording             ← הפקה מלאה (2,500 ₪)
├── podcast-studio-modiin         ← השכרת סטודיו (קנוני, 750 ₪)
├── podcast-editing
├── podcast-production            ← ליווי ארוך טווח
├── mobile-podcast-at-home
├── podcast-with-grandpa
└── faq
```

## אירועים — מבנה

```
/events
├── dj-events
├── stage-led-dj                  ← LED + DJ (קנוני ל-led-booth ישן)
├── wedding-attractions-packages
├── equipment
│   └── singer-amplification
├── host
└── attractions/
    ├── wedding-smoking-machine
    │   └── heavy-smoke-large-events
    ├── bubble-machine
    │   └── smoke-bubble-machine-events
    └── …
```

## קבצים נלווים

- תמונות: [`public/images/services/README.md`](../public/images/services/README.md)
- פריסה: [`PRE-DEPLOY-CHECKLIST.md`](./PRE-DEPLOY-CHECKLIST.md)
- תוכן לשליחה: [`CONTENT-TO-SEND.md`](./CONTENT-TO-SEND.md)

## Google Analytics

מזהה: `G-PVW4GMPNS4` — ב-`components/analytics/GoogleAnalytics.tsx`
