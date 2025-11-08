"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toaster";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  Search,
  Plus,
  Settings,
  Activity,
  Target,
  Zap,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";

interface AnalyticsEvent {
  id: string;
  eventType: string;
  eventName: string;
  userId?: string;
  sessionId: string;
  pageUrl: string;
  timestamp: string;
  properties: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
}

interface AnalyticsStats {
  totalEvents: number;
  uniqueUsers: number;
  totalSessions: number;
  avgSessionDuration: number;
  topPages: Array<{ page: string; views: number }>;
  topEvents: Array<{ event: string; count: number }>;
  conversionRate: number;
  bounceRate: number;
}

interface EventFilter {
  eventType?: string;
  eventName?: string;
  startDate?: string;
  endDate?: string;
  pageUrl?: string;
  userId?: string;
  limit: number;
  offset: number;
}

export default function UsageAnalyticsExplorerClient() {
  const { toast } = useToast();

  // State management
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pagination, setPagination] = useState({ limit: 100, offset: 0, total: 0 });

  // Filter states
  const [filters, setFilters] = useState<EventFilter>({
    limit: 100,
    offset: 0,
  });

  // Custom event name input for filters
  const [isCustomEventNameFilter, setIsCustomEventNameFilter] = useState(false);

  // Event tracking form - use empty string initially, set in useEffect
  const [trackEventData, setTrackEventData] = useState({
    eventType: "interaction",
    eventName: "",
    properties: "{}",
    pageUrl: "",
  });
  const [isCustomEventName, setIsCustomEventName] = useState(false);

  // Sample data generation
  const [sampleDataCount, setSampleDataCount] = useState(50);
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);

  // Export settings
  const [exportFormat, setExportFormat] = useState<"csv" | "json" | "excel">("csv");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  // Set pageUrl on client side only
  useEffect(() => {
    setTrackEventData((prev) => ({
      ...prev,
      pageUrl: typeof window !== "undefined" ? window.location.pathname : "",
    }));
  }, []);

  const generateSampleData = async () => {
    setIsGeneratingSample(true);
    try {
      const sampleEvents = generateMockEvents(sampleDataCount);

      // Track all sample events
      for (const event of sampleEvents) {
        await fetch("/api/tools/usage-analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        });
      }

      toast({
        title: "Success",
        description: `Generated ${sampleDataCount} sample events`,
      });

      // Refresh data
      loadAnalyticsData();
    } catch (error) {
      console.error("Error generating sample data:", error);
      toast({
        title: "Error",
        description: "Failed to generate sample data",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSample(false);
    }
  };

  const generateMockEvents = (count: number) => {
    const events = [];
    const eventTypes = ["page_view", "interaction", "conversion", "error"];
    const eventNames = {
      page_view: ["page_view", "home_view", "dashboard_view", "profile_view"],
      interaction: ["button_click", "link_click", "form_submit", "scroll", "hover"],
      conversion: ["signup_complete", "purchase_complete", "goal_reached"],
      error: ["form_error", "api_error", "validation_error"]
    };
    const pages = ["/", "/dashboard", "/profile", "/settings", "/tools", "/pricing"];
    const userIds = ["user_001", "user_002", "user_003", "user_004", "user_005"];

    for (let i = 0; i < count; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const eventName = eventNames[eventType as keyof typeof eventNames][
        Math.floor(Math.random() * eventNames[eventType as keyof typeof eventNames].length)
      ];
      const pageUrl = pages[Math.floor(Math.random() * pages.length)];
      const userId = Math.random() > 0.3 ? userIds[Math.floor(Math.random() * userIds.length)] : undefined;

      // Generate timestamp within last 7 days
      const daysAgo = Math.floor(Math.random() * 7);
      const hoursAgo = Math.floor(Math.random() * 24);
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);
      timestamp.setHours(timestamp.getHours() - hoursAgo);

      const properties = generateEventProperties(eventType, eventName);

      events.push({
        eventType,
        eventName,
        userId,
        pageUrl,
        properties,
        timestamp: timestamp.toISOString(),
      });
    }

    return events;
  };

  const generateEventProperties = (eventType: string, eventName: string) => {
    const properties: Record<string, any> = {};

    switch (eventType) {
      case "page_view":
        properties.page_title = eventName.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
        properties.referrer = Math.random() > 0.5 ? "https://google.com" : "direct";
        break;
      case "interaction":
        if (eventName === "button_click") {
          properties.button_text = ["Sign Up", "Get Started", "Learn More", "Contact Us"][Math.floor(Math.random() * 4)];
          properties.section = ["hero", "features", "pricing", "footer"][Math.floor(Math.random() * 4)];
        } else if (eventName === "form_submit") {
          properties.form_type = ["contact", "signup", "login", "newsletter"][Math.floor(Math.random() * 4)];
          properties.fields_filled = Math.floor(Math.random() * 5) + 1;
        }
        break;
      case "conversion":
        if (eventName === "signup_complete") {
          properties.signup_method = ["email", "google", "github", "linkedin"][Math.floor(Math.random() * 4)];
          properties.plan_selected = ["free", "pro", "enterprise"][Math.floor(Math.random() * 3)];
        } else if (eventName === "purchase_complete") {
          properties.amount = Math.floor(Math.random() * 100) + 10;
          properties.currency = "USD";
          properties.items = Math.floor(Math.random() * 5) + 1;
        }
        break;
      case "error":
        if (eventName === "form_error") {
          properties.error_field = ["email", "password", "name", "phone"][Math.floor(Math.random() * 4)];
          properties.error_message = "Invalid format";
        } else if (eventName === "api_error") {
          properties.status_code = [400, 401, 403, 404, 500][Math.floor(Math.random() * 5)];
          properties.endpoint = "/api/" + ["auth", "data", "user", "tools"][Math.floor(Math.random() * 4)];
        }
        break;
    }

    return properties;
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [filters]);

  const loadAnalyticsData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.eventType) params.append("eventType", filters.eventType);
      if (filters.eventName) params.append("eventName", filters.eventName);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.pageUrl) params.append("pageUrl", filters.pageUrl);
      if (filters.userId) params.append("userId", filters.userId);
      params.append("limit", filters.limit.toString());
      params.append("offset", filters.offset.toString());

      const response = await fetch(`/api/tools/usage-analytics?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const data = await response.json();
      setEvents(data.events || []);
      setStats(data.stats);
      setPagination(data.pagination || { limit: 100, offset: 0, total: 0 });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  const trackEvent = async () => {
    if (!trackEventData.eventName.trim()) {
      toast({
        title: "Error",
        description: "Event name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      let properties = {};
      try {
        properties = JSON.parse(trackEventData.properties);
      } catch {
        toast({
          title: "Error",
          description: "Invalid JSON in properties",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/tools/usage-analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType: trackEventData.eventType,
          eventName: trackEventData.eventName,
          properties,
          pageUrl: trackEventData.pageUrl,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event tracked successfully",
        });
        setTrackEventData({
          eventType: "interaction",
          eventName: "",
          properties: "{}",
          pageUrl: window.location.pathname,
        });
        setIsCustomEventName(false);
        loadAnalyticsData();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to track event",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error tracking event:", error);
      toast({
        title: "Error",
        description: "Failed to track event",
        variant: "destructive",
      });
    }
  };

  const exportData = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.eventType) params.append("eventType", filters.eventType);
      if (filters.eventName) params.append("eventName", filters.eventName);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.pageUrl) params.append("pageUrl", filters.pageUrl);
      if (filters.userId) params.append("userId", filters.userId);
      params.append("limit", "10000"); // Export more data
      params.append("format", exportFormat);

      const response = await fetch(`/api/tools/usage-analytics/export?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data for export");
      }

      const data = await response.json();

      if (exportFormat === "csv") {
        const csvContent = [
          ["Event ID", "Event Type", "Event Name", "Timestamp", "Page URL", "User ID", "Session ID"],
          ...data.events.map((event: AnalyticsEvent) => [
            event.id,
            event.eventType,
            event.eventName,
            event.timestamp,
            event.pageUrl,
            event.userId || "",
            event.sessionId,
          ]),
        ]
          .map(row => row.map((cell: string | number | boolean) => `"${cell}"`).join(","))
          .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics-export-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (exportFormat === "json") {
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics-export-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }

      toast({
        title: "Export successful",
        description: `Data exported as ${exportFormat.toUpperCase()}`,
      });
      setIsExportDialogOpen(false);
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export failed",
        description: "Failed to export analytics data",
        variant: "destructive",
      });
    }
  };

  const getDeviceIcon = (userAgent?: string) => {
    if (!userAgent) return <Monitor className="w-4 h-4" />;

    if (userAgent.includes("Mobile")) return <Smartphone className="w-4 h-4" />;
    if (userAgent.includes("Tablet")) return <Tablet className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const clearAllData = async () => {
    try {
      const response = await fetch("/api/tools/usage-analytics", {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "All analytics data cleared",
        });
        loadAnalyticsData();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to clear data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error clearing data:", error);
      toast({
        title: "Error",
        description: "Failed to clear analytics data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6" />
          <h1 className="text-3xl font-bold">Usage Analytics Explorer</h1>
        </div>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Generate Sample Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Sample Analytics Data</DialogTitle>
                <DialogDescription>
                  Create sample events to populate your analytics dashboard and test the functionality.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Number of Events</Label>
                  <Input
                    type="number"
                    min="10"
                    max="500"
                    value={sampleDataCount}
                    onChange={(e) => setSampleDataCount(parseInt(e.target.value) || 50)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Generate between 10-500 sample events with realistic data patterns.
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSampleDataCount(50)}>
                    Reset to 50
                  </Button>
                  <Button onClick={generateSampleData} disabled={isGeneratingSample}>
                    {isGeneratingSample && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                    Generate Data
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={clearAllData}>
            Clear All Data
          </Button>
          <Button onClick={loadAnalyticsData} disabled={loading}>
            {loading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
            Refresh
          </Button>
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Analytics Data</DialogTitle>
                <DialogDescription>
                  Choose the format for your analytics data export.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select value={exportFormat} onValueChange={(value: "csv" | "json" | "excel") => setExportFormat(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={exportData}>
                    Export Data
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="tracking">Track Event</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {stats && stats.totalEvents > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalEvents.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      All tracked events
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.uniqueUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Distinct users
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sessions</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalSessions.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      User sessions
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{(stats.conversionRate * 100).toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                      Goal completions
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Pages</CardTitle>
                    <CardDescription>Most visited pages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats?.topPages.slice(0, 5).map((page, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm truncate max-w-48">{page.page}</span>
                          </div>
                          <Badge variant="secondary">{page.views} views</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Events</CardTitle>
                    <CardDescription>Most frequent events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats?.topEvents.slice(0, 5).map((event, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <MousePointer className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{event.event}</span>
                          </div>
                          <Badge variant="secondary">{event.count} times</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Analytics Data Yet</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Start by generating sample data to see how the analytics dashboard works, or track real events using the "Track Event" tab.
                </p>
                <div className="flex space-x-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Generate Sample Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Generate Sample Analytics Data</DialogTitle>
                        <DialogDescription>
                          Create sample events to populate your analytics dashboard and test the functionality.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Number of Events</Label>
                          <Input
                            type="number"
                            min="10"
                            max="500"
                            value={sampleDataCount}
                            onChange={(e) => setSampleDataCount(parseInt(e.target.value) || 50)}
                          />
                          <p className="text-sm text-muted-foreground">
                            Generate between 10-500 sample events with realistic data patterns.
                          </p>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setSampleDataCount(50)}>
                            Reset to 50
                          </Button>
                          <Button onClick={generateSampleData} disabled={isGeneratingSample}>
                            {isGeneratingSample && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                            Generate Data
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" onClick={() => setActiveTab("tracking")}>
                    Track Real Events
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Filters</CardTitle>
              <CardDescription>Filter and search through analytics events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select
                    value={filters.eventType || "ALL"}
                    onValueChange={(value) => setFilters(prev => ({
                      ...prev,
                      eventType: value === "ALL" ? undefined : value,
                      offset: 0
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Types</SelectItem>
                      <SelectItem value="page_view">Page View</SelectItem>
                      <SelectItem value="interaction">Interaction</SelectItem>
                      <SelectItem value="conversion">Conversion</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Event Name</Label>
                  <Select
                    value={isCustomEventNameFilter ? "other" : (filters.eventName || "ALL")}
                    onValueChange={(value) => {
                      if (value === "other") {
                        setIsCustomEventNameFilter(true);
                        setFilters(prev => ({
                          ...prev,
                          eventName: undefined,
                          offset: 0
                        }));
                      } else {
                        setIsCustomEventNameFilter(false);
                        setFilters(prev => ({
                          ...prev,
                          eventName: value === "ALL" ? undefined : value,
                          offset: 0
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Events</SelectItem>
                      <Separator className="my-2" />
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">PAGE VIEWS</div>
                      <SelectItem value="page_view">Page View</SelectItem>
                      <SelectItem value="home_view">Home View</SelectItem>
                      <SelectItem value="dashboard_view">Dashboard View</SelectItem>
                      <SelectItem value="profile_view">Profile View</SelectItem>
                      <SelectItem value="settings_view">Settings View</SelectItem>
                      <SelectItem value="pricing_view">Pricing View</SelectItem>
                      <SelectItem value="docs_view">Documentation View</SelectItem>
                      <SelectItem value="blog_view">Blog View</SelectItem>
                      <SelectItem value="tools_view">Tools View</SelectItem>
                      <Separator className="my-2" />
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">USER INTERACTIONS</div>
                      <SelectItem value="button_click">Button Click</SelectItem>
                      <SelectItem value="link_click">Link Click</SelectItem>
                      <SelectItem value="form_submit">Form Submit</SelectItem>
                      <SelectItem value="form_start">Form Start</SelectItem>
                      <SelectItem value="input_focus">Input Focus</SelectItem>
                      <SelectItem value="input_blur">Input Blur</SelectItem>
                      <SelectItem value="scroll">Scroll</SelectItem>
                      <SelectItem value="hover">Hover</SelectItem>
                      <SelectItem value="tab_switch">Tab Switch</SelectItem>
                      <SelectItem value="modal_open">Modal Open</SelectItem>
                      <SelectItem value="modal_close">Modal Close</SelectItem>
                      <SelectItem value="dropdown_open">Dropdown Open</SelectItem>
                      <SelectItem value="dropdown_select">Dropdown Select</SelectItem>
                      <SelectItem value="search">Search</SelectItem>
                      <SelectItem value="filter">Filter</SelectItem>
                      <SelectItem value="sort">Sort</SelectItem>
                      <SelectItem value="download">Download</SelectItem>
                      <SelectItem value="upload">Upload</SelectItem>
                      <SelectItem value="copy">Copy</SelectItem>
                      <SelectItem value="share">Share</SelectItem>
                      <Separator className="my-2" />
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">MEDIA & CONTENT</div>
                      <SelectItem value="video_play">Video Play</SelectItem>
                      <SelectItem value="video_pause">Video Pause</SelectItem>
                      <SelectItem value="video_complete">Video Complete</SelectItem>
                      <SelectItem value="video_seek">Video Seek</SelectItem>
                      <SelectItem value="image_view">Image View</SelectItem>
                      <SelectItem value="image_zoom">Image Zoom</SelectItem>
                      <SelectItem value="content_expand">Content Expand</SelectItem>
                      <SelectItem value="content_collapse">Content Collapse</SelectItem>
                      <SelectItem value="accordion_open">Accordion Open</SelectItem>
                      <SelectItem value="accordion_close">Accordion Close</SelectItem>
                      <Separator className="my-2" />
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">E-COMMERCE & CONVERSIONS</div>
                      <SelectItem value="add_to_cart">Add to Cart</SelectItem>
                      <SelectItem value="remove_from_cart">Remove from Cart</SelectItem>
                      <SelectItem value="checkout_start">Checkout Start</SelectItem>
                      <SelectItem value="checkout_complete">Checkout Complete</SelectItem>
                      <SelectItem value="purchase_complete">Purchase Complete</SelectItem>
                      <SelectItem value="signup_complete">Signup Complete</SelectItem>
                      <SelectItem value="login">Login</SelectItem>
                      <SelectItem value="logout">Logout</SelectItem>
                      <SelectItem value="subscription_start">Subscription Start</SelectItem>
                      <SelectItem value="subscription_cancel">Subscription Cancel</SelectItem>
                      <SelectItem value="trial_start">Trial Start</SelectItem>
                      <SelectItem value="goal_reached">Goal Reached</SelectItem>
                      <SelectItem value="lead_generated">Lead Generated</SelectItem>
                      <Separator className="my-2" />
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">ERRORS & ISSUES</div>
                      <SelectItem value="form_error">Form Error</SelectItem>
                      <SelectItem value="validation_error">Validation Error</SelectItem>
                      <SelectItem value="api_error">API Error</SelectItem>
                      <SelectItem value="network_error">Network Error</SelectItem>
                      <SelectItem value="javascript_error">JavaScript Error</SelectItem>
                      <SelectItem value="timeout_error">Timeout Error</SelectItem>
                      <SelectItem value="permission_denied">Permission Denied</SelectItem>
                      <SelectItem value="not_found">Not Found</SelectItem>
                      <SelectItem value="server_error">Server Error</SelectItem>
                      <Separator className="my-2" />
                      <SelectItem value="other">Other (Custom)</SelectItem>
                    </SelectContent>
                  </Select>
                  {isCustomEventNameFilter && (
                    <Input
                      placeholder="Enter custom event name..."
                      value={filters.eventName || ""}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        eventName: e.target.value || undefined,
                        offset: 0
                      }))}
                      className="mt-2"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={filters.startDate || ""}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      startDate: e.target.value || undefined,
                      offset: 0
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={filters.endDate || ""}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      endDate: e.target.value || undefined,
                      offset: 0
                    }))}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Showing {events.length} of {pagination.total} events
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setFilters(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))}
                    disabled={pagination.offset === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setFilters(prev => ({ ...prev, offset: prev.offset + prev.limit }))}
                    disabled={pagination.offset + pagination.limit >= pagination.total}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Latest analytics events with details</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{event.eventName}</div>
                            <div className="text-sm text-muted-foreground">
                              {Object.keys(event.properties).length} properties
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.eventType}</Badge>
                        </TableCell>
                        <TableCell>
                          {event.userId ? (
                            <span className="font-mono text-sm">{event.userId.slice(0, 8)}...</span>
                          ) : (
                            <span className="text-muted-foreground">Anonymous</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm truncate max-w-32 block" title={event.pageUrl}>
                            {event.pageUrl}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getDeviceIcon(event.userAgent)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatTimestamp(event.timestamp)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Track Custom Event</CardTitle>
              <CardDescription>Manually track events for testing and analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select
                    value={trackEventData.eventType}
                    onValueChange={(value) => setTrackEventData(prev => ({ ...prev, eventType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="page_view">Page View</SelectItem>
                      <SelectItem value="interaction">Interaction</SelectItem>
                      <SelectItem value="conversion">Conversion</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Event Name</Label>
                  <Select
                    value={isCustomEventName ? "other" : trackEventData.eventName}
                    onValueChange={(value) => {
                      if (value === "other") {
                        setIsCustomEventName(true);
                        setTrackEventData(prev => ({ ...prev, eventName: "" }));
                      } else {
                        setIsCustomEventName(false);
                        setTrackEventData(prev => ({ ...prev, eventName: value }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="button_click">Button Click</SelectItem>
                      <SelectItem value="link_click">Link Click</SelectItem>
                      <SelectItem value="form_submit">Form Submit</SelectItem>
                      <SelectItem value="form_start">Form Start</SelectItem>
                      <SelectItem value="input_focus">Input Focus</SelectItem>
                      <SelectItem value="input_blur">Input Blur</SelectItem>
                      <SelectItem value="scroll">Scroll</SelectItem>
                      <SelectItem value="hover">Hover</SelectItem>
                      <SelectItem value="download">Download</SelectItem>
                      <SelectItem value="upload">Upload</SelectItem>
                      <SelectItem value="search">Search</SelectItem>
                      <SelectItem value="filter">Filter</SelectItem>
                      <SelectItem value="sort">Sort</SelectItem>
                      <SelectItem value="tab_switch">Tab Switch</SelectItem>
                      <SelectItem value="modal_open">Modal Open</SelectItem>
                      <SelectItem value="modal_close">Modal Close</SelectItem>
                      <SelectItem value="video_play">Video Play</SelectItem>
                      <SelectItem value="video_pause">Video Pause</SelectItem>
                      <SelectItem value="video_complete">Video Complete</SelectItem>
                      <SelectItem value="signup_complete">Signup Complete</SelectItem>
                      <SelectItem value="login">Login</SelectItem>
                      <SelectItem value="logout">Logout</SelectItem>
                      <SelectItem value="purchase_complete">Purchase Complete</SelectItem>
                      <SelectItem value="add_to_cart">Add to Cart</SelectItem>
                      <SelectItem value="remove_from_cart">Remove from Cart</SelectItem>
                      <SelectItem value="checkout_start">Checkout Start</SelectItem>
                      <SelectItem value="goal_reached">Goal Reached</SelectItem>
                      <SelectItem value="page_view">Page View</SelectItem>
                      <SelectItem value="time_on_page">Time on Page</SelectItem>
                      <SelectItem value="form_error">Form Error</SelectItem>
                      <SelectItem value="api_error">API Error</SelectItem>
                      <SelectItem value="validation_error">Validation Error</SelectItem>
                      <SelectItem value="network_error">Network Error</SelectItem>
                      <SelectItem value="javascript_error">JavaScript Error</SelectItem>
                      <SelectItem value="other">Other (Custom)</SelectItem>
                    </SelectContent>
                  </Select>
                  {isCustomEventName && (
                    <Input
                      placeholder="Enter custom event name..."
                      value={trackEventData.eventName}
                      onChange={(e) => setTrackEventData(prev => ({ ...prev, eventName: e.target.value }))}
                      className="mt-2"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Page URL</Label>
                <Input
                  value={trackEventData.pageUrl}
                  onChange={(e) => setTrackEventData(prev => ({ ...prev, pageUrl: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Event Properties (JSON)</Label>
                <Textarea
                  value={trackEventData.properties}
                  onChange={(e) => setTrackEventData(prev => ({ ...prev, properties: e.target.value }))}
                  placeholder='{"button_text": "Sign Up", "section": "hero"}'
                  rows={4}
                />
              </div>

              <Button onClick={trackEvent} className="w-full">
                <Zap className="w-4 h-4 mr-2" />
                Track Event
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Track Examples</CardTitle>
              <CardDescription>Common event tracking examples</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => setTrackEventData({
                    eventType: "page_view",
                    eventName: "page_view",
                    properties: '{"page_title": "Home Page"}',
                    pageUrl: window.location.pathname,
                  })}
                >
                  Track Page View
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setTrackEventData({
                    eventType: "interaction",
                    eventName: "button_click",
                    properties: '{"button_text": "Get Started", "section": "hero"}',
                    pageUrl: window.location.pathname,
                  })}
                >
                  Track Button Click
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setTrackEventData({
                    eventType: "conversion",
                    eventName: "signup_complete",
                    properties: '{"signup_method": "email"}',
                    pageUrl: window.location.pathname,
                  })}
                >
                  Track Conversion
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setTrackEventData({
                    eventType: "error",
                    eventName: "form_error",
                    properties: '{"error_field": "email", "error_message": "Invalid email"}',
                    pageUrl: window.location.pathname,
                  })}
                >
                  Track Error
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Settings</CardTitle>
              <CardDescription>Configure analytics tracking and data management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Real-time Tracking</h4>
                    <p className="text-sm text-muted-foreground">Enable live event tracking and updates</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Data Retention</h4>
                    <p className="text-sm text-muted-foreground">Configure how long to keep analytics data</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Clock className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Privacy Settings</h4>
                    <p className="text-sm text-muted-foreground">Manage user privacy and data collection</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
