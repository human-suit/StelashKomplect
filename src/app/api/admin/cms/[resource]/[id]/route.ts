import { verifyAdminSession } from "@/lib/server/admin-auth";
import { adminDelete, adminUpdate } from "@/lib/server/cms/admin";
import { isCmsResource } from "@/lib/server/cms/resources";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ resource: string; id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resource, id } = await context.params;
  if (!isCmsResource(resource)) {
    return NextResponse.json({ error: "Неизвестный раздел" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const item = await adminUpdate(resource, id, body);
    return NextResponse.json({ item });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ошибка" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resource, id } = await context.params;
  if (!isCmsResource(resource)) {
    return NextResponse.json({ error: "Неизвестный раздел" }, { status: 400 });
  }

  try {
    await adminDelete(resource, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ошибка" },
      { status: 500 },
    );
  }
}
