import { Metadata } from "next";
import CostEstimatorClient from "@/components/tools/cost-estimator-client";

export const metadata: Metadata = {
  title: "Cost Estimator & Usage Reports - Cloud Cost Analysis Tool | Malti Tool Platform",
  description: "Comprehensive cloud cost breakdown and usage analysis for AWS, Azure, and GCP. Track spending per service, set budget alerts, forecast costs, and identify optimization opportunities with detailed reports.",
  keywords: [
    "cloud cost estimator",
    "aws cost analysis",
    "azure pricing",
    "gcp billing",
    "cost optimization",
    "budget alerts",
    "usage reports",
    "cloud spending",
    "cost forecasting",
    "finops",
    "cost breakdown",
    "cloud economics"
  ],
  openGraph: {
    title: "Cost Estimator & Usage Reports - Cloud Cost Analysis",
    description: "Track cloud spending, set budget alerts, and optimize costs across AWS, Azure, and GCP",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Cost Estimator & Usage Reports",
  description: "Cloud cost breakdown and usage analysis tool with budget alerts and optimization recommendations",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Cost Breakdown by Service",
    "Budget Alerts",
    "Cost Forecasting",
    "Usage Analytics",
    "Multi-Cloud Support",
    "Optimization Recommendations"
  ],
};

export default function CostEstimatorPage() {
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
            <h1 className="text-4xl font-bold tracking-tight">Cost Estimator & Usage Reports</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Comprehensive cloud cost analysis and usage reporting for AWS, Azure, and GCP. Track spending per service, 
              set budget alerts, forecast future costs, and discover optimization opportunities to reduce your cloud bill.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Service Cost Breakdown</h3>
              <p className="text-sm text-muted-foreground">
                Detailed cost analysis per service, region, and resource type with visual charts
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Budget Alerts</h3>
              <p className="text-sm text-muted-foreground">
                Set spending thresholds and receive alerts when approaching or exceeding budgets
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Cost Forecasting</h3>
              <p className="text-sm text-muted-foreground">
                Predict future costs based on historical usage patterns and growth trends
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Usage Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Track resource utilization and identify underused or idle resources
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Multi-Cloud Support</h3>
              <p className="text-sm text-muted-foreground">
                Unified view of costs across AWS, Azure, GCP, and other cloud providers
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Optimization Tips</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered recommendations to reduce costs through rightsizing and reserved instances
              </p>
            </div>
          </div>

          {/* Main Tool */}
          <CostEstimatorClient />

          {/* Usage Guide */}
          <div className="space-y-6 pt-8 border-t">
            <h2 className="text-2xl font-semibold">How to Use the Cost Estimator</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Connect Cloud Accounts</h3>
                <p className="text-muted-foreground">
                  Link your AWS, Azure, or GCP accounts using billing API access. The tool will automatically fetch 
                  cost and usage data for analysis. Multiple accounts can be connected for consolidated reporting.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. View Cost Breakdown</h3>
                <p className="text-muted-foreground">
                  Analyze spending by service (EC2, S3, Lambda), region, environment (production, staging), or custom 
                  tags. Interactive charts show trends over time and help identify cost spikes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Set Budget Alerts</h3>
                <p className="text-muted-foreground">
                  Create budget thresholds with percentage-based alerts (80%, 100%, 120% of budget). Configure 
                  notification channels to receive alerts via email, Slack, or webhooks when thresholds are crossed.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. Review Optimization Recommendations</h3>
                <p className="text-muted-foreground">
                  Get actionable suggestions to reduce costs: rightsizing overprovisioned resources, purchasing reserved 
                  instances, deleting unused resources, and switching to more cost-effective service tiers.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-6 pt-8 border-t">
            <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">How often is cost data updated?</h3>
                <p className="text-muted-foreground">
                  Cost data is refreshed every 24 hours from your cloud provider's billing API. Some providers offer 
                  near real-time data, while others have a delay of 24-48 hours. Historical data is retained for 
                  trend analysis and forecasting.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Can I track costs across multiple cloud providers?</h3>
                <p className="text-muted-foreground">
                  Yes! The tool supports AWS, Azure, GCP, and can aggregate costs across all providers into a unified 
                  dashboard. You can filter by provider or view combined spending for a complete picture.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">How accurate are the cost forecasts?</h3>
                <p className="text-muted-foreground">
                  Forecasts use machine learning models trained on your historical usage patterns. Accuracy improves 
                  with more historical data (3+ months recommended). Forecasts account for trends, seasonality, and 
                  growth but may not predict unexpected spikes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">What permissions are needed to access billing data?</h3>
                <p className="text-muted-foreground">
                  For AWS, you need read-only access to Cost Explorer API. For Azure, Cost Management Reader role is 
                  required. For GCP, you need Cloud Billing Account Viewer permission. The tool never requires write 
                  access to your billing or infrastructure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
