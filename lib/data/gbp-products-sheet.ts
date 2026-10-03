import { catalogWithVat, getExVat } from "@/lib/data/pricing-catalog";
import { GBP_PRODUCTS, type GbpProduct } from "@/lib/data/gbp-products";
import { absoluteUrl } from "@/lib/site-url";

export type GbpSheetRow = GbpProduct & {
  /** המחיר להזנה בכרטיס: כולל מע״מ, מהקטלוג */
  priceToEnter: number | null;
  exVat: number | null;
  url: string | null;
  status: "ok" | "update" | "decide";
};

export function buildGbpSheet(): GbpSheetRow[] {
  return GBP_PRODUCTS.map((product) => {
    if (!product.catalogId) {
      return { ...product, priceToEnter: null, exVat: null, url: null, status: "decide" as const };
    }
    const exVat = getExVat(product.catalogId);
    const priceToEnter = catalogWithVat(exVat);
    return {
      ...product,
      priceToEnter,
      exVat,
      url: product.path ? absoluteUrl(product.path.replace(/^\/+/, "")) : null,
      status: product.gbpPriceNow === priceToEnter ? ("ok" as const) : ("update" as const),
    };
  });
}

const STATUS_LABEL: Record<GbpSheetRow["status"], string> = {
  ok: "תקין",
  update: "לעדכן בכרטיס",
  decide: "החלטת בעלים",
};

export function renderGbpSheetMarkdown(rows: GbpSheetRow[], generatedAt: string): string {
  const fmt = (n: number | null) => (n == null ? "-" : n.toLocaleString("he-IL"));
  const lines = [
    "# מחירים לכרטיס Google Business",
    "",
    `נוצר אוטומטית מ-\`lib/data/pricing-catalog.ts\` ו-\`lib/data/gbp-products.ts\` (${generatedAt}). לא לערוך ידנית: \`npm run gbp:prices\`.`,
    "",
    "המחיר להזנה הוא כולל מע״מ, כמו באתר. אחרי שמעדכנים את הכרטיס, מעדכנים את `gbpPriceNow` ב-`lib/data/gbp-products.ts`.",
    "",
    "| מוצר בכרטיס | להזין בכרטיס (כולל מע״מ) | לפני מע״מ | בכרטיס היום | סטטוס | קישור | הערה |",
    "|---|---|---|---|---|---|---|",
    ...rows.map(
      (r) =>
        `| ${r.name} | ${fmt(r.priceToEnter)} | ${fmt(r.exVat)} | ${fmt(r.gbpPriceNow)} | ${STATUS_LABEL[r.status]} | ${r.url ?? "-"} | ${r.note ?? ""} |`,
    ),
    "",
  ];
  return lines.join("\n");
}
