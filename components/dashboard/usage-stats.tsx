"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, TrendingDown, RefreshCw, Wifi, WifiOff } from "lucide-react";

interface UsageStat {
  tool: string;
  calls: number;
  change: string;
  trend: "up" | "down";
  color: string;
}

interface MonthlyUsage {
  current: number;
  limit: number;
  percentage: number;
}

export default function UsageStats() {
  const [stats, setStats] = useState<UsageStat[]>([]);
  const [monthlyUsage, setMonthlyUsage] = useState<MonthlyUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPageVisibleRef = useRef(true);

  const fetchUsageStats = useCallback(async (showLoadingState = false) => {
    try {
      if (showLoadingState) {
        setIsRefreshing(true);
      }
      
      const response = await fetch("/api/dashboard/usage-stats", {
        cache: "no-cache",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch usage stats");
      }

      const data = await response.json();
      setStats(data.stats || []);
      setMonthlyUsage(data.monthlyUsage);
      setLastUpdated(new Date());
      setError(null);
      setIsConnected(true);
    } catch (err) {
      console.error("Error fetching usage stats:", err);
      setError(err instanceof Error ? err.message : "Failed to load usage stats");
      setIsConnected(false);
    } finally {
      if (showLoadingState) {
        setIsRefreshing(false);
      }
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    fetchUsageStats(true);
  }, [fetchUsageStats]);

  useEffect(() => {
    // Initial fetch
    fetchUsageStats();

    // Set up auto-refresh every 30 seconds
    pollIntervalRef.current = setInterval(() => {
      if (isPageVisibleRef.current) {
        fetchUsageStats();
      }
    }, 30000);

    // Handle page visibility change
    const handleVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden;
      if (!document.hidden) {
        // Refresh when page becomes visible
        fetchUsageStats();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchUsageStats]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Usage Statistics
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

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Usage Statistics
            <div className="ml-auto flex items-center gap-2">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Failed to load usage statistics</p>
            <p className="text-sm mt-2">{error}</p>
            <Button onClick={handleRefresh} className="mt-4" variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Usage Statistics
          <div className="ml-auto flex items-center gap-2">
            <Button
              onClick={handleRefresh}
              variant="ghost"
              size="sm"
              disabled={isRefreshing}
            >
              <RefreshCw 
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} 
              />
            </Button>
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
          </div>
        </CardTitle>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                <div>
                  <p className="text-sm font-medium">{stat.tool}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.calls} calls
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={stat.trend === "up" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {stat.change}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {monthlyUsage && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Monthly Usage</span>
              <span className="text-sm text-muted-foreground">
                {monthlyUsage.current} / {monthlyUsage.limit}
              </span>
            </div>
            <Progress value={monthlyUsage.percentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {monthlyUsage.percentage.toFixed(1)}% of monthly limit used
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
