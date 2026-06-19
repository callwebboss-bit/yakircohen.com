import { NextResponse } from "next/server";
import { fetchGa4RealtimeSnapshot } from "@/lib/analytics/ga4-realtime";

export const revalidate = 45;

export async function GET() {
  const snapshot = await fetchGa4RealtimeSnapshot();

  const body = snapshot.configured
    ? {
        configured: true,
        visitors: snapshot.activeUsers,
        fetchedAt: snapshot.fetchedAt,
      }
    : {
        configured: false,
        visitors: null,
        fetchedAt: snapshot.fetchedAt,
      };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, s-maxage=45, stale-while-revalidate=60",
    },
  });
}
