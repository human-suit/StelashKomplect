import { SiteShell } from "@/components/layout/site-shell";
import { CitiesProvider } from "@/context/cities-context";
import { listCities } from "@/lib/content/cities";
import { company } from "@/lib/company";
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
  twitter: {
    card: "summary_large_image",
    title: "Стеллаж Комплект — стеллажи, сейфы, металлическая мебель",
    description:
      "Каталог стеллажей и металлической мебели. Доставка, сборка и консультация по России.",
  },
  robots: {
    index: true,
    follow: true,
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
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: company.site,
    email: company.email,
    telephone: company.phone,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: company.phone,
        contactType: "sales",
        areaServed: "RU",
        availableLanguage: ["ru"],
      },
    ],
    sameAs: [company.telegram],
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: company.name,
    url: company.site,
    inLanguage: "ru-RU",
  };

  return (
    <html lang="ru">
      <body className="flex min-h-screen flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <CitiesProvider cities={cities}>
          <SiteShell>{children}</SiteShell>
        </CitiesProvider>
      </body>
    </html>
  );
}
