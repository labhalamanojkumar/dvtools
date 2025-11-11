import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Monitor,
  Chrome,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  Star,
  Globe,
  Apple,
} from "lucide-react";
import { AdPlacementWrapper } from "@/components/ads/ad-placement-wrapper";

export const metadata: Metadata = {
  title: "Install DvTools on Desktop - Windows, Mac & Linux PWA Guide",
  description: "Install DvTools as a desktop app on Windows, Mac, and Linux. Works with Chrome, Edge, Firefox, and Safari. Get app-like experience on your computer.",
  keywords: [
    "install dvtools desktop",
    "pwa desktop installation",
    "dvtools windows mac linux",
    "desktop progressive web app",
    "dvtools offline desktop",
  ],
};

export default function DesktopInstallPage() {
  const browsers = [
    {
      name: 'Chrome (Windows, Mac, Linux)',
      icon: <Chrome className="h-6 w-6" />,
      steps: [
        'Open Chrome browser',
        'Navigate to the DvTools website',
        'Look for the install icon (⊞) in the address bar',
        'Or click the menu (⋮) → "Install DvTools..."',
        'Click "Install" in the popup dialog',
        'The app will appear in your taskbar/dock'
      ],
      features: ['Excellent PWA support', 'Taskbar integration', 'Keyboard shortcuts', 'Window management'],
      rating: 5,
      platforms: ['Windows 7+', 'macOS 10.9+', 'Ubuntu 12.04+']
    },
    {
      name: 'Microsoft Edge',
      icon: <Globe className="h-6 w-6" />,
      steps: [
        'Open Microsoft Edge',
        'Visit the DvTools website',
        'Click the menu (⋯) → "Apps" → "Install this site as an app"',
        'Or look for the install icon in the address bar',
        'Confirm installation in the dialog',
        'Find DvTools in your Start menu/Applications'
      ],
      features: ['Windows integration', 'Taskbar pinning', 'Start menu', 'System notifications'],
      rating: 5,
      platforms: ['Windows 10+', 'macOS 10.14+']
    },
    {
      name: 'Safari (Mac only)',
      icon: <Apple className="h-6 w-6" />,
      steps: [
        'Open Safari on your Mac',
        'Go to the DvTools website',
        'Click "File" in the menu bar',
        'Select "Add to Dock"',
        'Customize name if desired',
        'Click "Add" to install'
      ],
      features: ['Native macOS integration', 'Dock integration', 'Spotlight search', 'Touch Bar support'],
      rating: 4,
      platforms: ['macOS 10.14+']
    },
    {
      name: 'Firefox (Limited)',
      icon: <Globe className="h-6 w-6" />,
      steps: [
        'Open Firefox',
        'Visit the DvTools website',
        'Look for "Install" in the address bar (may not appear)',
        'Or use Ctrl+Shift+I for developer tools',
        'Note: Limited PWA support in Firefox',
        'Consider using Chrome or Edge for full features'
      ],
      features: ['Basic web app support', 'Privacy focused', 'Open source', 'Limited PWA API'],
      rating: 3,
      platforms: ['Windows 7+', 'macOS 10.9+', 'Ubuntu 12.04+']
    }
  ];

  const features = [
    {
      title: "Desktop App Experience",
      description: "Runs in its own window, separate from browser",
      icon: <Monitor className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Taskbar/Dock Integration",
      description: "Quick access from your desktop",
      icon: <Star className="h-5 w-5 text-green-500" />
    },
    {
      title: "Offline Functionality",
      description: "Works without internet connection",
      icon: <Download className="h-5 w-5 text-purple-500" />
    },
    {
      title: "Auto-updates",
      description: "Automatically updates when online",
      icon: <CheckCircle2 className="h-5 w-5 text-orange-500" />
    }
  ];

  const troubleshooting = [
    {
      issue: "No install option appears",
      solution: "Try refreshing the page or updating your browser. Firefox has limited PWA support - consider Chrome or Edge."
    },
    {
      issue: "Install button is grayed out",
      solution: "Make sure you're on the main DvTools website (not a specific tool page). Some pages may not support installation."
    },
    {
      issue: "App opens in browser instead of separate window",
      solution: "Check your browser settings for PWA handling. You may need to manually create a shortcut."
    },
    {
      issue: "Can't find installed app",
      solution: "Look in your Start menu (Windows), Applications folder (Mac), or application launcher (Linux)."
    },
    {
      issue: "App won't update",
      solution: "Try manually checking for updates in your browser settings, or uninstall and reinstall the app."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 py-20 text-white">
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
                <Monitor className="h-10 w-10" />
              </div>
            </div>
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white">
              Desktop Guide
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Install on Desktop
            </h1>
            <p className="mb-8 text-lg opacity-90 sm:text-xl max-w-3xl mx-auto">
              Get DvTools as a desktop application on Windows, Mac, or Linux. 
              Works with Chrome, Edge, Safari, and other modern browsers.
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
              Different browsers offer different levels of desktop PWA support
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
                      <CardDescription>Installation steps and platform support</CardDescription>
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
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-3">Browser Features:</h4>
                      <div className="space-y-2">
                        {browser.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Supported Platforms:</h4>
                      <div className="space-y-1">
                        {browser.platforms.map((platform, platformIndex) => (
                          <Badge key={platformIndex} variant="outline" className="mr-1 mb-1 text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
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
              Desktop App Benefits
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Experience DvTools like a native desktop application
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

      {/* Platform Comparison */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Platform-Specific Features
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Each desktop platform offers unique integration benefits
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-blue-600" />
                  Windows
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Start menu integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Taskbar pinning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Windows notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">File associations</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5 text-gray-600" />
                  macOS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Dock integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Spotlight search</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Menu bar presence</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Touch Bar support</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-orange-600" />
                  Linux
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Application launcher</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Desktop shortcuts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">System tray</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Keyboard shortcuts</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Desktop Troubleshooting
              </h2>
              <p className="text-muted-foreground">
                Common desktop installation issues and solutions
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
              Desktop Requirements
            </h2>
            
            <div className="grid gap-6 sm:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Windows</h3>
                  <ul className="text-sm space-y-2 text-left">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Windows 7 or newer
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Chrome 40+ or Edge 79+
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      100MB storage space
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">macOS</h3>
                  <ul className="text-sm space-y-2 text-left">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      macOS 10.9 or newer
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Safari 11.1+ or Chrome 40+
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      100MB storage space
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Linux</h3>
                  <ul className="text-sm space-y-2 text-left">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Ubuntu 12.04 or newer
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Chrome 40+ or Firefox 79+
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      100MB storage space
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
            Add DvTools to your desktop now
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