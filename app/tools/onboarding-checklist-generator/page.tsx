import type { Metadata } from "next";
import OnboardingChecklistGeneratorClient from "@/components/tools/onboarding-checklist-generator-client";

export const metadata: Metadata = {
  title: "Onboarding Checklist Generator - Progress Tracking | Malti Tool Platform",
  description:
    "Create customizable onboarding checklists with progress tracking, user assignments, completion analytics, and automated reminders. Streamline employee and customer onboarding.",
  keywords: [
    "onboarding checklist",
    "progress tracking",
    "checklist builder",
    "user onboarding",
    "employee onboarding",
    "customer onboarding",
    "task management",
    "onboarding analytics",
    "checklist template",
    "onboarding automation",
    "completion tracking",
    "onboarding flows"
  ],
};

export default function OnboardingChecklistGeneratorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Onboarding Checklist Generator",
    description:
      "Create customizable onboarding checklists with progress tracking, user assignments, and completion analytics.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Customizable checklist templates",
      "Progress tracking",
      "User assignments",
      "Completion analytics",
      "Automated reminders",
      "Multi-step workflows",
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
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Onboarding Checklist Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Create and manage customizable onboarding checklists for employees and customers. Track progress,
            assign tasks, monitor completion rates, and ensure smooth onboarding experiences with automated workflows.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Customizable Templates</h3>
            <p className="text-sm text-muted-foreground">
              Create reusable checklist templates for different roles and use cases. Import and export templates as JSON.
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Monitor completion rates, track individual task progress, and visualize onboarding milestones with progress bars.
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">User Assignments</h3>
            <p className="text-sm text-muted-foreground">
              Assign checklists to specific users or teams, set due dates, and track who's responsible for each task.
            </p>
          </div>

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
                  d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Completion Analytics</h3>
            <p className="text-sm text-muted-foreground">
              View detailed analytics on completion rates, average time to complete, bottlenecks, and team performance metrics.
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Automated Reminders</h3>
            <p className="text-sm text-muted-foreground">
              Set up automatic reminders for incomplete tasks, approaching deadlines, and overdue items to keep onboarding on track.
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
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Multi-Step Workflows</h3>
            <p className="text-sm text-muted-foreground">
              Create sequential workflows with dependencies, conditional tasks, and milestone-based progression for complex onboarding.
            </p>
          </div>
        </div>

        {/* Main Tool Component */}
        <OnboardingChecklistGeneratorClient />

        {/* Usage Guide */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold">How to Use the Onboarding Checklist Generator</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 dark:text-green-400 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Create or Import Template</h3>
                  <p className="text-sm text-muted-foreground">
                    Start by creating a new checklist template or import an existing one from JSON. Define tasks, descriptions, and estimated completion times for each step.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Assign to Users</h3>
                  <p className="text-sm text-muted-foreground">
                    Assign the checklist to new employees or customers, set due dates, and configure automated reminder schedules.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Track Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor completion in real-time with progress bars and status indicators. Users can check off tasks as they complete them.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Analyze & Optimize</h3>
                  <p className="text-sm text-muted-foreground">
                    Review analytics to identify bottlenecks, improve completion rates, and optimize your onboarding process over time.
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
                Can I create different checklists for different roles?
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Yes! You can create unlimited checklist templates tailored to different roles, departments, or onboarding scenarios.
                For example, you might have separate checklists for Software Engineers, Sales Reps, or Customer Success Managers, each
                with role-specific tasks and resources. Templates can be duplicated and customized as needed.
              </p>
            </details>

            <details className="p-6 border rounded-lg bg-card">
              <summary className="font-semibold cursor-pointer">
                How do automated reminders work?
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                When you assign a checklist to a user, you can configure reminder schedules. The system will automatically send email
                notifications for incomplete tasks at specified intervals (daily, every 3 days, weekly, etc.). Reminders also trigger
                for approaching due dates and overdue items. Users and their managers receive notifications to keep onboarding on track.
              </p>
            </details>

            <details className="p-6 border rounded-lg bg-card">
              <summary className="font-semibold cursor-pointer">
                Can users complete tasks in any order?
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                By default, users can complete tasks in any order. However, you can configure task dependencies and sequential workflows
                where certain tasks must be completed before others become available. For example, "Complete security training" might be
                required before "Access production systems" becomes available. This ensures proper progression through critical onboarding steps.
              </p>
            </details>

            <details className="p-6 border rounded-lg bg-card">
              <summary className="font-semibold cursor-pointer">
                What analytics are available?
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Analytics include: overall completion rates by checklist and role, average time to complete each task and full checklists,
                identification of bottleneck tasks where users get stuck, comparison of completion times across teams, completion trends
                over time, and individual user progress tracking. You can export these analytics for presentations or further analysis.
              </p>
            </details>
          </div>
        </div>
      </div>
    </>
  );
}
