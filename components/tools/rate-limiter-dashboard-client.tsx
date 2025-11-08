"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/toaster";
import { Loader2, Shield, Plus, Edit, Trash2, BarChart3, Activity, Users, Clock, Play, RotateCcw, Download, TrendingUp, AlertTriangle } from "lucide-react";

interface RateLimitRule {
  id: string;
  name: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "ALL";
  limit: number;
  windowMs: number;
  strategy: "fixed-window" | "sliding-window" | "token-bucket" | "leaky-bucket";
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RateLimitStats {
  ruleId: string;
  totalRequests: number;
  blockedRequests: number;
  allowedRequests: number;
  currentWindow: {
    start: number;
    end: number;
    requests: number;
  };
  topClients: Array<{
    identifier: string;
    requests: number;
    blocked: number;
  }>;
  recentActivity: Array<{
    timestamp: number;
    clientId: string;
    endpoint: string;
    allowed: boolean;
    responseTime?: number;
  }>;
}

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  tls?: boolean;
}

export default function RateLimiterDashboardClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [rules, setRules] = useState<RateLimitRule[]>([]);
  const [stats, setStats] = useState<RateLimitStats[]>([]);
  const [selectedRule, setSelectedRule] = useState<RateLimitRule | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RateLimitRule | null>(null);

  // Redis configuration
  const [redisConfig, setRedisConfig] = useState<RedisConfig>({
    host: "161.97.172.172",
    port: 6379,
    password: "87gQQOarM2IJUKqmZA2wcPM4HryGs9El9RvfW49ZKQydlGkbbCr95Xmv0yfVFRS3",
    db: 0,
    tls: true,
  });
  const [isConfigured, setIsConfigured] = useState(true); // Pre-configured with defaults

  // Simulation state
  const [simulationClientId, setSimulationClientId] = useState("client_123");
  const [simulationEndpoint, setSimulationEndpoint] = useState("/api/users");
  const [simulationMethod, setSimulationMethod] = useState("GET");
  const [simulationResult, setSimulationResult] = useState<any>(null);

  // Form states
  const [newRule, setNewRule] = useState({
    name: "",
    endpoint: "",
    method: "ALL" as const,
    limit: 100,
    windowMs: 60000, // 1 minute
    strategy: "fixed-window" as const,
    enabled: true,
  });

  const [editRule, setEditRule] = useState<{
    name: string;
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "ALL";
    limit: number;
    windowMs: number;
    strategy: "fixed-window" | "sliding-window" | "token-bucket" | "leaky-bucket";
    enabled: boolean;
  }>({
    name: "",
    endpoint: "",
    method: "ALL",
    limit: 100,
    windowMs: 60000,
    strategy: "fixed-window",
    enabled: true,
  });

  const loadRules = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/rate-limiter-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "list_rules",
          redisConfig,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRules(data.rules || []);
      } else {
        throw new Error(data.error || "Failed to load rules");
      }
    } catch (error: any) {
      toast({
        title: "Load Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, redisConfig]);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/rate-limiter-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_stats",
          redisConfig,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.stats || []);
      } else {
        throw new Error(data.error || "Failed to load stats");
      }
    } catch (error: any) {
      toast({
        title: "Load Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, redisConfig]);

  const handleCreateRule = useCallback(async () => {
    if (!newRule.name || !newRule.endpoint || !newRule.limit) {
      toast({
        title: "Validation Error",
        description: "Name, endpoint, and limit are required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/rate-limiter-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_rule",
          rule: newRule,
          redisConfig,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Rule Created",
          description: "Rate limiting rule has been created successfully.",
        });
        setIsCreateDialogOpen(false);
        setNewRule({
          name: "",
          endpoint: "",
          method: "ALL",
          limit: 100,
          windowMs: 60000,
          strategy: "fixed-window",
          enabled: true,
        });
        await loadRules();
        await loadStats();
      } else {
        throw new Error(data.error || "Failed to create rule");
      }
    } catch (error: any) {
      toast({
        title: "Create Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [newRule, toast, loadRules, loadStats, redisConfig]);

  const handleUpdateRule = useCallback(async () => {
    if (!editingRule || !editRule.name || !editRule.endpoint || !editRule.limit) {
      toast({
        title: "Validation Error",
        description: "Name, endpoint, and limit are required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/rate-limiter-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_rule",
          ruleId: editingRule.id,
          rule: editRule,
          redisConfig,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Rule Updated",
          description: "Rate limiting rule has been updated successfully.",
        });
        setIsEditDialogOpen(false);
        setEditingRule(null);
        await loadRules();
      } else {
        throw new Error(data.error || "Failed to update rule");
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [editingRule, editRule, toast, loadRules, redisConfig]);

  const handleDeleteRule = useCallback(async (ruleId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/rate-limiter-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_rule",
          ruleId,
          redisConfig,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Rule Deleted",
          description: "Rate limiting rule has been removed.",
        });
        await loadRules();
        await loadStats();
      } else {
        throw new Error(data.error || "Failed to delete rule");
      }
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, loadRules, loadStats, redisConfig]);

  const handleResetStats = useCallback(async (ruleId?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/rate-limiter-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset_stats",
          ruleId,
          redisConfig,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Stats Reset",
          description: data.message,
        });
        await loadStats();
      } else {
        throw new Error(data.error || "Failed to reset stats");
      }
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, loadStats, redisConfig]);

  const handleSimulateRequest = useCallback(async () => {
    if (!simulationClientId || !simulationEndpoint) {
      toast({
        title: "Validation Error",
        description: "Client ID and endpoint are required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/rate-limiter-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "simulate_request",
          clientId: simulationClientId,
          endpoint: simulationEndpoint,
          method: simulationMethod,
          redisConfig,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSimulationResult(data.simulation);
        await loadStats(); // Refresh stats after simulation
      } else {
        throw new Error(data.error || "Failed to simulate request");
      }
    } catch (error: any) {
      toast({
        title: "Simulation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [simulationClientId, simulationEndpoint, simulationMethod, toast, loadStats, redisConfig]);

  const handleExportConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/rate-limiter-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "export_config",
          redisConfig,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const blob = new Blob([JSON.stringify(data.config, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `rate-limiter-config-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Export Complete",
          description: "Configuration has been exported successfully.",
        });
      } else {
        throw new Error(data.error || "Failed to export config");
      }
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, redisConfig]);

  const openEditDialog = useCallback((rule: RateLimitRule) => {
    setEditingRule(rule);
    setEditRule({
      name: rule.name,
      endpoint: rule.endpoint,
      method: rule.method,
      limit: rule.limit,
      windowMs: rule.windowMs,
      strategy: rule.strategy,
      enabled: rule.enabled,
    });
    setIsEditDialogOpen(true);
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadRules();
    loadStats();
  }, [loadRules, loadStats]);

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case "fixed-window":
        return "default";
      case "sliding-window":
        return "secondary";
      case "token-bucket":
        return "outline";
      case "leaky-bucket":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatWindowTime = (ms: number) => {
    const seconds = ms / 1000;
    if (seconds < 60) return `${seconds}s`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${minutes}m`;
    const hours = minutes / 60;
    return `${hours}h`;
  };

  const getRuleStats = (ruleId: string) => {
    return stats.find(s => s.ruleId === ruleId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Rate Limiter Dashboard</h1>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Rate Limiting Rules</h2>
              <p className="text-sm text-muted-foreground">
                Configure and manage your API rate limiting rules
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadRules} disabled={isLoading} variant="outline">
                <RotateCcw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Rule
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Rate Limiting Rule</DialogTitle>
                    <DialogDescription>
                      Configure a new rate limiting rule for your API endpoints
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new-name">Rule Name</Label>
                      <Input
                        id="new-name"
                        value={newRule.name}
                        onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                        placeholder="e.g., API Rate Limit"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-endpoint">Endpoint Pattern</Label>
                      <Input
                        id="new-endpoint"
                        value={newRule.endpoint}
                        onChange={(e) => setNewRule({ ...newRule, endpoint: e.target.value })}
                        placeholder="e.g., /api/* or /api/users"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="new-method">HTTP Method</Label>
                        <Select value={newRule.method} onValueChange={(value: any) => setNewRule({ ...newRule, method: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ALL">ALL</SelectItem>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                            <SelectItem value="PATCH">PATCH</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="new-limit">Request Limit</Label>
                        <Input
                          id="new-limit"
                          type="number"
                          value={newRule.limit}
                          onChange={(e) => setNewRule({ ...newRule, limit: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="new-window">Time Window</Label>
                        <Select value={newRule.windowMs.toString()} onValueChange={(value) => setNewRule({ ...newRule, windowMs: parseInt(value) })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10000">10 seconds</SelectItem>
                            <SelectItem value="30000">30 seconds</SelectItem>
                            <SelectItem value="60000">1 minute</SelectItem>
                            <SelectItem value="300000">5 minutes</SelectItem>
                            <SelectItem value="900000">15 minutes</SelectItem>
                            <SelectItem value="3600000">1 hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="new-strategy">Strategy</Label>
                        <Select value={newRule.strategy} onValueChange={(value: any) => setNewRule({ ...newRule, strategy: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed-window">Fixed Window</SelectItem>
                            <SelectItem value="sliding-window">Sliding Window</SelectItem>
                            <SelectItem value="token-bucket">Token Bucket</SelectItem>
                            <SelectItem value="leaky-bucket">Leaky Bucket</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="new-enabled"
                        checked={newRule.enabled}
                        onCheckedChange={(checked) => setNewRule({ ...newRule, enabled: checked })}
                      />
                      <Label htmlFor="new-enabled">Enable Rule</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateRule} disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Create Rule
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rules.map((rule) => {
              const ruleStats = getRuleStats(rule.id);
              const utilization = ruleStats ? (ruleStats.currentWindow.requests / rule.limit) * 100 : 0;

              return (
                <Card key={rule.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(rule)}
                          disabled={isLoading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteRule(rule.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{rule.endpoint} ({rule.method})</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={rule.enabled ? "default" : "secondary"}>
                        {rule.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      <Badge variant={getStrategyColor(rule.strategy) as any}>
                        {rule.strategy}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Limit: {rule.limit} req/{formatWindowTime(rule.windowMs)}</span>
                      </div>
                      {ruleStats && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span>Current: {ruleStats.currentWindow.requests}</span>
                            <span className={utilization > 80 ? "text-destructive" : ""}>
                              {utilization.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={utilization} className="h-2" />
                        </>
                      )}
                    </div>

                    {ruleStats && (
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div>Total: {ruleStats.totalRequests}</div>
                        <div>Allowed: {ruleStats.allowedRequests}</div>
                        <div>Blocked: {ruleStats.blockedRequests}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {rules.length === 0 && !isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No rate limiting rules</h3>
              <p>Create your first rule to start protecting your APIs from abuse.</p>
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Rate Limiting Analytics</h2>
              <p className="text-sm text-muted-foreground">
                Monitor your API usage patterns and rate limiting effectiveness
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadStats} disabled={isLoading} variant="outline">
                <RotateCcw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button onClick={() => handleResetStats()} disabled={isLoading} variant="destructive">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset All Stats
              </Button>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.reduce((sum, s) => sum + s.totalRequests, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Allowed Requests</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.reduce((sum, s) => sum + s.allowedRequests, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blocked Requests</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats.reduce((sum, s) => sum + s.blockedRequests, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {rules.filter(r => r.enabled).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Clients */}
          <Card>
            <CardHeader>
              <CardTitle>Top Clients</CardTitle>
              <CardDescription>Clients with the highest request volumes</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {stats.flatMap(s => s.topClients).slice(0, 10).map((client, index) => (
                    <div key={`${client.identifier}-${index}`} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{client.identifier}</span>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span>{client.requests} requests</span>
                        <span className="text-red-600">{client.blocked} blocked</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest rate limiting decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {stats.flatMap(s => s.recentActivity).slice(0, 20).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-mono text-sm">{activity.clientId}</div>
                          <div className="text-xs text-muted-foreground">{activity.endpoint}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={activity.allowed ? "default" : "destructive"}>
                          {activity.allowed ? "Allowed" : "Blocked"}
                        </Badge>
                        {activity.responseTime && (
                          <span className="text-xs text-muted-foreground">
                            {activity.responseTime.toFixed(0)}ms
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Simulation Tab */}
        <TabsContent value="simulation" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Request Simulation</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Test your rate limiting rules by simulating API requests
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Simulate API Request</CardTitle>
              <CardDescription>
                Test how your rate limiting rules would handle different types of requests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client-id">Client ID</Label>
                  <Input
                    id="client-id"
                    value={simulationClientId}
                    onChange={(e) => setSimulationClientId(e.target.value)}
                    placeholder="e.g., client_123"
                  />
                </div>
                <div>
                  <Label htmlFor="method">HTTP Method</Label>
                  <Select value={simulationMethod} onValueChange={setSimulationMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="endpoint">Endpoint</Label>
                <Input
                  id="endpoint"
                  value={simulationEndpoint}
                  onChange={(e) => setSimulationEndpoint(e.target.value)}
                  placeholder="e.g., /api/users"
                />
              </div>
              <Button onClick={handleSimulateRequest} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Simulate Request
              </Button>

              {simulationResult && (
                <div className="mt-4 p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Simulation Result</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Allowed:</span>
                      <Badge variant={simulationResult.allowed ? "default" : "destructive"}>
                        {simulationResult.allowed ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining Requests:</span>
                      <span>{simulationResult.remainingRequests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reset Time:</span>
                      <span>{new Date(simulationResult.resetTime).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Applied Rule:</span>
                      <span className="font-mono">{simulationResult.ruleId}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Configuration Management</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Export and manage your rate limiting configuration
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Export Configuration</CardTitle>
              <CardDescription>
                Download your current rate limiting rules and configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleExportConfig} disabled={isLoading}>
                <Download className="mr-2 h-4 w-4" />
                Export Configuration
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reset Statistics</CardTitle>
              <CardDescription>
                Clear all collected statistics and monitoring data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-2 border rounded">
                    <span>{rule.name}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResetStats(rule.id)}
                      disabled={isLoading}
                    >
                      Reset Stats
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Rule Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Rate Limiting Rule</DialogTitle>
            <DialogDescription>
              Update the rate limiting rule configuration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Rule Name</Label>
              <Input
                id="edit-name"
                value={editRule.name}
                onChange={(e) => setEditRule({ ...editRule, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-endpoint">Endpoint Pattern</Label>
              <Input
                id="edit-endpoint"
                value={editRule.endpoint}
                onChange={(e) => setEditRule({ ...editRule, endpoint: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-method">HTTP Method</Label>
                <Select value={editRule.method} onValueChange={(value: any) => setEditRule({ ...editRule, method: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">ALL</SelectItem>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-limit">Request Limit</Label>
                <Input
                  id="edit-limit"
                  type="number"
                  value={editRule.limit}
                  onChange={(e) => setEditRule({ ...editRule, limit: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-window">Time Window</Label>
                <Select value={editRule.windowMs.toString()} onValueChange={(value) => setEditRule({ ...editRule, windowMs: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10000">10 seconds</SelectItem>
                    <SelectItem value="30000">30 seconds</SelectItem>
                    <SelectItem value="60000">1 minute</SelectItem>
                    <SelectItem value="300000">5 minutes</SelectItem>
                    <SelectItem value="900000">15 minutes</SelectItem>
                    <SelectItem value="3600000">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-strategy">Strategy</Label>
                <Select value={editRule.strategy} onValueChange={(value: any) => setEditRule({ ...editRule, strategy: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed-window">Fixed Window</SelectItem>
                    <SelectItem value="sliding-window">Sliding Window</SelectItem>
                    <SelectItem value="token-bucket">Token Bucket</SelectItem>
                    <SelectItem value="leaky-bucket">Leaky Bucket</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-enabled"
                checked={editRule.enabled}
                onCheckedChange={(checked) => setEditRule({ ...editRule, enabled: checked })}
              />
              <Label htmlFor="edit-enabled">Enable Rule</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRule} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}