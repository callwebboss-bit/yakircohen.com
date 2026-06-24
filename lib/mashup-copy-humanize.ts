/**
 * מנקה סימנים "רובוטיים" מטקסט מאשאפ (em-dash, חצים, סופרלטיבים מיותרים).
 */
export function humanizeMashupCopy(text: string): string {
  if (!text) return "";

  let out = String(text);

  out = out.replace(/(\d)\s*[-–—]\s*(\d)/g, "$1-$2");
  out = out.replace(/--|[–—]/g, ", ");
  out = out.replace(/\s*→\s*/g, ", ואז ");
  out = out.replace(/…/g, ".");
  out = out.replace(/\.{3,}/g, ".");
  out = out.replace(/!+/g, ".");
  out = out.replace(/מושלם/g, "מתאים");
  out = out.replace(/מושלמת/g, "מתאימה");
  out = out.replace(/,\s*,/g, ",");
  out = out.replace(/\s+([,.])/g, "$1");
  out = out.replace(/[ \t]{2,}/g, " ");
  out = out.replace(/\n{3,}/g, "\n\n");

  return out.trim();
}
