/**
 * morning:checklist - עמוד המצב של הלינקים לתשלום, שיקיר עובד איתו.
 *
 * כותב את docs/morning-checklist.html מהנתונים (הקטלוג, morning-links.json,
 * הדלפק). מה שאפשר לגזור מהקוד נגזר (כמה לינקים, איזה כרטיס מכוסה); מה
 * שקורה מחוץ לקוד (בדיקה בטלפון, שבוע שימוש) מסומן ב-MANUAL_DONE למטה.
 * בעמוד אין סודות: רק URL-ים ציבוריים, מחירים ופירוט. אחרי כל ריצה
 * מפרסמים מחדש לאותו Artifact (docs/MORNING-LINKS.md, סעיף 11).
 *
 * בקשת הבעלים 12.10.2026: אינפוגרפיקה, אימוג'ים, ומה שלא צריך עכשיו מקופל.
 *
 *   npm run morning:checklist
 */
import { writeFileSync } from "node:fs";
import { getBankTransferLine, MORNING_LINKS } from "../lib/sales/morning-links";
import { buildSalesBook, type SalesCard } from "../lib/sales/sales-book";
import { nisText } from "../lib/sales/sales-copy";

const OUT = "docs/morning-checklist.html";
const book = buildSalesBook();
const today = new Date().toLocaleDateString("he-IL", { timeZone: "Asia/Jerusalem" });

/* צעדים שקורים מחוץ לקוד. מעדכנים כאן ביד כשיקיר מדווח שסיים */
const MANUAL_DONE = {
  merged: true, // PR #6 מוזג, 12.10
  phoneTest: false, // יקיר פתח את לינק השיר בטלפון כלקוח
  weekOfUse: false, // שבוע שימוש + ספירת תשלומים
  detail20: false, // כלול/לא כלול ל-20 כרטיסים נוספים
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const cards = book.cards;
const fixed = cards.filter((c) => c.payLink?.kind === "fixed");
const open = cards.filter((c) => c.payLink?.kind === "open");
const none = cards.filter((c) => !c.payLink);
const featured = cards.filter((c) => c.featured);
const featuredFixed = featured.filter((c) => c.payLink?.kind === "fixed").length;
const withDetail = cards.filter((c) => c.included?.length && c.excluded?.length).length;
const hasOpen = Boolean(MORNING_LINKS.open.url);
const hasSong = Boolean(MORNING_LINKS.cards.song_recording?.url);
const hasDeposit = Boolean(MORNING_LINKS.deposit.url);
const hasBank = Boolean(getBankTransferLine());

type Step = { emoji: string; title: string; who: string; done: boolean; note: string; now?: boolean };
const steps: Step[] = [
  { emoji: "🔀", title: "הקוד באתר", who: "יקיר", done: MANUAL_DONE.merged, note: "PR #6 מוזג, הדלפק חי" },
  { emoji: "🎤", title: "לינק קבוע: הקלטת שיר", who: "יקיר", done: hasSong, note: "590 ₪, mrng.to" },
  { emoji: "🧾", title: "לינק בסכום פתוח", who: "יקיר", done: hasOpen, note: "5 סכומים לבחירה, עד 3 תשלומים" },
  { emoji: "📱", title: "בדיקה בטלפון, כלקוח", who: "יקיר", done: MANUAL_DONE.phoneTest, note: "כמה שדות, כמה לחיצות, בלי לשלם" },
  { emoji: "📅", title: "שבוע שימוש אמיתי", who: "יקיר", done: MANUAL_DONE.weekOfUse, note: "הודעה, רק לוודא, לינק" },
  { emoji: "📝", title: "כלול / לא כלול ל-20 כרטיסים", who: "ביחד", done: MANUAL_DONE.detail20, note: "אחרי השבוע, בשאלונים" },
];
const firstOpen = steps.findIndex((s) => !s.done);
if (firstOpen >= 0) steps[firstOpen].now = true;
const doneCount = steps.filter((s) => s.done).length;
const pct = Math.round((doneCount / steps.length) * 100);

/* טבעת התקדמות: היקף המעגל לפי r=52 */
const R = 52;
const CIRC = 2 * Math.PI * R;
const ring = `<svg viewBox="0 0 120 120" class="ring" role="img" aria-label="${doneCount} מתוך ${steps.length} שלבים">
<circle cx="60" cy="60" r="${R}" class="ring-bg"/>
<circle cx="60" cy="60" r="${R}" class="ring-fg" stroke-dasharray="${((CIRC * pct) / 100).toFixed(1)} ${CIRC.toFixed(1)}" transform="rotate(-90 60 60)"/>
<text x="60" y="58" class="ring-num">${doneCount}/${steps.length}</text>
<text x="60" y="78" class="ring-lbl">שלבים</text>
</svg>`;

/* פס כיסוי: כמה כרטיסים עם לינק קבוע, פתוח, בלי */
const seg = (n: number) => ((n / cards.length) * 100).toFixed(2);
const coverage = `<div class="bar" role="img" aria-label="${fixed.length} קבוע, ${open.length} פתוח, ${none.length} בלי לינק">
${fixed.length ? `<span class="seg fixed" style="width:${seg(fixed.length)}%"></span>` : ""}
${open.length ? `<span class="seg open" style="width:${seg(open.length)}%"></span>` : ""}
${none.length ? `<span class="seg none" style="width:${seg(none.length)}%"></span>` : ""}
</div>
<ul class="legend">
<li><i class="dot fixed"></i>🔒 קבוע <b>${fixed.length}</b></li>
<li><i class="dot open"></i>🧾 סכום פתוח <b>${open.length}</b></li>
<li><i class="dot none"></i>⛔ בלי לינק <b>${none.length}</b></li>
</ul>`;

/* הזרימה מול הלקוח: חמש תחנות */
const flow = [
  { e: "💬", t: "הודעה", s: "מחיר ומה כלול" },
  { e: "✅", t: "רק לוודא", s: "מה לא כלול" },
  { e: "🔗", t: "לינק", s: "הודעה שלישית" },
  { e: "💳", t: "תשלום", s: "אשראי או bit" },
  { e: "🧾", t: "חשבונית", s: "אוטומטית למייל" },
];
const flowHtml = `<ol class="flow">${flow
  .map((f) => `<li><span class="fe" aria-hidden="true">${f.e}</span><b>${f.t}</b><small>${f.s}</small></li>`)
  .join("")}</ol>`;

function linkCell(card: SalesCard): string {
  if (!card.payLink) return `<span class="pill none">⛔ אין</span>`;
  if (card.payLink.kind === "fixed") return `<span class="pill fixed">🔒 קבוע</span>`;
  return `<span class="pill open">🧾 פתוח</span>`;
}
function detailCell(card: SalesCard): string {
  const inc = card.included?.length ?? 0;
  const exc = card.excluded?.length ?? 0;
  if (inc && exc) return `<span class="pill fixed">📋 מלא</span>`;
  if (inc || exc) return `<span class="pill open">📋 חלקי</span>`;
  return `<span class="pill none">📋 חסר</span>`;
}
const row = (card: SalesCard) => `<tr>
<td>${card.featured ? "⭐ " : ""}${esc(card.title)}<div class="id">${card.id}</div></td>
<td class="num">${card.priceFrom ? "מ-" : ""}${esc(nisText(card.inclVat))}</td>
<td>${detailCell(card)}</td>
<td>${linkCell(card)}</td>
<td>${
  card.payLink?.kind === "fixed"
    ? `<button type="button" class="copy" data-copy="${esc(card.payLink.url)}">📋 העתק</button>`
    : card.morningLinkFields
      ? `<details class="mini"><summary>✏️ מה להקליד</summary><pre>${esc(card.morningLinkFields)}</pre></details>`
      : ""
}</td>
</tr>`;
const table = (list: SalesCard[]) => `<div class="tablewrap"><table>
<thead><tr><th>שירות</th><th>כולל מע״מ</th><th>פירוט</th><th>לינק</th><th></th></tr></thead>
<tbody>${list.map(row).join("\n")}</tbody></table></div>`;

const linkLine = (emoji: string, label: string, url: string | undefined) =>
  url
    ? `<li><span>${emoji} ${label}</span><code>${esc(url)}</code><button type="button" class="copy" data-copy="${esc(url)}">📋 העתק</button></li>`
    : `<li class="missing"><span>${emoji} ${label}</span><em>עוד לא נוצר</em></li>`;

const html = `<title>לינקים לתשלום</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;800&display=swap">
<style>
/* פריסה: לוח מצב אחד. למעלה התקדמות וכיסוי, באמצע "עכשיו", למטה מקופל. אדום המותג כהדגשה, ירוק לבוצע */
:root{--bg:#fbfaf9;--fg:#1c1a19;--muted:#6b6560;--line:#e7e2de;--card:#ffffff;--soft:#f3efec;--red:#b3261e;--redsoft:#fbe9e7;--green:#1b7f3b;--greensoft:#e6f4ea;--amber:#9a6200;--ambersoft:#fdf3dc;--display:"Heebo",system-ui,-apple-system,"Segoe UI",Arial,sans-serif}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#141211;--fg:#f1ecea;--muted:#a69f99;--line:#2f2a27;--card:#1c1917;--soft:#24201d;--red:#ff8a80;--redsoft:#3a1d1a;--green:#7ed49a;--greensoft:#16301f;--amber:#f2c66d;--ambersoft:#33280f;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#141211;--fg:#f1ecea;--muted:#a69f99;--line:#2f2a27;--card:#1c1917;--soft:#24201d;--red:#ff8a80;--redsoft:#3a1d1a;--green:#7ed49a;--greensoft:#16301f;--amber:#f2c66d;--ambersoft:#33280f;color-scheme:dark}
*{box-sizing:border-box}html{direction:rtl}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 var(--display);padding-block:20px 40px;padding-inline:16px}
main{max-width:920px;margin:0 auto;display:grid;gap:18px}
h1{font-size:1.7rem;font-weight:800;margin:0;text-wrap:balance}h2{font-size:1.1rem;margin:0 0 10px;font-weight:800}
.sub{color:var(--muted);margin:2px 0 0;font-size:.92rem}
.panel{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px}
.hero{display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:center}
.ring{width:128px;height:128px}.ring-bg{fill:none;stroke:var(--soft);stroke-width:12}.ring-fg{fill:none;stroke:var(--green);stroke-width:12;stroke-linecap:round}
.ring-num{font:800 26px var(--display);fill:var(--fg);text-anchor:middle}.ring-lbl{font:600 12px var(--display);fill:var(--muted);text-anchor:middle}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px}
.kpi{background:var(--soft);border-radius:12px;padding:10px 12px;min-width:0}.kpi b{display:block;font-size:1.35rem;font-weight:800;font-variant-numeric:tabular-nums}.kpi span{color:var(--muted);font-size:.82rem}
.now{border:2px solid var(--red);background:var(--redsoft)}.now h2{color:var(--red)}
.now ol{margin:0;padding-inline-start:20px;display:grid;gap:6px}
.flow{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,1fr);gap:6px;counter-reset:f}
.flow li{position:relative;background:var(--soft);border-radius:12px;padding:10px 6px;text-align:center;display:grid;gap:2px;min-width:0}
.flow li:not(:last-child)::after{content:"←";position:absolute;inset-inline-end:-9px;top:50%;transform:translateY(-50%);color:var(--muted);font-weight:800;z-index:1}
.flow li:nth-child(3){background:var(--redsoft);outline:2px solid var(--red)}
.fe{font-size:1.5rem}.flow b{font-size:.95rem}.flow small{color:var(--muted);font-size:.75rem}
.bar{display:flex;height:18px;border-radius:999px;overflow:hidden;background:var(--soft)}.seg{display:block;height:100%}
.seg.fixed,.dot.fixed{background:var(--green)}.seg.open,.dot.open{background:var(--amber)}.seg.none,.dot.none{background:var(--muted)}
.legend{list-style:none;padding:0;margin:8px 0 0;display:flex;flex-wrap:wrap;gap:14px;font-size:.9rem}.legend b{font-variant-numeric:tabular-nums}
.dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-inline-end:6px;vertical-align:middle}
.steps{list-style:none;margin:0;padding:0;display:grid;gap:6px}
.steps li{display:grid;grid-template-columns:auto auto 1fr;gap:10px;align-items:center;background:var(--soft);border-radius:12px;padding:10px 12px}
.steps li.done{background:var(--greensoft)}.steps li.current{outline:2px solid var(--red);background:var(--redsoft)}
.check{width:26px;height:26px;border-radius:8px;display:grid;place-items:center;border:2px solid var(--muted);font-weight:800;font-size:.85rem}
.done .check{background:var(--green);border-color:var(--green);color:#fff}
.se{font-size:1.25rem}.steps small{display:block;color:var(--muted);font-size:.8rem}.steps .who{font-size:.72rem;color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:0 6px;margin-inline-start:6px}
.links{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.links li{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;background:var(--soft);border-radius:12px;padding:8px 12px}
.links li.missing{opacity:.7}.links code{direction:ltr;text-align:left;font-size:.82rem;overflow-wrap:anywhere;min-width:0}.links em{color:var(--muted);font-style:normal;font-size:.85rem}
details.acc{background:var(--card);border:1px solid var(--line);border-radius:16px}
details.acc>summary{list-style:none;cursor:pointer;padding:14px 16px;font-weight:800;display:flex;justify-content:space-between;align-items:center;gap:10px}
details.acc>summary::-webkit-details-marker{display:none}
details.acc>summary::after{content:"＋";color:var(--muted);font-weight:800}details.acc[open]>summary::after{content:"－"}
details.acc>summary small{color:var(--muted);font-weight:400;font-size:.82rem}
.accbody{padding:0 16px 16px;display:grid;gap:10px}
.later{margin:0;padding-inline-start:20px;display:grid;gap:6px}.later li small{color:var(--muted)}
.tablewrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:.9rem}th,td{text-align:right;padding:8px 6px;border-bottom:1px solid var(--line);vertical-align:top}
th{color:var(--muted);font-weight:600;font-size:.78rem}td.num{white-space:nowrap;font-variant-numeric:tabular-nums}
.id{color:var(--muted);font-size:.72rem;direction:ltr;text-align:right}
.pill{display:inline-block;border-radius:999px;padding:1px 8px;font-size:.78rem;white-space:nowrap}
.pill.fixed{background:var(--greensoft);color:var(--green)}.pill.open{background:var(--ambersoft);color:var(--amber)}.pill.none{background:var(--soft);color:var(--muted)}
button.copy{min-height:36px;border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:10px;padding:4px 10px;cursor:pointer;font:inherit;font-size:.82rem;white-space:nowrap}
button.copy:focus-visible,summary:focus-visible,.filter:focus-visible{outline:2px solid var(--red);outline-offset:2px}
details.mini summary{cursor:pointer;color:var(--muted);font-size:.82rem}pre{white-space:pre-wrap;background:var(--soft);padding:8px;border-radius:8px;font-size:.78rem;overflow-wrap:anywhere}
.filter{width:100%;min-height:44px;border:1px solid var(--line);border-radius:12px;padding:8px 12px;font:inherit;background:var(--bg);color:var(--fg)}
code.cmd{display:block;direction:ltr;text-align:left;background:var(--soft);padding:8px 10px;border-radius:8px;font-size:.82rem;overflow-wrap:anywhere}
@media (max-width:640px){.hero{grid-template-columns:1fr;justify-items:center;text-align:center}
.flow{grid-template-columns:1fr}.flow li{grid-template-columns:auto 1fr;text-align:right;align-items:center;column-gap:10px}.flow li .fe{grid-row:span 2}
.flow li:not(:last-child)::after{content:"↓";inset-inline-end:auto;left:50%;top:auto;bottom:-14px;transform:translateX(-50%)}
.links li{grid-template-columns:1fr}th:nth-child(3),td:nth-child(3){display:none}}
@media (prefers-reduced-motion:no-preference){.ring-fg{transition:stroke-dasharray .6s ease}}
</style>
<main>
<header>
<h1>💳 לינקים לתשלום</h1>
<p class="sub">מתעדכן מהקוד, ${esc(today)}. היעד לחודש הראשון: 🎯 10 תשלומים בלינק.</p>
</header>

<section class="panel hero" aria-label="התקדמות">
${ring}
<div class="kpis">
<div class="kpi"><b>${cards.length - none.length}/${cards.length}</b><span>🧩 שירותים עם לינק</span></div>
<div class="kpi"><b>${featuredFixed}/${featured.length}</b><span>⭐ נפוצים עם לינק קבוע</span></div>
<div class="kpi"><b>${withDetail}/${cards.length}</b><span>📋 עם כלול + לא כלול</span></div>
<div class="kpi"><b>${hasDeposit ? "✅" : "➖"}</b><span>💰 מקדמה (רק באישור)</span></div>
</div>
</section>

${
  firstOpen >= 0
    ? `<section class="panel now" aria-labelledby="now-h">
<h2 id="now-h">👉 מה עכשיו: ${esc(steps[firstOpen].emoji)} ${esc(steps[firstOpen].title)}</h2>
${
  steps[firstOpen].title.startsWith("בדיקה בטלפון")
    ? `<ol>
<li>📲 לפתוח בטלפון את לינק השיר (כפתור "העתק" למטה, בלינקים).</li>
<li>👀 להתקדם כמו לקוח עד מסך הכרטיס. <b>לא לשלם.</b></li>
<li>✍️ לרשום: כמה שדות חובה, כמה לחיצות, ויש שדה הערות?</li>
<li>📨 לשלוח את שלוש התשובות לסוכן.</li>
</ol>`
    : `<p>${esc(steps[firstOpen].note)}</p>`
}
</section>`
    : `<section class="panel now"><h2>🎉 כל השלבים בוצעו</h2></section>`
}

<section class="panel" aria-labelledby="flow-h">
<h2 id="flow-h">🗺️ איך זה עובד מול הלקוח</h2>
${flowHtml}
</section>

<section class="panel" aria-labelledby="cov-h">
<h2 id="cov-h">📊 כמה שירותים מכוסים</h2>
${coverage}
</section>

<section class="panel" aria-labelledby="steps-h">
<h2 id="steps-h">🪜 השלבים</h2>
<ol class="steps">
${steps
  .map(
    (s) =>
      `<li class="${s.done ? "done" : ""}${s.now ? " current" : ""}"><span class="check">${s.done ? "✓" : ""}</span><span class="se" aria-hidden="true">${s.emoji}</span><div>${esc(s.title)}<span class="who">${esc(s.who)}</span><small>${esc(s.note)}</small></div></li>`,
  )
  .join("\n")}
</ol>
</section>

<section class="panel" aria-labelledby="links-h">
<h2 id="links-h">🔗 הלינקים שלך</h2>
<ul class="links">
${linkLine("🎤", "הקלטת שיר", MORNING_LINKS.cards.song_recording?.url)}
${linkLine("🧾", "סכום פתוח", MORNING_LINKS.open.url || undefined)}
${linkLine("💰", "מקדמה", MORNING_LINKS.deposit.url || undefined)}
</ul>
</section>

<details class="acc">
<summary>🔮 מה בהמשך (לא עכשיו) <small>אחרי שבוע שימוש</small></summary>
<div class="accbody">
<ul class="later">
<li>⭐ לינקים קבועים ל-7 הנפוצים הנוספים <small>ברכה, הקלטה מרחוק, פודקאסט, אולפן נייד, DJ, אטרקציות, הגברה</small></li>
<li>📝 כלול / לא כלול ל-20 כרטיסים <small>בשאלונים של 5, בלי מספרים חדשים</small></li>
<li>🏦 שורת "או בהעברה" בהודעה <small>${hasBank ? "קיימת" : "רק אם רוצים, טקסט שלך"}</small></li>
<li>💰 לינק מקדמה 200 ₪ <small>${hasDeposit ? "קיים" : "רק אם רוצים, מופיע בדלפק מאחורי 'באישור יקיר'"}</small></li>
<li>🔔 התראה יומית בוואטסאפ על לינק שנשבר <small>כשיש לפחות 5 לינקים</small></li>
<li>✅ סימון אוטומטי "שולם" על הליד <small>תלוי ב-webhook של מורנינג</small></li>
</ul>
</div>
</details>

<details class="acc">
<summary>🧰 איך לעדכן <small>פקודות, לסוכן</small></summary>
<div class="accbody">
<p>📌 לינק חדש: יוצרים במורנינג (תשלומים, לינקים לתשלום), מדביקים לסוכן עם שם השירות. הוא שומר ודוחף.</p>
<code class="cmd">npm run morning:link -- --id &lt;id&gt; --url &lt;link&gt;</code>
<p>💸 שינוי מחיר: קודם עורכים את הלינק במורנינג, ואז הקטלוג. בסדר הזה אף לקוח לא משלם מחיר ישן.</p>
<code class="cmd">npm run morning:link -- --check</code>
<p>🖼️ לרענן את העמוד הזה:</p>
<code class="cmd">npm run morning:checklist</code>
</div>
</details>

<details class="acc">
<summary>📚 כל השירותים (${cards.length}) <small>⭐ נפוצים למעלה</small></summary>
<div class="accbody">
<input class="filter" id="svc-filter" type="search" placeholder="🔎 סינון: שיר, פודקאסט, DJ" aria-label="סינון שירותים">
${table(cards)}
</div>
</details>
</main>
<script>
document.documentElement.setAttribute("dir","rtl");document.documentElement.setAttribute("lang","he");
document.addEventListener("click",function(e){var b=e.target.closest("button.copy");if(!b)return;var t=b.getAttribute("data-copy");var label=b.textContent;
function done(ok){b.textContent=ok?"✅ הועתק":"סמנו והעתיקו";setTimeout(function(){b.textContent=label},1800)}
try{navigator.clipboard.writeText(t).then(function(){done(true)},function(){done(false)})}catch(err){done(false)}});
var f=document.getElementById("svc-filter");f.addEventListener("input",function(){var q=f.value.trim();document.querySelectorAll("tbody tr").forEach(function(tr){tr.hidden=!!q&&tr.textContent.indexOf(q)===-1})});
</script>
`;
writeFileSync(OUT, html);
console.log(
  `morning:checklist - ${cards.length} שירותים: ${fixed.length} קבוע, ${open.length} פתוח, ${none.length} בלי. ${doneCount}/${steps.length} שלבים. נכתב: ${OUT}`,
);
