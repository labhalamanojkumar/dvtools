'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Copy,
  Download,
  Upload,
  Key,
  RefreshCw,
  CheckCircle2,
  Shield,
  Lock,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';
import CryptoJS from 'crypto-js';

type Algorithm = 'SHA256' | 'SHA512' | 'SHA1' | 'MD5';

export default function HMACGeneratorClient() {
  const [inputText, setInputText] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [algorithm, setAlgorithm] = useState<Algorithm>('SHA256');
  const [hmacResult, setHmacResult] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const { toast } = useToast();

  const generateHMAC = useCallback((text: string, key: string, algo: Algorithm) => {
    if (!text || !key) {
      setHmacResult('');
      return;
    }

    try {
      let hash = '';
      switch (algo) {
        case 'SHA256':
          hash = CryptoJS.HmacSHA256(text, key).toString();
          break;
        case 'SHA512':
          hash = CryptoJS.HmacSHA512(text, key).toString();
          break;
        case 'SHA1':
          hash = CryptoJS.HmacSHA1(text, key).toString();
          break;
        case 'MD5':
          hash = CryptoJS.HmacMD5(text, key).toString();
          break;
      }
      setHmacResult(hash);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate HMAC',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleTextChange = (text: string) => {
    setInputText(text);
    if (secretKey) {
      generateHMAC(text, secretKey, algorithm);
    }
  };

  const handleKeyChange = (key: string) => {
    setSecretKey(key);
    if (inputText) {
      generateHMAC(inputText, key, algorithm);
    }
  };

  const handleAlgorithmChange = (algo: Algorithm) => {
    setAlgorithm(algo);
    if (inputText && secretKey) {
      generateHMAC(inputText, secretKey, algo);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setInputText(text);
      if (secretKey) {
        generateHMAC(text, secretKey, algorithm);
      }
      toast({
        title: 'File loaded',
        description: 'File content loaded successfully',
      });
    };
    reader.readAsText(file);
  };

  const copyToClipboard = () => {
    if (!hmacResult) return;
    navigator.clipboard.writeText(hmacResult);
    toast({
      title: 'Copied!',
      description: 'HMAC hash copied to clipboard',
    });
  };

  const downloadResult = () => {
    if (!hmacResult) return;
    const content = `Algorithm: ${algorithm}\nSecret Key: ${secretKey}\nInput: ${inputText}\nHMAC: ${hmacResult}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hmac-${algorithm.toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Downloaded',
      description: 'HMAC result saved as text file',
    });
  };

  const clearAll = () => {
    setInputText('');
    setSecretKey('');
    setHmacResult('');
  };

  const generateRandomKey = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const key = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    setSecretKey(key);
    if (inputText) {
      generateHMAC(inputText, key, algorithm);
    }
    toast({
      title: 'Key generated',
      description: 'Random 256-bit key generated',
    });
  };

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HMAC Generator</h1>
          <p className="text-muted-foreground">
            Generate HMAC (Hash-based Message Authentication Code) for secure authentication
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Shield className="mr-1 h-3 w-3" />
          Security
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About This Tool</CardTitle>
          <CardDescription>
            Professional HMAC generator for API authentication, data integrity verification, and secure messaging
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Generate cryptographically secure HMAC hashes using various algorithms (SHA-256, SHA-512, SHA-1, MD5). Perfect for API authentication, webhook signatures, JWT tokens, and data integrity verification. Supports text input and file uploads.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                Key Features
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Multiple HMAC algorithms (SHA-256, SHA-512, SHA-1, MD5)</li>
                <li>• Text and file input support</li>
                <li>• Random secure key generation</li>
                <li>• Real-time hash computation</li>
                <li>• Copy and download results</li>
                <li>• Hex output format</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Lock className="mr-2 h-4 w-4 text-primary" />
                Use Cases
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• API request authentication</li>
                <li>• Webhook signature verification</li>
                <li>• JWT token signing</li>
                <li>• Data integrity checks</li>
                <li>• Secure message authentication</li>
                <li>• Password-based authentication</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generate HMAC</CardTitle>
          <CardDescription>Enter your data and secret key to generate HMAC</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Algorithm</Label>
              <Select value={algorithm} onValueChange={(v) => handleAlgorithmChange(v as Algorithm)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SHA256">SHA-256 (Recommended)</SelectItem>
                  <SelectItem value="SHA512">SHA-512</SelectItem>
                  <SelectItem value="SHA1">SHA-1</SelectItem>
                  <SelectItem value="MD5">MD5 (Legacy)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="flex gap-2">
                <Button variant="outline" onClick={generateRandomKey} className="flex-1">
                  <Key className="mr-2 h-4 w-4" />
                  Generate Key
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Secret Key *</Label>
            <Input
              type="password"
              value={secretKey}
              onChange={(e) => handleKeyChange(e.target.value)}
              placeholder="Enter your secret key..."
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Keep your secret key safe. Never share it publicly.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Text Input</TabsTrigger>
              <TabsTrigger value="file">File Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-2">
              <Label>Input Data</Label>
              <Textarea
                value={inputText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Enter text to generate HMAC..."
                className="min-h-[150px] font-mono"
              />
            </TabsContent>

            <TabsContent value="file" className="space-y-2">
              <Label>Upload File</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".txt,.json,.xml,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="hmac-file-upload"
                />
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('hmac-file-upload')?.click()}
                >
                  Choose File
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Supports .txt, .json, .xml, .csv files
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {hmacResult && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>HMAC Result ({algorithm})</Label>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadResult}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="bg-muted rounded-md p-4">
                <code className="font-mono text-sm break-all">{hmacResult}</code>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-card border rounded-md p-3">
                  <p className="text-muted-foreground mb-1">Algorithm</p>
                  <p className="font-semibold">{algorithm}</p>
                </div>
                <div className="bg-card border rounded-md p-3">
                  <p className="text-muted-foreground mb-1">Hash Length</p>
                  <p className="font-semibold">{hmacResult.length} characters</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>SHA-256</strong> is recommended for most use cases (strong security, good performance)</p>
          <p>• <strong>SHA-512</strong> provides maximum security but slower performance</p>
          <p>• <strong>SHA-1</strong> is considered weak, use only for legacy systems</p>
          <p>• <strong>MD5</strong> is cryptographically broken, avoid for security purposes</p>
          <p>• All computations are performed client-side. Your data never leaves your browser.</p>
          <p>• Always use a strong, randomly generated secret key for production systems.</p>
        </CardContent>
      </Card>
    </div>
  );
}
