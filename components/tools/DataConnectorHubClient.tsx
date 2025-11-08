'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Database, 
  Cloud, 
  Globe, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Play, 
  Pause, 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  RefreshCw,
  BarChart3,
  Activity,
  Server,
  Wifi,
  WifiOff,
  TestTube,
  Save,
  Download
} from 'lucide-react';

interface Connection {
  id: string;
  name: string;
  type: 'database' | 'api' | 'cloud' | 'filesystem';
  subtype: string;
  config: any;
  status: 'connected' | 'disconnected' | 'error' | 'connecting';
  lastSync?: Date;
  errorMessage?: string;
  metrics: {
    recordsProcessed: number;
    syncDuration: number;
    errorCount: number;
  };
}

interface SyncJob {
  id: string;
  connectionId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  startTime: Date;
  endTime?: Date;
  recordsProcessed: number;
  errors: string[];
}

const DataConnectorHubClient: React.FC = () => {
  const [activeTab, setActiveTab] = useState('connections');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [syncJobs, setSyncJobs] = useState<SyncJob[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // New connection form state
  const [newConnection, setNewConnection] = useState({
    name: '',
    type: 'database' as Connection['type'],
    subtype: '',
    config: {}
  });

  const handleCreateConnection = useCallback(async () => {
    if (!newConnection.name || !newConnection.subtype) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/tools/data-connector-hub', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConnection),
      });

      if (!response.ok) {
        throw new Error('Failed to create connection');
      }

      const result = await response.json();
      
      const connection: Connection = {
        id: result.id,
        name: newConnection.name,
        type: newConnection.type,
        subtype: newConnection.subtype,
        config: newConnection.config,
        status: 'disconnected',
        metrics: {
          recordsProcessed: 0,
          syncDuration: 0,
          errorCount: 0
        }
      };

      setConnections(prev => [...prev, connection]);
      setNewConnection({ name: '', type: 'database', subtype: '', config: {} });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating connection:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [newConnection]);

  const handleTestConnection = useCallback(async (connection: Connection) => {
    setIsProcessing(true);
    setTestResults(null);

    try {
      const response = await fetch('/api/tools/data-connector-hub/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connectionId: connection.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to test connection');
      }

      const result = await response.json();
      setTestResults(result);
      setIsTestDialogOpen(true);

      // Update connection status
      setConnections(prev => prev.map(conn => 
        conn.id === connection.id 
          ? { ...conn, status: result.success ? 'connected' : 'error', errorMessage: result.error }
          : conn
      ));
    } catch (error) {
      console.error('Error testing connection:', error);
      setTestResults({ success: false, error: 'Failed to test connection' });
      setIsTestDialogOpen(true);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleStartSync = useCallback(async (connectionId: string) => {
    setIsProcessing(true);

    try {
      const response = await fetch('/api/tools/data-connector-hub/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connectionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to start sync');
      }

      const result = await response.json();
      
      const syncJob: SyncJob = {
        id: result.jobId,
        connectionId,
        status: 'running',
        startTime: new Date(),
        recordsProcessed: 0,
        errors: []
      };

      setSyncJobs(prev => [...prev, syncJob]);

      // Update connection status
      setConnections(prev => prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, status: 'connected' as const }
          : conn
      ));
    } catch (error) {
      console.error('Error starting sync:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleStopSync = useCallback(async (jobId: string) => {
    try {
      await fetch('/api/tools/data-connector-hub/sync', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });

      setSyncJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'paused' as const, endTime: new Date() }
          : job
      ));
    } catch (error) {
      console.error('Error stopping sync:', error);
    }
  }, []);

  const handleDeleteConnection = useCallback(async (connectionId: string) => {
    try {
      await fetch('/api/tools/data-connector-hub', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connectionId }),
      });

      setConnections(prev => prev.filter(conn => conn.id !== connectionId));
      setSyncJobs(prev => prev.filter(job => job.connectionId !== connectionId));
    } catch (error) {
      console.error('Error deleting connection:', error);
    }
  }, []);

  const getConnectionIcon = (type: Connection['type'], subtype: string) => {
    switch (type) {
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'api':
        return <Globe className="w-4 h-4" />;
      case 'cloud':
        return <Cloud className="w-4 h-4" />;
      case 'filesystem':
        return <Server className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: Connection['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'connecting':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: Connection['status']) => {
    const variants = {
      connected: 'default',
      connecting: 'secondary',
      error: 'destructive',
      disconnected: 'outline'
    } as const;

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Advanced Data Connector Hub
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Professional data integration platform for connecting multiple data sources. 
          Manage connections, monitor synchronization, and transform data in real-time.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Database className="w-3 h-3" />
            Database Support
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            API Integration
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Cloud className="w-3 h-3" />
            Cloud Storage
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Real-time Sync
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            Monitoring
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            Analytics
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="sync" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync Jobs
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Data Connections</h2>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Connection
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Connection</DialogTitle>
                  <DialogDescription>
                    Configure a new data source connection
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Connection Name</Label>
                      <Input
                        id="name"
                        value={newConnection.name}
                        onChange={(e) => setNewConnection(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="My Database Connection"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Connection Type</Label>
                      <Select 
                        value={newConnection.type}
                        onValueChange={(value: Connection['type']) => setNewConnection(prev => ({ ...prev, type: value, subtype: '' }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="database">Database</SelectItem>
                          <SelectItem value="api">REST API</SelectItem>
                          <SelectItem value="cloud">Cloud Storage</SelectItem>
                          <SelectItem value="filesystem">File System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subtype">Data Source</Label>
                    <Select 
                      value={newConnection.subtype}
                      onValueChange={(value) => setNewConnection(prev => ({ ...prev, subtype: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select data source" />
                      </SelectTrigger>
                      <SelectContent>
                        {newConnection.type === 'database' && (
                          <>
                            <SelectItem value="mysql">MySQL</SelectItem>
                            <SelectItem value="postgresql">PostgreSQL</SelectItem>
                            <SelectItem value="mongodb">MongoDB</SelectItem>
                            <SelectItem value="sqlserver">SQL Server</SelectItem>
                            <SelectItem value="oracle">Oracle</SelectItem>
                          </>
                        )}
                        {newConnection.type === 'api' && (
                          <>
                            <SelectItem value="rest">REST API</SelectItem>
                            <SelectItem value="graphql">GraphQL</SelectItem>
                            <SelectItem value="soap">SOAP API</SelectItem>
                          </>
                        )}
                        {newConnection.type === 'cloud' && (
                          <>
                            <SelectItem value="aws-s3">AWS S3</SelectItem>
                            <SelectItem value="gcp-storage">Google Cloud Storage</SelectItem>
                            <SelectItem value="azure-blob">Azure Blob Storage</SelectItem>
                          </>
                        )}
                        {newConnection.type === 'filesystem' && (
                          <>
                            <SelectItem value="local">Local File System</SelectItem>
                            <SelectItem value="ftp">FTP/SFTP</SelectItem>
                            <SelectItem value="hdfs">HDFS</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Connection-specific configuration */}
                  {newConnection.subtype && (
                    <div className="space-y-4">
                      <Separator />
                      <h3 className="text-lg font-semibold">Connection Configuration</h3>
                      
                      {newConnection.type === 'database' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Host</Label>
                            <Input placeholder="localhost" />
                          </div>
                          <div>
                            <Label>Port</Label>
                            <Input placeholder="3306" />
                          </div>
                          <div>
                            <Label>Database Name</Label>
                            <Input placeholder="my_database" />
                          </div>
                          <div>
                            <Label>Username</Label>
                            <Input placeholder="username" />
                          </div>
                          <div className="col-span-2">
                            <Label>Password</Label>
                            <Input type="password" placeholder="password" />
                          </div>
                        </div>
                      )}

                      {newConnection.type === 'api' && (
                        <div className="space-y-4">
                          <div>
                            <Label>Base URL</Label>
                            <Input placeholder="https://api.example.com" />
                          </div>
                          <div>
                            <Label>Authentication Type</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select auth type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="basic">Basic Auth</SelectItem>
                                <SelectItem value="bearer">Bearer Token</SelectItem>
                                <SelectItem value="apikey">API Key</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateConnection} disabled={isProcessing}>
                    Create Connection
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {connections.map((connection) => (
              <Card key={connection.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getConnectionIcon(connection.type, connection.subtype)}
                      <div>
                        <CardTitle className="text-lg">{connection.name}</CardTitle>
                        <CardDescription>
                          {connection.subtype.toUpperCase()} • {connection.type}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(connection.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Records: {connection.metrics.recordsProcessed.toLocaleString()}</span>
                      <span>Errors: {connection.metrics.errorCount}</span>
                      {connection.lastSync && (
                        <span>Last Sync: {connection.lastSync.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTestConnection(connection)}
                        disabled={isProcessing}
                      >
                        <TestTube className="w-4 h-4 mr-1" />
                        Test
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStartSync(connection.id)}
                        disabled={connection.status === 'connecting' || isProcessing}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Sync
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteConnection(connection.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {connection.errorMessage && (
                    <Alert className="mt-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Connection Error</AlertTitle>
                      <AlertDescription>{connection.errorMessage}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}

            {connections.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Database className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Connections Yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Create your first data connection to get started with data integration.
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Connection
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Active Sync Jobs
              </CardTitle>
              <CardDescription>
                Monitor and manage data synchronization jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Connection</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {syncJobs.map((job) => {
                      const connection = connections.find(c => c.id === job.connectionId);
                      return (
                        <TableRow key={job.id}>
                          <TableCell>{connection?.name || 'Unknown'}</TableCell>
                          <TableCell>
                            <Badge variant={
                              job.status === 'running' ? 'default' :
                              job.status === 'completed' ? 'secondary' :
                              job.status === 'failed' ? 'destructive' : 'outline'
                            }>
                              {job.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{job.startTime.toLocaleString()}</TableCell>
                          <TableCell>{job.recordsProcessed.toLocaleString()}</TableCell>
                          <TableCell>
                            {job.status === 'running' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleStopSync(job.id)}
                              >
                                <Pause className="w-4 h-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{connections.length}</div>
                <p className="text-xs text-muted-foreground">
                  {connections.filter(c => c.status === 'connected').length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Sync Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {syncJobs.filter(j => j.status === 'running').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {syncJobs.filter(j => j.status === 'completed').length} completed today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {connections.reduce((sum, conn) => sum + conn.metrics.recordsProcessed, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Processed across all connections
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {connections.length > 0 
                    ? Math.round((connections.reduce((sum, conn) => sum + conn.metrics.errorCount, 0) / 
                        Math.max(connections.reduce((sum, conn) => sum + conn.metrics.recordsProcessed, 0), 1)) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Average across connections
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Connection Health</CardTitle>
              <CardDescription>Real-time status of all connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connections.map((connection) => (
                  <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getConnectionIcon(connection.type, connection.subtype)}
                      <div>
                        <p className="font-medium">{connection.name}</p>
                        <p className="text-sm text-muted-foreground">{connection.subtype}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(connection.status)}
                      <div className="text-right text-sm">
                        <p>{connection.metrics.recordsProcessed} records</p>
                        <p className="text-muted-foreground">
                          {connection.lastSync 
                            ? `${Math.round((Date.now() - connection.lastSync.getTime()) / 1000 / 60)}m ago`
                            : 'Never synced'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
              <CardDescription>Configure default settings for all connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Default Sync Interval</Label>
                  <Select defaultValue="5">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="360">6 hours</SelectItem>
                      <SelectItem value="1440">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Max Retry Attempts</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Notification Settings</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="email-notifications" defaultChecked />
                    <Label htmlFor="email-notifications">Email notifications for failures</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="slack-notifications" />
                    <Label htmlFor="slack-notifications">Slack notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="webhook-notifications" />
                    <Label htmlFor="webhook-notifications">Webhook notifications</Label>
                  </div>
                </div>
              </div>

              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Connection Dialog */}
      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connection Test Results</DialogTitle>
            <DialogDescription>
              Results of the connection test
            </DialogDescription>
          </DialogHeader>
          {testResults && (
            <div className="space-y-4">
              <Alert variant={testResults.success ? 'default' : 'destructive'}>
                {testResults.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {testResults.success ? 'Connection Successful' : 'Connection Failed'}
                </AlertTitle>
                <AlertDescription>
                  {testResults.success ? 'The connection was established successfully.' : testResults.error}
                </AlertDescription>
              </Alert>

              {testResults.details && (
                <div>
                  <h4 className="font-semibold mb-2">Test Details</h4>
                  <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                    {JSON.stringify(testResults.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataConnectorHubClient;
