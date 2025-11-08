"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRealtimeConnection } from "./use-realtime";

interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    temperature: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    upload: number;
    download: number;
    connections: number;
  };
  database: {
    connections: number;
    queriesPerSecond: number;
    slowQueries: number;
    uptime: string;
  };
  services: Array<{
    name: string;
    status: "healthy" | "warning" | "error";
    uptime: string;
    responseTime: number;
  }>;
  logs: Array<{
    id: string;
    level: "info" | "warn" | "error";
    message: string;
    timestamp: string;
    source: string;
  }>;
  security: {
    failedLogins: number;
    activeSessions: number;
    blockedIPs: number;
    lastSecurityScan: string;
  };
  activity: {
    activeUsers: number;
    totalUsers: number;
    recentLogins: number;
    toolSessions: number;
    donations: number;
  };
  timestamp: string;
}

interface UseRealtimeAdminSystemOptions {
  autoRefreshInterval?: number;
  onDataUpdate?: (data: SystemMetrics) => void;
  onError?: (error: string) => void;
}

export function useRealtimeAdminSystem({
  autoRefreshInterval = 15000, // More frequent updates for system metrics
  onDataUpdate,
  onError,
}: UseRealtimeAdminSystemOptions = {}) {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPageVisibleRef = useRef(true);

  const fetchSystemMetrics = useCallback(async (showLoadingState = false) => {
    try {
      if (showLoadingState) {
        setIsRefreshing(true);
      }
      
      const response = await fetch("/api/admin/system", {
        cache: "no-cache",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch system metrics: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setSystemMetrics(data);
      setLastUpdated(new Date());
      setError(null);
      setIsConnected(true);
      onDataUpdate?.(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch system metrics";
      console.error("Error fetching system metrics:", err);
      setError(errorMessage);
      setIsConnected(false);
      onError?.(errorMessage);
    } finally {
      if (showLoadingState) {
        setIsRefreshing(false);
      }
      setLoading(false);
    }
  }, [onDataUpdate, onError]);

  // Handle real-time messages
  const handleRealtimeMessage = useCallback((message: any) => {
    console.log("Real-time system message:", message);
    
    switch (message.type) {
      case "system_update":
        if (message.data) {
          setSystemMetrics(message.data);
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
    "admin-system",
    {
      onMessage: handleRealtimeMessage,
      onConnect: () => {
        console.log("Connected to admin system real-time channel");
        setIsConnected(true);
        setError(null);
      },
      onDisconnect: () => {
        console.log("Disconnected from admin system real-time channel");
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
    fetchSystemMetrics(true);
  }, [fetchSystemMetrics]);

  // Set up polling as fallback when real-time is not available
  useEffect(() => {
    if (!isRealtimeConnected && isPageVisibleRef.current) {
      // Initial fetch
      fetchSystemMetrics();

      // Set up polling fallback - more frequent for system metrics
      pollIntervalRef.current = setInterval(() => {
        if (isPageVisibleRef.current && !isRealtimeConnected) {
          fetchSystemMetrics();
        }
      }, autoRefreshInterval);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      };
    }
  }, [isRealtimeConnected, fetchSystemMetrics, autoRefreshInterval]);

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden;
      if (!document.hidden) {
        // Page is visible, refresh data immediately
        fetchSystemMetrics();
        // Reconnect if needed
        if (!isRealtimeConnected) {
          setTimeout(() => connect(), 500);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isRealtimeConnected, connect, fetchSystemMetrics]);

  // Initial fetch on mount
  useEffect(() => {
    fetchSystemMetrics();
  }, [fetchSystemMetrics]);

  return {
    systemMetrics,
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