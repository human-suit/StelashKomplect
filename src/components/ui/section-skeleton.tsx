import { cn } from "@/lib/cn";

export function SectionSkeleton({
  minHeight = 240,
  className,
}: {
  minHeight?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("mx-auto max-w-7xl animate-pulse px-4 py-10", className)}
      aria-hidden
    >
      <div className="h-6 w-40 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-64 max-w-full rounded bg-slate-100" />
      <div
        className="mt-6 rounded-2xl bg-slate-100"
        style={{ minHeight }}
      />
    </div>
  );
}
