import { AdminAnalyticsPanel } from "@/components/admin/admin-analytics-panel";
import { verifyAdminSession } from "@/lib/server/admin-auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Админка — аналитика",
  robots: { index: false, follow: false },
};

export default async function AdminAnalyticsPage() {
  const ok = await verifyAdminSession();
  if (!ok) redirect("/admin/login");
  return <AdminAnalyticsPanel />;
}

