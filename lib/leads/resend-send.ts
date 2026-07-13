const RESEND_API = "https://api.resend.com/emails";

export type ResendSendInput = {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html?: string;
};

export type ResendSendResult =
  | { ok: true; id: string }
  | { ok: false; status: number; error: string };

export async function sendResendEmail(
  input: ResendSendInput,
): Promise<ResendSendResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    return { ok: false, status: 0, error: "missing_api_key" };
  }

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: input.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    return { ok: false, status: res.status, error: errText };
  }

  const data = (await res.json()) as { id?: string };
  return { ok: true, id: data.id || "" };
}

export function defaultLeadFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "לידים מהאתר <onboarding@resend.dev>"
  );
}
