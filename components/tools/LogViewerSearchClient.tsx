'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/toaster';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Eye,
  BarChart3,
  Settings,
  RefreshCw,
  Search,
  Filter,
  Download,
  AlertCircle,
  Info,
  AlertTriangle,
  Bug,
  Zap,
  Clock,
  Server,
  Database,
  Globe,
  Smartphone,
  Monitor,
  ChevronLeft,
  ChevronRight,
  Plus,
  Upload,
  FileText,
  Code,
  FileJson,
  FileSpreadsheet,
  File
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  category: string;
  message: string;
  source: string;
  metadata?: any;
}

interface LogStats {
  total: number;
  byLevel: Record<string, number>;
  byCategory: Record<string, number>;
  bySource: Record<string, number>;
  timeRange: {
    start: string;
    end: string;
  };
}

interface LogResponse {
  logs: LogEntry[];
  stats: LogStats;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export default function LogViewerSearchClient() {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'viewer' | 'analytics' | 'settings'>('viewer');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, limit: 50, offset: 0, hasMore: false });

  // Filter states
  const [filters, setFilters] = useState({
    level: 'ALL',
    category: '',
    source: '',
    query: '',
    startDate: '',
    endDate: ''
  });

  // File upload states
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFormat, setUploadFormat] = useState<'json' | 'csv' | 'txt' | 'xml' | 'log'>('json');
  const [uploadText, setUploadText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Auto-refresh settings
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  // File upload functions
  const handleFileUpload = async () => {
    if (!uploadFile && !uploadText.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please select a file or enter text data',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let parsedData: any[] = [];

      if (uploadFile) {
        // Parse file based on format
        const fileContent = await uploadFile.text();
        parsedData = parseFileContent(fileContent, uploadFormat);
      } else {
        // Parse text input
        parsedData = parseFileContent(uploadText, uploadFormat);
      }

      // Upload parsed data to API
      const response = await fetch('/api/tools/log-viewer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs: parsedData,
          source: 'upload',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload logs');
      }

      const result = await response.json();

      // Refresh logs
      await fetchLogs();

      toast({
        title: 'Success',
        description: `Successfully uploaded ${parsedData.length} log entries`,
      });

      // Reset upload state
      setIsUploadDialogOpen(false);
      setUploadFile(null);
      setUploadText('');
      setUploadProgress(100);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload logs. Please check the file format and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const parseFileContent = (content: string, format: string): any[] => {
    try {
      switch (format) {
        case 'json':
          const jsonData = JSON.parse(content);
          return Array.isArray(jsonData) ? jsonData : [jsonData];

        case 'csv':
          return parseCSV(content);

        case 'xml':
          return parseXML(content);

        case 'txt':
        case 'log':
          return parseTextLogs(content);

        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error';
      throw new Error(`Failed to parse ${format.toUpperCase()} content: ${errorMessage}`);
    }
  };

  const parseCSV = (content: string): any[] => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1);

    return rows.map((row, index) => {
      const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
      const log: any = {
        id: `csv-${Date.now()}-${index}`,
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: '',
        source: 'csv-upload',
      };

      headers.forEach((header, i) => {
        if (header.toLowerCase().includes('timestamp') || header.toLowerCase().includes('time')) {
          log.timestamp = values[i] || log.timestamp;
        } else if (header.toLowerCase().includes('level') || header.toLowerCase().includes('severity')) {
          log.level = values[i] || log.level;
        } else if (header.toLowerCase().includes('message') || header.toLowerCase().includes('content')) {
          log.message = values[i] || '';
        } else {
          log[header.toLowerCase()] = values[i];
        }
      });

      if (!log.message) {
        log.message = values.join(' ');
      }

      return log;
    });
  };

  const parseXML = (content: string): any[] => {
    // Simple XML parsing for log entries
    const logs: any[] = [];
    const logRegex = /<log[^>]*>(.*?)<\/log>/gs;
    const attrRegex = /(\w+)="([^"]*)"/g;

    let match;
    let index = 0;
    while ((match = logRegex.exec(content)) !== null) {
      const logContent = match[1];
      const log: any = {
        id: `xml-${Date.now()}-${index++}`,
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: logContent.trim(),
        source: 'xml-upload',
      };

      // Extract attributes from log tag
      const attrMatch = match[0].match(attrRegex);
      if (attrMatch) {
        attrMatch.forEach(attr => {
          const [, key, value] = attr.match(/(\w+)="([^"]*)"/) || [];
          if (key && value) {
            if (key.toLowerCase().includes('timestamp') || key.toLowerCase().includes('time')) {
              log.timestamp = value;
            } else if (key.toLowerCase().includes('level') || key.toLowerCase().includes('severity')) {
              log.level = value;
            } else {
              log[key.toLowerCase()] = value;
            }
          }
        });
      }

      logs.push(log);
    }

    return logs;
  };

  const parseTextLogs = (content: string): any[] => {
    const lines = content.split('\n').filter(line => line.trim());
    return lines.map((line, index) => {
      // Try to extract timestamp, level, and message from common log formats
      const timestampMatch = line.match(/\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/);
      const levelMatch = line.match(/\b(DEBUG|INFO|WARN|ERROR|FATAL)\b/i);
      const timestamp = timestampMatch ? timestampMatch[0] : new Date().toISOString();
      const level = levelMatch ? levelMatch[0].toUpperCase() : 'INFO';
      const message = line.replace(timestampMatch?.[0] || '', '').replace(levelMatch?.[0] || '', '').trim();

      return {
        id: `text-${Date.now()}-${index}`,
        timestamp,
        level,
        message: message || line,
        source: 'text-upload',
      };
    });
  };

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.level !== 'ALL') params.append('level', filters.level);
      if (filters.category) params.append('category', filters.category);
      if (filters.source) params.append('source', filters.source);
      if (filters.query) params.append('query', filters.query);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('limit', pagination.limit.toString());
      params.append('offset', pagination.offset.toString());

      const response = await fetch(`/api/tools/log-viewer?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }

      const data: LogResponse = await response.json();
      setLogs(data.logs);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch logs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit, pagination.offset, toast]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchLogs, refreshInterval * 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, fetchLogs]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'DEBUG': return <Bug className="w-4 h-4 text-blue-500" />;
      case 'INFO': return <Info className="w-4 h-4 text-green-500" />;
      case 'WARN': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'ERROR': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'CRITICAL': return <Zap className="w-4 h-4 text-purple-500" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'DEBUG': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'INFO': return 'bg-green-100 text-green-800 border-green-200';
      case 'WARN': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ERROR': return 'bg-red-100 text-red-800 border-red-200';
      case 'CRITICAL': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSourceIcon = (source: string) => {
    if (source.includes('nginx') || source.includes('apache')) return <Globe className="w-4 h-4" />;
    if (source.includes('express') || source.includes('api')) return <Server className="w-4 h-4" />;
    if (source.includes('redis') || source.includes('database')) return <Database className="w-4 h-4" />;
    if (source.includes('mobile')) return <Smartphone className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Category', 'Source', 'Message', 'Metadata'],
      ...logs.map(log => [
        log.timestamp,
        log.level,
        log.category,
        log.source,
        log.message,
        JSON.stringify(log.metadata || {})
      ])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export successful',
      description: 'Logs exported as CSV',
    });
  };

  const addSampleLog = async () => {
    const sampleLogs = [
      { level: 'INFO', category: 'web', source: 'nginx', message: 'New user session started' },
      { level: 'ERROR', category: 'api', source: 'express', message: 'API rate limit exceeded' },
      { level: 'WARN', category: 'auth', source: 'jwt-service', message: 'Token refresh failed' },
      { level: 'DEBUG', category: 'cache', source: 'redis', message: 'Cache hit for user profile' },
      { level: 'CRITICAL', category: 'payment', source: 'stripe', message: 'Payment gateway timeout' }
    ];

    const randomLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];

    try {
      const response = await fetch('/api/tools/log-viewer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...randomLog,
          metadata: { userId: Math.floor(Math.random() * 10000), sessionId: `sess_${Date.now()}` }
        })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Sample log added',
        });
        fetchLogs();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add sample log',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* SEO-Optimized Header */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Advanced Log Viewer & Search Tool
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Professional centralized logging system with advanced search capabilities, real-time filtering,
          error grouping, analytics, and file upload support. Upload logs in JSON, CSV, XML, TXT, or LOG formats
          for immediate processing and analysis. Monitor application logs, track errors, analyze system behavior,
          and troubleshoot issues with powerful log management tools.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Badge variant="secondary">Real-time Monitoring</Badge>
          <Badge variant="secondary">Advanced Filtering</Badge>
          <Badge variant="secondary">Regex Search</Badge>
          <Badge variant="secondary">Export Capabilities</Badge>
          <Badge variant="secondary">Error Analytics</Badge>
          <Badge variant="secondary">File Upload Support</Badge>
          <Badge variant="secondary">Multi-Format Parsing</Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="viewer" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Log Viewer
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="viewer" className="space-y-4">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={fetchLogs} disabled={loading} variant="outline">
              {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Refresh
            </Button>
            <Button onClick={addSampleLog} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Sample Log
            </Button>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logs
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload Log Data</DialogTitle>
                  <DialogDescription>
                    Upload log files or paste log data in various formats (JSON, CSV, XML, TXT, LOG)
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Format Selection */}
                  <div className="space-y-2">
                    <Label>File Format</Label>
                    <Select value={uploadFormat} onValueChange={(value: any) => setUploadFormat(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">
                          <div className="flex items-center gap-2">
                            <FileJson className="w-4 h-4" />
                            JSON
                          </div>
                        </SelectItem>
                        <SelectItem value="csv">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="w-4 h-4" />
                            CSV
                          </div>
                        </SelectItem>
                        <SelectItem value="xml">
                          <div className="flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            XML
                          </div>
                        </SelectItem>
                        <SelectItem value="txt">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Text/Log
                          </div>
                        </SelectItem>
                        <SelectItem value="log">
                          <div className="flex items-center gap-2">
                            <File className="w-4 h-4" />
                            Log File
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label>Upload File</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors">
                      <input
                        type="file"
                        accept={uploadFormat === 'json' ? '.json' : uploadFormat === 'csv' ? '.csv' : uploadFormat === 'xml' ? '.xml' : '.txt,.log'}
                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {uploadFile ? uploadFile.name : `Click to upload ${uploadFormat.toUpperCase()} file`}
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Text Input Alternative */}
                  <div className="space-y-2">
                    <Label>Or Paste Data</Label>
                    <Textarea
                      placeholder={`Paste your ${uploadFormat.toUpperCase()} log data here...`}
                      value={uploadText}
                      onChange={(e) => setUploadText(e.target.value)}
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <Label>Uploading...</Label>
                      <Progress value={uploadProgress} />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsUploadDialogOpen(false);
                        setUploadFile(null);
                        setUploadText('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleFileUpload}
                      disabled={isUploading || (!uploadFile && !uploadText.trim())}
                    >
                      {isUploading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Logs
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={exportLogs} variant="outline" disabled={logs.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
              <CardDescription>
                Filter logs by level, category, source, or search terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Log Level</Label>
                  <Select
                    value={filters.level}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Levels</SelectItem>
                      <SelectItem value="DEBUG">Debug</SelectItem>
                      <SelectItem value="INFO">Info</SelectItem>
                      <SelectItem value="WARN">Warning</SelectItem>
                      <SelectItem value="ERROR">Error</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    placeholder="Filter by category..."
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Source</Label>
                  <Input
                    placeholder="Filter by source..."
                    value={filters.source}
                    onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      value={filters.query}
                      onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Log Entries</CardTitle>
              <CardDescription>
                Showing {logs.length} of {pagination.total} logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                  Loading logs...
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No logs found matching your filters.</p>
                  <Button onClick={() => setFilters({ level: 'ALL', category: '', source: '', query: '', startDate: '', endDate: '' })} variant="outline" className="mt-4">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <ScrollArea className="h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-32">Time</TableHead>
                          <TableHead className="w-20">Level</TableHead>
                          <TableHead className="w-24">Category</TableHead>
                          <TableHead className="w-32">Source</TableHead>
                          <TableHead>Message</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {logs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatTimestamp(log.timestamp)}
                            </TableCell>
                            <TableCell>
                              <Badge className={getLevelColor(log.level)}>
                                <div className="flex items-center gap-1">
                                  {getLevelIcon(log.level)}
                                  {log.level}
                                </div>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{log.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getSourceIcon(log.source)}
                                <span className="text-sm">{log.source}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">{log.message}</p>
                                {log.metadata && Object.keys(log.metadata).length > 0 && (
                                  <details className="mt-1">
                                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                                      Metadata ({Object.keys(log.metadata).length} fields)
                                    </summary>
                                    <pre className="text-xs mt-1 p-2 bg-muted rounded text-muted-foreground overflow-x-auto">
                                      {JSON.stringify(log.metadata, null, 2)}
                                    </pre>
                                  </details>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Page {Math.floor(pagination.offset / pagination.limit) + 1} of {Math.ceil(pagination.total / pagination.limit)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))}
                        disabled={pagination.offset === 0}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))}
                        disabled={!pagination.hasMore}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {stats ? (
            <>
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      All filtered logs
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.total > 0 ? ((stats.byLevel.ERROR || 0) / stats.total * 100).toFixed(1) : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Error percentage
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
                    <Server className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Object.keys(stats.bySource).length}</div>
                    <p className="text-xs text-muted-foreground">
                      Different sources
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Time Range</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-bold">
                      {stats.timeRange.start ? new Date(stats.timeRange.start).toLocaleDateString() : 'N/A'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      to {stats.timeRange.end ? new Date(stats.timeRange.end).toLocaleDateString() : 'N/A'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Level Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Log Level Distribution</CardTitle>
                  <CardDescription>Breakdown of logs by severity level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.byLevel).map(([level, count]) => (
                      <div key={level} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getLevelIcon(level)}
                          <span className="font-medium">{level}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress
                            value={stats.total > 0 ? (count / stats.total) * 100 : 0}
                            className="w-32"
                          />
                          <span className="text-sm text-muted-foreground w-16 text-right">
                            {count} ({stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category and Source Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Logs by Category</CardTitle>
                    <CardDescription>Distribution across different categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(stats.byCategory).slice(0, 8).map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between">
                          <Badge variant="outline">{category}</Badge>
                          <span className="text-sm text-muted-foreground">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Logs by Source</CardTitle>
                    <CardDescription>Distribution across different sources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(stats.bySource).slice(0, 8).map(([source, count]) => (
                        <div key={source} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getSourceIcon(source)}
                            <span className="text-sm">{source}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
                <p className="text-muted-foreground text-center">
                  Load some logs first to see analytics and statistics.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Configure how logs are displayed and refreshed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-refresh</h4>
                  <p className="text-sm text-muted-foreground">Automatically refresh logs at regular intervals</p>
                </div>
                <Button
                  variant={autoRefresh ? "default" : "outline"}
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  {autoRefresh ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              {autoRefresh && (
                <div className="space-y-2">
                  <Label>Refresh Interval (seconds)</Label>
                  <Select
                    value={refreshInterval.toString()}
                    onValueChange={(value) => setRefreshInterval(parseInt(value))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10s</SelectItem>
                      <SelectItem value="30">30s</SelectItem>
                      <SelectItem value="60">1m</SelectItem>
                      <SelectItem value="300">5m</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Label>Logs per page</Label>
                <Select
                  value={pagination.limit.toString()}
                  onValueChange={(value) => setPagination(prev => ({ ...prev, limit: parseInt(value), offset: 0 }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
