import { NextResponse } from "next/server";
import { verifyEventIndexToken } from "@/lib/analytics/ga4-realtime";
import {
  EVENT_INDEX_HAS_DATA,
  EVENT_INDEX_WEEK,
  type EventIndexWeek,
} from "@/lib/data/event-index.generated";
import alertsData from "@/lib/data/market-alerts.generated.json";

type AlertsFile = { alerts?: { id: string; message: string; segmentLabel: string; suggestedPremiumPct: number }[] };

export async function GET(request: Request) {
  if (!verifyEventIndexToken(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload: {
    index: EventIndexWeek;
    hasData: boolean;
    alerts: AlertsFile["alerts"];
  } = {
    index: EVENT_INDEX_WEEK,
    hasData: EVENT_INDEX_HAS_DATA,
    alerts: (alertsData as AlertsFile).alerts ?? [],
  };

  return NextResponse.json(payload);
}
