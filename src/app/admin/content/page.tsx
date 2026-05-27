import { AdminContentPanel } from "@/components/admin/admin-content-panel";
import { verifyAdminSession } from "@/lib/server/admin-auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Админка — контент",
  robots: { index: false, follow: false },
};

export default async function AdminContentPage() {
  const ok = await verifyAdminSession();
  if (!ok) redirect("/admin/login");

  return <AdminContentPanel />;
}
