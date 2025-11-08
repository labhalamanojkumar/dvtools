import { NextRequest, NextResponse } from "next/server";

interface ServiceCost {
  service: string;
  cost: number;
  percentage: number;
  trend: "up" | "down" | "stable";
}

interface BudgetAlert {
  id: string;
  name: string;
  budget: number;
  spent: number;
  percentage: number;
  status: "healthy" | "warning" | "exceeded";
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  priority: "high" | "medium" | "low";
  category: "rightsizing" | "reserved-instances" | "unused-resources" | "storage-optimization";
}

interface CostForecast {
  month: string;
  projected: number;
  historical: number;
}

// In-memory storage
const budgetAlertsStore: BudgetAlert[] = [
  {
    id: "1",
    name: "Production Environment",
    budget: 5000,
    spent: 4250,
    percentage: 85,
    status: "warning"
  },
  {
    id: "2",
    name: "Development & Staging",
    budget: 1000,
    spent: 650,
    percentage: 65,
    status: "healthy"
  },
  {
    id: "3",
    name: "Data Storage",
    budget: 2000,
    spent: 2150,
    percentage: 107.5,
    status: "exceeded"
  }
];

// Mock cost data by provider
function getMockServiceCosts(provider: string, timeRange: number): { services: ServiceCost[], total: number } {
  let services: ServiceCost[] = [];

  if (provider === "aws") {
    services = [
      { service: "EC2 (Compute)", cost: 1850.50, percentage: 35.2, trend: "up" },
      { service: "S3 (Storage)", cost: 890.25, percentage: 16.9, trend: "stable" },
      { service: "RDS (Database)", cost: 1250.75, percentage: 23.8, trend: "up" },
      { service: "Lambda (Serverless)", cost: 320.50, percentage: 6.1, trend: "down" },
      { service: "CloudFront (CDN)", cost: 445.80, percentage: 8.5, trend: "stable" },
      { service: "ELB (Load Balancer)", cost: 295.40, percentage: 5.6, trend: "stable" },
      { service: "CloudWatch (Monitoring)", cost: 105.20, percentage: 2.0, trend: "stable" },
      { service: "Route 53 (DNS)", cost: 95.60, percentage: 1.8, trend: "stable" }
    ];
  } else if (provider === "azure") {
    services = [
      { service: "Virtual Machines", cost: 1650.30, percentage: 33.5, trend: "up" },
      { service: "Blob Storage", cost: 720.50, percentage: 14.6, trend: "stable" },
      { service: "Azure SQL Database", cost: 1180.75, percentage: 24.0, trend: "up" },
      { service: "App Service", cost: 580.40, percentage: 11.8, trend: "stable" },
      { service: "Azure Functions", cost: 290.20, percentage: 5.9, trend: "down" },
      { service: "Content Delivery Network", cost: 380.60, percentage: 7.7, trend: "stable" },
      { service: "Application Insights", cost: 125.25, percentage: 2.5, trend: "stable" }
    ];
  } else {
    services = [
      { service: "Compute Engine", cost: 1720.40, percentage: 34.8, trend: "up" },
      { service: "Cloud Storage", cost: 810.30, percentage: 16.4, trend: "stable" },
      { service: "Cloud SQL", cost: 1100.55, percentage: 22.3, trend: "up" },
      { service: "Cloud Functions", cost: 340.75, percentage: 6.9, trend: "down" },
      { service: "Cloud CDN", cost: 420.90, percentage: 8.5, trend: "stable" },
      { service: "Cloud Load Balancing", cost: 310.50, percentage: 6.3, trend: "stable" },
      { service: "Cloud Monitoring", cost: 240.60, percentage: 4.9, trend: "stable" }
    ];
  }

  const total = services.reduce((sum, s) => sum + s.cost, 0);
  return { services, total };
}

// Mock recommendations
function getMockRecommendations(provider: string): Recommendation[] {
  return [
    {
      id: "1",
      title: "Rightsize Overprovisioned EC2 Instances",
      description: "5 EC2 instances are running at less than 30% CPU utilization. Consider downsizing to t3.medium to save costs.",
      potentialSavings: 420.50,
      priority: "high",
      category: "rightsizing"
    },
    {
      id: "2",
      title: "Purchase Reserved Instances",
      description: "Your RDS database runs 24/7. Purchasing a 1-year reserved instance can save up to 40% compared to on-demand pricing.",
      potentialSavings: 500.30,
      priority: "high",
      category: "reserved-instances"
    },
    {
      id: "3",
      title: "Delete Unused EBS Volumes",
      description: "Found 8 unattached EBS volumes totaling 320 GB. These volumes are not in use and can be safely deleted.",
      potentialSavings: 25.60,
      priority: "medium",
      category: "unused-resources"
    },
    {
      id: "4",
      title: "Enable S3 Intelligent Tiering",
      description: "40% of your S3 data hasn't been accessed in 90 days. Enable Intelligent Tiering to automatically move data to cheaper storage classes.",
      potentialSavings: 178.20,
      priority: "medium",
      category: "storage-optimization"
    },
    {
      id: "5",
      title: "Remove Idle Load Balancers",
      description: "2 Application Load Balancers have no active targets. These can be removed to eliminate unnecessary costs.",
      potentialSavings: 36.00,
      priority: "low",
      category: "unused-resources"
    },
    {
      id: "6",
      title: "Optimize Lambda Memory Allocation",
      description: "Several Lambda functions are over-allocated. Reducing memory from 1024MB to 512MB can maintain performance while reducing costs.",
      potentialSavings: 95.40,
      priority: "low",
      category: "rightsizing"
    }
  ];
}

// Mock forecast data
function getMockForecast(provider: string): CostForecast[] {
  const months = ["February", "March", "April", "May", "June"];
  const baseHistorical = [4890, 5120, 5350, 5280, 5450];
  
  return months.map((month, index) => ({
    month,
    historical: baseHistorical[index],
    projected: baseHistorical[index] * (1 + (Math.random() * 0.15 + 0.05))
  }));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, provider, timeRange, name, budget } = body;

    switch (action) {
      case "getCosts": {
        const costData = getMockServiceCosts(provider || "aws", timeRange || 30);
        return NextResponse.json(costData);
      }

      case "getBudgetAlerts": {
        return NextResponse.json({ alerts: budgetAlertsStore });
      }

      case "addBudgetAlert": {
        if (!name || !budget) {
          return NextResponse.json(
            { error: "Name and budget are required" },
            { status: 400 }
          );
        }

        const newAlert: BudgetAlert = {
          id: Date.now().toString(),
          name,
          budget,
          spent: 0,
          percentage: 0,
          status: "healthy"
        };

        budgetAlertsStore.push(newAlert);
        return NextResponse.json({ alert: newAlert });
      }

      case "getRecommendations": {
        const recommendations = getMockRecommendations(provider || "aws");
        return NextResponse.json({ recommendations });
      }

      case "getForecast": {
        const forecast = getMockForecast(provider || "aws");
        return NextResponse.json({ forecast });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Cost estimator error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
