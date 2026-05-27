import { verifyAdminSession } from "@/lib/server/admin-auth";
import { listOrders } from "@/lib/server/orders-store";
import { NextResponse } from "next/server";

export async function GET() {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await listOrders(200);
  return NextResponse.json({ orders });
}
