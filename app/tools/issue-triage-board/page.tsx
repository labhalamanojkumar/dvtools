import type { Metadata } from "next";
import IssueTriageBoardClient from "@/components/tools/issue-triage-board-client";

export const metadata: Metadata = {
  title: "Issue Triage Board - Error & Alert Management | Malti Tool Platform",
  description:
    "Link errors and alerts to tickets, prioritize issues, assign team members, and track SLAs with our comprehensive issue triage board. Streamline incident response and resolution workflows.",
  keywords: [
    "issue triage",
    "error tracking",
    "alert management",
    "ticket linking",
    "priority assignment",
    "SLA tracking",
    "incident response",
    "bug management",
    "team assignment",
    "kanban board",
    "issue resolution",
    "workflow management"
  ],
};

export default function IssueTriageBoardPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Issue Triage Board",
    description:
      "Link errors and alerts to tickets, prioritize issues, assign team members, and track SLAs with comprehensive issue triage board.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Error and alert linking",
      "Priority management",
      "Team assignment",
      "SLA tracking",
      "Kanban board view",
      "Ticket integration",
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
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Issue Triage Board
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Streamline your incident response workflow with our comprehensive issue triage board.
            Link errors and alerts to tickets, prioritize issues, assign team members, and track SLAs
            to ensure timely resolution of critical incidents.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Error & Alert Linking</h3>
            <p className="text-sm text-muted-foreground">
              Connect errors and alerts from monitoring tools directly to tickets for complete context and traceability.
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Priority Management</h3>
            <p className="text-sm text-muted-foreground">
              Assign priority levels (Critical, High, Medium, Low) to issues and sort by urgency for optimal workflow.
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Team Assignment</h3>
            <p className="text-sm text-muted-foreground">
              Assign issues to team members, track workload distribution, and ensure accountability for each ticket.
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">SLA Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Monitor SLA compliance with visual indicators, deadlines, and time remaining for each priority level.
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Kanban Board View</h3>
            <p className="text-sm text-muted-foreground">
              Visualize your workflow with drag-and-drop Kanban board across New, In Progress, Review, and Resolved columns.
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Ticket Integration</h3>
            <p className="text-sm text-muted-foreground">
              Import issues from JSON files, link to external ticketing systems, and export reports for stakeholders.
            </p>
          </div>
        </div>

        {/* Main Tool Component */}
        <IssueTriageBoardClient />

        {/* Usage Guide */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold">How to Use the Issue Triage Board</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Create or Import Issues</h3>
                  <p className="text-sm text-muted-foreground">
                    Create new issues manually or import them from JSON files containing error logs and alerts from your monitoring systems.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Set Priority & Assign</h3>
                  <p className="text-sm text-muted-foreground">
                    Assign priority levels based on severity, assign team members, and set SLA deadlines according to your policies.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 dark:text-green-400 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Track Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    Move issues through workflow stages (New → In Progress → Review → Resolved) and monitor SLA compliance with visual indicators.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 dark:text-orange-400 font-semibold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Analyze & Export</h3>
                  <p className="text-sm text-muted-foreground">
                    Review resolution metrics, track team performance, and export reports for stakeholders and post-mortem analysis.
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
                How do I link errors from my monitoring tools?
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                You can import issues by uploading JSON files containing error logs, alerts, and metrics from monitoring
                tools like Datadog, New Relic, or Prometheus. The board automatically parses error details, stack traces,
                and timestamps. You can also manually create issues and paste error details in the description field.
              </p>
            </details>

            <details className="p-6 border rounded-lg bg-card">
              <summary className="font-semibold cursor-pointer">
                What are the default SLA times for each priority?
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Default SLA times are: Critical (2 hours), High (8 hours), Medium (24 hours), Low (72 hours). These can be
                customized in your organization settings. The board displays time remaining and visual indicators (red for
                breached, yellow for at-risk, green for on-track) to help teams prioritize work.
              </p>
            </details>

            <details className="p-6 border rounded-lg bg-card">
              <summary className="font-semibold cursor-pointer">
                Can I integrate with external ticketing systems?
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Yes! The Issue Triage Board supports integration with Jira, GitHub Issues, GitLab, and ServiceNow through
                API connections. You can sync issues bidirectionally, link tickets to external IDs, and update status
                automatically. Configure integrations in the Settings tab with your API credentials.
              </p>
            </details>

            <details className="p-6 border rounded-lg bg-card">
              <summary className="font-semibold cursor-pointer">
                How does team assignment and workload tracking work?
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Assign team members to issues from your user directory. The dashboard shows current workload for each team
                member, including number of assigned issues, priority distribution, and average resolution time. This helps
                balance workload and identify bottlenecks. You can also filter the board by assignee to see individual work queues.
              </p>
            </details>
          </div>
        </div>
      </div>
    </>
  );
}
