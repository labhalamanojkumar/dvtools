"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toaster";
import { Loader2, Database, Play, Trash2, RefreshCw, Eye, AlertCircle, CheckCircle, Clock, Zap } from "lucide-react";

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  tls?: boolean;
}

interface Job {
  id: string;
  data: any;
  opts: any;
  progress?: number;
  attemptsMade: number;
  finishedOn?: number;
  processedOn?: number;
  failedReason?: string;
  returnvalue?: any;
  stacktrace?: string[];
}

interface QueueInfo {
  name: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

export default function BackgroundJobDebuggerClient() {
  const { toast } = useToast();
  const [config, setConfig] = useState<RedisConfig>({
    host: "161.97.172.172",
    port: 6379,
    password: "87gQQOarM2IJUKqmZA2wcPM4HryGs9El9RvfW49ZKQydlGkbbCr95Xmv0yfVFRS3",
    db: 0,
    tls: true,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [queues, setQueues] = useState<QueueInfo[]>([]);
  const [selectedQueue, setSelectedQueue] = useState<string>("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobState, setJobState] = useState<"waiting" | "active" | "completed" | "failed" | "delayed">("waiting");
  const [limit, setLimit] = useState(50);

  const handleConnect = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/background-job-debugger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "list_queues",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setQueues(data.queues || []);
        setIsConnected(true);
        toast({
          title: "Connected",
          description: `Successfully connected to Redis. Found ${data.queues?.length || 0} queues.`,
        });
      } else {
        throw new Error(data.error || "Failed to connect");
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [config, toast]);

  const handleRefreshQueues = useCallback(async () => {
    if (!isConnected) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/background-job-debugger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "list_queues",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setQueues(data.queues || []);
        toast({
          title: "Refreshed",
          description: "Queue list updated.",
        });
      } else {
        throw new Error(data.error || "Failed to refresh");
      }
    } catch (error: any) {
      toast({
        title: "Refresh Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [config, isConnected, toast]);

  const handleLoadJobs = useCallback(async (queueName: string, state: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/background-job-debugger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "get_jobs",
          queueName,
          state,
          limit,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs || []);
        setSelectedQueue(queueName);
        setJobState(state as any);
        toast({
          title: "Jobs Loaded",
          description: `Found ${data.jobs?.length || 0} jobs in ${state} state.`,
        });
      } else {
        throw new Error(data.error || "Failed to load jobs");
      }
    } catch (error: any) {
      toast({
        title: "Load Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [config, limit, toast]);

  const handleViewJob = useCallback(async (queueName: string, jobId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/background-job-debugger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "get_job_details",
          queueName,
          jobId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSelectedJob(data.job);
      } else {
        throw new Error(data.error || "Failed to load job details");
      }
    } catch (error: any) {
      toast({
        title: "Load Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [config, toast]);

  const handleRetryJob = useCallback(async (queueName: string, jobId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/background-job-debugger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "retry_job",
          queueName,
          jobId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Job Retried",
          description: "Job has been moved back to the waiting queue.",
        });
        // Refresh jobs list
        await handleLoadJobs(queueName, "failed");
      } else {
        throw new Error(data.error || "Failed to retry job");
      }
    } catch (error: any) {
      toast({
        title: "Retry Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [config, toast, handleLoadJobs]);

  const handleDeleteJob = useCallback(async (queueName: string, jobId: string, state: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/background-job-debugger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "delete_job",
          queueName,
          jobId,
          state,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Job Deleted",
          description: "Job has been permanently removed.",
        });
        // Refresh jobs list
        await handleLoadJobs(queueName, state);
        if (selectedJob?.id === jobId) {
          setSelectedJob(null);
        }
      } else {
        throw new Error(data.error || "Failed to delete job");
      }
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [config, toast, handleLoadJobs, selectedJob]);

  const handleCleanQueue = useCallback(async (queueName: string, state: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/background-job-debugger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "clean_queue",
          queueName,
          state,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Queue Cleaned",
          description: `Removed ${data.cleanedCount || 0} jobs from ${state} state.`,
        });
        // Refresh queues and jobs
        await handleRefreshQueues();
        if (selectedQueue === queueName) {
          await handleLoadJobs(queueName, jobState);
        }
      } else {
        throw new Error(data.error || "Failed to clean queue");
      }
    } catch (error: any) {
      toast({
        title: "Clean Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [config, toast, handleRefreshQueues, handleLoadJobs, selectedQueue, jobState]);

  const getStateIcon = (state: string) => {
    switch (state) {
      case "waiting":
        return <Clock className="h-4 w-4" />;
      case "active":
        return <Zap className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "failed":
        return <AlertCircle className="h-4 w-4" />;
      case "delayed":
        return <Clock className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case "waiting":
        return "secondary";
      case "active":
        return "default";
      case "completed":
        return "default";
      case "failed":
        return "destructive";
      case "delayed":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Database className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Background Job Debugger</h1>
      </div>

      {/* Redis Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Redis Configuration</CardTitle>
          <CardDescription>
            Configure your Redis connection to debug background job queues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                value={config.host}
                onChange={(e) => setConfig({ ...config, host: e.target.value })}
                placeholder="localhost"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                value={config.port}
                onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })}
                placeholder="6379"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password (optional)</Label>
              <Input
                id="password"
                type="password"
                value={config.password}
                onChange={(e) => setConfig({ ...config, password: e.target.value })}
                placeholder="Redis password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="db">Database</Label>
              <Input
                id="db"
                type="number"
                value={config.db}
                onChange={(e) => setConfig({ ...config, db: parseInt(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tls"
              checked={config.tls}
              onCheckedChange={(checked) => setConfig({ ...config, tls: !!checked })}
            />
            <Label htmlFor="tls">Use TLS/SSL</Label>
          </div>
          <Button onClick={handleConnect} disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isConnected ? "Reconnect" : "Connect to Redis"}
          </Button>
        </CardContent>
      </Card>

      {isConnected && (
        <Tabs defaultValue="queues" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="queues">Queues</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="details">Job Details</TabsTrigger>
          </TabsList>

          {/* Queues Tab */}
          <TabsContent value="queues" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Queue Overview</h2>
              <Button onClick={handleRefreshQueues} disabled={isLoading} variant="outline">
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {queues.map((queue) => (
                <Card key={queue.name} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{queue.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Waiting: {queue.waiting}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        <span>Active: {queue.active}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Completed: {queue.completed}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Failed: {queue.failed}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLoadJobs(queue.name, "waiting")}
                        disabled={isLoading}
                      >
                        View Waiting
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLoadJobs(queue.name, "failed")}
                        disabled={isLoading}
                      >
                        View Failed
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            {selectedQueue ? (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">Jobs in {selectedQueue}</h2>
                    <p className="text-sm text-muted-foreground">State: {jobState}</p>
                  </div>
                  <div className="flex gap-2">
                    <Select value={jobState} onValueChange={(value) => handleLoadJobs(selectedQueue, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="waiting">Waiting</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="delayed">Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => handleLoadJobs(selectedQueue, jobState)}
                      disabled={isLoading}
                      variant="outline"
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                    {(jobState === "completed" || jobState === "failed") && (
                      <Button
                        onClick={() => handleCleanQueue(selectedQueue, jobState)}
                        disabled={isLoading}
                        variant="destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clean Queue
                      </Button>
                    )}
                  </div>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {jobs.map((job) => (
                      <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge variant={getStateColor(jobState) as any}>
                                {getStateIcon(jobState)}
                                <span className="ml-1">{jobState}</span>
                              </Badge>
                              <span className="font-mono text-sm">ID: {job.id}</span>
                              {job.attemptsMade > 0 && (
                                <Badge variant="outline">
                                  Attempts: {job.attemptsMade}
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewJob(selectedQueue, job.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {jobState === "failed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRetryJob(selectedQueue, job.id)}
                                  disabled={isLoading}
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteJob(selectedQueue, job.id, jobState)}
                                disabled={isLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {job.progress !== undefined && (
                            <div className="mt-2">
                              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                <span>Progress</span>
                                <span>{job.progress}%</span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${job.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    {jobs.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No jobs found in {jobState} state
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select a queue from the Queues tab to view jobs
              </div>
            )}
          </TabsContent>

          {/* Job Details Tab */}
          <TabsContent value="details" className="space-y-4">
            {selectedJob ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Job Details</h2>
                  <Badge variant={getStateColor(jobState) as any}>
                    {getStateIcon(jobState)}
                    <span className="ml-1">{jobState}</span>
                  </Badge>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-mono">Job ID: {selectedJob.id}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Attempts Made</Label>
                        <p className="text-sm">{selectedJob.attemptsMade}</p>
                      </div>
                      {selectedJob.progress !== undefined && (
                        <div>
                          <Label>Progress</Label>
                          <p className="text-sm">{selectedJob.progress}%</p>
                        </div>
                      )}
                      {selectedJob.processedOn && (
                        <div>
                          <Label>Processed On</Label>
                          <p className="text-sm">{new Date(selectedJob.processedOn).toLocaleString()}</p>
                        </div>
                      )}
                      {selectedJob.finishedOn && (
                        <div>
                          <Label>Finished On</Label>
                          <p className="text-sm">{new Date(selectedJob.finishedOn).toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <Label>Job Data</Label>
                      <Textarea
                        value={JSON.stringify(selectedJob.data, null, 2)}
                        readOnly
                        className="font-mono text-xs h-32"
                      />
                    </div>

                    <div>
                      <Label>Job Options</Label>
                      <Textarea
                        value={JSON.stringify(selectedJob.opts, null, 2)}
                        readOnly
                        className="font-mono text-xs h-24"
                      />
                    </div>

                    {selectedJob.returnvalue && (
                      <div>
                        <Label>Return Value</Label>
                        <Textarea
                          value={JSON.stringify(selectedJob.returnvalue, null, 2)}
                          readOnly
                          className="font-mono text-xs h-24"
                        />
                      </div>
                    )}

                    {selectedJob.failedReason && (
                      <div>
                        <Label>Failed Reason</Label>
                        <Textarea
                          value={selectedJob.failedReason}
                          readOnly
                          className="font-mono text-xs h-16"
                        />
                      </div>
                    )}

                    {selectedJob.stacktrace && selectedJob.stacktrace.length > 0 && (
                      <div>
                        <Label>Stack Trace</Label>
                        <Textarea
                          value={selectedJob.stacktrace.join("\n")}
                          readOnly
                          className="font-mono text-xs h-32"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select a job from the Jobs tab to view details
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}