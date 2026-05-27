import { verifyAdminSession } from "@/lib/server/admin-auth";
import {
  adminCreate,
  adminList,
  seedAllContent,
} from "@/lib/server/cms/admin";
import { isCmsResource } from "@/lib/server/cms/resources";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ resource: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resource } = await context.params;
  if (!isCmsResource(resource)) {
    return NextResponse.json({ error: "Неизвестный раздел" }, { status: 400 });
  }

  try {
    const items = await adminList(resource);
    return NextResponse.json({ items });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ошибка" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resource } = await context.params;
  if (!isCmsResource(resource)) {
    return NextResponse.json({ error: "Неизвестный раздел" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;

    if (body.action === "seed") {
      const counts = await seedAllContent();
      return NextResponse.json({ ok: true, counts });
    }

    const item = await adminCreate(resource, body);
    return NextResponse.json({ item });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ошибка" },
      { status: 500 },
    );
  }
}
