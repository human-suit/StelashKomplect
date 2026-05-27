import { verifyAdminSession } from "@/lib/server/admin-auth";
import { getAnalyticsSnapshot } from "@/lib/server/analytics-store";
import { NextResponse } from "next/server";

export async function GET() {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(getAnalyticsSnapshot());
}

