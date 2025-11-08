import { Metadata } from "next";
import ImageEditorClient from "@/components/tools/ImageEditorClient";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Image Editor - Crop, Compress, Annotate & Add Overlays Online | Multi-Tool Platform",
  description: "Free online image editor with advanced features: crop, compress, annotate, add overlays, filters, text, shapes, and effects. Perfect for screenshots, photos, and graphics editing with batch processing.",
  keywords: [
    "image editor",
    "photo editor",
    "crop image",
    "compress image",
    "annotate image",
    "add overlays",
    "image filters",
    "text on image",
    "screenshot editor",
    "online photo editor",
    "image effects",
    "graphic design",
    "drawing tools",
    "image markup",
    "watermark images",
    "batch image editing"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/image-editor",
  },
  openGraph: {
    title: "Image Editor - Advanced Online Photo & Image Editing Tool",
    description: "Edit images online with cropping, compression, annotations, overlays, and effects. Perfect for screenshots, photos, and graphics with professional tools.",
    url: "/tools/image-editor",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image-editor.png",
        width: 1200,
        height: 630,
        alt: "Image Editor Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Editor - Advanced Online Photo & Image Editing Tool",
    description: "Edit images online with cropping, compression, annotations, overlays, and effects. Perfect for screenshots, photos, and graphics with professional tools.",
    images: ["/og-image-editor.png"],
    creator: "@multitoolplatform",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "development tools",
};

export default function ImageEditorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Image Editor",
    "description": "Advanced online image editor with comprehensive editing tools including cropping, compression, annotations, overlays, filters, text, shapes, and effects for professional image manipulation.",
    "url": "https://multitoolplatform.com/tools/image-editor",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Advanced cropping and resizing with aspect ratio controls",
      "Image compression with quality preservation",
      "Text annotations and markup tools",
      "Overlays, watermarks, and branding elements",
      "Professional filters and visual effects",
      "Drawing tools with customizable brushes",
      "Shape tools for geometric elements",
      "Screenshot editing and callout tools",
      "Batch processing capabilities",
      "Export in multiple formats",
      "Undo/redo with full edit history",
      "Client-side processing with complete privacy"
    ],
    "screenshot": "/og-image-editor.png",
    "author": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://multitoolplatform.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tools",
        "item": "https://multitoolplatform.com/tools"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Image Editor",
        "item": "https://multitoolplatform.com/tools/image-editor"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Image Editor
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Advanced online image editor with comprehensive editing tools. Crop, compress, annotate, add overlays, apply filters, and create professional graphics
              directly in your browser with batch processing support.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Advanced Editing
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Batch Processing
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Professional Tools
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Privacy First
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Batch Processing</h3>
              <p className="text-muted-foreground">
                Apply edits to multiple images simultaneously. Process entire collections with consistent settings for efficient workflow management.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Crop & Resize</h3>
              <p className="text-muted-foreground">
                Precisely crop images with aspect ratio controls and resize to specific dimensions while maintaining image quality and proportions.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Annotations</h3>
              <p className="text-muted-foreground">
                Add text annotations, arrows, highlights, and notes to images. Perfect for tutorials, feedback, documentation, and markup.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Overlays & Watermarks</h3>
              <p className="text-muted-foreground">
                Add logos, watermarks, borders, and custom overlays to protect and brand your images with professional positioning controls.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Filters & Effects</h3>
              <p className="text-muted-foreground">
                Apply professional filters, adjust brightness/contrast, add blur effects, enhance colors, and create stunning visual transformations.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Drawing Tools</h3>
              <p className="text-muted-foreground">
                Freehand drawing with customizable brushes, geometric shapes, eraser tools, and layer management for complex compositions.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Image Editor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Upload Images</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Drag and drop images or click to browse</li>
                  <li>• Support for JPEG, PNG, WebP, GIF, SVG</li>
                  <li>• Batch upload multiple images at once</li>
                  <li>• Preview images before editing</li>
                  <li>• Load from cloud storage or URLs</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Choose Editing Tools</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Select from crop, resize, or compress tools</li>
                  <li>• Use annotation tools for markup</li>
                  <li>• Apply filters and effects</li>
                  <li>• Add text, shapes, or overlays</li>
                  <li>• Use drawing tools for freehand edits</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Apply Edits</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Make edits with real-time preview</li>
                  <li>• Use undo/redo for corrections</li>
                  <li>• Adjust settings and parameters</li>
                  <li>• Apply to single or multiple images</li>
                  <li>• Save work automatically</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Export Results</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Export in multiple formats</li>
                  <li>• Choose quality and compression settings</li>
                  <li>• Download individual or batch results</li>
                  <li>• Share with direct links</li>
                  <li>• Save to cloud storage</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Edit Your Images?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Start editing images with professional tools for cropping, compression, annotations, and effects.
              Process single images or batches with our comprehensive online editor.
            </p>
            <a
              href="#image-upload"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Start Editing Images
            </a>
          </div>

          {/* Image Editor Component */}
          <ImageEditorClient />

          {/* Educational Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* About Image Editing */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">About Professional Image Editing</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  Transform your images with professional-grade editing tools designed for modern web development and content creation.
                  From basic adjustments to complex compositions, our image editor provides everything you need for stunning visual results.
                </p>

                <h3>Why Choose Our Image Editor</h3>
                <ul>
                  <li><strong>Professional Tools:</strong> Industry-standard editing capabilities</li>
                  <li><strong>Batch Processing:</strong> Edit multiple images simultaneously</li>
                  <li><strong>Privacy First:</strong> All processing happens locally in your browser</li>
                  <li><strong>Fast Performance:</strong> Optimized for speed and responsiveness</li>
                  <li><strong>Cross-Platform:</strong> Works on any device with a modern browser</li>
                </ul>
              </div>
            </div>

            {/* Tool Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Editing Categories</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Basic Editing</h4>
                  <p className="text-sm text-muted-foreground">
                    Crop, resize, rotate, and basic adjustments for quick edits
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Enhancement</h4>
                  <p className="text-sm text-muted-foreground">
                    Filters, effects, color correction, and image improvement
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Annotation</h4>
                  <p className="text-sm text-muted-foreground">
                    Text, arrows, shapes, and markup for documentation
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950 dark:to-amber-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Branding</h4>
                  <p className="text-sm text-muted-foreground">
                    Watermarks, logos, overlays, and brand elements
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Features */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Advanced Editing Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Drawing & Shapes</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Freehand drawing with customizable brush sizes</li>
                  <li>• Geometric shapes: rectangles, circles, arrows, lines</li>
                  <li>• Customizable stroke width, color, and fill options</li>
                  <li>• Eraser tool for precise corrections</li>
                  <li>• Layer management for complex compositions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Text & Typography</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Multiple fonts and font sizes</li>
                  <li>• Text color, outline, and shadow effects</li>
                  <li>• Text alignment and positioning controls</li>
                  <li>• Curved text and text-on-path capabilities</li>
                  <li>• Unicode support for international characters</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What image formats are supported?</h3>
                <p className="text-muted-foreground">
                  We support JPEG, PNG, WebP, GIF, SVG, and many other common image formats. You can import and export in different formats as needed.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I edit multiple images at once?</h3>
                <p className="text-muted-foreground">
                  Yes, our batch processing feature allows you to apply the same edits to multiple images simultaneously, saving you significant time for bulk editing tasks.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is my data secure and private?</h3>
                <p className="text-muted-foreground">
                  Absolutely. All image processing happens locally in your browser using WebAssembly. Your images never get uploaded to servers or stored externally.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What are the file size limits?</h3>
                <p className="text-muted-foreground">
                  There are no file size limits imposed by our service. The only limitations are those of your device's memory and browser capabilities.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I undo my edits?</h3>
                <p className="text-muted-foreground">
                  Yes, we provide unlimited undo/redo capabilities with a full edit history. You can always revert to any previous state of your image.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}