import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'DevTools Hub - Professional Developer Tools',
    template: '%s | DevTools Hub',
  },
  description: 'Professional developer tools for JSON formatting, Base64 encoding, JWT decoding, RegExp testing, and more. Fast, secure, and privacy-focused.',
  keywords: ['JSON formatter', 'Base64 encoder', 'JWT decoder', 'RegExp tester', 'code beautifier', 'developer tools', 'online tools'],
  authors: [{ name: 'DevTools Hub' }],
  creator: 'DevTools Hub',
  publisher: 'DevTools Hub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'DevTools Hub',
    title: 'DevTools Hub - Professional Developer Tools',
    description: 'Professional developer tools for JSON formatting, Base64 encoding, JWT decoding, and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DevTools Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevTools Hub - Professional Developer Tools',
    description: 'Professional developer tools for JSON formatting, Base64 encoding, JWT decoding, and more.',
    images: ['/og-image.png'],
    creator: '@devtoolshub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
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
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
