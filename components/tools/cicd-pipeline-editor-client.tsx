"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Upload,
  Download,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Package,
  GitBranch
} from "lucide-react";

interface PipelineJob {
  name: string;
  stage: string;
  status: "success" | "failed" | "running" | "pending";
  duration?: string;
  startedAt?: string;
}

interface PipelineRun {
  id: string;
  status: "success" | "failed" | "running" | "pending";
  branch: string;
  commit: string;
  duration: string;
  startedAt: string;
  jobs: PipelineJob[];
}

interface Artifact {
  name: string;
  size: string;
  type: string;
  job: string;
  createdAt: string;
}

export default function CICDPipelineEditorClient() {
  const [pipelineConfig, setPipelineConfig] = useState(`# GitLab CI Example
stages:
  - build
  - test
  - deploy

build-job:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/

test-job:
  stage: test
  script:
    - npm run test
    - npm run lint
  coverage: '/Coverage: \\d+\\.\\d+/'

deploy-job:
  stage: deploy
  script:
    - ./deploy.sh
  only:
    - main
`);
  const [platform, setPlatform] = useState<"gitlab" | "github" | "jenkins">("gitlab");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [pipelineRuns, setPipelineRuns] = useState<PipelineRun[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setPipelineConfig(content);
      toast.success("Pipeline configuration loaded");
    };
    reader.readAsText(file);
    event.target.value = '';
  }, []);

  const validatePipeline = useCallback(async () => {
    setIsProcessing(true);
    setValidationErrors([]);

    try {
      const response = await fetch("/api/tools/cicd-pipeline-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "validate",
          config: pipelineConfig,
          platform
        })
      });

      if (!response.ok) throw new Error("Validation failed");

      const data = await response.json();
      setValidationErrors(data.errors);

      if (data.errors.length === 0) {
        toast.success("Pipeline configuration is valid");
      } else {
        toast.error(`Found ${data.errors.length} validation errors`);
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Failed to validate pipeline");
    } finally {
      setIsProcessing(false);
    }
  }, [pipelineConfig, platform]);

  const loadRunHistory = useCallback(async () => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/cicd-pipeline-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getRunHistory",
          platform
        })
      });

      if (!response.ok) throw new Error("Failed to load run history");

      const data = await response.json();
      setPipelineRuns(data.runs);
      toast.success("Run history loaded");
    } catch (error) {
      console.error("Load run history error:", error);
      toast.error("Failed to load run history");
    } finally {
      setIsProcessing(false);
    }
  }, [platform]);

  const loadArtifacts = useCallback(async () => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/cicd-pipeline-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getArtifacts",
          platform
        })
      });

      if (!response.ok) throw new Error("Failed to load artifacts");

      const data = await response.json();
      setArtifacts(data.artifacts);
      toast.success("Artifacts loaded");
    } catch (error) {
      console.error("Load artifacts error:", error);
      toast.error("Failed to load artifacts");
    } finally {
      setIsProcessing(false);
    }
  }, [platform]);

  const loadTemplate = (templateType: "gitlab" | "github" | "jenkins") => {
    const templates = {
      gitlab: `# GitLab CI Pipeline
stages:
  - build
  - test
  - deploy

build-job:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/

test-job:
  stage: test
  script:
    - npm run test
  coverage: '/Coverage: \\d+\\.\\d+/'

deploy-production:
  stage: deploy
  script:
    - ./deploy.sh production
  only:
    - main
  when: manual
`,
      github: `# GitHub Actions Workflow
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: dist/

  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm test

  deploy:
    runs-on: ubuntu-latest
    needs: [build, test]
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: ./deploy.sh
`,
      jenkins: `// Jenkins Pipeline
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm run test'
                sh 'npm run lint'
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh './deploy.sh production'
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'dist/**', fingerprint: true
        }
    }
}
`
    };

    setPipelineConfig(templates[templateType]);
    setPlatform(templateType);
    toast.success(`${templateType.charAt(0).toUpperCase() + templateType.slice(1)} template loaded`);
  };

  const downloadConfig = () => {
    const filename = platform === "gitlab" ? ".gitlab-ci.yml" : 
                     platform === "github" ? "workflow.yml" : 
                     "Jenkinsfile";
    
    const blob = new Blob([pipelineConfig], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    toast.success("Pipeline configuration downloaded");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "running":
        return <Play className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Configuration</CardTitle>
          <CardDescription>Edit and validate your CI/CD pipeline configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".yml,.yaml"
            onChange={handleFileUpload}
          />

          <div className="flex gap-2 flex-wrap">
            <Select value={platform} onValueChange={(v: any) => setPlatform(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gitlab">GitLab CI</SelectItem>
                <SelectItem value="github">GitHub Actions</SelectItem>
                <SelectItem value="jenkins">Jenkins</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Config
            </Button>

            <Button onClick={() => loadTemplate(platform)} variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Load Template
            </Button>

            <Button onClick={validatePipeline} disabled={isProcessing}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Validate
            </Button>

            <Button onClick={downloadConfig} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          <Textarea
            value={pipelineConfig}
            onChange={(e) => setPipelineConfig(e.target.value)}
            className="font-mono text-sm min-h-[400px]"
            placeholder="Paste your pipeline configuration here..."
          />

          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-semibold">Validation Errors:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history">Run History</TabsTrigger>
          <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pipeline Runs</CardTitle>
                  <CardDescription>View execution history and job status</CardDescription>
                </div>
                <Button onClick={loadRunHistory} disabled={isProcessing} variant="outline">
                  Load History
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pipelineRuns.length > 0 ? (
                <div className="space-y-4">
                  {pipelineRuns.map((run) => (
                    <Card key={run.id}>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(run.status)}
                              <div>
                                <p className="font-semibold">Pipeline #{run.id}</p>
                                <p className="text-sm text-muted-foreground">
                                  <GitBranch className="w-3 h-3 inline mr-1" />
                                  {run.branch} • {run.commit}
                                </p>
                              </div>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <p>Duration: {run.duration}</p>
                              <p>{run.startedAt}</p>
                            </div>
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            {run.jobs.map((job, idx) => (
                              <Badge
                                key={idx}
                                variant={
                                  job.status === "success" ? "default" :
                                  job.status === "failed" ? "destructive" :
                                  "secondary"
                                }
                              >
                                {job.name}: {job.status}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Load History" to view pipeline runs</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="artifacts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Build Artifacts</CardTitle>
                  <CardDescription>Browse and download job artifacts</CardDescription>
                </div>
                <Button onClick={loadArtifacts} disabled={isProcessing} variant="outline">
                  Load Artifacts
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {artifacts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Job</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {artifacts.map((artifact, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{artifact.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{artifact.type}</Badge>
                        </TableCell>
                        <TableCell>{artifact.job}</TableCell>
                        <TableCell>{artifact.size}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {artifact.createdAt}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Load Artifacts" to browse build artifacts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
