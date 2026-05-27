"use client";

import { cn } from "@/lib/cn";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Задержка в мс — для лёгкого каскада */
  delay?: number;
  /** Не монтировать контент, пока блок не появится в viewport */
  lazyMount?: boolean;
}

export function Reveal({ children, className, delay = 0, lazyMount = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(!lazyMount);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (lazyMount) setMounted(true);
          observer.disconnect();
        }
      },
      lazyMount
        ? { threshold: 0, rootMargin: "160px 0px" }
        : { threshold: 0.06, rootMargin: "0px 0px -32px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [lazyMount]);

  return (
    <div
      ref={ref}
      className={cn("reveal", visible && "reveal-visible", className)}
      style={{
        transitionDelay: visible ? `${delay}ms` : undefined,
        minHeight: lazyMount && !mounted ? "1px" : undefined,
      }}
    >
      {mounted ? children : null}
    </div>
  );
}
