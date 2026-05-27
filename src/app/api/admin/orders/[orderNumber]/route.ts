import { verifyAdminSession } from "@/lib/server/admin-auth";
import {
  getOrderByNumber,
  updateOrderAdmin,
  type OrderStatus,
} from "@/lib/server/orders-store";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ orderNumber: string }> },
) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderNumber } = await context.params;
  const order = await getOrderByNumber(decodeURIComponent(orderNumber));
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ orderNumber: string }> },
) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderNumber } = await context.params;
  const body = (await request.json()) as {
    status?: OrderStatus;
    managerNote?: string;
  };

  const status = body.status;
  if (!status || !["new", "processing", "done", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await updateOrderAdmin(decodeURIComponent(orderNumber), {
    status,
    managerNote: body.managerNote ?? "",
  });

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, order: updated });
}

