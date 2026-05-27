"use client";

import { Button } from "@/components/ui/button";
import { animateToCompareFromButton } from "@/lib/compare-fly";
import { useCompareStore } from "@/store/compare-store";
import { cn } from "@/lib/cn";

export function CompareToggleButton({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const has = useCompareStore((s) => s.has(slug));
  const toggle = useCompareStore((s) => s.toggle);

  return (
    <Button
      variant={has ? "secondary" : "outline"}
      size="sm"
      className={cn(className)}
      onClick={(e) => {
        if (!has) animateToCompareFromButton(e.currentTarget);
        toggle(slug);
      }}
    >
      {has ? "В сравнении" : "Сравнить"}
    </Button>
  );
}
