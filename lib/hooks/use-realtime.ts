"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface RealtimeMessage {
  type: string;
  data: any;
  timestamp: string;
}

interface UseRealtimeConnectionOptions {
  onMessage?: (message: RealtimeMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useRealtimeConnection(
  channel: string,
  options: UseRealtimeConnectionOptions = {}
) {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("disconnected");
  const [error, setError] = useState<string | null>(null);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isPageVisibleRef = useRef(true);

  const connect = useCallback(() => {
    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      return;
    }

    setIsConnecting(true);
    setError(null);
    setConnectionStatus("connecting");

    try {
      const protocol = window.location.protocol;
      const host = window.location.host;
      const sseUrl = `${protocol}//${host}/api/realtime?channel=${encodeURIComponent(channel)}`;
      
      const eventSource = new EventSource(sseUrl);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log(`SSE connected to channel: ${channel}`);
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionStatus("connected");
        setError(null);
        reconnectAttemptsRef.current = 0;
        onConnect?.();
      };

      eventSource.onmessage = (event) => {
        try {
          const message: RealtimeMessage = JSON.parse(event.data);
          onMessage?.(message);
        } catch (err) {
          console.error("Failed to parse SSE message:", err);
        }
      };

      eventSource.onerror = (event) => {
        console.error("SSE error:", event);
        setError("SSE connection failed");
        setConnectionStatus("error");
        onError?.(event);
        
        // Attempt to reconnect if not manually closed
        if (reconnectAttemptsRef.current < maxReconnectAttempts && isPageVisibleRef.current) {
          const timeoutId = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, reconnectInterval);
          reconnectTimeoutRef.current = timeoutId;
        }
      };
    } catch (err) {
      console.error("Failed to create SSE connection:", err);
      setError("Failed to establish connection");
      setIsConnecting(false);
      setConnectionStatus("error");
    }
  }, [channel, onMessage, onConnect, onDisconnect, onError, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    setIsConnected(false);
    setIsConnecting(false);
    setConnectionStatus("disconnected");
  }, []);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden;
      
      if (document.hidden) {
        // Page is hidden, disconnect to save resources
        if (eventSourceRef.current?.readyState === EventSource.OPEN) {
          eventSourceRef.current.close();
        }
      } else {
        // Page is visible, reconnect if needed
        if (!isConnected && !isConnecting) {
          setTimeout(() => connect(), 1000);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isConnected, isConnecting, connect]);

  // Connect on mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    connectionStatus,
    error,
    connect,
    disconnect,
  };
}