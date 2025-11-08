"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { 
  Upload, 
  Plus,
  Trash2,
  Copy,
  Play,
  Server,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity,
  Link as LinkIcon,
  Eye,
  Code
} from "lucide-react";

interface MockEndpoint {
  id: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  statusCode: number;
  responseBody: string;
  responseHeaders: Record<string, string>;
  delay: number;
}

interface MockServer {
  id: string;
  name: string;
  baseUrl: string;
  endpoints: MockEndpoint[];
  createdAt: Date;
  requestCount: number;
}

interface RequestLog {
  id: string;
  timestamp: Date;
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  requestHeaders: Record<string, string>;
  requestBody: string;
  responseBody: string;
}

export default function MockServerClient() {
  const [servers, setServers] = useState<MockServer[]>([]);
  const [selectedServer, setSelectedServer] = useState<MockServer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [requestLogs, setRequestLogs] = useState<RequestLog[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state for new server
  const [serverName, setServerName] = useState("");
  const [endpoints, setEndpoints] = useState<Omit<MockEndpoint, "id">[]>([
    {
      path: "/api/users",
      method: "GET",
      statusCode: 200,
      responseBody: JSON.stringify([
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" }
      ], null, 2),
      responseHeaders: { "Content-Type": "application/json" },
      delay: 0
    }
  ]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const spec = JSON.parse(text);

      // Parse OpenAPI spec and create endpoints
      const parsedEndpoints: Omit<MockEndpoint, "id">[] = [];

      if (spec.paths) {
        for (const [path, pathItem] of Object.entries(spec.paths)) {
          const methods = ['get', 'post', 'put', 'delete', 'patch'];
          
          for (const method of methods) {
            const operation = (pathItem as any)[method];
            if (operation) {
              // Generate example response
              const response = operation.responses?.['200'] || operation.responses?.['201'];
              let responseBody = "{}";
              
              if (response?.content?.['application/json']?.example) {
                responseBody = JSON.stringify(response.content['application/json'].example, null, 2);
              } else if (response?.content?.['application/json']?.schema) {
                responseBody = JSON.stringify(generateExample(response.content['application/json'].schema), null, 2);
              }

              parsedEndpoints.push({
                path,
                method: method.toUpperCase() as any,
                statusCode: 200,
                responseBody,
                responseHeaders: { "Content-Type": "application/json" },
                delay: 0
              });
            }
          }
        }
      }

      if (parsedEndpoints.length > 0) {
        setEndpoints(parsedEndpoints);
        setServerName(spec.info?.title || "Imported API");
        toast.success(`Imported ${parsedEndpoints.length} endpoints from OpenAPI spec`);
      } else {
        toast.error("No endpoints found in OpenAPI specification");
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Failed to parse OpenAPI specification");
    }
  }, []);

  const generateExample = (schema: any): any => {
    if (!schema || typeof schema !== 'object') return null;

    switch (schema.type) {
      case 'string':
        return schema.format === 'email' ? 'user@example.com' : 'string';
      case 'number':
      case 'integer':
        return 0;
      case 'boolean':
        return true;
      case 'array':
        return schema.items ? [generateExample(schema.items)] : [];
      case 'object':
        if (!schema.properties) return {};
        const obj: Record<string, any> = {};
        for (const [key, value] of Object.entries(schema.properties)) {
          obj[key] = generateExample(value);
        }
        return obj;
      default:
        return null;
    }
  };

  const createMockServer = useCallback(async () => {
    if (!serverName.trim()) {
      toast.error("Server name is required");
      return;
    }

    if (endpoints.length === 0) {
      toast.error("At least one endpoint is required");
      return;
    }

    // Validate all endpoints have valid JSON
    for (const endpoint of endpoints) {
      try {
        JSON.parse(endpoint.responseBody);
      } catch {
        toast.error(`Invalid JSON in endpoint ${endpoint.path}`);
        return;
      }
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/mock-server", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          name: serverName,
          endpoints
        })
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(`Failed to create server: ${error.error}`);
        return;
      }

      const result = await response.json();
      setServers([...servers, result.server]);
      setSelectedServer(result.server);
      toast.success("Mock server created successfully!");
      
      // Reset form
      setServerName("");
      setEndpoints([{
        path: "/api/users",
        method: "GET",
        statusCode: 200,
        responseBody: JSON.stringify([{ id: 1, name: "Example" }], null, 2),
        responseHeaders: { "Content-Type": "application/json" },
        delay: 0
      }]);
    } catch (error) {
      console.error("Error creating server:", error);
      toast.error("Failed to create mock server");
    } finally {
      setIsProcessing(false);
    }
  }, [serverName, endpoints, servers]);

  const loadServers = useCallback(async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/tools/mock-server");
      if (response.ok) {
        const data = await response.json();
        setServers(data.servers || []);
      }
    } catch (error) {
      console.error("Error loading servers:", error);
      toast.error("Failed to load servers");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const deleteServer = useCallback(async (serverId: string) => {
    try {
      const response = await fetch(`/api/tools/mock-server?id=${serverId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setServers(servers.filter(s => s.id !== serverId));
        if (selectedServer?.id === serverId) {
          setSelectedServer(null);
        }
        toast.success("Server deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting server:", error);
      toast.error("Failed to delete server");
    }
  }, [servers, selectedServer]);

  const copyServerUrl = useCallback((url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Server URL copied to clipboard");
  }, []);

  const testEndpoint = useCallback(async (endpoint: MockEndpoint) => {
    if (!selectedServer) return;

    try {
      const url = `${selectedServer.baseUrl}${endpoint.path}`;
      const response = await fetch(url, {
        method: endpoint.method
      });

      const data = await response.text();
      toast.success(`Test successful: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.error("Test error:", error);
      toast.error("Failed to test endpoint");
    }
  }, [selectedServer]);

  const addEndpoint = () => {
    setEndpoints([...endpoints, {
      path: "/api/new",
      method: "GET",
      statusCode: 200,
      responseBody: JSON.stringify({ message: "Hello World" }, null, 2),
      responseHeaders: { "Content-Type": "application/json" },
      delay: 0
    }]);
  };

  const removeEndpoint = (index: number) => {
    setEndpoints(endpoints.filter((_, i) => i !== index));
  };

  const updateEndpoint = (index: number, field: string, value: any) => {
    const updated = [...endpoints];
    (updated[index] as any)[field] = value;
    setEndpoints(updated);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Server</TabsTrigger>
          <TabsTrigger value="servers">My Servers</TabsTrigger>
          <TabsTrigger value="logs">Request Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Mock Server</CardTitle>
              <CardDescription>
                Upload an OpenAPI spec or define custom endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json,.yaml,.yml"
                onChange={handleFileUpload}
              />

              <div className="flex gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  disabled={isProcessing}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import OpenAPI Spec
                </Button>
                <Button
                  onClick={addEndpoint}
                  variant="outline"
                  disabled={isProcessing}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Endpoint
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="server-name">Server Name</Label>
                <Input
                  id="server-name"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  placeholder="My API Mock Server"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Endpoints</Label>
                {endpoints.map((endpoint, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Endpoint {index + 1}</h4>
                        {endpoints.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEndpoint(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Method</Label>
                          <Select
                            value={endpoint.method}
                            onValueChange={(value) => updateEndpoint(index, 'method', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GET">GET</SelectItem>
                              <SelectItem value="POST">POST</SelectItem>
                              <SelectItem value="PUT">PUT</SelectItem>
                              <SelectItem value="DELETE">DELETE</SelectItem>
                              <SelectItem value="PATCH">PATCH</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Path</Label>
                          <Input
                            value={endpoint.path}
                            onChange={(e) => updateEndpoint(index, 'path', e.target.value)}
                            placeholder="/api/resource"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Status Code</Label>
                          <Input
                            type="number"
                            value={endpoint.statusCode}
                            onChange={(e) => updateEndpoint(index, 'statusCode', parseInt(e.target.value))}
                            placeholder="200"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Response Body (JSON)</Label>
                        <Textarea
                          value={endpoint.responseBody}
                          onChange={(e) => updateEndpoint(index, 'responseBody', e.target.value)}
                          placeholder='{"message": "Hello World"}'
                          className="font-mono text-sm min-h-[150px]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Response Delay (ms)</Label>
                          <Input
                            type="number"
                            value={endpoint.delay}
                            onChange={(e) => updateEndpoint(index, 'delay', parseInt(e.target.value))}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button
                onClick={createMockServer}
                disabled={isProcessing}
                className="w-full"
              >
                <Server className="w-4 h-4 mr-2" />
                {isProcessing ? "Creating..." : "Create Mock Server"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="servers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Mock Servers</CardTitle>
                  <CardDescription>Manage your active mock servers</CardDescription>
                </div>
                <Button onClick={loadServers} variant="outline" disabled={isProcessing}>
                  <Activity className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {servers.length > 0 ? (
                <div className="space-y-4">
                  {servers.map((server) => (
                    <Card key={server.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{server.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <code className="text-sm bg-muted px-2 py-1 rounded">
                                {server.baseUrl}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyServerUrl(server.baseUrl)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedServer(server)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteServer(server.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Endpoints</p>
                            <p className="font-semibold">{server.endpoints.length}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Requests</p>
                            <p className="font-semibold">{server.requestCount}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Created</p>
                            <p className="font-semibold">
                              {new Date(server.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Server className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No mock servers yet. Create your first server to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedServer && (
            <Card>
              <CardHeader>
                <CardTitle>Endpoints - {selectedServer.name}</CardTitle>
                <CardDescription>Test and manage endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Delay</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedServer.endpoints.map((endpoint) => (
                      <TableRow key={endpoint.id}>
                        <TableCell>
                          <Badge variant={
                            endpoint.method === 'GET' ? 'default' :
                            endpoint.method === 'POST' ? 'secondary' :
                            'outline'
                          }>
                            {endpoint.method}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm">{endpoint.path}</code>
                        </TableCell>
                        <TableCell>{endpoint.statusCode}</TableCell>
                        <TableCell>{endpoint.delay}ms</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => testEndpoint(endpoint)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Test
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Request Logs</CardTitle>
              <CardDescription>Monitor requests to your mock servers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Request logs will appear here when your mock server receives requests.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
