import { Metadata } from "next";
import KubernetesDashboardClient from "@/components/tools/kubernetes-dashboard-client";

export const metadata: Metadata = {
  title: "Kubernetes Dashboard - K8s Cluster Management Tool | Malti Tool Platform",
  description: "Comprehensive Kubernetes dashboard for namespace exploration, pod log viewing, deployment rollout status tracking, and secure terminal access with RBAC controls. Monitor and manage K8s clusters efficiently.",
  keywords: [
    "kubernetes dashboard",
    "k8s management",
    "pod logs",
    "namespace explorer",
    "kubectl terminal",
    "kubernetes monitoring",
    "rollout status",
    "k8s deployment",
    "container orchestration",
    "kubernetes rbac",
    "cluster management",
    "kubernetes tools"
  ],
  openGraph: {
    title: "Kubernetes Dashboard - K8s Cluster Management",
    description: "Explore namespaces, view pod logs, track rollout status, and access secure terminals for your Kubernetes clusters",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Kubernetes Dashboard",
  description: "Comprehensive Kubernetes cluster management tool with namespace explorer, pod logs, rollout tracking, and secure terminal access",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  permissions: "RBAC-controlled access",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Namespace Explorer",
    "Pod Log Viewer",
    "Deployment Rollout Status",
    "Secure Terminal Access",
    "RBAC Controls",
    "Resource Monitoring"
  ],
};

export default function KubernetesDashboardPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Kubernetes Dashboard</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Monitor and manage your Kubernetes clusters with a comprehensive dashboard featuring namespace exploration, 
              pod log viewing, deployment rollout tracking, and secure terminal access—all with RBAC controls.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Namespace Explorer</h3>
              <p className="text-sm text-muted-foreground">
                Browse all namespaces and resources in your cluster with an intuitive interface
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Pod Log Viewer</h3>
              <p className="text-sm text-muted-foreground">
                Stream real-time logs from any pod with filtering and search capabilities
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Rollout Status</h3>
              <p className="text-sm text-muted-foreground">
                Track deployment rollout progress, history, and health status
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Terminal Access</h3>
              <p className="text-sm text-muted-foreground">
                Execute kubectl commands securely with RBAC-controlled terminal access
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Resource Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                Monitor CPU, memory, and disk usage across pods and nodes
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">RBAC Integration</h3>
              <p className="text-sm text-muted-foreground">
                Respect cluster RBAC policies for secure, permission-based access
              </p>
            </div>
          </div>

          {/* Main Tool */}
          <KubernetesDashboardClient />

          {/* Usage Guide */}
          <div className="space-y-6 pt-8 border-t">
            <h2 className="text-2xl font-semibold">How to Use the Kubernetes Dashboard</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Configure Cluster Access</h3>
                <p className="text-muted-foreground">
                  Enter your kubeconfig file or connect to an existing cluster context. The dashboard will validate 
                  your credentials and RBAC permissions.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Explore Namespaces and Resources</h3>
                <p className="text-muted-foreground">
                  Browse namespaces to view pods, deployments, services, and other resources. Click on any resource 
                  to see detailed information and status.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. View Logs and Monitor Status</h3>
                <p className="text-muted-foreground">
                  Stream pod logs in real-time, filter by container, and search for specific events. Track deployment 
                  rollout progress and health checks.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. Execute Commands Securely</h3>
                <p className="text-muted-foreground">
                  Use the integrated terminal to run kubectl commands with RBAC-controlled access. All actions are 
                  logged and auditable.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-6 pt-8 border-t">
            <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">How do I connect to my Kubernetes cluster?</h3>
                <p className="text-muted-foreground">
                  Upload your kubeconfig file or paste the configuration directly. The dashboard supports multiple 
                  cluster contexts and will automatically detect available namespaces.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">What RBAC permissions are required?</h3>
                <p className="text-muted-foreground">
                  The dashboard respects your cluster's RBAC policies. You need appropriate permissions to view resources, 
                  read logs, and execute commands. Read-only access is sufficient for monitoring.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Can I monitor multiple clusters?</h3>
                <p className="text-muted-foreground">
                  Yes, you can switch between different cluster contexts defined in your kubeconfig. Each context 
                  maintains its own session and permissions.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Is my kubeconfig data secure?</h3>
                <p className="text-muted-foreground">
                  All kubeconfig data is processed in your browser session and never stored on our servers. For production 
                  use, consider deploying this tool in your own infrastructure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
