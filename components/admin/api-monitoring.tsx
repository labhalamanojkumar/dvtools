"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

interface ApiRequest {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  status: number;
  responseTime: number;
  timestamp: string;
  userAgent: string;
  ip: string;
}

interface ApiMetrics {
  totalRequests: number;
  avgResponseTime: number;
  errorRate: number;
  requestsPerMinute: number;
  topEndpoints: { endpoint: string; count: number; avgTime: number }[];
  recentRequests: ApiRequest[];
}

export function ApiMonitoring() {
  const [metrics, setMetrics] = useState<ApiMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/admin/api-metrics");
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      } else {
        console.error(
          "Failed to fetch API metrics:",
          response.status,
          response.statusText,
        );
        setMetrics(null);
      }
    } catch (error) {
      console.error("Failed to fetch API metrics:", error);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-100 text-blue-800";
      case "POST":
        return "bg-green-100 text-green-800";
      case "PUT":
        return "bg-yellow-100 text-yellow-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      case "PATCH":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-600";
    if (status >= 300 && status < 400) return "text-yellow-600";
    if (status >= 400 && status < 500) return "text-orange-600";
    return "text-red-600";
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300)
      return <CheckCircle className="h-4 w-4" />;
    if (status >= 400) return <AlertTriangle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  const formatResponseTime = (time: number) => {
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(2)}s`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            API Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            API Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Failed to load API metrics
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            API Monitoring
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? "bg-green-50 border-green-200" : ""}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`}
              />
              Auto Refresh {autoRefresh ? "ON" : "OFF"}
            </Button>
            <Button variant="outline" size="sm" onClick={fetchMetrics}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Requests</span>
            </div>
            <p className="text-2xl font-bold">
              {metrics.totalRequests.toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Avg Response Time</span>
            </div>
            <p className="text-2xl font-bold">
              {formatResponseTime(metrics.avgResponseTime)}
            </p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Error Rate</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {metrics.errorRate}%
            </p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Requests/min</span>
            </div>
            <p className="text-2xl font-bold">{metrics.requestsPerMinute}</p>
          </div>
        </div>

        {/* Top Endpoints */}
        <div>
          <h4 className="font-semibold mb-4">Top Endpoints</h4>
          <div className="space-y-3">
            {metrics.topEndpoints.map((endpoint, index) => (
              <div
                key={endpoint.endpoint}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{index + 1}</Badge>
                  <div>
                    <p className="font-medium">{endpoint.endpoint}</p>
                    <p className="text-xs text-muted-foreground">
                      {endpoint.count} requests • Avg:{" "}
                      {formatResponseTime(endpoint.avgTime)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {endpoint.count.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">requests</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Requests */}
        <div>
          <h4 className="font-semibold mb-4">Recent Requests</h4>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Method</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.recentRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <Badge className={getMethodColor(request.method)}>
                        {request.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {request.endpoint}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`flex items-center gap-2 ${getStatusColor(request.status)}`}
                      >
                        {getStatusIcon(request.status)}
                        <span className="font-semibold">{request.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          request.responseTime > 1000
                            ? "text-red-600"
                            : request.responseTime > 500
                              ? "text-yellow-600"
                              : "text-green-600"
                        }
                      >
                        {formatResponseTime(request.responseTime)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(request.timestamp).toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {request.ip}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
