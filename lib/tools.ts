import { Tool } from "@/types";

export const toolsConfig: Record<string, {
  name: string;
  description: string;
  category: string;
  icon: string;
  features: string[];
  keywords: string[];
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  requiresAPI: boolean;
}> = {
  "base64": {
    name: "Base64 Encoder/Decoder",
    description: "Convert text and files to Base64 encoding or decode Base64 strings. Supports file upload and download functionality.",
    category: "Encoding",
    icon: "🔤",
    features: ["Text encoding/decoding", "File upload/download", "MIME type detection", "Copy to clipboard"],
    keywords: ["base64", "encoder", "decoder", "encoding", "conversion"],
    acceptedFileTypes: ["text/*", "application/json", "application/xml", "image/*"],
    maxFileSize: 10,
    requiresAPI: false
  },
  "json-formatter": {
    name: "JSON Formatter & Validator",
    description: "Format, validate, and beautify JSON data with syntax highlighting and error detection.",
    category: "Data Processing",
    icon: "📋",
    features: ["JSON formatting", "Syntax validation", "Error detection", "Minification", "Pretty printing"],
    keywords: ["json", "formatter", "validator", "beautifier", "data"],
    acceptedFileTypes: ["application/json", "text/*"],
    maxFileSize: 50,
    requiresAPI: false
  },
  "color-palette-studio": {
    name: "Color Palette Studio",
    description: "Generate color palettes with accessibility checking, gradients, and WCAG compliance validation.",
    category: "Design",
    icon: "🎨",
    features: ["Color palette generation", "Accessibility checking", "Gradient creation", "WCAG compliance"],
    keywords: ["color", "palette", "design", "accessibility", "gradient"],
    requiresAPI: true
  },
  "migration-manager": {
    name: "Database Migration Manager",
    description: "Create, preview, and execute database migrations with rollback support and version control.",
    category: "Database",
    icon: "🗄️",
    features: ["Migration creation", "SQL preview", "Execution tracking", "Rollback support", "Version control"],
    keywords: ["database", "migration", "sql", "rollback", "version control"],
    requiresAPI: true
  },
  "code-beautifier": {
    name: "Code Beautifier",
    description: "Format and beautify code in multiple programming languages with syntax highlighting.",
    category: "Code Tools",
    icon: "✨",
    features: ["Multi-language support", "Syntax highlighting", "Indentation", "Code formatting"],
    keywords: ["code", "beautifier", "formatter", "syntax", "indentation"],
    acceptedFileTypes: ["text/*", "application/json", "text/x-python", "text/x-javascript"],
    maxFileSize: 100,
    requiresAPI: false
  },
  "jwt-decoder": {
    name: "JWT Decoder",
    description: "Decode and validate JWT tokens, inspect claims, and verify signatures.",
    category: "Security",
    icon: "🔐",
    features: ["JWT decoding", "Claim inspection", "Signature verification", "Header analysis"],
    keywords: ["jwt", "token", "security", "authentication", "claims"],
    requiresAPI: false
  },
  "regex-tester": {
    name: "Regex Tester",
    description: "Test regular expressions with real-time matching, explanation, and pattern library.",
    category: "Text Processing",
    icon: "🔍",
    features: ["Real-time testing", "Pattern explanation", "Match highlighting", "Pattern library"],
    keywords: ["regex", "regular expression", "pattern", "matching", "text"],
    requiresAPI: false
  },
  "csv-tsv-encoder": {
    name: "CSV/TSV Tools",
    description: "Parse, encode, decode, and transform CSV/TSV data with validation and filtering.",
    category: "Data Processing",
    icon: "📊",
    features: ["CSV parsing", "Data validation", "Column filtering", "Format conversion"],
    keywords: ["csv", "tsv", "data", "parsing", "transformation"],
    acceptedFileTypes: ["text/csv", "text/tab-separated-values", "text/*"],
    maxFileSize: 100,
    requiresAPI: true
  },
  "image-optimizer": {
    name: "Image Optimizer & Converter",
    description: "Optimize images, convert formats, and compress files while maintaining quality.",
    category: "Media",
    icon: "🖼️",
    features: ["Format conversion", "Quality optimization", "Compression", "Batch processing"],
    keywords: ["image", "optimization", "conversion", "compression", "format"],
    acceptedFileTypes: ["image/*"],
    maxFileSize: 50,
    requiresAPI: true
  },
  "compression-tools": {
    name: "Compression Tools",
    description: "Compress and decompress data using various algorithms with performance comparison.",
    category: "Data Processing",
    icon: "🗜️",
    features: ["Multiple algorithms", "Performance comparison", "Compression ratio analysis"],
    keywords: ["compression", "gzip", "brotli", "zstd", "data"],
    requiresAPI: true
  },
  "binary-viewer": {
    name: "Binary Viewer & Hex Inspector",
    description: "View binary data in hex format with ASCII representation and search functionality.",
    category: "Development",
    icon: "🔢",
    features: ["Hex viewer", "ASCII representation", "Search functionality", "Offset display"],
    keywords: ["binary", "hex", "viewer", "inspection", "data"],
    acceptedFileTypes: ["application/octet-stream", "text/*", "image/*"],
    maxFileSize: 100,
    requiresAPI: true
  },
  "api-simulator": {
    name: "API Simulator",
    description: "Create mock API endpoints, test requests, and simulate responses for development.",
    category: "Development",
    icon: "🔌",
    features: ["Mock endpoints", "Request testing", "Response simulation", "Custom headers"],
    keywords: ["api", "mock", "simulation", "testing", "rest"],
    requiresAPI: true
  },
  "mock-data-generator": {
    name: "Mock Data Generator",
    description: "Generate realistic mock data for testing and development with customizable schemas.",
    category: "Development",
    icon: "📋",
    features: ["Schema-based generation", "Multiple data types", "Export options", "Custom fields"],
    keywords: ["mock", "data", "generator", "testing", "fake data"],
    requiresAPI: true
  },
  "accessibility-scanner": {
    name: "Accessibility Scanner",
    description: "Scan web pages for accessibility issues and WCAG compliance violations.",
    category: "Accessibility",
    icon: "♿",
    features: ["WCAG compliance", "Issue detection", "Remediation suggestions", "Report generation"],
    keywords: ["accessibility", "wcag", "compliance", "scan", "a11y"],
    requiresAPI: true
  },
  "container-image-scanner": {
    name: "Container Image Scanner",
    description: "Scan Docker container images for vulnerabilities and security issues.",
    category: "Security",
    icon: "🐳",
    features: ["Vulnerability scanning", "Security assessment", "Compliance checking", "Report generation"],
    keywords: ["container", "docker", "security", "vulnerability", "scan"],
    requiresAPI: true
  },
  "kubernetes-dashboard": {
    name: "Kubernetes Dashboard",
    description: "Monitor and manage Kubernetes clusters with real-time metrics and logs.",
    category: "DevOps",
    icon: "☸️",
    features: ["Cluster monitoring", "Resource management", "Log viewing", "Pod control"],
    keywords: ["kubernetes", "k8s", "dashboard", "monitoring", "devops"],
    requiresAPI: true
  }
};

export const getToolConfig = (toolId: string) => {
  return toolsConfig[toolId];
};

export const getToolsByCategory = () => {
  const categories: Record<string, Tool[]> = {};
  Object.entries(toolsConfig).forEach(([id, config]) => {
    if (!categories[config.category]) {
      categories[config.category] = [];
    }
    categories[config.category].push({
      id,
      name: config.name,
      description: config.description,
      href: `/tools/${id}`,
      icon: config.icon,
      category: config.category
    });
  });
  return categories;
};

export const generateStructuredData = (toolId: string) => {
  const config = toolsConfig[toolId];
  if (!config) return null;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": config.name,
    "description": config.description,
    "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://devtools.example.com'}/tools/${toolId}`,
    "applicationCategory": config.category,
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": config.features,
    "provider": {
      "@type": "Organization",
      "name": "Developer Tools Platform",
      "url": "https://devtools.example.com"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1247"
    },
    "keywords": config.keywords.join(", ")
  };
};