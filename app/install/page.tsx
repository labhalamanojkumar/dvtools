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
  Globe,
  Download,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
} from "lucide-react";
import { AdPlacement } from "@/components/ads/ad-placement";

export const metadata: Metadata = {
  title: "Install DvTools - Download for All Devices | Progressive Web App",
  description: "Install DvTools on your device for the best experience. Available for iPhone, Android, Windows, Mac, and Linux. Get 67+ developer tools offline.",
  keywords: [
    "install dvtools",
    "download dvtools",
    "pwa install",
    "progressive web app",
    "developer tools app",
    "ios install",
    "android install",
    "desktop app",
  ],
};

export default function InstallPage() {
  const platforms = [
    {
      id: 'ios',
      name: 'iPhone & iPad',
      icon: <Smartphone className="h-8 w-8" />,
      description: 'Add to Home Screen for quick access',
      steps: [
        'Open Safari and visit DvTools',
        'Tap the Share button (square with arrow up)',
        'Scroll down and tap "Add to Home Screen"',
        'Customize the name if desired',
        'Tap "Add" to confirm'
      ],
      features: [
        'Works offline once loaded',
        'Appears on home screen like native app',
        'Full-screen experience',
        'Fast app-like performance'
      ],
      badge: 'Most Popular'
    },
    {
      id: 'android',
      name: 'Android Phones & Tablets',
      icon: <Smartphone className="h-8 w-8" />,
      description: 'Install as a native app experience',
      steps: [
        'Open Chrome (recommended) or Samsung Internet',
        'Visit DvTools website',
        'Look for "Install App" prompt or menu option',
        'Chrome: Menu (⋮) → "Add to Home screen"',
        'Samsung: Menu (≡) → "Add page to" → "Home screen"',
        'Confirm installation'
      ],
      features: [
        'Native app-like experience',
        'Offline functionality',
        'Background sync',
        'Push notifications ready'
      ],
      badge: 'Recommended'
    },
    {
      id: 'desktop',
      name: 'Windows, Mac & Linux',
      icon: <Monitor className="h-8 w-8" />,
      description: 'Install as desktop application',
      steps: [
        'Open Chrome, Edge, or Brave browser',
        'Visit DvTools website',
        'Look for install icon in address bar',
        'Or use browser menu: Install DvTools',
        'Click "Install" in the popup',
        'App will be installed to desktop/taskbar'
      ],
      features: [
        'Desktop app experience',
        'Taskbar/dock integration',
        'Keyboard shortcuts',
        'Window management'
      ],
      badge: 'Desktop'
    }
  ];

  const browsers = [
    {
      name: 'Chrome',
      icon: <Chrome className="h-6 w-6" />,
      rating: 5,
      pwa: 'Excellent',
      install: 'Easy',
      description: 'Best PWA support with full offline capabilities',
      platforms: ['Windows', 'Mac', 'Linux', 'Android', 'iOS'],
      features: ['Full PWA API support', 'Background sync', 'Push notifications', 'App shortcuts']
    },
    {
      name: 'Edge',
      icon: <Globe className="h-6 w-6" />,
      rating: 5,
      pwa: 'Excellent',
      install: 'Easy',
      description: 'Microsoft\'s Chromium-based browser with great PWA support',
      platforms: ['Windows', 'Mac', 'Android'],
      features: ['Full PWA API support', 'Windows integration', 'App management', 'Taskbar pinning']
    },
    {
      name: 'Safari',
      icon: <Globe className="h-6 w-6" />,
      rating: 4,
      pwa: 'Good',
      install: 'Manual',
      description: 'Native macOS and iOS browser with solid PWA features',
      platforms: ['Mac', 'iPhone', 'iPad'],
      features: ['Home screen web apps', 'Offline support', 'iOS integration', 'Touch optimization']
    },
    {
      name: 'Firefox',
      icon: <Globe className="h-6 w-6" />,
      rating: 3,
      pwa: 'Limited',
      install: 'Manual',
      description: 'Privacy-focused browser with basic PWA support',
      platforms: ['Windows', 'Mac', 'Linux', 'Android'],
      features: ['Basic PWA support', 'Privacy focused', 'Open source', 'Customization']
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-20 text-primary-foreground">
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6">
            <Download className="mr-1 h-3 w-3" />
            Free Installation
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Install DvTools Anywhere
          </h1>
          <p className="mb-8 text-lg opacity-90 sm:text-xl md:text-2xl max-w-3xl mx-auto">
            Get the full experience on all your devices. Install as a native app with offline support, 
            home screen icon, and app-like performance.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" variant="secondary" className="text-base" asChild>
              <a href="#platforms">
                <Download className="mr-2 h-5 w-5" />
                Choose Your Platform
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 bg-white/10 text-base text-white hover:bg-white/20" asChild>
              <Link href="/">
                <Globe className="mr-2 h-5 w-5" />
                Try Online First
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Ad placement */}
      <AdPlacement placementKey="content_top" className="py-4" />

      {/* Platform Selection */}
      <section id="platforms" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              <Smartphone className="mr-1 h-3 w-3" />
              Platform Guides
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Choose Your Device Type
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Select your platform below for detailed installation instructions
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {platforms.map((platform) => (
              <Card key={platform.id} className="relative group hover:shadow-lg transition-all">
                {platform.badge && (
                  <Badge className="absolute right-4 top-4" variant="secondary">
                    {platform.badge}
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {platform.icon}
                  </div>
                  <CardTitle className="text-xl">{platform.name}</CardTitle>
                  <CardDescription>{platform.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Installation Steps:</h4>
                    <ol className="space-y-2">
                      {platform.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">What you get:</h4>
                    <ul className="space-y-1">
                      {platform.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full" asChild>
                    <Link href={`/install/${platform.id}`}>
                      View Detailed Guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Browser Compatibility */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              <Globe className="mr-1 h-3 w-3" />
              Browser Support
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Best Browsers for PWA
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              For the best installation experience, use a browser with full PWA support
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {browsers.map((browser) => (
              <Card key={browser.name} className="group hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {browser.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{browser.name}</CardTitle>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < browser.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <CardDescription className="mt-1">{browser.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">PWA Support</p>
                      <p className="text-muted-foreground">{browser.pwa}</p>
                    </div>
                    <div>
                      <p className="font-medium">Install Process</p>
                      <p className="text-muted-foreground">{browser.install}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-2">Supported Platforms:</p>
                    <div className="flex flex-wrap gap-1">
                      {browser.platforms.map((platform) => (
                        <Badge key={platform} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Key Features:</p>
                    <ul className="space-y-1">
                      {browser.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              <Zap className="mr-1 h-3 w-3" />
              Why Install?
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              App-Like Experience
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Zap className="h-8 w-8 text-yellow-500" />,
                title: 'Blazing Fast',
                description: 'Instant loading with cached resources'
              },
              {
                icon: <Globe className="h-8 w-8 text-blue-500" />,
                title: 'Works Offline',
                description: 'Access tools without internet connection'
              },
              {
                icon: <Smartphone className="h-8 w-8 text-green-500" />,
                title: 'Native Feel',
                description: 'App-like experience on any device'
              },
              {
                icon: <CheckCircle2 className="h-8 w-8 text-purple-500" />,
                title: 'Always Updated',
                description: 'Automatic updates with latest features'
              }
            ].map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="mb-2 font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Installation FAQ
              </Badge>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Common Questions
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: 'Is installing DvTools really free?',
                  answer: 'Absolutely! Installation and usage are completely free. There are no hidden fees, subscriptions, or premium tiers.'
                },
                {
                  question: 'Will the app take up storage space?',
                  answer: 'PWA apps are much smaller than native apps. DvTools typically uses less than 10MB of storage, and you can uninstall it anytime through your browser settings.'
                },
                {
                  question: 'Can I use the installed app offline?',
                  answer: 'Yes! Once loaded, most DvTools features work offline. This is perfect for secure environments or when you don\'t have internet access.'
                },
                {
                  question: 'What if my browser doesn\'t support PWA?',
                  answer: 'You can still use DvTools through your browser - all features work normally. For the best experience, consider updating to a modern browser like Chrome or Edge.'
                },
                {
                  question: 'How do I update the installed app?',
                  answer: 'Updates are automatic! The app will update in the background when you\'re online, ensuring you always have the latest features and improvements.'
                },
                {
                  question: 'Can I install on multiple devices?',
                  answer: 'Yes, there\'s no limit! Install DvTools on as many devices as you want - desktop, laptop, tablet, and phone. Each installation works independently.'
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h3 className="mb-2 font-semibold">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
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
            Join 50,000+ developers using DvTools daily
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" variant="secondary" className="text-base" asChild>
              <Link href="/">
                <Download className="mr-2 h-5 w-5" />
                Start Installation
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 bg-white/10 text-base text-white hover:bg-white/20" asChild>
              <Link href="/tools">
                Explore 67 Free Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}