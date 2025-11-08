"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { 
  Upload,
  Search,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  Package,
  Layers
} from "lucide-react";
import { LicenseInfo } from "@/types";

interface Vulnerability {
  cve: string;
  severity: "critical" | "high" | "medium" | "low";
  package: string;
  version: string;
  fixedVersion?: string;
  description: string;
}

interface Layer {
  id: string;
  size: string;
  command: string;
  created: string;
}

interface SBOMPackage extends LicenseInfo {
  name: string;
  version: string;
  type: string;
}

export default function ContainerImageScannerClient() {
  const [imageName, setImageName] = useState("nginx:latest");
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [sbomPackages, setSbomPackages] = useState<SBOMPackage[]>([]);
  const [imageInfo, setImageInfo] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast.info("File upload for tarball scanning will be implemented in production");
    event.target.value = '';
  }, []);

  const scanImage = useCallback(async () => {
    if (!imageName.trim()) {
      toast.error("Please enter an image name");
      return;
    }

    setIsScanning(true);
    setVulnerabilities([]);
    setImageInfo(null);

    try {
      const response = await fetch("/api/tools/container-image-scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "scan",
          imageName
        })
      });

      if (!response.ok) throw new Error("Scan failed");

      const data = await response.json();
      setVulnerabilities(data.vulnerabilities);
      setImageInfo(data.imageInfo);
      
      const critical = data.vulnerabilities.filter((v: Vulnerability) => v.severity === "critical").length;
      const high = data.vulnerabilities.filter((v: Vulnerability) => v.severity === "high").length;

      if (critical > 0 || high > 0) {
        toast.error(`Found ${critical} critical and ${high} high severity vulnerabilities`);
      } else {
        toast.success("Scan complete - no critical vulnerabilities found");
      }
    } catch (error) {
      console.error("Scan error:", error);
      toast.error("Failed to scan image");
    } finally {
      setIsScanning(false);
    }
  }, [imageName]);

  const analyzeLayers = useCallback(async () => {
    if (!imageName.trim()) {
      toast.error("Please enter an image name");
      return;
    }

    setIsScanning(true);
    try {
      const response = await fetch("/api/tools/container-image-scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyzeLayers",
          imageName
        })
      });

      if (!response.ok) throw new Error("Layer analysis failed");

      const data = await response.json();
      setLayers(data.layers);
      toast.success(`Found ${data.layers.length} layers`);
    } catch (error) {
      console.error("Layer analysis error:", error);
      toast.error("Failed to analyze layers");
    } finally {
      setIsScanning(false);
    }
  }, [imageName]);

  const generateSBOM = useCallback(async () => {
    if (!imageName.trim()) {
      toast.error("Please enter an image name");
      return;
    }

    setIsScanning(true);
    try {
      const response = await fetch("/api/tools/container-image-scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generateSBOM",
          imageName
        })
      });

      if (!response.ok) throw new Error("SBOM generation failed");

      const data = await response.json();
      setSbomPackages(data.packages);
      toast.success(`Generated SBOM with ${data.packages.length} packages`);
    } catch (error) {
      console.error("SBOM generation error:", error);
      toast.error("Failed to generate SBOM");
    } finally {
      setIsScanning(false);
    }
  }, [imageName]);

  const downloadReport = () => {
    const report = {
      image: imageName,
      scanDate: new Date().toISOString(),
      imageInfo,
      vulnerabilities,
      summary: {
        total: vulnerabilities.length,
        critical: vulnerabilities.filter(v => v.severity === "critical").length,
        high: vulnerabilities.filter(v => v.severity === "high").length,
        medium: vulnerabilities.filter(v => v.severity === "medium").length,
        low: vulnerabilities.filter(v => v.severity === "low").length
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scan-report-${Date.now()}.json`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    toast.success("Report downloaded");
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Image Scanner</CardTitle>
          <CardDescription>Scan container images for vulnerabilities and security issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".tar,.tar.gz"
            onChange={handleFileUpload}
          />

          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="image-name">Image Name</Label>
              <Input
                id="image-name"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                placeholder="nginx:latest, ubuntu:22.04, node:18-alpine"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={scanImage} disabled={isScanning}>
              <Search className="w-4 h-4 mr-2" />
              {isScanning ? "Scanning..." : "Scan for Vulnerabilities"}
            </Button>
            <Button onClick={analyzeLayers} disabled={isScanning} variant="secondary">
              <Layers className="w-4 h-4 mr-2" />
              Analyze Layers
            </Button>
            <Button onClick={generateSBOM} disabled={isScanning} variant="secondary">
              <Package className="w-4 h-4 mr-2" />
              Generate SBOM
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              disabled={isScanning}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Tarball
            </Button>
          </div>

          {imageInfo && (
            <Alert>
              <CheckCircle2 className="w-4 h-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>
                    Image: <strong>{imageInfo.name}</strong>
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="outline">{imageInfo.size}</Badge>
                    <Badge variant="secondary">{imageInfo.os}/{imageInfo.arch}</Badge>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="vulnerabilities" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="layers">Layers</TabsTrigger>
          <TabsTrigger value="sbom">SBOM</TabsTrigger>
        </TabsList>

        <TabsContent value="vulnerabilities" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Security Vulnerabilities</CardTitle>
                  <CardDescription>CVEs and security issues detected</CardDescription>
                </div>
                {vulnerabilities.length > 0 && (
                  <Button onClick={downloadReport} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {vulnerabilities.length > 0 ? (
                <>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Critical</p>
                          <p className="text-2xl font-bold text-red-600">
                            {vulnerabilities.filter(v => v.severity === "critical").length}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">High</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {vulnerabilities.filter(v => v.severity === "high").length}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Medium</p>
                          <p className="text-2xl font-bold text-yellow-600">
                            {vulnerabilities.filter(v => v.severity === "medium").length}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Low</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {vulnerabilities.filter(v => v.severity === "low").length}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>CVE</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Fix Available</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vulnerabilities.map((vuln, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">{vuln.cve}</TableCell>
                          <TableCell>
                            {vuln.severity === "critical" ? (
                              <Badge variant="destructive">
                                <XCircle className="w-3 h-3 mr-1" />
                                Critical
                              </Badge>
                            ) : vuln.severity === "high" ? (
                              <Badge className="bg-orange-500">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                High
                              </Badge>
                            ) : vuln.severity === "medium" ? (
                              <Badge className="bg-yellow-500">Medium</Badge>
                            ) : (
                              <Badge variant="secondary">Low</Badge>
                            )}
                          </TableCell>
                          <TableCell>{vuln.package}</TableCell>
                          <TableCell className="font-mono text-sm">{vuln.version}</TableCell>
                          <TableCell>
                            {vuln.fixedVersion ? (
                              <Badge className="bg-green-500">{vuln.fixedVersion}</Badge>
                            ) : (
                              <span className="text-muted-foreground">No fix</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click &quot;Scan for Vulnerabilities&quot; to analyze the image.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Image Layers</CardTitle>
              <CardDescription>Layer-by-layer breakdown of the container image</CardDescription>
            </CardHeader>
            <CardContent>
              {layers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Layer ID</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Command</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {layers.map((layer, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-xs">{layer.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{layer.size}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs max-w-md truncate">
                          {layer.command}
                        </TableCell>
                        <TableCell className="text-sm">{layer.created}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click &quot;Analyze Layers&quot; to see image layer breakdown.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sbom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Software Bill of Materials (SBOM)</CardTitle>
              <CardDescription>All packages and dependencies in the image</CardDescription>
            </CardHeader>
            <CardContent>
              {sbomPackages.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Package</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>License</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sbomPackages.map((pkg, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{pkg.name}</TableCell>
                        <TableCell className="font-mono text-sm">{pkg.version}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{pkg.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {pkg.license ? (
                            <Badge variant="secondary">{pkg.license}</Badge>
                          ) : (
                            <span className="text-muted-foreground">Unknown</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click &quot;Generate SBOM&quot; to create Software Bill of Materials.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
