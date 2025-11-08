"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/toaster";
import { Loader2, Lock, Eye, EyeOff, Plus, Search, Edit, Trash2, Download, Upload, Key, Shield, Clock, Tag } from "lucide-react";

interface VaultConfig {
  encryptionKey: string;
  storageType: "redis";
  redisConfig: {
    host: string;
    port: number;
    password?: string;
    db?: number;
    tls?: boolean;
  };
}

interface Secret {
  id: string;
  name: string;
  value: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  accessCount: number;
  lastAccessed?: string;
}

export default function SecretsVaultInterfaceClient() {
  const { toast } = useToast();
  const [config, setConfig] = useState<VaultConfig>({
    encryptionKey: "",
    storageType: "redis",
    redisConfig: {
      host: "161.97.172.172",
      port: 6379,
      password: "87gQQOarM2IJUKqmZA2wcPM4HryGs9El9RvfW49ZKQydlGkbbCr95Xmv0yfVFRS3",
      db: 0,
      tls: true,
    },
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [selectedSecret, setSelectedSecret] = useState<Secret | null>(null);
  const [showSecretValue, setShowSecretValue] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSecret, setEditingSecret] = useState<Secret | null>(null);

  // Form states
  const [newSecret, setNewSecret] = useState({
    name: "",
    value: "",
    description: "",
    tags: [] as string[],
    expiresAt: "",
  });

  const [editSecret, setEditSecret] = useState({
    name: "",
    value: "",
    description: "",
    tags: [] as string[],
    expiresAt: "",
  });

  const generateEncryptionKey = useCallback(() => {
    const key = crypto.getRandomValues(new Uint8Array(32));
    const hexKey = Array.from(key).map(b => b.toString(16).padStart(2, '0')).join('');
    setConfig(prev => ({ ...prev, encryptionKey: hexKey }));
  }, []);

  const handleConfigure = useCallback(() => {
    if (!config.encryptionKey || config.encryptionKey.length !== 64) {
      toast({
        title: "Invalid Key",
        description: "Encryption key must be a 64-character hexadecimal string.",
        variant: "destructive",
      });
      return;
    }

    setIsConfigured(true);
    toast({
      title: "Vault Configured",
      description: "Secrets vault is ready to use.",
    });
  }, [config.encryptionKey, toast]);

  const loadSecrets = useCallback(async () => {
    if (!isConfigured) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/secrets-vault-interface", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "list_secrets",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSecrets(data.secrets || []);
      } else {
        throw new Error(data.error || "Failed to load secrets");
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
  }, [config, isConfigured, toast]);

  const handleCreateSecret = useCallback(async () => {
    if (!newSecret.name || !newSecret.value) {
      toast({
        title: "Validation Error",
        description: "Name and value are required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/secrets-vault-interface", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "create_secret",
          secret: {
            ...newSecret,
            tags: newSecret.tags.filter(tag => tag.trim()),
            expiresAt: newSecret.expiresAt || undefined,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Secret Created",
          description: "Secret has been securely stored.",
        });
        setIsCreateDialogOpen(false);
        setNewSecret({ name: "", value: "", description: "", tags: [], expiresAt: "" });
        await loadSecrets();
      } else {
        throw new Error(data.error || "Failed to create secret");
      }
    } catch (error: any) {
      toast({
        title: "Create Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [config, newSecret, toast, loadSecrets]);

  const handleUpdateSecret = useCallback(async () => {
    if (!editingSecret || !editSecret.name || !editSecret.value) {
      toast({
        title: "Validation Error",
        description: "Name and value are required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/secrets-vault-interface", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "update_secret",
          secretId: editingSecret.id,
          secret: {
            ...editSecret,
            tags: editSecret.tags.filter(tag => tag.trim()),
            expiresAt: editSecret.expiresAt || undefined,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Secret Updated",
          description: "Secret has been updated successfully.",
        });
        setIsEditDialogOpen(false);
        setEditingSecret(null);
        await loadSecrets();
      } else {
        throw new Error(data.error || "Failed to update secret");
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [config, editingSecret, editSecret, toast, loadSecrets]);

  const handleDeleteSecret = useCallback(async (secretId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/secrets-vault-interface", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "delete_secret",
          secretId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Secret Deleted",
          description: "Secret has been permanently removed.",
        });
        await loadSecrets();
      } else {
        throw new Error(data.error || "Failed to delete secret");
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
  }, [config, toast, loadSecrets]);

  const handleViewSecret = useCallback(async (secret: Secret) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/secrets-vault-interface", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "get_secret",
          secretId: secret.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSelectedSecret(data.secret);
        setShowSecretValue(false);
      } else {
        throw new Error(data.error || "Failed to load secret");
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

  const handleSearch = useCallback(async () => {
    if (!isConfigured) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/secrets-vault-interface", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "search_secrets",
          searchQuery: searchQuery || undefined,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSecrets(data.secrets || []);
      } else {
        throw new Error(data.error || "Failed to search secrets");
      }
    } catch (error: any) {
      toast({
        title: "Search Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [config, isConfigured, searchQuery, selectedTags, toast]);

  const handleExport = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/secrets-vault-interface", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "export_secrets",
        }),
      });

      const data = await response.json();

      if (data.success) {
        const blob = new Blob([JSON.stringify(data.secrets, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `secrets-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Export Complete",
          description: "Secrets have been exported successfully.",
        });
      } else {
        throw new Error(data.error || "Failed to export secrets");
      }
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [config, toast]);

  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      const response = await fetch("/api/tools/secrets-vault-interface", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          action: "import_secrets",
          exportData: importData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Import Complete",
          description: data.message,
        });
        await loadSecrets();
      } else {
        throw new Error(data.error || "Failed to import secrets");
      }
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Reset file input
      event.target.value = "";
    }
  }, [config, toast, loadSecrets]);

  const openEditDialog = useCallback((secret: Secret) => {
    setEditingSecret(secret);
    setEditSecret({
      name: secret.name,
      value: "", // Don't pre-fill for security
      description: secret.description || "",
      tags: [...secret.tags],
      expiresAt: secret.expiresAt || "",
    });
    setIsEditDialogOpen(true);
  }, []);

  // Load secrets when configured
  useEffect(() => {
    if (isConfigured) {
      loadSecrets();
    }
  }, [isConfigured, loadSecrets]);

  // Get all unique tags for filtering
  const allTags = Array.from(new Set(secrets.flatMap(secret => secret.tags)));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Secrets Vault Interface</h1>
      </div>

      {/* Vault Configuration */}
      {!isConfigured && (
        <Card>
          <CardHeader>
            <CardTitle>Vault Configuration</CardTitle>
            <CardDescription>
              Configure your secrets vault with encryption settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="encryptionKey">Encryption Key (64-character hex)</Label>
              <div className="flex gap-2">
                <Input
                  id="encryptionKey"
                  value={config.encryptionKey}
                  onChange={(e) => setConfig({ ...config, encryptionKey: e.target.value })}
                  placeholder="Enter 64-character hexadecimal encryption key"
                  className="font-mono"
                />
                <Button onClick={generateEncryptionKey} variant="outline">
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This key is used to encrypt/decrypt your secrets. Keep it safe and don&apos;t lose it!
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="redisHost">Redis Host</Label>
                <Input
                  id="redisHost"
                  value={config.redisConfig.host}
                  onChange={(e) => setConfig({
                    ...config,
                    redisConfig: { ...config.redisConfig, host: e.target.value }
                  })}
                  placeholder="e.g., localhost or redis.example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="redisPort">Port</Label>
                  <Input
                    id="redisPort"
                    type="number"
                    value={config.redisConfig.port}
                    onChange={(e) => setConfig({
                      ...config,
                      redisConfig: { ...config.redisConfig, port: parseInt(e.target.value) || 6379 }
                    })}
                    placeholder="6379"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="redisDb">Database</Label>
                  <Input
                    id="redisDb"
                    type="number"
                    value={config.redisConfig.db || 0}
                    onChange={(e) => setConfig({
                      ...config,
                      redisConfig: { ...config.redisConfig, db: parseInt(e.target.value) || 0 }
                    })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="redisPassword">Password (optional)</Label>
                <Input
                  id="redisPassword"
                  type="password"
                  value={config.redisConfig.password || ""}
                  onChange={(e) => setConfig({
                    ...config,
                    redisConfig: { ...config.redisConfig, password: e.target.value || undefined }
                  })}
                  placeholder="Redis password"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="redisTls"
                  checked={config.redisConfig.tls || false}
                  onChange={(e) => setConfig({
                    ...config,
                    redisConfig: { ...config.redisConfig, tls: e.target.checked }
                  })}
                  className="rounded"
                />
                <Label htmlFor="redisTls">Enable TLS/SSL</Label>
              </div>
            </div>

            <Button onClick={handleConfigure} className="w-full">
              Configure Vault
            </Button>
          </CardContent>
        </Card>
      )}

      {isConfigured && (
        <>
          {/* Toolbar */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Secret
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Secret</DialogTitle>
                    <DialogDescription>
                      Add a new secret to your secure vault
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new-name">Name</Label>
                      <Input
                        id="new-name"
                        value={newSecret.name}
                        onChange={(e) => setNewSecret({ ...newSecret, name: e.target.value })}
                        placeholder="e.g., database_password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-value">Value</Label>
                      <Textarea
                        id="new-value"
                        value={newSecret.value}
                        onChange={(e) => setNewSecret({ ...newSecret, value: e.target.value })}
                        placeholder="Secret value"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-description">Description (optional)</Label>
                      <Input
                        id="new-description"
                        value={newSecret.description}
                        onChange={(e) => setNewSecret({ ...newSecret, description: e.target.value })}
                        placeholder="Brief description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-tags">Tags (comma-separated)</Label>
                      <Input
                        id="new-tags"
                        value={newSecret.tags.join(", ")}
                        onChange={(e) => setNewSecret({
                          ...newSecret,
                          tags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag)
                        })}
                        placeholder="api, production, database"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-expires">Expires At (optional)</Label>
                      <Input
                        id="new-expires"
                        type="datetime-local"
                        value={newSecret.expiresAt}
                        onChange={(e) => setNewSecret({ ...newSecret, expiresAt: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateSecret} disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Create Secret
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button onClick={handleExport} variant="outline" disabled={isLoading}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>

              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  id="import-file"
                />
                <Button variant="outline" onClick={() => document.getElementById("import-file")?.click()} disabled={isLoading}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search secrets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading}>
                Search
              </Button>
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium">Filter by tags:</span>
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedTags(prev =>
                      prev.includes(tag)
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                >
                  {tag}
                </Badge>
              ))}
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}

          {/* Secrets List */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {secrets.map((secret) => (
              <Card key={secret.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      {secret.name}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewSecret(secret)}
                        disabled={isLoading}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(secret)}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" disabled={isLoading}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Secret</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to permanently delete &quot;{secret.name}&quot;?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSecret(secret.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {secret.description && (
                    <CardDescription>{secret.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {secret.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Created: {new Date(secret.createdAt).toLocaleDateString()}
                    </div>
                    <div>Access count: {secret.accessCount}</div>
                    {secret.expiresAt && (
                      <div className={`${
                        new Date(secret.expiresAt) < new Date() ? "text-destructive" : ""
                      }`}>
                        Expires: {new Date(secret.expiresAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {secrets.length === 0 && !isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No secrets found</h3>
              <p>Create your first secret to get started with secure credential management.</p>
            </div>
          )}

          {/* Secret Details Modal */}
          {selectedSecret && (
            <Dialog open={!!selectedSecret} onOpenChange={() => setSelectedSecret(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    {selectedSecret.name}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedSecret.description || "No description provided"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Secret Value</Label>
                    <div className="flex gap-2">
                      <Textarea
                        value={showSecretValue ? selectedSecret.value : "••••••••••••••••"}
                        readOnly
                        className="font-mono"
                        rows={4}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowSecretValue(!showSecretValue)}
                      >
                        {showSecretValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Created</Label>
                      <p>{new Date(selectedSecret.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Last Updated</Label>
                      <p>{new Date(selectedSecret.updatedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Access Count</Label>
                      <p>{selectedSecret.accessCount}</p>
                    </div>
                    {selectedSecret.lastAccessed && (
                      <div>
                        <Label className="text-muted-foreground">Last Accessed</Label>
                        <p>{new Date(selectedSecret.lastAccessed).toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {selectedSecret.expiresAt && (
                    <div>
                      <Label className="text-muted-foreground">Expires</Label>
                      <p className={new Date(selectedSecret.expiresAt) < new Date() ? "text-destructive" : ""}>
                        {new Date(selectedSecret.expiresAt).toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div>
                    <Label className="text-muted-foreground">Tags</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedSecret.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setSelectedSecret(null)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Edit Secret Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Secret</DialogTitle>
                <DialogDescription>
                  Update the secret details
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editSecret.name}
                    onChange={(e) => setEditSecret({ ...editSecret, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-value">Value</Label>
                  <Textarea
                    id="edit-value"
                    value={editSecret.value}
                    onChange={(e) => setEditSecret({ ...editSecret, value: e.target.value })}
                    placeholder="Enter new value (leave empty to keep current)"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={editSecret.description}
                    onChange={(e) => setEditSecret({ ...editSecret, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                  <Input
                    id="edit-tags"
                    value={editSecret.tags.join(", ")}
                    onChange={(e) => setEditSecret({
                      ...editSecret,
                      tags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag)
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-expires">Expires At</Label>
                  <Input
                    id="edit-expires"
                    type="datetime-local"
                    value={editSecret.expiresAt}
                    onChange={(e) => setEditSecret({ ...editSecret, expiresAt: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateSecret} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Update Secret
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}