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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toaster";
import { DatabaseConfig } from "@/types";
import {
  Play,
  Database,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  Settings,
  Upload,
} from "lucide-react";

interface QueryResult {
  success: boolean;
  data?: any[];
  columns?: string[];
  rowCount?: number;
  executionTime?: number;
  explainPlan?: any;
  formattedQuery?: string;
  error?: string;
}

const DATABASE_TYPES = [
  { value: "postgresql", label: "PostgreSQL", defaultPort: 5432 },
  { value: "mysql", label: "MySQL", defaultPort: 3306 },
];

const SAMPLE_QUERIES = {
  postgresql: [
    "SELECT version();",
    "SELECT * FROM information_schema.tables LIMIT 10;",
    "SELECT * FROM pg_stat_activity;",
    "SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public';",
  ],
  mysql: [
    "SELECT VERSION();",
    "SHOW DATABASES;",
    "SHOW TABLES;",
    "SELECT * FROM information_schema.tables LIMIT 10;",
  ],
};

export default function DatabaseQueryRunnerClient() {
  const { toast } = useToast();

  const [config, setConfig] = useState<DatabaseConfig>({
    type: "postgresql",
    host: "localhost",
    port: 5432,
    database: "",
    username: "",
    password: "",
    ssl: false,
  });

  const [query, setQuery] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [explainQuery, setExplainQuery] = useState(false);
  const [formatQuery, setFormatQuery] = useState(false);

  const updateConfig = useCallback((updates: Partial<DatabaseConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const handleDatabaseTypeChange = useCallback((type: "postgresql" | "mysql") => {
    const defaultPort = DATABASE_TYPES.find(db => db.value === type)?.defaultPort || 5432;
    setConfig(prev => ({ ...prev, type, port: defaultPort }));
  }, []);

  const executeQuery = useCallback(async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a SQL query",
        variant: "destructive",
      });
      return;
    }

    if (!config.database || !config.username) {
      toast({
        title: "Error",
        description: "Please fill in database connection details",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/tools/database-query-runner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          query: query.trim(),
          explain: explainQuery,
          format: formatQuery,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: QueryResult = await response.json();
      setResult(data);

      if (data.success) {
        toast({
          title: "Query executed successfully",
          description: `Returned ${data.rowCount || 0} rows in ${data.executionTime}ms`,
        });
      } else {
        toast({
          title: "Query failed",
          description: data.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Query execution failed:", error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      toast({
        title: "Query failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [config, query, explainQuery, formatQuery, toast]);

  const loadSampleQuery = useCallback((sampleQuery: string) => {
    setQuery(sampleQuery);
  }, []);

  const formatJson = (obj: any): string => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  const downloadResults = useCallback(() => {
    if (!result?.data || !result.columns) return;

    const csvContent = [
      result.columns.join(","),
      ...result.data.map(row =>
        result.columns!.map(col => {
          const value = row[col];
          // Escape commas and quotes in CSV
          const stringValue = String(value || "");
          if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "query-results.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Results downloaded",
      description: "Query results saved as CSV",
    });
  }, [result, toast]);

  return (
    <div className="space-y-6">
      {/* Database Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="db-type">Database Type</Label>
              <Select
                value={config.type}
                onValueChange={handleDatabaseTypeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATABASE_TYPES.map(db => (
                    <SelectItem key={db.value} value={db.value}>
                      {db.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                value={config.host}
                onChange={(e) => updateConfig({ host: e.target.value })}
                placeholder="localhost"
              />
            </div>

            <div>
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                value={config.port}
                onChange={(e) => updateConfig({ port: parseInt(e.target.value) || 5432 })}
              />
            </div>

            <div>
              <Label htmlFor="database">Database</Label>
              <Input
                id="database"
                value={config.database}
                onChange={(e) => updateConfig({ database: e.target.value })}
                placeholder="mydatabase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={config.username}
                onChange={(e) => updateConfig({ username: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={config.password}
                onChange={(e) => updateConfig({ password: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="ssl"
              checked={config.ssl}
              onCheckedChange={(checked) => updateConfig({ ssl: !!checked })}
            />
            <Label htmlFor="ssl">Use SSL/TLS</Label>
          </div>
        </CardContent>
      </Card>

      {/* Query Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              SQL Query
            </span>
            <div className="flex gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="explain"
                  checked={explainQuery}
                  onCheckedChange={(checked) => setExplainQuery(checked === true)}
                />
                <Label htmlFor="explain" className="text-sm">EXPLAIN</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="format"
                  checked={formatQuery}
                  onCheckedChange={(checked) => setFormatQuery(checked === true)}
                />
                <Label htmlFor="format" className="text-sm">Format</Label>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Enter your SQL query here...\n\nExample: SELECT * FROM users LIMIT 10;`}
            className="min-h-[200px] font-mono text-sm"
          />
          <div className="flex items-center space-x-2 mt-2">
            <Input
              type="file"
              accept=".sql,.txt"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const content = e.target?.result as string;
                    setQuery(content);
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
                input.accept = '.sql,.txt';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const content = e.target?.result as string;
                      setQuery(content);
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
              Upload SQL File
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <Label className="text-sm text-muted-foreground">Sample Queries:</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {SAMPLE_QUERIES[config.type].map((sample, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadSampleQuery(sample)}
                    className="text-xs"
                  >
                    {sample.split(" ")[0]}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={executeQuery} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Execute Query
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Query Results
              </span>
              <div className="flex items-center gap-2">
                {result.executionTime && (
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {result.executionTime}ms
                  </Badge>
                )}
                {result.rowCount !== undefined && (
                  <Badge variant="outline">
                    {result.rowCount} rows
                  </Badge>
                )}
                {result.success && result.data && result.data.length > 0 && (
                  <Button variant="outline" size="sm" onClick={downloadResults}>
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.error ? (
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-red-700 mt-1 font-mono text-sm">{result.error}</p>
              </div>
            ) : (
              <Tabs defaultValue="results" className="w-full">
                <TabsList>
                  <TabsTrigger value="results">Results</TabsTrigger>
                  {result.explainPlan && <TabsTrigger value="explain">EXPLAIN Plan</TabsTrigger>}
                  {result.formattedQuery && <TabsTrigger value="formatted">Formatted SQL</TabsTrigger>}
                </TabsList>

                <TabsContent value="results">
                  {result.data && result.data.length > 0 ? (
                    <ScrollArea className="h-[400px] w-full">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              {result.columns?.map((column, index) => (
                                <th key={index} className="text-left p-2 font-medium bg-muted">
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {result.data.map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-b hover:bg-muted/50">
                                {result.columns?.map((column, colIndex) => (
                                  <td key={colIndex} className="p-2 font-mono text-sm">
                                    {String(row[column] || "")}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No data returned
                    </div>
                  )}
                </TabsContent>

                {result.explainPlan && (
                  <TabsContent value="explain">
                    <ScrollArea className="h-[400px] w-full">
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        {formatJson(result.explainPlan)}
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                )}

                {result.formattedQuery && (
                  <TabsContent value="formatted">
                    <ScrollArea className="h-[400px] w-full">
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        {result.formattedQuery}
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                )}
              </Tabs>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}