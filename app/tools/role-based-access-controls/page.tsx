import type { Metadata } from "next";
import RoleBasedAccessControlsClient from "@/components/tools/role-based-access-controls-client";

export const metadata: Metadata = {
  title: "Role-based Access Controls - Permission Management | Malti Tool Platform",
  description:
    "Manage granular permissions, create custom roles, track user assignments, and maintain comprehensive audit logs for all access control changes. Enterprise-grade RBAC system.",
  keywords: [
    "rbac",
    "role based access control",
    "permission management",
    "access control",
    "user roles",
    "audit logs",
    "security management",
    "authorization",
    "permission editor",
    "role assignment",
    "access policies",
    "compliance tracking"
  ],
};

export default function RoleBasedAccessControlsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Role-based Access Controls",
    description:
      "Manage granular permissions, create custom roles, track user assignments, and maintain comprehensive audit logs for all access control changes.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Granular permission management",
      "Custom role creation",
      "User role assignments",
      "Comprehensive audit logs",
      "Permission inheritance",
      "Access policy templates",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Role-based Access Controls
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Enterprise-grade permission management system with granular access controls, custom role
            creation, user assignments, and comprehensive audit logging for compliance and security.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Granular Permissions</h3>
            <p className="text-sm text-muted-foreground">
              Define fine-grained permissions at resource, action, and scope levels with support for create, read, update, delete, and custom actions.
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-pink-600 dark:text-pink-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Custom Role Creation</h3>
            <p className="text-sm text-muted-foreground">
              Create unlimited custom roles tailored to your organization with role templates, inheritance, and hierarchical permissions.
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">User Role Assignment</h3>
            <p className="text-sm text-muted-foreground">
              Assign multiple roles to users, manage role memberships, and track effective permissions across the organization.
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Comprehensive Audit Logs</h3>
            <p className="text-sm text-muted-foreground">
              Track all permission changes, role modifications, and user assignments with detailed audit trails for compliance and security reviews.
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Permission Inheritance</h3>
            <p className="text-sm text-muted-foreground">
              Create role hierarchies with automatic permission inheritance, allowing efficient management of complex organizational structures.
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-orange-600 dark:text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Policy Templates</h3>
            <p className="text-sm text-muted-foreground">
              Import and export role configurations as JSON, use predefined templates for common roles, and share policies across environments.
            </p>
          </div>
        </div>

        {/* Main Tool Component */}
        <RoleBasedAccessControlsClient />

        {/* Usage Guide */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold">How to Use Role-based Access Controls</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Create Custom Roles</h3>
                  <p className="text-sm text-muted-foreground">
                    Define roles with specific permissions for resources in your application. Use templates for common roles like Admin, Editor, and Viewer, or create custom roles tailored to your needs.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 dark:text-pink-400 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Configure Permissions</h3>
                  <p className="text-sm text-muted-foreground">
                    Set granular permissions for each role at the resource level. Define which actions (create, read, update, delete) are allowed for specific resources like users, projects, or settings.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Assign Users to Roles</h3>
                  <p className="text-sm text-muted-foreground">
                    Add users to roles individually or import bulk assignments from CSV/JSON. Users can have multiple roles with combined permissions for flexible access control.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Monitor & Audit</h3>
                  <p className="text-sm text-muted-foreground">
                    Review audit logs to track all permission changes, role modifications, and user assignments. Export logs for compliance reporting and security analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="p-6 border rounded-lg bg-card">
              <summary className="font-semibold cursor-pointer">
                What's the difference between roles and permissions?
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Permissions are specific actions (like "read", "write", "delete") that can be performed on resources (like "users", "projects").
                Roles are collections of permissions that can be assigned to users. For example, an "Editor" role might include "read" and "write"
                permissions on "projects", while a "Viewer" role might only include "read" permission. Roles make it easier to manage permissions
                for groups of users rather than configuring individual permissions for each user.
              </p>
            </details>

            <details className="p-6 border rounded-lg bg-card">
              <summary className="font-semibold cursor-pointer">
                How does permission inheritance work?
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Permission inheritance allows you to create role hierarchies where child roles automatically inherit permissions from parent roles.
                For example, an "Admin" role might inherit all permissions from "Editor" and "Viewer" roles, plus additional admin-specific permissions.
                This makes it easy to create specialized roles without duplicating permission configurations. When a user has multiple roles, they
                receive the union of all permissions from those roles.
              </p>
            </details>

            <details className="p-6 border rounded-lg bg-card">
              <summary className="font-semibold cursor-pointer">
                Can I import existing role configurations?
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Yes! You can import role configurations from JSON files. This is useful for migrating between environments, sharing role templates
                across teams, or restoring previous configurations. The import feature validates the structure and will highlight any issues before
                applying changes. You can also export your current role configurations as JSON for backup or version control purposes.
              </p>
            </details>

            <details className="p-6 border rounded-lg bg-card">
              <summary className="font-semibold cursor-pointer">
                How are audit logs used for compliance?
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Audit logs record every change to roles, permissions, and user assignments with timestamps and actor information. This creates an
                immutable trail for compliance frameworks like SOC 2, ISO 27001, and GDPR. You can filter logs by date range, action type, or user,
                and export them for external audits. The logs help answer questions like "Who had access to what and when?" which is critical for
                security investigations and compliance reporting.
              </p>
            </details>
          </div>
        </div>
      </div>
    </>
  );
}
