import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Monitor,
  Tablet,
  Chrome,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  Star,
  Plus,
} from "lucide-react";
import { AdPlacementWrapper } from "@/components/ads/ad-placement-wrapper";

export const metadata: Metadata = {
  title: "Install DvTools on iPhone & iPad - Add to Home Screen Guide",
  description: "Learn how to install DvTools on iPhone and iPad using Safari. Add to Home Screen for offline access and app-like experience. Step-by-step guide with screenshots.",
  keywords: [
    "install dvtools iphone",
    "add to home screen ios",
    "dvtools ipad installation",
    "safari pwa ios",
    "ios developer tools app",
  ],
};

export default function IOSInstallPage() {
  const steps = [
    {
      number: 1,
      title: "Open Safari",
      description: "Launch Safari on your iPhone or iPad",
      details: "Make sure you're using Safari, not Chrome or other browsers, as only Safari supports 'Add to Home Screen' on iOS.",
      icon: <Smartphone className="h-6 w-6" />
    },
    {
      number: 2,
      title: "Visit DvTools",
      description: "Navigate to the DvTools website",
      details: "Go to our homepage or directly to the tools you want to use. The site will load completely before proceeding.",
      icon: <Download className="h-6 w-6" />
    },
    {
      number: 3,
      title: "Tap Share Button",
      description: "Tap the Share button at the bottom of Safari",
      details: "The Share button looks like a square with an arrow pointing up. It's located at the bottom of the Safari interface.",
      icon: <ArrowRight className="h-6 w-6" />
    },
    {
      number: 4,
      title: "Scroll Down",
      description: "Scroll down in the share menu",
      details: "Look for 'Add to Home Screen' option. If you don't see it immediately, scroll down in the share menu.",
      icon: <ArrowLeft className="h-6 w-6" />
    },
    {
      number: 5,
      title: "Tap 'Add to Home Screen'",
      description: "Select 'Add to Home Screen' from the menu",
      details: "This option allows you to install the web app on your home screen like a native app.",
      icon: <Plus className="h-6 w-6" />
    },
    {
      number: 6,
      title: "Customize Name (Optional)",
      description: "Edit the app name if desired",
      details: "You can change 'DvTools' to any name you prefer, such as 'Dev Tools' or 'My Developer Toolkit'.",
      icon: <Star className="h-6 w-6" />
    },
    {
      number: 7,
      title: "Tap 'Add'",
      description: "Confirm by tapping 'Add'",
      details: "The app will be added to your home screen and you can tap it anytime to launch DvTools like a native app.",
      icon: <CheckCircle2 className="h-6 w-6" />
    }
  ];

  const features = [
    {
      title: "Offline Access",
      description: "Most tools work without internet connection",
      icon: <Monitor className="h-5 w-5 text-green-500" />
    },
    {
      title: "App-like Experience",
      description: "Full-screen mode with native app feel",
      icon: <Smartphone className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Home Screen Icon",
      description: "Appears alongside your other apps",
      icon: <Star className="h-5 w-5 text-purple-500" />
    },
    {
      title: "Faster Loading",
      description: "Cached resources for instant startup",
      icon: <Download className="h-5 w-5 text-orange-500" />
    }
  ];

  const troubleshooting = [
    {
      issue: "Can't find 'Add to Home Screen'",
      solution: "Make sure you're using Safari. Other browsers don't support this feature on iOS."
    },
    {
      issue: "Share button not visible",
      solution: "Try scrolling up or down in Safari. The share button should be at the bottom center."
    },
    {
      issue: "App icon looks blurry",
      solution: "Close Safari completely and reopen. The icon should refresh with the correct resolution."
    },
    {
      issue: "App opens in Safari instead of standalone",
      solution: "Check if you're using the latest iOS version. Some older versions have limited PWA support."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-20 text-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4" asChild>
              <Link href="/install">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Install Guide
              </Link>
            </Button>
          </div>
          
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                <Smartphone className="h-10 w-10" />
              </div>
            </div>
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white">
              iPhone & iPad Guide
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Install on iPhone & iPad
            </h1>
            <p className="mb-8 text-lg opacity-90 sm:text-xl max-w-3xl mx-auto">
              Add DvTools to your Home Screen for quick access and offline functionality. 
              Works with iPhone and iPad using Safari browser.
            </p>
          </div>
        </div>
      </section>

      {/* Ad placement */}
      <AdPlacementWrapper placementKey="content_top" className="py-4" />

      {/* Installation Steps */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Step-by-Step Installation
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Follow these simple steps to add DvTools to your Home Screen
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {steps.map((step, index) => (
                <Card key={step.number} className="relative">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg flex-shrink-0">
                        {step.number}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {step.icon}
                          <h3 className="text-xl font-semibold">{step.title}</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">{step.description}</p>
                        <p className="text-sm text-muted-foreground">{step.details}</p>
                      </div>
                    </div>
                  </CardContent>
                  {index < steps.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200 dark:bg-gray-800"></div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              What You Get
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Experience DvTools like a native iOS app
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Troubleshooting
              </h2>
              <p className="text-muted-foreground">
                Common issues and their solutions
              </p>
            </div>

            <div className="space-y-4">
              {troubleshooting.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h3 className="mb-2 font-semibold text-red-600 dark:text-red-400">
                      {item.issue}
                    </h3>
                    <p className="text-muted-foreground">{item.solution}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Browser Recommendation */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 flex justify-center">
              <Chrome className="h-16 w-16 text-blue-600" />
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Pro Tip: Use Safari
            </h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Safari is the only browser on iOS that supports adding web apps to the Home Screen. 
              While Chrome for iOS exists, it uses WebKit (Safari's engine) and doesn't support PWA installation.
            </p>
            <Button size="lg" asChild>
              <Link href="/install">
                View All Platforms
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-20 text-primary-foreground">
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Install?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Add DvTools to your Home Screen now
          </p>
          <Button size="lg" variant="secondary" className="text-base" asChild>
            <a href="/">
              <Download className="mr-2 h-5 w-5" />
              Visit DvTools
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}