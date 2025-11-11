import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Monitor,
  Chrome,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  Star,
  Globe,
} from "lucide-react";
import { AdPlacementWrapper } from "@/components/ads/ad-placement-wrapper";

export const metadata: Metadata = {
  title: "Install DvTools on Android - PWA Installation Guide",
  description: "Install DvTools as a Progressive Web App on Android. Works with Chrome, Samsung Internet, Firefox, and other browsers. Step-by-step guide for all Android devices.",
  keywords: [
    "install dvtools android",
    "pwa android installation",
    "dvtools chrome android",
    "samsung internet pwa",
    "android developer tools app",
  ],
};

export default function AndroidInstallPage() {
  const browsers = [
    {
      name: 'Chrome (Recommended)',
      icon: <Chrome className="h-6 w-6" />,
      steps: [
        'Open Chrome on your Android device',
        'Navigate to the DvTools website',
        'Tap the menu (⋮) in the top-right corner',
        'Tap "Add to Home screen"',
        'Confirm by tapping "Add"'
      ],
      features: ['Full PWA support', 'Automatic updates', 'Best performance', 'Background sync'],
      rating: 5
    },
    {
      name: 'Samsung Internet',
      icon: <Globe className="h-6 w-6" />,
      steps: [
        'Open Samsung Internet app',
        'Go to the DvTools website',
        'Tap the menu (≡) at the bottom right',
        'Tap "Add page to" → "Home screen"',
        'Tap "Add" to confirm'
      ],
      features: ['Samsung integration', 'Edge panel support', 'Bixby integration', 'DeX optimization'],
      rating: 4
    },
    {
      name: 'Firefox',
      icon: <Globe className="h-6 w-6" />,
      steps: [
        'Open Firefox on your device',
        'Visit the DvTools website',
        'Tap the menu (⋮) in the top-right',
        'Look for "Install" or "Add to Home screen"',
        'Follow the prompts to install'
      ],
      features: ['Privacy focused', 'Tracking protection', 'Open source', 'Custom add-ons'],
      rating: 3
    }
  ];

  const features = [
    {
      title: "Native App Experience",
      description: "Installs like a regular Android app",
      icon: <Smartphone className="h-5 w-5 text-green-500" />
    },
    {
      title: "Offline Functionality",
      description: "Works without internet connection",
      icon: <Download className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Background Updates",
      description: "Automatically updates in the background",
      icon: <Star className="h-5 w-5 text-purple-500" />
    },
    {
      title: "App Drawer Access",
      description: "Available in your app drawer",
      icon: <CheckCircle2 className="h-5 w-5 text-orange-500" />
    }
  ];

  const troubleshooting = [
    {
      issue: "No install prompt appears",
      solution: "Try refreshing the page or clearing browser cache. Some older Android versions may have limited PWA support."
    },
    {
      issue: "Install option not visible in menu",
      solution: "Make sure you're using a modern browser (Chrome, Samsung Internet). Older browsers may not support PWA installation."
    },
    {
      issue: "App icon looks wrong",
      solution: "Wait a few minutes after installation for the icon to update, or restart your browser."
    },
    {
      issue: "App opens in browser instead of standalone",
      solution: "Check if you're using the latest browser version. Android 5.0+ required for proper PWA support."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-800 py-20 text-white">
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
              Android Guide
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Install on Android
            </h1>
            <p className="mb-8 text-lg opacity-90 sm:text-xl max-w-3xl mx-auto">
              Add DvTools to your Android device as a Progressive Web App. 
              Works with Chrome, Samsung Internet, Firefox, and other modern browsers.
            </p>
          </div>
        </div>
      </section>

      {/* Ad placement */}
      <AdPlacementWrapper placementKey="content_top" className="py-4" />

      {/* Browser Selection */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Choose Your Browser
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Different browsers have slightly different installation processes
            </p>
          </div>

          <div className="space-y-8">
            {browsers.map((browser, index) => (
              <Card key={browser.name} className="relative">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {browser.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{browser.name}</CardTitle>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < browser.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <CardDescription>Installation steps and features</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Installation Steps:</h4>
                    <ol className="space-y-2">
                      {browser.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium flex-shrink-0">
                            {stepIndex + 1}
                          </span>
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Browser Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {browser.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Android App Experience
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Install DvTools for a native Android app experience
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
                Common Android installation issues and solutions
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

      {/* System Requirements */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
              System Requirements
            </h2>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Minimum Requirements</h3>
                  <ul className="text-sm space-y-2 text-left">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Android 5.0 (API level 21)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Modern browser (Chrome 40+)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      50MB available storage
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Recommended</h3>
                  <ul className="text-sm space-y-2 text-left">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Android 8.0 or newer
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Chrome or Samsung Internet
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      100MB available storage
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
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
            Add DvTools to your Android device now
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