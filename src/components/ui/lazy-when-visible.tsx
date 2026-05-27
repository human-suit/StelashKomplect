"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

interface LazyWhenVisibleProps {
  children: ReactNode;
  className?: string;
  /** Минимальная высота до появления контента — без скачка layout */
  minHeight?: string;
  rootMargin?: string;
}

export function LazyWhenVisible({
  children,
  className,
  minHeight = "1px",
  rootMargin = "240px 0px",
}: LazyWhenVisibleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={!visible ? { minHeight } : undefined}
    >
      {visible ? children : null}
    </div>
  );
}
