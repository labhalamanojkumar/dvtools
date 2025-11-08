"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toaster";
import { DatabaseConfig } from "@/types";
import { Loader2, Play, RotateCcw, Eye, Plus, Database, Clock, CheckCircle, XCircle } from "lucide-react";

interface Migration {
  id: string;
  name: string;
  up: string;
  down: string;
  created_at: string;
  executed_at?: string;
  status: "pending" | "executed" | "failed";
  checksum: string;
}

interface MigrationPreview {
  up: string[];
  down: string[];
}

export default function MigrationManagerClient() {
  const { toast } = useToast();

  // Database configuration
  const [config, setConfig] = useState<DatabaseConfig>({
    type: "postgresql",
    host: "localhost",
    port: 5432,
    database: "",
    username: "",
    password: "",
    ssl: false,
  });

  // Migration creation
  const [migrationName, setMigrationName] = useState("");
  const [upScript, setUpScript] = useState("");
  const [downScript, setDownScript] = useState("");

  // State management
  const [migrations, setMigrations] = useState<Migration[]>([]);
  const [preview, setPreview] = useState<MigrationPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("list");

  const handleConfigChange = (field: keyof DatabaseConfig, value: string | number | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const loadMigrations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tools/migration-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "list",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMigrations(result.migrations || []);
        toast({
          title: "Success",
          description: "Migrations loaded successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load migrations",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [config, toast]);

  const previewMigration = useCallback(async () => {
    if (!upScript.trim()) {
      toast({
        title: "Error",
        description: "Up script is required for preview",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/tools/migration-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "preview",
          migration: {
            name: migrationName,
            up: upScript,
            down: downScript,
          },
        }),
      });

      const result = await response.json();
      if (result.success) {
        setPreview(result.preview);
        setActiveTab("preview");
        toast({
          title: "Success",
          description: "Migration preview generated",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to preview migration",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [config, migrationName, upScript, downScript, toast]);

  const executeMigration = useCallback(async () => {
    if (!migrationName.trim() || !upScript.trim()) {
      toast({
        title: "Error",
        description: "Migration name and up script are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/tools/migration-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "execute",
          migration: {
            name: migrationName,
            up: upScript,
            down: downScript,
          },
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Success",
          description: "Migration executed successfully",
        });
        setMigrationName("");
        setUpScript("");
        setDownScript("");
        setPreview(null);
        await loadMigrations();
        setActiveTab("list");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to execute migration",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [config, migrationName, upScript, downScript, toast, loadMigrations]);

  const rollbackMigration = useCallback(async (migrationId: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/tools/migration-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "rollback",
          targetMigrationId: migrationId,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Success",
          description: "Migration rolled back successfully",
        });
        await loadMigrations();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to rollback migration",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [config, toast, loadMigrations]);

  const createMigration = useCallback(async () => {
    if (!migrationName.trim()) {
      toast({
        title: "Error",
        description: "Migration name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/tools/migration-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          migration: {
            name: migrationName,
            up: upScript,
            down: downScript,
          },
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Success",
          description: "Migration created successfully",
        });
        setMigrationName("");
        setUpScript("");
        setDownScript("");
        setPreview(null);
        await loadMigrations();
        setActiveTab("list");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create migration",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [migrationName, upScript, downScript, toast, loadMigrations]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "executed":
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Executed</Badge>;
      case "failed":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Database className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Migration Manager</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database Configuration</CardTitle>
          <CardDescription>
            Configure your database connection for migration management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="db-type">Database Type</Label>
              <Select
                value={config.type}
                onValueChange={(value: "postgresql" | "mysql") => handleConfigChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                value={config.host}
                onChange={(e) => handleConfigChange("host", e.target.value)}
                placeholder="localhost"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                value={config.port}
                onChange={(e) => handleConfigChange("port", parseInt(e.target.value) || 5432)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="database">Database</Label>
              <Input
                id="database"
                value={config.database}
                onChange={(e) => handleConfigChange("database", e.target.value)}
                placeholder="my_database"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={config.username}
                onChange={(e) => handleConfigChange("username", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={config.password}
                onChange={(e) => handleConfigChange("password", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="ssl"
              checked={config.ssl}
              onChange={(e) => handleConfigChange("ssl", e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="ssl">Use SSL</Label>
          </div>

          <Button onClick={loadMigrations} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Load Migrations
          </Button>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Migration List</TabsTrigger>
          <TabsTrigger value="create">Create Migration</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Migrations</CardTitle>
              <CardDescription>
                View and manage your database migrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {migrations.length === 0 ? (
                    <p className="text-muted-foreground">No migrations found</p>
                  ) : (
                    migrations.map((migration) => (
                      <Card key={migration.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{migration.name}</h4>
                                {getStatusBadge(migration.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Created: {new Date(migration.created_at).toLocaleString()}
                                {migration.executed_at && (
                                  <> • Executed: {new Date(migration.executed_at).toLocaleString()}</>
                                )}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              {migration.status === "executed" && migration.down && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => rollbackMigration(migration.id)}
                                  disabled={loading}
                                >
                                  <RotateCcw className="w-4 h-4 mr-1" />
                                  Rollback
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Migration</CardTitle>
              <CardDescription>
                Define your database migration scripts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="migration-name">Migration Name</Label>
                <Input
                  id="migration-name"
                  value={migrationName}
                  onChange={(e) => setMigrationName(e.target.value)}
                  placeholder="create_users_table"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="up-script">Up Script (SQL to apply migration)</Label>
                <Textarea
                  id="up-script"
                  value={upScript}
                  onChange={(e) => setUpScript(e.target.value)}
                  placeholder="CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL);"
                  rows={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="down-script">Down Script (SQL to rollback migration)</Label>
                <Textarea
                  id="down-script"
                  value={downScript}
                  onChange={(e) => setDownScript(e.target.value)}
                  placeholder="DROP TABLE users;"
                  rows={5}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={previewMigration} disabled={loading}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={executeMigration} disabled={loading}>
                  <Play className="w-4 h-4 mr-2" />
                  Execute
                </Button>
                <Button variant="outline" onClick={createMigration} disabled={loading}>
                  <Plus className="w-4 h-4 mr-2" />
                  Save Only
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Migration Preview</CardTitle>
              <CardDescription>
                Review the SQL statements that will be executed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {preview ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Up Statements:</h4>
                    <ScrollArea className="h-48 border rounded p-2">
                      <pre className="text-sm">
                        {preview.up.map((stmt, index) => (
                          <div key={index} className="mb-2">
                            <span className="text-muted-foreground">{index + 1}.</span> {stmt};
                          </div>
                        ))}
                      </pre>
                    </ScrollArea>
                  </div>

                  {preview.down.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">Down Statements:</h4>
                        <ScrollArea className="h-48 border rounded p-2">
                          <pre className="text-sm">
                            {preview.down.map((stmt, index) => (
                              <div key={index} className="mb-2">
                                <span className="text-muted-foreground">{index + 1}.</span> {stmt};
                              </div>
                            ))}
                          </pre>
                        </ScrollArea>
                      </div>
                    </>
                  )}

                  <div className="flex space-x-2">
                    <Button onClick={executeMigration} disabled={loading}>
                      <Play className="w-4 h-4 mr-2" />
                      Execute Migration
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab("create")}>
                      Back to Edit
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No preview available. Create a migration first.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}