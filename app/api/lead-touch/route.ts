import { NextResponse } from "next/server";
import {
  fireCloserWebhook,
  type CloserTouchPayload,
} from "@/lib/closer-webhook";
import { guardPublicMutation } from "@/lib/api-guard";

type LeadTouchRequest = {
  source?: string;
  page_path?: string;
  timestamp?: number;
  cta_type?: string;
};

function isValidTouch(
  body: LeadTouchRequest,
): body is Required<Pick<LeadTouchRequest, "source" | "page_path">> & LeadTouchRequest {
  return Boolean(body.source?.trim() && body.page_path?.trim());
}

export async function POST(request: Request) {
  const gate = await guardPublicMutation(request, {
    bucket: "lead-touch",
    max: 20,
  });
  if (!gate.ok) return gate.response;

  let body: LeadTouchRequest;
  try {
    body = (await request.json()) as LeadTouchRequest;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!isValidTouch(body)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const payload: CloserTouchPayload = {
    event_type: "touch",
    source: body.source.trim(),
    page_path: body.page_path.trim(),
    timestamp: typeof body.timestamp === "number" ? body.timestamp : Date.now(),
    ...(body.cta_type?.trim() ? { cta_type: body.cta_type.trim() } : {}),
  };

  await fireCloserWebhook(payload);

  return NextResponse.json({ ok: true });
}
