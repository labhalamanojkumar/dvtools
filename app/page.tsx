import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Code2, 
  FileJson, 
  Lock, 
  Regex, 
  Link2, 
  Binary,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Smartphone
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Professional <span className="text-primary">Developer Tools</span> Platform
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl md:text-2xl">
              Fast, secure, and privacy-focused tools for JSON formatting, Base64 encoding, 
              JWT decoding, code beautification, and more. All processing happens in your browser.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/tools">
                  Explore Tools <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Popular Developer Tools
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Professional-grade tools designed for developers, with powerful features and intuitive interfaces
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ToolCard
              icon={<FileJson className="h-8 w-8" />}
              title="JSON Formatter"
              description="Validate, format, and beautify JSON with syntax highlighting and error detection"
              href="/tools/json-formatter"
            />
            <ToolCard
              icon={<Binary className="h-8 w-8" />}
              title="Base64 Encoder"
              description="Encode and decode Base64 strings and files with MIME type detection"
              href="/tools/base64"
            />
            <ToolCard
              icon={<Code2 className="h-8 w-8" />}
              title="Code Beautifier"
              description="Format HTML, CSS, and JavaScript with customizable indentation"
              href="/tools/code-beautifier"
            />
            <ToolCard
              icon={<Link2 className="h-8 w-8" />}
              title="URL Encoder"
              description="Encode and decode URLs with query string visualization"
              href="/tools/url-encoder"
            />
            <ToolCard
              icon={<Lock className="h-8 w-8" />}
              title="JWT Decoder"
              description="Decode and validate JWT tokens with signature verification"
              href="/tools/jwt-decoder"
            />
            <ToolCard
              icon={<Regex className="h-8 w-8" />}
              title="RegExp Tester"
              description="Test regular expressions with real-time match highlighting"
              href="/tools/regexp-tester"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose DevTools Hub?
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="Lightning Fast"
              description="Client-side processing for instant results without server delays"
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="Privacy First"
              description="Your data never leaves your browser. No tracking, no storage"
            />
            <FeatureCard
              icon={<Smartphone className="h-10 w-10 text-primary" />}
              title="Mobile Ready"
              description="Fully responsive design works perfectly on all devices"
            />
            <FeatureCard
              icon={<CheckCircle2 className="h-10 w-10 text-primary" />}
              title="Open Source"
              description="Transparent, secure, and community-driven development"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <FAQItem
                question="Are these tools free to use?"
                answer="Yes! All our tools are completely free to use with no limitations. We believe in providing professional-grade tools accessible to everyone."
              />
              <FAQItem
                question="Is my data secure?"
                answer="Absolutely. All processing happens directly in your browser. We don't send your data to any servers, and we don't track or store any information."
              />
              <FAQItem
                question="Do I need to create an account?"
                answer="No account is required to use our tools. However, creating an account allows you to save your preferences and access advanced features."
              />
              <FAQItem
                question="Can I use these tools offline?"
                answer="Many of our tools work offline once loaded. We use modern web technologies to ensure functionality even without an internet connection."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to boost your productivity?
          </h2>
          <p className="mb-8 text-lg opacity-90 sm:text-xl">
            Join thousands of developers using DevTools Hub every day
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/tools">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function ToolCard({ 
  icon, 
  title, 
  description, 
  href 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
    >
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 flex items-center text-sm font-medium text-primary">
        Try it now
        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function FAQItem({ 
  question, 
  answer 
}: { 
  question: string; 
  answer: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="mb-2 text-lg font-semibold">{question}</h3>
      <p className="text-muted-foreground">{answer}</p>
    </div>
  );
}
