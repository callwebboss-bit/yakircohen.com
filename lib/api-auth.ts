import { timingSafeEqual } from "node:crypto";

/** Constant-time Bearer check for cron / internal API routes. */
export function verifyBearerToken(
  request: Request,
  expectedToken: string | undefined,
): boolean {
  const expected = expectedToken?.trim();
  if (!expected) return false;

  const auth = request.headers.get("authorization")?.trim();
  if (!auth?.startsWith("Bearer ")) return false;

  const token = auth.slice("Bearer ".length).trim();
  if (!token || token.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}
