import type { NextConfig } from "next";
import { getLegacyRedirects } from "@/lib/legacy-redirects";
import bundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/**
 * יעד הדיווח של ה-CSP, נגזר מה-DSN של Sentry.
 *
 * למה: הכותרת נשלחה במצב Report-Only מאז שנוצרה, עם הערה שאומרת שהיא
 * אוספת הפרות לפני אכיפה, אבל לא היה לה שום יעד. הדפדפן רשם ליומן
 * המקומי בלבד, כלומר איש לא ראה דבר, ולא הייתה דרך להדק אותה לאכיפה על
 * סמך נתונים. נמצא בסבב ביקורת 16.9.2026.
 *
 * Sentry מקבל דוחות CSP בנקודה ייעודית שנגזרת מה-DSN עצמו:
 * DSN הוא https://<מפתח>@<מארח>/<פרויקט>, והנקודה היא
 * https://<מארח>/api/<פרויקט>/security/?sentry_key=<מפתח>.
 *
 * בלי DSN אין יעד, והכותרת נשלחת בלעדיו בדיוק כמו קודם. לא מפילים בנייה
 * בגלל משתנה סביבה חסר.
 */
function cspReportEndpoint(): string | null {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();
  if (!dsn) return null;
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.replace(/^\//, "");
    if (!url.username || !projectId) return null;
    return `https://${url.host}/api/${projectId}/security/?sentry_key=${url.username}`;
  } catch {
    return null;
  }
}

const CSP_REPORT_URI = cspReportEndpoint();

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  /**
   * Report-Only: collect violations without blocking.
   * Tighten to enforce after reviewing browser reports / Vercel logs.
   */
  {
    key: "Content-Security-Policy-Report-Only",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self' https://wa.me https://api.whatsapp.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://static.elfsight.com https://core.service.elfsight.com https://*.elfsight.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.elfsight.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com https://*.elfsight.com",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://region1.google-analytics.com https://*.elfsight.com https://core.service.elfsight.com https://wa.me https://api.whatsapp.com",
      /* koalendar ו-spotify נוספו 30.9.2026: שניהם ב-iframe באתר
         (KoalendarModal ו-lib/embed-url), והמדיניות לא הכירה אותם. כל עוד
         היא Report-Only זה רק רעש בדוחות, אבל אכיפה כמו שהיא הייתה שוברת
         את קביעת הפגישות ואת נגן הספוטיפיי. */
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://maps.google.com https://www.google.com https://*.elfsight.com https://koalendar.com https://open.spotify.com",
      "media-src 'self' blob: https:",
      "worker-src 'self' blob:",
      /* שתי הצורות: report-uri היא הישנה ועדיין הנתמכת ביותר,
         ו-report-to היא המודרנית שדורשת גם כותרת Reporting-Endpoints. */
      ...(CSP_REPORT_URI ? [`report-uri ${CSP_REPORT_URI}`, "report-to csp-endpoint"] : []),
    ].join("; "),
  },
  ...(CSP_REPORT_URI
    ? [{ key: "Reporting-Endpoints", value: `csp-endpoint="${CSP_REPORT_URI}"` }]
    : []),
];

const nextConfig: NextConfig = {
  /* הסרת הסלאש האוטומטית של Next רצה לפני כל redirect, ולכן כתובת ישנה כמו
     www.yakircohen.com/צרו-קשר/ עברה שלוש הפניות. כאן היא כבויה, והסלאש
     מטופל בכללים ב-redirects() למטה, אחרי מפת הכתובות הישנות. ראו
     withOptionalTrailingSlash ב-lib/legacy-redirects.ts. */
  skipTrailingSlashRedirect: true,
  outputFileTracingExcludes: {
    "/**": ["./next.config.ts"],
  },
  experimental: {
    /**
     * radix-ui@1.5.0 היא חבילת barrel עם 55 תלויות @radix-ui/react-*.
     * רשימת ברירת המחדל של Next מכסה lucide-react ועוד עשרות חבילות,
     * אבל לא אותה. ארבעה קבצים מייבאים ממנה, ואחד מהם,
     * components/layout/FooterCategorySitemap.tsx, נמצא במטען שנשלח
     * בכל אחד מ-318 העמודים.
     */
    optimizePackageImports: ["radix-ui"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      /* 1. כתובות ישנות קודם, בלי הגבלת host: כל אחת תופסת www ובלי www, עם
         סלאש ובלעדיו, ומפנה ליעד מלא בקפיצה אחת. */
      ...getLegacyRedirects(),
      /* ?add-to-cart= של WooCommerce מטופל ב-proxy.ts ולא כאן. הכלל שישב כאן
         הפנה לעצמו: Next מעביר את ה-query של הבקשה ליעד ההפניה
         (node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md:43),
         ולכן /?add-to-cart=123 קיבל 308 אל /?add-to-cart=123 בלולאה (ED-12). */
      /* 2. www לדומיין בלי www. עם סלאש בסוף: מורידים אותו באותה קפיצה. */
      {
        source: "/:path+/",
        has: [{ type: "host", value: "www.yakircohen.com" }],
        destination: "https://yakircohen.com/:path+",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.yakircohen.com" }],
        destination: "https://yakircohen.com/:path*",
        permanent: true,
      },
      /* 3. סלאש בסוף כתובת, במקום ההסרה האוטומטית שכובתה למעלה. */
      {
        source: "/:path+/",
        destination: "/:path+",
        permanent: true,
      },
      // Strip .html extensions (produced by Pagefind crawling .next/server/app)
      {
        source: "/:path(.*)\\.html",
        destination: "/:path",
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(withBundleAnalyzer(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  widenClientFileUpload: true,
  /* disableLogger ו-automaticVercelMonitors הוסרו (4.10.2026). ב-@sentry/nextjs
     10.65 שניהם deprecated ושניהם של webpack בלבד: deprecatedWebpackOptions.js
     ממפה אותם ל-webpack.treeshake.removeDebugLogging ול-webpack.automaticVercelMonitors,
     ו-getWebpackPatch לא רץ כש-next build רץ על Turbopack. ניטור ה-Cron בדרך
     הישנה (strategy "wrapper") נבנה רק ב-webpack.js, ולכן גם הוא לא היה פעיל
     בבנייה הזו. בבנייה של Turbopack ההסרה לא משנה דבר. */
  /**
   * הסרת מודול ה-tracing מחבילת הדפדפן.
   *
   * למה: app/layout.tsx כבר מרנדר את SpeedInsights של Vercel, שנותן
   * Core Web Vitals מ-100% מהתנועה. Sentry מדד את אותם מדדים בדגימה של
   * 20% ועלה כ-55KB של JS מנותח בכל עמוד. זו מדידה כפולה שכבר יש לה
   * מקור טוב יותר.
   *
   * מה לא משתנה: מעקב השגיאות, ה-breadcrumbs, מפות המקור וה-releases.
   * וחשוב מכל, סינון ה-PII ב-beforeSend
   * וב-scrubRequest לא נוגע בזה בכלל.
   *
   * דגלי ה-Replay: הפרויקט לא משתמש ב-Session Replay, ולכן שלושת
   * המודולים שלו הם משקל מת.
   */
  bundleSizeOptimizations: {
    excludeTracing: true,
    excludeReplayShadowDom: true,
    excludeReplayIframe: true,
    excludeReplayWorker: true,
  },
});

/**
 * ה-SDK של Sentry לא מאותחל בצד הלקוח, בכוונה. הקובץ instrumentation-client.ts
 * נמחק ב-1.10.2026.
 *
 * מה שנמדד על האתר החי לפני ההחלטה: צ׳אנק אחד של 145,958 בתים gzip נטען
 * בכל עמוד שנבדק (הבית, /studio, /podcast, /events/dj-events, /book).
 * בתוכו, קריאת האתחול הייתה
 * `{dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, tracesSampleRate: .2}`,
 * כלומר ה-DSN נשאר קריאת סביבה ולא הוחלף במחרוזת. משתני NEXT_PUBLIC
 * מוחלפים בערכם בזמן הבנייה, ולכן זו עדות שלא היה DSN בבנייה, והספרייה
 * אותחלה בלי יעד ולא שלחה כלום. אותה עובדה מוסברת גם בסעיף ה-CSP למעלה:
 * יעד הדיווח נגזר מה-DSN, ולכן גם הוא ריק.
 *
 * מה נשאר עובד: ניטור בצד השרת ובקצה דרך instrumentation.ts,
 * sentry.server.config.ts ו-sentry.edge.config.ts, ו-captureException
 * במסלולי ה-API דרך lib/sentry-capture.ts. כל אלה רצים על השרת ואינם
 * נשלחים לדפדפן.
 *
 * להחזיר: ליצור מחדש את instrumentation-client.ts (הגרסה הקודמת בהיסטוריה,
 * כולל סינון ה-PII ב-beforeSend) ולהגדיר NEXT_PUBLIC_SENTRY_DSN ב-Vercel.
 * בלי ה-DSN אין טעם בקובץ.
 */
