import { Metadata } from "next";
import Script from "next/script";
import WebSocketTesterClient from "@/components/tools/websocket-tester-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "WebSocket Tester - Test WebSocket Connections Online | DVtools",
  description: "Professional WebSocket tester and debugging tool. Connect to any WebSocket server (wss://, ws://), send and receive messages in real-time, monitor connection status, view message history with timestamps, and download complete logs. Perfect for testing WebSocket APIs, debugging real-time applications, and monitoring WebSocket connections. Free online tool with no registration required.",
  keywords: [
    "WebSocket tester",
    "test WebSocket",
    "WebSocket client",
    "WebSocket connection test",
    "online WebSocket tool",
    "WebSocket debugger",
    "WebSocket monitor",
    "real-time messaging",
    "WebSocket API test",
    "wss tester",
    "WebSocket echo test",
    "WebSocket message log",
    "test wss connection",
    "WebSocket development tool",
    "WebSocket debugging",
    "real-time communication test",
    "WebSocket protocol tester",
    "free WebSocket tool",
    "WebSocket server test",
    "WebSocket client online",
    "WebSocket inspector",
    "WebSocket connection monitor",
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dvtools.dev"),
  alternates: {
    canonical: "/tools/websocket-tester",
  },
  openGraph: {
    title: "WebSocket Tester - Test WebSocket Connections | DVtools",
    description: "Professional WebSocket tester. Connect to any server, send/receive messages in real-time, monitor connection status, and download logs.",
    url: "/tools/websocket-tester",
    siteName: "DVtools",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-websocket-tester.png",
        width: 1200,
        height: 630,
        alt: "WebSocket Tester Tool - DVtools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebSocket Tester - Test WebSocket Connections | DVtools",
    description: "Professional WebSocket tester. Connect to any server, send/receive messages in real-time, and monitor connection status.",
    images: ["/og-websocket-tester.png"],
    creator: "@dvtools",
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
  category: "developer tools",
};

export default function WebSocketTesterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "WebSocket Tester",
    "description": "Professional WebSocket tester and debugging tool. Connect to WebSocket servers, send and receive messages in real-time, and monitor connection status with complete logging.",
    "url": "https://dvtools.dev/tools/websocket-tester",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Connect to any WebSocket server (wss://, ws://)",
      "Real-time message sending and receiving",
      "Connection status monitoring",
      "Message history with timestamps",
      "Color-coded message types (sent, received, system, error)",
      "Download complete message logs",
      "Copy logs to clipboard",
      "Quick test URLs for echo servers",
      "Keyboard shortcuts (Ctrl+Enter to send)"
    ],
  };

  return (
    <>
      <Script
        id="websocket-tester-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WebSocketTesterClient />
    </>
  );
}
