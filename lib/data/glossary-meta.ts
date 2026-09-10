/**
 * קבועי הנתיב של המונחון, מופרדים בכוונה מ-lib/data/glossary.ts.
 *
 * components/pricing/CatalogOfferPanel.tsx הוא רכיב לקוח וייבא את
 * GLOSSARY_PATHNAME, מחרוזת אחת, ובכך גרר 62KB של הגדרות מונחים לדפדפן
 * בכל עמוד עם פאנל תמחור. נתפס על ידי npm run audit:client-data-weight.
 */
export const GLOSSARY_SLUG = "glossary";
export const GLOSSARY_PATHNAME = `/${GLOSSARY_SLUG}`;
