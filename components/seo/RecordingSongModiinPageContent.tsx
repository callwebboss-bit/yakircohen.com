import Link from "next/link";
import StudioExperienceSection from "@/components/booking/StudioExperienceSection";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ServicePageSchema from "@/components/seo/ServicePageSchema";
import ServiceBlogStrip from "@/components/blog/ServiceBlogStrip";
import { getBlogPostsByServiceSlug } from "@/lib/data/blog";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServicePagePricingSection from "@/components/services/ServicePagePricingSection";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  RECORDING_SONG_EQUIPMENT,
  RECORDING_SONG_PROCESS_STEPS,
  RECORDING_SONG_TESTIMONIALS,
} from "@/lib/data/recording-song-modiin-page";
import { RECORDING_SONG_MODIIN_VIDEOS } from "@/lib/data/youtube-showcases";
import { getStudioService } from "@/lib/data/services";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from "@/lib/constants";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import RecordingSongInquiryForm from "@/components/seo/RecordingSongInquiryForm";
import RecordingSongBeforeAfter from "@/components/seo/RecordingSongBeforeAfter";
import FullProductionShowcaseSection from "@/components/seo/FullProductionShowcaseSection";
import RecordingSongFinalCTA from "@/components/seo/RecordingSongFinalCTA";

const service = getStudioService("recording-song-modiin");

const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

const whatsappHref = buildWhatsAppHref({
  text: "שלום, מעוניין להקליט שיר באולפן במודיעין",
  utm_source: "website",
  utm_campaign: "recording_song_hero_cta",
});

const eventGridWhatsappHref = buildWhatsAppHref({
  text: "שלום, רציתי להתייעץ על השיר לאירוע שלנו",
  utm_source: "website",
  utm_campaign: "recording_song_event_grid_cta",
});

export default function RecordingSongModiinPageContent() {
  return (
    <>
      <ServicePageSchema service={service} />
      {service.faqs.length > 0 ? (
        <FaqPageSchema
          items={service.faqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          }))}
        />
      ) : null}
      <ServicePageLayout
        {...heroProps}
        title={service.title}
        subtitle={service.subtitle}
        features={service.features}
        whatsappText={service.whatsappText}
        utmCampaign={service.utmCampaign}
        bookSlug={service.slug}
      >
        <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
          <ContextualIntroParagraph
            pathname="/studio/recording-song-modiin"
            className="max-w-3xl"
          />

          {/* 1. Why Original Song */}
          <section
            className="max-w-3xl"
            aria-labelledby="why-original-song-heading"
          >
            <h2
              id="why-original-song-heading"
              className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה שיר מקורי באולפן הוא המתנה העוצמתית ביותר לאירוע שלכם?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              שיר DJ שכולם מכירים נשמע טוב בזמן האירוע - ונשכח תוך שבוע. שיר
              שהקלטתם בעצמכם, עם המילים שלכם, עם הקול שלכם, הוא נכס משפחתי
              שישמר לנצח. זה ההבדל בין חוויה חד-פעמית לבין משהו שתעבירו
              מדור לדור.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              ההורים שמביאים את ילדם לבר מצווה - ויוצאים עם שיר שהילד הקליט
              בעצמו - לא שוכחים את הרגע הזה לעולם. ולא רק הם: גם הילד גדל
              יחד עם השיר הזה. עוד 10 שנים הוא יקשיב לו ויחייך.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              ובנוסף - השיר שלכם נשמר בשרתי האולפן המאובטחים שלנו.{" "}
              <strong className="text-foreground">
                בעוד מספר שנים, כשתרצו להקשיב לו שוב או להשתמש בו בחתונה
                של הילד - הקובץ צפוי להיות זמין בלחיצת כפתור.
              </strong>
            </p>
          </section>

          {/* 2. Event Services Grid */}
          <section aria-labelledby="event-services-heading">
            <header className="mx-auto max-w-2xl text-center">
              <h2
                id="event-services-heading"
                className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                הפקת שיר לאירוע במודיעין - כל סוגי השירים ברמה הגבוהה ביותר
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                מבר מצווה ועד חופה - לכל אירוע יש שיר שיהפוך אותו לבלתי נשכח
              </p>
            </header>

            <div className="mt-10 space-y-6">
              {/* Bar Mitzvah */}
              <article className="relative rounded-xl border border-border bg-surface p-6 sm:p-8">
                <span className="absolute -top-3 right-6 rounded-full bg-brand-red px-3 py-1 text-xs font-semibold text-white">
                   
                </span>
                <div className="flex items-start gap-4">
                  <span className="text-3xl" aria-hidden>
                    🎤
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      הקלטת שיר לבר מצווה / שיר לבת מצווה
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      <strong className="text-foreground">
                        האירוע מתקרב, הילד מתרגש
                      </strong>
                      , ואתם רוצים שהכניסה שלו לאולם תהיה עוצמתית - ולא עוד
                      שיר בנאלי שכולם כבר שמעו. הפתרון: שיר בר מצווה מקורי
                      שיוצר חיבור מיידי עם הקהל ומנציח את הרגע הגדול שלו
                      לכל החיים.
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      גם ילד שמתביישן להוציא צליל - יוצא מהאולפן עם שיר
                      שהוא גאה בו. אנחנו לא משחררים הקלטה עד שהילד עצמו
                      מרוצה מהתוצאה.
                    </p>
                  </div>
                </div>
              </article>

              {/* Wedding / Chupa */}
              <article className="rounded-xl border border-border bg-surface p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="text-3xl" aria-hidden>
                    💍
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      הקלטת שיר לחתונה / שיר כניסה לחתונה
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      רגע הכניסה לחופה הוא הרגע שכולם מצלמים, שכולם בוכים,
                      שכולם זוכרים. שיר שהקלטתם בעצמכם - בקולכם, עם המילים
                      שלכם - הופך אותו לסרט. הצמרמורת שהאורחים ירגישו? לא
                      תיגמר.
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      הטכנולוגיה שלנו לא הופכת אתכם למחשב - היא פשוט מוציאה
                      את הגרסה הכי טובה, נקייה ומחמיאה של הקול הטבעי שלכם,
                      כדי שתוכלו להקשיב לעצמכם בגאווה.
                    </p>
                  </div>
                </div>
              </article>

              {/* Family Songs */}
              <article className="rounded-xl border border-border bg-surface p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="text-3xl" aria-hidden>
                    🫂
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      שירי תודה, שירי אמא/אבא וביצועים משפחתיים קבוצתיים
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      כשסבא, אבא והבן שרים יחד שיר אחד - זה לא סתם הקלטה.
                      זה רגע שמחבר דורות. שיר תודה לאמא מהילדים, שיר שלושה
                      אחים לחתונה, כל המשפחה שרה שורה אחת - כולם יבכו,
                      כולם יצחקו, וכולם ישמרו את זה לנצח.
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      מסלולי הקבוצה שלנו מאפשרים לכמה בני משפחה להקליט יחד
                      או בנפרד - ואנחנו מחברים הכל לקטע אחד מרגש.
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <div className="mt-8 text-center">
              <a
                href={eventGridWhatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3.5 text-sm font-semibold text-white hover:bg-brand-red-light"
              >
                רוצים להתייעץ על השיר שלכם? דברו איתי בוואטסאפ ←
              </a>
              <p className="mt-2 text-xs text-muted-foreground">
                בלי שום התחייבות - נשמח רק לשמוע איזה שיר אתם אוהבים ולעזור
                לכם לבחור את הפלייבק המתאים
              </p>
            </div>
          </section>

          {/* 3. Before/After Audio */}
          <section aria-labelledby="before-after-heading">
            <header className="mx-auto max-w-2xl text-center">
              <h2
                id="before-after-heading"
                className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                איך זה נשמע? כוחה של עריכת סאונד מקצועית
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                הבדל של שמיים וארץ בין הקלטה גולמית לבין תוצאה סופית מלוטשת
              </p>
            </header>
            <div className="mt-8">
              <RecordingSongBeforeAfter />
            </div>
          </section>

          <FullProductionShowcaseSection
            variant="recording"
            className="border-t"
          />

          {/* 4. No-Fear Value Prop */}
          <section
            className="rounded-2xl border border-brand-red/25 bg-brand-red/5 p-6 text-center sm:p-10"
            aria-labelledby="no-fear-heading"
          >
            <p className="text-4xl" aria-hidden>
              🎤
            </p>
            <h2
              id="no-fear-heading"
              className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl"
            >
              מפחדים לזייף?
            </h2>
            <p className="mt-3 text-lg font-medium text-foreground">
              תנשמו עמוק. בשביל זה אנחנו כאן.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              מעל 500 משפחות ממודיעין, מכבים ורעות הקליטו שיר באולפן - רובן
              בלי שום ניסיון שירה. עם ליווי אישי וטכנולוגיית AI מתקדמת, כל
              שיר יוצא מרגש ומדויק.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {[
                { emoji: "🎯", text: "AI מתקן זיופים בעדינות" },
                { emoji: "🤝", text: "ליווי אישי לאורך כל ההקלטה" },
                { emoji: "⚡", text: "מסירה תוך 48 שעות" },
              ].map((pill) => (
                <div
                  key={pill.text}
                  className="flex items-center gap-2 rounded-full border border-brand-red/20 bg-background px-4 py-2 text-sm font-medium text-foreground"
                >
                  <span aria-hidden>{pill.emoji}</span>
                  {pill.text}
                </div>
              ))}
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-red px-8 py-3.5 text-base font-semibold text-white hover:bg-brand-red-light"
            >
              בואו נתחיל ←
            </a>
            <p className="mt-3 text-xs text-muted-foreground">
              יש לכם שאלות טכניות?{" "}
              <a
                href="#studio-faq"
                className="underline hover:text-foreground"
              >
                קפצו לקריאת השאלות הנפוצות
              </a>
            </p>
          </section>

          {/* 5. Video Examples */}
          <ShowcaseVideoSection playlistId="recording-song-modiin" />

          {/* 6. Local Social Proof */}
          <section
            className="rounded-xl border border-border bg-surface p-6 sm:p-8"
            aria-label="אמינות מקומית"
          >
            <p className="text-center text-sm leading-relaxed text-muted-foreground">
              כבר מעל{" "}
              <strong className="text-foreground">500 משפחות</strong> ממודיעין,
              מכבים, רעות ומהסביבה הקליטו שיר באולפן - מאירועי בית ספר עירוני
              א׳ ובית ספר שבלולים, דרך אירועי עיריית מודיעין ועד לחתונות
              פרטיות.
            </p>
          </section>

          {/* 7. Studio Advantage */}
          <section aria-labelledby="studio-advantage-heading">
            <header className="mx-auto max-w-2xl text-center">
              <h2
                id="studio-advantage-heading"
                className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                הקלטת שיר באולפן מקצועי במודיעין לעומת הקלטה ביתית
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                למה 500+ משפחות בחרו לנסוע לאולפן ולא להקליט בסמארטפון?
              </p>
            </header>
            <div className="mt-10 overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-4 text-right font-semibold text-muted-foreground">
                      &nbsp;
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-muted-foreground">
                      הקלטה ביתית / סמארטפון
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-brand-red">
                      אולפן מקצועי במודיעין
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    [
                      "איכות סאונד",
                      "רעשי רקע, הד ותהודה בחדר",
                      "אקוסטיקה מחושבת - אפס רעשים",
                    ],
                    [
                      "ציוד הקלטה",
                      "מיקרופון אוניברסלי",
                      "Shure SM7B, SphereL22 - ציוד בינלאומי",
                    ],
                    [
                      "ליווי מקצועי",
                      "לבד מול המסך",
                      "מאמן ווקאל בזמן אמת לאורך כל ההקלטה",
                    ],
                    [
                      "עריכה",
                      "אוטומטית ובסיסית",
                      "מיקס ומאסטר מלא + AI pitch correction",
                    ],
                    [
                      "שמירת הקובץ",
                      "אצלכם בלבד",
                      "גיבוי ענן לכל החיים - זמין תמיד בלחיצת כפתור",
                    ],
                    [
                      "נגישות",
                      "-",
                      "מרכז מודיעין - 15 דקות ממכבים ורעות",
                    ],
                  ].map(([feature, home, studio]) => (
                    <tr key={feature} className="bg-surface hover:bg-muted/20">
                      <td className="px-6 py-4 font-medium text-foreground">
                        {feature}
                      </td>
                      <td className="px-6 py-4 text-center text-muted-foreground">
                        {home}
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-foreground">
                        {studio}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 8. Tips for Parents */}
          <section
            className="rounded-xl border border-border bg-surface p-6 sm:p-8"
            aria-labelledby="tips-heading"
          >
            <h2
              id="tips-heading"
              className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              טיפים זהב מהאולפן: איך לבחור שיר ולהגיע מוכנים להקלטה
            </h2>
            <ul className="mt-6 space-y-5">
              <li className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex-shrink-0 text-lg text-brand-red"
                  aria-hidden
                >
                  ✦
                </span>
                <div>
                  <p className="font-semibold text-foreground">
                    כיצד לבחור את הלחן הנכון
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    בחרו שיר שנשמע טוב בטווח הטבעי של קולכם - לא כזה שדורש
                    להגיע לנקודות גבוהות מדי. אם אתם לא בטוחים, שלחו לנו
                    הקלטה קצרה של עצמכם שרים ואנחנו נמליץ על פלייבק שיחמיא
                    לקולכם.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex-shrink-0 text-lg text-brand-red"
                  aria-hidden
                >
                  ✦
                </span>
                <div>
                  <p className="font-semibold text-foreground">
                    איך לעבוד על הטקסט מראש
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    אם אתם כותבים מילים מקוריות - קראו אותן בקול רם כמה
                    פעמים לפני שמגיעים לאולפן. בדקו שהחריזה זורמת טבעית
                    ושהמילים לא &ldquo;מתנגשות&rdquo; בתוך הלחן. לא בטוחים?
                    אנחנו יכולים לעזור בגיבוש הטקסט.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex-shrink-0 text-lg text-brand-red"
                  aria-hidden
                >
                  ✦
                </span>
                <div>
                  <p className="font-semibold text-foreground">
                    למה לא צריך להתאמן עד צרידות
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    הגיעו לאולפן עם קול טרי - לא עם גרון עייף מ-3 ימי חזרות
                    אינטנסיביות. ההקלטה הכי טובה נוצרת כשהאנרגיה טבעית
                    ורעננה. אם רוצים לתרגל - שרו בנינוחות, אל תלחצו על
                    הקול.
                  </p>
                </div>
              </li>
            </ul>
          </section>

          {/* 9. Process */}
          <section aria-labelledby="process-heading">
            <header className="mx-auto max-w-2xl text-center">
              <h2
                id="process-heading"
                className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                מה כולל העבודה?
              </h2>
            </header>
            <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {RECORDING_SONG_PROCESS_STEPS.map((item) => (
                <li
                  key={item.step}
                  className="rounded-xl border border-border bg-surface p-6"
                >
                  <span className="text-xs font-bold tracking-widest text-brand-red">
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  {item.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mt-2 text-sm leading-relaxed text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                </li>
              ))}
            </ol>
          </section>

          {/* Upsell: Online mixing/mastering */}
          <div className="rounded-xl border border-brand-red/20 bg-surface p-5">
            <p className="font-semibold text-foreground">שדרג את ההקלטה לאחר האולפן</p>
            <p className="mt-2 text-sm text-muted-foreground">
              מיקס מקצועי, תיקון זיופים או ניקוי רעשים - הכל אפשרי מרחוק תוך ימים בודדים.{" "}
              <Link href="/online/vocal-fix/mixing" className="font-semibold text-brand-red hover:underline">
                שירות מיקס ומאסטרינג ←
              </Link>
            </p>
          </div>

          {/* 10. Testimonials */}
          <section aria-labelledby="testimonials-heading">
            <header className="mx-auto max-w-2xl text-center">
              <h2
                id="testimonials-heading"
                className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                מה אומרים הלקוחות
              </h2>
            </header>
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {RECORDING_SONG_TESTIMONIALS.map((t) => (
                <li
                  key={t.author}
                  className="rounded-xl border border-border bg-surface p-6"
                >
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="mt-4 text-sm font-semibold text-foreground">
                    {t.author}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </li>
              ))}
            </ul>
          </section>

          <StudioExperienceSection />

          {/* 11. Pricing */}
          <ServicePagePricingSection
            service={service}
            heading="מחירון שקוף"
            subheading="בלי הפתעות. המחיר שרואים הוא המחיר ששולמים."
          />

          {/* 12. Equipment */}
          <section aria-labelledby="equipment-heading">
            <header className="mx-auto max-w-2xl text-center">
              <h2
                id="equipment-heading"
                className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                הציוד שלנו
              </h2>
            </header>
            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {RECORDING_SONG_EQUIPMENT.map((item) => (
                <li
                  key={item.title}
                  className="rounded-xl border border-border bg-surface p-6"
                >
                  <p className="text-2xl" aria-hidden>
                    {item.emoji}
                  </p>
                  <h3 className="mt-3 text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              כל המחירים כולל מע״מ. ניתן לשלם בצ׳ק, אשראי, העברה בנקאית או
              PayPal.
            </p>
          </section>

          {/* 13. Gallery */}
          <ServiceShowcaseSections
            assetsFolder={service.assetsFolder}
            playlistEmbedUrl={null}
            mediaType="gallery"
            galleryLabel="תמונות מהאולפן"
            showGallery
          />

          {/* 14. FAQ - native HTML5 details/summary */}
          <section id="studio-faq" aria-labelledby="faq-heading">
            <header className="mx-auto max-w-2xl text-center">
              <h2
                id="faq-heading"
                className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                שאלות ותשובות
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                לפני שמתחילים להקליט
              </p>
            </header>
            <div className="mx-auto mt-10 max-w-3xl divide-y divide-border rounded-xl border border-border bg-surface px-4 sm:px-6">
              {service.faqs.map((faq) => (
                <details key={faq.id} className="group py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 outline-none">
                    <h3 className="text-start text-sm font-semibold text-foreground sm:text-base">
                      {faq.question}
                    </h3>
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-brand-red transition-transform duration-200 group-open:rotate-180"
                      aria-hidden
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="pb-5 pt-1 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* 15. Inquiry Form */}
          <RecordingSongInquiryForm />

          {/* 16. Final Conversion CTA */}
          <RecordingSongFinalCTA />

          {/* 17. Smartphone Blessing */}
          <section
            className="rounded-xl border border-brand-red/25 bg-surface p-6 sm:p-8"
            aria-labelledby="smartphone-blessing-heading"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-brand-red">
              חדש
            </p>
            <h2
              id="smartphone-blessing-heading"
              className="mt-2 font-serif text-xl font-semibold text-foreground sm:text-2xl"
            >
              הקלטת דרשה / ברכה בסמארטפון
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              הקלטה מהבית + עריכה מקצועית + מוזיקת רקע. ברכת כלה או חתן, ברכת
              הכהנים לבר/בת מצווה, דרשה מרגשת או ברכות משפחה - אפשר להקליט גם
              בבית, אבל הקלטה באולפן מקצועי היא רמה אחרת: תוצאה חדה, מרגשת
              ומקצועית שתהפוך את הרגע באירוע לבלתי נשכח.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
              {["ברכת כלה", "ברכת חתן", "דרשה", "ברכות משפחה"].map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-border bg-background px-3 py-1"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/studio/blessings/bride-groom-blessing"
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
              >
                ברכת חתן וכלה
              </Link>
              <Link
                href="/studio/recording-song-modiin/gifts"
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
              >
                מתנות ושוברים מהאולפן
              </Link>
              <Link
                href="/studio/blessings/bar-mitzvah"
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
              >
                בר מצווה
              </Link>
            </div>
          </section>

          {/* 18. Hours */}
          <section
            className="rounded-xl border border-border bg-surface p-6 text-sm text-muted-foreground"
            aria-labelledby="hours-heading"
          >
            <h2 id="hours-heading" className="font-semibold text-foreground">
              שעות פעילות
            </h2>
            <ul className="mt-3 space-y-2">
              <li>
                מענה טלפוני במשרדים: א׳-ה׳ 10:00-20:00 -{" "}
                <a
                  href={`tel:${CONTACT_PHONE_E164}`}
                  className="font-medium text-brand-red hover:underline"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>{" "}
                (גם בוואטסאפ)
              </li>
              <li>שעות האולפנים: א׳-ה׳ 10:00-22:00 | ו׳ 10:00-15:00</li>
            </ul>
          </section>

          {/* 19. Chip links */}
          <section className="flex flex-wrap justify-center gap-3 pb-4">
            <Link
              href="/studio/blessings/video-clip"
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              שיר + קליפ באולפן
            </Link>
            <Link
              href="/voucher"
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              שובר מתנה
            </Link>
            <Link
              href="/book"
              className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              הזמנה מקוונת
            </Link>
          </section>

          <ServiceBlogStrip posts={getBlogPostsByServiceSlug("studio/recording-song-modiin")} />
          <PageRelatedFooter pathname="/studio/recording-song-modiin" />
        </div>
      </ServicePageLayout>
    </>
  );
}
