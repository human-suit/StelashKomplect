"use client";

import dynamic from "next/dynamic";

export const AnalyticsTrackerLazy = dynamic(() =>
  import("@/components/analytics-tracker").then((m) => ({
    default: m.AnalyticsTracker,
  })),
);
