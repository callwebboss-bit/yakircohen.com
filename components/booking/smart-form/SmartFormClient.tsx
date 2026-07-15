"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import VisualReceipt from "@/components/booking/smart-form/VisualReceipt";
import SmartFormLoading from "@/components/booking/smart-form/SmartFormLoading";
import ContactChannelChooser from "@/components/booking/smart-form/ContactChannelChooser";
import SmartFormProcessStrip from "@/components/booking/smart-form/SmartFormProcessStrip";
import SmartFormCategoryFaq from "@/components/booking/smart-form/SmartFormCategoryFaq";
import SmartFormDemoModal from "@/components/booking/smart-form/SmartFormDemoModal";
import SmartFormStandards from "@/components/booking/smart-form/SmartFormStandards";
import LazyYouTubePlayer from "@/components/marketing/LazyYouTubePlayer";
import Link from "next/link";
import {
  SMART_FORM_ANTI_LEAD_MESSAGE,
  SMART_FORM_STEP1_CATEGORIES,
  getSmartFormCategory,
  type SmartFormCategoryId,
} from "@/lib/data/smart-form-matrix";
import {
  SMART_FORM_DELIVERY_NOTE,
  getSmartFormEnrichment,
  getSmartFormFaqs,
  returnPotentialLabel,
} from "@/lib/data/smart-form-enrichment";
import { YOUTUBE_SERVICE_EMBED_IDS } from "@/lib/data/youtube-embeds";
import { calculateSmartFormEstimate } from "@/lib/smart-form-estimate";
import {
  buildSmartFormBookHref,
  saveSmartFormSession,
  type SmartFormState,
} from "@/lib/smart-form-url";
import {
  readBookCoreContact,
  saveBookCoreContact,
} from "@/lib/book-wizard-cro/shared-contact";
import { notifyLeadByEmailAsync } from "@/lib/lead-email-notify";
import { buildSmartFormLeadEmailBody } from "@/lib/smart-form-lead-email";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { appendYcLeadTag } from "@/lib/yc-lead-tag";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { validateIsraeliMobile, validatePersonName } from "@/lib/form-validation";
import { formatIlMobileDisplay, normalizeIlMobile } from "@/lib/leads/format-phone-il";
import { SITE_URL } from "@/lib/site-url";

const TOUCH_BTN = "min-h-[48px] touch-manipulation select-none";

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function parseContact(contactMethod: string): { phone?: string; email?: string } {
  const trimmed = contactMethod.trim();
  if (!trimmed) return {};
  if (looksLikeEmail(trimmed)) return { email: trimmed };
  const normalized = normalizeIlMobile(trimmed);
  if (normalized) return { phone: normalized };
  return { phone: trimmed };
}

export default function SmartFormClient() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [categoryId, setCategoryId] = useState<SmartFormCategoryId | null>(null);
  const [selectedChipIds, setSelectedChipIds] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [socialOrId, setSocialOrId] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSentHint, setEmailSentHint] = useState(false);
  const [contactHighlight, setContactHighlight] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const submitLockRef = useRef(false);
  const navigatedRef = useRef(false);
  const contactInputRef = useRef<HTMLInputElement>(null);

  const category = categoryId ? getSmartFormCategory(categoryId) : null;
  const enrichment = getSmartFormEnrichment(categoryId);
  const faqs = useMemo(() => getSmartFormFaqs(categoryId), [categoryId]);
  const isAntiLead = Boolean(category?.antiLead);

  useEffect(() => {
    const known = readBookCoreContact();
    setIsReturning(Boolean(known?.phone?.trim() || known?.name?.trim()));
  }, []);

  const estimate = useMemo(
    () => calculateSmartFormEstimate(categoryId, selectedChipIds),
    [categoryId, selectedChipIds],
  );

  const goToStep = (nextStep: number) => setStep(nextStep);

  const selectCategory = (id: SmartFormCategoryId) => {
    setCategoryId(id);
    setSelectedChipIds([]);
    setError(null);
    setTermsAccepted(false);
    goToStep(2);
  };

  const toggleChip = (chipId: string) => {
    setSelectedChipIds((prev) =>
      prev.includes(chipId) ? prev.filter((x) => x !== chipId) : [...prev, chipId],
    );
  };

  const buildState = useCallback((): SmartFormState => {
    return {
      categoryId,
      selectedChipIds,
      name: name.trim(),
      contactMethod: contactMethod.trim(),
      socialOrId: socialOrId.trim(),
      termsAccepted,
      baseCatalogId: estimate.baseCatalogId,
      estimateExVat: estimate.totalExVat,
      upsellCatalogIds: estimate.lines
        .filter((l) => l.kind === "upsell")
        .map((l) => l.catalogId),
      bookCategory: category?.bookCategory ?? null,
    };
  }, [
    categoryId,
    selectedChipIds,
    name,
    contactMethod,
    socialOrId,
    termsAccepted,
    estimate,
    category?.bookCategory,
  ]);

  const summaryLine = useMemo(() => {
    if (!category) return "";
    const prep =
      enrichment?.prepHref
        ? `הכנה לאולפן: ${SITE_URL}${enrichment.prepHref}`
        : "";
    const parts = [
      `שירות: ${category.title}`,
      estimate.baseCatalogId ? `קטלוג: ${estimate.baseCatalogId}` : "",
      estimate.totalExVat
        ? `הערכת תקציב: ${estimate.totalExVat.toLocaleString("he-IL")} ₪ לפני מע״מ`
        : "",
      enrichment
        ? `פוטנציאל חזרה: ${returnPotentialLabel(enrichment.returnPotential)}`
        : "",
      socialOrId.trim() ? `זהות / רשת: ${socialOrId.trim()}` : "",
      prep,
    ];
    return parts.filter(Boolean).join("\n");
  }, [category, estimate, socialOrId, enrichment]);

  useEffect(() => {
    function onEmailChannel() {
      if (loading || submitLockRef.current) return;
      const state = buildState();
      void notifyLeadByEmailAsync({
        formId: "smart_form_book",
        subject: "פנייה מ-Smart Form",
        body: buildSmartFormLeadEmailBody(state),
        name: state.name || undefined,
        phone: parseContact(state.contactMethod).phone,
        email: parseContact(state.contactMethod).email,
      }).then(() => setEmailSentHint(true));
    }

    window.addEventListener("yc-smart-form-email-channel", onEmailChannel);
    return () => window.removeEventListener("yc-smart-form-email-channel", onEmailChannel);
  }, [buildState, loading]);

  const focusContactField = (message: string) => {
    setError(message);
    setContactHighlight(true);
    window.requestAnimationFrame(() => {
      contactInputRef.current?.focus();
      contactInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const validateBeforeContinue = (): boolean => {
    if (!category || category.antiLead) {
      setError(category?.antiLeadMessage || SMART_FORM_ANTI_LEAD_MESSAGE);
      return false;
    }
    if (!termsAccepted) {
      setError("יש לאשר את תנאי השימוש ושההקלטה אינה סמויה או לא חוקית.");
      return false;
    }
    const nameResult = validatePersonName(name);
    if (!nameResult.ok) {
      setError(nameResult.errors.name || nameResult.global || "נא למלא שם.");
      return false;
    }
    if (!contactMethod.trim()) {
      const msg = socialOrId.trim()
        ? "יש טלפון או אימייל לחזרה - בלי זה לא נוכל לחזור אליכם."
        : "נא למלא טלפון (מומלץ) או אימייל לחזרה.";
      focusContactField(msg);
      return false;
    }
    const contact = parseContact(contactMethod);
    if (contact.phone && !looksLikeEmail(contactMethod)) {
      const phoneResult = validateIsraeliMobile(contact.phone);
      if (!phoneResult.ok) {
        focusContactField(phoneResult.errors.phone || phoneResult.global || "טלפון לא תקין.");
        return false;
      }
    }
    if (!looksLikeEmail(contactMethod) && !contact.phone) {
      focusContactField("נא למלא אימייל או מספר נייד ישראלי.");
      return false;
    }
    setContactHighlight(false);
    setError(null);
    return true;
  };

  const finishNavigate = useCallback(() => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    const state = buildState();
    saveSmartFormSession(state);
    const contact = parseContact(state.contactMethod);
    if (contact.phone || state.name) {
      saveBookCoreContact({
        name: state.name,
        phone: contact.phone
          ? formatIlMobileDisplay(contact.phone) || contact.phone
          : "",
      });
    }
    const href = buildSmartFormBookHref(state);
    setLoading(false);
    router.push(href);
  }, [buildState, router]);

  const handleContinue = () => {
    if (loading || submitLockRef.current) return;
    if (!validateBeforeContinue()) return;
    submitLockRef.current = true;
    setLoading(true);
  };

  const handleWhatsAppPrefill = () => {
    if (loading || submitLockRef.current) return;
    if (!validateBeforeContinue()) return;
    const state = buildState();
    const contact = parseContact(state.contactMethod);
    let body = [
      name ? `שלום, כאן ${name}.` : "שלום,",
      summaryLine,
      contactMethod ? `יצירת קשר: ${contactMethod}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    body = appendYcLeadTag(body, {
      service: category?.bookCategory || "studio",
      price: estimate.totalExVat || undefined,
      source: "/book",
      step: 2,
      intent: "continue_chat",
      form: "smart_form_book",
      purpose:
        enrichment?.returnPotential === "event_based" ? "gift" : "professional",
      timing: selectedChipIds.some((id) => id.includes("express"))
        ? "urgent"
        : undefined,
    });

    if (enrichment?.prepHref) {
      body += `\n\nהכנה לאולפן: ${SITE_URL}${enrichment.prepHref}`;
    }
    const waHref = buildWhatsAppHref({
      text: body,
      utm_campaign: "smart_form_book",
    });
    openWhatsAppLead(waHref, { leadCategory: category?.bookCategory || "studio" });
    void notifyLeadByEmailAsync({
      formId: "smart_form_book",
      subject: "ליד Smart Form - וואטסאפ",
      body: buildSmartFormLeadEmailBody(state),
      name: name.trim() || undefined,
      phone: contact.phone,
      email: contact.email,
      crossSell: {
        bookCategory: category?.bookCategory || "studio",
      },
    });
  };

  return (
    <>
      <section
        id="smart-form"
        className="w-full max-w-2xl mx-auto overflow-hidden bg-white p-6 rounded-lg shadow-sm border border-border scroll-mt-24 touch-manipulation"
        aria-labelledby="smart-form-heading"
      >
        <div className="dir-ltr overflow-hidden" dir="ltr">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
          >
            {/* Step 1 */}
            <div className="w-full flex-shrink-0" dir="rtl" aria-hidden={step !== 1}>
              <div className="mb-4 overflow-hidden rounded-xl border border-border">
                <LazyYouTubePlayer
                  videoId={YOUTUBE_SERVICE_EMBED_IDS["studio-hub"]}
                  title="מה מחכה לכם באולפן"
                  className="aspect-video w-full"
                />
              </div>
              <h2 id="smart-form-heading" className="text-xl font-bold mb-2 text-foreground">
                מה באת לעשות?
              </h2>
              <p className="mb-6 text-sm text-muted-foreground">
                בחרו כרטיס אחד - אחר כך פרטים והערכת תקציב
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SMART_FORM_STEP1_CATEGORIES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectCategory(item.id)}
                    className={`${TOUCH_BTN} p-6 text-right border border-border rounded-xl hover:border-brand-red hover:bg-surface transition-all focus:outline-none focus:ring-2 focus:ring-brand-red`}
                  >
                    <span className="block font-semibold text-foreground">{item.title}</span>
                    {item.antiLead ? (
                      <span className="mt-1 block text-xs text-muted-foreground">
                        בדיקת התאמה
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-center text-[11px] text-muted-foreground">
                מעל 500 זוגות ומשפחות הקליטו איתנו
              </p>
            </div>

            {/* Step 2 */}
            <div className="w-full flex-shrink-0" dir="rtl" aria-hidden={step !== 2}>
              <div className="flex items-center mb-6 gap-3">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className={`${TOUCH_BTN} text-sm text-muted-foreground hover:text-brand-red underline px-2`}
                  disabled={loading}
                >
                  חזור
                </button>
                <h2 className="text-xl font-bold text-foreground">
                  {category?.title || "פרטים נוספים"}
                </h2>
              </div>

              {isAntiLead ? (
                <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                  <p>{category?.antiLeadMessage || SMART_FORM_ANTI_LEAD_MESSAGE}</p>
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className={`${TOUCH_BTN} rounded-lg border border-red-300 bg-white px-4 font-semibold text-foreground`}
                  >
                    בחרו שירות אחר
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {category?.reassurance ? (
                    <p className="text-sm text-muted-foreground">{category.reassurance}</p>
                  ) : null}

                  {enrichment ? (
                    <>
                      <SmartFormProcessStrip
                        steps={enrichment.processSteps}
                        deliveryNote={SMART_FORM_DELIVERY_NOTE}
                      />
                      <SmartFormCategoryFaq
                        faqs={faqs}
                        prepHref={enrichment.prepHref}
                        prepLabel={enrichment.prepLabel}
                      />
                      <button
                        type="button"
                        onClick={() => setDemoOpen(true)}
                        className={`${TOUCH_BTN} w-full rounded-lg border border-border bg-white px-4 text-sm font-semibold text-foreground hover:border-brand-red`}
                        disabled={loading}
                      >
                        תראה איך זה נשמע (לפני / אחרי)
                      </button>
                    </>
                  ) : null}

                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground">סוג / תוספות</p>
                    <div className="flex flex-wrap gap-2">
                      {category?.chips.map((chip) => {
                        const active = selectedChipIds.includes(chip.id);
                        return (
                          <button
                            key={chip.id}
                            type="button"
                            title={chip.tooltip}
                            aria-pressed={active}
                            aria-describedby={chip.tooltip ? `tip-${chip.id}` : undefined}
                            onClick={() => toggleChip(chip.id)}
                            className={`${TOUCH_BTN} rounded-full border px-4 text-sm transition-colors ${
                              active
                                ? "border-brand-red bg-brand-red/10 font-semibold text-brand-red"
                                : "border-border bg-white text-foreground hover:border-brand-red"
                            }`}
                            disabled={loading}
                          >
                            {chip.label}
                            {chip.tooltip ? (
                              <span id={`tip-${chip.id}`} className="sr-only">
                                {chip.tooltip}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <VisualReceipt estimate={estimate} isReturning={isReturning} />

                  {enrichment ? (
                    <SmartFormStandards bullets={enrichment.standardsBullets} />
                  ) : null}

                  {enrichment?.familyUpsellHref ? (
                    <Link
                      href={enrichment.familyUpsellHref}
                      className="block rounded-lg border border-dashed border-border bg-surface/40 p-3 text-xs text-muted-foreground hover:border-brand-red hover:text-foreground"
                    >
                      <span className="font-medium text-foreground">
                        {enrichment.familyUpsellLabel}
                      </span>
                      <span className="mt-1 block">לפרטים במסלול המשפחתי →</span>
                    </Link>
                  ) : null}

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-foreground">
                      שם
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        className="mt-1 min-h-[48px] w-full rounded-lg border border-border bg-white px-3 text-foreground touch-manipulation"
                        disabled={loading}
                      />
                    </label>
                    <label className="block text-sm font-medium text-foreground">
                      טלפון או אימייל לחזרה
                      <input
                        ref={contactInputRef}
                        type="text"
                        value={contactMethod}
                        onChange={(e) => {
                          setContactMethod(e.target.value);
                          if (e.target.value.trim()) setContactHighlight(false);
                        }}
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="טלפון (מומלץ) או אימייל לחזרה"
                        aria-invalid={contactHighlight}
                        className={`mt-1 min-h-[48px] w-full rounded-lg border bg-white px-3 text-foreground touch-manipulation ${
                          contactHighlight
                            ? "border-red-400 ring-1 ring-red-300"
                            : "border-border"
                        }`}
                        disabled={loading}
                      />
                    </label>
                    <label className="block text-sm font-medium text-foreground">
                      אינסטגרם / פייסבוק / הקשר לזהות{" "}
                      <span className="font-normal text-muted-foreground">(מומלץ)</span>
                      <input
                        type="text"
                        value={socialOrId}
                        onChange={(e) => setSocialOrId(e.target.value)}
                        placeholder="@username או קישור"
                        className="mt-1 min-h-[48px] w-full rounded-lg border border-border bg-white px-3 text-foreground touch-manipulation"
                        disabled={loading}
                      />
                    </label>
                    <label className={`flex ${TOUCH_BTN} items-start gap-3 text-sm text-foreground`}>
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 h-5 w-5 shrink-0 rounded border-border"
                        disabled={loading}
                      />
                      <span>
                        מאשר/ת את תנאי השימוש, וכי זו אינה הקלטה סמויה או לא חוקית.
                      </span>
                    </label>
                  </div>

                  <ContactChannelChooser
                    name={name}
                    contactMethod={contactMethod}
                    summaryLine={summaryLine}
                    disabled={loading}
                  />

                  {emailSentHint ? (
                    <p className="text-xs text-emerald-700">הפרטים נשלחו לצוות. נחזור אליכם.</p>
                  ) : null}

                  {error ? (
                    <p className="text-sm text-red-700" role="alert">
                      {error}
                    </p>
                  ) : null}

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={handleWhatsAppPrefill}
                      disabled={loading}
                      className={`w-full ${TOUCH_BTN} rounded-lg border border-border bg-white py-4 font-bold text-foreground hover:border-brand-red disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      שליחה בוואטסאפ
                    </button>
                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={loading}
                      aria-busy={loading}
                      className={`w-full ${TOUCH_BTN} py-4 bg-brand-red text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {loading ? "מכין..." : "המשך לקביעת תאריך"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <SmartFormLoading active={loading} onDone={finishNavigate} />
      {enrichment ? (
        <SmartFormDemoModal
          open={demoOpen}
          demoId={enrichment.demoId}
          onClose={() => setDemoOpen(false)}
        />
      ) : null}
    </>
  );
}
