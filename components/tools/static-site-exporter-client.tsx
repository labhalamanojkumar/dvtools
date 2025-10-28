'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download,
  FileText,
  Code,
  Image as ImageIcon,
  Settings,
  CheckCircle,
  AlertTriangle,
  FolderOpen,
  Globe,
  Package
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

interface ExportOptions {
  format: 'html' | 'zip' | 'single-file';
  includeAssets: boolean;
  minify: boolean;
  base64Images: boolean;
  removeScripts: boolean;
  customCSS: string;
  title: string;
}

interface ExportResult {
  files: Array<{
    name: string;
    size: number;
    type: string;
  }>;
  totalSize: number;
  downloadUrl?: string;
  warnings: string[];
}

const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Static Site</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }

        .header {
            text-align: center;
            padding: 40px 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
            margin-bottom: 30px;
        }

        .content {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .button {
            background: #667eea;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 5px;
            display: inline-block;
            text-decoration: none;
        }

        .button:hover {
            background: #5a6fd8;
        }

        .image-container {
            text-align: center;
            margin: 20px 0;
        }

        .image-container img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <header class="header">
        <h1>Welcome to My Static Site</h1>
        <p>A beautiful, self-contained webpage</p>
    </header>

    <main class="content">
        <section>
            <h2>About This Site</h2>
            <p>This is a sample static website that can be exported as a single HTML file or as a complete package with assets.</p>

            <div class="image-container">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjdlZWEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TYW1wbGUgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==" alt="Sample Image">
            </div>

            <h3>Features</h3>
            <ul>
                <li>Responsive design that works on all devices</li>
                <li>Modern CSS with gradients and shadows</li>
                <li>Embedded images (Base64 encoded)</li>
                <li>Clean, semantic HTML structure</li>
                <li>Cross-browser compatibility</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
                <a href="#" class="button">Learn More</a>
                <a href="#" class="button" style="background: #28a745;">Get Started</a>
            </div>
        </section>

        <section style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
            <h2>Contact Information</h2>
            <p>If you have any questions about this static site export, feel free to reach out!</p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Email:</strong> contact@example.com</p>
                <p><strong>Phone:</strong> (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Static Street, Web City, WC 12345</p>
            </div>
        </section>
    </main>

    <footer style="text-align: center; margin-top: 40px; padding: 20px; color: #666; border-top: 1px solid #eee;">
        <p>&copy; 2024 My Static Site. All rights reserved.</p>
    </footer>

    <script>
        // Simple interactive script
        document.addEventListener('DOMContentLoaded', function() {
            const buttons = document.querySelectorAll('.button');
            buttons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    alert('Button clicked! This is a static site with embedded JavaScript.');
                });
            });
        });
    </script>
</body>
</html>`;

export default function StaticSiteExporterClient() {
  const [html, setHtml] = useState(sampleHTML);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'single-file',
    includeAssets: true,
    minify: false,
    base64Images: true,
    removeScripts: false,
    customCSS: '',
    title: 'Exported Site'
  });
  const [result, setResult] = useState<ExportResult | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.html')) {
      toast({
        title: "Invalid file type",
        description: "Please select an HTML file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setHtml(content);
      toast({
        title: "File loaded",
        description: `${file.name} has been loaded successfully`,
      });
    };
    reader.readAsText(file);
  };

  const minifyHTML = (html: string): string => {
    return html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/\s*=\s*/g, '=')
      .trim();
  };

  const minifyCSS = (css: string): string => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/;\s*}/g, '}')
      .replace(/{\s*/g, '{')
      .replace(/;\s*/g, ';')
      .trim();
  };

  const extractAssets = (html: string): Array<{ name: string; content: string; type: string }> => {
    const assets: Array<{ name: string; content: string; type: string }> = [];

    // Extract CSS from style tags
    const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (styleMatches) {
      styleMatches.forEach((match, index) => {
        const css = match.replace(/<\/?style[^>]*>/gi, '');
        assets.push({
          name: `style-${index + 1}.css`,
          content: options.minify ? minifyCSS(css) : css,
          type: 'text/css'
        });
      });
    }

    // Extract JavaScript from script tags (if not removing)
    if (!options.removeScripts) {
      const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
      if (scriptMatches) {
        scriptMatches.forEach((match, index) => {
          const js = match.replace(/<\/?script[^>]*>/gi, '');
          assets.push({
            name: `script-${index + 1}.js`,
            content: js,
            type: 'application/javascript'
          });
        });
      }
    }

    return assets;
  };

  const createSingleFileHTML = (html: string): string => {
    let processedHTML = html;

    // Extract and inline CSS
    const styleMatches = processedHTML.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (styleMatches) {
      styleMatches.forEach(match => {
        const css = match.replace(/<\/?style[^>]*>/gi, '');
        const minifiedCSS = options.minify ? minifyCSS(css) : css;
        processedHTML = processedHTML.replace(match, `<style>${minifiedCSS}</style>`);
      });
    }

    // Remove scripts if requested
    if (options.removeScripts) {
      processedHTML = processedHTML.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    }

    // Add custom CSS if provided
    if (options.customCSS.trim()) {
      const headEndMatch = processedHTML.match(/<\/head>/i);
      if (headEndMatch) {
        const customStyleTag = `<style>${options.customCSS}</style>`;
        processedHTML = processedHTML.replace(headEndMatch[0], customStyleTag + headEndMatch[0]);
      }
    }

    // Update title if provided
    if (options.title.trim()) {
      processedHTML = processedHTML.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${options.title}</title>`);
    }

    // Minify HTML if requested
    if (options.minify) {
      processedHTML = minifyHTML(processedHTML);
    }

    return processedHTML;
  };

  const exportSite = async (): Promise<ExportResult> => {
    const warnings: string[] = [];
    const files: Array<{ name: string; size: number; type: string }> = [];

    if (!html.trim()) {
      throw new Error('No HTML content provided');
    }

    let processedHTML = html;

    // Process based on format
    if (options.format === 'single-file') {
      processedHTML = createSingleFileHTML(html);
      const blob = new Blob([processedHTML], { type: 'text/html' });
      files.push({
        name: 'index.html',
        size: blob.size,
        type: 'text/html'
      });

      return {
        files,
        totalSize: blob.size,
        downloadUrl: URL.createObjectURL(blob),
        warnings
      };
    }

    // For ZIP format, create multiple files
    const assets = options.includeAssets ? extractAssets(html) : [];
    processedHTML = createSingleFileHTML(html);

    // Create index.html
    const indexBlob = new Blob([processedHTML], { type: 'text/html' });
    files.push({
      name: 'index.html',
      size: indexBlob.size,
      type: 'text/html'
    });

    // Add asset files
    assets.forEach(asset => {
      const blob = new Blob([asset.content], { type: asset.type });
      files.push({
        name: asset.name,
        size: blob.size,
        type: asset.type
      });
    });

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    // In a real implementation, you'd create a ZIP file here
    // For demo purposes, we'll create a single file
    const allContent = [
      processedHTML,
      ...assets.map(asset => `/* ${asset.name} */\n${asset.content}`)
    ].join('\n\n---\n\n');

    const zipBlob = new Blob([allContent], { type: 'application/zip' });

    return {
      files,
      totalSize,
      downloadUrl: URL.createObjectURL(zipBlob),
      warnings
    };
  };

  const handleExport = async () => {
    if (!html.trim()) {
      toast({
        title: "No content",
        description: "Please provide HTML content to export",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      const exportResult = await exportSite();
      setResult(exportResult);
      setProgress(100);

      clearInterval(progressInterval);

      toast({
        title: "Export complete",
        description: `Generated ${exportResult.files.length} file(s), ${formatBytes(exportResult.totalSize)} total`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export site",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  const downloadFile = () => {
    if (!result?.downloadUrl) return;

    const link = document.createElement('a');
    link.href = result.downloadUrl;
    link.download = options.format === 'zip' ? 'static-site.zip' : 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: "Your static site has been downloaded",
    });
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            HTML Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              Upload HTML File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.htm"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div>
            <Label htmlFor="html-content">HTML Content</Label>
            <Textarea
              id="html-content"
              placeholder="Paste your HTML code here..."
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Export Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="format">Export Format</Label>
              <Select value={options.format} onValueChange={(value) => setOptions(prev => ({ ...prev, format: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-file">Single HTML File</SelectItem>
                  <SelectItem value="zip">ZIP Package</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                placeholder="Exported Site"
                value={options.title}
                onChange={(e) => setOptions(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="minify"
                checked={options.minify}
                onChange={(e) => setOptions(prev => ({ ...prev, minify: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="minify">Minify HTML/CSS</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="include-assets"
                checked={options.includeAssets}
                onChange={(e) => setOptions(prev => ({ ...prev, includeAssets: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="include-assets">Extract Assets</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="base64-images"
                checked={options.base64Images}
                onChange={(e) => setOptions(prev => ({ ...prev, base64Images: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="base64-images">Base64 Images</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remove-scripts"
                checked={options.removeScripts}
                onChange={(e) => setOptions(prev => ({ ...prev, removeScripts: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="remove-scripts">Remove Scripts</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="custom-css">Custom CSS (optional)</Label>
            <Textarea
              id="custom-css"
              placeholder="Add custom CSS that will be injected into the exported site..."
              value={options.customCSS}
              onChange={(e) => setOptions(prev => ({ ...prev, customCSS: e.target.value }))}
              className="min-h-[100px] font-mono text-sm"
            />
          </div>

          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full"
          >
            {isExporting ? (
              <>
                <Package className="mr-2 h-4 w-4 animate-spin" />
                Exporting... ({Math.round(progress)}%)
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Static Site
              </>
            )}
          </Button>

          {isExporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing content...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Export Complete
              </span>
              <Button onClick={downloadFile}>
                <Download className="mr-2 h-4 w-4" />
                Download {options.format === 'zip' ? 'ZIP' : 'HTML'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{result.files.length}</div>
                <div className="text-sm text-muted-foreground">Files Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatBytes(result.totalSize)}</div>
                <div className="text-sm text-muted-foreground">Total Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{result.warnings.length}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Generated Files</h4>
              <ScrollArea className="h-[200px] w-full">
                <div className="space-y-2">
                  {result.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">{file.name}</span>
                        <Badge variant="outline">{file.type}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{formatBytes(file.size)}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {result.warnings.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-3 text-yellow-600">Warnings</h4>
                <div className="space-y-2">
                  {result.warnings.map((warning, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <span className="text-sm text-yellow-800">{warning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Live Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <iframe
              srcDoc={html}
              className="w-full h-[400px] border-0"
              title="Static Site Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            This preview shows how your HTML content will appear when exported.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}