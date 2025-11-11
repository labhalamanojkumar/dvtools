'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toaster';
import {
  Download,
  Upload,
  Copy,
  Eye,
  Code,
  FileText,
  Trash2,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const defaultMarkdown = `# Welcome to Markdown Editor

## Features
- **Live Preview** with syntax highlighting
- File upload and download support
- Copy markdown or HTML
- GitHub Flavored Markdown (GFM)
- Code syntax highlighting

### Code Example
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

### Lists
- Item 1
- Item 2
  - Nested item
  - Another nested item

### Table
| Feature | Status |
|---------|--------|
| Preview | ✅ |
| Export | ✅ |
| Upload | ✅ |

> This is a blockquote. Use markdown for rich formatting!
`;

export default function MarkdownEditorClient() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [activeTab, setActiveTab] = useState<'split' | 'edit' | 'preview'>('split');
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setMarkdown(content);
      toast({
        title: 'File uploaded',
        description: `${file.name} loaded successfully`,
      });
    };
    reader.readAsText(file);
  }, [toast]);

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Downloaded',
      description: 'Markdown file saved',
    });
  };

  const handleDownloadHTML = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
    code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f4f4f4; }
  </style>
</head>
<body>
${markdown}
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Downloaded',
      description: 'HTML file saved',
    });
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    toast({
      title: 'Copied',
      description: 'Markdown copied to clipboard',
    });
  };

  const handleClear = () => {
    setMarkdown('');
    toast({
      title: 'Cleared',
      description: 'Editor cleared',
    });
  };

  const handleReset = () => {
    setMarkdown(defaultMarkdown);
    toast({
      title: 'Reset',
      description: 'Editor reset to default',
    });
  };

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Markdown Editor</h1>
          <p className="text-muted-foreground">
            Live preview with syntax highlighting and file support
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <FileText className="mr-1 h-3 w-3" />
          Markdown
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About This Tool</CardTitle>
          <CardDescription>
            Professional markdown editor with real-time preview and GitHub Flavored Markdown support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Write and preview markdown documents with live syntax highlighting. Perfect for creating documentation, 
            README files, blog posts, and technical content. Supports GitHub Flavored Markdown (GFM) including 
            tables, task lists, and code blocks with syntax highlighting.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Key Features
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                <li>Real-time live preview with split view</li>
                <li>GitHub Flavored Markdown (GFM) support</li>
                <li>Code syntax highlighting (20+ languages)</li>
                <li>File upload (.md, .markdown, .txt)</li>
                <li>Export to HTML and Markdown</li>
                <li>Copy to clipboard functionality</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                Use Cases
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                <li>Create README.md files for GitHub</li>
                <li>Write technical documentation</li>
                <li>Draft blog posts and articles</li>
                <li>Prepare presentation notes</li>
                <li>Format code snippets with syntax</li>
                <li>Edit existing markdown files</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Editor</CardTitle>
              <CardDescription>
                Write markdown with live preview and syntax highlighting
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".md,.markdown,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="markdown-upload"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('markdown-upload')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadMarkdown}>
                <Download className="mr-2 h-4 w-4" />
                .md
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadHTML}>
                <Download className="mr-2 h-4 w-4" />
                .html
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyMarkdown}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button variant="destructive" size="sm" onClick={handleClear}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="split">
                <Eye className="mr-2 h-4 w-4" />
                Split View
              </TabsTrigger>
              <TabsTrigger value="edit">
                <Code className="mr-2 h-4 w-4" />
                Edit Only
              </TabsTrigger>
              <TabsTrigger value="preview">
                <FileText className="mr-2 h-4 w-4" />
                Preview Only
              </TabsTrigger>
            </TabsList>

            <TabsContent value="split" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Markdown Input</label>
                  <Textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    placeholder="Write markdown here..."
                    className="min-h-[500px] font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Live Preview</label>
                  <div className="border rounded-md p-4 min-h-[500px] overflow-auto bg-card">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                      className="prose prose-sm dark:prose-invert max-w-none"
                    >
                      {markdown}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="edit" className="mt-4">
              <Textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Write markdown here..."
                className="min-h-[600px] font-mono text-sm"
              />
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <div className="border rounded-md p-6 min-h-[600px] bg-card">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                  className="prose prose-sm dark:prose-invert max-w-none"
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Markdown Cheatsheet</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-semibold mb-1">Headings</p>
            <code className="text-xs"># H1, ## H2, ### H3</code>
          </div>
          <div>
            <p className="font-semibold mb-1">Bold</p>
            <code className="text-xs">**bold text**</code>
          </div>
          <div>
            <p className="font-semibold mb-1">Italic</p>
            <code className="text-xs">*italic text*</code>
          </div>
          <div>
            <p className="font-semibold mb-1">Link</p>
            <code className="text-xs">[text](url)</code>
          </div>
          <div>
            <p className="font-semibold mb-1">Image</p>
            <code className="text-xs">![alt](image.jpg)</code>
          </div>
          <div>
            <p className="font-semibold mb-1">Code</p>
            <code className="text-xs">`code`</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
