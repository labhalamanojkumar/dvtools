"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  FileText,
  Upload,
  Download,
  Save,
  Clock,
  Search,
  Plus,
  Eye,
  Edit,
  GitBranch,
  History
} from "lucide-react";

interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

interface Version {
  id: string;
  documentId: string;
  version: number;
  content: string;
  commitMessage: string;
  author: string;
  timestamp: string;
}

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  category: string;
  score: number;
}

export default function KnowledgeBaseEditorClient() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [versions, setVersions] = useState<Version[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [commitMessage, setCommitMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setMarkdown(content);
      setTitle(file.name.replace(".md", ""));
      toast.success("File loaded successfully");
    };
    reader.readAsText(file);
    event.target.value = '';
  }, []);

  const loadDocuments = useCallback(async () => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/knowledge-base-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getDocuments" })
      });

      if (!response.ok) throw new Error("Failed to load documents");

      const data = await response.json();
      setDocuments(data.documents);
      toast.success("Documents loaded");
    } catch (error) {
      console.error("Load documents error:", error);
      toast.error("Failed to load documents");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const saveDocument = useCallback(async () => {
    if (!title.trim() || !markdown.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/knowledge-base-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveDocument",
          documentId: currentDoc?.id,
          title,
          content: markdown,
          category,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
          commitMessage: commitMessage || "Update document"
        })
      });

      if (!response.ok) throw new Error("Failed to save document");

      const data = await response.json();
      setCurrentDoc(data.document);
      setCommitMessage("");
      toast.success("Document saved successfully");
      loadDocuments();
    } catch (error) {
      console.error("Save document error:", error);
      toast.error("Failed to save document");
    } finally {
      setIsProcessing(false);
    }
  }, [title, markdown, category, tags, commitMessage, currentDoc, loadDocuments]);

  const loadDocument = useCallback((doc: Document) => {
    setCurrentDoc(doc);
    setTitle(doc.title);
    setMarkdown(doc.content);
    setCategory(doc.category);
    setTags(doc.tags.join(", "));
    setViewMode("edit");
  }, []);

  const newDocument = useCallback(() => {
    setCurrentDoc(null);
    setTitle("");
    setMarkdown("# New Document\n\nStart writing your documentation here...");
    setCategory("");
    setTags("");
    setCommitMessage("");
    setViewMode("edit");
  }, []);

  const loadVersionHistory = useCallback(async () => {
    if (!currentDoc) {
      toast.error("Please select a document first");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/knowledge-base-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getVersions",
          documentId: currentDoc.id
        })
      });

      if (!response.ok) throw new Error("Failed to load versions");

      const data = await response.json();
      setVersions(data.versions);
    } catch (error) {
      console.error("Load versions error:", error);
      toast.error("Failed to load version history");
    } finally {
      setIsProcessing(false);
    }
  }, [currentDoc]);

  const restoreVersion = useCallback(async (versionId: string) => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/knowledge-base-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "restoreVersion",
          versionId
        })
      });

      if (!response.ok) throw new Error("Failed to restore version");

      const data = await response.json();
      setMarkdown(data.content);
      toast.success("Version restored");
    } catch (error) {
      console.error("Restore version error:", error);
      toast.error("Failed to restore version");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const searchDocuments = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/knowledge-base-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "search",
          query: searchQuery
        })
      });

      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setSearchResults(data.results);
      toast.success(`Found ${data.results.length} results`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed");
    } finally {
      setIsProcessing(false);
    }
  }, [searchQuery]);

  const downloadDocument = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "document"}.md`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    toast.success("Document downloaded");
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Editor</CardTitle>
          <CardDescription>Create and edit markdown documents with version control</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".md,.markdown,.txt"
            onChange={handleFileUpload}
          />

          <div className="flex gap-2 flex-wrap">
            <Button onClick={newDocument} variant="default">
              <Plus className="w-4 h-4 mr-2" />
              New Document
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import .md File
            </Button>
            <Button onClick={saveDocument} disabled={isProcessing}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={downloadDocument} variant="outline" disabled={!markdown}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={() => setViewMode(viewMode === "edit" ? "preview" : "edit")}
              variant="outline"
            >
              {viewMode === "edit" ? <Eye className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {viewMode === "edit" ? "Preview" : "Edit"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Getting Started Guide"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Tutorial"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="guide, setup, beginner"
              />
            </div>
          </div>

          {currentDoc && (
            <div className="space-y-2">
              <Label htmlFor="commit-message">Commit Message (optional)</Label>
              <Input
                id="commit-message"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Updated installation instructions"
              />
            </div>
          )}

          {viewMode === "edit" ? (
            <div className="space-y-2">
              <Label htmlFor="markdown">Markdown Content</Label>
              <Textarea
                id="markdown"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="font-mono text-sm min-h-[500px]"
                placeholder="# Write your markdown here..."
              />
            </div>
          ) : (
            <div className="border rounded-lg p-6 min-h-[500px] prose prose-slate max-w-none">
              <div dangerouslySetInnerHTML={{ __html: markdown.replace(/\n/g, '<br/>') }} />
            </div>
          )}

          {currentDoc && (
            <Alert>
              <Clock className="w-4 h-4" />
              <AlertDescription>
                Version {currentDoc.version} • Last updated: {currentDoc.updatedAt} by {currentDoc.author}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="versions">Version History</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Documents</CardTitle>
                  <CardDescription>Browse and manage your knowledge base</CardDescription>
                </div>
                <Button onClick={loadDocuments} disabled={isProcessing} variant="outline">
                  Load Documents
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {doc.tags.slice(0, 2).map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {doc.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{doc.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>v{doc.version}</TableCell>
                        <TableCell className="text-sm">{doc.updatedAt}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => loadDocument(doc)}
                          >
                            Open
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No documents found. Create a new document to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Version History</CardTitle>
                  <CardDescription>
                    {currentDoc ? `History for: ${currentDoc.title}` : "Select a document to view versions"}
                  </CardDescription>
                </div>
                <Button onClick={loadVersionHistory} disabled={isProcessing || !currentDoc} variant="outline">
                  <History className="w-4 h-4 mr-2" />
                  Load History
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {versions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Version</TableHead>
                      <TableHead>Commit Message</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {versions.map((version) => (
                      <TableRow key={version.id}>
                        <TableCell>
                          <Badge variant="outline">v{version.version}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{version.commitMessage}</TableCell>
                        <TableCell>{version.author}</TableCell>
                        <TableCell className="text-sm">{version.timestamp}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => restoreVersion(version.id)}
                            disabled={isProcessing}
                          >
                            <GitBranch className="w-3 h-3 mr-1" />
                            Restore
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a document and click "Load History" to view versions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Knowledge Base</CardTitle>
              <CardDescription>Full-text search across all documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, content, or tags..."
                  onKeyDown={(e) => e.key === "Enter" && searchDocuments()}
                />
                <Button onClick={searchDocuments} disabled={isProcessing}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((result) => (
                    <Card key={result.id}>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{result.title}</h3>
                            <Badge variant="outline">{result.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{result.snippet}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Score: {result.score.toFixed(2)}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No results found for "{searchQuery}"</p>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter a search query to find documents</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
