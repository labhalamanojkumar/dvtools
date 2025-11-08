"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toaster";
import {
  Play,
  Save,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Upload
} from "lucide-react";

interface ApiRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  url: string;
  headers: Record<string, string>;
  body: string;
  auth: {
    type: "none" | "basic" | "bearer" | "api-key" | "oauth2";
    username: string;
    password: string;
    token: string;
    apiKey: string;
    apiKeyHeader: string;
  };
  timeout: number;
  followRedirects: boolean;
}

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  responseTime: number;
  size: number;
}

interface Assertion {
  id: string;
  type: "status" | "header" | "json" | "text" | "response_time";
  field: string;
  operator: "equals" | "contains" | "greater_than" | "less_than" | "exists" | "not_exists";
  expected: string;
  name: string;
}

interface AssertionResult {
  name: string;
  passed: boolean;
  expected: any;
  actual: any;
  message: string;
}

const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"];
const AUTH_TYPES = [
  { value: "none", label: "No Auth" },
  { value: "basic", label: "Basic Auth" },
  { value: "bearer", label: "Bearer Token" },
  { value: "api-key", label: "API Key" },
  { value: "oauth2", label: "OAuth 2.0" },
];

const ASSERTION_TYPES = [
  { value: "status", label: "Status Code" },
  { value: "header", label: "Header" },
  { value: "json", label: "JSON Field" },
  { value: "text", label: "Response Text" },
  { value: "response_time", label: "Response Time" },
];

const OPERATORS = [
  { value: "equals", label: "Equals" },
  { value: "contains", label: "Contains" },
  { value: "greater_than", label: "Greater Than" },
  { value: "less_than", label: "Less Than" },
  { value: "exists", label: "Exists" },
  { value: "not_exists", label: "Does Not Exist" },
];

export default function ApiSimulatorClient() {
  const { toast } = useToast();
  const [request, setRequest] = useState<ApiRequest>({
    method: "GET",
    url: "",
    headers: {},
    body: "",
    auth: {
      type: "none",
      username: "",
      password: "",
      token: "",
      apiKey: "",
      apiKeyHeader: "X-API-Key",
    },
    timeout: 30000,
    followRedirects: true,
  });

  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [assertions, setAssertions] = useState<Assertion[]>([]);
  const [assertionResults, setAssertionResults] = useState<AssertionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestHistory, setRequestHistory] = useState<ApiRequest[]>([]);

  const addHeader = useCallback(() => {
    const newHeaders = { ...request.headers, "": "" };
    setRequest(prev => ({ ...prev, headers: newHeaders }));
  }, [request.headers]);

  const updateHeader = useCallback((oldKey: string, newKey: string, value: string) => {
    const newHeaders = { ...request.headers };
    if (oldKey !== newKey) {
      delete newHeaders[oldKey];
    }
    if (newKey.trim()) {
      newHeaders[newKey] = value;
    }
    setRequest(prev => ({ ...prev, headers: newHeaders }));
  }, [request.headers]);

  const removeHeader = useCallback((key: string) => {
    const newHeaders = { ...request.headers };
    delete newHeaders[key];
    setRequest(prev => ({ ...prev, headers: newHeaders }));
  }, [request.headers]);

  const addAssertion = useCallback(() => {
    const newAssertion: Assertion = {
      id: Date.now().toString(),
      type: "status",
      field: "",
      operator: "equals",
      expected: "",
      name: "",
    };
    setAssertions(prev => [...prev, newAssertion]);
  }, []);

  const updateAssertion = useCallback((id: string, updates: Partial<Assertion>) => {
    setAssertions(prev => prev.map(assertion =>
      assertion.id === id ? { ...assertion, ...updates } : assertion
    ));
  }, []);

  const removeAssertion = useCallback((id: string) => {
    setAssertions(prev => prev.filter(assertion => assertion.id !== id));
  }, []);

  const sendRequest = useCallback(async () => {
    if (!request.url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResponse(null);
    setAssertionResults([]);

    try {
      const payload = {
        request: {
          ...request,
          headers: Object.fromEntries(
            Object.entries(request.headers).filter(([key]) => key.trim())
          ),
        },
        assertions: assertions.map(({ id, ...assertion }) => assertion),
      };

      const res = await fetch("/api/tools/api-simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.success) {
        setResponse(data.response);
        setAssertionResults(data.assertions);

        // Add to history
        setRequestHistory(prev => [request, ...prev.slice(0, 9)]);

        toast({
          title: "Request completed",
          description: `Response: ${data.response.status} ${data.response.statusText}`,
        });
      } else {
        setResponse(data.response);
        setAssertionResults(data.assertions);
      }
    } catch (error) {
      console.error("Request failed:", error);
      toast({
        title: "Request failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [request, assertions]);

  const loadFromHistory = useCallback((historicalRequest: ApiRequest) => {
    setRequest(historicalRequest);
  }, []);

  const formatResponseData = (data: any): string => {
    if (typeof data === "string") return data;
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  const getStatusColor = (status: number): string => {
    if (status >= 200 && status < 300) return "text-green-600";
    if (status >= 300 && status < 400) return "text-blue-600";
    if (status >= 400 && status < 500) return "text-orange-600";
    if (status >= 500) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Request Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            API Request Simulator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Method and URL */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="method">Method</Label>
              <Select
                value={request.method}
                onValueChange={(value: any) => setRequest(prev => ({ ...prev, method: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HTTP_METHODS.map(method => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://api.example.com/endpoint"
                value={request.url}
                onChange={(e) => setRequest(prev => ({ ...prev, url: e.target.value }))}
              />
            </div>
          </div>

          <Tabs defaultValue="headers" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="auth">Auth</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="headers" className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Request Headers</Label>
                <Button variant="outline" size="sm" onClick={addHeader}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Header
                </Button>
              </div>
              <div className="space-y-2">
                {Object.entries(request.headers).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <Input
                      placeholder="Header name"
                      value={key}
                      onChange={(e) => updateHeader(key, e.target.value, value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Header value"
                      value={value}
                      onChange={(e) => updateHeader(key, key, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeHeader(key)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="auth" className="space-y-4">
              <div>
                <Label htmlFor="auth-type">Authentication Type</Label>
                <Select
                  value={request.auth.type}
                  onValueChange={(value: any) => setRequest(prev => ({
                    ...prev,
                    auth: { ...prev.auth, type: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AUTH_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {request.auth.type === "basic" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={request.auth.username}
                      onChange={(e) => setRequest(prev => ({
                        ...prev,
                        auth: { ...prev.auth, username: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={request.auth.password}
                      onChange={(e) => setRequest(prev => ({
                        ...prev,
                        auth: { ...prev.auth, password: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              )}

              {(request.auth.type === "bearer" || request.auth.type === "oauth2") && (
                <div>
                  <Label htmlFor="token">Token</Label>
                  <Input
                    id="token"
                    value={request.auth.token}
                    onChange={(e) => setRequest(prev => ({
                      ...prev,
                      auth: { ...prev.auth, token: e.target.value }
                    }))}
                  />
                </div>
              )}

              {request.auth.type === "api-key" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api-key">API Key</Label>
                    <Input
                      id="api-key"
                      value={request.auth.apiKey}
                      onChange={(e) => setRequest(prev => ({
                        ...prev,
                        auth: { ...prev.auth, apiKey: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="api-key-header">Header Name</Label>
                    <Input
                      id="api-key-header"
                      value={request.auth.apiKeyHeader}
                      onChange={(e) => setRequest(prev => ({
                        ...prev,
                        auth: { ...prev.auth, apiKeyHeader: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="body" className="space-y-4">
              <div>
                <Label htmlFor="body">Request Body</Label>
                <Textarea
                  id="body"
                  placeholder="Enter JSON, XML, or plain text..."
                  value={request.body}
                  onChange={(e) => setRequest(prev => ({ ...prev, body: e.target.value }))}
                  className="min-h-[200px] font-mono"
                />
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    type="file"
                    accept=".json,.xml,.txt,.yaml,.yml"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const content = e.target?.result as string;
                          setRequest(prev => ({ ...prev, body: content }));
                          toast({
                            title: "Success",
                            description: `Loaded ${file.name}`,
                          });
                        };
                        reader.readAsText(file);
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.json,.xml,.txt,.yaml,.yml';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const content = e.target?.result as string;
                            setRequest(prev => ({ ...prev, body: content }));
                            toast({
                              title: "Success",
                              description: `Loaded ${file.name}`,
                            });
                          };
                          reader.readAsText(file);
                        }
                      };
                      input.click();
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Body File
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timeout">Timeout (ms)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={request.timeout}
                    onChange={(e) => setRequest(prev => ({
                      ...prev,
                      timeout: parseInt(e.target.value) || 30000
                    }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="follow-redirects"
                    checked={request.followRedirects}
                    onChange={(e) => setRequest(prev => ({
                      ...prev,
                      followRedirects: e.target.checked
                    }))}
                  />
                  <Label htmlFor="follow-redirects">Follow Redirects</Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2">
            <Button onClick={sendRequest} disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
            <Button variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assertions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Response Assertions
            </span>
            <Button variant="outline" size="sm" onClick={addAssertion}>
              <Plus className="h-4 w-4 mr-2" />
              Add Assertion
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assertions.map((assertion) => (
              <div key={assertion.id} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label>Assertion Name</Label>
                  <Input
                    placeholder="Optional name"
                    value={assertion.name}
                    onChange={(e) => updateAssertion(assertion.id, { name: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <Label>Type</Label>
                  <Select
                    value={assertion.type}
                    onValueChange={(value: any) => updateAssertion(assertion.id, { type: value, field: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ASSERTION_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(assertion.type === "header" || assertion.type === "json") && (
                  <div className="flex-1">
                    <Label>Field</Label>
                    <Input
                      placeholder={assertion.type === "header" ? "Content-Type" : "data.user.id"}
                      value={assertion.field}
                      onChange={(e) => updateAssertion(assertion.id, { field: e.target.value })}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Label>Operator</Label>
                  <Select
                    value={assertion.operator}
                    onValueChange={(value: any) => updateAssertion(assertion.id, { operator: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OPERATORS.map(op => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label>Expected</Label>
                  <Input
                    placeholder="Expected value"
                    value={assertion.expected}
                    onChange={(e) => updateAssertion(assertion.id, { expected: e.target.value })}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeAssertion(assertion.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Response */}
      {response && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Response
              </span>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(response.status)}>
                  {response.status} {response.statusText}
                </Badge>
                <Badge variant="outline">
                  {response.responseTime}ms
                </Badge>
                <Badge variant="outline">
                  {response.size} bytes
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="body" className="w-full">
              <TabsList>
                <TabsTrigger value="body">Response Body</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
                <TabsTrigger value="assertions">Assertions</TabsTrigger>
              </TabsList>

              <TabsContent value="body">
                <ScrollArea className="h-[400px] w-full">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {formatResponseData(response.data)}
                  </pre>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="headers">
                <ScrollArea className="h-[400px] w-full">
                  <div className="space-y-2">
                    {Object.entries(response.headers).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="font-medium">{key}:</span>
                        <span className="font-mono">{value}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="assertions">
                <div className="space-y-2">
                  {assertionResults.map((result, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      {result.passed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{result.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Expected: {result.expected}, Actual: {result.actual}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Request History */}
      {requestHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Request History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {requestHistory.map((req, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-muted"
                  onClick={() => loadFromHistory(req)}
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{req.method}</Badge>
                    <span className="text-sm font-mono truncate max-w-md">
                      {req.url}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}