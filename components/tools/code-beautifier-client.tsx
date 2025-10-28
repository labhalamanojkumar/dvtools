"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { copyToClipboard, downloadFile } from "../../lib/utils";
import { useToast } from "../ui/toaster";
import { Copy, Download } from "lucide-react";
import * as beautify from "js-beautify";

export function CodeBeautifierClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const { toast } = useToast();

  const formatCode = () => {
    try {
      let formatted = "";

      switch (language) {
        case "html":
          formatted = beautify.html(input, {
            indent_size: 2,
            indent_char: " ",
            max_preserve_newlines: 1,
            preserve_newlines: true,
            end_with_newline: false,
          });
          break;

        case "css":
          formatted = beautify.css(input, {
            indent_size: 2,
            indent_char: " ",
            max_preserve_newlines: 1,
            preserve_newlines: true,
            end_with_newline: false,
          });
          break;

        case "javascript":
        default:
          formatted = beautify.js(input, {
            indent_size: 2,
            indent_char: " ",
            max_preserve_newlines: 2,
            preserve_newlines: true,
            end_with_newline: false,
          });
          break;
      }

      setOutput(formatted);
      toast({ title: "Success", description: "Code formatted successfully" });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to format code",
        variant: "destructive",
      });
    }
  };

  const minifyCode = () => {
    try {
      let minified = "";

      switch (language) {
        case "html":
          minified = beautify.html(input, {
            indent_size: 0,
            indent_char: " ",
            max_preserve_newlines: 0,
            preserve_newlines: false,
          });
          break;

        case "css":
          minified = beautify.css(input, {
            indent_size: 0,
            indent_char: " ",
            max_preserve_newlines: 0,
            preserve_newlines: false,
          });
          break;

        case "javascript":
        default:
          minified = beautify.js(input, {
            indent_size: 0,
            indent_char: " ",
            max_preserve_newlines: 0,
            preserve_newlines: false,
          });
          break;
      }

      setOutput(minified);
      toast({ title: "Success", description: "Code minified successfully" });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to minify code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Input Code</h3>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your code here..."
              className="code-editor min-h-[400px]"
            />
            <div className="mt-4 flex gap-2">
              <Button onClick={formatCode}>Format</Button>
              <Button onClick={minifyCode} variant="outline">
                Minify
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Formatted Code</h3>
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
                      downloadFile(
                        output,
                        `formatted.${language}`,
                        "text/plain",
                      )
                    }
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <pre className="code-editor min-h-[400px] overflow-auto">
              <code>{output || "Formatted code will appear here..."}</code>
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
              onClick={() => {
                setLanguage("javascript");
                setInput(
                  'function hello(name){console.log("Hello "+name);return true;}',
                );
              }}
            >
              <div>
                <div className="font-semibold">JavaScript</div>
                <div className="text-sm text-muted-foreground">
                  Minified function
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-4"
              onClick={() => {
                setLanguage("html");
                setInput("<div><h1>Hello</h1><p>World</p></div>");
              }}
            >
              <div>
                <div className="font-semibold">HTML</div>
                <div className="text-sm text-muted-foreground">
                  Simple markup
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-4"
              onClick={() => {
                setLanguage("css");
                setInput(
                  ".container{margin:0 auto;max-width:1200px;padding:20px;}",
                );
              }}
            >
              <div>
                <div className="font-semibold">CSS</div>
                <div className="text-sm text-muted-foreground">
                  Compact styles
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
