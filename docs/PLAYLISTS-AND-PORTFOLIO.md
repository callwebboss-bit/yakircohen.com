# מה לשלוח: וידאו (YouTube) + תמונות (תיקיות)

## חשוב: "פלייליסט" באתר = קישור YouTube

בקוד, `playlistEmbedUrl` הוא **הטמעת YouTube** (סרטון בודד או פלייליסט), לא Spotify.

### פורמט לינקים לשליחה

| סוג | דוגמה | מה נעשה בקוד |
|-----|--------|----------------|
| סרטון בודד | `https://www.youtube.com/watch?v=XUr2e5S4JSA` | נשים ב-`lib/data/youtube-embeds.ts` או ישירות בשירות |
| פלייליסט | `https://www.youtube.com/playlist?list=PLxxxxxxxx` | נמיר ל-`https://www.youtube.com/embed/videoseries?list=PLxxxxxxxx` |

שלח לכל עמוד: **כתובת העמוד באתר** + **לינק YouTube** (אחד מספיק; אפשר כמה אם יש "דוגמאות").

---

## עמודים בלי וידאו YouTube כרגע (`playlistEmbedUrl: null`)

שלח לינק YouTube לכל שורה (או כתוב "דלג / אין וידאו"):

| עמוד באתר | מזהה שירות | הערה |
|-----------|------------|------|
| [/studio](https://yakircohen.com/studio) | סטודיו מרכז | אופציונלי — יש גלריית תמונות |
| [/studio/mobile-studio](https://yakircohen.com/studio/mobile-studio) | אולפן נייד | |
| [/studio/blessings/bar-mitzvah](https://yakircohen.com/studio/blessings/bar-mitzvah) | בר מצווה | |
| [/studio/blessings/bride-groom-blessing](https://yakircohen.com/studio/blessings/bride-groom-blessing) | חתן וכלה | |
| [/voiceover](https://yakircohen.com/voiceover) | קריינות מרכז | |
| [/voiceover/services](https://yakircohen.com/voiceover/services) | שירותי קריינות | |
| [/voiceover/course](https://yakircohen.com/voiceover/course) | קורס קריינות | |
| [/events/equipment](https://yakircohen.com/events/equipment) | ציוד הגברה | |
| [/events/equipment/singer-amplification](https://yakircohen.com/events/equipment/singer-amplification) | הגברת זמר | |
| [/events/host](https://yakircohen.com/events/host) | מנחה אירועים | |
| [/photography/events](https://yakircohen.com/photography/events) | צילום כנסים | משתמש בגלריית wedding |

**Spotify:** כרגע אין שדה Spotify ב-registry. אם יש לינקי Spotify לקריינות/דמו — שלח בנפרד (נוסיף הטמעה ב-`LazyClickEmbed`).

---

## תיקיות תמונות ריקות (העלאה ל-Dropbox / `public/images/services/`)

שים קבצי **WebP או JPG**, 4–12 תמונות לתיקייה:

| תיקייה | עמוד |
|--------|------|
| `events/dj-events/` | /events/dj-events |
| `events/equipment/` | /events/equipment |
| `events/equipment/singer-amplification/` | /events/equipment/singer-amplification |
| `events/wedding-packages/` | /events/wedding-attractions-packages |
| `video/photo-slideshow/` | /photo-slideshow |
| `video/corporate-video/` | /video/corporate-video (אם ריק) |
| `photography/events/` | אופציונלי — כרגע משתף `photography/wedding/` |

**מומלץ להשלים (מעט תמונות):**

- `studio/blessings/bride-groom-blessing/` (2 קיימות)
- `dj-course/` (1 קיימת)

---

## תבנית הודעה לשליחה אליי

```text
/studio/mobile-studio
YouTube: https://www.youtube.com/watch?v=...

/events/dj-events
תמונות: [אעלה לתיקייה events/dj-events]
YouTube: https://www.youtube.com/playlist?list=...
```
