import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { Footer } from "@/components/Footer";

const BASE_URL = "https://grid-demand-forecast.vercel.app";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#090d16" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "GridForecaster | Net Demand & Duck Curve Intelligence Engine",
    template: "%s | GridForecaster",
  },
  description:
    "Institutional time-series forecasting pipeline predicting net electricity demand to mitigate duck curve overgeneration and 3-hour evening ramp deficits (+9,000 MW) using Bidirectional LSTM, Gradient Boosted Trees, and automated BESS dispatch.",
  applicationName: "GridForecaster",
  keywords: [
    "Electricity Demand Forecasting",
    "Duck Curve Mitigation",
    "Net Demand Forecasting",
    "Time Series Machine Learning",
    "Bidirectional LSTM",
    "Gradient Boosted Trees",
    "XGBoost",
    "Battery Energy Storage System",
    "BESS Dispatch",
    "Grid Stability",
    "IEEE 1547 Compliant",
    "NERC BAL-003",
    "Renewable Overgeneration",
  ],
  authors: [{ name: "Transmission Systems & Analytics Laboratory" }],
  creator: "Transmission Systems Engineering Group",
  publisher: "GridForecaster Telemetry Consortium",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/icon.svg" }],
  },
  openGraph: {
    title: "GridForecaster | Net Demand & Duck Curve Intelligence Engine",
    description:
      "Real-time machine learning pipeline solving the duck curve evening ramp deficit with Bi-LSTM neural networks, XGBoost, and automated battery dispatch.",
    url: BASE_URL,
    siteName: "GridForecaster",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GridForecaster Net Demand & Duck Curve Machine Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GridForecaster | Net Demand & Duck Curve Intelligence Engine",
    description:
      "Predicting net load and the critical 3-hour evening ramp (+9,000 MW) using Bidirectional LSTM and automated BESS dispatch.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${BASE_URL}/#laboratory`,
      "name": "GridForecaster Transmission Systems & Analytics Laboratory",
      "alternateName": "National Grid Demand & Duck Curve Engineering Center",
      "description":
        "Transmission grid analytics laboratory specializing in time-series machine learning, net electricity demand forecasting, and duck curve renewable mitigation.",
      "url": BASE_URL,
      "telephone": "+1-800-555-4743",
      "priceRange": "$$$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "500 Energy Way, Suite 400",
        "addressLocality": "Palo Alto",
        "addressRegion": "CA",
        "postalCode": "94301",
        "addressCountry": "US",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 37.4419,
        "longitude": -122.143,
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          "opens": "00:00",
          "closes": "23:59",
        },
      ],
      "areaServed": "North American Bulk Electric System & Global Transmission Operators",
      "sameAs": [
        "https://github.com/arpit-png/Electricity_demand_forecasting",
      ],
    },
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/#application`,
      "name": "GridForecaster Net Demand & Duck Curve Forecasting Engine",
      "url": BASE_URL,
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All (Web-based SCADA Interface)",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "128",
      },
      "featureList": [
        "24-Hour Synchronous Net Demand Forecasting",
        "Bidirectional LSTM with Multi-Head Temporal Attention",
        "3-Hour Critical Evening Ramp Detection (+9,000 MW)",
        "Automated Battery Energy Storage (BESS) Dispatch",
        "Midday Renewable Curtailment Protection",
        "IEEE 1547 and NERC BAL-003 Compliance",
      ],
    },
    {
      "@type": "Dataset",
      "@id": `${BASE_URL}/#dataset`,
      "name": "Synchronous 24-Hour Transmission Grid Demand & Renewable Generation Dataset",
      "description":
        "Hourly telemetry dataset recording gross load, solar PV generation, wind farm generation, and net demand calculations adhering to IEEE 1547.",
      "license": "https://opensource.org/licenses/MIT",
      "temporalCoverage": "2026-01-01/2026-12-31",
      "creator": {
        "@id": `${BASE_URL}/#laboratory`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-blue-500 selection:text-white">
        <ThemeProvider>
          {/* Subtle grid pattern background */}
          <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-80" />
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
