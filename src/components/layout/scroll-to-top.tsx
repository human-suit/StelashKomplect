"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 500);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-40 right-4 z-50 lg:bottom-6">
      <Button
        variant="primary"
        size="sm"
        className="size-12 rounded-full p-0 text-xl font-black leading-none shadow-lg"
        aria-label="Наверх"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ⬆
      </Button>
    </div>
  );
}
