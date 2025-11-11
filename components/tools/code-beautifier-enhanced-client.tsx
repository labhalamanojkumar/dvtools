'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Copy,
  Download,
  Upload,
  Code,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  FileCode,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';
import { html as beautifyHTML, css as beautifyCSS, js as beautifyJS } from 'js-beautify';

type CodeType = 'html' | 'css' | 'javascript';

export default function CodeBeautifierClient() {
  const [activeTab, setActiveTab] = useState<CodeType>('html');
  const [inputCode, setInputCode] = useState({
    html: '',
    css: '',
    javascript: '',
  });
  const [beautifiedCode, setBeautifiedCode] = useState({
    html: '',
    css: '',
    javascript: '',
  });
  const [indentSize, setIndentSize] = useState(2);
  const { toast } = useToast();

  const beautifyCode = useCallback((code: string, type: CodeType, indent: number) => {
    if (!code.trim()) {
      return '';
    }

    try {
      const options = {
        indent_size: indent,
        indent_char: ' ',
        max_preserve_newlines: 2,
        preserve_newlines: true,
        keep_array_indentation: false,
        break_chained_methods: false,
        indent_scripts: 'normal' as const,
        brace_style: 'collapse' as const,
        space_before_conditional: true,
        unescape_strings: false,
        jslint_happy: false,
        end_with_newline: true,
        wrap_line_length: 0,
        indent_inner_html: true,
        comma_first: false,
        e4x: true,
        indent_empty_lines: false
      };

      let result = '';
      switch (type) {
        case 'html':
          result = beautifyHTML(code, options);
          break;
        case 'css':
          result = beautifyCSS(code, options);
          break;
        case 'javascript':
          result = beautifyJS(code, options);
          break;
      }
      return result;
    } catch (error) {
      toast({
        title: 'Beautification Error',
        description: 'Failed to beautify code. Please check your syntax.',
        variant: 'destructive',
      });
      return code;
    }
  }, [toast]);

  const handleBeautify = () => {
    const code = inputCode[activeTab];
    if (!code.trim()) {
      toast({
        title: 'No code',
        description: 'Please enter code to beautify',
        variant: 'destructive',
      });
      return;
    }

    const beautified = beautifyCode(code, activeTab, indentSize);
    setBeautifiedCode(prev => ({
      ...prev,
      [activeTab]: beautified,
    }));
    toast({
      title: 'Success',
      description: 'Code beautified successfully',
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInputCode(prev => ({
        ...prev,
        [activeTab]: content,
      }));
      toast({
        title: 'File loaded',
        description: `${file.name} loaded successfully`,
      });
    };
    reader.readAsText(file);
  };

  const copyToClipboard = () => {
    const code = beautifiedCode[activeTab];
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied!',
      description: 'Beautified code copied to clipboard',
    });
  };

  const downloadCode = () => {
    const code = beautifiedCode[activeTab];
    if (!code) return;

    const extensions = { html: '.html', css: '.css', javascript: '.js' };
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beautified${extensions[activeTab]}`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Downloaded',
      description: 'Beautified code saved successfully',
    });
  };

  const clearCode = () => {
    setInputCode(prev => ({ ...prev, [activeTab]: '' }));
    setBeautifiedCode(prev => ({ ...prev, [activeTab]: '' }));
  };

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HTML/CSS/JS Code Beautifier</h1>
          <p className="text-muted-foreground">
            Format and beautify your HTML, CSS, and JavaScript code instantly
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Code className="mr-1 h-3 w-3" />
          Code Formatter
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About This Tool</CardTitle>
          <CardDescription>
            Professional code formatter for HTML, CSS, and JavaScript with customizable indentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Beautify and format your messy or minified code with proper indentation, line breaks, and spacing. Perfect for cleaning up production code, improving readability, and maintaining consistent code style across projects.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                Key Features
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Format HTML, CSS, and JavaScript</li>
                <li>• Customizable indentation (2-8 spaces)</li>
                <li>• Upload files for beautification</li>
                <li>• Copy and download results</li>
                <li>• Syntax-aware formatting</li>
                <li>• Preserve code structure</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                Use Cases
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Unminify production code</li>
                <li>• Improve code readability</li>
                <li>• Standardize code formatting</li>
                <li>• Debug minified scripts</li>
                <li>• Clean up generated code</li>
                <li>• Prepare code for review</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Beautify Code</CardTitle>
          <CardDescription>Select language and paste your code to format</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Indent Size: {indentSize} spaces</Label>
              <Slider
                value={[indentSize]}
                onValueChange={([value]) => setIndentSize(value)}
                min={2}
                max={8}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept=".html,.css,.js,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="code-file-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('code-file-upload')?.click()}
                  className="flex-1"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
                <Button variant="outline" onClick={clearCode}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CodeType)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="html">
                <FileCode className="mr-2 h-4 w-4" />
                HTML
              </TabsTrigger>
              <TabsTrigger value="css">
                <FileCode className="mr-2 h-4 w-4" />
                CSS
              </TabsTrigger>
              <TabsTrigger value="javascript">
                <FileCode className="mr-2 h-4 w-4" />
                JavaScript
              </TabsTrigger>
            </TabsList>

            <TabsContent value="html" className="space-y-4">
              <div className="space-y-2">
                <Label>HTML Code</Label>
                <Textarea
                  value={inputCode.html}
                  onChange={(e) => setInputCode(prev => ({ ...prev, html: e.target.value }))}
                  placeholder="Paste your HTML code here..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent value="css" className="space-y-4">
              <div className="space-y-2">
                <Label>CSS Code</Label>
                <Textarea
                  value={inputCode.css}
                  onChange={(e) => setInputCode(prev => ({ ...prev, css: e.target.value }))}
                  placeholder="Paste your CSS code here..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent value="javascript" className="space-y-4">
              <div className="space-y-2">
                <Label>JavaScript Code</Label>
                <Textarea
                  value={inputCode.javascript}
                  onChange={(e) => setInputCode(prev => ({ ...prev, javascript: e.target.value }))}
                  placeholder="Paste your JavaScript code here..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button onClick={handleBeautify} className="w-full" size="lg">
            <Sparkles className="mr-2 h-5 w-5" />
            Beautify Code
          </Button>

          {beautifiedCode[activeTab] && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Beautified Code</Label>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadCode}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="bg-muted rounded-md p-4 overflow-x-auto max-h-[400px] overflow-y-auto">
                <pre className="font-mono text-sm">{beautifiedCode[activeTab]}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
