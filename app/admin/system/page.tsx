"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useRealtimeAdminSystem } from "@/lib/hooks/use-realtime-admin-system";
import {
  Activity,
  Cpu,
  HardDrive,
  MemoryStick,
  Wifi,
  Database,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Zap,
  Clock,
  Users,
  BarChart3,
  Shield,
  Settings,
  Monitor,
  Globe,
  Lock,
  WifiOff,
  Radio,
} from "lucide-react";

export default function SystemPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const {
    systemMetrics,
    loading,
    error,
    isConnected,
    isRefreshing,
    lastUpdated,
    refresh,
    reconnect,
  } = useRealtimeAdminSystem({
    onError: (errorMessage) => {
      toast.error(errorMessage);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-600 bg-red-50";
      case "warn":
        return "text-yellow-600 bg-yellow-50";
      case "info":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (loading && !systemMetrics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">System Health & Monitoring</h2>
            <p className="text-muted-foreground">
              Monitor system performance, services, and security
            </p>
          </div>
          <Button disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && !systemMetrics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">System Health & Monitoring</h2>
            <p className="text-muted-foreground">
              Monitor system performance, services, and security
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Failed to load system metrics</p>
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
          <h2 className="text-2xl font-bold">System Health & Monitoring</h2>
          <p className="text-muted-foreground">
            Monitor system performance, services, and security
          </p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={refresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
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
            <span>Real-time monitoring active</span>
          </div>
          <span>Auto-refreshing every 15s</span>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Health Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemMetrics?.cpu.usage || 0}%</div>
                <Progress value={systemMetrics?.cpu.usage || 0} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {systemMetrics?.cpu.cores || 0} cores • {systemMetrics?.cpu.temperature || 0}°C
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                <MemoryStick className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemMetrics?.memory.percentage || 0}%</div>
                <Progress value={systemMetrics?.memory.percentage || 0} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {(systemMetrics?.memory.used || 0).toFixed(1)}GB / {(systemMetrics?.memory.total || 0).toFixed(1)}GB
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemMetrics?.disk.percentage || 0}%</div>
                <Progress value={systemMetrics?.disk.percentage || 0} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {(systemMetrics?.disk.used || 0).toFixed(1)}GB / {(systemMetrics?.disk.total || 0).toFixed(1)}GB
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Network I/O</CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemMetrics?.network.connections || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  ↑ {(systemMetrics?.network.upload || 0).toFixed(1)} MB/s
                </p>
                <p className="text-xs text-muted-foreground">
                  ↓ {(systemMetrics?.network.download || 0).toFixed(1)} MB/s
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Database & Services Status */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Database Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Connections</span>
                  <Badge variant="outline">{systemMetrics?.database.connections || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Queries/sec</span>
                  <Badge variant="outline">{systemMetrics?.database.queriesPerSecond || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Slow Queries</span>
                  <Badge variant={systemMetrics?.database.slowQueries ? "destructive" : "secondary"}>
                    {systemMetrics?.database.slowQueries || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Uptime</span>
                  <Badge variant="outline">{systemMetrics?.database.uptime || "N/A"}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="h-5 w-5" />
                  <span>Services Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemMetrics?.services.map((service) => (
                    <div key={service.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={getStatusColor(service.status)}>
                          {getStatusIcon(service.status)}
                        </div>
                        <span className="text-sm font-medium">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {service.responseTime}ms • {service.uptime}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Recent system notifications and warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    All systems operational. No critical issues detected.
                  </AlertDescription>
                </Alert>
                {systemMetrics?.cpu?.usage && systemMetrics.cpu.usage > 80 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      High CPU usage detected ({systemMetrics.cpu.usage}%)
                    </AlertDescription>
                  </Alert>
                )}
                {systemMetrics?.memory?.percentage && systemMetrics.memory.percentage > 85 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      High memory usage detected ({systemMetrics.memory.percentage}%)
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Users</span>
                  <Badge variant="outline">{systemMetrics?.activity.activeUsers || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Recent Logins</span>
                  <Badge variant="outline">{systemMetrics?.activity.recentLogins || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tool Sessions</span>
                  <Badge variant="outline">{systemMetrics?.activity.toolSessions || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Donations</span>
                  <Badge variant="outline">{systemMetrics?.activity.donations || 0}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">CPU</span>
                    <span className="text-sm text-muted-foreground">{systemMetrics?.cpu.usage || 0}%</span>
                  </div>
                  <Progress value={systemMetrics?.cpu.usage || 0} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Memory</span>
                    <span className="text-sm text-muted-foreground">{systemMetrics?.memory.percentage || 0}%</span>
                  </div>
                  <Progress value={systemMetrics?.memory.percentage || 0} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Disk</span>
                    <span className="text-sm text-muted-foreground">{systemMetrics?.disk.percentage || 0}%</span>
                  </div>
                  <Progress value={systemMetrics?.disk.percentage || 0} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Health</CardTitle>
              <CardDescription>Status of all system services and components</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Last Check</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemMetrics?.services.map((service) => (
                    <TableRow key={service.name}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        <div className={`flex items-center space-x-2 ${getStatusColor(service.status)}`}>
                          {getStatusIcon(service.status)}
                          <span className="capitalize">{service.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>{service.uptime}</TableCell>
                      <TableCell>{service.responseTime}ms</TableCell>
                      <TableCell>{new Date().toLocaleTimeString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemMetrics?.security.failedLogins || 0}</div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemMetrics?.security.activeSessions || 0}</div>
                <p className="text-xs text-muted-foreground">Current sessions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemMetrics?.security.blockedIPs || 0}</div>
                <p className="text-xs text-muted-foreground">IP blocks active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Scan</CardTitle>
                <Monitor className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">Last scan</div>
                <p className="text-xs text-muted-foreground">
                  {systemMetrics?.security.lastSecurityScan || "Never"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
              <CardDescription>Recent security-related activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Security systems are active. No threats detected in the last 24 hours.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>Recent system events and messages</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemMetrics?.logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getLogLevelColor(log.level)}>
                          {log.level.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{log.source}</TableCell>
                      <TableCell className="text-sm">{log.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}