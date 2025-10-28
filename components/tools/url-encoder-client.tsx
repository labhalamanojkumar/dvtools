"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { copyToClipboard, downloadFile } from "../../lib/utils";
import { useToast } from "../ui/toaster";
import { Copy, Download } from "lucide-react";

export function UrlEncoderClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { toast } = useToast();

  const encodeUrl = () => {
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      toast({ title: "Success", description: "URL encoded successfully" });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to encode URL",
        variant: "destructive",
      });
    }
  };

  const decodeUrl = () => {
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      toast({ title: "Success", description: "URL decoded successfully" });
    } catch (err) {
      toast({
        title: "Error",
        description: "Invalid URL encoding",
        variant: "destructive",
      });
    }
  };

  const encodeFullUrl = () => {
    try {
      const encoded = encodeURI(input);
      setOutput(encoded);
      toast({ title: "Success", description: "Full URL encoded successfully" });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to encode URL",
        variant: "destructive",
      });
    }
  };

  const decodeFullUrl = () => {
    try {
      const decoded = decodeURI(input);
      setOutput(decoded);
      toast({ title: "Success", description: "Full URL decoded successfully" });
    } catch (err) {
      toast({
        title: "Error",
        description: "Invalid URL encoding",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Input URL</h3>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter URL or text to encode/decode..."
              className="code-editor min-h-[300px]"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={encodeUrl}>Encode Component</Button>
              <Button onClick={decodeUrl} variant="outline">
                Decode Component
              </Button>
              <Button onClick={encodeFullUrl} variant="secondary">
                Encode Full URL
              </Button>
              <Button onClick={decodeFullUrl} variant="secondary">
                Decode Full URL
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Output</h3>
              {output && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(output)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      downloadFile(output, "url-output.txt", "text/plain")
                    }
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <pre className="code-editor min-h-[300px] overflow-auto">
              <code>{output || "Encoded/decoded URL will appear here..."}</code>
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Quick Examples */}
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Quick Examples</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-4"
              onClick={() => setInput("Hello World! How are you?")}
            >
              <div>
                <div className="font-semibold">Text with Spaces</div>
                <div className="text-sm text-muted-foreground">
                  Hello World! How are you?
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-4"
              onClick={() => setInput("name=John Doe&age=30&city=New York")}
            >
              <div>
                <div className="font-semibold">Query String</div>
                <div className="text-sm text-muted-foreground">
                  URL parameters
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-4"
              onClick={() =>
                setInput("https://example.com/path with spaces/file?name=value")
              }
            >
              <div>
                <div className="font-semibold">Full URL</div>
                <div className="text-sm text-muted-foreground">
                  Complete URL with spaces
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold">URL Encoding Types</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">encodeURIComponent()</h4>
              <p className="text-sm text-muted-foreground">
                Encodes all characters except: A-Z a-z 0-9 - _ . ! ~ * &apos; (
                )
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">encodeURI()</h4>
              <p className="text-sm text-muted-foreground">
                Encodes characters that have special meaning in URLs except: ; ,
                / ? : @ & = + $ - _ . ! ~ * &apos; ( ) #
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
