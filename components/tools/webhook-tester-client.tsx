"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Link as LinkIcon,
  Copy,
  Send,
  RefreshCw,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  Eye
} from "lucide-react";

interface WebhookRequest {
  id: string;
  timestamp: string;
  method: string;
  headers: Record<string, string>;
  body: any;
  signature?: string;
  signatureValid?: boolean;
}

export default function WebhookTesterClient() {
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [webhookId, setWebhookId] = useState<string>("");
  const [requests, setRequests] = useState<WebhookRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<WebhookRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Manual test settings
  const [testPayload, setTestPayload] = useState(JSON.stringify({ event: "test", data: { message: "Hello" } }, null, 2));
  const [signatureSecret, setSignatureSecret] = useState("");
  const [signatureType, setSignatureType] = useState<"hmac-sha256" | "hmac-sha512" | "none">("hmac-sha256");

  // Replay settings
  const [replayUrl, setReplayUrl] = useState("");

  const generateWebhook = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/webhook-tester", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create" })
      });

      if (!response.ok) throw new Error("Failed to create webhook");

      const data = await response.json();
      setWebhookId(data.webhookId);
      setWebhookUrl(data.webhookUrl);
      toast.success("Webhook URL generated!");
    } catch (error) {
      console.error("Error generating webhook:", error);
      toast.error("Failed to generate webhook URL");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const copyWebhookUrl = useCallback(() => {
    if (webhookUrl) {
      navigator.clipboard.writeText(webhookUrl);
      toast.success("URL copied to clipboard!");
    }
  }, [webhookUrl]);

  const sendTestWebhook = useCallback(async () => {
    if (!webhookId) {
      toast.error("Generate a webhook URL first");
      return;
    }

    try {
      const payload = JSON.parse(testPayload);
      
      const response = await fetch("/api/tools/webhook-tester", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          webhookId,
          payload,
          signatureSecret: signatureSecret || undefined,
          signatureType: signatureType !== "none" ? signatureType : undefined
        })
      });

      if (!response.ok) throw new Error("Failed to send webhook");

      toast.success("Test webhook sent!");
      await fetchRequests();
    } catch (error) {
      console.error("Error sending webhook:", error);
      toast.error("Failed to send test webhook");
    }
  }, [webhookId, testPayload, signatureSecret, signatureType]);

  const fetchRequests = useCallback(async () => {
    if (!webhookId) return;

    try {
      const response = await fetch(`/api/tools/webhook-tester?webhookId=${webhookId}`);
      if (!response.ok) throw new Error("Failed to fetch requests");

      const data = await response.json();
      setRequests(data.requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  }, [webhookId]);

  const replayRequest = useCallback(async (request: WebhookRequest) => {
    if (!replayUrl) {
      toast.error("Enter a replay URL first");
      return;
    }

    try {
      const response = await fetch("/api/tools/webhook-tester", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "replay",
          targetUrl: replayUrl,
          payload: request.body,
          headers: request.headers
        })
      });

      if (!response.ok) throw new Error("Failed to replay request");

      const data = await response.json();
      toast.success(`Replayed to ${replayUrl} - Status: ${data.status}`);
    } catch (error) {
      console.error("Error replaying request:", error);
      toast.error("Failed to replay request");
    }
  }, [replayUrl]);

  useEffect(() => {
    if (webhookId) {
      const interval = setInterval(fetchRequests, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [webhookId, fetchRequests]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Tabs defaultValue="endpoint" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="endpoint">Endpoint</TabsTrigger>
          <TabsTrigger value="test">Send Test</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="replay">Replay</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoint" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Endpoint</CardTitle>
              <CardDescription>Generate a unique webhook URL to receive requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={generateWebhook} disabled={isLoading || !!webhookUrl} size="lg" className="w-full">
                <LinkIcon className="w-4 h-4 mr-2" />
                {webhookUrl ? "Webhook URL Generated" : "Generate Webhook URL"}
              </Button>

              {webhookUrl && (
                <div className="space-y-3">
                  <Label>Your Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input value={webhookUrl} readOnly className="font-mono text-sm" />
                    <Button onClick={copyWebhookUrl} variant="outline" size="icon">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <p className="text-sm">
                      <strong>Webhook ID:</strong> <code>{webhookId}</code>
                    </p>
                    <p className="text-sm mt-2 text-muted-foreground">
                      Use this URL in your webhook provider settings to start receiving requests.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Test Webhook</CardTitle>
              <CardDescription>Manually send a test request to your webhook</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Payload (JSON)</Label>
                <Textarea
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  className="font-mono text-sm min-h-[200px]"
                  placeholder='{"event": "test", "data": {}}'
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Signature Type</Label>
                  <Select value={signatureType} onValueChange={(v: "hmac-sha256" | "hmac-sha512" | "none") => setSignatureType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="hmac-sha256">HMAC SHA-256</SelectItem>
                      <SelectItem value="hmac-sha512">HMAC SHA-512</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Signature Secret (optional)</Label>
                  <Input
                    value={signatureSecret}
                    onChange={(e) => setSignatureSecret(e.target.value)}
                    placeholder="your-secret-key"
                    type="password"
                  />
                </div>
              </div>

              <Button onClick={sendTestWebhook} disabled={!webhookId} className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Test Webhook
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Request History</CardTitle>
                  <CardDescription>All received webhook requests</CardDescription>
                </div>
                <Button onClick={fetchRequests} variant="outline" size="sm" disabled={!webhookId}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {requests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Signature</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {new Date(request.timestamp).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.method}</Badge>
                        </TableCell>
                        <TableCell>
                          {request.signature ? (
                            request.signatureValid ? (
                              <Badge className="bg-green-500">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Valid
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="w-3 h-3 mr-1" />
                                Invalid
                              </Badge>
                            )
                          ) : (
                            <Badge variant="secondary">None</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No webhook requests received yet.</p>
                  <p className="text-sm mt-2">Send a test webhook or configure your webhook provider.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedRequest && (
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Headers</Label>
                  <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mt-2">
                    {JSON.stringify(selectedRequest.headers, null, 2)}
                  </pre>
                </div>
                <div>
                  <Label>Body</Label>
                  <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mt-2">
                    {JSON.stringify(selectedRequest.body, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="replay" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Replay Webhook</CardTitle>
              <CardDescription>Replay captured requests to a different endpoint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Target URL</Label>
                <Input
                  value={replayUrl}
                  onChange={(e) => setReplayUrl(e.target.value)}
                  placeholder="https://your-api.com/webhook"
                />
              </div>

              {selectedRequest && (
                <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                  <p className="text-sm font-medium">Selected Request</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedRequest.timestamp).toLocaleString()} - {selectedRequest.method}
                  </p>
                  <Button onClick={() => replayRequest(selectedRequest)} disabled={!replayUrl} className="w-full mt-3">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Replay Request
                  </Button>
                </div>
              )}

              {!selectedRequest && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Select a request from the &quot;Requests&quot; tab to replay it.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
