import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { GONE_EXACT_PATHS, GONE_PATH_PREFIXES, clearCartQuery } from "@/lib/legacy-redirects";

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
  /* ?add-to-cart= מנוקה כאן ולא ב-next.config: redirect שם מעביר את ה-query
     ליעד (redirects.md:43 בתיעוד), ולכן הכלל הישן הפנה לעצמו בלולאה (ED-12).
     הניקוי חל גם על ההפניה של /shop-2, כדי שתהיה קפיצה אחת ולא שתיים. */
  const target = req.nextUrl.clone();
  const hadCartQuery = clearCartQuery(target);

  /* חריג מכוון: /shop-2 עצמו כן מקבל הפניה, כי יש לו מקבילה אמיתית ב-/shop.
     רק העומק מתחתיו מת. ראו ההערה על "/shop-2" ב-GONE_PATH_PREFIXES. */
  if (clean === "/shop-2") {
    target.pathname = "/shop";
    target.hash = "vouchers";
    return NextResponse.redirect(target, 308);
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

  /* אחרי בדיקת ה-410 בכוונה: /product/x?add-to-cart=1 מקבל 410 ישר, בלי
     קפיצה מיותרת דרך הפניה. */
  if (hadCartQuery) {
    return NextResponse.redirect(target, 308);
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
    /* /כמה-לתת-לחתונה-כמה-להביא-לחתונה, מקודד כמו ב-GONE_EXACT_PATHS */
    "/%D7%9B%D7%9E%D7%94-%D7%9C%D7%AA%D7%AA-%D7%9C%D7%97%D7%AA%D7%95%D7%A0%D7%94-%D7%9B%D7%9E%D7%94-%D7%9C%D7%94%D7%91%D7%99%D7%90-%D7%9C%D7%97%D7%AA%D7%95%D7%A0%D7%94",
    /* כל נתיב, אבל רק כשיש בו ?add-to-cart=. תנאי has ב-matcher מתועד ב-
       node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md:101.
       בלי ה-has ה-proxy היה רץ על כל בקשה באתר. */
    { source: "/:path*", has: [{ type: "query", key: "add-to-cart" }] },
  ],
};
