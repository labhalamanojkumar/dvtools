import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ToolsPage() {
  const tools = [
    {
      name: "Binary Viewer & Hex Inspector",
      description: "Professional binary file viewer with hex display, byte pattern search, and range export capabilities",
      href: "/tools/binary-viewer",
      category: "Data",
    },
    {
      name: "Compression Tools",
      description: "File compression and decompression tools supporting gzip, Brotli, and Zstd formats",
      href: "/tools/compression-tools",
      category: "Data",
    },
    {
      name: "Serialization Converters",
      description: "Convert between different data serialization formats including Protobuf, Avro, and MessagePack",
      href: "/tools/serialization-converters",
      category: "Data",
    },
    {
      name: "CSV/TSV Encoder-Decoder",
      description: "Professional CSV and TSV file processing tool with parsing, validation, and encoding conversion",
      href: "/tools/csv-tsv-encoder-decoder",
      category: "Data",
    },
    {
      name: "Base64 Encoder",
      description: "Encode and decode Base64 strings",
      href: "/tools/base64",
      category: "Encoding",
    },
    {
      name: "Character Encoding Converter",
      description: "Convert text between different character encodings with automatic detection and validation",
      href: "/tools/character-encoding-converter",
      category: "Encoding",
    },
    {
      name: "Linter Runner",
      description: "Multi-language code linting with ESLint, Flake8, RuboCop, and Stylelint support",
      href: "/tools/linter-runner",
      category: "Development",
    },
    {
      name: "Code Formatter Profiles",
      description: "Custom code formatting profiles with Prettier and Black support",
      href: "/tools/formatter-profiles",
      category: "Development",
    },
    {
      name: "Code Formatting, Linters & Productivity Tools",
      description: "Comprehensive suite with multi-language linting, formatting profiles, snippet library, dependency updates, and dev tunneling",
      href: "/tools/code-formatting-tools",
      category: "Development",
    },
    {
      name: "Mock Data Generator",
      description: "Generate realistic test data for development and testing",
      href: "/tools/mock-data-generator",
      category: "Development",
    },
    {
      name: "Dependency Updater",
      description: "Update npm dependencies with security scanning and compatibility checks",
      href: "/tools/dependency-updater",
      category: "Development",
    },
    {
      name: "Dev Tunneler",
      description: "Expose local development servers with ngrok, Cloudflare Tunnel, and more",
      href: "/tools/dev-tunneler",
      category: "Development",
    },
    {
      name: "CSS Linter & Optimizer",
      description: "Lint, validate, and optimize CSS with error detection and performance improvements",
      href: "/tools/css-linter-optimizer",
      category: "Development",
    },
    {
      name: "URL Encoder",
      description: "Encode and decode URLs and query strings",
      href: "/tools/url-encoder",
      category: "Web",
    },
    {
      name: "JWT Decoder",
      description: "Decode and validate JSON Web Tokens",
      href: "/tools/jwt-decoder",
      category: "Security",
    },
    {
      name: "Static Secret Scanner",
      description: "Scan code for hardcoded secrets, API keys, and sensitive data",
      href: "/tools/static-secret-scanner",
      category: "Security",
    },
    {
      name: "Dependency Vulnerability Scanner",
      description: "Scan project dependencies for known security vulnerabilities",
      href: "/tools/dependency-vulnerability-scanner",
      category: "Security",
    },
    {
      name: "CSP & Security Headers Tester",
      description: "Test Content Security Policy and security headers implementation",
      href: "/tools/csp-security-headers-tester",
      category: "Security",
    },
    {
      name: "Penetration Test Checklist",
      description: "Comprehensive checklist for penetration testing and issue tracking",
      href: "/tools/penetration-test-checklist",
      category: "Security",
    },
    {
      name: "Privacy Compliance Helper",
      description: "GDPR, CCPA compliance checker with privacy policy generator",
      href: "/tools/privacy-compliance-helper",
      category: "Security",
    },
    {
      name: "MFA & Session Controls",
      description: "Configure multi-factor authentication and session management policies",
      href: "/tools/mfa-session-controls",
      category: "Security",
    },
    {
      name: "RegExp Tester",
      description: "Test regular expressions with real-time matching",
      href: "/tools/regexp-tester",
      category: "Development",
    },
    {
      name: "Component Playground",
      description: "Interactive React component explorer with live previews",
      href: "/tools/component-playground",
      category: "Development",
    },
    {
      name: "Responsive Design Tester",
      description: "Test websites across different device sizes",
      href: "/tools/responsive-design-tester",
      category: "Design",
    },
    {
      name: "Image Optimizer & Converter",
      description: "Compress and convert images with batch processing",
      href: "/tools/image-optimizer-converter",
      category: "Media",
    },
    {
      name: "Image Editor",
      description: "Crop, compress, annotate, and add overlays for screenshots and photos",
      href: "/tools/image-editor",
      category: "Media",
    },
    {
      name: "Accessibility Scanner",
      description: "WCAG compliance checker for web accessibility",
      href: "/tools/accessibility-scanner",
      category: "Testing",
    },
    {
      name: "Performance Profiler",
      description: "Analyze Core Web Vitals and performance metrics",
      href: "/tools/performance-profiler",
      category: "Testing",
    },
    {
      name: "Static Site Exporter",
      description: "Export websites to static HTML with asset optimization",
      href: "/tools/static-site-exporter",
      category: "Development",
    },
    {
      name: "Theme Builder",
      description: "Create custom themes with color palettes and typography",
      href: "/tools/theme-builder",
      category: "Design",
    },
    {
      name: "API Request Simulator",
      description: "Test HTTP requests with authentication and response validation",
      href: "/tools/api-simulator",
      category: "Backend",
    },
    {
      name: "Database Query Runner",
      description: "Execute read-only SQL queries on PostgreSQL and MySQL databases",
      href: "/tools/database-query-runner",
      category: "Backend",
    },
    {
      name: "Migration Manager",
      description: "Manage database migrations with preview, execution, and rollback",
      href: "/tools/migration-manager",
      category: "Backend",
    },
    {
      name: "Text to ASCII Art",
      description: "Convert text to decorative ASCII art with multiple font styles",
      href: "/tools/text-to-ascii-art",
      category: "Development",
    },
    {
      name: "HMAC Generator",
      description: "Generate HMAC hashes for API authentication and data integrity verification",
      href: "/tools/hmac-generator",
      category: "Security",
    },
    {
      name: "Code Beautifier Enhanced",
      description: "Format and beautify HTML, CSS, and JavaScript code with customizable options",
      href: "/tools/code-beautifier-enhanced",
      category: "Development",
    },
    {
      name: "Date & Timezone Converter",
      description: "Convert dates and times between timezones with Unix timestamp support",
      href: "/tools/date-timezone-tool",
      category: "Development",
    },
    {
      name: "SEO Meta Tag Generator",
      description: "Generate optimized meta tags including OpenGraph, Twitter Cards, and JSON-LD",
      href: "/tools/seo-meta-generator",
      category: "Web",
    },
    {
      name: "Text Diff Checker",
      description: "Compare text files, code, and configurations with side-by-side diff viewer",
      href: "/tools/text-diff-checker",
      category: "Development",
    },
    {
      name: "Background Job Debugger",
      description: "Monitor and manage Bull queues with real-time job inspection",
      href: "/tools/background-job-debugger",
      category: "Backend",
    },
    {
      name: "Rate-limiter Dashboard",
      description: "Store and track rate limiting rules with monitoring",
      href: "/tools/rate-limiter-dashboard",
      category: "Backend",
    },
    {
      name: "Secrets Vault Interface",
      description: "Secure encrypted credential storage with access tracking",
      href: "/tools/secrets-vault-interface",
      category: "Backend",
    },
    {
      name: "Design-to-Code Exporter",
      description: "Convert Figma designs to React and Vue component scaffolds",
      href: "/tools/design-to-code-exporter",
      category: "Design",
    },
    {
      name: "Icon & Illustration Library",
      description: "Free SVG icons and illustrations with customization options",
      href: "/tools/icon-library",
      category: "Design",
    },
    {
      name: "Color Palette Studio",
      description: "Generate and manage color palettes with accessibility checking",
      href: "/tools/color-palette-studio",
      category: "Design",
    },
    {
      name: "Color Palette Generator",
      description: "Create harmonious color schemes, extract colors from images, and export to CSS/JSON",
      href: "/tools/color-palette-generator",
      category: "Design",
    },
    {
      name: "Lorem Ipsum Generator",
      description: "Generate placeholder text for designs and prototypes",
      href: "/tools/lorem-ipsum-generator",
      category: "Development",
    },
    {
      name: "Markdown Editor",
      description: "Live markdown editor with preview, syntax highlighting, and file upload support",
      href: "/tools/markdown-editor",
      category: "Development",
    },
    {
      name: "YAML Validator & Converter",
      description: "Validate YAML syntax and convert between YAML and JSON formats with file upload",
      href: "/tools/yaml-validator",
      category: "Development",
    },
    {
      name: "Git Commands Cheatsheet",
      description: "Comprehensive Git commands reference with search, examples, and copy functionality",
      href: "/tools/git-cheatsheet",
      category: "Development",
    },
    {
      name: "Prototype Linker",
      description: "Create clickable prototypes with user feedback collection",
      href: "/tools/prototype-linker",
      category: "Design",
    },
    {
      name: "Log Viewer & Search",
      description: "Centralized logging system with advanced search, filtering, and analytics",
      href: "/tools/log-viewer",
      category: "Analytics",
    },
    {
      name: "CSV/Excel Inspector & Transformer",
      description: "Upload, inspect, and transform CSV and Excel files with data quality analysis",
      href: "/tools/csv-excel-inspector",
      category: "Data",
    },
    {
      name: "Data Connector Hub",
      description: "Manage connections to databases, APIs, and cloud storage services",
      href: "/tools/data-connector-hub",
      category: "Data",
    },
    {
      name: "Simple ML Playground",
      description: "Experiment with machine learning models for text analysis and classification",
      href: "/tools/simple-ml-playground",
      category: "AI/ML",
    },
    {
      name: "A/B Test Manager",
      description: "Create and manage A/B tests with cohort assignment and statistical analysis",
      href: "/tools/ab-test-manager",
      category: "Analytics",
    },
    {
      name: "Usage Analytics Explorer",
      description: "Track user behavior, analyze engagement metrics, and generate insights with real-time analytics",
      href: "/tools/usage-analytics",
      category: "Analytics",
    },
    {
      name: "Mock Server",
      description: "Create mock API endpoints with custom responses, delays, and request logging",
      href: "/tools/mock-server",
      category: "Backend",
    },
    {
      name: "Contract Testing",
      description: "Validate API contracts between services with Pact testing framework",
      href: "/tools/contract-testing",
      category: "Testing",
    },
    {
      name: "Webhook Tester",
      description: "Test webhook endpoints with request capture, replay, and signature validation",
      href: "/tools/webhook-tester",
      category: "Backend",
    },
    {
      name: "WebSocket Tester",
      description: "Test WebSocket connections, send and receive messages in real-time with logging",
      href: "/tools/websocket-tester",
      category: "Backend",
    },
    {
      name: "API Key Manager",
      description: "Generate, manage, and rotate API keys with usage tracking and expiration",
      href: "/tools/api-key-manager",
      category: "Backend",
    },
    {
      name: "GraphQL Playground",
      description: "Interactive GraphQL IDE with schema exploration and query execution",
      href: "/tools/graphql-playground",
      category: "Backend",
    },
    {
      name: "Infrastructure Blueprinter",
      description: "Validate and visualize Terraform/IaC code with drift detection and compliance checks",
      href: "/tools/infrastructure-blueprinter",
      category: "DevOps",
    },
    {
      name: "Container Image Scanner",
      description: "Scan Docker images for vulnerabilities, analyze layers, and generate SBOM reports",
      href: "/tools/container-image-scanner",
      category: "DevOps",
    },
    {
      name: "Kubernetes Dashboard",
      description: "Monitor and manage Kubernetes clusters with pod logs, metrics, and resource management",
      href: "/tools/kubernetes-dashboard",
      category: "DevOps",
    },
    {
      name: "CI/CD Pipeline Editor",
      description: "Create and validate GitHub Actions, GitLab CI, and Jenkins pipelines with syntax highlighting",
      href: "/tools/cicd-pipeline-editor",
      category: "DevOps",
    },
    {
      name: "Secrets Rotation Scheduler",
      description: "Automate credential rotation with scheduling, expiration tracking, and rotation history",
      href: "/tools/secrets-rotation-scheduler",
      category: "DevOps",
    },
    {
      name: "Cloud Cost Estimator",
      description: "Estimate AWS, Azure, and GCP costs with usage forecasting and budget alerts",
      href: "/tools/cost-estimator",
      category: "DevOps",
    },
    {
      name: "Knowledge Base Editor",
      description: "Create and manage documentation with markdown editing, versioning, and search indexing",
      href: "/tools/knowledge-base-editor",
      category: "Collaboration",
    },
    {
      name: "Issue Triage Board",
      description: "Manage bug reports and feature requests with priority assignment and SLA tracking",
      href: "/tools/issue-triage-board",
      category: "Collaboration",
    },
    {
      name: "Role-Based Access Controls",
      description: "Configure granular permissions, user roles, and access audit logs",
      href: "/tools/role-based-access-controls",
      category: "Collaboration",
    },
    {
      name: "User Impersonation Console",
      description: "Safely impersonate users for debugging with consent logging and session tracking",
      href: "/tools/user-impersonation-console",
      category: "Collaboration",
    },
    {
      name: "Onboarding Checklist Generator",
      description: "Create customizable onboarding workflows with progress tracking and completion analytics",
      href: "/tools/onboarding-checklist-generator",
      category: "Collaboration",
    },
    {
      name: "Enhanced Onboarding Checklist Generator ⚡",
      description: "Advanced checklist management with real-time collaboration, multiple file format support (JSON, CSV, Excel, PDF, Markdown), drag-and-drop reordering, advanced analytics, and notification system",
      href: "/tools/enhanced-onboarding-checklist-generator",
      category: "Collaboration",
    },
    {
      name: "OpenAPI Editor",
      description: "Design and document REST APIs with OpenAPI/Swagger specification editor",
      href: "/tools/openapi-editor",
      category: "Backend",
    },
    {
      name: "Code Snippet Library",
      description: "Store and organize reusable code snippets with search and tagging",
      href: "/tools/snippet-library",
      category: "Development",
    },
    {
      name: "JSON Formatter",
      description: "Format, validate, and beautify JSON data with syntax highlighting",
      href: "/tools/json-formatter",
      category: "Data",
    },
    {
      name: "Code Beautifier",
      description: "Format and beautify code for multiple programming languages",
      href: "/tools/code-beautifier",
      category: "Development",
    },
    {
      name: "Ad System Test",
      description: "Test ad placements, impressions, and click tracking",
      href: "/tools/ad-system-test",
      category: "Testing",
    },
  ];

  // Fixed category order to prevent hydration mismatch
  const categories = [
    "Data",
    "Encoding", 
    "Development",
    "Web",
    "Security",
    "Design",
    "Media",
    "Testing",
    "Backend",
    "Analytics",
    "AI/ML",
    "DevOps",
    "Collaboration"
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Developer Tools</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Professional-grade tools for developers. All tools are free, secure,
          and process data locally in your browser.
        </p>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">{category}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools
              .filter((tool) => tool.category === category)
              .map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="group rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
                >
                  <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                  <Button variant="link" className="mt-4 p-0">
                    Try it now →
                  </Button>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export const metadata = {
  title:
    "Developer Tools - Free Online Tools for Developers | Multi Tool Platform",
  description:
    "Free online developer tools for JSON formatting, Base64 encoding, JWT decoding, CSS optimization, accessibility testing, performance profiling, A/B testing, ML models, and more. All tools are secure and process data locally.",
  keywords: [
    "developer tools",
    "online tools",
    "JSON formatter",
    "Base64 encoder",
    "character encoding converter",
    "binary viewer",
    "hex inspector",
    "compression tools",
    "serialization converters",
    "CSV TSV encoder decoder",
    "JWT decoder",
    "static secret scanner",
    "secret detection",
    "API key scanner",
    "hardcoded secrets",
    "dependency vulnerability scanner",
    "security vulnerabilities",
    "CVE scanner",
    "CSP tester",
    "Content Security Policy",
    "security headers",
    "HTTP security headers",
    "penetration testing",
    "pentest checklist",
    "security assessment",
    "privacy compliance",
    "GDPR compliance",
    "CCPA compliance",
    "privacy policy generator",
    "MFA configuration",
    "multi-factor authentication",
    "session management",
    "authentication policies",
    "code formatting",
    "code beautifier",
    "linter",
    "ESLint",
    "Flake8",
    "RuboCop",
    "Stylelint",
    "code formatter",
    "Prettier",
    "Black",
    "code snippets",
    "snippet library",
    "dependency updater",
    "npm update",
    "security scanning",
    "dev tunneling",
    "ngrok",
    "Cloudflare Tunnel",
    "localtunnel",
    "development server",
    "local development",
    "CSS optimizer",
    "accessibility scanner",
    "performance profiler",
    "responsive design tester",
    "image optimizer",
    "image editor",
    "photo editor",
    "crop image",
    "compress image",
    "annotate image",
    "add overlays",
    "theme builder",
    "static site exporter",
    "component playground",
    "regex tester",
    "URL encoder",
    "web development tools",
    "programming tools",
    "free developer tools",
    "API simulator",
    "HTTP request testing",
    "database query runner",
    "SQL executor",
    "PostgreSQL tools",
    "MySQL tools",
    "migration manager",
    "database migration",
    "schema migration",
    "backend tools",
    "database tools",
    "design to code",
    "figma to react",
    "figma to vue",
    "component generator",
    "icon library",
    "svg icons",
    "illustrations",
    "color palette",
    "design tokens",
    "mock data generator",
    "test data",
    "prototype linker",
    "clickable prototypes",
    "UI tools",
    "UX tools",
    "design tools",
    "graphics tools",
    "log viewer",
    "logging system",
    "centralized logging",
    "CSV inspector",
    "Excel transformer",
    "data transformation",
    "data connector",
    "database connection",
    "API integration",
    "cloud storage",
    "machine learning",
    "ML playground",
    "text analysis",
    "sentiment analysis",
    "text classification",
    "A/B testing",
    "experiment management",
    "statistical analysis",
    "cohort assignment",
    "conversion optimization",
    "usage analytics",
    "user behavior tracking",
    "engagement metrics",
    "analytics dashboard",
    "real-time analytics",
    "event tracking",
    "user insights",
    "conversion funnel",
    "session analysis",
    "page views",
    "bounce rate",
    "user journey",
    "behavior analytics",
  ],
  authors: [{ name: "Multi Tool Platform" }],
  creator: "Multi Tool Platform",
  publisher: "Multi Tool Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    title: "Developer Tools - Free Online Tools for Developers",
    description:
      "Professional-grade developer tools for JSON, CSS, accessibility testing, performance analysis, A/B testing, and ML models. All tools are free, secure, and work offline.",
    url: "/tools",
    siteName: "Multi Tool Platform",
    images: [
      {
        url: "/og-tools.jpg",
        width: 1200,
        height: 630,
        alt: "Developer Tools - Multi Tool Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Tools - Free Online Tools for Developers",
    description:
      "Professional-grade developer tools for JSON, CSS, accessibility testing, performance analysis, A/B testing, and ML models.",
    images: ["/og-tools.jpg"],
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
};
