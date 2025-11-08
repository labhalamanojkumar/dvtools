import { NextRequest, NextResponse } from "next/server";

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

// In-memory storage (use database in production)
const documentsStore = new Map<string, Document>();
const versionsStore: Version[] = [];

// Initialize with mock data
function initializeMockData() {
  if (documentsStore.size === 0) {
    const mockDocs: Document[] = [
      {
        id: "1",
        title: "Getting Started Guide",
        content: "# Getting Started\n\nWelcome to our platform! This guide will help you get up and running quickly.\n\n## Prerequisites\n\n- Node.js 18+\n- npm or yarn\n\n## Installation\n\n```bash\nnpm install\n```",
        category: "Tutorial",
        tags: ["guide", "setup", "beginner"],
        author: "admin@example.com",
        createdAt: "2024-01-10",
        updatedAt: "2024-01-15",
        version: 3
      },
      {
        id: "2",
        title: "API Documentation",
        content: "# API Reference\n\n## Authentication\n\nAll API requests require an API key in the header:\n\n```\nAuthorization: Bearer YOUR_API_KEY\n```\n\n## Endpoints\n\n### GET /api/users\n\nReturns a list of users.",
        category: "Reference",
        tags: ["api", "documentation", "rest"],
        author: "developer@example.com",
        createdAt: "2024-01-12",
        updatedAt: "2024-01-18",
        version: 5
      },
      {
        id: "3",
        title: "Deployment Guide",
        content: "# Deployment\n\n## Production Deployment\n\n1. Build the application:\n\n```bash\nnpm run build\n```\n\n2. Start the server:\n\n```bash\nnpm start\n```",
        category: "Guide",
        tags: ["deployment", "production", "devops"],
        author: "devops@example.com",
        createdAt: "2024-01-08",
        updatedAt: "2024-01-20",
        version: 2
      }
    ];

    mockDocs.forEach(doc => documentsStore.set(doc.id, doc));

    // Add version history
    versionsStore.push(
      {
        id: "v1",
        documentId: "1",
        version: 1,
        content: "# Getting Started\n\nInitial version",
        commitMessage: "Initial commit",
        author: "admin@example.com",
        timestamp: "2024-01-10 10:00:00"
      },
      {
        id: "v2",
        documentId: "1",
        version: 2,
        content: "# Getting Started\n\nAdded prerequisites section",
        commitMessage: "Add prerequisites",
        author: "admin@example.com",
        timestamp: "2024-01-12 14:30:00"
      },
      {
        id: "v3",
        documentId: "1",
        version: 3,
        content: "# Getting Started\n\nComplete guide with installation steps",
        commitMessage: "Add installation instructions",
        author: "admin@example.com",
        timestamp: "2024-01-15 09:15:00"
      }
    );
  }
}

// Simple search implementation
function searchDocuments(query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  documentsStore.forEach(doc => {
    const titleMatch = doc.title.toLowerCase().includes(lowerQuery);
    const contentMatch = doc.content.toLowerCase().includes(lowerQuery);
    const tagMatch = doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery));

    if (titleMatch || contentMatch || tagMatch) {
      // Calculate simple relevance score
      let score = 0;
      if (titleMatch) score += 10;
      if (contentMatch) score += 5;
      if (tagMatch) score += 3;

      // Extract snippet
      const contentLower = doc.content.toLowerCase();
      const index = contentLower.indexOf(lowerQuery);
      const start = Math.max(0, index - 50);
      const end = Math.min(doc.content.length, index + 100);
      const snippet = doc.content.substring(start, end).trim() + "...";

      results.push({
        id: doc.id,
        title: doc.title,
        snippet: snippet || doc.content.substring(0, 150) + "...",
        category: doc.category,
        score
      });
    }
  });

  return results.sort((a, b) => b.score - a.score);
}

export async function POST(request: NextRequest) {
  try {
    initializeMockData();

    const body = await request.json();
    const { action, documentId, title, content, category, tags, commitMessage, versionId, query } = body;

    switch (action) {
      case "getDocuments": {
        const documents = Array.from(documentsStore.values());
        return NextResponse.json({ documents });
      }

      case "saveDocument": {
        if (!title || !content) {
          return NextResponse.json(
            { error: "Title and content are required" },
            { status: 400 }
          );
        }

        let document: Document;

        if (documentId && documentsStore.has(documentId)) {
          // Update existing document
          const existing = documentsStore.get(documentId)!;
          const newVersion = existing.version + 1;

          // Save version
          versionsStore.push({
            id: `v${Date.now()}`,
            documentId,
            version: newVersion,
            content,
            commitMessage: commitMessage || "Update document",
            author: "user@example.com",
            timestamp: new Date().toISOString().replace('T', ' ').split('.')[0]
          });

          document = {
            ...existing,
            title,
            content,
            category: category || existing.category,
            tags: tags || existing.tags,
            updatedAt: new Date().toISOString().split('T')[0],
            version: newVersion
          };

          documentsStore.set(documentId, document);
        } else {
          // Create new document
          const id = Date.now().toString();
          document = {
            id,
            title,
            content,
            category: category || "General",
            tags: tags || [],
            author: "user@example.com",
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
            version: 1
          };

          documentsStore.set(id, document);

          // Save initial version
          versionsStore.push({
            id: `v${Date.now()}`,
            documentId: id,
            version: 1,
            content,
            commitMessage: commitMessage || "Initial version",
            author: "user@example.com",
            timestamp: new Date().toISOString().replace('T', ' ').split('.')[0]
          });
        }

        return NextResponse.json({ document });
      }

      case "getVersions": {
        if (!documentId) {
          return NextResponse.json(
            { error: "Document ID is required" },
            { status: 400 }
          );
        }

        const versions = versionsStore
          .filter(v => v.documentId === documentId)
          .sort((a, b) => b.version - a.version);

        return NextResponse.json({ versions });
      }

      case "restoreVersion": {
        if (!versionId) {
          return NextResponse.json(
            { error: "Version ID is required" },
            { status: 400 }
          );
        }

        const version = versionsStore.find(v => v.id === versionId);
        if (!version) {
          return NextResponse.json(
            { error: "Version not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({ content: version.content });
      }

      case "search": {
        if (!query) {
          return NextResponse.json({ results: [] });
        }

        const results = searchDocuments(query);
        return NextResponse.json({ results });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Knowledge base editor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
