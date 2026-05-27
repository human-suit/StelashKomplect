import { touchSession } from "@/lib/server/analytics-store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }
    const ua = request.headers.get("user-agent") ?? undefined;
    touchSession(sessionId, ua);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
