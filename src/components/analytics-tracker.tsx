"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function getSessionId(): string {
  const key = "sk-session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: getSessionId(),
        path: pathname,
        url: typeof window !== "undefined" ? window.location.href : null,
        referrer: document.referrer || null,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const ping = () => {
      fetch("/api/analytics/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: getSessionId() }),
        keepalive: true,
      }).catch(() => {});
    };

    ping();
    const interval = setInterval(ping, 45_000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
