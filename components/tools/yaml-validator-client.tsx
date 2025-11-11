'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/toaster';
import {
  Download,
  Upload,
  Copy,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  FileJson,
  FileCode,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import yaml from 'js-yaml';

const defaultYAML = `# Sample YAML Configuration
app:
  name: DVtools
  version: 1.0.0
  features:
    - markdown-editor
    - yaml-validator
    - websocket-tester
  
database:
  host: localhost
  port: 3306
  credentials:
    username: admin
    password: secret
    
servers:
  - name: production
    url: https://api.dvtools.dev
    active: true
  - name: staging
    url: https://staging.dvtools.dev
    active: false
`;

const defaultJSON = `{
  "app": {
    "name": "DVtools",
    "version": "1.0.0",
    "features": [
      "markdown-editor",
      "yaml-validator",
      "websocket-tester"
    ]
  },
  "database": {
    "host": "localhost",
    "port": 3306,
    "credentials": {
      "username": "admin",
      "password": "secret"
    }
  }
}`;

export default function YAMLValidatorClient() {
  const [yamlInput, setYamlInput] = useState(defaultYAML);
  const [jsonInput, setJsonInput] = useState(defaultJSON);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [activeTab, setActiveTab] = useState<'validate' | 'yaml-to-json' | 'json-to-yaml'>('validate');
  const { toast } = useToast();

  const validateYAML = useCallback((input: string) => {
    try {
      yaml.load(input);
      setValidationError(null);
      setIsValid(true);
      return true;
    } catch (error: any) {
      setValidationError(error.message);
      setIsValid(false);
      return false;
    }
  }, []);

  const handleYAMLChange = (value: string) => {
    setYamlInput(value);
    if (activeTab === 'validate') {
      validateYAML(value);
    }
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (extension === 'json') {
        setJsonInput(content);
        setActiveTab('json-to-yaml');
      } else {
        setYamlInput(content);
        setActiveTab('validate');
        validateYAML(content);
      }
      
      toast({
        title: 'File uploaded',
        description: `${file.name} loaded successfully`,
      });
    };
    reader.readAsText(file);
  }, [toast, validateYAML]);

  const convertYAMLToJSON = () => {
    try {
      const parsed = yaml.load(yamlInput);
      const jsonOutput = JSON.stringify(parsed, null, 2);
      setJsonInput(jsonOutput);
      setValidationError(null);
      toast({
        title: 'Converted',
        description: 'YAML converted to JSON successfully',
      });
    } catch (error: any) {
      setValidationError(error.message);
      toast({
        title: 'Conversion failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const convertJSONToYAML = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const yamlOutput = yaml.dump(parsed, { indent: 2 });
      setYamlInput(yamlOutput);
      setValidationError(null);
      toast({
        title: 'Converted',
        description: 'JSON converted to YAML successfully',
      });
    } catch (error: any) {
      setValidationError(error.message);
      toast({
        title: 'Conversion failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDownloadYAML = () => {
    const blob = new Blob([yamlInput], { type: 'application/x-yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.yaml';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Downloaded', description: 'YAML file saved' });
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([jsonInput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Downloaded', description: 'JSON file saved' });
  };

  const handleCopyYAML = () => {
    navigator.clipboard.writeText(yamlInput);
    toast({ title: 'Copied', description: 'YAML copied to clipboard' });
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(jsonInput);
    toast({ title: 'Copied', description: 'JSON copied to clipboard' });
  };

  const handleClearYAML = () => {
    setYamlInput('');
    setValidationError(null);
    setIsValid(true);
  };

  const handleClearJSON = () => {
    setJsonInput('');
    setValidationError(null);
  };

  const handleResetYAML = () => {
    setYamlInput(defaultYAML);
    validateYAML(defaultYAML);
  };

  const handleResetJSON = () => {
    setJsonInput(defaultJSON);
  };

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">YAML Validator & Converter</h1>
          <p className="text-muted-foreground">
            Validate YAML syntax and convert between YAML and JSON formats
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <FileCode className="mr-1 h-3 w-3" />
          YAML
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About This Tool</CardTitle>
          <CardDescription>
            Professional YAML validator and converter for DevOps and configuration management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Validate YAML syntax, convert between YAML and JSON formats, and debug configuration files with detailed error messages. Perfect for validating Kubernetes manifests, Docker Compose files, CI/CD pipelines, and API specifications.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                Key Features
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Real-time YAML syntax validation</li>
                <li>• Bidirectional YAML ↔ JSON conversion</li>
                <li>• Upload files (.yaml, .yml, .json)</li>
                <li>• Detailed error messages with line numbers</li>
                <li>• Download converted results</li>
                <li>• Copy to clipboard functionality</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <FileCode className="mr-2 h-4 w-4 text-primary" />
                Use Cases
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Validate Kubernetes configurations</li>
                <li>• Convert between YAML and JSON</li>
                <li>• Debug YAML syntax errors</li>
                <li>• Verify CI/CD pipeline configs</li>
                <li>• Test Docker Compose files</li>
                <li>• Validate OpenAPI specifications</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>YAML Tools</CardTitle>
              <CardDescription>
                Validate YAML syntax and convert between formats
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".yaml,.yml,.json"
                onChange={handleFileUpload}
                className="hidden"
                id="yaml-upload"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('yaml-upload')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="validate">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Validate YAML
              </TabsTrigger>
              <TabsTrigger value="yaml-to-json">
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                YAML → JSON
              </TabsTrigger>
              <TabsTrigger value="json-to-yaml">
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                JSON → YAML
              </TabsTrigger>
            </TabsList>

            <TabsContent value="validate" className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">YAML Input</label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownloadYAML}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCopyYAML}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleResetYAML}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleClearYAML}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </div>
              <Textarea
                value={yamlInput}
                onChange={(e) => handleYAMLChange(e.target.value)}
                placeholder="Paste YAML here..."
                className="min-h-[400px] font-mono text-sm"
              />
              {validationError ? (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Invalid YAML:</strong> {validationError}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Valid YAML:</strong> No syntax errors detected
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="yaml-to-json" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">YAML Input</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopyYAML}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleResetYAML}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={yamlInput}
                    onChange={(e) => setYamlInput(e.target.value)}
                    placeholder="Paste YAML here..."
                    className="min-h-[400px] font-mono text-sm"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">JSON Output</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleDownloadJSON}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCopyJSON}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={jsonInput}
                    readOnly
                    placeholder="JSON output will appear here..."
                    className="min-h-[400px] font-mono text-sm bg-muted"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <Button onClick={convertYAMLToJSON} size="lg">
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  Convert YAML to JSON
                </Button>
              </div>
              {validationError && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Conversion Error:</strong> {validationError}
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="json-to-yaml" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">JSON Input</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopyJSON}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleResetJSON}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Paste JSON here..."
                    className="min-h-[400px] font-mono text-sm"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">YAML Output</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleDownloadYAML}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCopyYAML}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={yamlInput}
                    readOnly
                    placeholder="YAML output will appear here..."
                    className="min-h-[400px] font-mono text-sm bg-muted"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <Button onClick={convertJSONToYAML} size="lg">
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  Convert JSON to YAML
                </Button>
              </div>
              {validationError && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Conversion Error:</strong> {validationError}
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>YAML Syntax Reference</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold mb-1">Key-Value Pairs</p>
            <code className="text-xs">key: value</code>
          </div>
          <div>
            <p className="font-semibold mb-1">Arrays</p>
            <code className="text-xs block whitespace-pre">- item1{'\n'}- item2</code>
          </div>
          <div>
            <p className="font-semibold mb-1">Nested Objects</p>
            <code className="text-xs block whitespace-pre">parent:{'\n'}  child: value</code>
          </div>
          <div>
            <p className="font-semibold mb-1">Comments</p>
            <code className="text-xs"># This is a comment</code>
          </div>
          <div>
            <p className="font-semibold mb-1">Multi-line String</p>
            <code className="text-xs block whitespace-pre">key: |{'\n'}  multi line</code>
          </div>
          <div>
            <p className="font-semibold mb-1">Boolean</p>
            <code className="text-xs">active: true</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
