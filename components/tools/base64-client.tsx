'use client';

import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent } from '../ui/card';
import { copyToClipboard, downloadFile } from '../../lib/utils';
import { useToast } from '../ui/toaster';
import { Copy, Download, Upload } from 'lucide-react';

export function Base64Client() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mimeType, setMimeType] = useState('');
  const { toast } = useToast();

  const encode = () => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);
      toast({ title: 'Encoded', description: 'Text encoded to Base64' });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to encode text',
        variant: 'destructive'
      });
    }
  };

  const decode = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);

      // Try to detect MIME type
      if (decoded.startsWith('data:')) {
        const match = decoded.match(/^data:([^;]+);/);
        if (match) setMimeType(match[1]);
      }

      toast({ title: 'Decoded', description: 'Base64 decoded successfully' });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Invalid Base64 string',
        variant: 'destructive'
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setInput(base64.split(',')[1]);
      setMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Input</h3>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text or Base64..."
              className="code-editor min-h-[300px]"
            />
            <div className="mt-4 flex gap-2">
              <Button onClick={encode}>Encode</Button>
              <Button onClick={decode} variant="outline">Decode</Button>
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button variant="outline" asChild>
                  <span><Upload className="mr-2 h-4 w-4" />Upload File</span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Output</h3>
              {mimeType && (
                <span className="text-sm text-muted-foreground">
                  {mimeType}
                </span>
              )}
            </div>
            <pre className="code-editor min-h-[300px] overflow-auto">
              <code>{output || 'Output will appear here...'}</code>
            </pre>
            {output && (
              <div className="mt-4 flex gap-2">
                <Button onClick={() => copyToClipboard(output)}>
                  <Copy className="mr-2 h-4 w-4" />Copy
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadFile(output, 'output.txt')}
                >
                  <Download className="mr-2 h-4 w-4" />Download
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}