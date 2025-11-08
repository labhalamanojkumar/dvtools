"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Search, Plus, Copy, Edit, Trash2, FolderOpen, Code2, Tag, Upload, Loader2 } from "lucide-react";

interface Snippet {
  id: string;
  title: string;
  description: string;
  language: string;
  content: string;
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface FileUpload {
  name: string;
  content: string;
}

const LANGUAGES = [
  "javascript", "typescript", "python", "java", "cpp", "csharp", "go", "rust",
  "php", "ruby", "swift", "kotlin", "dart", "scala", "html", "css", "scss",
  "sql", "bash", "powershell", "yaml", "json", "xml", "markdown"
];

const CATEGORIES = [
  "General", "React", "Node.js", "Express", "Database", "API", "Testing",
  "Deployment", "DevOps", "Security", "Performance", "UI/UX", "Utilities"
];

export default function SnippetLibraryClient() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New snippet form state
  const [newSnippet, setNewSnippet] = useState({
    title: "",
    description: "",
    language: "javascript",
    content: "",
    tags: [] as string[],
    category: "General",
  });
  const [tagInput, setTagInput] = useState("");
  const [dropZoneActive, setDropZoneActive] = useState(false);

  // Load snippets
  const loadSnippets = useCallback(async () => {
    try {
      const res = await fetch("/api/tools/code-formatting/snippets");
      const data = await res.json();
      if (data.success) {
        setSnippets(data.snippets);
        setFilteredSnippets(data.snippets);
      }
    } catch (e: any) {
      toast.error(`Failed to load snippets: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSnippets();
  }, [loadSnippets]);

  // Filter snippets
  useEffect(() => {
    let filtered = snippets;

    if (searchQuery) {
      filtered = filtered.filter(snippet =>
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedLanguage !== "all") {
      filtered = filtered.filter(snippet => snippet.language === selectedLanguage);
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(snippet => snippet.category === selectedCategory);
    }

    setFilteredSnippets(filtered);
  }, [snippets, searchQuery, selectedLanguage, selectedCategory]);

  // Add snippet
  const addSnippet = useCallback(async () => {
    if (!newSnippet.title.trim() || !newSnippet.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      const res = await fetch("/api/tools/code-formatting/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSnippet),
      });

      const data = await res.json();
      if (data.success) {
        setNewSnippet({
          title: "",
          description: "",
          language: "javascript",
          content: "",
          tags: [],
          category: "General",
        });
        setTagInput("");
        setShowAddForm(false);
        loadSnippets();
        toast.success("Snippet added successfully");
      } else {
        toast.error(data.error || "Failed to add snippet");
      }
    } catch (e: any) {
      toast.error(`Failed to add snippet: ${e.message}`);
    }
  }, [newSnippet, loadSnippets]);

  // Upload files
  const uploadFiles = useCallback(async (files: File[]) => {
    setUploading(true);
    try {
      const uploads: FileUpload[] = [];
      
      for (const file of files) {
        const text = await file.text();
        uploads.push({
          name: file.name,
          content: text,
        });
      }

      const res = await fetch("/api/tools/code-formatting/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: uploads,
          description: "Imported from file upload",
          category: newSnippet.category,
          tags: newSnippet.tags,
        }),
      });

      const data = await res.json();
      if (data.success) {
        loadSnippets();
        toast.success(`${files.length} file(s) uploaded successfully`);
      } else {
        toast.error(data.error || "Failed to upload files");
      }
    } catch (e: any) {
      toast.error(`Failed to upload files: ${e.message}`);
    } finally {
      setUploading(false);
    }
  }, [newSnippet.category, newSnippet.tags, loadSnippets]);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      uploadFiles(files);
    }
  }, [uploadFiles]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDropZoneActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDropZoneActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDropZoneActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFiles(files);
    }
  }, [uploadFiles]);

  // Copy snippet to clipboard
  const copySnippet = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Snippet copied to clipboard");
    } catch (e) {
      toast.error("Failed to copy snippet");
    }
  }, []);

  // Delete snippet
  const deleteSnippet = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this snippet?")) return;

    try {
      const res = await fetch(`/api/tools/code-formatting/snippets?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        loadSnippets();
        toast.success("Snippet deleted");
      } else {
        toast.error(data.error || "Failed to delete snippet");
      }
    } catch (e: any) {
      toast.error(`Failed to delete snippet: ${e.message}`);
    }
  }, [loadSnippets]);

  // Add tag to new snippet
  const addTag = () => {
    if (tagInput.trim() && !newSnippet.tags.includes(tagInput.trim())) {
      setNewSnippet(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  // Remove tag from new snippet
  const removeTag = (tagToRemove: string) => {
    setNewSnippet(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Load sample snippets
  const loadSampleSnippets = () => {
    const samples: Omit<Snippet, "id" | "createdAt" | "updatedAt">[] = [
      {
        title: "React useEffect Hook",
        description: "Basic useEffect hook with cleanup",
        language: "javascript",
        content: `import { useEffect } from 'react';

function MyComponent({ id }) {
  useEffect(() => {
    // Component did mount / id changed
    const fetchData = async () => {
      const response = await fetch(\`/api/data/\${id}\`);
      const data = await response.json();
      // Handle data
    };

    fetchData();

    // Cleanup function
    return () => {
      // Component will unmount or id will change
      // Cleanup here
    };
  }, [id]); // Dependency array

  return <div>My Component</div>;
}`,
        tags: ["react", "hooks", "useEffect", "lifecycle"],
        category: "React"
      },
      {
        title: "Python List Comprehension",
        description: "Efficient list creation with comprehension",
        language: "python",
        content: `# Basic list comprehension
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers]
# [1, 4, 9, 16, 25]

# With condition
even_squares = [x**2 for x in numbers if x % 2 == 0]
# [4, 16]

# Nested comprehension
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
# [1, 2, 3, 4, 5, 6, 7, 8, 9]`,
        tags: ["python", "list", "comprehension", "functional"],
        category: "General"
      },
      {
        title: "Express.js Route Handler",
        description: "Basic Express route with error handling",
        language: "javascript",
        content: `const express = require('express');
const router = express.Router();

// GET route with async/await
router.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;`,
        tags: ["express", "nodejs", "api", "routes", "error-handling"],
        category: "Node.js"
      }
    ];

    // Add samples to snippets (in a real app, this would be an API call)
    const sampleSnippets: Snippet[] = samples.map((sample, index) => ({
      ...sample,
      id: `sample-${index}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    setSnippets(prev => [...sampleSnippets, ...prev]);
    toast.success("Sample snippets loaded");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-6 h-6" />
            <span>Search & Filter Snippets</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language-filter">Language</Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger id="language-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-filter">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLanguage("all");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {filteredSnippets.length} of {snippets.length} snippets
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadSampleSnippets}>
            Load Samples
          </Button>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            multiple
            onChange={handleFileInputChange}
          />
          <Button 
            variant="outline"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Upload Files
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Snippet
          </Button>
        </div>
      </div>

      {/* Add Snippet Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Snippet</CardTitle>
            <CardDescription>Create a new code snippet for your library</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Snippet title"
                  value={newSnippet.title}
                  onChange={(e) => setNewSnippet(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language *</Label>
                <Select
                  value={newSnippet.language}
                  onValueChange={(value) => setNewSnippet(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of the snippet"
                value={newSnippet.description}
                onChange={(e) => setNewSnippet(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newSnippet.category}
                onValueChange={(value) => setNewSnippet(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {newSnippet.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Code Content *</Label>
              <Textarea
                id="content"
                rows={12}
                className="font-mono text-sm"
                placeholder="Paste your code snippet here..."
                value={newSnippet.content}
                onChange={(e) => setNewSnippet(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={addSnippet}>
                Save Snippet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Snippets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSnippets.map((snippet) => (
          <Card key={snippet.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{snippet.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {snippet.description}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="ml-2">
                  {snippet.language}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1">
                {snippet.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {snippet.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{snippet.tags.length - 3}
                  </Badge>
                )}
              </div>

              <ScrollArea className="h-32 w-full rounded border">
                <pre className="text-xs font-mono p-3 whitespace-pre-wrap">
                  {snippet.content.length > 200
                    ? `${snippet.content.substring(0, 200)}...`
                    : snippet.content
                  }
                </pre>
              </ScrollArea>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{snippet.category}</span>
                <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copySnippet(snippet.content)}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteSnippet(snippet.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSnippets.length === 0 && (
        <Card
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`${
            dropZoneActive ? "border-primary border-dashed" : ""
          } transition-colors duration-200`}
        >
          <CardContent className="text-center py-12">
            <div className={`${dropZoneActive ? "scale-110" : ""} transition-transform duration-200`}>
              {uploading ? (
                <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin mb-4" />
              ) : (
                <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              )}
            </div>
            <h3 className="text-lg font-medium mb-2">
              {dropZoneActive ? (
                "Drop files here to upload"
              ) : uploading ? (
                "Uploading files..."
              ) : (
                "No snippets found"
              )}
            </h3>
            <p className="text-muted-foreground mb-4">
              {dropZoneActive ? (
                "Release to upload your files"
              ) : uploading ? (
                "Please wait while we process your files..."
              ) : snippets.length === 0 ? (
                "Get started by adding your first snippet, uploading files, or loading sample snippets."
              ) : (
                "Try adjusting your search or filter criteria."
              )}
            </p>
            {!uploading && snippets.length === 0 && !dropZoneActive && (
              <div className="flex justify-center space-x-4">
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Snippet
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}