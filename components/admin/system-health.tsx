"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: string;
  status: "healthy" | "warning" | "critical";
  services: {
    name: string;
    status: "running" | "stopped" | "error";
    uptime: string;
  }[];
}

export function SystemHealth() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in a real app, this would come from system monitoring APIs
    const mockMetrics: SystemMetrics = {
      cpu: 45,
      memory: 67,
      disk: 23,
      network: 12,
      uptime: "7 days, 14 hours",
      status: "healthy",
      services: [
        { name: "Web Server", status: "running", uptime: "7d 14h" },
        { name: "Database", status: "running", uptime: "7d 14h" },
        { name: "Cache", status: "running", uptime: "7d 14h" },
        { name: "API Gateway", status: "running", uptime: "7d 14h" },
        { name: "Background Jobs", status: "running", uptime: "7d 14h" },
        { name: "Monitoring", status: "error", uptime: "2h 30m" },
      ],
    };

    setTimeout(() => {
      setMetrics(mockMetrics);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "running":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "critical":
      case "error":
      case "stopped":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "running":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "critical":
      case "error":
      case "stopped":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  // (previously declared helper removed as it was unused)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
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
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Failed to load system metrics
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
            System Health
          </CardTitle>
          <Badge className={`${getStatusColor(metrics.status)} bg-transparent`}>
            {getStatusIcon(metrics.status)}
            <span className="ml-1 capitalize">{metrics.status}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">CPU</span>
            </div>
            <Progress value={metrics.cpu} className="h-2" />
            <span className="text-xs text-muted-foreground">
              {metrics.cpu}%
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Memory</span>
            </div>
            <Progress value={metrics.memory} className="h-2" />
            <span className="text-xs text-muted-foreground">
              {metrics.memory}%
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Disk</span>
            </div>
            <Progress value={metrics.disk} className="h-2" />
            <span className="text-xs text-muted-foreground">
              {metrics.disk}%
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Network</span>
            </div>
            <Progress value={metrics.network} className="h-2" />
            <span className="text-xs text-muted-foreground">
              {metrics.network}%
            </span>
          </div>
        </div>

        {/* System Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">System Uptime</h4>
            <p className="text-2xl font-bold text-primary">{metrics.uptime}</p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Active Services</h4>
            <p className="text-2xl font-bold text-primary">
              {metrics.services.filter((s) => s.status === "running").length}/
              {metrics.services.length}
            </p>
          </div>
        </div>

        {/* Services Status */}
        <div>
          <h4 className="font-semibold mb-4">Service Status</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {metrics.services.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={getStatusColor(service.status)}>
                    {getStatusIcon(service.status)}
                  </div>
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Uptime: {service.uptime}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={getStatusColor(service.status)}
                >
                  {service.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
