import { Metadata } from "next";
import ImageOptimizerConverterClient from "@/components/tools/image-optimizer-converter-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Image Optimizer & Converter - Compress & Convert Images Online | Multi-Tool Platform",
  description: "Free online image optimizer and converter. Compress JPEG, PNG, WebP, AVIF images, convert formats, resize images, and reduce file sizes for faster websites. Batch processing with quality preservation.",
  keywords: [
    "image optimizer",
    "image compressor",
    "image converter",
    "JPEG optimizer",
    "PNG compressor",
    "WebP converter",
    "AVIF converter",
    "image resize",
    "batch image processing",
    "image compression",
    "photo optimizer",
    "website image optimization",
    "image format converter",
    "lossless compression",
    "lossy compression"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/image-optimizer-converter",
  },
  openGraph: {
    title: "Image Optimizer & Converter - Compress & Convert Images Online",
    description: "Free online image optimizer with batch processing, format conversion, and quality preservation for faster websites.",
    url: "/tools/image-optimizer-converter",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image-optimizer.png",
        width: 1200,
        height: 630,
        alt: "Image Optimizer & Converter Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Optimizer & Converter - Compress & Convert Images Online",
    description: "Free online image optimizer with batch processing, format conversion, and quality preservation for faster websites.",
    images: ["/og-image-optimizer.png"],
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

export default function ImageOptimizerConverterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Image Optimizer & Converter",
    "description": "Advanced online image optimization and conversion tool with batch processing, multiple format support, and quality preservation for modern web development.",
    "url": "https://multitoolplatform.com/tools/image-optimizer-converter",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Advanced image compression with quality preservation",
      "Batch processing for multiple images simultaneously",
      "Convert between JPEG, PNG, WebP, and AVIF formats",
      "Resize images with aspect ratio control",
      "Real-time compression ratio and file size display",
      "Download individual or batch optimized images",
      "Client-side processing with complete privacy",
      "Support for all major image formats",
      "Quality adjustment from 1-100%",
      "Progressive loading optimization"
    ],
    "screenshot": "/og-image-optimizer.png",
    "author": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
  };

  const breadcrumbLd = {
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
        "name": "Image Optimizer & Converter",
        "item": "https://multitoolplatform.com/tools/image-optimizer-converter"
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
          __html: JSON.stringify(breadcrumbLd),
        }}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Image Optimizer & Converter
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Compress, resize, and convert images online with advanced algorithms. Optimize JPEG, PNG, WebP, and AVIF files for faster websites
              with batch processing and quality preservation.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Batch Processing
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Format Conversion
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Quality Preservation
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Size Optimization
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
                Process multiple images simultaneously with consistent settings. Upload, optimize, and download all images at once for efficient workflow.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Format Conversion</h3>
              <p className="text-muted-foreground">
                Convert between JPEG, PNG, WebP, and AVIF formats. Choose the optimal format for each use case with automatic quality optimization.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Control</h3>
              <p className="text-muted-foreground">
                Fine-tune compression levels from 1-100% with real-time preview. Balance file size reduction with visual quality preservation.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Resize & Crop</h3>
              <p className="text-muted-foreground">
                Resize images to specific dimensions or scale by percentage. Maintain aspect ratios or crop to exact dimensions as needed.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Preview</h3>
              <p className="text-muted-foreground">
                See compression results instantly with before/after comparisons, file size reduction percentages, and quality assessments.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
              <p className="text-muted-foreground">
                All image processing happens locally in your browser. Your images never get uploaded to servers or stored externally.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Image Optimizer & Converter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Upload Images</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Drag and drop multiple images</li>
                  <li>• Click to browse and select files</li>
                  <li>• Support for JPEG, PNG, WebP, AVIF</li>
                  <li>• Batch processing up to 20 images</li>
                  <li>• Preview images before processing</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Configure Settings</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Choose output format (WebP, JPEG, PNG, AVIF)</li>
                  <li>• Set quality level (1-100%)</li>
                  <li>• Enable/disable resizing</li>
                  <li>• Configure compression options</li>
                  <li>• Apply settings to all or individual images</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Optimize & Convert</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Click "Optimize Images" to process</li>
                  <li>• View real-time compression progress</li>
                  <li>• See file size reduction percentages</li>
                  <li>• Preview optimized results</li>
                  <li>• Compare before/after quality</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Download Results</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Download individual optimized images</li>
                  <li>• Batch download all processed images</li>
                  <li>• Get compression statistics report</li>
                  <li>• Export with original filenames</li>
                  <li>• Save settings for future use</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-8 border mb-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Optimize Your Images?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Start compressing and converting your images now. Upload multiple images and see instant results with our advanced optimization algorithms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Start Optimizing Images
                </button>
                <button className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Image Optimizer Converter Component */}
          <ImageOptimizerConverterClient />

          {/* Educational Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* About Image Optimization */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">About Image Optimization</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  Optimize your images for the web without sacrificing quality. Our advanced image optimizer uses modern compression algorithms to reduce file sizes while maintaining visual quality. Convert between formats and resize images for optimal performance across all devices.
                </p>

                <h3>Why Image Optimization Matters</h3>
                <ul>
                  <li><strong>Performance:</strong> Images often account for 50-80% of page weight</li>
                  <li><strong>SEO:</strong> Page speed directly impacts search rankings</li>
                  <li><strong>User Experience:</strong> Faster loading improves engagement</li>
                  <li><strong>Mobile:</strong> Critical for mobile users on slower connections</li>
                  <li><strong>Bandwidth:</strong> Reduces hosting costs and data usage</li>
                </ul>
              </div>
            </div>

            {/* Supported Formats */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Supported Formats</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">WebP</h4>
                  <p className="text-sm text-muted-foreground">
                    Best compression ratio, modern browser support, ideal for web images
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">JPEG</h4>
                  <p className="text-sm text-muted-foreground">
                    Excellent for photographs, good compression with adjustable quality
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">PNG</h4>
                  <p className="text-sm text-muted-foreground">
                    Lossless compression, perfect for graphics, logos, and transparency
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950 dark:to-amber-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">AVIF</h4>
                  <p className="text-sm text-muted-foreground">
                    Next-generation format with superior compression, emerging browser support
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Optimization Techniques */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Optimization Techniques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Lossy Compression</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Reduce file size by selectively discarding image data</li>
                  <li>• Adjustable quality levels from 1-100%</li>
                  <li>• Best for photographs and complex images</li>
                  <li>• Significant file size reduction (50-90%)</li>
                  <li>• Minimal visual quality loss at 80-90% quality</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Lossless Compression</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Reduce file size without quality loss</li>
                  <li>• Perfect for graphics, logos, and text</li>
                  <li>• Smaller size reduction (10-30%)</li>
                  <li>• Maintains exact pixel-perfect quality</li>
                  <li>• Ideal for images requiring precision</li>
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
                  We support JPEG, PNG, WebP, and AVIF formats for both input and output. You can convert between any of these formats while optimizing compression and quality.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How much can I reduce file sizes?</h3>
                <p className="text-muted-foreground">
                  Typical reductions range from 30-80% depending on the original image and quality settings. WebP format often achieves the best compression ratios, followed by AVIF.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is there a limit on file sizes or number of images?</h3>
                <p className="text-muted-foreground">
                  You can process up to 20 images at once with a maximum individual file size of 10MB. All processing happens locally in your browser, so performance depends on your device.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Will image quality suffer from compression?</h3>
                <p className="text-muted-foreground">
                  Quality loss depends on compression settings. At 80-90% quality, most images look identical to the original. You can always adjust quality levels and preview results before downloading.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Are my images secure and private?</h3>
                <p className="text-muted-foreground">
                  Yes, completely secure. All image processing happens locally in your browser using WebAssembly. Your images never leave your device or get uploaded to any servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
