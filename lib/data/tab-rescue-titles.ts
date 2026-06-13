/** Browser tab title when visitor switches away — longest prefix match wins. */
export const TAB_RESCUE_BY_PREFIX: readonly {
  prefix: string;
  hiddenTitle: string;
}[] = [
  { prefix: "/podcast", hiddenTitle: "מחכים לך באולפן! 🎙️" },
  { prefix: "/events", hiddenTitle: "בוא נרים את האירוע שלך... 🎉" },
  { prefix: "/studio", hiddenTitle: "האולפן פנוי בשבילך! 🎤" },
  { prefix: "/book", hiddenTitle: "כמעט סיימנו — חוזרים? ✅" },
  { prefix: "/online", hiddenTitle: "הפרויקט שלך מחכה! ✨" },
  { prefix: "/", hiddenTitle: "עדיין כאן בשבילך! 👋" },
] as const;

export function resolveTabRescueTitle(pathname: string): string {
  const sorted = [...TAB_RESCUE_BY_PREFIX].sort(
    (a, b) => b.prefix.length - a.prefix.length,
  );
  for (const entry of sorted) {
    if (entry.prefix === "/" && pathname !== "/") continue;
    if (pathname === entry.prefix || pathname.startsWith(`${entry.prefix}/`)) {
      return entry.hiddenTitle;
    }
  }
  return TAB_RESCUE_BY_PREFIX[TAB_RESCUE_BY_PREFIX.length - 1]!.hiddenTitle;
}
