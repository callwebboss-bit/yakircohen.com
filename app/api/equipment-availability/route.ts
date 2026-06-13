import { NextResponse } from "next/server";
import { checkAvailability, EQUIPMENT_INVENTORY } from "@/lib/data/equipment-inventory";
import { SITE_URL } from "@/lib/site-url";

const ALLOWED_ORIGINS = new Set([
  SITE_URL,
  "https://www.yakircohen.com",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
]);

function isAllowedRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (origin) return ALLOWED_ORIGINS.has(origin);
  return true;
}

export async function GET(request: Request) {
  if (!isAllowedRequest(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const itemsParam = searchParams.get("items");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date (YYYY-MM-DD)" }, { status: 400 });
  }

  const itemIds = itemsParam
    ? itemsParam.split(",").map((s) => s.trim()).filter(Boolean)
    : EQUIPMENT_INVENTORY.map((i) => i.id);

  const result = checkAvailability(date, itemIds);
  return NextResponse.json(result);
}
