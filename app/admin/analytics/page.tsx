"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/toaster";
import { useRealtimeAdminAnalytics } from "@/lib/hooks/use-realtime-admin-analytics";
import {
  BarChart3,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Download,
  Calendar,
  Target,
  Zap,
  Shield,
  Heart,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  Radio,
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedTab, setSelectedTab] = useState("overview");
  const { toast } = useToast();

  const {
    analyticsData,
    loading,
    error,
    isConnected,
    isRefreshing,
    lastUpdated,
    refresh,
    reconnect,
  } = useRealtimeAdminAnalytics({
    timeRange,
    onError: (errorMessage) => {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  if (loading && !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Platform usage statistics and insights
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={refresh} disabled={isRefreshing}>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Refresh
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error && !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Platform usage statistics and insights
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Failed to load analytics data</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
          <Button onClick={reconnect} className="mt-4" variant="outline">
            <Wifi className="mr-2 h-4 w-4" />
            Reconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Platform usage statistics and insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={refresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <div className="flex items-center space-x-1 text-green-600">
                <Wifi className="h-4 w-4" />
                <span className="text-xs">Live</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-red-600">
                <WifiOff className="h-4 w-4" />
                <span className="text-xs">Offline</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time indicator and last updated */}
      {lastUpdated && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Radio className={`h-3 w-3 ${isConnected ? "text-green-500 animate-pulse" : "text-gray-400"}`} />
            <span>Real-time data active</span>
          </div>
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analyticsData?.overview.totalUsers || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {analyticsData?.overview.activeUsers || 0} active this period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analyticsData?.overview.totalSessions || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatDuration(analyticsData?.userMetrics.averageSessionDuration || 0)} avg duration
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tool Usage</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analyticsData?.overview.totalToolUsage || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Across all tools
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analyticsData?.overview.totalRevenue || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {analyticsData?.overview.totalDonations || 0} donations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Platform performance and reliability metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(analyticsData?.systemHealth.uptime || 0).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {analyticsData?.systemHealth.responseTime || 0}ms
                  </div>
                  <p className="text-xs text-muted-foreground">Avg Response Time</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {(analyticsData?.systemHealth.errorRate || 0).toFixed(2)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Error Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {analyticsData?.systemHealth.activeConnections || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Active Connections</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>New Users</CardTitle>
                <CardDescription>User acquisition metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Today</span>
                  <span className="font-bold">{analyticsData?.userMetrics.newUsersToday || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">This Week</span>
                  <span className="font-bold">{analyticsData?.userMetrics.newUsersThisWeek || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">This Month</span>
                  <span className="font-bold">{analyticsData?.userMetrics.newUsersThisMonth || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>User engagement and retention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {(analyticsData?.userMetrics.userRetention || 0).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  7-day retention rate
                </p>
                <Progress value={analyticsData?.userMetrics.userRetention || 0} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Duration</CardTitle>
                <CardDescription>Average time spent per session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatDuration(analyticsData?.userMetrics.averageSessionDuration || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Average session length
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Users by country</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData?.geographicData.slice(0, 10).map((country) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{country.country}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{country.users}</span>
                      <span className="text-xs text-muted-foreground">
                        ({country.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tool Usage Analytics</CardTitle>
              <CardDescription>Most popular tools and usage patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tool</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Usage Count</TableHead>
                    <TableHead>Unique Users</TableHead>
                    <TableHead>Avg. Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData?.toolUsage.map((tool) => (
                    <TableRow key={tool.toolName}>
                      <TableCell className="font-medium">{tool.toolName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tool.category}</Badge>
                      </TableCell>
                      <TableCell>{formatNumber(tool.usageCount)}</TableCell>
                      <TableCell>{formatNumber(tool.uniqueUsers)}</TableCell>
                      <TableCell>{formatDuration(tool.averageTime)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your users are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData?.trafficSources.map((source) => (
                    <div key={source.source} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{source.source}</span>
                        <span className="text-sm text-muted-foreground">
                          {source.visits} ({source.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={source.percentage} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
                <CardDescription>User device preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Desktop</span>
                    </div>
                    <span className="font-bold">{analyticsData?.deviceStats.desktop || 0}%</span>
                  </div>
                  <Progress value={analyticsData?.deviceStats.desktop || 0} />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Mobile</span>
                    </div>
                    <span className="font-bold">{analyticsData?.deviceStats.mobile || 0}%</span>
                  </div>
                  <Progress value={analyticsData?.deviceStats.mobile || 0} />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Tablet className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Tablet</span>
                    </div>
                    <span className="font-bold">{analyticsData?.deviceStats.tablet || 0}%</span>
                  </div>
                  <Progress value={analyticsData?.deviceStats.tablet || 0} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
                <CardDescription>All-time revenue generated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(analyticsData?.revenueMetrics.totalRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  From {analyticsData?.revenueMetrics.donationCount || 0} donations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue for current month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatCurrency(analyticsData?.revenueMetrics.monthlyRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Current month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Donation</CardTitle>
                <CardDescription>Average donation amount</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatCurrency(analyticsData?.revenueMetrics.averageDonation || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Per donation
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Revenue breakdown by payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData?.revenueMetrics.paymentMethodBreakdown.map((method) => (
                  <div key={method.method} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{method.method}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(method.amount)} ({method.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={method.percentage} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {(analyticsData?.systemHealth.uptime || 0).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData?.systemHealth.responseTime || 0}ms
                </div>
                <p className="text-xs text-muted-foreground">
                  Average response time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {(analyticsData?.systemHealth.errorRate || 0).toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Error rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData?.systemHealth.activeConnections || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Current connections
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <CardDescription>Detailed system metrics and health indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">CPU Usage</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} />

                    <div className="flex justify-between">
                      <span className="text-sm">Memory Usage</span>
                      <span className="text-sm font-medium">67%</span>
                    </div>
                    <Progress value={67} />

                    <div className="flex justify-between">
                      <span className="text-sm">Disk Usage</span>
                      <span className="text-sm font-medium">23%</span>
                    </div>
                    <Progress value={23} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Health Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <Badge className="bg-green-500">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Services</span>
                      <Badge className="bg-green-500">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Payment Gateways</span>
                      <Badge className="bg-yellow-500">Degraded</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">CDN</span>
                      <Badge className="bg-green-500">Healthy</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}