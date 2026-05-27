# Deploy ל-production (yakircohen-site)

## פרויקט נכון

- **Vercel project:** `yakircohen-site` (לא `yakircohen-com`)
- **תיקייה:** `yakircohen-site/`
- ודאו ש-`.vercel/project.json` מצביע לפרויקט הנכון

## פקודות

```powershell
cd yakircohen-site
npx vercel link --project yakircohen-site
npx vercel deploy --prod --yes
```

## Dropbox + build מקומי

אם `npm run build` נכשל עם `EBUSY` על `.next`:

1. עצרו `npm run dev` אם רץ
2. מחקו ידנית את `.next` (או המתינו לסנכרון Dropbox)
3. העדיפו deploy דרך Vercel Git - הבנייה רצה בענן, לא בתיקיית Dropbox

`.next/` כבר ב-`.gitignore` - אל תסנכרנו אותו ב-Dropbox אם אפשר (Selective Sync).

## דומיין www

- `www.yakircohen.com` ו-`yakircohen.com` - ב-Vercel של **yakircohen-site**
- Cloudflare: הימנעו מ-redirect כפול ל-`/home` (middleware באתר מטפל ב-`/home` → `/`)
- אחרי שינוי DNS: המתינו להפצה ובדקו בחלון פרטי

## משתני סביבה (לידים במייל)

ראו `docs/LEAD-EMAIL-SETUP.md` - להגדיר ב-**yakircohen-site** → Settings → Environment Variables, ואז Redeploy.
