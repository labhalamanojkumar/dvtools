"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Shield, AlertTriangle, CheckCircle, XCircle, Download, Globe, FileText, Zap } from "lucide-react";

interface SecurityHeader {
  name: string;
  value: string;
  status: "present" | "missing" | "insecure";
  severity: "critical" | "high" | "medium" | "low";
  recommendation: string;
  description: string;
}

interface CspIssue {
  type: "directive" | "syntax" | "security";
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  directive?: string;
  recommendation: string;
}

interface ScanResult {
  url: string;
  securityScore: number;
  headers: SecurityHeader[];
  cspPolicy: string | null;
  cspIssues: CspIssue[];
  mixedContent: string[];
  scanTime: number;
  overallRisk: "critical" | "high" | "medium" | "low";
}

const TEST_OPTIONS = [
  { id: "headers", label: "Security Headers", checked: true },
  { id: "csp", label: "Content Security Policy", checked: true },
  { id: "mixed_content", label: "Mixed Content", checked: true },
  { id: "xss_protection", label: "XSS Protection", checked: true },
  { id: "csrf_protection", label: "CSRF Protection", checked: true },
];

export default function CspSecurityHeadersTesterClient() {
  const [url, setUrl] = useState("");
  const [cspPolicy, setCspPolicy] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(TEST_OPTIONS);
  const [error, setError] = useState<string | null>(null);

  const analyzeUrl = async () => {
    if (!url.trim()) {
      setError("Please enter a URL to test.");
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setError(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => Math.min(prev + 15, 90));
      }, 200);

      const response = await fetch("/api/tools/csp-security-headers-tester", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
          testOptions: selectedOptions.filter(o => o.checked).map(o => o.id),
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Failed to analyze security headers");
      }

      const result = await response.json();
      setScanResult(result);
      setScanProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis");
      setScanProgress(0);
    } finally {
      setIsScanning(false);
    }
  };

  const analyzeCspPolicy = async () => {
    if (!cspPolicy.trim()) {
      setError("Please enter a CSP policy to analyze.");
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setError(null);

    try {
      const progressInterval = setInterval(() => {
        setScanProgress(prev => Math.min(prev + 25, 90));
      }, 150);

      const response = await fetch("/api/tools/csp-security-headers-tester", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cspPolicy: cspPolicy.trim(),
          testOptions: ["csp"],
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Failed to analyze CSP policy");
      }

      const result = await response.json();
      setScanResult(result);
      setScanProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during CSP analysis");
      setScanProgress(0);
    } finally {
      setIsScanning(false);
    }
  };

  const exportResults = () => {
    if (!scanResult) return;

    const dataStr = JSON.stringify(scanResult, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "security-headers-analysis.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-600";
      case "high": return "bg-red-500";
      case "medium": return "bg-orange-500";
      case "low": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present": return "bg-green-500";
      case "missing": return "bg-red-500";
      case "insecure": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical": return "text-red-600";
      case "high": return "text-orange-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Analysis Input
          </CardTitle>
          <CardDescription>
            Test website security headers or analyze CSP policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">URL Analysis</TabsTrigger>
              <TabsTrigger value="csp">CSP Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div>
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Enter the full URL including https:// or http://
                </p>
              </div>
            </TabsContent>

            <TabsContent value="csp" className="space-y-4">
              <div>
                <Label htmlFor="csp">Content Security Policy</Label>
                <Textarea
                  id="csp"
                  placeholder="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.example.com; style-src 'self' 'unsafe-inline';"
                  value={cspPolicy}
                  onChange={(e) => setCspPolicy(e.target.value)}
                  className="min-h-[100px] font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Paste your CSP policy header value for analysis
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Test Options */}
      <Card>
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
          <CardDescription>
            Select security aspects to analyze
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {selectedOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={option.checked}
                  onCheckedChange={(checked) => {
                    setSelectedOptions(prev =>
                      prev.map(o => o.id === option.id ? { ...o, checked: !!checked } : o)
                    );
                  }}
                />
                <Label htmlFor={option.id} className="text-sm font-medium">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scan Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={analyzeUrl}
          disabled={isScanning || !url.trim()}
          size="lg"
          className="px-8"
        >
          {isScanning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Globe className="w-4 h-4 mr-2" />
              Analyze URL
            </>
          )}
        </Button>

        <Button
          onClick={analyzeCspPolicy}
          disabled={isScanning || !cspPolicy.trim()}
          variant="outline"
          size="lg"
          className="px-8"
        >
          <FileText className="w-4 h-4 mr-2" />
          Analyze CSP
        </Button>
      </div>

      {/* Progress Bar */}
      {isScanning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing security configuration...</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Section */}
      {scanResult && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Analysis Summary
                  </CardTitle>
                  <CardDescription>
                    {scanResult.url && `Analysis of ${scanResult.url}`}
                    {scanResult.cspPolicy && "CSP Policy Analysis"}
                    {scanResult.scanTime && ` (completed in ${scanResult.scanTime}ms)`}
                  </CardDescription>
                </div>
                <Button onClick={exportResults} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Results
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {scanResult.headers.filter(h => h.status === "present").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Secure Headers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {scanResult.headers.filter(h => h.status === "missing").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Missing Headers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {scanResult.cspIssues.filter(i => i.severity === "high" || i.severity === "critical").length}
                  </div>
                  <div className="text-sm text-muted-foreground">CSP Issues</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getRiskColor(scanResult.overallRisk)}`}>
                    {scanResult.securityScore}/100
                  </div>
                  <div className="text-sm text-muted-foreground">Security Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <Tabs defaultValue="headers" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="headers">
                Headers ({scanResult.headers.length})
              </TabsTrigger>
              <TabsTrigger value="csp">
                CSP Issues ({scanResult.cspIssues.length})
              </TabsTrigger>
              <TabsTrigger value="mixed">
                Mixed Content ({scanResult.mixedContent.length})
              </TabsTrigger>
              <TabsTrigger value="recommendations">
                Recommendations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="headers" className="space-y-4">
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {scanResult.headers.map((header, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(header.status)}>
                              {header.status.toUpperCase()}
                            </Badge>
                            <Badge className={getSeverityColor(header.severity)}>
                              {header.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <span className="text-sm font-medium">{header.name}</span>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">{header.description}</p>

                          {header.value && (
                            <div>
                              <Label className="text-sm font-medium">Current Value:</Label>
                              <code className="text-sm bg-muted p-2 rounded mt-1 block break-all">
                                {header.value}
                              </code>
                            </div>
                          )}

                          <div>
                            <Label className="text-sm font-medium">Recommendation:</Label>
                            <p className="text-sm text-muted-foreground mt-1">{header.recommendation}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="csp" className="space-y-4">
              {scanResult.cspIssues.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                      <h3 className="text-lg font-semibold mb-2">No CSP issues found!</h3>
                      <p className="text-muted-foreground">
                        Your CSP policy appears to be well-configured.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {scanResult.cspIssues.map((issue, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Badge className={getSeverityColor(issue.severity)}>
                              {issue.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{issue.type}</Badge>
                            {issue.directive && (
                              <Badge variant="secondary">{issue.directive}</Badge>
                            )}
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-medium">{issue.message}</p>
                            <div>
                              <Label className="text-sm font-medium">Recommendation:</Label>
                              <p className="text-sm text-muted-foreground mt-1">{issue.recommendation}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="mixed" className="space-y-4">
              {scanResult.mixedContent.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                      <h3 className="text-lg font-semibold mb-2">No mixed content detected!</h3>
                      <p className="text-muted-foreground">
                        All resources are loaded securely over HTTPS.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {scanResult.mixedContent.map((resource, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-medium">Mixed Content Resource</span>
                          </div>
                          <code className="text-sm bg-muted p-2 rounded block break-all">
                            {resource}
                          </code>
                          <p className="text-sm text-muted-foreground mt-2">
                            This resource is loaded over HTTP on an HTTPS page, which could compromise security.
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Security Hardening Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Critical Security Headers</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Strict-Transport-Security: max-age=31536000; includeSubDomains</li>
                      <li>• X-Frame-Options: DENY or SAMEORIGIN</li>
                      <li>• X-Content-Type-Options: nosniff</li>
                      <li>• Referrer-Policy: strict-origin-when-cross-origin</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">CSP Best Practices</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Use 'strict-dynamic' with nonces for script execution</li>
                      <li>• Avoid 'unsafe-inline' and 'unsafe-eval'</li>
                      <li>• Implement 'default-src' as fallback</li>
                      <li>• Use 'report-uri' for violation monitoring</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Additional Protections</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Permissions-Policy: Restrict browser features</li>
                      <li>• Cross-Origin policies for isolation</li>
                      <li>• Regular security header audits</li>
                      <li>• Monitor CSP violation reports</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}