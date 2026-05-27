import { recordPageView } from "@/lib/server/analytics-store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { sessionId, path, referrer, url } = await request.json();
    if (!sessionId || !path) {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }
    recordPageView(sessionId, path, referrer, url);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
