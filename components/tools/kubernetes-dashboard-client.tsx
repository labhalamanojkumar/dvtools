"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Server,
  Box,
  Activity,
  Terminal,
  Play,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock
} from "lucide-react";

interface Pod {
  name: string;
  namespace: string;
  status: "Running" | "Pending" | "Failed" | "Succeeded" | "Unknown";
  restarts: number;
  age: string;
  node?: string;
}

interface Deployment {
  name: string;
  namespace: string;
  replicas: {
    desired: number;
    current: number;
    ready: number;
    updated: number;
  };
  status: "Healthy" | "Progressing" | "Degraded";
  age: string;
}

interface LogEntry {
  timestamp: string;
  message: string;
  level: "info" | "warn" | "error";
}

export default function KubernetesDashboardClient() {
  const [namespace, setNamespace] = useState("default");
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [pods, setPods] = useState<Pod[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedPod, setSelectedPod] = useState("");
  const [command, setCommand] = useState("");
  const [commandOutput, setCommandOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const connectCluster = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/kubernetes-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "connect" })
      });

      if (!response.ok) throw new Error("Connection failed");

      const data = await response.json();
      setNamespaces(data.namespaces);
      setIsConnected(true);
      toast.success("Connected to cluster");
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Failed to connect to cluster");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPods = useCallback(async () => {
    if (!isConnected) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/kubernetes-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "listPods",
          namespace
        })
      });

      if (!response.ok) throw new Error("Failed to load pods");

      const data = await response.json();
      setPods(data.pods);
    } catch (error) {
      console.error("Load pods error:", error);
      toast.error("Failed to load pods");
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, namespace]);

  const loadDeployments = useCallback(async () => {
    if (!isConnected) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/kubernetes-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "listDeployments",
          namespace
        })
      });

      if (!response.ok) throw new Error("Failed to load deployments");

      const data = await response.json();
      setDeployments(data.deployments);
    } catch (error) {
      console.error("Load deployments error:", error);
      toast.error("Failed to load deployments");
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, namespace]);

  const viewLogs = useCallback(async (podName?: string) => {
    const targetPod = podName || selectedPod;
    if (!targetPod) {
      toast.error("Please select a pod");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/kubernetes-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "getLogs",
          namespace,
          podName: targetPod
        })
      });

      if (!response.ok) throw new Error("Failed to get logs");

      const data = await response.json();
      setLogs(data.logs);
      toast.success("Logs loaded");
    } catch (error) {
      console.error("Get logs error:", error);
      toast.error("Failed to get logs");
    } finally {
      setIsLoading(false);
    }
  }, [namespace, selectedPod]);

  const executeCommand = useCallback(async () => {
    if (!command.trim()) {
      toast.error("Please enter a command");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/kubernetes-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "executeCommand",
          command
        })
      });

      if (!response.ok) throw new Error("Command execution failed");

      const data = await response.json();
      setCommandOutput(data.output);
      toast.success("Command executed");
    } catch (error) {
      console.error("Execute command error:", error);
      toast.error("Failed to execute command");
    } finally {
      setIsLoading(false);
    }
  }, [command]);

  useEffect(() => {
    if (isConnected) {
      loadPods();
      loadDeployments();
    }
  }, [isConnected, namespace, loadPods, loadDeployments]);

  const getPodStatusIcon = (status: Pod["status"]) => {
    switch (status) {
      case "Running":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "Failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "Succeeded":
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cluster Connection</CardTitle>
          <CardDescription>Connect to your Kubernetes cluster</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={connectCluster} disabled={isLoading || isConnected}>
              <Server className="w-4 h-4 mr-2" />
              {isConnected ? "Connected" : "Connect to Cluster"}
            </Button>
            {isConnected && (
              <>
                <Select value={namespace} onValueChange={setNamespace}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select namespace" />
                  </SelectTrigger>
                  <SelectContent>
                    {namespaces.map((ns) => (
                      <SelectItem key={ns} value={ns}>{ns}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={loadPods} variant="outline" disabled={isLoading}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </>
            )}
          </div>

          {isConnected && (
            <Alert>
              <CheckCircle2 className="w-4 h-4" />
              <AlertDescription>
                Connected to cluster • Namespace: <strong>{namespace}</strong>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <Tabs defaultValue="pods" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pods">Pods</TabsTrigger>
            <TabsTrigger value="deployments">Deployments</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="terminal">Terminal</TabsTrigger>
          </TabsList>

          <TabsContent value="pods" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pods in {namespace}</CardTitle>
                <CardDescription>View and manage pods in the selected namespace</CardDescription>
              </CardHeader>
              <CardContent>
                {pods.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Restarts</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Node</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pods.map((pod, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getPodStatusIcon(pod.status)}
                              <Badge 
                                variant={
                                  pod.status === "Running" ? "default" : 
                                  pod.status === "Failed" ? "destructive" : 
                                  "secondary"
                                }
                              >
                                {pod.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{pod.name}</TableCell>
                          <TableCell>
                            {pod.restarts > 0 ? (
                              <Badge variant="outline" className="text-orange-500">
                                {pod.restarts}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">0</span>
                            )}
                          </TableCell>
                          <TableCell>{pod.age}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{pod.node}</TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setSelectedPod(pod.name);
                                viewLogs(pod.name);
                              }}
                            >
                              View Logs
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Box className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No pods found in this namespace</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Deployments in {namespace}</CardTitle>
                <CardDescription>Monitor deployment rollout status and health</CardDescription>
              </CardHeader>
              <CardContent>
                {deployments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Replicas</TableHead>
                        <TableHead>Ready</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead>Age</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deployments.map((deployment, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">{deployment.name}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                deployment.status === "Healthy" ? "default" : 
                                deployment.status === "Degraded" ? "destructive" : 
                                "secondary"
                              }
                            >
                              {deployment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {deployment.replicas.current}/{deployment.replicas.desired}
                          </TableCell>
                          <TableCell>
                            <Badge variant={deployment.replicas.ready === deployment.replicas.desired ? "default" : "secondary"}>
                              {deployment.replicas.ready}
                            </Badge>
                          </TableCell>
                          <TableCell>{deployment.replicas.updated}</TableCell>
                          <TableCell>{deployment.age}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No deployments found in this namespace</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pod Logs</CardTitle>
                <CardDescription>Stream logs from selected pod</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Select value={selectedPod} onValueChange={setSelectedPod}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a pod" />
                    </SelectTrigger>
                    <SelectContent>
                      {pods.map((pod) => (
                        <SelectItem key={pod.name} value={pod.name}>{pod.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => viewLogs()} disabled={isLoading || !selectedPod}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Load Logs
                  </Button>
                </div>

                {logs.length > 0 ? (
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-sm max-h-[500px] overflow-y-auto">
                    {logs.map((log, index) => (
                      <div key={index} className="mb-1">
                        <span className="text-slate-400">{log.timestamp}</span>{" "}
                        <span className={
                          log.level === "error" ? "text-red-400" :
                          log.level === "warn" ? "text-yellow-400" :
                          "text-slate-200"
                        }>
                          [{log.level.toUpperCase()}]
                        </span>{" "}
                        {log.message}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground border rounded-lg">
                    <p>Select a pod and click "Load Logs" to view its output</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="terminal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Kubectl Terminal</CardTitle>
                <CardDescription>Execute kubectl commands (RBAC-controlled)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="kubectl get pods -n default"
                    onKeyDown={(e) => e.key === "Enter" && executeCommand()}
                  />
                  <Button onClick={executeCommand} disabled={isLoading}>
                    <Play className="w-4 h-4 mr-2" />
                    Execute
                  </Button>
                </div>

                {commandOutput && (
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                    {commandOutput}
                  </div>
                )}

                <Alert>
                  <Terminal className="w-4 h-4" />
                  <AlertDescription>
                    Commands are executed with your RBAC permissions. All actions are logged and auditable.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
