import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { AdPlacementWrapper } from "@/components/ads/ad-placement-wrapper";
import { InstallBanner } from "@/components/install-banner";
import { FloatingInstallButton } from "@/components/floating-install-button";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "DvTools - Professional Developer Tools",
    template: "%s | DvTools",
  },
  description:
    "Professional developer tools for JSON formatting, Base64 encoding, JWT decoding, RegExp testing, and more. Fast, secure, and privacy-focused.",
  keywords: [
    "JSON formatter",
    "Base64 encoder",
    "JWT decoder",
    "RegExp tester",
    "code beautifier",
    "developer tools",
    "online tools",
  ],
  authors: [{ name: "DvTools" }],
  creator: "DvTools",
  publisher: "DvTools",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "DvTools",
    title: "DvTools - Professional Developer Tools",
    description:
      "Professional developer tools for JSON formatting, Base64 encoding, JWT decoding, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DvTools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DvTools - Professional Developer Tools",
    description:
      "Professional developer tools for JSON formatting, Base64 encoding, JWT decoding, and more.",
    images: ["/og-image.png"],
    creator: "@devtoolshub",
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL} />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <Providers>
          <ServiceWorkerRegistration />
          <div className="flex min-h-screen flex-col">
            <Header />
            <AdPlacementWrapper
              placementKey="header_banner"
              className="mb-4"
            />
            <main className="flex-1">{children}</main>
            <AdPlacementWrapper
              placementKey="footer_banner"
              className="mt-8"
            />
            <Footer />
          </div>
          <Toaster />
          <InstallBanner 
            position="bottom" 
            variant="default"
            showDeviceInfo={true}
          />
          <FloatingInstallButton 
            position="bottom-right"
            showBadge={true}
          />
        </Providers>
      </body>
    </html>
  );
}
