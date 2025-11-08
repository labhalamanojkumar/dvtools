"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { 
  Play,
  Book,
  Clock,
  FileCode,
  CheckCircle2,
  XCircle,
  Zap,
  Database
} from "lucide-react";

interface SchemaType {
  name: string;
  kind: string;
  description?: string;
  fields?: Array<{ name: string; type: string; description?: string }>;
}

interface QueryResult {
  data?: any;
  errors?: Array<{ message: string; locations?: any[]; path?: string[] }>;
  extensions?: {
    tracing?: {
      duration: number;
      startTime: string;
      endTime: string;
    };
  };
}

export default function GraphQLPlaygroundClient() {
  const [endpointUrl, setEndpointUrl] = useState("https://api.spacex.land/graphql/");
  const [query, setQuery] = useState(`query GetLaunches {
  launchesPast(limit: 5) {
    mission_name
    launch_date_local
    launch_site {
      site_name_long
    }
    rocket {
      rocket_name
    }
  }
}`);
  const [variables, setVariables] = useState("{}");
  const [headers, setHeaders] = useState(JSON.stringify({ "Content-Type": "application/json" }, null, 2));
  const [result, setResult] = useState<QueryResult | null>(null);
  const [schema, setSchema] = useState<SchemaType[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isFetchingSchema, setIsFetchingSchema] = useState(false);

  const fetchSchema = useCallback(async () => {
    if (!endpointUrl.trim()) {
      toast.error("Please enter a GraphQL endpoint URL");
      return;
    }

    setIsFetchingSchema(true);
    try {
      const response = await fetch("/api/tools/graphql-playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "introspect",
          endpoint: endpointUrl,
          headers: JSON.parse(headers)
        })
      });

      if (!response.ok) throw new Error("Failed to fetch schema");

      const data = await response.json();
      setSchema(data.schema);
      toast.success("Schema loaded successfully!");
    } catch (error) {
      console.error("Schema fetch error:", error);
      toast.error("Failed to fetch schema");
    } finally {
      setIsFetchingSchema(false);
    }
  }, [endpointUrl, headers]);

  const executeQuery = useCallback(async () => {
    if (!endpointUrl.trim()) {
      toast.error("Please enter a GraphQL endpoint URL");
      return;
    }

    if (!query.trim()) {
      toast.error("Please enter a query");
      return;
    }

    setIsExecuting(true);
    setResult(null);

    try {
      const parsedVariables = variables.trim() ? JSON.parse(variables) : {};
      const parsedHeaders = JSON.parse(headers);

      const response = await fetch("/api/tools/graphql-playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "execute",
          endpoint: endpointUrl,
          query,
          variables: parsedVariables,
          headers: parsedHeaders
        })
      });

      if (!response.ok) throw new Error("Query execution failed");

      const data = await response.json();
      setResult(data.result);

      if (data.result.errors) {
        toast.error(`Query returned ${data.result.errors.length} error(s)`);
      } else {
        toast.success("Query executed successfully!");
      }
    } catch (error) {
      console.error("Query execution error:", error);
      toast.error("Failed to execute query");
      setResult({
        errors: [{ message: error instanceof Error ? error.message : "Unknown error" }]
      });
    } finally {
      setIsExecuting(false);
    }
  }, [endpointUrl, query, variables, headers]);

  const loadSampleQuery = () => {
    setQuery(`query GetLaunches($limit: Int!) {
  launchesPast(limit: $limit) {
    mission_name
    launch_date_local
    launch_site {
      site_name_long
    }
    rocket {
      rocket_name
    }
  }
}`);
    setVariables(JSON.stringify({ limit: 5 }, null, 2));
    toast.success("Sample query loaded");
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>GraphQL Endpoint</CardTitle>
          <CardDescription>Configure your GraphQL endpoint and authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="endpoint">Endpoint URL</Label>
              <Input
                id="endpoint"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                placeholder="https://api.example.com/graphql"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={fetchSchema} disabled={isFetchingSchema} variant="outline">
                <Database className="w-4 h-4 mr-2" />
                {isFetchingSchema ? "Loading..." : "Fetch Schema"}
              </Button>
            </div>
          </div>

          {schema.length > 0 && (
            <Alert>
              <CheckCircle2 className="w-4 h-4" />
              <AlertDescription>
                Schema loaded: {schema.length} types discovered
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="query" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="query">Query</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
        </TabsList>

        <TabsContent value="query" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Query Editor</CardTitle>
                  <CardDescription>Write and execute GraphQL queries</CardDescription>
                </div>
                <Button onClick={loadSampleQuery} variant="outline" size="sm">
                  <FileCode className="w-4 h-4 mr-2" />
                  Load Sample
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="font-mono text-sm min-h-[300px]"
                placeholder="query { ... }"
              />

              <Button onClick={executeQuery} disabled={isExecuting} className="w-full" size="lg">
                <Play className="w-4 h-4 mr-2" />
                {isExecuting ? "Executing..." : "Execute Query"}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Response</CardTitle>
                  {result.extensions?.tracing && (
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {result.extensions.tracing.duration}ms
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {result.errors && (
                  <div className="space-y-2 mb-4">
                    {result.errors.map((error, index) => (
                      <Alert key={index} variant="destructive">
                        <XCircle className="w-4 h-4" />
                        <AlertDescription>{error.message}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}

                {result.data && (
                  <div>
                    <Label className="mb-2 block">Data</Label>
                    <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="variables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Query Variables</CardTitle>
              <CardDescription>Define variables for your GraphQL query</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={variables}
                onChange={(e) => setVariables(e.target.value)}
                className="font-mono text-sm min-h-[200px]"
                placeholder='{ "limit": 10 }'
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="headers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>HTTP Headers</CardTitle>
              <CardDescription>Configure authentication and custom headers</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                className="font-mono text-sm min-h-[200px]"
                placeholder='{ "Authorization": "Bearer token" }'
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schema Explorer</CardTitle>
              <CardDescription>Browse GraphQL schema types and fields</CardDescription>
            </CardHeader>
            <CardContent>
              {schema.length > 0 ? (
                <div className="space-y-3">
                  {schema.slice(0, 10).map((type, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{type.kind}</Badge>
                          <code className="text-sm font-semibold">{type.name}</code>
                        </div>
                        {type.description && (
                          <p className="text-sm text-muted-foreground mb-2">{type.description}</p>
                        )}
                        {type.fields && type.fields.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs font-semibold text-muted-foreground">Fields:</p>
                            {type.fields.slice(0, 5).map((field, fieldIndex) => (
                              <div key={fieldIndex} className="text-xs pl-3">
                                <code>{field.name}: {field.type}</code>
                              </div>
                            ))}
                            {type.fields.length > 5 && (
                              <p className="text-xs text-muted-foreground pl-3">
                                +{type.fields.length - 5} more fields...
                              </p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {schema.length > 10 && (
                    <p className="text-sm text-muted-foreground text-center">
                      Showing 10 of {schema.length} types
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Fetch schema to explore types and fields.</p>
                  <p className="text-sm mt-2">Click "Fetch Schema" to load schema documentation.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
