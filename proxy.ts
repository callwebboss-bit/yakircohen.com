import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { GONE_EXACT_PATHS, GONE_PATH_PREFIXES } from "@/lib/legacy-redirects";

/**
 * `410 Gone` לשרידי WooCommerce ו-WordPress.
 *
 * למה 410 ולא 301: מאות כתובות מוצר שאינן קשורות הופנו לעמוד יחיד, וגוגל מתייחס
 * להפניה המונית many-to-one כ-soft 404. לכן מונה "נסרק ולא באינדקס" טיפס ל-1,030
 * במקום לרדת. 410 מוציא את הכתובת מתור הסריקה תוך שבועות.
 *
 * סדר הריצה בתיעוד של Next 16: headers, redirects, proxy. כלומר כל דפוס שיש לו
 * גם 301 ב-next.config תופס ראשון וה-410 לעולם לא נבדק. לכן הדפוסים האלה הוסרו
 * מ-WORDPRESS_PATTERNS, ו-scripts/audit-proxy-gone.mjs אוכף שהם לא יחזרו לשם.
 *
 * הערה: כאן ישב גם rewrite של /home אל /, והוא היה קוד מת בדיוק מאותה סיבה:
 * LEGACY_PATH_MAP כבר מחזיק "/home": "/" שרץ כ-308 לפני ה-proxy. ההפניה עדיפה
 * ממילא, כי rewrite היה מגיש את תוכן הבית בשתי כתובות.
 */
export function proxy(req: NextRequest) {
  const clean = req.nextUrl.pathname.replace(/\/+$/, "") || "/";

  /* חריג מכוון: /shop-2 עצמו כן מקבל הפניה, כי יש לו מקבילה אמיתית ב-/shop.
     רק העומק מתחתיו מת. ראו ההערה על "/shop-2" ב-GONE_PATH_PREFIXES. */
  if (clean === "/shop-2") {
    const url = req.nextUrl.clone();
    url.pathname = "/shop";
    url.hash = "vouchers";
    return NextResponse.redirect(url, 308);
  }

  const isGone =
    (GONE_EXACT_PATHS as readonly string[]).includes(clean) ||
    (GONE_PATH_PREFIXES as readonly string[]).some(
      (prefix) => clean === prefix || clean.startsWith(`${prefix}/`),
    );

  if (isGone) {
    return new NextResponse(null, {
      status: 410,
      headers: {
        /* max-age קצר בכוונה: 410 שגוי היה ננעל בדפדפנים לשעה בלי דרך לנקות.
           ה-CDN עדיין סופג את העומס דרך s-maxage.
           אין כאן x-robots-tag: vercel.json מציב "index, follow" על כל נתיב,
           ושתי הכותרות יחד רק מרעישות. ל-410 אין צורך בהנחיה לרובוט ממילא. */
        "cache-control": "public, max-age=60, s-maxage=86400",
      },
    });
  }

  return NextResponse.next();
}

/**
 * ה-matcher חייב להיות ליטרל סטטי (Next מנתח אותו בזמן build), ולכן הרשימה
 * משוכפלת כאן ולא נגזרת מ-GONE_PATH_PREFIXES.
 * scripts/audit-proxy-gone.mjs אוכף שהשתיים לא נפרדות.
 *
 * `:path*` הוא אפס-או-יותר, ולכן "/product/:path*" תופס גם את /product עצמו.
 */
export const config = {
  matcher: [
    "/product/:path*",
    "/product-tag/:path*",
    "/product-category/:path*",
    "/category/:path*",
    "/tag/:path*",
    "/shop-2/:path*",
    "/wp-admin/:path*",
    "/wp-content/:path*",
    "/wp-json/:path*",
    "/xmlrpc.php",
    "/index.aspx",
    "/main.asp",
  ],
};
