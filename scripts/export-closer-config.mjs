/**
 * Exports pricing-catalog + book route presets + blog funnels for yakir-closer sync.
 * Output: local-tools/closer-config.json + closer-config.js (file:// friendly)
 *
 * ⚠️  local-tools/ (yakir-closer.html) NEVER goes to the server -- local-only CRM.
 *     This script only WRITES into local-tools/; it does not deploy anything.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import * as esbuild from "esbuild";

const ROOT = process.cwd();
const CATALOG_FILE = path.join(ROOT, "lib", "data", "pricing-catalog.ts");
const ROUTES_FILE = path.join(ROOT, "lib", "data", "book-audience-routes.ts");
const STUDIO_FILE = path.join(ROOT, "lib", "data", "studio-recording-booking.ts");
const BLOG_FILE = path.join(ROOT, "lib", "data", "blog.ts");
const FILTER_FILE = path.join(ROOT, "lib", "data", "filter-questions.ts");
const REGISTRY_FILE = path.join(ROOT, "lib", "lead-source-registry.ts");
const PODCAST_CALC_FILE = path.join(ROOT, "lib", "data", "podcast-calculator.ts");
const ATTRACTIONS_FILE = path.join(ROOT, "lib", "data", "attractions-calculator.ts");
const CLIPS_SERVICES_FILE = path.join(ROOT, "lib", "data", "booking-calculator-services.ts");
const BRAND_COPY_FILE = path.join(ROOT, "lib", "data", "closer-brand-copy.json");
const OUT_DIR = path.join(ROOT, "..", "local-tools");
if (OUT_DIR.replace(/\\/g, "/").includes("/public/")) {
  throw new Error("export:closer OUT_DIR must not be public/ -- local-tools only");
}
const OUT_JSON = path.join(OUT_DIR, "closer-config.json");
const OUT_JS = path.join(OUT_DIR, "closer-config.js");

const VAT_RATE = 0.18;

function humanizeClientCopy(text) {
  if (!text || typeof text !== "string") return text;
  let out = String(text);
  out = out
    .replace(/\s*[--–]\s*/g, (match, offset, str) => {
      const before = str.slice(Math.max(0, offset - 1), offset);
      if (before === "\n" || before === "." || before === "!" || before === "?") return " ";
      return ". ";
    })
    .replace(/[--–]/g, ", ")
    .replace(/\.{3,}/g, ".")
    .replace(/…/g, ".")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ \./g, ".")
    .replace(/ ,/g, ",")
    .trim();
  return out;
}

function humanizeExportStrings(value) {
  if (typeof value === "string") return humanizeClientCopy(value);
  if (Array.isArray(value)) return value.map(humanizeExportStrings);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = humanizeExportStrings(v);
    return out;
  }
  return value;
}

const SERVICE_SLUG_TO_CLOSER = {
  studio: "recording",
  podcast: "podcast",
  events: "effects_only",
  dj: "dj",
  singer: "live_sound",
  academy: "academy",
  online: "online_ai",
  "online/vocal-fix": "online_ai",
  "online/mashup-fixer": "mashup_fixer",
  "podcast/podcast-editing": "podcast",
  "podcast/podcast-studio-modiin": "podcast",
};

function withVat(exVat) {
  return Math.round(exVat * (1 + VAT_RATE));
}

function parseCatalog(text) {
  const items = [];
  const re = /\{\s*id:\s*"([^"]+)"\s*,\s*label:\s*"([^"]+)"\s*,\s*exVat:\s*(\d+)\s*,\s*category:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    items.push({
      id: m[1],
      label: m[2],
      exVat: Number(m[3]),
      withVat: withVat(Number(m[3])),
      category: m[4],
    });
  }
  return items;
}

function parseBookRoutes(text) {
  const routes = [];
  const start = text.indexOf("export const BOOK_AUDIENCE_ROUTES");
  const end = text.indexOf("export const BOOK_ESCAPE_HATCH", start);
  if (start < 0) return routes;
  const slice = end > start ? text.slice(start, end) : text.slice(start);
  const blocks = slice.split(/\{\s*\n\s*id:\s*"/).slice(1);
  for (const block of blocks) {
    const id = block.match(/^([^"]+)"/)?.[1];
    if (!id) continue;
    const closerServiceId = block.match(/closerServiceId:\s*"([^"]+)"/)?.[1];
    const priceExVat = block.match(/priceExVat:\s*(\d+)/)?.[1];
    if (closerServiceId) {
      routes.push({
        id,
        closerServiceId,
        priceExVat: priceExVat ? Number(priceExVat) : null,
      });
    }
  }
  return routes;
}

function parseStudioPackages(text) {
  const start = text.indexOf("export const STUDIO_RECORDING_PACKAGES");
  const end = text.indexOf("export const STUDIO_RECORDING_UPGRADES", start);
  if (start < 0 || end < 0) return [];
  const slice = text.slice(start, end);
  const packages = [];
  const blockRe =
    /id:\s*"(remote|classic|pro|viral|all_in)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?price:\s*(\d+)/g;
  let m;
  while ((m = blockRe.exec(slice)) !== null) {
    packages.push({
      id: m[1],
      name: m[2],
      price: Number(m[3]),
      withVat: withVat(Number(m[3])),
    });
  }
  return packages;
}

function parseConstNumber(text, name, fallback) {
  const m = text.match(new RegExp(`export const ${name}\\s*=\\s*(\\d+)`));
  return m ? Number(m[1]) : fallback;
}

function parseConstStringArray(text, name) {
  const start = text.indexOf(`export const ${name}`);
  if (start < 0) return [];
  const slice = text.slice(start, start + 600);
  const items = [];
  const re = /"([^"]+)"/g;
  let m;
  while ((m = re.exec(slice)) !== null) items.push(m[1]);
  return items;
}

function parseStudioParticipantRules(studioText) {
  return {
    extraParticipantPrice: parseConstNumber(studioText, "STUDIO_EXTRA_PARTICIPANT_PRICE", 190),
    pairExtraPrice: Math.round(
      parseConstNumber(studioText, "STUDIO_EXTRA_PARTICIPANT_PRICE", 190) / 2,
    ),
    recordingMax: parseConstNumber(studioText, "STUDIO_RECORDING_MAX", 10),
    filmingMax: parseConstNumber(studioText, "STUDIO_FILMING_MAX", 5),
    savingsTipThreshold: parseConstNumber(studioText, "STUDIO_SAVINGS_TIP_THRESHOLD", 5),
    motzashSurcharge: 0.5,
    eligiblePackages: parseConstStringArray(studioText, "GROUP_PRICING_ELIGIBLE_PACKAGES"),
    ineligibleRecordingTypes: parseConstStringArray(
      studioText,
      "GROUP_PRICING_INELIGIBLE_RECORDING_TYPES",
    ),
    videoUpgradeIds: parseConstStringArray(studioText, "STUDIO_VIDEO_UPGRADE_IDS"),
    videoPackageIds: parseConstStringArray(studioText, "STUDIO_VIDEO_PACKAGE_IDS"),
    filmingGuidanceTemplate:
      "📸 שימו לב: האולפן מרווח ומותאם להקלטה שלכם, אך מבחינת זווית המצלמות והתאורה בצילום הקליפ, נחלק אתכם בקפסולות/סבבים של עד {max} אנשים בכל פריים כדי שכולם ייצאו מושלם בווידאו!",
    groupKeywords:
      "חברים|המשפחה|הילדים של|קבוצה|כולנו|כולם|משפחה|הרבה אנשים|כמה אנשים",
  };
}

function parseRecordingTypes(text) {
  const start = text.indexOf("export const RECORDING_TYPES");
  const end = text.indexOf("export const CONSULTATION_PACKAGES", start);
  if (start < 0) return [];
  const slice = text.slice(start, end > start ? end : start + 2000);
  const items = [];
  const re = /id:\s*"([^"]+)"[\s\S]*?label:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(slice)) !== null) {
    items.push({ id: m[1], label: m[2] });
  }
  return items;
}

function parseAtmosphereTypes(text) {
  const start = text.indexOf("export const RECORDING_ATMOSPHERES");
  const end = text.indexOf("export const RECORDING_STUDIO_FAQS", start);
  if (start < 0) return [];
  const slice = text.slice(start, end > start ? end : start + 2000);
  const items = [];
  const re = /id:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(slice)) !== null) {
    items.push({ id: m[1], title: m[2] });
  }
  return items;
}

function unescapeTsString(value) {
  return value.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}

function extractTsStringField(block, field) {
  const re = new RegExp(`${field}:\\s*"((?:\\\\.|[^"\\\\])*)"`);
  const m = block.match(re);
  return m ? unescapeTsString(m[1]) : null;
}

function parseStudioUpgrades(text) {
  const start = text.indexOf("export const STUDIO_RECORDING_UPGRADES");
  const end = text.indexOf("export const EVENT_TYPE_OPTIONS", start);
  if (start < 0) return [];
  const slice = text.slice(start, end > start ? end : start + 8000);
  const arrayStart = slice.indexOf("[");
  const arrayEnd = slice.indexOf("] as const");
  if (arrayStart < 0 || arrayEnd < 0) return [];
  const arrayBody = slice.slice(arrayStart + 1, arrayEnd);
  const blocks = arrayBody
    .split(/\},\s*\{/)
    .map((part, index, all) => {
      let block = part.trim();
      if (!block.startsWith("{")) block = `{${block}`;
      if (!block.endsWith("}")) block = `${block}}`;
      return block;
    })
    .filter((block) => /id:\s*"/.test(block));

  return blocks
    .map((block) => {
      const id = extractTsStringField(block, "id");
      const name = extractTsStringField(block, "name");
      const description = extractTsStringField(block, "description");
      const priceMatch = block.match(/price:\s*(\d+)/);
      const badge = extractTsStringField(block, "badge");
      if (!id || !name || !description || !priceMatch) return null;
      return {
        id,
        name,
        description,
        price: Number(priceMatch[1]),
        ...(badge ? { badge } : {}),
      };
    })
    .filter(Boolean);
}

function parseBlogPosts(text) {
  const posts = [];
  const slugRe = /slug:\s*"([^"]+)"/g;
  let m;
  const slugs = [];
  while ((m = slugRe.exec(text)) !== null) slugs.push({ slug: m[1], index: m.index });

  for (const { slug, index } of slugs) {
    const chunk = text.slice(index, index + 3500);
    const titleM = chunk.match(/title:\s*"([^"]+)"/);
    const youtubeM = chunk.match(/youtubeUrl:\s*"([^"]+)"/);
    const relatedM = chunk.match(/relatedServiceSlug:\s*"([^"]+)"/);
    const audioM = chunk.match(/audioDemoId:\s*"([^"]+)"/);
    const related = relatedM?.[1] ?? "";
    const rootKey = related.split("/")[0];
    posts.push({
      slug,
      title: titleM?.[1] ?? slug,
      youtubeUrl: youtubeM?.[1] ?? null,
      youtubeId: youtubeM?.[1]?.match(/(?:youtu\.be\/|v=)([\w-]{11})/)?.[1] ?? null,
      relatedServiceSlug: related,
      closerServiceId: SERVICE_SLUG_TO_CLOSER[related] ?? SERVICE_SLUG_TO_CLOSER[rootKey] ?? null,
      audioDemoId: audioM?.[1] ?? null,
      blogSource: `blog_${slug}`,
    });
  }
  return posts.filter((p) => p.youtubeUrl || p.audioDemoId);
}

function parseFilterQuestions(text) {
  const timelines = [];
  const tlRe = /id:\s*"([^"]+)"[\s\S]*?label:\s*"([^"]+)"/g;
  const timelineBlock = text.match(/FILTER_QUESTIONS[\s\S]*?id:\s*"timeline"[\s\S]*?options:\s*\[([\s\S]*?)\]/);
  if (timelineBlock) {
    let m;
    while ((m = tlRe.exec(timelineBlock[1])) !== null) {
      timelines.push({ id: m[1], label: m[2] });
    }
  }
  return { timelines };
}

function parseLeadRegistry(text) {
  const entries = [];
  const blockRe =
    /\{\s*formId:\s*"([^"]+)"[\s\S]*?closerServiceId:\s*"([^"]+)"[\s\S]*?parserId:\s*"([^"]+)"[\s\S]*?label:\s*"([^"]+)"[\s\S]*?defaultSource:\s*"([^"]+)"/g;
  let m;
  while ((m = blockRe.exec(text)) !== null) {
    const chunk = m[0];
    const utmMatch = chunk.match(/utmCampaigns:\s*\[([\s\S]*?)\]/);
    const utmCampaigns = [];
    if (utmMatch) {
      const utmRe = /"([^"]+)"/g;
      let um;
      while ((um = utmRe.exec(utmMatch[1])) !== null) utmCampaigns.push(um[1]);
    }
    entries.push({
      formId: m[1],
      closerServiceId: m[2],
      parserId: m[3],
      label: m[4],
      defaultSource: m[5],
      utmCampaigns,
    });
  }
  return entries;
}

const PRO_SERVICES_FILE = path.join(ROOT, "lib", "data", "pro-services.ts");
const INVENTORY_FILE = path.join(ROOT, "lib", "data", "equipment-inventory.ts");
const INVENTORY_STATE_FILE = path.join(OUT_DIR, "equipment-inventory-state.json");
const INVENTORY_BOOKINGS_SITE = path.join(ROOT, "lib", "data", "equipment-inventory-bookings.json");
const LIVE_STATUS_STATE_FILE = path.join(OUT_DIR, "live-status-state.json");
const LIVE_STATUS_SITE = path.join(ROOT, "lib", "data", "live-status.json");

const DEFAULT_LIVE_STATUS = {
  availability: { mode: "available", busyUntil: null, customLabel: null },
  lastProject: {
    title: "ברכת חתונה מרגשת",
    date: "10.6.2026",
    url: "/studio",
  },
  updatedAt: new Date().toISOString(),
};

function parseProServices(text) {
  const services = [];
  const blocks = text.split(/\{\s*\n\s*id:\s*"/).slice(1);
  for (const block of blocks) {
    const id = block.match(/^([^"]+)"/)?.[1];
    if (!id) continue;
    const pick = (key) => block.match(new RegExp(`${key}:\\s*"([^"]+)"`))?.[1];
    const pickRaw = (key) => block.match(new RegExp(`${key}:\\s*'([^']+)'`))?.[1];
    services.push({
      id,
      slug: pick("slug"),
      path: pick("path"),
      title: pick("title"),
      closerServiceId: pick("closerServiceId"),
      bookCategoryId: pick("bookCategoryId"),
      pricingId: pick("pricingId"),
      utmCampaign: pick("utmCampaign"),
      department: pick("department"),
      whatsappIntro: pick("whatsappIntro"),
      systemPrompt: block.match(/system:\s*"([^"]+)"/)?.[1] ?? "",
      userTemplate: block.match(/userTemplate:\s*"([^"]+)"/)?.[1] ?? "",
    });
  }
  return services;
}

function parseEquipmentInventory(text) {
  const items = [];
  const blockRe =
    /\{\s*id:\s*"([^"]+)"[\s\S]*?label:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"[\s\S]*?qtyTotal:\s*(\d+)[\s\S]*?dailyRateExVat:\s*(\d+)/g;
  let m;
  while ((m = blockRe.exec(text)) !== null) {
    items.push({
      id: m[1],
      label: m[2],
      category: m[3],
      qtyTotal: Number(m[4]),
      dailyRateExVat: Number(m[5]),
    });
  }
  return items;
}

function loadInventoryBookings() {
  try {
    if (fs.existsSync(INVENTORY_STATE_FILE)) {
      const raw = JSON.parse(fs.readFileSync(INVENTORY_STATE_FILE, "utf8"));
      return Array.isArray(raw.bookings) ? raw.bookings : [];
    }
  } catch {
    /* ignore */
  }
  return [];
}

function loadLiveStatus() {
  try {
    if (fs.existsSync(LIVE_STATUS_STATE_FILE)) {
      return JSON.parse(fs.readFileSync(LIVE_STATUS_STATE_FILE, "utf8"));
    }
  } catch {
    /* ignore */
  }
  try {
    if (fs.existsSync(LIVE_STATUS_SITE)) {
      return JSON.parse(fs.readFileSync(LIVE_STATUS_SITE, "utf8"));
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_LIVE_STATUS;
}

/** audienceRoutes מלאים -- discovery מ-brandCopy, שירות ואירוע מ-book-audience-routes */
function buildAudienceRoutes(routesText, brandCopy) {
  const discoveryById = {};
  for (const r of brandCopy.audienceRoutes || []) {
    discoveryById[r.id] = { discoverySetId: r.discoverySetId, label: r.label };
  }
  const OCCASION_SHORT = {
    "family-gifts": "הקלטה משפחתית",
    "podcast-content": "פודקאסט",
    "events-attractions": "אירוע",
    "dj-vip": "DJ לאירוע",
    "singer-amplification": "הגברה לזמרים",
    "photo-clips": "צילום / קליפ",
    "academy-learn": "שיעור פרטי",
    "online-restore": "שחזור סאונד",
    "pro-b2b": "B2B Pro",
  };
  const routes = [];
  const blockRe =
    /\{\s*\n\s*id:\s*"([^"]+)"[\s\S]*?tag:\s*"([^"]+)"[\s\S]*?closerServiceId:\s*"([^"]+)"/g;
  let m;
  while ((m = blockRe.exec(routesText)) !== null) {
    const id = m[1];
    routes.push({
      id,
      label: discoveryById[id]?.label || m[2],
      discoverySetId: discoveryById[id]?.discoverySetId || "studio_group_default",
      closerServiceId: m[3],
      occasion: OCCASION_SHORT[id] || m[2],
    });
  }
  return routes;
}

/** מקורות book_router_* -- מוגדרים ב-book-router-lead-sources דרך spread */
function parseBookRouterLeadSources(routesText) {
  const entries = [];
  const blockRe =
    /\{\s*\n\s*id:\s*"([^"]+)"[\s\S]*?tag:\s*"([^"]+)"[\s\S]*?utm_campaign:\s*"([^"]+)"[\s\S]*?categoryId:\s*"([^"]+)"[\s\S]*?closerServiceId:\s*"([^"]+)"/g;
  let m;
  while ((m = blockRe.exec(routesText)) !== null) {
    entries.push({
      formId: m[3],
      closerServiceId: m[5],
      parserId: "audience_fast",
      label: `נתיב /book: ${m[2]}`,
      defaultSource: `/book#${m[4]}`,
      utmCampaigns: [m[3]],
    });
  }
  const escape = routesText.match(/BOOK_ESCAPE_HATCH[\s\S]*?utm_campaign:\s*"([^"]+)"/);
  if (escape) {
    entries.push({
      formId: escape[1],
      closerServiceId: "recording",
      parserId: "audience_fast",
      label: "בריחה מנתיב /book",
      defaultSource: "/book",
      utmCampaigns: [escape[1]],
    });
  }
  return entries;
}

function parseContactServiceMap(text) {
  const map = {};
  const block = text.match(/CONTACT_SERVICE_TO_CLOSER[\s\S]*?=\s*\{([\s\S]*?)\};/);
  if (!block) return map;
  const re = /(\w+):\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(block[1])) !== null) map[m[1]] = m[2];
  return map;
}

function parsePodcastPackages(text) {
  const packages = [];
  const blockRe =
    /id:\s*"(starter|audio|video|social)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?price:\s*(\w+)/g;
  let m;
  while ((m = blockRe.exec(text)) !== null) {
    const priceRaw = m[3];
    const price =
      priceRaw === "PODCAST_STARTER_PRICE"
        ? 750
        : Number.isNaN(Number(priceRaw))
          ? null
          : Number(priceRaw);
    if (price) {
      packages.push({ id: m[1], name: m[2], price, withVat: withVat(price) });
    }
  }
  return packages;
}

function parseAttractions(text) {
  const items = [];
  const re = /id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"/g;
  const start = text.indexOf("export const ATTRACTIONS");
  if (start < 0) return items;
  const slice = text.slice(start, start + 12000);
  let m;
  while ((m = re.exec(slice)) !== null) {
    if (m[1].length < 30) items.push({ id: m[1], name: m[2] });
  }
  return items;
}

function parseClipServices(text) {
  const services = [];
  const re =
    /(\w+):\s*\{[\s\S]*?name:\s*"([^"]+)"[\s\S]*?price:\s*(\d+)/g;
  const start = text.indexOf("export const SERVICES");
  if (start < 0) return services;
  const slice = text.slice(start, start + 15000);
  let m;
  while ((m = re.exec(slice)) !== null) {
    services.push({ id: m[1], name: m[2], price: Number(m[3]) });
  }
  return services;
}

function parseGeoFees(text) {
  const fees = [];
  const block = text.match(/GEO_FEES[\s\S]*?=\s*\{([\s\S]*?)\};/);
  if (!block) return fees;
  const re = /(\w+):\s*\{\s*label:\s*"([^"]+)"[\s\S]*?fee:\s*(\d+)/g;
  let m;
  while ((m = re.exec(block[1])) !== null) {
    fees.push({ id: m[1], label: m[2], fee: Number(m[3]) });
  }
  return fees;
}

// ── Chatbot FAQ export ────────────────────────────────────────────────────────
const CHATBOT_DATA_FILE = path.join(ROOT, "lib", "chatbot-data.ts");
const CHATBOT_NEXT_ACTION = {
  chatbot_studio_price:  "שלח מחירון אולפן + תאם שעת ייעוץ קצרה",
  chatbot_blessings:     "שלח דוגמת ברכה + הצע מועד הקלטה",
  chatbot_podcast:       "שלח פרק לדוגמה + הצע שיחת ייעוץ ראשונית",
  chatbot_book:          "שאל על סוג השירות המבוקש + שלח קישור הזמנה",
  chatbot_hours:         "אשר זמינות לתאריך המבוקש",
  chatbot_dj:            "בדוק זמינות לתאריך האירוע + שלח הצעת DJ",
  chatbot_attractions:   "שלח מחירון אטרקציות + בדוק זמינות",
  chatbot_photography:   "בדוק זמינות צלם + שלח חבילות צילום",
  chatbot_voiceover:     "בקש קישור לסקריפט + שלח הצעת מחיר",
  chatbot_academy:       "שאל על מטרות הלמידה + הצע שיעור ניסיון",
  chatbot_quote:         "בקש תאריך + סוג האירוע + שלח הצעה מפורטת",
  chatbot_portfolio:     "שתף דוגמאות הקלטה / DJ / צילום הרלוונטיות לשאלה",
  chatbot_fallback:      "לקוח לא מצא תשובה - שאל מה בדיוק חסר ותן מענה מלא",
};
const CHATBOT_TO_CLOSER_SERVICE = {
  chatbot_studio_price:  "recording",
  chatbot_blessings:     "recording",
  chatbot_podcast:       "podcast",
  chatbot_book:          "recording",
  chatbot_hours:         "recording",
  chatbot_dj:            "dj",
  chatbot_attractions:   "effects_only",
  chatbot_photography:   "bat_mitzvah",
  chatbot_voiceover:     "dj_voice_tags",
  chatbot_academy:       "academy",
  chatbot_quote:         "recording",
  chatbot_portfolio:     "recording",
  chatbot_fallback:      "recording",
};

function parseChatbotFaq() {
  const tmpOut = path.join(ROOT, ".next", "tmp-chatbot-export.cjs");
  try {
    fs.mkdirSync(path.join(ROOT, ".next"), { recursive: true });
    esbuild.buildSync({
      entryPoints: [CHATBOT_DATA_FILE],
      bundle: false,
      format: "cjs",
      platform: "node",
      outfile: tmpOut,
      logLevel: "silent",
    });
    const mod = createRequire(import.meta.url)(tmpOut);
    const questions = mod.CHATBOT_DATA?.questions ?? [];
    return questions.map((q) => ({
      id: q.id,
      label: q.label,
      answer: q.answer.text,
      readMoreHref: q.answer.readMoreHref ?? null,
      whatsappMessage: q.answer.whatsappMessage ?? null,
      closerServiceId: CHATBOT_TO_CLOSER_SERVICE[q.id] ?? "recording",
      nextAction: CHATBOT_NEXT_ACTION[q.id] ?? "בקש פרטים נוספים",
    }));
  } finally {
    try { fs.unlinkSync(tmpOut); } catch { /* ignore */ }
  }
}

const catalogText = fs.readFileSync(CATALOG_FILE, "utf8");
const routesText = fs.readFileSync(ROUTES_FILE, "utf8");
const studioText = fs.readFileSync(STUDIO_FILE, "utf8");
const blogText = fs.readFileSync(BLOG_FILE, "utf8");
const filterText = fs.readFileSync(FILTER_FILE, "utf8");
const registryText = fs.readFileSync(REGISTRY_FILE, "utf8");
const podcastCalcText = fs.readFileSync(PODCAST_CALC_FILE, "utf8");
const attractionsText = fs.readFileSync(ATTRACTIONS_FILE, "utf8");
const clipsText = fs.readFileSync(CLIPS_SERVICES_FILE, "utf8");
const proServicesText = fs.readFileSync(PRO_SERVICES_FILE, "utf8");
const inventoryText = fs.readFileSync(INVENTORY_FILE, "utf8");
const brandCopyRaw = JSON.parse(fs.readFileSync(BRAND_COPY_FILE, "utf8"));
const brandCopy = humanizeExportStrings(brandCopyRaw);

const REQUIRED_BRAND_KEYS = [
  "messageRecipients",
  "recipientDefaultsByService",
  "voiceScriptVariants",
  "quickInjectIds",
  "playbackCopy",
  "studioArrival",
  "studioConfirmationEmail",
];
for (const key of REQUIRED_BRAND_KEYS) {
  if (!brandCopy[key] || (typeof brandCopy[key] === "object" && !Object.keys(brandCopy[key]).length)) {
    throw new Error(`closer-brand-copy.json missing or empty: ${key}`);
  }
}
const recipientIds = Object.keys(brandCopy.messageRecipients);
for (const id of ["booker", "celebrant", "mom"]) {
  if (!recipientIds.includes(id)) {
    throw new Error(`messageRecipients missing required id: ${id}`);
  }
}
if (!Array.isArray(brandCopy.quickInjectIds) || brandCopy.quickInjectIds.length < 3) {
  throw new Error("quickInjectIds must be a non-empty array");
}

const payload = {
  generatedAt: new Date().toISOString(),
  vatRate: VAT_RATE,
  catalog: parseCatalog(catalogText),
  bookRoutePresets: parseBookRoutes(routesText),
  studioPackages: parseStudioPackages(studioText),
  studioUpgrades: parseStudioUpgrades(studioText),
  recordingTypes: parseRecordingTypes(studioText),
  atmosphereTypes: parseAtmosphereTypes(studioText),
  studioParticipantRules: parseStudioParticipantRules(studioText),
  blogPosts: parseBlogPosts(blogText),
  filterQuestions: parseFilterQuestions(filterText),
  leadSources: [
    ...parseLeadRegistry(registryText),
    ...parseBookRouterLeadSources(routesText),
  ],
  contactServiceMap: parseContactServiceMap(registryText),
  podcastPackages: parsePodcastPackages(podcastCalcText),
  attractions: parseAttractions(attractionsText),
  clipServices: parseClipServices(clipsText),
  geoFees: parseGeoFees(attractionsText),
  replyStudioLabels: brandCopy.replyStudioLabels,
  continueChatPaths: brandCopy.continueChatPaths,
  clientScenarioLabels: brandCopy.clientScenarioLabels,
  studioExperience: brandCopy.studioExperience,
  studioLounge: brandCopy.studioLounge,
  podcastFilmingIdeas: brandCopy.podcastFilmingIdeas,
  discoverySets: brandCopy.discoverySets,
  audienceRoutes: buildAudienceRoutes(routesText, brandCopy),
  crossSellOffers: brandCopy.crossSellOffers,
  groupFamilyPitch: brandCopy.groupFamilyPitch,
  groupPlaybackReadyPitch: brandCopy.groupPlaybackReadyPitch,
  playbackCopy: brandCopy.playbackCopy,
  groupMessaging: brandCopy.groupMessaging,
  proofOfMagic: brandCopy.proofOfMagic,
  nightPolish: brandCopy.nightPolish,
  mobileStudioUpsell: brandCopy.mobileStudioUpsell,
  messageRecipients: brandCopy.messageRecipients,
  recipientDefaultsByService: brandCopy.recipientDefaultsByService,
  studioArrival: brandCopy.studioArrival,
  studioConfirmationEmail: brandCopy.studioConfirmationEmail,
  voiceScriptVariants: brandCopy.voiceScriptVariants,
  quickInjectIds: brandCopy.quickInjectIds,
  injectBundles: brandCopy.injectBundles || {},
  scenarioRules: JSON.parse(
    fs.readFileSync(path.join(ROOT, "lib", "data", "scenario-rules.json"), "utf8"),
  ),
  analytics: {
    propertyId: "397966715",
    measurementId: "G-PVW4GMPNS4",
    apiBaseUrl: "https://www.yakircohen.com/api/analytics/realtime",
    pollIntervalSec: 60,
    gaRealtimeUrl:
      "https://analytics.google.com/analytics/web/#/a2322839p397966715/realtime/overview",
  },
  proServices: parseProServices(proServicesText),
  equipmentInventory: parseEquipmentInventory(inventoryText),
  inventoryBookings: loadInventoryBookings(),
  liveStatus: loadLiveStatus(),
  chatbotFaq: parseChatbotFaq(),
};

const invBookings = payload.inventoryBookings;
const liveStatus = payload.liveStatus;
fs.writeFileSync(
  INVENTORY_BOOKINGS_SITE,
  `${JSON.stringify({ bookings: invBookings, updatedAt: new Date().toISOString() }, null, 2)}\n`,
  "utf8",
);
fs.writeFileSync(LIVE_STATUS_SITE, `${JSON.stringify(liveStatus, null, 2)}\n`, "utf8");

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
fs.writeFileSync(
  OUT_JS,
  `/** Auto-generated -- npm run export:closer */\nwindow.CLOSER_CONFIG = ${JSON.stringify(payload)};\n`,
  "utf8",
);
const REPLY_BUILDERS_OUT = path.join(OUT_DIR, "closer-reply-builders.js");
esbuild.buildSync({
  entryPoints: [path.join(ROOT, "lib", "closer-reply-bundle.ts")],
  bundle: true,
  format: "iife",
  globalName: "CloserReplyBuilders",
  platform: "browser",
  target: ["es2020"],
  outfile: REPLY_BUILDERS_OUT,
  logLevel: "warning",
});

console.log(
  `Wrote ${OUT_JSON} + closer-config.js + closer-reply-builders.js (${payload.studioPackages.length} studio pkgs, ${payload.leadSources.length} lead sources)`,
);
