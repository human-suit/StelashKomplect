import { AdminOrdersPanel } from "@/components/admin/admin-orders-panel";
import { verifyAdminSession } from "@/lib/server/admin-auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Админка — заявки",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const ok = await verifyAdminSession();
  if (!ok) redirect("/admin/login");

  return <AdminOrdersPanel />;
}
