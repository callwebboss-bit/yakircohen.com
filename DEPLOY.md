# DEPLOY -- yakircohen.com

## מבנה ה-Repo (אפשרות א׳ -- מומלץ)

```
callwebboss-bit/yakircohen.com   ← root = האתר עצמו
├── app/                          ← Next.js App Router
├── public/
├── .github/workflows/ci.yml      ← CI אוטומטי
├── next.config.ts
├── package.json                  (name: "yakircohen-site")
├── tsconfig.json
├── DEPLOY.md                     ← המסמך הזה
└── README.md
```

**למה אפשרות א׳?**
- Root directory = `/` -- Vercel/Cloudflare מזהים אוטומטית
- אין צורך להגדיר root directory ידנית
- CI פשוט יותר

---

## שלבי Git -- פעם ראשונה (clone + push)

```bash
# 1. שכפל את ה-repo
git clone https://github.com/callwebboss-bit/yakircohen.com.git
cd yakircohen.com

# 2. התקן תלויות
npm install

# 3. וודא שה-build עובר מקומית
npm run build

# 4. הוסף שינויים
git add .

# 5. commit
git commit -m "feat: <תיאור קצר של השינוי>"

# 6. push ל-main
git push origin main
```

---

## שלבי Git -- עבודה שוטפת

```bash
# צור branch לפיצ׳ר / תיקון
git checkout -b feat/שם-הפיצ׳ר

# עבוד, שמור, ואז:
git add .
git commit -m "feat: תיאור"
git push origin feat/שם-הפיצ׳ר

# פתח Pull Request ב-GitHub → merge ל-main → deploy אוטומטי
```

---

## Vercel -- תצורה נכונה

> ה-repo מחובר ל-3 פרויקטי Vercel (כולם נכשלו). יש לתקן אחד ולמחוק את השאר.

### תיקון ב-Vercel Dashboard:
1. כנס ל-vercel.com → בחר את פרויקט **yakircohen-com** (או צור חדש)
2. Settings → General:
   - **Framework Preset**: Next.js
      - **Root Directory**: `.` (ריק -- root)
         - **Build Command**: `npm run build`
            - **Output Directory**: `.next`
               - **Install Command**: `npm install`
               3. Settings → Git → Branch: `main`
               4. לחץ **Redeploy**

               ### מחיקת פרויקטים כפולים:
               מחק את `yakircohen` ו-`yakircohen-com-rikr` מ-Vercel Dashboard → Settings → Delete Project.

               ---

               ## GitHub Actions CI

               קובץ `.github/workflows/ci.yml` מריץ build + lint בכל push ו-PR.

               ראה: [.github/workflows/ci.yml](.github/workflows/ci.yml)

               ---

               ## Environment Variables

               אם האתר צריך משתני סביבה (API keys וכד׳):

               ```bash
               # מקומי -- צור קובץ .env.local (לא מועלה ל-git!)
               NEXT_PUBLIC_EXAMPLE=value

               # Vercel -- הוסף ב: Settings → Environment Variables
               ```

               ---

               ## הוראות Build מהירות

               | פקודה | מה עושה |
               |---|---|
               | `npm run dev` | שרת פיתוח על port 3000 |
               | `npm run build` | build לייצור |
               | `npm run start` | הרץ את ה-build |
               | `npm run lint` | בדיקת ESLint |
