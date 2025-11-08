"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRealtimeConnection } from "./use-realtime";

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalSessions: number;
    totalToolUsage: number;
    totalDonations: number;
    totalRevenue: number;
  };
  userMetrics: {
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    userRetention: number;
    averageSessionDuration: number;
  };
  toolUsage: Array<{
    toolName: string;
    usageCount: number;
    uniqueUsers: number;
    averageTime: number;
    category: string;
  }>;
  trafficSources: Array<{
    source: string;
    visits: number;
    percentage: number;
  }>;
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  geographicData: Array<{
    country: string;
    users: number;
    percentage: number;
  }>;
  revenueMetrics: {
    totalRevenue: number;
    monthlyRevenue: number;
    averageDonation: number;
    donationCount: number;
    paymentMethodBreakdown: Array<{
      method: string;
      amount: number;
      percentage: number;
    }>;
  };
  systemHealth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    activeConnections: number;
  };
  timestamp: string;
}

interface UseRealtimeAdminAnalyticsOptions {
  timeRange?: string;
  autoRefreshInterval?: number;
  onDataUpdate?: (data: AnalyticsData) => void;
  onError?: (error: string) => void;
}

export function useRealtimeAdminAnalytics({
  timeRange = "7d",
  autoRefreshInterval = 30000,
  onDataUpdate,
  onError,
}: UseRealtimeAdminAnalyticsOptions = {}) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPageVisibleRef = useRef(true);

  const fetchAnalyticsData = useCallback(async (showLoadingState = false) => {
    try {
      if (showLoadingState) {
        setIsRefreshing(true);
      }
      
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`, {
        cache: "no-cache",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setAnalyticsData(data);
      setLastUpdated(new Date());
      setError(null);
      setIsConnected(true);
      onDataUpdate?.(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch analytics data";
      console.error("Error fetching analytics data:", err);
      setError(errorMessage);
      setIsConnected(false);
      onError?.(errorMessage);
    } finally {
      if (showLoadingState) {
        setIsRefreshing(false);
      }
      setLoading(false);
    }
  }, [timeRange, onDataUpdate, onError]);

  // Handle real-time messages
  const handleRealtimeMessage = useCallback((message: any) => {
    console.log("Real-time analytics message:", message);
    
    switch (message.type) {
      case "analytics_update":
        if (message.data) {
          setAnalyticsData(message.data);
          setLastUpdated(new Date());
          setError(null);
          setIsConnected(true);
          onDataUpdate?.(message.data);
        }
        break;
      case "heartbeat":
        // Connection is alive
        setIsConnected(true);
        break;
      case "connection":
        // Initial connection established
        setIsConnected(true);
        break;
      case "error":
        console.error("Real-time error:", message.data);
        setError(message.data);
        setIsConnected(false);
        onError?.(message.data);
        break;
      default:
        console.log("Unknown message type:", message.type);
    }
  }, [onDataUpdate, onError]);

  // Set up real-time connection
  const { isConnected: isRealtimeConnected, connect, disconnect } = useRealtimeConnection(
    "admin-analytics",
    {
      onMessage: handleRealtimeMessage,
      onConnect: () => {
        console.log("Connected to admin analytics real-time channel");
        setIsConnected(true);
        setError(null);
      },
      onDisconnect: () => {
        console.log("Disconnected from admin analytics real-time channel");
        setIsConnected(false);
      },
      onError: (event) => {
        console.error("Real-time connection error:", event);
        setError("Real-time connection failed");
        setIsConnected(false);
      },
    }
  );

  // Manual refresh
  const handleRefresh = useCallback(() => {
    fetchAnalyticsData(true);
  }, [fetchAnalyticsData]);

  // Set up polling as fallback when real-time is not available
  useEffect(() => {
    if (!isRealtimeConnected && isPageVisibleRef.current) {
      // Initial fetch
      fetchAnalyticsData();

      // Set up polling fallback
      pollIntervalRef.current = setInterval(() => {
        if (isPageVisibleRef.current && !isRealtimeConnected) {
          fetchAnalyticsData();
        }
      }, autoRefreshInterval);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      };
    }
  }, [isRealtimeConnected, fetchAnalyticsData, autoRefreshInterval]);

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden;
      if (!document.hidden) {
        // Page is visible, refresh data
        fetchAnalyticsData();
        // Reconnect if needed
        if (!isRealtimeConnected) {
          setTimeout(() => connect(), 1000);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isRealtimeConnected, connect, fetchAnalyticsData]);

  // Initial fetch on mount
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  return {
    analyticsData,
    loading,
    error,
    isConnected: isRealtimeConnected || isConnected,
    isRefreshing,
    lastUpdated,
    refresh: handleRefresh,
    reconnect: connect,
    disconnect,
  };
}