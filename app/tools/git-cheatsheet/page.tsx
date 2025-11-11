import { Metadata } from "next";
import Script from "next/script";
import GitCheatsheetClient from "@/components/tools/git-cheatsheet-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Git Commands Cheatsheet - Quick Reference Guide | DVtools",
  description: "Comprehensive Git commands cheatsheet and quick reference guide. Search and filter 50+ essential Git commands organized by category and skill level. Includes basics (init, clone, add, commit), branching (branch, checkout, merge), remote operations (fetch, pull, push), stashing, undoing changes, and advanced commands (rebase, cherry-pick, reflog). With practical examples, copy-to-clipboard functionality, and workflow best practices. Perfect for developers of all levels from beginners to advanced users. Free online reference with no registration required.",
  keywords: [
    "git cheatsheet",
    "git commands",
    "git reference",
    "git guide",
    "git tutorial",
    "git basics",
    "git branch commands",
    "git merge",
    "git rebase",
    "git stash",
    "git remote",
    "git push pull",
    "git commit",
    "git reset",
    "git checkout",
    "git for beginners",
    "git advanced commands",
    "version control",
    "git workflow",
    "git best practices",
    "git quick reference",
    "git command examples",
    "git cheat sheet pdf",
    "learn git",
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dvtools.dev"),
  alternates: {
    canonical: "/tools/git-cheatsheet",
  },
  openGraph: {
    title: "Git Commands Cheatsheet - Quick Reference | DVtools",
    description: "Comprehensive Git commands cheatsheet. 50+ commands with examples, organized by category and skill level. Search, filter, and copy commands instantly.",
    url: "/tools/git-cheatsheet",
    siteName: "DVtools",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-git-cheatsheet.png",
        width: 1200,
        height: 630,
        alt: "Git Commands Cheatsheet - DVtools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Git Commands Cheatsheet - Quick Reference | DVtools",
    description: "Comprehensive Git commands cheatsheet. 50+ commands with examples, organized by category and skill level.",
    images: ["/og-git-cheatsheet.png"],
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

export default function GitCheatsheetPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Git Commands Cheatsheet",
    "description": "Comprehensive Git commands cheatsheet and quick reference guide with 50+ commands organized by category and skill level, including practical examples and workflow tips.",
    "url": "https://dvtools.dev/tools/git-cheatsheet",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "50+ essential Git commands",
      "Organized by 8 categories: Basics, Branching, Remote, Stashing, Undoing, Advanced, Configuration, Inspection",
      "Filter by skill level: Beginner, Intermediate, Advanced",
      "Search commands and descriptions",
      "Copy commands with one click",
      "Practical command examples",
      "Git workflow tips and best practices",
      "Visual feedback on copy actions",
      "Command categories with detailed descriptions"
    ],
  };

  return (
    <>
      <Script
        id="git-cheatsheet-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GitCheatsheetClient />
    </>
  );
}
