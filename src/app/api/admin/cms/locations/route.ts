import { verifyAdminSession } from "@/lib/server/admin-auth";
import { adminCreateLocation } from "@/lib/server/cms/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const cityId = String(body.cityId ?? "");
    if (!cityId) {
      return NextResponse.json({ error: "cityId обязателен" }, { status: 400 });
    }
    const item = await adminCreateLocation(cityId, body);
    return NextResponse.json({ item });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ошибка" },
      { status: 500 },
    );
  }
}
