"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Play,
  Square,
  Settings,
  Globe,
  Shield,
  Activity,
  Copy,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Eye,
  EyeOff,
  Save,
  Trash2,
  ExternalLink,
  Clock,
  Users,
  BarChart3,
  Plus
} from "lucide-react";

interface Tunnel {
  id: string;
  name: string;
  provider: 'ngrok' | 'cloudflare' | 'localtunnel' | 'serveo' | 'localhost-run';
  localPort: number;
  protocol: 'http' | 'https' | 'tcp';
  publicUrl?: string;
  status: 'stopped' | 'starting' | 'running' | 'error';
  customDomain?: string;
  auth?: {
    type: 'basic' | 'bearer' | 'api-key';
    credentials: string;
  };
  createdAt: Date;
  startedAt?: Date;
  traffic: {
    requests: number;
    bytesIn: number;
    bytesOut: number;
    avgResponseTime: number;
  };
}

interface TunnelRequest {
  id: string;
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
}

const TUNNEL_PROVIDERS = [
  {
    value: 'ngrok',
    label: 'ngrok',
    description: 'Popular tunneling service with advanced features',
    requiresAuth: true,
    freeTier: true
  },
  {
    value: 'cloudflare',
    label: 'Cloudflare Tunnel',
    description: 'Secure tunneling with Cloudflare infrastructure',
    requiresAuth: true,
    freeTier: true
  },
  {
    value: 'localtunnel',
    label: 'LocalTunnel',
    description: 'Simple and free tunneling service',
    requiresAuth: false,
    freeTier: true
  },
  {
    value: 'serveo',
    label: 'Serveo',
    description: 'SSH-based tunneling service',
    requiresAuth: false,
    freeTier: true
  },
  {
    value: 'localhost-run',
    label: 'localhost.run',
    description: 'SSH-based tunneling with custom domains',
    requiresAuth: false,
    freeTier: true
  }
];

export default function DevTunnelerClient() {
  const [tunnels, setTunnels] = useState<Tunnel[]>([]);
  const [selectedTunnel, setSelectedTunnel] = useState<Tunnel | null>(null);
  const [requests, setRequests] = useState<TunnelRequest[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("tunnels");

  // New tunnel form state
  const [newTunnel, setNewTunnel] = useState({
    name: "",
    provider: "localtunnel" as Tunnel['provider'],
    localPort: 3000,
    protocol: "http" as Tunnel['protocol'],
    customDomain: "",
    authEnabled: false,
    authType: "basic" as 'basic' | 'bearer' | 'api-key',
    authCredentials: "",
  });

  // Load tunnels
  const loadTunnels = useCallback(async () => {
    try {
      const res = await fetch("/api/tools/code-formatting/dev-tunneler");
      const data = await res.json();
      if (data.success) {
        setTunnels(data.tunnels);
      }
    } catch (e: any) {
      toast.error(`Failed to load tunnels: ${e.message}`);
    }
  }, []);

  useEffect(() => {
    loadTunnels();
    // Refresh tunnels every 5 seconds
    const interval = setInterval(loadTunnels, 5000);
    return () => clearInterval(interval);
  }, [loadTunnels]);

  // Create tunnel
  const createTunnel = useCallback(async () => {
    if (!newTunnel.name.trim()) {
      toast.error("Tunnel name is required");
      return;
    }

    if (newTunnel.localPort < 1 || newTunnel.localPort > 65535) {
      toast.error("Invalid port number");
      return;
    }

    setIsCreating(true);
    try {
      const tunnelData = {
        ...newTunnel,
        auth: newTunnel.authEnabled ? {
          type: newTunnel.authType,
          credentials: newTunnel.authCredentials
        } : undefined
      };

      const res = await fetch("/api/tools/code-formatting/dev-tunneler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tunnelData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Tunnel created successfully");
        resetForm();
        loadTunnels();
      } else {
        toast.error(data.error || "Failed to create tunnel");
      }
    } catch (e: any) {
      toast.error(`Failed to create tunnel: ${e.message}`);
    } finally {
      setIsCreating(false);
    }
  }, [newTunnel, loadTunnels]);

  // Start tunnel
  const startTunnel = useCallback(async (tunnelId: string) => {
    try {
      const res = await fetch(`/api/tools/code-formatting/dev-tunneler/${tunnelId}/start`, {
        method: "POST",
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Tunnel started successfully");
        loadTunnels();
      } else {
        toast.error(data.error || "Failed to start tunnel");
      }
    } catch (e: any) {
      toast.error(`Failed to start tunnel: ${e.message}`);
    }
  }, [loadTunnels]);

  // Stop tunnel
  const stopTunnel = useCallback(async (tunnelId: string) => {
    try {
      const res = await fetch(`/api/tools/code-formatting/dev-tunneler/${tunnelId}/stop`, {
        method: "POST",
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Tunnel stopped successfully");
        loadTunnels();
      } else {
        toast.error(data.error || "Failed to stop tunnel");
      }
    } catch (e: any) {
      toast.error(`Failed to stop tunnel: ${e.message}`);
    }
  }, [loadTunnels]);

  // Delete tunnel
  const deleteTunnel = useCallback(async (tunnelId: string) => {
    if (!confirm("Are you sure you want to delete this tunnel?")) return;

    try {
      const res = await fetch(`/api/tools/code-formatting/dev-tunneler/${tunnelId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Tunnel deleted successfully");
        loadTunnels();
      } else {
        toast.error(data.error || "Failed to delete tunnel");
      }
    } catch (e: any) {
      toast.error(`Failed to delete tunnel: ${e.message}`);
    }
  }, [loadTunnels]);

  // Load tunnel requests
  const loadTunnelRequests = useCallback(async (tunnelId: string) => {
    try {
      const res = await fetch(`/api/tools/code-formatting/dev-tunneler/${tunnelId}/requests`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (e: any) {
      toast.error(`Failed to load requests: ${e.message}`);
    }
  }, []);

  // Copy URL to clipboard
  const copyUrl = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard");
    } catch (e) {
      toast.error("Failed to copy URL");
    }
  }, []);

  // Reset form
  const resetForm = () => {
    setNewTunnel({
      name: "",
      provider: "localtunnel",
      localPort: 3000,
      protocol: "http",
      customDomain: "",
      authEnabled: false,
      authType: "basic",
      authCredentials: "",
    });
  };

  // Get status color
  const getStatusColor = (status: Tunnel['status']) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'starting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Get status icon
  const getStatusIcon = (status: Tunnel['status']) => {
    switch (status) {
      case 'running': return <CheckCircle className="h-4 w-4" />;
      case 'starting': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      default: return <Square className="h-4 w-4" />;
    }
  };

  // Load sample tunnels
  const loadSampleTunnels = () => {
    const samples: Omit<Tunnel, "id" | "createdAt">[] = [
      {
        name: "React Dev Server",
        provider: "localtunnel",
        localPort: 3000,
        protocol: "http",
        status: "stopped",
        traffic: { requests: 0, bytesIn: 0, bytesOut: 0, avgResponseTime: 0 }
      },
      {
        name: "API Server",
        provider: "ngrok",
        localPort: 8000,
        protocol: "http",
        customDomain: "my-api.dev",
        status: "running",
        publicUrl: "https://my-api.dev",
        startedAt: new Date(),
        traffic: { requests: 1250, bytesIn: 256000, bytesOut: 512000, avgResponseTime: 45 }
      },
      {
        name: "Database Admin",
        provider: "cloudflare",
        localPort: 5432,
        protocol: "tcp",
        status: "stopped",
        traffic: { requests: 0, bytesIn: 0, bytesOut: 0, avgResponseTime: 0 }
      }
    ];

    const sampleTunnels: Tunnel[] = samples.map((sample, index) => ({
      ...sample,
      id: `sample-${index}`,
      createdAt: new Date(Date.now() - index * 86400000), // Days ago
    }));

    setTunnels(prev => [...sampleTunnels, ...prev]);
    toast.success("Sample tunnels loaded");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tunnels">Tunnels</TabsTrigger>
          <TabsTrigger value="create">Create Tunnel</TabsTrigger>
          <TabsTrigger value="monitoring" disabled={!selectedTunnel}>Monitoring</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tunnels" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {tunnels.length} tunnel{tunnels.length !== 1 ? 's' : ''}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={loadSampleTunnels}>
                Load Samples
              </Button>
              <Button variant="outline" onClick={loadTunnels}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {tunnels.map((tunnel) => (
              <Card key={tunnel.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(tunnel.status)}`} />
                      <div>
                        <CardTitle className="text-lg">{tunnel.name}</CardTitle>
                        <CardDescription>
                          {tunnel.provider} • localhost:{tunnel.localPort} → {tunnel.publicUrl || 'Not started'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{tunnel.protocol.toUpperCase()}</Badge>
                      <Badge variant={tunnel.status === 'running' ? 'default' : 'secondary'}>
                        {getStatusIcon(tunnel.status)}
                        <span className="ml-1">{tunnel.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Requests</p>
                      <p className="font-semibold">{tunnel.traffic.requests.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data Transfer</p>
                      <p className="font-semibold">
                        {((tunnel.traffic.bytesIn + tunnel.traffic.bytesOut) / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Response</p>
                      <p className="font-semibold">{tunnel.traffic.avgResponseTime}ms</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                      <p className="font-semibold">
                        {tunnel.startedAt
                          ? `${Math.floor((Date.now() - tunnel.startedAt.getTime()) / 1000 / 60)}m`
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {tunnel.status === 'stopped' && (
                        <Button size="sm" onClick={() => startTunnel(tunnel.id)}>
                          <Play className="w-4 h-4 mr-2" />
                          Start
                        </Button>
                      )}
                      {tunnel.status === 'running' && (
                        <Button size="sm" variant="outline" onClick={() => stopTunnel(tunnel.id)}>
                          <Square className="w-4 h-4 mr-2" />
                          Stop
                        </Button>
                      )}
                      {tunnel.publicUrl && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => copyUrl(tunnel.publicUrl!)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy URL
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => window.open(tunnel.publicUrl, '_blank')}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" onClick={() => {
                        setSelectedTunnel(tunnel);
                        loadTunnelRequests(tunnel.id);
                        setActiveTab("monitoring");
                      }}>
                        <Activity className="w-4 h-4 mr-2" />
                        Monitor
                      </Button>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => deleteTunnel(tunnel.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {tunnels.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Globe className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tunnels yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first tunnel to expose your local development server to the internet.
                </p>
                <Button onClick={() => setActiveTab("create")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Tunnel
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Tunnel</CardTitle>
              <CardDescription>
                Configure a new tunnel to expose your local development server
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tunnel-name">Tunnel Name *</Label>
                  <Input
                    id="tunnel-name"
                    placeholder="e.g., React Dev Server"
                    value={newTunnel.name}
                    onChange={(e) => setNewTunnel(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Select
                    value={newTunnel.provider}
                    onValueChange={(value: Tunnel['provider']) => setNewTunnel(prev => ({ ...prev, provider: value }))}
                  >
                    <SelectTrigger id="provider">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TUNNEL_PROVIDERS.map(provider => (
                        <SelectItem key={provider.value} value={provider.value}>
                          <div className="flex flex-col">
                            <span>{provider.label}</span>
                            <span className="text-xs text-muted-foreground">{provider.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="local-port">Local Port *</Label>
                  <Input
                    id="local-port"
                    type="number"
                    min="1"
                    max="65535"
                    value={newTunnel.localPort}
                    onChange={(e) => setNewTunnel(prev => ({ ...prev, localPort: parseInt(e.target.value) || 3000 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protocol">Protocol</Label>
                  <Select
                    value={newTunnel.protocol}
                    onValueChange={(value: Tunnel['protocol']) => setNewTunnel(prev => ({ ...prev, protocol: value }))}
                  >
                    <SelectTrigger id="protocol">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="http">HTTP</SelectItem>
                      <SelectItem value="https">HTTPS</SelectItem>
                      <SelectItem value="tcp">TCP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-domain">Custom Domain</Label>
                  <Input
                    id="custom-domain"
                    placeholder="e.g., myapp.dev"
                    value={newTunnel.customDomain}
                    onChange={(e) => setNewTunnel(prev => ({ ...prev, customDomain: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="auth-enabled"
                    checked={newTunnel.authEnabled}
                    onChange={(e) => setNewTunnel(prev => ({ ...prev, authEnabled: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="auth-enabled">Enable Authentication</Label>
                </div>

                {newTunnel.authEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-muted">
                    <div className="space-y-2">
                      <Label htmlFor="auth-type">Auth Type</Label>
                      <Select
                        value={newTunnel.authType}
                        onValueChange={(value: 'basic' | 'bearer' | 'api-key') => setNewTunnel(prev => ({ ...prev, authType: value }))}
                      >
                        <SelectTrigger id="auth-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic Auth</SelectItem>
                          <SelectItem value="bearer">Bearer Token</SelectItem>
                          <SelectItem value="api-key">API Key</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="auth-credentials">
                        {newTunnel.authType === 'basic' ? 'Username:Password' :
                         newTunnel.authType === 'bearer' ? 'Bearer Token' : 'API Key'}
                      </Label>
                      <Input
                        id="auth-credentials"
                        type={newTunnel.authType === 'basic' ? 'text' : 'password'}
                        placeholder={
                          newTunnel.authType === 'basic' ? 'user:pass' :
                          newTunnel.authType === 'bearer' ? 'token' : 'key'
                        }
                        value={newTunnel.authCredentials}
                        onChange={(e) => setNewTunnel(prev => ({ ...prev, authCredentials: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  Reset
                </Button>
                <Button onClick={createTunnel} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Create Tunnel
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          {selectedTunnel && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-6 h-6" />
                    <span>Monitoring: {selectedTunnel.name}</span>
                  </CardTitle>
                  <CardDescription>
                    Real-time traffic and request monitoring for this tunnel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Total Requests</p>
                            <p className="font-semibold">{selectedTunnel.traffic.requests}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Avg Response</p>
                            <p className="font-semibold">{selectedTunnel.traffic.avgResponseTime}ms</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Data In</p>
                            <p className="font-semibold">{(selectedTunnel.traffic.bytesIn / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center space-x-2">
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Data Out</p>
                            <p className="font-semibold">{(selectedTunnel.traffic.bytesOut / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Recent Requests</Label>
                      <Button variant="outline" size="sm" onClick={() => loadTunnelRequests(selectedTunnel.id)}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                    <div className="border rounded-lg max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Method</TableHead>
                            <TableHead>Path</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Response Time</TableHead>
                            <TableHead>Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {requests.slice(0, 50).map((req) => (
                            <TableRow key={req.id}>
                              <TableCell>
                                <Badge variant="outline" className="font-mono text-xs">
                                  {req.method}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-sm max-w-xs truncate">
                                {req.path}
                              </TableCell>
                              <TableCell>
                                <Badge variant={req.statusCode >= 400 ? "destructive" : "default"}>
                                  {req.statusCode}
                                </Badge>
                              </TableCell>
                              <TableCell>{req.responseTime}ms</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {req.timestamp.toLocaleTimeString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tunnel Provider Settings</CardTitle>
              <CardDescription>
                Configure API keys and settings for tunnel providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {TUNNEL_PROVIDERS.filter(p => p.requiresAuth).map(provider => (
                <div key={provider.value} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{provider.label}</h4>
                      <p className="text-sm text-muted-foreground">{provider.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${provider.value}-api-key`}>API Key</Label>
                    <Input
                      id={`${provider.value}-api-key`}
                      type="password"
                      placeholder={`Enter your ${provider.label} API key`}
                    />
                    <p className="text-xs text-muted-foreground">
                      Get your API key from the {provider.label} dashboard
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}