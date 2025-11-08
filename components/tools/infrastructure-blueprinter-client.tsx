"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { 
  Upload,
  FileCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  GitBranch,
  Eye,
  Download,
  Zap
} from "lucide-react";

interface ValidationIssue {
  severity: "error" | "warning" | "info";
  message: string;
  line?: number;
  resource?: string;
}

interface Resource {
  type: string;
  name: string;
  provider: string;
  dependencies: string[];
}

interface DriftItem {
  resource: string;
  status: "added" | "modified" | "deleted" | "unchanged";
  changes: string[];
}

export default function InfrastructureBlueprinkerClient() {
  const [terraformCode, setTerraformCode] = useState(`resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  
  tags = {
    Name = "WebServer"
    Environment = "Production"
  }
}

resource "aws_security_group" "web_sg" {
  name        = "web-security-group"
  description = "Security group for web server"
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}`);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [driftItems, setDriftItems] = useState<DriftItem[]>([]);
  const [stateFile, setStateFile] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stateInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setTerraformCode(text);
      toast.success(`Loaded ${file.name}`);
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Failed to load Terraform file");
    }
    event.target.value = '';
  }, []);

  const handleStateUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const state = JSON.parse(text);
      setStateFile(state);
      toast.success("State file loaded successfully");
    } catch (error) {
      console.error("State file upload error:", error);
      toast.error("Failed to parse state file");
    }
    event.target.value = '';
  }, []);

  const validateTerraform = useCallback(async () => {
    if (!terraformCode.trim()) {
      toast.error("Please enter Terraform configuration");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/tools/infrastructure-blueprinter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "validate",
          code: terraformCode
        })
      });

      if (!response.ok) throw new Error("Validation failed");

      const data = await response.json();
      setValidationIssues(data.issues);
      
      const errors = data.issues.filter((i: ValidationIssue) => i.severity === "error").length;
      const warnings = data.issues.filter((i: ValidationIssue) => i.severity === "warning").length;

      if (errors === 0) {
        toast.success(`Validation passed with ${warnings} warning(s)`);
      } else {
        toast.error(`Found ${errors} error(s) and ${warnings} warning(s)`);
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Failed to validate Terraform configuration");
    } finally {
      setIsProcessing(false);
    }
  }, [terraformCode]);

  const analyzeResources = useCallback(async () => {
    if (!terraformCode.trim()) {
      toast.error("Please enter Terraform configuration");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/tools/infrastructure-blueprinter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyze",
          code: terraformCode
        })
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setResources(data.resources);
      toast.success(`Found ${data.resources.length} resources`);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze resources");
    } finally {
      setIsProcessing(false);
    }
  }, [terraformCode]);

  const detectDrift = useCallback(async () => {
    if (!stateFile) {
      toast.error("Please upload a state file first");
      return;
    }

    if (!terraformCode.trim()) {
      toast.error("Please enter Terraform configuration");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/tools/infrastructure-blueprinter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "detectDrift",
          code: terraformCode,
          state: stateFile
        })
      });

      if (!response.ok) throw new Error("Drift detection failed");

      const data = await response.json();
      setDriftItems(data.drift);
      
      const changes = data.drift.filter((d: DriftItem) => d.status !== "unchanged").length;
      if (changes === 0) {
        toast.success("No drift detected - infrastructure matches configuration");
      } else {
        toast.warning(`Detected ${changes} resource(s) with drift`);
      }
    } catch (error) {
      console.error("Drift detection error:", error);
      toast.error("Failed to detect drift");
    } finally {
      setIsProcessing(false);
    }
  }, [terraformCode, stateFile]);

  const loadTemplate = (template: "aws" | "azure" | "gcp") => {
    const templates = {
      aws: `# AWS EC2 with VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  
  tags = {
    Name = "main-vpc"
  }
}

resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
  
  tags = {
    Name = "public-subnet"
  }
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public.id
  
  tags = {
    Name = "web-server"
  }
}`,
      azure: `# Azure Virtual Machine
resource "azurerm_resource_group" "main" {
  name     = "example-resources"
  location = "East US"
}

resource "azurerm_virtual_network" "main" {
  name                = "example-network"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_subnet" "internal" {
  name                 = "internal"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.2.0/24"]
}`,
      gcp: `# Google Compute Engine
resource "google_compute_network" "vpc_network" {
  name                    = "terraform-network"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet" {
  name          = "terraform-subnet"
  ip_cidr_range = "10.0.1.0/24"
  region        = "us-central1"
  network       = google_compute_network.vpc_network.id
}

resource "google_compute_instance" "vm_instance" {
  name         = "terraform-instance"
  machine_type = "f1-micro"
  zone         = "us-central1-a"
  
  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }
  
  network_interface {
    subnetwork = google_compute_subnetwork.subnet.id
  }
}`
    };
    
    setTerraformCode(templates[template]);
    toast.success(`Loaded ${template.toUpperCase()} template`);
  };

  const downloadCode = () => {
    const blob = new Blob([terraformCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "main.tf";
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    toast.success("Terraform configuration downloaded");
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Terraform Editor</CardTitle>
          <CardDescription>Edit and validate Infrastructure as Code</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".tf,.hcl"
            onChange={handleFileUpload}
          />

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              disabled={isProcessing}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload .tf File
            </Button>
            <Button onClick={() => loadTemplate("aws")} variant="outline" disabled={isProcessing}>
              AWS Template
            </Button>
            <Button onClick={() => loadTemplate("azure")} variant="outline" disabled={isProcessing}>
              Azure Template
            </Button>
            <Button onClick={() => loadTemplate("gcp")} variant="outline" disabled={isProcessing}>
              GCP Template
            </Button>
            <Button onClick={downloadCode} variant="outline" disabled={isProcessing}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          <Textarea
            value={terraformCode}
            onChange={(e) => setTerraformCode(e.target.value)}
            className="font-mono text-sm min-h-[400px]"
            placeholder="Enter your Terraform configuration..."
          />

          <div className="flex gap-2">
            <Button onClick={validateTerraform} disabled={isProcessing}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Validate
            </Button>
            <Button onClick={analyzeResources} disabled={isProcessing} variant="secondary">
              <GitBranch className="w-4 h-4 mr-2" />
              Analyze Resources
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="validation" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="drift">Drift Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validation Results</CardTitle>
              <CardDescription>Syntax errors, warnings, and best practices</CardDescription>
            </CardHeader>
            <CardContent>
              {validationIssues.length > 0 ? (
                <div className="space-y-2">
                  {validationIssues.map((issue, index) => (
                    <Alert
                      key={index}
                      variant={issue.severity === "error" ? "destructive" : "default"}
                    >
                      {issue.severity === "error" ? (
                        <XCircle className="w-4 h-4" />
                      ) : issue.severity === "warning" ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <span>{issue.message}</span>
                          <div className="flex gap-2">
                            {issue.line && (
                              <Badge variant="outline">Line {issue.line}</Badge>
                            )}
                            {issue.resource && (
                              <Badge variant="secondary">{issue.resource}</Badge>
                            )}
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileCode className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Validate" to check your Terraform configuration.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Analysis</CardTitle>
              <CardDescription>Infrastructure resources and dependencies</CardDescription>
            </CardHeader>
            <CardContent>
              {resources.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Dependencies</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map((resource, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge variant="outline">{resource.type}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{resource.name}</TableCell>
                        <TableCell>
                          <Badge>{resource.provider}</Badge>
                        </TableCell>
                        <TableCell>
                          {resource.dependencies.length > 0 ? (
                            <div className="flex gap-1 flex-wrap">
                              {resource.dependencies.map((dep, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {dep}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">None</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <GitBranch className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Analyze Resources" to see infrastructure breakdown.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drift" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Drift Detection</CardTitle>
              <CardDescription>Compare configuration with actual state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="file"
                ref={stateInputRef}
                className="hidden"
                accept=".tfstate"
                onChange={handleStateUpload}
              />

              <div className="flex gap-2">
                <Button
                  onClick={() => stateInputRef.current?.click()}
                  variant="outline"
                  disabled={isProcessing}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload State File
                </Button>
                <Button onClick={detectDrift} disabled={isProcessing || !stateFile}>
                  <Zap className="w-4 h-4 mr-2" />
                  Detect Drift
                </Button>
              </div>

              {stateFile && (
                <Alert>
                  <CheckCircle2 className="w-4 h-4" />
                  <AlertDescription>
                    State file loaded: Terraform v{stateFile.terraform_version || "unknown"}
                  </AlertDescription>
                </Alert>
              )}

              {driftItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Changes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {driftItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{item.resource}</TableCell>
                        <TableCell>
                          {item.status === "unchanged" ? (
                            <Badge className="bg-green-500">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Unchanged
                            </Badge>
                          ) : item.status === "modified" ? (
                            <Badge variant="secondary">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Modified
                            </Badge>
                          ) : item.status === "added" ? (
                            <Badge className="bg-blue-500">Added</Badge>
                          ) : (
                            <Badge variant="destructive">Deleted</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.changes.length > 0 ? (
                            <div className="space-y-1">
                              {item.changes.map((change, i) => (
                                <p key={i} className="text-sm text-muted-foreground">{change}</p>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Upload a state file and click "Detect Drift" to compare.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
