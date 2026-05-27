import { AnalyticsTrackerLazy } from "@/components/analytics-tracker-lazy";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 pb-[calc(56px+env(safe-area-inset-bottom))] lg:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      <ScrollToTop />
      <AnalyticsTrackerLazy />
    </>
  );
}