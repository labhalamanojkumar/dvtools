import { Metadata } from 'next';
import ImageOptimizerConverterClient from '@/components/tools/image-optimizer-converter-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Image Optimizer & Converter - Compress & Convert Images Online',
  description: 'Free online image optimizer and converter. Compress JPEG, PNG, WebP images, convert formats, resize images, and reduce file sizes for faster websites. Batch processing supported.',
  keywords: ['image optimizer', 'image compressor', 'image converter', 'JPEG optimizer', 'PNG compressor', 'WebP converter', 'image resize', 'batch image processing'],
  openGraph: {
    title: 'Image Optimizer & Converter - DevTools Hub',
    description: 'Compress and convert images online with batch processing and format conversion',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/image-optimizer-converter',
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Image Optimizer & Converter',
  applicationCategory: 'DeveloperApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description: 'Free online image optimization and conversion tool with batch processing',
};

export default function ImageOptimizerConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <div className="tool-container">
        <div className="tool-header">
          <h1 className="tool-title">Image Optimizer & Converter</h1>
          <p className="tool-description">
            Compress, resize, and convert images online. Optimize JPEG, PNG, and WebP files for faster websites with batch processing support
          </p>
        </div>

        <ImageOptimizerConverterClient />

        {/* SEO Content */}
        <section className="mt-12 space-y-6">
          <div>
            <h2 className="mb-4 text-2xl font-bold">About Image Optimization</h2>
            <p className="text-muted-foreground">
              Optimize your images for the web without sacrificing quality. Our advanced image optimizer uses
              modern compression algorithms to reduce file sizes while maintaining visual quality. Convert between
              formats and resize images for optimal performance across all devices.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Key Features</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Advanced image compression with quality preservation</li>
              <li>Batch processing for multiple images</li>
              <li>Convert between JPEG, PNG, WebP, and AVIF formats</li>
              <li>Resize images with aspect ratio control</li>
              <li>Real-time compression ratio display</li>
              <li>Download individual or batch optimized images</li>
              <li>Client-side processing &mdash; your images never leave your browser</li>
              <li>Support for all major image formats</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Supported Formats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">WebP</h4>
                <p className="text-sm text-muted-foreground">
                  Best compression ratio, modern browser support, ideal for web images
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">JPEG</h4>
                <p className="text-sm text-muted-foreground">
                  Excellent for photographs, good compression with adjustable quality
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">PNG</h4>
                <p className="text-sm text-muted-foreground">
                  Lossless compression, perfect for graphics, logos, and images with transparency
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">AVIF</h4>
                <p className="text-sm text-muted-foreground">
                  Next-generation format with superior compression, emerging browser support
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Optimization Techniques</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li><strong>Lossy compression:</strong> Reduce file size by selectively discarding image data</li>
              <li><strong>Quality adjustment:</strong> Fine-tune compression level from 1-100%</li>
              <li><strong>Format conversion:</strong> Convert to more efficient formats like WebP</li>
              <li><strong>Resize optimization:</strong> Scale images to appropriate display sizes</li>
              <li><strong>Metadata stripping:</strong> Remove unnecessary EXIF data</li>
              <li><strong>Progressive loading:</strong> Enable progressive JPEG/WebP for better UX</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Performance Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Faster Loading Times</h4>
                <p className="text-sm text-muted-foreground">
                  Smaller image files load faster, improving page speed scores and user experience.
                  Optimized images can reduce page load times by 50-80%.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Better SEO Rankings</h4>
                <p className="text-sm text-muted-foreground">
                  Page speed is a ranking factor for Google. Optimized images contribute to better
                  Core Web Vitals scores and improved search engine rankings.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Best Practices</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Use WebP format for modern browsers with JPEG fallback</li>
              <li>Compress images to 80-90% quality for good balance of size and quality</li>
              <li>Resize images to match their display dimensions</li>
              <li>Use responsive images with srcset for different screen sizes</li>
              <li>Enable lazy loading for images below the fold</li>
              <li>Consider using CDNs for image delivery</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Batch Processing Tips</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Process similar images together (e.g., all product photos)</li>
              <li>Use consistent quality settings for brand consistency</li>
              <li>Check compression ratios to ensure quality standards are met</li>
              <li>Download all optimized images at once for efficient workflow</li>
              <li>Keep original files as backups before optimization</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}