"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Users, Activity, TrendingUp, Clock, RefreshCw, Wifi, WifiOff } from "lucide-react";

interface StatsData {
  totalUsers: { value: number; change: string };
  totalToolUses: { value: number; change: string };
  popularTool: { value: string; percentage: number };
  avgSessionTime: { value: number; change: string };
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPageVisibleRef = useRef(true);

  const fetchStats = useCallback(async (showLoadingState = false) => {
    try {
      if (showLoadingState) {
        setIsRefreshing(true);
      }

      const response = await fetch("/api/admin/stats", {
        cache: "no-cache",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setStats(data);
      setLastUpdated(new Date());
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      setIsConnected(false);
      setStats(null);
    } finally {
      if (showLoadingState) {
        setIsRefreshing(false);
      }
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    fetchStats(true);
  }, [fetchStats]);

  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Set up auto-refresh every 20 seconds for admin data
    pollIntervalRef.current = setInterval(() => {
      if (isPageVisibleRef.current) {
        fetchStats();
      }
    }, 20000);

    // Handle page visibility change
    const handleVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden;
      if (!document.hidden) {
        // Refresh when page becomes visible
        fetchStats();
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
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-3 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <WifiOff className="h-5 w-5 text-red-500" />
          <span>Failed to load admin statistics</span>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry Connection
        </Button>
      </div>
    );
  }

  const statItems = [
    {
      title: "Total Users",
      value: stats.totalUsers.value.toLocaleString(),
      change: stats.totalUsers.change,
      icon: Users,
    },
    {
      title: "Total Tool Uses",
      value: stats.totalToolUses.value.toLocaleString(),
      change: stats.totalToolUses.change,
      icon: Activity,
    },
    {
      title: "Popular Tool",
      value: stats.popularTool.value,
      change: `${stats.popularTool.percentage}% of total`,
      icon: TrendingUp,
    },
    {
      title: "Avg. Session Time",
      value: `${Math.floor(stats.avgSessionTime.value / 60)}m ${stats.avgSessionTime.value % 60}s`,
      change: stats.avgSessionTime.change,
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header with refresh and connection status */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Live System Statistics</h2>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
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
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statItems.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>Auto-refreshing every 20 seconds</span>
        {!isConnected && (
          <span className="text-red-500">(Connection lost - attempting reconnect)</span>
        )}
      </div>
    </div>
  );
}
