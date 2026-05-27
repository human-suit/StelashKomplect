import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[60vh] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
