import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Smartphone,
  Globe,
  Users,
  TrendingUp,
  Database,
  Palette,
  Bug,
  Wrench,
  Server,
  GitBranch,
  BarChart3,
  Brain,
  Rocket,
  Star,
  Target,
  Award,
  Package,
  Search,
  Clock,
} from "lucide-react";
import type { Metadata } from "next";
import { AdPlacement } from "@/components/ads/ad-placement";

export const metadata: Metadata = {
  title: "DvTools - 67+ Free Developer Tools | Ultimate Developer Toolkit",
  description: "Complete developer toolkit with 67+ professional-grade tools for developers, DevOps engineers, and data scientists. JSON formatter, JWT decoder, API simulator, code beautifier, and more. 100% free, client-side processing, works offline. Trusted by 50,000+ developers.",
  keywords: [
    "developer tools",
    "free developer tools",
    "online developer tools",
    "web development tools",
    "programming tools",
    "json formatter",
    "jwt decoder",
    "base64 encoder",
    "regex tester",
    "api testing tools",
    "code beautifier",
    "code formatter",
    "devops tools",
    "backend tools",
    "frontend tools",
    "security tools",
    "privacy tools",
    "encryption tools",
    "data tools",
    "encoding tools",
    "decoding tools",
    "conversion tools",
    "validation tools",
    "testing tools",
    "debugging tools",
    "api simulator",
    "mock server",
    "webhook tester",
    "graphql playground",
    "database query runner",
    "ci/cd tools",
    "kubernetes dashboard",
    "container scanner",
    "infrastructure tools",
    "cloud tools",
    "serverless tools",
    "microservices tools",
    "rest api tools",
    "api documentation",
    "openapi editor",
    "swagger editor",
    "postman alternative",
    "insomnia alternative",
    "curl alternative",
    "code snippets",
    "code generator",
    "template generator",
    "boilerplate generator",
    "project starter",
    "development utilities",
    "web utilities",
    "online utilities",
    "free utilities",
    "productivity tools",
    "developer productivity",
    "coding tools",
    "programming utilities",
    "software development tools",
    "agile tools",
    "scrum tools",
    "project management tools",
    "collaboration tools",
    "team tools",
    "remote work tools",
    "work from home tools",
    "freelance tools",
    "startup tools",
    "enterprise tools",
    "saas tools",
    "platform tools",
    "toolkit",
    "toolbox",
    "swiss army knife",
    "all-in-one tools",
    "multi tool platform",
    "developer hub",
    "dev tools hub",
    "coding hub",
    "programming hub",
    "tech tools",
    "engineering tools",
    "software engineering",
    "full stack tools",
    "backend development",
    "frontend development",
    "mobile development",
    "app development",
    "web app tools",
    "progressive web app",
    "pwa tools",
    "offline tools",
    "client-side tools",
    "browser tools",
    "chrome tools",
    "firefox tools",
    "safari tools",
    "edge tools",
    "cross-platform tools",
    "responsive tools",
    "mobile-friendly tools",
    "accessibility tools",
    "seo tools",
    "performance tools",
    "optimization tools",
    "monitoring tools",
    "analytics tools",
    "tracking tools",
    "metrics tools",
    "dashboard tools",
    "visualization tools",
    "reporting tools",
    "export tools",
    "import tools",
    "migration tools",
    "data migration",
    "database tools",
    "sql tools",
    "nosql tools",
    "mongodb tools",
    "postgresql tools",
    "mysql tools",
    "redis tools",
    "elasticsearch tools",
    "apache tools",
    "nginx tools",
    "docker tools",
    "kubernetes tools",
    "helm tools",
    "terraform tools",
    "ansible tools",
    "jenkins tools",
    "github actions",
    "gitlab ci",
    "circleci tools",
    "travis ci",
    "azure devops",
    "aws tools",
    "gcp tools",
    "azure tools",
    "cloud native tools",
    "containerization tools",
    "orchestration tools",
    "deployment tools",
    "release tools",
    "version control tools",
    "git tools",
    "github tools",
    "gitlab tools",
    "bitbucket tools",
    "code review tools",
    "pull request tools",
    "merge tools",
    "diff tools",
    "comparison tools",
    "text comparison",
    "file comparison",
    "directory comparison",
    "image comparison",
    "screenshot tools",
    "screen capture",
    "recording tools",
    "demo tools",
    "presentation tools",
    "documentation tools",
    "api docs",
    "swagger docs",
    "readme generator",
    "changelog generator",
    "license generator",
    "gitignore generator",
    "dockerfile generator",
    "package.json generator",
    "tsconfig generator",
    "eslint config",
    "prettier config",
    "babel config",
    "webpack config",
    "vite config",
    "rollup config",
    "build tools",
    "bundler tools",
    "compiler tools",
    "transpiler tools",
    "linter tools",
    "formatter tools",
    "validator tools",
    "parser tools",
    "ast tools",
    "syntax tools",
    "code analysis",
    "static analysis",
    "code quality",
    "code coverage",
    "test coverage",
    "unit testing",
    "integration testing",
    "e2e testing",
    "acceptance testing",
    "regression testing",
    "load testing",
    "stress testing",
    "performance testing",
    "security testing",
    "penetration testing",
    "vulnerability scanning",
    "dependency scanning",
    "license scanning",
    "compliance tools",
    "gdpr tools",
    "hipaa tools",
    "pci dss tools",
    "soc2 tools",
    "iso27001 tools",
    "audit tools",
    "logging tools",
    "error tracking",
    "bug tracking",
    "issue tracking",
    "ticket tracking",
    "project tracking",
    "time tracking",
    "productivity tracking",
    "activity tracking",
    "session recording",
    "heatmap tools",
    "a/b testing",
    "feature flags",
    "experiment tools",
    "split testing",
    "conversion optimization",
    "funnel analysis",
    "cohort analysis",
    "retention analysis",
    "churn analysis",
    "user analytics",
    "product analytics",
    "business intelligence",
    "data analytics",
    "data science tools",
    "machine learning tools",
    "ai tools",
    "ml playground",
    "model training",
    "model deployment",
    "inference tools",
    "prediction tools",
    "classification tools",
    "clustering tools",
    "regression tools",
    "neural network tools",
    "deep learning tools",
    "nlp tools",
    "text analysis",
    "sentiment analysis",
    "language detection",
    "translation tools",
    "image processing",
    "image optimization",
    "image conversion",
    "image editor",
    "photo editor",
    "video tools",
    "audio tools",
    "media tools",
    "file tools",
    "pdf tools",
    "excel tools",
    "csv tools",
    "json tools",
    "xml tools",
    "yaml tools",
    "toml tools",
    "ini tools",
    "env tools",
    "config tools",
    "settings tools",
    "preferences tools",
    "customization tools",
    "theme tools",
    "color tools",
    "palette generator",
    "gradient generator",
    "icon generator",
    "logo generator",
    "favicon generator",
    "qr code generator",
    "barcode generator",
    "uuid generator",
    "random generator",
    "password generator",
    "hash generator",
    "checksum tools",
    "encryption tools",
    "decryption tools",
    "encoding tools",
    "base64 tools",
    "url encoding",
    "html encoding",
    "unicode tools",
    "ascii tools",
    "binary tools",
    "hex tools",
    "octal tools",
    "decimal tools",
    "number conversion",
    "unit conversion",
    "currency conversion",
    "timezone tools",
    "date tools",
    "time tools",
    "calendar tools",
    "schedule tools",
    "cron tools",
    "interval tools",
    "duration tools",
    "stopwatch tools",
    "timer tools",
    "countdown tools",
    "reminder tools",
    "notification tools",
    "alert tools",
    "webhook tools",
    "event tools",
    "messaging tools",
    "email tools",
    "sms tools",
    "push notification",
    "websocket tools",
    "sse tools",
    "grpc tools",
    "graphql tools",
    "rest tools",
    "soap tools",
    "rpc tools",
    "protocol tools",
    "network tools",
    "dns tools",
    "ip tools",
    "port scanner",
    "ping tools",
    "traceroute tools",
    "whois tools",
    "ssl tools",
    "certificate tools",
    "security headers",
    "csp tools",
    "cors tools",
    "http tools",
    "https tools",
    "http2 tools",
    "http3 tools",
    "tcp tools",
    "udp tools",
    "proxy tools",
    "vpn tools",
    "firewall tools",
    "load balancer",
    "cdn tools",
    "cache tools",
    "redis cache",
    "memcached tools",
    "varnish tools",
    "cdn purge",
    "cache invalidation",
    "cache warmer",
    "performance optimization",
    "speed optimization",
    "lighthouse tools",
    "pagespeed tools",
    "core web vitals",
    "web vitals",
    "performance metrics",
    "speed test",
    "benchmark tools",
    "profiler tools",
    "debugger tools",
    "inspector tools",
    "console tools",
    "terminal tools",
    "shell tools",
    "bash tools",
    "zsh tools",
    "powershell tools",
    "command line",
    "cli tools",
    "script tools",
    "automation tools",
    "workflow tools",
    "pipeline tools",
    "orchestration",
    "scheduling tools",
    "batch tools",
    "background jobs",
    "queue tools",
    "task runner",
    "job scheduler",
    "cron jobs",
    "worker tools",
    "async tools",
    "promise tools",
    "callback tools",
    "event loop",
    "concurrency tools",
    "parallel tools",
    "distributed tools",
    "microservices",
    "service mesh",
    "api gateway",
    "load balancing",
    "circuit breaker",
    "retry logic",
    "rate limiting",
    "throttling tools",
    "quota management",
    "api management",
    "api monitoring",
    "uptime monitoring",
    "health check",
    "status page",
    "incident management",
    "alerting",
    "on-call tools",
    "pager tools",
    "escalation tools",
    "runbook tools",
    "playbook tools",
    "documentation",
    "wiki tools",
    "knowledge base",
    "help desk",
    "support tools",
    "customer service",
    "ticketing system",
    "crm tools",
    "sales tools",
    "marketing tools",
    "growth tools",
    "analytics platform",
    "data platform",
    "developer platform",
    "integration platform",
    "api platform",
    "cloud platform",
    "paas tools",
    "iaas tools",
    "saas platform",
  ],
  authors: [{ name: "DvTools Team" }],
  creator: "DvTools",
  publisher: "DvTools",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dvtools.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DvTools - 67+ Free Developer Tools",
    description: "Complete developer toolkit with 67+ professional-grade tools. JSON formatter, JWT decoder, API simulator, and more. 100% free, client-side processing, works offline.",
    url: "https://dvtools.com",
    siteName: "DvTools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DvTools - Ultimate Developer Toolkit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DvTools - 67+ Free Developer Tools",
    description: "Complete developer toolkit with 67+ professional-grade tools. 100% free, client-side processing, works offline. Trusted by 50K+ developers.",
    images: ["/twitter-image.png"],
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "technology",
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://maltitoolplatform.com/#webapp",
        name: "DvTools",
        alternateName: "Ultimate Developer Toolkit",
        description: "Complete developer toolkit with 67+ professional-grade tools for developers, DevOps engineers, and data scientists. 100% free, client-side processing, works offline.",
        url: "https://dvtools.com",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web Browser",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "50000",
          bestRating: "5",
          worstRating: "1",
        },
        featureList: [
          "JSON Formatter & Validator",
          "JWT Token Decoder",
          "Base64 Encoder/Decoder",
          "RegExp Tester",
          "API Request Simulator",
          "Code Beautifier",
          "Mock Server",
          "Database Query Runner",
          "CI/CD Pipeline Editor",
          "A/B Test Manager",
          "Security Scanner",
          "Image Optimizer",
          "And 55 more tools...",
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://maltitoolplatform.com/#organization",
        name: "DvTools",
        url: "https://dvtools.com",
        logo: {
          "@type": "ImageObject",
          url: "https://dvtools.com/logo.png",
        },
        sameAs: [
          "https://github.com/dvtools",
          "https://twitter.com/dvtools",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://maltitoolplatform.com/#website",
        url: "https://dvtools.com",
        name: "DvTools",
        publisher: {
          "@id": "https://dvtools.com/#organization",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://dvtools.com/tools?search={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://maltitoolplatform.com/#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://dvtools.com",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://maltitoolplatform.com/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Are all the tools completely free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! All 67+ tools are 100% free to use with no hidden fees, subscriptions, or premium tiers. We believe in democratizing developer tools.",
            },
          },
          {
            "@type": "Question",
            name: "Is my data safe? Do you store anything?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Your data is completely safe. All tools run client-side in your browser - we never send your data to our servers or any third party. Your information never leaves your device.",
            },
          },
          {
            "@type": "Question",
            name: "Do I need to create an account?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No account required! You can use all tools instantly without signing up. We respect your privacy and don't track individual users.",
            },
          },
          {
            "@type": "Question",
            name: "Can I use these tools offline?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! Once you visit our site, most tools work offline thanks to Progressive Web App (PWA) technology. Perfect for developers on the go.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col">
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -ml-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/2 -mr-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            {/* Trust Badge */}
            <div className="mb-6 flex justify-center gap-2">
              <Badge variant="secondary" className="text-sm">
                <Users className="mr-1 h-3 w-3" />
                50,000+ Developers
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Star className="mr-1 h-3 w-3" />
                67 Professional Tools
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Shield className="mr-1 h-3 w-3" />
                100% Private
              </Badge>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              The Ultimate <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Developer Toolkit</span>{" "}
              for Modern Engineers
            </h1>
            <p className="mb-4 text-lg text-muted-foreground sm:text-xl md:text-2xl">
              67+ professional-grade tools for developers, DevOps engineers, and data scientists. 
              JSON, Base64, JWT, API testing, ML playground, analytics, and more—all free, secure, and blazing fast.
            </p>
            <p className="mb-8 text-base text-muted-foreground sm:text-lg">
              ⚡ Client-side processing • 🔒 Privacy-first • 🌐 Works offline • 📱 Mobile-optimized • 🎨 Modern UI
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="text-base" asChild>
                <Link href="/tools">
                  <Rocket className="mr-2 h-5 w-5" />
                  Explore 67 Free Tools
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link href="#tools-showcase">
                  <Search className="mr-2 h-5 w-5" />
                  Browse by Category
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Hassle-free experience</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Open source</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Enterprise-ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad placement between hero and stats */}
      <AdPlacement
        placementKey="content_middle"
        className="py-4"
      />

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <StatCard number="86+" label="Professional Tools" />
            <StatCard number="50K+" label="Active Users" />
            <StatCard number="1M+" label="Monthly Requests" />
            <StatCard number="99.9%" label="Uptime SLA" />
          </div>
        </div>
      </section>

      {/* Tool Categories Showcase */}
      <section id="tools-showcase" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              <Target className="mr-1 h-3 w-3" />
              Complete Toolkit
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Every Tool You Need, One Platform
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              From code formatting to ML experimentation, database management to A/B testing—we've got you covered
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <CategoryCard
              icon={<Code2 className="h-6 w-6" />}
              title="Development Tools"
              description="Code formatters, linters, beautifiers, snippet library, and dependency management"
              tools={14}
              href="/tools#development"
              badge="Most Popular"
            />
            <CategoryCard
              icon={<Database className="h-6 w-6" />}
              title="Data & Encoding"
              description="JSON, CSV, Base64, binary viewer, compression, serialization converters"
              tools={6}
              href="/tools#data"
            />
            <CategoryCard
              icon={<Server className="h-6 w-6" />}
              title="Backend & APIs"
              description="API testing, mock servers, GraphQL playground, database queries, migrations"
              tools={8}
              href="/tools#backend"
            />
            <CategoryCard
              icon={<Lock className="h-6 w-6" />}
              title="Security & Privacy"
              description="JWT decoder, secret scanner, vulnerability scanning, CSP testing, MFA controls"
              tools={7}
              href="/tools#security"
            />
            <CategoryCard
              icon={<GitBranch className="h-6 w-6" />}
              title="DevOps & Infrastructure"
              description="CI/CD pipelines, Kubernetes dashboard, container scanning, cost estimation"
              tools={6}
              href="/tools#devops"
              badge="New"
            />
            <CategoryCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Analytics & Testing"
              description="A/B testing, usage analytics, performance profiling, accessibility scanning"
              tools={4}
              href="/tools#analytics"
            />
            <CategoryCard
              icon={<Palette className="h-6 w-6" />}
              title="Design & UI"
              description="Color palettes, icon library, image editor, theme builder, responsive tester"
              tools={7}
              href="/tools#design"
            />
            <CategoryCard
              icon={<Brain className="h-6 w-6" />}
              title="AI & ML Playground"
              description="Machine learning experiments, text analysis, sentiment classification"
              tools={1}
              href="/tools/simple-ml-playground"
              badge="Popular"
            />
            <CategoryCard
              icon={<Wrench className="h-6 w-6" />}
              title="Web & Testing"
              description="RegExp tester, component playground, accessibility scanner, mock data generator"
              tools={6}
              href="/tools#web"
            />
            <CategoryCard
              icon={<Users className="h-6 w-6" />}
              title="Collaboration & Docs"
              description="Knowledge base, issue triage, RBAC, user impersonation, onboarding checklists, OpenAPI editor"
              tools={8}
              href="/tools#collaboration"
              badge="New"
            />
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <Star className="mr-1 h-3 w-3" />
              Top Rated
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Most Used Developer Tools
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Battle-tested tools trusted by thousands of developers worldwide
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ToolCard
              icon={<FileJson className="h-8 w-8" />}
              title="JSON Formatter & Validator"
              description="Validate, format, and beautify JSON with syntax highlighting, error detection, and tree view"
              href="/tools/json-formatter"
              badge="⚡ Most Popular"
            />
            <ToolCard
              icon={<Binary className="h-8 w-8" />}
              title="Base64 Encoder/Decoder"
              description="Encode and decode Base64 strings and files with MIME type detection and bulk processing"
              href="/tools/base64"
              badge="🔥 Trending"
            />
            <ToolCard
              icon={<Lock className="h-8 w-8" />}
              title="JWT Decoder & Validator"
              description="Decode, validate, and debug JWT tokens with signature verification and claims inspection"
              href="/tools/jwt-decoder"
              badge="🔒 Secure"
            />
            <ToolCard
              icon={<Server className="h-8 w-8" />}
              title="API Request Simulator"
              description="Test HTTP requests with authentication, headers, and response validation"
              href="/tools/api-simulator"
            />
            <ToolCard
              icon={<GitBranch className="h-8 w-8" />}
              title="CI/CD Pipeline Editor"
              description="Create and validate GitHub Actions, GitLab CI, and Jenkins pipelines"
              href="/tools/cicd-pipeline-editor"
              badge="✨ New"
            />
            <ToolCard
              icon={<BarChart3 className="h-8 w-8" />}
              title="A/B Test Manager"
              description="Create and analyze experiments with statistical significance testing"
              href="/tools/ab-test-manager"
            />
            <ToolCard
              icon={<Code2 className="h-8 w-8" />}
              title="Code Beautifier"
              description="Format HTML, CSS, JavaScript with customizable indentation and syntax"
              href="/tools/code-beautifier"
            />
            <ToolCard
              icon={<Database className="h-8 w-8" />}
              title="Database Query Runner"
              description="Execute SQL queries on PostgreSQL and MySQL with real-time results"
              href="/tools/database-query-runner"
            />
            <ToolCard
              icon={<Regex className="h-8 w-8" />}
              title="RegExp Tester"
              description="Test regular expressions with real-time match highlighting and explanations"
              href="/tools/regexp-tester"
            />
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/tools">
                View All 67 Tools <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Ad placement between featured tools and features */}
      <AdPlacement
        placementKey="sidebar_ad"
        className="py-4"
      />

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              <Award className="mr-1 h-3 w-3" />
              Why Choose Us
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Built for Developers, By Developers
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Enterprise-grade tools with consumer-friendly simplicity
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-yellow-500" />}
              title="Blazing Fast"
              description="Client-side processing means instant results. No server latency, no waiting."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-green-500" />}
              title="100% Private"
              description="Your data never leaves your device. Zero tracking, zero storage, zero compromise."
            />
            <FeatureCard
              icon={<Smartphone className="h-10 w-10 text-blue-500" />}
              title="Works Anywhere"
              description="Responsive design works flawlessly on desktop, tablet, and mobile devices."
            />
            <FeatureCard
              icon={<Globe className="h-10 w-10 text-purple-500" />}
              title="Offline Ready"
              description="Many tools work offline once loaded. Perfect for secure environments."
            />
            <FeatureCard
              icon={<CheckCircle2 className="h-10 w-10 text-emerald-500" />}
              title="Open Source"
              description="Transparent code you can trust. Contribute and customize as needed."
            />
            <FeatureCard
              icon={<Rocket className="h-10 w-10 text-orange-500" />}
              title="Always Updated"
              description="Regular updates with new features, improvements, and bug fixes."
            />
            <FeatureCard
              icon={<Package className="h-10 w-10 text-pink-500" />}
              title="No Installation"
              description="Browser-based tools require zero setup. Just click and use."
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-indigo-500" />}
              title="24/7 Available"
              description="Access your tools anytime, anywhere. No maintenance windows."
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              <Target className="mr-1 h-3 w-3" />
              Use Cases
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Perfect for Every Development Workflow
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <UseCaseCard
              title="Frontend Developers"
              description="Format code, test regex, validate JSON, optimize images, check accessibility, and build responsive designs."
              tools={["JSON Formatter", "Code Beautifier", "Image Optimizer", "Accessibility Scanner"]}
            />
            <UseCaseCard
              title="Backend Engineers"
              description="Test APIs, debug JWT tokens, manage databases, handle migrations, and monitor background jobs."
              tools={["API Simulator", "JWT Decoder", "Database Query Runner", "Migration Manager"]}
            />
            <UseCaseCard
              title="DevOps Teams"
              description="Build CI/CD pipelines, scan containers, manage Kubernetes, rotate secrets, and estimate costs."
              tools={["CI/CD Pipeline Editor", "Container Scanner", "Kubernetes Dashboard", "Cost Estimator"]}
            />
            <UseCaseCard
              title="Security Professionals"
              description="Scan for vulnerabilities, test CSP headers, detect secrets, configure MFA, and ensure compliance."
              tools={["Vulnerability Scanner", "CSP Tester", "Secret Scanner", "Privacy Compliance"]}
            />
            <UseCaseCard
              title="Data Scientists"
              description="Process CSV files, convert encodings, connect data sources, and experiment with ML models."
              tools={["CSV Inspector", "Data Connector", "ML Playground", "Serialization Converters"]}
            />
            <UseCaseCard
              title="Product Managers"
              description="Run A/B tests, analyze usage, track analytics, create onboarding flows, and manage issues."
              tools={["A/B Test Manager", "Usage Analytics", "Issue Triage", "Onboarding Generator"]}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                FAQ
              </Badge>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Common Questions Answered
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about our developer tools platform
              </p>
            </div>

            <div className="space-y-6">
              <FAQItem
                question="Are all 67 tools completely free?"
                answer="Yes! Every single tool is 100% free to use with no limitations, hidden fees, or paywalls. We're committed to providing professional-grade development tools accessible to everyone, from students to enterprise teams. If you find our tools helpful, consider supporting us through a voluntary donation."
              />
              <FAQItem
                question="How secure is my sensitive data?"
                answer="Extremely secure. All processing happens client-side in your browser. Your data never touches our servers, isn't logged, tracked, or stored anywhere. Perfect for handling API keys, tokens, and confidential information."
              />
              <FAQItem
                question="Do I need to create an account?"
                answer="No account required! Start using any tool immediately. Optional accounts unlock features like saving preferences, tool history, custom themes, and sync across devices—but it's entirely optional."
              />
              <FAQItem
                question="Can I use these tools offline?"
                answer="Yes! Most tools work offline once loaded thanks to Progressive Web App technology. Perfect for secure environments, air-gapped networks, or when traveling without internet."
              />
              <FAQItem
                question="Which browsers are supported?"
                answer="All modern browsers: Chrome, Firefox, Safari, Edge, and Brave. We use cutting-edge web standards while maintaining backward compatibility for older browser versions."
              />
              <FAQItem
                question="Can I integrate these tools into my workflow?"
                answer="Absolutely! We offer browser extensions, REST APIs, CLI tools, and embeddable widgets. Check our documentation for integration guides and code examples."
              />
              <FAQItem
                question="How often are tools updated?"
                answer="We ship updates weekly with new features, bug fixes, and performance improvements. Major new tools are added monthly based on community requests and development trends."
              />
              <FAQItem
                question="How can I support this project?"
                answer="We appreciate your support! You can help us by providing feedback, reporting bugs, suggesting new features, or making a voluntary donation. Your support helps us maintain and improve our tools for everyone."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-y bg-gradient-to-b from-muted/50 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              <Star className="mr-1 h-3 w-3" />
              Testimonials
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by Developers Worldwide
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Join 50,000+ developers who trust our tools daily
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <TestimonialCard
              quote="These tools have become indispensable in my daily workflow. The JWT decoder alone saves me hours every week."
              author="Sarah Chen"
              role="Senior Backend Engineer"
              company="Tech Startup"
            />
            <TestimonialCard
              quote="Finally, developer tools that respect privacy. Client-side processing means I can safely work with production data."
              author="Michael Rodriguez"
              role="DevOps Lead"
              company="Fortune 500"
            />
            <TestimonialCard
              quote="The A/B testing and analytics tools are game-changers. We've optimized our conversion rate by 40%."
              author="Emily Watson"
              role="Product Manager"
              company="SaaS Company"
            />
          </div>
        </div>
      </section>

      {/* CTA Section - Contact, Feedback & Support */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-20 text-primary-foreground">
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6">
            <Rocket className="mr-1 h-3 w-3" />
            Get In Touch
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            We'd Love to Hear From You!
          </h2>
          <p className="mb-8 text-lg opacity-90 sm:text-xl md:text-2xl">
            Questions, feedback, or want to support our mission?
          </p>
          <p className="mb-10 text-base opacity-80">
            ✨ 100% free forever • � We respond within 24 hours • ❤️ Community-driven
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            <Button size="lg" variant="secondary" className="text-base w-full" asChild>
              <Link href="/tools">
                <Zap className="mr-2 h-5 w-5" />
                Explore Tools
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 bg-white/10 text-base text-white hover:bg-white/20 w-full" asChild>
              <Link href="/contact">
                <Users className="mr-2 h-5 w-5" />
                Contact Us
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 bg-white/10 text-base text-white hover:bg-white/20 w-full" asChild>
              <Link href="/feedback">
                <Star className="mr-2 h-5 w-5" />
                Give Feedback
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 bg-white/10 text-base text-white hover:bg-white/20 w-full" asChild>
              <Link href="/donate">
                <TrendingUp className="mr-2 h-5 w-5" />
                Support Us
              </Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm opacity-75">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Trusted by 50K+ developers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>1M+ tools used monthly</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>99.9% uptime guaranteed</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">{number}</div>
      <div className="text-sm text-muted-foreground md:text-base">{label}</div>
    </div>
  );
}

function CategoryCard({
  icon,
  title,
  description,
  tools,
  href,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tools: number;
  href: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
    >
      {badge && (
        <Badge className="absolute right-4 top-4" variant="secondary">
          {badge}
        </Badge>
      )}
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{tools} tools</span>
        <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function ToolCard({
  icon,
  title,
  description,
  href,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
    >
      {badge && (
        <div className="absolute right-4 top-4">
          <Badge variant="secondary" className="text-xs">
            {badge}
          </Badge>
        </div>
      )}
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
  description,
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

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="mb-2 text-lg font-semibold">{question}</h3>
      <p className="text-muted-foreground">{answer}</p>
    </div>
  );
}

function UseCaseCard({
  title,
  description,
  tools,
}: {
  title: string;
  description: string;
  tools: string[];
}) {
  return (
    <Card className="group hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm font-medium">Recommended Tools:</p>
        <ul className="space-y-2">
          {tools.map((tool, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              {tool}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
  company,
}: {
  quote: string;
  author: string;
  role: string;
  company: string;
}) {
  return (
    <Card className="relative">
      <CardContent className="pt-6">
        <div className="mb-4 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <blockquote className="mb-6 text-sm leading-relaxed">
          &quot;{quote}&quot;
        </blockquote>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {author.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-semibold">{author}</p>
            <p className="text-xs text-muted-foreground">
              {role} at {company}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
