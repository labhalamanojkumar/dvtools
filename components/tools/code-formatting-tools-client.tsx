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
import { toast } from "sonner";
import { Loader2, Play, Code, FileText, Package, Globe, Settings, Copy, Download, Upload, Eye, Save, Zap, Shield, AlertTriangle } from "lucide-react";

interface LintResult {
  file: string;
  line: number;
  column: number;
  severity: "error" | "warning" | "info";
  message: string;
  rule?: string;
  fix?: {
    range: [number, number];
    text: string;
  };
}

interface Snippet {
  id: string;
  name: string;
  description: string;
  language: string;
  category: string;
  code: string;
  tags: string[];
  created_at: string;
}

interface DependencyInfo {
  name: string;
  current: string;
  latest: string;
  type: "major" | "minor" | "patch";
  vulnerable?: boolean;
  severity?: "low" | "moderate" | "high" | "critical";
}

interface TunnelConfig {
  service: "ngrok" | "cloudflared";
  port: number;
  subdomain?: string;
  region?: string;
}

export default function CodeFormattingToolsClient() {
  // Linter Runner state
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [linter, setLinter] = useState("eslint");
  const [lintResults, setLintResults] = useState<LintResult[]>([]);
  const [formattedCode, setFormattedCode] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Formatter Profiles state
  const [formatterCode, setFormatterCode] = useState("");
  const [formatter, setFormatter] = useState("prettier");
  const [profileName, setProfileName] = useState("");
  const [profiles, setProfiles] = useState<any[]>([]);

  // Snippet Library state
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [snippetSearch, setSnippetSearch] = useState("");
  const [snippetCategory, setSnippetCategory] = useState("all");

  // Dependency Updater state
  const [packageJson, setPackageJson] = useState("");
  const [dependencies, setDependencies] = useState<DependencyInfo[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);

  // Dev Tunneler state
  const [tunnelConfig, setTunnelConfig] = useState<TunnelConfig>({
    service: "ngrok",
    port: 3000,
  });
  const [tunnelCommands, setTunnelCommands] = useState<string[]>([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("linter");

  // Linter Runner functions
  const runLinter = useCallback(async () => {
    if (!code.trim()) {
      toast.error("Please enter code to lint");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/tools/code-formatting/linter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          linter,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setLintResults(result.results || []);
        setFormattedCode(result.formattedCode || "");
        toast.success(`Linting completed with ${result.results?.length || 0} issues found`);
      } else {
        toast.error(result.error || "Failed to run linter");
      }
    } catch (error) {
      toast.error("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  }, [code, language, linter]);

  // Formatter Profiles functions
  const formatCode = useCallback(async () => {
    if (!formatterCode.trim()) {
      toast.error("Please enter code to format");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/tools/code-formatting/formatter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formatterCode,
          formatter,
          profile: profileName,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setFormatterCode(result.formattedCode);
        toast.success("Code formatted successfully");
      } else {
        toast.error(result.error || "Failed to format code");
      }
    } catch (error) {
      toast.error("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  }, [formatterCode, formatter, profileName]);

  // Snippet Library functions
  const loadSnippets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tools/code-formatting/snippets", {
        method: "GET",
      });

      const result = await response.json();
      if (result.success) {
        setSnippets(result.snippets || []);
      } else {
        toast.error(result.error || "Failed to load snippets");
      }
    } catch (error) {
      toast.error("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSnippet = useCallback(async (snippet: Omit<Snippet, "id" | "created_at">) => {
    setLoading(true);
    try {
      const response = await fetch("/api/tools/code-formatting/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snippet),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Snippet saved successfully");
        await loadSnippets();
      } else {
        toast.error(result.error || "Failed to save snippet");
      }
    } catch (error) {
      toast.error("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  }, [loadSnippets]);

  // Dependency Updater functions
  const scanDependencies = useCallback(async () => {
    if (!packageJson.trim()) {
      toast.error("Please enter package.json content");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/tools/code-formatting/dependencies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageJson: JSON.parse(packageJson),
        }),
      });

      const result = await response.json();
      if (result.success) {
        setDependencies(result.dependencies || []);
        setVulnerabilities(result.vulnerabilities || []);
        toast.success(`Found ${result.dependencies?.length || 0} outdated dependencies`);
      } else {
        toast.error(result.error || "Failed to scan dependencies");
      }
    } catch (error) {
      toast.error("Failed to parse package.json or connect to server");
    } finally {
      setLoading(false);
    }
  }, [packageJson]);

  // Dev Tunneler functions
  const generateTunnelCommands = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tools/code-formatting/tunnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tunnelConfig),
      });

      const result = await response.json();
      if (result.success) {
        setTunnelCommands(result.commands || []);
        toast.success("Tunnel commands generated");
      } else {
        toast.error(result.error || "Failed to generate tunnel commands");
      }
    } catch (error) {
      toast.error("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  }, [tunnelConfig]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Command copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  }, []);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "warning":
        return <Badge variant="secondary" className="bg-yellow-500">Warning</Badge>;
      case "info":
        return <Badge variant="outline">Info</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const getDependencyBadge = (type: string) => {
    switch (type) {
      case "major":
        return <Badge variant="destructive">Major</Badge>;
      case "minor":
        return <Badge variant="secondary" className="bg-blue-500">Minor</Badge>;
      case "patch":
        return <Badge variant="outline">Patch</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Code className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Code Formatting, Linters & Productivity Tools</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="linter">Linter Runner</TabsTrigger>
          <TabsTrigger value="formatter">Formatter Profiles</TabsTrigger>
          <TabsTrigger value="snippets">Snippet Library</TabsTrigger>
          <TabsTrigger value="dependencies">Dependency Updater</TabsTrigger>
          <TabsTrigger value="tunnel">Dev Tunneler</TabsTrigger>
        </TabsList>

        <TabsContent value="linter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-language Linter Runner</CardTitle>
              <CardDescription>
                Run ESLint, Flake8, RuboCop, and Stylelint with automatic fixes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript/TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="ruby">Ruby</SelectItem>
                      <SelectItem value="css">CSS/SCSS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linter">Linter</Label>
                  <Select value={linter} onValueChange={setLinter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eslint">ESLint</SelectItem>
                      <SelectItem value="flake8">Flake8</SelectItem>
                      <SelectItem value="rubocop">RuboCop</SelectItem>
                      <SelectItem value="stylelint">Stylelint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Code to Lint</Label>
                <Textarea
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here..."
                  rows={10}
                />
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept=".js,.ts,.jsx,.tsx,.py,.rb,.css,.scss,.sass"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const content = e.target?.result as string;
                          setCode(content);
                          toast.success(`Loaded ${file.name}`);
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
                      input.accept = '.js,.ts,.jsx,.tsx,.py,.rb,.css,.scss,.sass';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const content = e.target?.result as string;
                            setCode(content);
                            toast.success(`Loaded ${file.name}`);
                          };
                          reader.readAsText(file);
                        }
                      };
                      input.click();
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              </div>

              <Button onClick={runLinter} disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Play className="w-4 h-4 mr-2" />
                Run Linter
              </Button>

              {lintResults.length > 0 && (
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Lint Results ({lintResults.length})</h4>
                    <ScrollArea className="h-48 border rounded p-2">
                      {lintResults.map((result, index) => (
                        <div key={index} className="mb-2 p-2 border rounded">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              Line {result.line}, Column {result.column}
                            </span>
                            {getSeverityBadge(result.severity)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                          {result.rule && (
                            <p className="text-xs text-muted-foreground">Rule: {result.rule}</p>
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>
              )}

              {formattedCode && (
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Formatted Code</h4>
                    <ScrollArea className="h-48 border rounded p-2">
                      <pre className="text-sm">{formattedCode}</pre>
                    </ScrollArea>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => copyToClipboard(formattedCode)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Formatted Code
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formatter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Formatter Profiles</CardTitle>
              <CardDescription>
                Custom Prettier and Black configurations with live preview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="formatter">Formatter</Label>
                  <Select value={formatter} onValueChange={setFormatter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prettier">Prettier</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile">Profile</Label>
                  <Input
                    id="profile"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="default"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="formatter-code">Code to Format</Label>
                <Textarea
                  id="formatter-code"
                  value={formatterCode}
                  onChange={(e) => setFormatterCode(e.target.value)}
                  placeholder="Paste your code here..."
                  rows={10}
                />
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept=".js,.ts,.jsx,.tsx,.py,.json,.css,.scss,.sass,.html,.xml,.md"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const content = e.target?.result as string;
                          setFormatterCode(content);
                          toast.success(`Loaded ${file.name}`);
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
                      input.accept = '.js,.ts,.jsx,.tsx,.py,.json,.css,.scss,.sass,.html,.xml,.md';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const content = e.target?.result as string;
                            setFormatterCode(content);
                            toast.success(`Loaded ${file.name}`);
                          };
                          reader.readAsText(file);
                        }
                      };
                      input.click();
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={formatCode} disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Zap className="w-4 h-4 mr-2" />
                  Format Code
                </Button>
                <Button variant="outline" onClick={() => setFormatterCode("")}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="snippets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Snippet Library & Templates</CardTitle>
              <CardDescription>
                Team-shared code snippets, boilerplates, and CLI scaffolds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Search snippets..."
                  value={snippetSearch}
                  onChange={(e) => setSnippetSearch(e.target.value)}
                />
                <Select value={snippetCategory} onValueChange={setSnippetCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={loadSnippets} disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Load Snippets
                </Button>
              </div>

              <ScrollArea className="h-96">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {snippets
                    .filter(snippet =>
                      (snippetCategory === "all" || snippet.category === snippetCategory) &&
                      (snippetSearch === "" ||
                       snippet.name.toLowerCase().includes(snippetSearch.toLowerCase()) ||
                       snippet.description.toLowerCase().includes(snippetSearch.toLowerCase()))
                    )
                    .map((snippet) => (
                      <Card key={snippet.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{snippet.name}</h4>
                            <Badge variant="outline">{snippet.language}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{snippet.description}</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {snippet.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => copyToClipboard(snippet.code)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dependency Updater</CardTitle>
              <CardDescription>
                Scan for outdated dependencies and security vulnerabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="package-json">package.json Content</Label>
                <Textarea
                  id="package-json"
                  value={packageJson}
                  onChange={(e) => setPackageJson(e.target.value)}
                  placeholder='{"dependencies": {"react": "^18.0.0"}}'
                  rows={8}
                />
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const content = e.target?.result as string;
                          setPackageJson(content);
                          toast.success(`Loaded ${file.name}`);
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
                      input.accept = '.json';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const content = e.target?.result as string;
                            setPackageJson(content);
                            toast.success(`Loaded ${file.name}`);
                          };
                          reader.readAsText(file);
                        }
                      };
                      input.click();
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload package.json
                  </Button>
                </div>
              </div>

              <Button onClick={scanDependencies} disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Package className="w-4 h-4 mr-2" />
                Scan Dependencies
              </Button>

              {dependencies.length > 0 && (
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Outdated Dependencies ({dependencies.length})</h4>
                    <ScrollArea className="h-48 border rounded p-2">
                      {dependencies.map((dep, index) => (
                        <div key={index} className="mb-2 p-2 border rounded flex items-center justify-between">
                          <div>
                            <span className="font-medium">{dep.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {dep.current} → {dep.latest}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getDependencyBadge(dep.type)}
                            {dep.vulnerable && (
                              <Badge variant="destructive" className="flex items-center">
                                <Shield className="w-3 h-3 mr-1" />
                                Vulnerable
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>
              )}

              {vulnerabilities.length > 0 && (
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">Security Vulnerabilities ({vulnerabilities.length})</h4>
                    <ScrollArea className="h-48 border rounded p-2">
                      {vulnerabilities.map((vuln, index) => (
                        <div key={index} className="mb-2 p-2 border border-red-200 rounded bg-red-50 dark:bg-red-950">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{vuln.package}</span>
                            <Badge variant="destructive">{vuln.severity}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{vuln.title}</p>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tunnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Local Dev Tunneler</CardTitle>
              <CardDescription>
                Generate commands for ngrok and cloudflared tunnels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service">Tunneling Service</Label>
                  <Select
                    value={tunnelConfig.service}
                    onValueChange={(value: "ngrok" | "cloudflared") =>
                      setTunnelConfig(prev => ({ ...prev, service: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ngrok">ngrok</SelectItem>
                      <SelectItem value="cloudflared">cloudflared</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="port">Local Port</Label>
                  <Input
                    id="port"
                    type="number"
                    value={tunnelConfig.port}
                    onChange={(e) =>
                      setTunnelConfig(prev => ({ ...prev, port: parseInt(e.target.value) || 3000 }))
                    }
                  />
                </div>

                {tunnelConfig.service === "ngrok" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="subdomain">Subdomain (optional)</Label>
                      <Input
                        id="subdomain"
                        value={tunnelConfig.subdomain || ""}
                        onChange={(e) =>
                          setTunnelConfig(prev => ({ ...prev, subdomain: e.target.value }))
                        }
                        placeholder="my-app"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Select
                        value={tunnelConfig.region || "us"}
                        onValueChange={(value) =>
                          setTunnelConfig(prev => ({ ...prev, region: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">US</SelectItem>
                          <SelectItem value="eu">EU</SelectItem>
                          <SelectItem value="ap">Asia Pacific</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="sa">South America</SelectItem>
                          <SelectItem value="jp">Japan</SelectItem>
                          <SelectItem value="in">India</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>

              <Button onClick={generateTunnelCommands} disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Globe className="w-4 h-4 mr-2" />
                Generate Commands
              </Button>

              {tunnelCommands.length > 0 && (
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Tunnel Commands</h4>
                    <ScrollArea className="h-48 border rounded p-2">
                      {tunnelCommands.map((command, index) => (
                        <div key={index} className="mb-2 p-2 bg-gray-50 dark:bg-gray-900 rounded flex items-center justify-between">
                          <code className="text-sm flex-1 mr-2">{command}</code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(command)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}