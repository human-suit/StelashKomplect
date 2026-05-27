import { SiteShell } from "@/components/layout/site-shell";
import { CitiesProvider } from "@/context/cities-context";
import { listCities } from "@/lib/content/cities";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Стеллаж Комплект — стеллажи, сейфы, металлическая мебель",
    template: "%s | Стеллаж Комплект",
  },
  description:
    "Федеральный поставщик металлических стеллажей, сейфов и мебели. Крупнейший дилер заводов. Доставка, сборка, Уфа и Россия.",
  metadataBase: new URL("https://stellazhkomplect.ru"),
  openGraph: {
    title: "Стеллаж Комплект — стеллажи, сейфы, металлическая мебель",
    description:
      "Каталог стеллажей и металлической мебели. Доставка, сборка и консультация по России.",
    type: "website",
    locale: "ru_RU",
    url: "https://stellazhkomplect.ru",
    siteName: "Стеллаж Комплект",
  },
  alternates: {
    canonical: "https://stellazhkomplect.ru",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a4d8c",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cities = await listCities();

  return (
    <html lang="ru">
      <body className="flex min-h-screen flex-col antialiased">
        <CitiesProvider cities={cities}>
          <SiteShell>{children}</SiteShell>
        </CitiesProvider>
      </body>
    </html>
  );
}
