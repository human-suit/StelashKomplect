import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { isAdminConfigured } from "@/lib/server/admin-auth";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Вход",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  if (!isAdminConfigured()) {
    return (
      <p className="text-slate-600">
        Админка не настроена. Добавьте{" "}
        <code className="rounded bg-slate-200 px-1">ADMIN_PASSWORD</code> в{" "}
        <code className="rounded bg-slate-200 px-1">.env.local</code>.
      </p>
    );
  }

  return (
    <>
      <AdminLoginForm />
      <p className="mt-8 text-center text-sm text-slate-500">
        <Link href="/">← На сайт</Link>
      </p>
    </>
  );
}
