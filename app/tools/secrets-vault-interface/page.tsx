import { Metadata } from "next";
import SecretsVaultInterfaceClient from "@/components/tools/secrets-vault-interface-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Secrets Vault Interface - Secure Credential Management",
  description: "Securely store, manage, and retrieve sensitive credentials with AES-256 encryption. Features include secret versioning, access tracking, expiration management, and secure import/export functionality.",
  keywords: [
    "secrets vault",
    "credential management",
    "password manager",
    "secure storage",
    "AES encryption",
    "secret management",
    "credential vault",
    "secure key storage",
    "password vault",
    "encryption tool"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/secrets-vault-interface",
  },
  openGraph: {
    title: "Secrets Vault Interface - Secure Credential Management",
    description: "Enterprise-grade secrets management with AES-256 encryption, access tracking, and secure credential storage for developers and DevOps teams.",
    url: "/tools/secrets-vault-interface",
    siteName: "Multi-Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-secrets-vault.jpg",
        width: 1200,
        height: 630,
        alt: "Secrets Vault Interface - Secure Credential Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Secrets Vault Interface - AES-256 Encrypted Credential Storage",
    description: "Securely manage API keys, passwords, and sensitive data with enterprise-grade encryption and access controls.",
    images: ["/og-secrets-vault.jpg"],
    creator: "@multitoolplatform",
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
  category: "security tools",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Secrets Vault Interface",
  "description": "Securely store, manage, and retrieve sensitive credentials with AES-256 encryption. Features include secret versioning, access tracking, expiration management, and secure import/export functionality.",
  "url": "https://multitoolplatform.com/tools/secrets-vault-interface",
  "applicationCategory": "SecurityApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "featureList": [
    "AES-256 encryption",
    "Secure credential storage",
    "Access tracking and monitoring",
    "Secret expiration management",
    "Tag-based organization",
    "Import/export functionality",
    "Search and filtering",
    "Real-time security monitoring"
  ],
  "screenshot": "/og-secrets-vault.jpg",
  "author": {
    "@type": "Organization",
    "name": "Multi-Tool Platform",
  },
  "publisher": {
    "@type": "Organization",
    "name": "Multi-Tool Platform",
  },
  "datePublished": new Date().toISOString().split('T')[0],
  "dateModified": new Date().toISOString().split('T')[0],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://multitoolplatform.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Tools",
      "item": "https://multitoolplatform.com/tools"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Secrets Vault Interface",
      "item": "https://multitoolplatform.com/tools/secrets-vault-interface"
    }
  ]
};

export default function SecretsVaultInterfacePage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Secrets Vault Interface
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Securely store, manage, and retrieve sensitive credentials with enterprise-grade
            AES-256 encryption. Perfect for managing API keys, database passwords, and other
            sensitive configuration data with full access tracking and audit capabilities.
          </p>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🔐</div>
              <h3 className="font-semibold mb-1">AES-256 Encryption</h3>
              <p className="text-sm text-muted-foreground">
                Military-grade encryption for all stored secrets
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">Access Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor who accesses secrets and when
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🏷️</div>
              <h3 className="font-semibold mb-1">Tag Organization</h3>
              <p className="text-sm text-muted-foreground">
                Organize secrets with custom tags and categories
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">⏰</div>
              <h3 className="font-semibold mb-1">Expiration Management</h3>
              <p className="text-sm text-muted-foreground">
                Set expiration dates and automatic cleanup
              </p>
            </div>
          </div>
        </div>

        {/* Tool Component */}
        <SecretsVaultInterfaceClient />

        {/* Documentation Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How to Use</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these steps to securely manage your credentials and sensitive data
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Getting Started */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">1. Configure Your Vault</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Generate or enter a 64-character hexadecimal encryption key</p>
                  <p>• Choose between in-memory (temporary) or file-based storage</p>
                  <p>• For file storage, specify the path where secrets will be persisted</p>
                  <p>• Click &quot;Configure Vault&quot; to initialize the secure storage</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2. Add Your First Secret</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Click &quot;Add Secret&quot; to create a new credential entry</p>
                  <p>• Provide a descriptive name for easy identification</p>
                  <p>• Enter the sensitive value (password, API key, etc.)</p>
                  <p>• Add an optional description and tags for organization</p>
                  <p>• Set an expiration date if the secret should auto-expire</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3. Organize with Tags</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Use tags to categorize secrets (api, database, production, staging)</p>
                  <p>• Filter secrets by clicking on tag badges</p>
                  <p>• Combine multiple tags for complex filtering</p>
                  <p>• Tags help maintain organization as your vault grows</p>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">4. Search and Filter</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Use the search bar to find secrets by name or description</p>
                  <p>• Filter by tags to narrow down results quickly</p>
                  <p>• Search works across all secret metadata</p>
                  <p>• Real-time filtering as you type</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">5. Access Tracking</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Monitor how many times each secret has been accessed</p>
                  <p>• View the last access timestamp for each secret</p>
                  <p>• Track usage patterns and identify unused secrets</p>
                  <p>• Audit trail for security compliance</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">6. Import/Export</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Export all secrets to a secure JSON file</p>
                  <p>• Import secrets from previously exported files</p>
                  <p>• Backup your entire vault for disaster recovery</p>
                  <p>• Migrate secrets between different vault instances</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Security Features</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold">🔒</span>
                </div>
                <div>
                  <div className="font-medium">AES-256 Encryption</div>
                  <div className="text-sm text-muted-foreground">
                    Industry-standard encryption for all stored data
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold">👁️</span>
                </div>
                <div>
                  <div className="font-medium">Access Monitoring</div>
                  <div className="text-sm text-muted-foreground">
                    Track every access to sensitive information
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold">⏰</span>
                </div>
                <div>
                  <div className="font-medium">Expiration Control</div>
                  <div className="text-sm text-muted-foreground">
                    Automatic cleanup of expired credentials
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold">🔑</span>
                </div>
                <div>
                  <div className="font-medium">Key Management</div>
                  <div className="text-sm text-muted-foreground">
                    Secure encryption key generation and validation
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold">🗂️</span>
                </div>
                <div>
                  <div className="font-medium">Secure Export</div>
                  <div className="text-sm text-muted-foreground">
                    Encrypted export/import for backup and migration
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold">🔍</span>
                </div>
                <div>
                  <div className="font-medium">Audit Trail</div>
                  <div className="text-sm text-muted-foreground">
                    Complete history of secret access and modifications
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Common Use Cases</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">API Key Management</h4>
                <p className="text-sm text-muted-foreground">
                  Store and manage API keys for third-party services like payment processors,
                  cloud providers, and external APIs with automatic rotation reminders.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Database Credentials</h4>
                <p className="text-sm text-muted-foreground">
                  Securely store database connection strings, usernames, and passwords
                  with environment-specific tagging and access tracking.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Deployment Secrets</h4>
                <p className="text-sm text-muted-foreground">
                  Manage deployment secrets, environment variables, and configuration
                  files with version control and rollback capabilities.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Team Collaboration</h4>
                <p className="text-sm text-muted-foreground">
                  Share sensitive credentials with team members while maintaining
                  access controls and audit trails for compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Security Best Practices */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Security Best Practices
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Store your encryption key securely and never commit it to version control</li>
                  <li>• Use strong, unique encryption keys for each environment</li>
                  <li>• Regularly rotate secrets and update expiration dates</li>
                  <li>• Monitor access patterns and investigate unusual activity</li>
                  <li>• Use tags to organize secrets by environment and access level</li>
                  <li>• Regularly backup your vault and test restoration procedures</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">How secure is the encryption?</h4>
                <p className="text-sm text-muted-foreground">
                  The vault uses AES-256 encryption, which is the same standard used by governments
                  and financial institutions worldwide. All secrets are encrypted before storage and
                  only decrypted when accessed with the correct key.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">What happens if I lose my encryption key?</h4>
                <p className="text-sm text-muted-foreground">
                  If you lose your encryption key, all stored secrets become permanently inaccessible.
                  This is by design for security - there&apos;s no backdoor or recovery mechanism.
                  Always backup your encryption key in a secure location.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I share secrets with team members?</h4>
                <p className="text-sm text-muted-foreground">
                  The current implementation is designed for individual use. For team sharing,
                  consider using enterprise solutions like HashiCorp Vault, AWS Secrets Manager,
                  or Azure Key Vault which provide proper access controls and audit trails.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">What&apos;s the difference between memory and file storage?</h4>
                <p className="text-sm text-muted-foreground">
                  Memory storage keeps secrets in RAM and loses them when the application restarts.
                  File storage persists secrets to disk, making them available across sessions but
                  requiring proper file system security.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">How do expiration dates work?</h4>
                <p className="text-sm text-muted-foreground">
                  Expired secrets are automatically hidden from the interface and cannot be accessed.
                  They remain in storage until manually deleted. This helps enforce credential rotation
                  policies and prevents use of outdated secrets.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I integrate this with CI/CD pipelines?</h4>
                <p className="text-sm text-muted-foreground">
                  While this tool is designed for manual management, the export functionality can be
                  used to create secure backups that can be integrated into deployment pipelines.
                  For automated secret injection, consider dedicated secret management services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}