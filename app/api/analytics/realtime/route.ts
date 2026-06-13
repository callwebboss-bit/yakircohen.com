import { NextResponse } from "next/server";
import {
  fetchGa4RealtimeSnapshot,
  verifyCloserAnalyticsToken,
} from "@/lib/analytics/ga4-realtime";

export async function GET(request: Request) {
  if (!verifyCloserAnalyticsToken(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await fetchGa4RealtimeSnapshot();
  return NextResponse.json(snapshot);
}
