"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { 
  Key,
  Copy,
  Trash2,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Shield
} from "lucide-react";

interface APIKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  quotaLimit: number;
  quotaPeriod: "daily" | "weekly" | "monthly";
  usageCount: number;
  status: "active" | "revoked" | "expired";
  createdAt: string;
  expiresAt?: string;
  metadata?: Record<string, string>;
}

export default function APIKeyManagerClient() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newKeyVisible, setNewKeyVisible] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string>("");

  // Form states
  const [keyName, setKeyName] = useState("");
  const [keyPrefix, setKeyPrefix] = useState("sk");
  const [quotaLimit, setQuotaLimit] = useState("1000");
  const [quotaPeriod, setQuotaPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [expirationDays, setExpirationDays] = useState("30");

  const fetchAPIKeys = useCallback(async () => {
    try {
      const response = await fetch("/api/tools/api-key-manager");
      if (!response.ok) throw new Error("Failed to fetch API keys");

      const data = await response.json();
      setApiKeys(data.keys);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      toast.error("Failed to fetch API keys");
    }
  }, []);

  const generateAPIKey = useCallback(async () => {
    if (!keyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }
    // client-side sanity: ensure quota is within allowed max for selected period
    const getMaxForPeriod = (p: string) => (p === "daily" ? 100 : p === "weekly" ? 700 : 3000);
    const maxAllowed = getMaxForPeriod(quotaPeriod);
    const requestedQuota = parseInt(quotaLimit || "0", 10);
    if (requestedQuota > maxAllowed) {
      toast.error(`Quota exceeds maximum for ${quotaPeriod}: ${maxAllowed.toLocaleString()}`);
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch("/api/tools/api-key-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          name: keyName,
          prefix: keyPrefix,
          quotaLimit: parseInt(quotaLimit, 10),
          quotaPeriod,
          expirationDays: parseInt(expirationDays)
        })
      });

      if (!response.ok) throw new Error("Failed to generate API key");

      const data = await response.json();
      setGeneratedKey(data.key);
      setNewKeyVisible(true);
      
      // Reset form
      setKeyName("");
      setKeyPrefix("sk");
      setQuotaLimit("1000");
      setExpirationDays("30");

      await fetchAPIKeys();
      toast.success("API key generated successfully!");
    } catch (error) {
      console.error("Error generating API key:", error);
      toast.error("Failed to generate API key");
    } finally {
      setIsGenerating(false);
    }
  }, [keyName, keyPrefix, quotaLimit, quotaPeriod, expirationDays, fetchAPIKeys]);

  const getMaxForPeriod = (p: string) => (p === "daily" ? 100 : p === "weekly" ? 700 : 3000);

  const revokeAPIKey = useCallback(async (keyId: string) => {
    try {
      const response = await fetch("/api/tools/api-key-manager", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyId })
      });

      if (!response.ok) throw new Error("Failed to revoke API key");

      await fetchAPIKeys();
      toast.success("API key revoked");
    } catch (error) {
      console.error("Error revoking API key:", error);
      toast.error("Failed to revoke API key");
    }
  }, [fetchAPIKeys]);

  const copyAPIKey = useCallback((key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard!");
  }, []);

  useEffect(() => {
    fetchAPIKeys();
  }, [fetchAPIKeys]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Key</TabsTrigger>
          <TabsTrigger value="manage">Manage Keys</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate New API Key</CardTitle>
              <CardDescription>Create a new API key with custom quota limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">Key Name *</Label>
                <Input
                  id="key-name"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="Production API Key"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="key-prefix">Key Prefix</Label>
                  <Input
                    id="key-prefix"
                    value={keyPrefix}
                    onChange={(e) => setKeyPrefix(e.target.value)}
                    placeholder="sk"
                    maxLength={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiration">Expiration (days)</Label>
                  <Input
                    id="expiration"
                    type="number"
                    value={expirationDays}
                    onChange={(e) => setExpirationDays(e.target.value)}
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quota-limit">Quota Limit</Label>
                  <Input
                    id="quota-limit"
                    type="number"
                    value={quotaLimit}
                    onChange={(e) => {
                      // accept only digits, clamp to allowed max for selected period
                      const raw = e.target.value.replace(/[^0-9]/g, "");
                      const num = raw === "" ? 0 : parseInt(raw, 10);
                      const max = getMaxForPeriod(quotaPeriod);
                      const clamped = Math.min(Math.max(num, 0), max);
                      if (num > max) {
                        toast.error(`Quota limited to ${max.toLocaleString()} for ${quotaPeriod}`);
                      }
                      setQuotaLimit(String(clamped));
                    }}
                    placeholder="1000"
                    min={0}
                    max={getMaxForPeriod(quotaPeriod)}
                  />
                  <p className="text-sm text-muted-foreground">Maximum {getMaxForPeriod(quotaPeriod).toLocaleString()} per {quotaPeriod}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quota-period">Quota Period</Label>
                  <Select value={quotaPeriod} onValueChange={(v: any) => setQuotaPeriod(v)}>
                    <SelectTrigger id="quota-period">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={generateAPIKey} disabled={isGenerating} className="w-full" size="lg">
                <Key className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate API Key"}
              </Button>
            </CardContent>
          </Card>

          {newKeyVisible && (
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <p className="font-semibold">Your new API key has been generated!</p>
                  <p className="text-sm">
                    Copy this key now as it won't be shown again for security reasons.
                  </p>
                  <div className="flex gap-2">
                    <Input value={generatedKey} readOnly className="font-mono text-sm" />
                    <Button onClick={() => copyAPIKey(generatedKey)} variant="outline" size="icon">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button onClick={() => setNewKeyVisible(false)} variant="ghost" size="sm" className="w-full">
                    I've saved my key
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys and quotas</CardDescription>
            </CardHeader>
            <CardContent>
              {apiKeys.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Quota</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{key.name}</p>
                            <p className="text-sm text-muted-foreground">{key.prefix}•••••••</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {key.status === "active" ? (
                            <Badge className="bg-green-500">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          ) : key.status === "expired" ? (
                            <Badge variant="secondary">Expired</Badge>
                          ) : (
                            <Badge variant="destructive">Revoked</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            {key.usageCount.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {key.quotaLimit.toLocaleString()} / {key.quotaPeriod}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {key.expiresAt ? (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(key.expiresAt).toLocaleDateString()}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Never</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedKey(key)}
                            >
                              View
                            </Button>
                            {key.status === "active" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => revokeAPIKey(key.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No API keys yet. Create your first key to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedKey && (
            <Card>
              <CardHeader>
                <CardTitle>Key Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="text-sm">{selectedKey.name}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <p className="text-sm capitalize">{selectedKey.status}</p>
                  </div>
                  <div>
                    <Label>Usage Count</Label>
                    <p className="text-sm">{selectedKey.usageCount.toLocaleString()} requests</p>
                  </div>
                  <div>
                    <Label>Quota</Label>
                    <p className="text-sm">{selectedKey.quotaLimit.toLocaleString()} / {selectedKey.quotaPeriod}</p>
                  </div>
                  <div>
                    <Label>Created</Label>
                    <p className="text-sm">{new Date(selectedKey.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Expires</Label>
                    <p className="text-sm">
                      {selectedKey.expiresAt ? new Date(selectedKey.expiresAt).toLocaleString() : "Never"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Analytics</CardTitle>
              <CardDescription>Track API key usage and quotas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total Keys</p>
                      <p className="text-2xl font-bold">{apiKeys.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Active Keys</p>
                      <p className="text-2xl font-bold text-green-600">
                        {apiKeys.filter(k => k.status === "active").length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total Requests</p>
                      <p className="text-2xl font-bold">
                        {apiKeys.reduce((sum, k) => sum + k.usageCount, 0).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
