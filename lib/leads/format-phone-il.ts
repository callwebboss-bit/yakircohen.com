/** Israeli mobile display + normalize helpers */

export function digitsOnlyPhone(input: string): string {
  return input.replace(/\D/g, "");
}

/** Normalize to local 05XXXXXXXX or empty */
export function normalizeIlMobile(input: string): string | null {
  let d = digitsOnlyPhone(input);
  if (d.startsWith("972")) d = `0${d.slice(3)}`;
  if (d.startsWith("5") && d.length === 9) d = `0${d}`;
  if (/^05\d{8}$/.test(d)) return d;
  return null;
}

/** Display as 05X-XXX-XXXX while typing / on blur */
export function formatIlMobileDisplay(input: string): string {
  const d = digitsOnlyPhone(input).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

export function toE164Il(input: string): string | null {
  const local = normalizeIlMobile(input);
  if (!local) return null;
  return `+972${local.slice(1)}`;
}
