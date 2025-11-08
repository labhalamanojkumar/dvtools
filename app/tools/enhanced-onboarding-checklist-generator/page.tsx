import type { Metadata } from "next";
import OnboardingChecklistGeneratorClient from "@/components/tools/onboarding-checklist-generator-client";

export const metadata: Metadata = {
  title: "Enhanced Onboarding Checklist Generator | Multi-Format Import & Real-time Collaboration",
  description: "Advanced checklist management with real-time collaboration, multiple file format support (JSON, CSV, Excel, PDF, Markdown), drag-and-drop reordering, advanced analytics, and notification system.",
  keywords: "onboarding, checklist, template, real-time, collaboration, file import, analytics, drag-drop",
  openGraph: {
    title: "Enhanced Onboarding Checklist Generator",
    description: "Professional onboarding checklist management with advanced features and real-time collaboration",
    type: "website",
    url: "https://maltitoolplatform.com/tools/enhanced-onboarding-checklist-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enhanced Onboarding Checklist Generator",
    description: "Professional onboarding checklist management with advanced features and real-time collaboration",
  },
  alternates: {
    canonical: "https://maltitoolplatform.com/tools/enhanced-onboarding-checklist-generator",
  },
  other: {
    "script:type": "application/ld+json",
    content: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Enhanced Onboarding Checklist Generator",
      "description": "Professional onboarding checklist management with real-time collaboration and advanced analytics",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Real-time collaboration",
        "Multiple file format import (JSON, CSV, Excel, PDF, Markdown)",
        "Drag-and-drop task reordering",
        "Advanced analytics and reporting",
        "Notification system",
        "Bulk operations",
        "Export to multiple formats",
        "Search and filtering",
        "Template versioning",
        "Priority management"
      ]
    })
  }
};

export default function EnhancedOnboardingChecklistGeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      <OnboardingChecklistGeneratorClient />
    </div>
  );
}