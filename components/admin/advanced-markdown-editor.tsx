"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link2,
  Image,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Table,
  CheckSquare,
  Eye,
  EyeOff,
  Copy,
  Download,
  Upload,
  Undo,
  Redo,
  Maximize2,
  Minimize2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

interface AdvancedMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export default function AdvancedMarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  height = "500px",
}: AdvancedMarkdownEditorProps) {
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Save to history
  const saveToHistory = useCallback((newValue: string) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newValue);
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  }, [historyIndex, history, onChange]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  }, [historyIndex, history, onChange]);

  // Insert text at cursor position
  const insertText = useCallback((before: string, after: string = "", placeholder: string = "") => {
    const textarea = document.querySelector('textarea[data-markdown-editor]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || placeholder;
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    saveToHistory(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange, saveToHistory]);

  // Markdown actions
  const actions = {
    bold: () => insertText("**", "**", "bold text"),
    italic: () => insertText("*", "*", "italic text"),
    strikethrough: () => insertText("~~", "~~", "strikethrough text"),
    code: () => insertText("`", "`", "code"),
    codeBlock: () => insertText("```\n", "\n```", "code block"),
    link: () => insertText("[", "](url)", "link text"),
    image: () => insertText("![", "](url)", "alt text"),
    unorderedList: () => insertText("\n- ", "", "list item"),
    orderedList: () => insertText("\n1. ", "", "list item"),
    quote: () => insertText("\n> ", "", "quote"),
    heading1: () => insertText("\n# ", "", "Heading 1"),
    heading2: () => insertText("\n## ", "", "Heading 2"),
    heading3: () => insertText("\n### ", "", "Heading 3"),
    table: () => insertText("\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n", ""),
    checkbox: () => insertText("\n- [ ] ", "", "task"),
    horizontalRule: () => insertText("\n---\n", ""),
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey)) {
        switch(e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'b':
            e.preventDefault();
            actions.bold();
            break;
          case 'i':
            e.preventDefault();
            actions.italic();
            break;
          case 'k':
            e.preventDefault();
            actions.link();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, actions]);

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  // Download as file
  const downloadMarkdown = () => {
    const blob = new Blob([value], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded markdown file");
  };

  // Upload file
  const uploadMarkdown = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onChange(content);
          saveToHistory(content);
          toast.success("File loaded successfully");
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : ''}`}>
      <Card className={isFullscreen ? 'h-full' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Content Editor</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={historyIndex === 0}
                title="Undo (Ctrl+Z)"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={historyIndex === history.length - 1}
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                title="Toggle Preview"
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                title="Copy to Clipboard"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadMarkdown}
                title="Download Markdown"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={uploadMarkdown}
                title="Upload Markdown"
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className={isFullscreen ? 'h-[calc(100%-5rem)] overflow-hidden' : ''}>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-2 border rounded-t-lg bg-muted/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={actions.heading1}
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={actions.heading2}
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={actions.heading3}
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={actions.bold}
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={actions.italic}
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={actions.strikethrough}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={actions.link}
              title="Link (Ctrl+K)"
            >
              <Link2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={actions.image}
              title="Image"
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={actions.code}
              title="Inline Code"
            >
              <Code className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={actions.unorderedList}
              title="Unordered List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={actions.orderedList}
              title="Ordered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={actions.checkbox}
              title="Task List"
            >
              <CheckSquare className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={actions.quote}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={actions.table}
              title="Table"
            >
              <Table className="h-4 w-4" />
            </Button>
          </div>

          {/* Editor/Preview */}
          <Tabs defaultValue="write" className="w-full">
            <TabsList className="w-full justify-start border-x border-b rounded-none">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              {showPreview && <TabsTrigger value="split">Split View</TabsTrigger>}
            </TabsList>

            <TabsContent value="write" className="mt-0">
              <Textarea
                data-markdown-editor
                value={value}
                onChange={(e) => {
                  onChange(e.target.value);
                  saveToHistory(e.target.value);
                }}
                placeholder={placeholder}
                className="font-mono resize-none rounded-t-none border-t-0"
                style={{ minHeight: height }}
              />
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <div
                className="p-4 border rounded-b-lg prose prose-sm dark:prose-invert max-w-none overflow-auto"
                style={{ minHeight: height }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {value || "*Nothing to preview yet...*"}
                </ReactMarkdown>
              </div>
            </TabsContent>

            <TabsContent value="split" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                <Textarea
                  data-markdown-editor
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value);
                    saveToHistory(e.target.value);
                  }}
                  placeholder={placeholder}
                  className="font-mono resize-none rounded-t-none border-t-0"
                  style={{ minHeight: height }}
                />
                <div
                  className="p-4 border rounded-lg prose prose-sm dark:prose-invert max-w-none overflow-auto"
                  style={{ minHeight: height }}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {value || "*Nothing to preview yet...*"}
                  </ReactMarkdown>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Info Bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 px-2">
            <div className="flex items-center gap-4">
              <span>Words: {value.split(/\s+/).filter(Boolean).length}</span>
              <span>Characters: {value.length}</span>
              <span>Lines: {value.split('\n').length}</span>
            </div>
            <div>
              <span>Markdown supported with GitHub Flavored Markdown</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
