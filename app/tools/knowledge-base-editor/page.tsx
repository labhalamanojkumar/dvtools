import { Metadata } from "next";
import KnowledgeBaseEditorClient from "@/components/tools/knowledge-base-editor-client";

export const metadata: Metadata = {
  title: "Knowledge Base & Docs Editor - Markdown Documentation Tool | Malti Tool Platform",
  description: "Powerful markdown documentation editor with version control, search indexing, collaborative editing, and real-time preview. Build and maintain comprehensive knowledge bases with Git-like versioning.",
  keywords: [
    "markdown editor",
    "knowledge base",
    "documentation tool",
    "version control",
    "search indexing",
    "collaborative editing",
    "docs management",
    "technical documentation",
    "wiki editor",
    "markdown preview",
    "document versioning",
    "content management"
  ],
  openGraph: {
    title: "Knowledge Base & Docs Editor - Markdown Documentation Tool",
    description: "Create and manage technical documentation with markdown editing, version control, and search indexing",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Knowledge Base & Docs Editor",
  description: "Markdown documentation editor with version control, search indexing, and collaborative features for building comprehensive knowledge bases",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Markdown Editor",
    "Version Control",
    "Search Indexing",
    "Real-time Preview",
    "Collaborative Editing",
    "Document Management"
  ],
};

export default function KnowledgeBaseEditorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Knowledge Base & Docs Editor</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Create, edit, and manage technical documentation with a powerful markdown editor featuring version 
              control, search indexing, collaborative editing, and real-time preview for building comprehensive knowledge bases.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Markdown Editor</h3>
              <p className="text-sm text-muted-foreground">
                Rich markdown editing with syntax highlighting, toolbar, and keyboard shortcuts
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Version Control</h3>
              <p className="text-sm text-muted-foreground">
                Git-like versioning with commit history, diffs, and rollback capabilities
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Search Indexing</h3>
              <p className="text-sm text-muted-foreground">
                Full-text search with fuzzy matching and relevance ranking across all documents
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Real-time Preview</h3>
              <p className="text-sm text-muted-foreground">
                Live markdown preview with support for code blocks, tables, and images
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Collaborative Editing</h3>
              <p className="text-sm text-muted-foreground">
                Multi-user editing with conflict detection and merge capabilities
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Document Organization</h3>
              <p className="text-sm text-muted-foreground">
                Hierarchical folder structure with tags, categories, and metadata
              </p>
            </div>
          </div>

          {/* Main Tool */}
          <KnowledgeBaseEditorClient />

          {/* Usage Guide */}
          <div className="space-y-6 pt-8 border-t">
            <h2 className="text-2xl font-semibold">How to Use the Knowledge Base Editor</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Create or Import Documents</h3>
                <p className="text-muted-foreground">
                  Start a new document with the markdown editor or import existing .md files. Organize documents 
                  into folders and add metadata like tags, categories, and descriptions for better discoverability.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Edit with Live Preview</h3>
                <p className="text-muted-foreground">
                  Write markdown content in the editor and see real-time preview on the right. Use the toolbar for 
                  quick formatting, insert code blocks with syntax highlighting, and embed images or diagrams.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Track Changes with Versions</h3>
                <p className="text-muted-foreground">
                  Every save creates a new version with timestamp and author. View version history, compare diffs 
                  between versions, and rollback to previous states if needed. Add commit messages for clarity.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. Search and Navigate</h3>
                <p className="text-muted-foreground">
                  Use full-text search to find documents by content, title, or tags. Search results show snippets 
                  with highlighted matches. Filter by category, author, or date for precise results.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-6 pt-8 border-t">
            <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">What markdown features are supported?</h3>
                <p className="text-muted-foreground">
                  The editor supports GitHub Flavored Markdown (GFM) including headings, lists, code blocks with 
                  syntax highlighting, tables, task lists, blockquotes, inline HTML, footnotes, and emoji. 
                  Math equations with LaTeX syntax are also supported.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">How does version control work?</h3>
                <p className="text-muted-foreground">
                  Similar to Git, each save creates a new version with a commit message. You can view the complete 
                  history, see diffs between any two versions, and restore previous versions. All changes are 
                  tracked with author and timestamp information.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Can multiple users edit simultaneously?</h3>
                <p className="text-muted-foreground">
                  Yes! The editor supports collaborative editing with real-time presence indicators showing who's 
                  viewing or editing. Conflicts are detected automatically, and you'll be notified if someone else 
                  saves changes while you're editing.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">How is search indexing implemented?</h3>
                <p className="text-muted-foreground">
                  Documents are indexed in real-time as you save. The search engine uses full-text indexing with 
                  fuzzy matching, stemming, and relevance scoring. Search across content, titles, tags, and metadata 
                  with instant results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
