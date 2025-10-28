import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle } from "lucide-react";
import SignUpForm from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up | DevTools Hub - Create Your Account",
  description:
    "Join DevTools Hub and get access to professional developer tools. Create your account to start using our comprehensive suite of development utilities.",
  keywords: [
    "sign up",
    "register",
    "create account",
    "developer tools",
    "join devtools hub",
  ],
  openGraph: {
    title: "Sign Up | DevTools Hub - Create Your Account",
    description:
      "Join DevTools Hub and get access to professional developer tools.",
    type: "website",
    url: "/auth/signup",
    siteName: "DevTools Hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up | DevTools Hub - Create Your Account",
    description:
      "Join DevTools Hub and get access to professional developer tools.",
  },
  alternates: {
    canonical: "/auth/signup",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const features = [
  {
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    text: "Access to all basic developer tools",
  },
  {
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    text: "300 API calls per month",
  },
  {
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    text: "Community support",
  },
  {
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    text: "Usage analytics and insights",
  },
  {
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    text: "Export functionality",
  },
  {
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    text: "Advanced formatting options",
  },
];

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Features */}
        <div className="hidden lg:block space-y-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-muted-foreground hover:text-primary mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold mb-4">Join DevTools Hub</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Get access to professional developer tools and start building
              better software faster.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">What you&apos;ll get:</h2>
            <div className="grid gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  {feature.icon}
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Limited Time Free Access</h3>
            <p className="text-sm text-muted-foreground">
              Enjoy all features completely free during our limited time
              promotion. Pro and Enterprise plans coming soon.
            </p>
          </div>
        </div>

        {/* Right side - Sign Up Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <p className="text-muted-foreground">
              Start your free trial and access all developer tools
            </p>
          </CardHeader>
          <CardContent>
            <SignUpForm />
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                href="/auth/signin"
                className="text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
