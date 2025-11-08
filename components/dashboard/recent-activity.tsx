"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, FileText, Code, Key, Download, Database, Zap, Image, Palette, Shield, Globe, CheckCircle, Activity, RefreshCw, Wifi, WifiOff } from "lucide-react";

interface Activity {
  id: string;
  action: string;
  tool: string;
  timestamp: string;
  icon: string;
  color: string;
}

const iconMap = {
  FileText,
  Code,
  Key,
  Download,
  Database,
  Zap,
  Image,
  Palette,
  Shield,
  Globe,
  CheckCircle,
  Activity,
};

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPageVisibleRef = useRef(true);

  const fetchRecentActivity = useCallback(async (showLoadingState = false) => {
    try {
      if (showLoadingState) {
        setIsRefreshing(true);
      }
      
      const response = await fetch("/api/dashboard/recent-activity", {
        cache: "no-cache",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recent activity");
      }

      const data = await response.json();
      setActivities(data.activities || []);
      setLastUpdated(new Date());
      setError(null);
      setIsConnected(true);
    } catch (err) {
      console.error("Error fetching recent activity:", err);
      setError(err instanceof Error ? err.message : "Failed to load recent activity");
      setIsConnected(false);
    } finally {
      if (showLoadingState) {
        setIsRefreshing(false);
      }
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    fetchRecentActivity(true);
  }, [fetchRecentActivity]);

  useEffect(() => {
    // Initial fetch
    fetchRecentActivity();

    // Set up auto-refresh every 15 seconds (more frequent for recent activity)
    pollIntervalRef.current = setInterval(() => {
      if (isPageVisibleRef.current) {
        fetchRecentActivity();
      }
    }, 15000);

    // Handle page visibility change
    const handleVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden;
      if (!document.hidden) {
        // Refresh when page becomes visible
        fetchRecentActivity();
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
  }, [fetchRecentActivity]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-muted rounded w-1/2"></div>
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
            <Clock className="h-5 w-5" />
            Recent Activity
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
            <p>Failed to load recent activity</p>
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
          <Clock className="h-5 w-5" />
          Recent Activity
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
          {activities.map((activity) => {
            const IconComponent = iconMap[activity.icon as keyof typeof iconMap] || Activity;

            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-1 rounded ${activity.color} bg-opacity-10`}>
                  <IconComponent className={`h-3 w-3 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {activity.tool}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Showing last {activities.length} activities • Auto-refreshing every 15s
          </p>
        </div>
      </CardContent>
    </Card>
  );
}