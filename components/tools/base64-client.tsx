"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { useToast } from "../ui/toaster";
import SEOHead from "../seo/seo-head";
import FileUploadComponent from "./file-upload-component";
import { copyToClipboard, downloadFile } from "../../lib/utils";
import { Copy, Download, Info, Code } from "lucide-react";

export function Base64Client() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [encodingMode, setEncodingMode] = useState<"encode" | "decode">("encode");
  const { toast } = useToast();

  const encode = () => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);
      toast({ title: "Encoded", description: "Text encoded to Base64 successfully" });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to encode text. Please check your input.",
        variant: "destructive",
      });
    }
  };

  const decode = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);

      // Try to detect MIME type
      if (decoded.startsWith("data:")) {
        const match = decoded.match(/^data:([^;]+);/);
        if (match) setMimeType(match[1]);
      }

      toast({ title: "Decoded", description: "Base64 decoded successfully" });
    } catch (err) {
      toast({
        title: "Error",
        description: "Invalid Base64 string. Please check your input.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (file: File, content: string) => {
    try {
      if (encodingMode === "encode") {
        // For encoding mode, use the file content directly
        setInput(content);
      } else {
        // For decoding mode, use the file as base64
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          setInput(base64.split(",")[1] || base64);
          setMimeType(file.type);
        };
        reader.readAsDataURL(file);
      }
      
      toast({
        title: "File Uploaded",
        description: `${file.name} has been loaded successfully`
      });
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to process the uploaded file",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setMimeType("");
    toast({ title: "Cleared", description: "All inputs and outputs cleared" });
  };

  const swapContent = () => {
    setInput(output);
    setOutput("");
    setEncodingMode(encodingMode === "encode" ? "decode" : "encode");
    toast({ title: "Swapped", description: "Input and output have been swapped" });
  };

  return (
    <>
      <SEOHead
        title="Base64 Encoder/Decoder - Convert Text and Files to Base64"
        description="Convert text and files to Base64 encoding or decode Base64 strings. Supports file upload, MIME type detection, and copy to clipboard functionality."
        keywords={["base64", "encoder", "decoder", "encoding", "conversion", "text", "file"]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Base64 Encoder/Decoder",
          "description": "Convert text and files to Base64 encoding or decode Base64 strings",
          "applicationCategory": "DeveloperTool",
          "featureList": [
            "Text encoding/decoding",
            "File upload/download",
            "MIME type detection",
            "Copy to clipboard"
          ]
        }}
      />
      
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Code className="w-6 h-6" />
          <h1 className="text-3xl font-bold">Base64 Encoder/Decoder</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>About Base64 Encoding</CardTitle>
            <CardDescription>
              Base64 is an encoding scheme used to convert binary data into ASCII text format.
              It's commonly used for encoding images, files, and other data in web applications.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Mode Selection */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Mode:</span>
              <div className="flex space-x-2">
                <Button
                  variant={encodingMode === "encode" ? "default" : "outline"}
                  onClick={() => setEncodingMode("encode")}
                >
                  Encode
                </Button>
                <Button
                  variant={encodingMode === "decode" ? "default" : "outline"}
                  onClick={() => setEncodingMode("decode")}
                >
                  Decode
                </Button>
              </div>
              <Badge variant="secondary">{encodingMode === "encode" ? "Text → Base64" : "Base64 → Text"}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* File Upload Component */}
        <FileUploadComponent
          onFileUpload={handleFileUpload}
          acceptedTypes={["text/*", "application/json", "application/xml", "image/*"]}
          maxSize={10}
          title={`${encodingMode === "encode" ? "Upload File to Encode" : "Upload Base64 File to Decode"}`}
          description={`Upload files to ${encodingMode} with base64 encoding`}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>
                {encodingMode === "encode" ? "Enter text to encode to Base64" : "Enter Base64 string to decode"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={encodingMode === "encode" ? "Enter text to encode..." : "Enter Base64 string to decode..."}
                className="min-h-[300px] font-mono"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={encodingMode === "encode" ? encode : decode}>
                  {encodingMode === "encode" ? "Encode to Base64" : "Decode from Base64"}
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  Clear
                </Button>
                {output && (
                  <Button variant="outline" onClick={swapContent}>
                    Swap
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Output</CardTitle>
                  <CardDescription>
                    {encodingMode === "encode" ? "Encoded Base64 result" : "Decoded text result"}
                  </CardDescription>
                </div>
                {mimeType && (
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4" />
                    <Badge variant="secondary">{mimeType}</Badge>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative">
                <Textarea
                  value={output}
                  readOnly
                  placeholder="Output will appear here..."
                  className="min-h-[300px] font-mono bg-muted"
                />
                {output && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline">{output.length} chars</Badge>
                  </div>
                )}
              </div>
              
              {output && (
                <>
                  <Separator className="my-4" />
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => copyToClipboard(output)} variant="outline">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => downloadFile(output, `base64-${encodingMode}-${Date.now()}.txt`)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Examples Section */}
        <Card>
          <CardHeader>
            <CardTitle>Examples</CardTitle>
            <CardDescription>
              Try these examples to see how Base64 encoding works
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Text → Base64</h4>
                <div className="p-3 bg-muted rounded text-sm">
                  <div><strong>Input:</strong> Hello, World!</div>
                  <div><strong>Output:</strong> SGVsbG8sIFdvcmxkIQ==</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInput("Hello, World!")}
                >
                  Try Example
                </Button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Base64 → Text</h4>
                <div className="p-3 bg-muted rounded text-sm">
                  <div><strong>Input:</strong> SGVsbG8sIFdvcmxkIQ==</div>
                  <div><strong>Output:</strong> Hello, World!</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInput("SGVsbG8sIFdvcmxkIQ==")}
                >
                  Try Example
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
