"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Plus,
  RefreshCw,
  Key,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Bell,
  Shield,
  Calendar
} from "lucide-react";

interface Secret {
  id: string;
  name: string;
  type: "api-key" | "database" | "certificate" | "oauth-token" | "ssh-key";
  lastRotated: string;
  nextRotation: string;
  status: "healthy" | "expiring-soon" | "expired";
  rotationInterval: number;
}

interface RotationLog {
  id: string;
  secretName: string;
  action: "rotated" | "failed" | "scheduled";
  timestamp: string;
  user: string;
  details: string;
}

interface Notification {
  id: string;
  secretName: string;
  type: "expiring" | "expired" | "rotated";
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export default function SecretsRotationSchedulerClient() {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [rotationLogs, setRotationLogs] = useState<RotationLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newSecretName, setNewSecretName] = useState("");
  const [newSecretType, setNewSecretType] = useState<Secret["type"]>("api-key");
  const [rotationInterval, setRotationInterval] = useState("30");
  const [isProcessing, setIsProcessing] = useState(false);

  const loadSecrets = useCallback(async () => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/secrets-rotation-scheduler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getSecrets" })
      });

      if (!response.ok) throw new Error("Failed to load secrets");

      const data = await response.json();
      setSecrets(data.secrets);
    } catch (error) {
      console.error("Load secrets error:", error);
      toast.error("Failed to load secrets");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const addSecret = useCallback(async () => {
    if (!newSecretName.trim()) {
      toast.error("Please enter a secret name");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/secrets-rotation-scheduler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addSecret",
          name: newSecretName,
          type: newSecretType,
          rotationInterval: parseInt(rotationInterval)
        })
      });

      if (!response.ok) throw new Error("Failed to add secret");

      const data = await response.json();
      setSecrets([...secrets, data.secret]);
      setNewSecretName("");
      toast.success("Secret added successfully");
    } catch (error) {
      console.error("Add secret error:", error);
      toast.error("Failed to add secret");
    } finally {
      setIsProcessing(false);
    }
  }, [newSecretName, newSecretType, rotationInterval, secrets]);

  const rotateSecret = useCallback(async (secretId: string) => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/secrets-rotation-scheduler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rotateSecret",
          secretId
        })
      });

      if (!response.ok) throw new Error("Failed to rotate secret");

      await loadSecrets();
      toast.success("Secret rotated successfully");
    } catch (error) {
      console.error("Rotate secret error:", error);
      toast.error("Failed to rotate secret");
    } finally {
      setIsProcessing(false);
    }
  }, [loadSecrets]);

  const loadRotationLogs = useCallback(async () => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/secrets-rotation-scheduler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getRotationLogs" })
      });

      if (!response.ok) throw new Error("Failed to load logs");

      const data = await response.json();
      setRotationLogs(data.logs);
    } catch (error) {
      console.error("Load logs error:", error);
      toast.error("Failed to load rotation logs");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/secrets-rotation-scheduler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getNotifications" })
      });

      if (!response.ok) throw new Error("Failed to load notifications");

      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error("Load notifications error:", error);
      toast.error("Failed to load notifications");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const getStatusBadge = (status: Secret["status"]) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Healthy</Badge>;
      case "expiring-soon":
        return <Badge className="bg-yellow-500"><AlertTriangle className="w-3 h-3 mr-1" />Expiring Soon</Badge>;
      case "expired":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Expired</Badge>;
    }
  };

  const getSecretTypeIcon = (type: Secret["type"]) => {
    return <Key className="w-4 h-4" />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Secret</CardTitle>
          <CardDescription>Register a new secret for rotation tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="secret-name">Secret Name</Label>
              <Input
                id="secret-name"
                value={newSecretName}
                onChange={(e) => setNewSecretName(e.target.value)}
                placeholder="production-api-key"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secret-type">Type</Label>
              <Select value={newSecretType} onValueChange={(v: any) => setNewSecretType(v)}>
                <SelectTrigger id="secret-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="api-key">API Key</SelectItem>
                  <SelectItem value="database">Database Password</SelectItem>
                  <SelectItem value="certificate">TLS Certificate</SelectItem>
                  <SelectItem value="oauth-token">OAuth Token</SelectItem>
                  <SelectItem value="ssh-key">SSH Key</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rotation-interval">Rotation Interval (days)</Label>
              <Select value={rotationInterval} onValueChange={setRotationInterval}>
                <SelectTrigger id="rotation-interval">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">365 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={addSecret} disabled={isProcessing} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Secret
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="secrets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="secrets">Secrets</TabsTrigger>
          <TabsTrigger value="logs">Rotation Logs</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="secrets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Managed Secrets</CardTitle>
                  <CardDescription>View and manage secret rotation schedules</CardDescription>
                </div>
                <Button onClick={loadSecrets} disabled={isProcessing} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {secrets.length > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Total Secrets</p>
                          <p className="text-2xl font-bold">{secrets.length}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Expiring Soon</p>
                          <p className="text-2xl font-bold text-yellow-600">
                            {secrets.filter(s => s.status === "expiring-soon").length}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Expired</p>
                          <p className="text-2xl font-bold text-red-600">
                            {secrets.filter(s => s.status === "expired").length}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Rotated</TableHead>
                        <TableHead>Next Rotation</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {secrets.map((secret) => (
                        <TableRow key={secret.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {getSecretTypeIcon(secret.type)}
                              {secret.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{secret.type}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(secret.status)}</TableCell>
                          <TableCell className="text-sm">{secret.lastRotated}</TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              {secret.nextRotation}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rotateSecret(secret.id)}
                              disabled={isProcessing}
                            >
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Rotate Now
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No secrets registered. Add a secret to start tracking rotations.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Rotation Audit Logs</CardTitle>
                  <CardDescription>Complete history of rotation activities</CardDescription>
                </div>
                <Button onClick={loadRotationLogs} disabled={isProcessing} variant="outline">
                  Load Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {rotationLogs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Secret</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rotationLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">{log.timestamp}</TableCell>
                        <TableCell className="font-mono text-sm">{log.secretName}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              log.action === "rotated" ? "default" :
                              log.action === "failed" ? "destructive" :
                              "secondary"
                            }
                          >
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {log.details}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No rotation logs available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Rotation reminders and alerts</CardDescription>
                </div>
                <Button onClick={loadNotifications} disabled={isProcessing} variant="outline">
                  Load Notifications
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <Alert key={notification.id}>
                      <Bell className="w-4 h-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{notification.secretName}</p>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                          </div>
                          <Badge
                            variant={
                              notification.type === "expired" ? "destructive" :
                              notification.type === "expiring" ? "secondary" :
                              "default"
                            }
                          >
                            {notification.type}
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
