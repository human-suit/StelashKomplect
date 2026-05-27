"use client";

import { cn } from "@/lib/cn";
import Image from "next/image";
import { useState } from "react";

const CATEGORY_FALLBACK: Record<string, string> = {
  stellazhi: "📦",
  sejfy: "🔐",
  shkafy: "🗄️",
  verstaki: "🔧",
  lokery: "🚪",
  meditsinskaya: "🏥",
  korpusnaya: "🪑",
  dveri: "🚪",
};

interface ProductImageProps {
  src?: string;
  alt: string;
  categorySlug?: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export function ProductImage({
  src,
  alt,
  categorySlug = "stellazhi",
  priority,
  className,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px",
}: ProductImageProps) {
  const [error, setError] = useState(false);
  const emoji = CATEGORY_FALLBACK[categorySlug] ?? "📦";

  if (!src || error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-5xl",
          className,
        )}
        aria-hidden
      >
        {emoji}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      loading={priority ? undefined : "lazy"}
      fetchPriority={priority ? "high" : "low"}
      sizes={sizes}
      className={cn("object-contain p-2", className)}
      onError={() => setError(true)}
    />
  );
}
