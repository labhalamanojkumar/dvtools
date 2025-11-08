"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { 
  Upload, 
  Play,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileCode,
  Activity,
  Clock,
  Download
} from "lucide-react";

interface ContractInteraction {
  description: string;
  request: {
    method: string;
    path: string;
    headers?: Record<string, string>;
    body?: any;
  };
  response: {
    status: number;
    headers?: Record<string, string>;
    body?: any;
  };
}

interface Contract {
  consumer: { name: string };
  provider: { name: string };
  interactions: ContractInteraction[];
  metadata?: {
    pactSpecification: { version: string };
  };
}

interface TestResult {
  interaction: string;
  status: "passed" | "failed";
  expected: any;
  actual: any;
  differences: string[];
  duration: number;
}

export default function ContractTestingClient() {
  const [contract, setContract] = useState<Contract | null>(null);
  const [providerUrl, setProviderUrl] = useState("https://api.example.com");
  const [isProcessing, setIsProcessing] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsedContract = JSON.parse(text);

      // Validate contract structure
      if (!parsedContract.consumer || !parsedContract.provider || !parsedContract.interactions) {
        toast.error("Invalid contract file format");
        return;
      }

      setContract(parsedContract);
      toast.success(`Contract loaded: ${parsedContract.consumer.name} ↔ ${parsedContract.provider.name}`);
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Failed to parse contract file");
    }
  }, []);

  const runContractTests = useCallback(async () => {
    if (!contract) {
      toast.error("Please upload a contract file first");
      return;
    }

    if (!providerUrl.trim()) {
      toast.error("Provider URL is required");
      return;
    }

    setIsProcessing(true);
    setTestResults([]);

    try {
      const response = await fetch("/api/tools/contract-testing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "runTests",
          contract,
          providerUrl
        })
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(`Test execution failed: ${error.error}`);
        return;
      }

      const result = await response.json();
      setTestResults(result.results);
      
      const passedCount = result.results.filter((r: TestResult) => r.status === "passed").length;
      const failedCount = result.results.filter((r: TestResult) => r.status === "failed").length;

      if (failedCount === 0) {
        toast.success(`All ${passedCount} tests passed!`);
      } else {
        toast.error(`${failedCount} of ${result.results.length} tests failed`);
      }
    } catch (error) {
      console.error("Test execution error:", error);
      toast.error("Failed to execute contract tests");
    } finally {
      setIsProcessing(false);
    }
  }, [contract, providerUrl]);

  const downloadResults = useCallback(() => {
    if (testResults.length === 0) {
      toast.error("No test results to download");
      return;
    }

    const report = {
      consumer: contract?.consumer.name,
      provider: contract?.provider.name,
      timestamp: new Date().toISOString(),
      summary: {
        total: testResults.length,
        passed: testResults.filter(r => r.status === "passed").length,
        failed: testResults.filter(r => r.status === "failed").length
      },
      results: testResults
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contract-test-results-${Date.now()}.json`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    toast.success("Test results downloaded");
  }, [testResults, contract]);

  const loadSampleContract = () => {
    const sample: Contract = {
      consumer: { name: "FrontendApp" },
      provider: { name: "BackendAPI" },
      interactions: [
        {
          description: "Get all users",
          request: {
            method: "GET",
            path: "/api/users",
            headers: { "Accept": "application/json" }
          },
          response: {
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: [
              { id: 1, name: "User 1", email: "user1@example.com" }
            ]
          }
        },
        {
          description: "Create a new user",
          request: {
            method: "POST",
            path: "/api/users",
            headers: { "Content-Type": "application/json" },
            body: { name: "New User", email: "new@example.com" }
          },
          response: {
            status: 201,
            headers: { "Content-Type": "application/json" },
            body: { id: 2, name: "New User", email: "new@example.com" }
          }
        }
      ],
      metadata: {
        pactSpecification: { version: "2.0.0" }
      }
    };

    setContract(sample);
    toast.success("Sample contract loaded");
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contract Setup</CardTitle>
              <CardDescription>Upload contract file and configure provider</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json"
                onChange={handleFileUpload}
              />

              <div className="flex gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  disabled={isProcessing}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Contract File
                </Button>
                <Button
                  onClick={loadSampleContract}
                  variant="outline"
                  disabled={isProcessing}
                >
                  <FileCode className="w-4 h-4 mr-2" />
                  Load Sample
                </Button>
              </div>

              {contract && (
                <Alert>
                  <CheckCircle2 className="w-4 h-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>
                        Contract loaded: <strong>{contract.consumer.name}</strong> ↔ <strong>{contract.provider.name}</strong>
                      </span>
                      <Badge variant="secondary">
                        {contract.interactions.length} interactions
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="provider-url">Provider Base URL</Label>
                <Input
                  id="provider-url"
                  value={providerUrl}
                  onChange={(e) => setProviderUrl(e.target.value)}
                  placeholder="https://api.example.com"
                  disabled={isProcessing}
                />
                <p className="text-sm text-muted-foreground">
                  The base URL of the provider API to test against
                </p>
              </div>

              {contract && (
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Contract Interactions</Label>
                  <div className="space-y-2">
                    {contract.interactions.map((interaction, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">
                              {interaction.request.method}
                            </Badge>
                            <code className="text-sm">{interaction.request.path}</code>
                            <Badge variant="secondary" className="ml-auto">
                              {interaction.response.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {interaction.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={runContractTests}
                disabled={isProcessing || !contract}
                className="w-full"
                size="lg"
              >
                <Play className="w-4 h-4 mr-2" />
                {isProcessing ? "Running Tests..." : "Run Contract Tests"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Test Results</CardTitle>
                  <CardDescription>Contract validation results</CardDescription>
                </div>
                {testResults.length > 0 && (
                  <Button onClick={downloadResults} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {testResults.length > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Total Tests</p>
                          <p className="text-2xl font-bold">{testResults.length}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Passed</p>
                          <p className="text-2xl font-bold text-green-600">
                            {testResults.filter(r => r.status === "passed").length}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Failed</p>
                          <p className="text-2xl font-bold text-red-600">
                            {testResults.filter(r => r.status === "failed").length}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Interaction</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testResults.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell>{result.interaction}</TableCell>
                          <TableCell>
                            {result.status === "passed" ? (
                              <Badge className="bg-green-500">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Passed
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="w-3 h-3 mr-1" />
                                Failed
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {result.duration}ms
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedResult(result)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No test results yet. Run contract tests to see results here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Details</CardTitle>
              <CardDescription>Detailed comparison of expected vs actual responses</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedResult ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <h3 className="font-semibold text-lg">{selectedResult.interaction}</h3>
                    {selectedResult.status === "passed" ? (
                      <Badge className="bg-green-500">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Passed
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        Failed
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Expected Response</h4>
                      <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                        {JSON.stringify(selectedResult.expected, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Actual Response</h4>
                      <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                        {JSON.stringify(selectedResult.actual, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {selectedResult.differences.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Differences Found</h4>
                      <div className="space-y-2">
                        {selectedResult.differences.map((diff, index) => (
                          <Alert key={index} variant="destructive">
                            <AlertCircle className="w-4 h-4" />
                            <AlertDescription>{diff}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileCode className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a test result to view detailed comparison.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
