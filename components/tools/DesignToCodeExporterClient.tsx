'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, Code, Palette, Download, Copy, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

interface ComponentTemplate {
  name: string;
  framework: 'react' | 'vue';
  code: string;
  styles: string;
  tokens: Record<string, any>;
}

interface DesignTokens {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, any>;
  shadows: Record<string, any>;
  borders: Record<string, any>;
}

export default function DesignToCodeExporterClient() {
  const [figmaUrl, setFigmaUrl] = useState('');
  const [framework, setFramework] = useState<'react' | 'vue'>('react');
  const [includeStyles, setIncludeStyles] = useState(true);
  const [responsive, setResponsive] = useState(true);
  const [componentName, setComponentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedComponents, setGeneratedComponents] = useState<ComponentTemplate[]>([]);
  const [designTokens, setDesignTokens] = useState<DesignTokens | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFigmaData, setUploadedFigmaData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('input');
  const [selectedComponent, setSelectedComponent] = useState<ComponentTemplate | null>(null);

  const { toast } = useToast();

  const handleExport = useCallback(async () => {
    if (!figmaUrl.trim() && !uploadedFigmaData) {
      toast({
        title: "Error",
        description: "Please enter a Figma URL or upload a Figma JSON file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: any = {
        framework,
        includeStyles,
        responsive,
        componentName: componentName.trim() || undefined,
      };

      if (uploadedFigmaData) {
        payload.figmaData = uploadedFigmaData;
      } else {
        payload.figmaUrl = figmaUrl;
      }

      const response = await fetch('/api/tools/design-to-code-exporter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to export design');
      }

      setGeneratedComponents(data.components || []);
      setDesignTokens(data.tokens || null);
      // select first component for quick viewing
      if (data.components && data.components.length > 0) {
        setSelectedComponent(data.components[0]);
        setActiveTab('output');
      } else if (data.tokens) {
        setActiveTab('tokens');
      }
      toast({
        title: "Success",
        description: "Design exported successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to export design',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [figmaUrl, framework, includeStyles, responsive, componentName, uploadedFigmaData]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Success",
        description: "Copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  }, []);

  const downloadFile = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // Create a minimal zip (STORED — no compression) in the browser and download it
  const crc32 = (bytes: Uint8Array) => {
    let table: number[] | null = (crc32 as any).table || null;
    if (!table) {
      table = [];
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1));
        table[i] = c >>> 0;
      }
      (crc32 as any).table = table;
    }
    let crc = 0 ^ (-1);
    for (let i = 0; i < bytes.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ bytes[i]) & 0xff];
    }
    return (crc ^ (-1)) >>> 0;
  };

  const u8 = (str: string) => new TextEncoder().encode(str);

  const writeLE = (buf: Uint8Array, offset: number, value: number, bytes: number) => {
    for (let i = 0; i < bytes; i++) {
      buf[offset + i] = value & 0xff;
      value = value >>> 8;
    }
  };

  const createZip = (files: { name: string; content: string }[]) => {
    const fileEntries = files.map((f) => {
      const data = u8(f.content);
      const name = u8(f.name);
      const crc = crc32(data);
      return { name, data, crc, size: data.length };
    });

    // calculate sizes
    let offset = 0;
    const localParts: Uint8Array[] = [];
    const centralParts: Uint8Array[] = [];

    for (const entry of fileEntries) {
      const localHeader = new Uint8Array(30 + entry.name.length);
      // local file header signature
      writeLE(localHeader, 0, 0x04034b50, 4);
      // version needed
      writeLE(localHeader, 4, 20, 2);
      // general purpose bit flag
      writeLE(localHeader, 6, 0, 2);
      // compression method (0 = store)
      writeLE(localHeader, 8, 0, 2);
      // mod time/date
      writeLE(localHeader, 10, 0, 4);
      // crc32
      writeLE(localHeader, 14, entry.crc, 4);
      // compressed size
      writeLE(localHeader, 18, entry.size, 4);
      // uncompressed size
      writeLE(localHeader, 22, entry.size, 4);
      // file name length
      writeLE(localHeader, 26, entry.name.length, 2);
      // extra length
      writeLE(localHeader, 28, 0, 2);
      // filename
      localHeader.set(entry.name, 30);

      localParts.push(localHeader);
      localParts.push(entry.data);

      const central = new Uint8Array(46 + entry.name.length);
      // central file header signature
      writeLE(central, 0, 0x02014b50, 4);
      // version made by
      writeLE(central, 4, 20, 2);
      // version needed
      writeLE(central, 6, 20, 2);
      // gp bit flag
      writeLE(central, 8, 0, 2);
      // compression method
      writeLE(central, 10, 0, 2);
      // mod time/date
      writeLE(central, 12, 0, 4);
      // crc32
      writeLE(central, 16, entry.crc, 4);
      // compressed size
      writeLE(central, 20, entry.size, 4);
      // uncompressed size
      writeLE(central, 24, entry.size, 4);
      // file name length
      writeLE(central, 28, entry.name.length, 2);
      // extra length
      writeLE(central, 30, 0, 2);
      // file comment length
      writeLE(central, 32, 0, 2);
      // disk number start
      writeLE(central, 34, 0, 2);
      // internal file attrs
      writeLE(central, 36, 0, 2);
      // external file attrs
      writeLE(central, 38, 0, 4);
      // relative offset of local header
      writeLE(central, 42, offset, 4);
      // filename
      central.set(entry.name, 46);

      centralParts.push(central);

      offset += localHeader.length + entry.data.length;
    }

    const centralSize = centralParts.reduce((s, p) => s + p.length, 0);
    const centralOffset = offset;

    const end = new Uint8Array(22);
    // end of central dir signature
    writeLE(end, 0, 0x06054b50, 4);
    // disk numbers
    writeLE(end, 4, 0, 2);
    writeLE(end, 6, 0, 2);
    // total entries on this disk
    writeLE(end, 8, fileEntries.length, 2);
    // total entries
    writeLE(end, 10, fileEntries.length, 2);
    // size of central dir
    writeLE(end, 12, centralSize, 4);
    // offset of start of central dir
    writeLE(end, 16, centralOffset, 4);
    // comment length
    writeLE(end, 20, 0, 2);

    const parts = [...localParts, ...centralParts, end];
    const total = parts.reduce((s, p) => s + p.length, 0);
    const out = new Uint8Array(total);
    let pos = 0;
    for (const p of parts) {
      out.set(p, pos);
      pos += p.length;
    }

    return new Blob([out], { type: 'application/zip' });
  };

  const downloadAllZip = useCallback(() => {
    const files: { name: string; content: string }[] = [];
    for (const comp of generatedComponents) {
      const ext = comp.framework === 'react' ? (comp.code.includes('<template>') ? 'vue' : 'tsx') : 'vue';
      files.push({ name: `${comp.name || 'component'}.${ext}`, content: comp.code });
    }
    if (designTokens) {
      files.push({ name: 'design-tokens.json', content: JSON.stringify(designTokens, null, 2) });
    }

    if (files.length === 0) {
      toast({ title: 'No files', description: 'Nothing to download', variant: 'destructive' });
      return;
    }

    try {
      const zip = createZip(files);
      const url = URL.createObjectURL(zip);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'design-export.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: 'Download started', description: 'Downloading design-export.zip' });
    } catch (err: any) {
      console.error('Zip creation failed', err);
      toast({ title: 'Error', description: 'Failed to create ZIP', variant: 'destructive' });
    }
  }, [generatedComponents, designTokens]);

  const renderTokenPreview = (tokens: DesignTokens) => {
    return (
      <div className="space-y-4">
        {Object.entries(tokens.colors).length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Colors
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(tokens.colors).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: value }}
                  />
                  <span className="text-xs text-muted-foreground">{key}</span>
                  <code className="text-xs">{value}</code>
                </div>
              ))}
            </div>
          </div>
        )}

        {Object.entries(tokens.spacing).length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Spacing</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(tokens.spacing).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">{key}</span>
                  <code className="text-sm">{value}</code>
                </div>
              ))}
            </div>
          </div>
        )}

        {Object.entries(tokens.typography).length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Typography</h4>
            <div className="space-y-2">
              {Object.entries(tokens.typography).map(([key, value]: [string, any]) => (
                <div key={key} className="p-3 border rounded">
                  <div className="font-medium text-sm mb-1">{key}</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Size: {value.fontSize}px</div>
                    <div>Family: {value.fontFamily}</div>
                    <div>Weight: {value.fontWeight}</div>
                    <div>Line Height: {value.lineHeight}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Design-to-Code Exporter</h1>
        <p className="text-muted-foreground">
          Convert your Figma designs into production-ready React or Vue components
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="output">Generated Code</TabsTrigger>
          <TabsTrigger value="tokens">Design Tokens</TabsTrigger>
        </TabsList>

        {/* Quick action buttons to jump to results when available */}
        <div className="flex gap-2 mt-3 items-center">
          {generatedComponents.length > 0 && (
            <Button size="sm" variant="outline" onClick={() => setActiveTab('output')}>
              <Code className="w-4 h-4 mr-2" />
              View Generated Code
            </Button>
          )}

          {designTokens && (
            <Button size="sm" variant="outline" onClick={() => setActiveTab('tokens')}>
              <Palette className="w-4 h-4 mr-2" />
              View Design Tokens
            </Button>
          )}

          {(generatedComponents.length > 0 || designTokens) && (
            <Button size="sm" variant="secondary" onClick={downloadAllZip}>
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          )}
        </div>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Figma Design Input
              </CardTitle>
              <CardDescription>
                Enter your Figma file URL to start the conversion process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="figma-url">Figma URL</Label>
                <Input
                  id="figma-url"
                  placeholder="https://www.figma.com/design/ABC123/My-Design"
                  value={figmaUrl}
                  onChange={(e) => setFigmaUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Make sure your Figma file is set to public or you have the correct access token
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="figma-file">Or upload Figma JSON</Label>
                <input
                  id="figma-file"
                  type="file"
                  accept="application/json,.json"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadedFileName(file.name);
                    try {
                      const text = await file.text();
                      const parsed = JSON.parse(text);
                      setUploadedFigmaData(parsed);
                      toast({ title: 'File loaded', description: file.name });
                    } catch (err: any) {
                      console.error('Failed to parse file', err);
                      setUploadedFileName(null);
                      setUploadedFigmaData(null);
                      toast({ title: 'Error', description: 'Failed to parse JSON file', variant: 'destructive' });
                    }
                  }}
                  className="w-full"
                />
                {uploadedFileName && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Uploaded: {uploadedFileName}</span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => { setUploadedFileName(null); setUploadedFigmaData(null); }}>
                        Remove
                      </Button>
                      <Button size="sm" variant="secondary" onClick={handleExport}>
                        Process Uploaded File
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="framework">Framework</Label>
                  <Select value={framework} onValueChange={(value: 'react' | 'vue') => setFramework(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="vue">Vue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="component-name">Component Name (Optional)</Label>
                  <Input
                    id="component-name"
                    placeholder="MyComponent"
                    value={componentName}
                    onChange={(e) => setComponentName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-styles"
                    checked={includeStyles}
                    onCheckedChange={(checked) => setIncludeStyles(checked === true)}
                  />
                  <Label htmlFor="include-styles">Include inline styles</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="responsive"
                    checked={responsive}
                    onCheckedChange={(checked) => setResponsive(checked === true)}
                  />
                  <Label htmlFor="responsive">Responsive design</Label>
                </div>
              </div>

              <Button
                onClick={handleExport}
                disabled={isLoading || (!figmaUrl.trim() && !uploadedFigmaData)}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting Design...
                  </>
                ) : (
                  <>
                    <Code className="w-4 h-4 mr-2" />
                    Export to Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Alert>
            <Eye className="h-4 w-4" />
            <AlertDescription>
              <strong>Supported Features:</strong> Layout conversion, color extraction, typography, spacing, and basic component structure.
              Advanced features like animations and complex interactions may require manual adjustments.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="output" className="space-y-6">
          {generatedComponents.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Generated Components</h3>
                <Badge variant="secondary">{generatedComponents.length} component(s)</Badge>
              </div>

              <div className="grid gap-4">
                {generatedComponents.map((component, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{component.name}</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(component.code)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadFile(component.code, `${component.name}.tsx`)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        Framework: {component.framework.toUpperCase()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={component.code}
                        readOnly
                        className="font-mono text-sm min-h-[200px]"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Code className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Components Generated</h3>
              <p className="text-muted-foreground">
                Export a Figma design to see the generated code here.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tokens" className="space-y-6">
          {designTokens ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Design Tokens
                </CardTitle>
                <CardDescription>
                  Extracted design tokens from your Figma file
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderTokenPreview(designTokens)}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <Palette className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Design Tokens</h3>
              <p className="text-muted-foreground">
                Design tokens will appear here after exporting a Figma design.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}