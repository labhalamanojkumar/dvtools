"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { copyToClipboard, downloadFile } from "../../lib/utils";
import { useToast } from "../ui/toaster";
import { Copy, Download, RefreshCw, FileText, Hash, Type, AlignLeft } from "lucide-react";

interface LoremIpsumRequest {
  type: 'paragraphs' | 'sentences' | 'words' | 'characters';
  count: number;
  format?: 'plain' | 'html';
  startWithLorem?: boolean;
}

export function LoremIpsumGeneratorClient() {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words' | 'characters'>('paragraphs');
  const [count, setCount] = useState(3);
  const [format, setFormat] = useState<'plain' | 'html'>('plain');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateLoremIpsum = async () => {
    setIsLoading(true);
    try {
      const request: LoremIpsumRequest = {
        type,
        count,
        format,
        startWithLorem
      };

      const response = await fetch('/api/tools/lorem-ipsum-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (data.success) {
        setOutput(data.text);
        toast({
          title: "Generated",
          description: `Generated ${count} ${type} of lorem ipsum text`
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to generate lorem ipsum",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate lorem ipsum text",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboardHandler = async () => {
    try {
      await copyToClipboard(output);
      toast({
        title: "Copied",
        description: "Lorem ipsum text copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadAsFile = () => {
    try {
      const extension = format === 'html' ? 'html' : 'txt';
      const mimeType = format === 'html' ? 'text/html' : 'text/plain';
      downloadFile(output, `lorem-ipsum.${extension}`, mimeType);
      toast({
        title: "Downloaded",
        description: "Lorem ipsum text downloaded"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'paragraphs':
        return <FileText className="w-4 h-4" />;
      case 'sentences':
        return <Type className="w-4 h-4" />;
      case 'words':
        return <Hash className="w-4 h-4" />;
      case 'characters':
        return <AlignLeft className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getTypeIcon()}
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(value: any) => setType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paragraphs">Paragraphs</SelectItem>
                  <SelectItem value="sentences">Sentences</SelectItem>
                  <SelectItem value="words">Words</SelectItem>
                  <SelectItem value="characters">Characters</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Count Input */}
            <div className="space-y-2">
              <Label htmlFor="count">Count (1-1000)</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(e) => setCount(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Format Selection */}
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select value={format} onValueChange={(value: any) => setFormat(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plain">Plain Text</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start with Lorem Checkbox */}
            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="startWithLorem"
                checked={startWithLorem}
                onCheckedChange={(checked) => setStartWithLorem(checked as boolean)}
              />
              <Label htmlFor="startWithLorem" className="text-sm">
                Start with &quot;Lorem ipsum...&quot;
              </Label>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateLoremIpsum}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate Lorem Ipsum
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output Card */}
      {output && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated Text</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboardHandler}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadAsFile}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              readOnly
              className="min-h-[200px] font-mono text-sm"
              placeholder="Generated lorem ipsum text will appear here..."
            />
          </CardContent>
        </Card>
      )}

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div><strong>Paragraphs:</strong> Generate multiple paragraphs of lorem ipsum text</div>
          <div><strong>Sentences:</strong> Generate a specific number of sentences</div>
          <div><strong>Words:</strong> Generate a specific number of words</div>
          <div><strong>Characters:</strong> Generate text up to a specific character count</div>
          <div><strong>HTML Format:</strong> Wrap paragraphs in &lt;p&gt; tags for HTML output</div>
        </CardContent>
      </Card>
    </div>
  );
}