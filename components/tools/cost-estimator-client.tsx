"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Bell,
  AlertTriangle,
  Zap,
  Cloud,
  BarChart3
} from "lucide-react";

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

export default function CostEstimatorClient() {
  const [provider, setProvider] = useState<"aws" | "azure" | "gcp">("aws");
  const [timeRange, setTimeRange] = useState("30");
  const [serviceCosts, setServiceCosts] = useState<ServiceCost[]>([]);
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetAlert[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [forecast, setForecast] = useState<CostForecast[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [newBudgetName, setNewBudgetName] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");

  const loadCostData = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/tools/cost-estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getCosts",
          provider,
          timeRange: parseInt(timeRange)
        })
      });

      if (!response.ok) throw new Error("Failed to load cost data");

      const data = await response.json();
      setServiceCosts(data.services);
      setTotalCost(data.total);
      toast.success("Cost data loaded");
    } catch (error) {
      console.error("Load cost data error:", error);
      toast.error("Failed to load cost data");
    } finally {
      setIsLoading(false);
    }
  }, [provider, timeRange]);

  const loadBudgetAlerts = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/tools/cost-estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getBudgetAlerts" })
      });

      if (!response.ok) throw new Error("Failed to load budget alerts");

      const data = await response.json();
      setBudgetAlerts(data.alerts);
    } catch (error) {
      console.error("Load budget alerts error:", error);
      toast.error("Failed to load budget alerts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadRecommendations = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/tools/cost-estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getRecommendations", provider })
      });

      if (!response.ok) throw new Error("Failed to load recommendations");

      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Load recommendations error:", error);
      toast.error("Failed to load recommendations");
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  const loadForecast = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/tools/cost-estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getForecast", provider })
      });

      if (!response.ok) throw new Error("Failed to load forecast");

      const data = await response.json();
      setForecast(data.forecast);
    } catch (error) {
      console.error("Load forecast error:", error);
      toast.error("Failed to load forecast");
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  const addBudgetAlert = useCallback(async () => {
    if (!newBudgetName.trim() || !newBudgetAmount) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/tools/cost-estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addBudgetAlert",
          name: newBudgetName,
          budget: parseFloat(newBudgetAmount)
        })
      });

      if (!response.ok) throw new Error("Failed to add budget alert");

      const data = await response.json();
      setBudgetAlerts([...budgetAlerts, data.alert]);
      setNewBudgetName("");
      setNewBudgetAmount("");
      toast.success("Budget alert added");
    } catch (error) {
      console.error("Add budget alert error:", error);
      toast.error("Failed to add budget alert");
    } finally {
      setIsLoading(false);
    }
  }, [newBudgetName, newBudgetAmount, budgetAlerts]);

  const getTrendIcon = (trend: ServiceCost["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <span className="w-4 h-4 text-gray-500">—</span>;
    }
  };

  const getBudgetStatusBadge = (status: BudgetAlert["status"]) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-500">Healthy</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case "exceeded":
        return <Badge variant="destructive">Exceeded</Badge>;
    }
  };

  const getPriorityBadge = (priority: Recommendation["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cost Overview</CardTitle>
          <CardDescription>View cloud spending across providers and services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Select value={provider} onValueChange={(v: "aws" | "azure" | "gcp") => setProvider(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aws">AWS</SelectItem>
                <SelectItem value="azure">Azure</SelectItem>
                <SelectItem value="gcp">Google Cloud</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={loadCostData} disabled={isLoading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Load Data
            </Button>
          </div>

          {totalCost > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Spending</p>
                  <p className="text-4xl font-bold">
                    <DollarSign className="inline w-8 h-8" />
                    {totalCost.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Last {timeRange} days on {provider.toUpperCase()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost by Service</CardTitle>
              <CardDescription>Breakdown of spending across cloud services</CardDescription>
            </CardHeader>
            <CardContent>
              {serviceCosts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceCosts.map((service, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Cloud className="w-4 h-4" />
                            {service.service}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">
                          ${service.cost.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{service.percentage.toFixed(1)}%</Badge>
                        </TableCell>
                        <TableCell>{getTrendIcon(service.trend)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click &quot;Load Data&quot; to view service costs</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Budget Alert</CardTitle>
              <CardDescription>Set spending thresholds and receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget-name">Budget Name</Label>
                  <Input
                    id="budget-name"
                    value={newBudgetName}
                    onChange={(e) => setNewBudgetName(e.target.value)}
                    placeholder="Production Environment"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget-amount">Monthly Budget ($)</Label>
                  <Input
                    id="budget-amount"
                    type="number"
                    value={newBudgetAmount}
                    onChange={(e) => setNewBudgetAmount(e.target.value)}
                    placeholder="5000"
                  />
                </div>

                <div className="flex items-end">
                  <Button onClick={addBudgetAlert} disabled={isLoading} className="w-full">
                    <Bell className="w-4 h-4 mr-2" />
                    Add Alert
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Budget Alerts</CardTitle>
                  <CardDescription>Monitor spending against defined budgets</CardDescription>
                </div>
                <Button onClick={loadBudgetAlerts} disabled={isLoading} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {budgetAlerts.length > 0 ? (
                <div className="space-y-3">
                  {budgetAlerts.map((alert) => (
                    <Card key={alert.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{alert.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ${alert.spent.toFixed(2)} of ${alert.budget.toFixed(2)} spent
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className={`h-2 rounded-full ${
                                  alert.percentage >= 100 ? "bg-red-500" :
                                  alert.percentage >= 80 ? "bg-yellow-500" :
                                  "bg-green-500"
                                }`}
                                style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getBudgetStatusBadge(alert.status)}
                            <Badge variant="outline">{alert.percentage.toFixed(0)}%</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No budget alerts configured</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cost Optimization Recommendations</CardTitle>
                  <CardDescription>Actionable suggestions to reduce cloud spending</CardDescription>
                </div>
                <Button onClick={loadRecommendations} disabled={isLoading} variant="outline">
                  Load Recommendations
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <Card key={rec.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="w-4 h-4" />
                              <span className="font-semibold">{rec.title}</span>
                              {getPriorityBadge(rec.priority)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {rec.description}
                            </p>
                            <Badge variant="outline" className="bg-green-50">
                              Potential savings: ${rec.potentialSavings.toFixed(2)}/month
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Alert>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      Total potential savings: $
                      {recommendations.reduce((sum, r) => sum + r.potentialSavings, 0).toFixed(2)}
                      /month
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click &quot;Load Recommendations&quot; to see optimization opportunities</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cost Forecast</CardTitle>
                  <CardDescription>Projected spending based on historical trends</CardDescription>
                </div>
                <Button onClick={loadForecast} disabled={isLoading} variant="outline">
                  Generate Forecast
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {forecast.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Historical</TableHead>
                      <TableHead>Projected</TableHead>
                      <TableHead>Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forecast.map((item, index) => {
                      const change = item.projected - item.historical;
                      const changePercent = (change / item.historical) * 100;
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.month}</TableCell>
                          <TableCell className="font-mono">
                            ${item.historical.toFixed(2)}
                          </TableCell>
                          <TableCell className="font-mono font-semibold">
                            ${item.projected.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={change > 0 ? "destructive" : "default"}>
                              {change > 0 ? "+" : ""}
                              {changePercent.toFixed(1)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click &quot;Generate Forecast&quot; to predict future costs</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
