"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  Upload,
  Download,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Package,
  Zap,
  FileText,
  Settings,
  Play,
  Eye,
  Copy,
  ExternalLink
} from "lucide-react";

interface Dependency {
  name: string;
  currentVersion: string;
  latestVersion: string;
  type: 'direct' | 'dev' | 'peer' | 'optional';
  isOutdated: boolean;
  severity?: 'low' | 'moderate' | 'high' | 'critical';
  vulnerabilities?: Vulnerability[];
  changelog?: string;
  breakingChanges?: boolean;
}

interface Vulnerability {
  id: string;
  title: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  cvssScore: number;
  affectedVersions: string;
  fixedVersions: string;
  references: string[];
}

interface ScanResult {
  dependencies: Dependency[];
  totalDependencies: number;
  outdatedCount: number;
  vulnerableCount: number;
  scanTime: number;
  packageManager: string;
}

const PACKAGE_MANAGERS = [
  { value: 'npm', label: 'NPM' },
  { value: 'yarn', label: 'Yarn' },
  { value: 'pnpm', label: 'PNPM' }
];

const UPDATE_STRATEGIES = [
  { value: 'patch', label: 'Patch Updates (e.g., 1.0.0 → 1.0.1)' },
  { value: 'minor', label: 'Minor Updates (e.g., 1.0.0 → 1.1.0)' },
  { value: 'major', label: 'Major Updates (e.g., 1.0.0 → 2.0.0)' },
  { value: 'latest', label: 'Latest Versions (ignore semver)' }
];

export default function DependencyUpdaterClient() {
  const [packageJson, setPackageJson] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedPackageManager, setSelectedPackageManager] = useState("npm");
  const [updateStrategy, setUpdateStrategy] = useState("minor");
  const [selectedDependencies, setSelectedDependencies] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("scan");

  // Load sample package.json
  const loadSamplePackageJson = () => {
    const sample = {
      name: "sample-project",
      version: "1.0.0",
      dependencies: {
        "react": "^17.0.2",
        "lodash": "^4.17.21",
        "axios": "^0.21.1",
        "moment": "^2.29.1"
      },
      devDependencies: {
        "@types/react": "^17.0.45",
        "typescript": "^4.5.5",
        "eslint": "^7.32.0",
        "jest": "^27.5.1"
      }
    };
    setPackageJson(JSON.stringify(sample, null, 2));
  };

  // Scan dependencies
  const scanDependencies = useCallback(async () => {
    if (!packageJson.trim()) {
      toast.error("Please provide a package.json content");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tools/dependency-updater", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "scan",
          packageJson: JSON.parse(packageJson),
          packageManager: selectedPackageManager
        }),
      });

      const data = await res.json();
      if (data.success) {
        setScanResult(data.result);
        setActiveTab("results");
        toast.success("Dependency scan completed");
      } else {
        toast.error(data.error || "Failed to scan dependencies");
      }
    } catch (e: any) {
      toast.error(`Failed to scan dependencies: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [packageJson, selectedPackageManager]);

  // Update selected dependencies
  const updateDependencies = useCallback(async () => {
    if (selectedDependencies.size === 0) {
      toast.error("Please select dependencies to update");
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch("/api/tools/dependency-updater", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          packageJson: JSON.parse(packageJson),
          packageManager: selectedPackageManager,
          dependencies: Array.from(selectedDependencies),
          strategy: updateStrategy
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPackageJson(JSON.stringify(data.updatedPackageJson, null, 2));
        setSelectedDependencies(new Set());
        toast.success("Dependencies updated successfully");
      } else {
        toast.error(data.error || "Failed to update dependencies");
      }
    } catch (e: any) {
      toast.error(`Failed to update dependencies: ${e.message}`);
    } finally {
      setUpdating(false);
    }
  }, [packageJson, selectedPackageManager, selectedDependencies, updateStrategy]);

  // Generate update commands
  const generateCommands = useCallback(() => {
    if (!scanResult) return [];

    const commands = [];
    const depsToUpdate = scanResult.dependencies.filter(dep =>
      selectedDependencies.has(dep.name) && dep.isOutdated
    );

    if (selectedPackageManager === 'npm') {
      depsToUpdate.forEach(dep => {
        commands.push(`npm update ${dep.name}`);
      });
      if (depsToUpdate.length > 0) {
        commands.push(`npm audit fix`);
      }
    } else if (selectedPackageManager === 'yarn') {
      depsToUpdate.forEach(dep => {
        commands.push(`yarn upgrade ${dep.name}`);
      });
      if (depsToUpdate.length > 0) {
        commands.push(`yarn audit`);
      }
    } else if (selectedPackageManager === 'pnpm') {
      depsToUpdate.forEach(dep => {
        commands.push(`pnpm update ${dep.name}`);
      });
      if (depsToUpdate.length > 0) {
        commands.push(`pnpm audit`);
      }
    }

    return commands;
  }, [scanResult, selectedDependencies, selectedPackageManager]);

  // Copy commands to clipboard
  const copyCommands = useCallback(async () => {
    const commands = generateCommands();
    if (commands.length === 0) {
      toast.error("No commands to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(commands.join('\n'));
      toast.success("Commands copied to clipboard");
    } catch (e) {
      toast.error("Failed to copy commands");
    }
  }, [generateCommands]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setPackageJson(content);
      };
      reader.readAsText(file);
    }
  };

  // Toggle dependency selection
  const toggleDependency = (depName: string) => {
    const newSelected = new Set(selectedDependencies);
    if (newSelected.has(depName)) {
      newSelected.delete(depName);
    } else {
      newSelected.add(depName);
    }
    setSelectedDependencies(newSelected);
  };

  // Select all outdated dependencies
  const selectAllOutdated = () => {
    if (!scanResult) return;
    const outdatedDeps = scanResult.dependencies
      .filter(dep => dep.isOutdated)
      .map(dep => dep.name);
    setSelectedDependencies(new Set(outdatedDeps));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedDependencies(new Set());
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'critical':
      case 'high': return <XCircle className="h-4 w-4" />;
      case 'moderate': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <Shield className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scan">Scan Dependencies</TabsTrigger>
          <TabsTrigger value="results" disabled={!scanResult}>Results</TabsTrigger>
          <TabsTrigger value="update" disabled={!scanResult}>Update</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-6 h-6" />
                <span>Package.json Input</span>
              </CardTitle>
              <CardDescription>
                Upload your package.json file or paste its contents to scan for outdated dependencies and security vulnerabilities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="package-manager">Package Manager</Label>
                  <Select value={selectedPackageManager} onValueChange={setSelectedPackageManager}>
                    <SelectTrigger id="package-manager">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PACKAGE_MANAGERS.map(manager => (
                        <SelectItem key={manager.value} value={manager.value}>
                          {manager.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload package.json</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="package-json">package.json Content</Label>
                  <Button variant="outline" size="sm" onClick={loadSamplePackageJson}>
                    Load Sample
                  </Button>
                </div>
                <Textarea
                  id="package-json"
                  rows={15}
                  className="font-mono text-sm"
                  placeholder="Paste your package.json content here..."
                  value={packageJson}
                  onChange={(e) => setPackageJson(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={scanDependencies} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Scan Dependencies
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {scanResult && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Dependencies</p>
                        <p className="font-semibold">{scanResult.totalDependencies}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Outdated</p>
                        <p className="font-semibold">{scanResult.outdatedCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Vulnerable</p>
                        <p className="font-semibold">{scanResult.vulnerableCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Scan Time</p>
                        <p className="font-semibold">{scanResult.scanTime}ms</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Dependencies Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Dependencies Analysis</CardTitle>
                  <CardDescription>
                    Review your dependencies for updates and security issues.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Package</TableHead>
                        <TableHead>Current</TableHead>
                        <TableHead>Latest</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Vulnerabilities</TableHead>
                        <TableHead>Select</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scanResult.dependencies.map((dep) => (
                        <TableRow key={dep.name}>
                          <TableCell className="font-medium">{dep.name}</TableCell>
                          <TableCell>{dep.currentVersion}</TableCell>
                          <TableCell>{dep.latestVersion}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{dep.type}</Badge>
                          </TableCell>
                          <TableCell>
                            {dep.isOutdated ? (
                              <Badge variant="secondary">Outdated</Badge>
                            ) : (
                              <Badge variant="default">Up to date</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {dep.vulnerabilities && dep.vulnerabilities.length > 0 ? (
                              <div className="flex items-center space-x-2">
                                {getSeverityIcon(dep.severity)}
                                <span className="text-sm">{dep.vulnerabilities.length} issues</span>
                              </div>
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </TableCell>
                          <TableCell>
                            {dep.isOutdated && (
                              <input
                                type="checkbox"
                                checked={selectedDependencies.has(dep.name)}
                                onChange={() => toggleDependency(dep.name)}
                                className="rounded"
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Vulnerabilities Details */}
              {scanResult.dependencies.some(dep => dep.vulnerabilities && dep.vulnerabilities.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span>Security Vulnerabilities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {scanResult.dependencies
                      .filter(dep => dep.vulnerabilities && dep.vulnerabilities.length > 0)
                      .map(dep => (
                        <div key={dep.name} className="space-y-2">
                          <h4 className="font-semibold">{dep.name}</h4>
                          {dep.vulnerabilities?.map(vuln => (
                            <Alert key={vuln.id}>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <div className="space-y-1">
                                  <p className="font-medium">{vuln.title}</p>
                                  <p className="text-sm">{vuln.description}</p>
                                  <div className="flex items-center space-x-4 text-xs">
                                    <span>Severity: <Badge className={getSeverityColor(vuln.severity)}>{vuln.severity}</Badge></span>
                                    <span>CVSS: {vuln.cvssScore}</span>
                                    <span>Affected: {vuln.affectedVersions}</span>
                                  </div>
                                </div>
                              </AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="update" className="space-y-6">
          {scanResult && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Update Configuration</CardTitle>
                  <CardDescription>
                    Configure how you want to update your selected dependencies.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Update Strategy</Label>
                      <Select value={updateStrategy} onValueChange={setUpdateStrategy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {UPDATE_STRATEGIES.map(strategy => (
                            <SelectItem key={strategy.value} value={strategy.value}>
                              {strategy.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Selected Dependencies</Label>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={selectAllOutdated}>
                          Select All Outdated
                        </Button>
                        <Button variant="outline" size="sm" onClick={clearSelection}>
                          Clear Selection
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Selected for Update ({selectedDependencies.size})</Label>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(selectedDependencies).map(dep => (
                        <Badge key={dep} variant="secondary" className="cursor-pointer" onClick={() => toggleDependency(dep)}>
                          {dep} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={updateDependencies} disabled={updating || selectedDependencies.size === 0}>
                      {updating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Update Dependencies
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={copyCommands} disabled={selectedDependencies.size === 0}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Commands
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Generated Commands */}
              {selectedDependencies.size > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Generated Commands</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                      {generateCommands().map((cmd, index) => (
                        <div key={index} className="mb-1">{cmd}</div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Updated package.json */}
              <Card>
                <CardHeader>
                  <CardTitle>Updated package.json</CardTitle>
                  <CardDescription>
                    The updated package.json content after applying the selected updates.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    rows={15}
                    className="font-mono text-sm"
                    value={packageJson}
                    onChange={(e) => setPackageJson(e.target.value)}
                    readOnly
                  />
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={() => {
                      navigator.clipboard.writeText(packageJson);
                      toast.success("package.json copied to clipboard");
                    }}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}