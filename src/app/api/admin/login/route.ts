import {
  isAdminConfigured,
  setAdminSession,
  verifyAdminPassword,
} from "@/lib/server/admin-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Админка не настроена (ADMIN_PASSWORD в .env)" },
      { status: 503 },
    );
  }

  const { password } = (await request.json()) as { password?: string };
  if (!password || !verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
