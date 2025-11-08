"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/toaster";
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
}

export default function ApiKeysManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPageVisibleRef = useRef(true);
  const { toast } = useToast();

  const fetchApiKeys = useCallback(async (showLoadingState = false) => {
    try {
      if (showLoadingState) {
        setIsRefreshing(true);
      }
      
      const response = await fetch("/api/api-keys", {
        cache: "no-cache",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.apiKeys || []);
        setLastUpdated(new Date());
        setIsConnected(true);
      } else {
        setIsConnected(false);
        toast({
          title: "Error",
          description: "Failed to load API keys",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
      setIsConnected(false);
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      });
    } finally {
      if (showLoadingState) {
        setIsRefreshing(false);
      }
      setIsLoading(false);
    }
  }, [toast]);

  const handleRefresh = useCallback(() => {
    fetchApiKeys(true);
  }, [fetchApiKeys]);

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;

    try {
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh the list to get the latest data
        fetchApiKeys();
        setNewKeyName("");
        setIsCreating(false);
        toast({
          title: "Success",
          description: data.message,
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to create API key",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating API key:", error);
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    try {
      const response = await fetch(`/api/api-keys/${keyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the key from the list immediately for better UX
        setApiKeys((prev) => prev.filter((key) => key.id !== keyId));
        // Also refresh to ensure we have the latest data
        fetchApiKeys();
        toast({
          title: "Success",
          description: "API key revoked successfully",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to revoke API key",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error revoking API key:", error);
      toast({
        title: "Error",
        description: "Failed to revoke API key",
        variant: "destructive",
      });
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (key: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(keyId);
      toast({
        title: "Copied",
        description: "API key copied to clipboard",
      });
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const maskApiKey = (key: string) => {
    return `${key.substring(0, 8)}${"•".repeat(key.length - 16)}${key.substring(key.length - 8)}`;
  };

  useEffect(() => {
    // Initial fetch
    fetchApiKeys();

    // Set up auto-refresh every 60 seconds for API keys
    pollIntervalRef.current = setInterval(() => {
      if (isPageVisibleRef.current) {
        fetchApiKeys();
      }
    }, 60000);

    // Handle page visibility change
    const handleVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden;
      if (!document.hidden) {
        // Refresh when page becomes visible
        fetchApiKeys();
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
  }, [fetchApiKeys]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading API keys...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Keys
            </CardTitle>
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                {lastUpdated.toLocaleTimeString()}
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
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input
                      id="keyName"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., Development Key"
                    />
                  </div>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Make sure to copy your API key now. You won't be able
                      to see it again!
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleCreateKey}
                      disabled={!newKeyName.trim()}
                    >
                      Create Key
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreating(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {apiKeys.length === 0 ? (
          <div className="text-center py-8">
            <Key className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No API Keys</h3>
            <p className="text-muted-foreground mb-4">
              Create your first API key to start using the API.
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{apiKey.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Created {apiKey.createdAt}
                      {apiKey.lastUsedAt
                        ? ` • Last used ${apiKey.lastUsedAt}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {apiKey.expiresAt ? (
                      <Badge variant="secondary" className="text-xs">
                        Expires {apiKey.expiresAt}
                      </Badge>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 font-mono text-sm bg-muted p-2 rounded">
                    {visibleKeys.has(apiKey.id)
                      ? apiKey.key
                      : maskApiKey(apiKey.key)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                  >
                    {visibleKeys.has(apiKey.id) ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                  >
                    {copiedKey === apiKey.id ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteKey(apiKey.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">API Key Security</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Keep your API keys secure and never share them publicly</li>
            <li>
              • Regenerate keys if you suspect they've been compromised
            </li>
            <li>• Use different keys for development and production</li>
            <li>• Monitor your API usage regularly</li>
            <li>• Auto-refreshes every 60 seconds for latest status</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
