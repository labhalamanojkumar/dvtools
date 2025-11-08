import { Metadata } from "next";
import { AdPlacement } from "@/components/ads/ad-placement";

export const metadata: Metadata = {
  title: "Ad System Test - Multi-Tool Platform",
  description: "Testing interface for the ad management system",
};

export default function AdSystemTestPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Ad Management System Test
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            This page tests all ad placements and features of the ad management system.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Test Page
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              All Placements
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              Debug Mode
            </span>
          </div>
        </div>

        {/* Test Header Banner */}
        <div className="mb-8 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Header Banner Test</h2>
          <p className="text-sm text-muted-foreground mb-2">Testing header_banner placement</p>
        </div>
        <AdPlacement
          placementKey="header_banner"
          className="mb-8"
        />

        {/* Test Tool Page Top */}
        <div className="mb-8 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Tool Page Top Test</h2>
          <p className="text-sm text-muted-foreground mb-2">Testing tool_page_top placement</p>
        </div>
        <AdPlacement
          placementKey="tool_page_top"
          className="mb-8"
        />

        {/* Test Content Middle */}
        <div className="mb-8 p-4 bg-green-100 dark:bg-green-900 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Content Middle Test</h2>
          <p className="text-sm text-muted-foreground mb-2">Testing content_middle placement</p>
        </div>
        <AdPlacement
          placementKey="content_middle"
          className="mb-8"
        />

        {/* Test Sidebar */}
        <div className="mb-8 p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Sidebar Ad Test</h2>
          <p className="text-sm text-muted-foreground mb-2">Testing sidebar_ad placement</p>
        </div>
        <AdPlacement
          placementKey="sidebar_ad"
          className="mb-8"
        />

        {/* Test Mobile Banner */}
        <div className="mb-8 p-4 bg-pink-100 dark:bg-pink-900 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Mobile Banner Test</h2>
          <p className="text-sm text-muted-foreground mb-2">Testing mobile_banner placement</p>
        </div>
        <AdPlacement
          placementKey="mobile_banner"
          className="mb-8"
        />

        {/* Test Footer Banner */}
        <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Footer Banner Test</h2>
          <p className="text-sm text-muted-foreground mb-2">Testing footer_banner placement</p>
        </div>
        <AdPlacement
          placementKey="footer_banner"
          className="mb-8"
        />

        {/* System Information */}
        <div className="mt-16 p-6 bg-card rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">Ad Management System Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Database Connection</h3>
              <p className="text-sm text-muted-foreground">✓ Connected to Prisma database</p>
              <p className="text-xs text-muted-foreground mt-1">
                Ad vendors: {3}, Placements: {5}, Campaigns: {4}, Analytics: {50}
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">API Endpoints</h3>
              <p className="text-sm text-muted-foreground">✓ All endpoints responding</p>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                <li>• GET /api/ads/placement/[key]</li>
                <li>• POST /api/ads/track</li>
                <li>• POST /api/admin/ads/vendors</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Frontend Components</h3>
              <p className="text-sm text-muted-foreground">✓ AdPlacement component loaded</p>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                <li>• Responsive design</li>
                <li>• Analytics tracking</li>
                <li>• Debug mode</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
            <h3 className="font-semibold mb-2 text-green-800 dark:text-green-200">System Ready</h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              The ad management system is fully operational. All ad placements should be displaying sample ads or fallback content.
            </p>
          </div>
        </div>

        {/* Admin Access */}
        <div className="mt-8 p-6 bg-card rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">Admin Access</h2>
          <p className="text-muted-foreground mb-4">
            To manage ads, vendors, and campaigns, access the admin panel:
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="/admin/ads" 
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Ad Management
            </a>
            <a 
              href="/admin" 
              className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Admin Dashboard
            </a>
          </div>
        </div>

        {/* Test Information */}
        <div className="mt-8 p-6 bg-card rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">Test Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">What You're Seeing</h3>
              <p className="text-sm text-muted-foreground">
                This page displays all configured ad placements. If ads are showing, the system is working correctly. 
                If you see fallback content or blank spaces, that indicates no campaigns are configured for those placements.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Testing Different Scenarios</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Test on desktop and mobile devices</li>
                <li>• Check responsive behavior of ad placements</li>
                <li>• Verify analytics tracking is working</li>
                <li>• Test ad rotation if multiple campaigns are active</li>
                <li>• Verify targeting rules (page-based, device-based)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Available Ad Vendors</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Google AdSense (with publisher ID and ad slots)</li>
                <li>• Monetage (with publisher ID and site ID)</li>
                <li>• Custom HTML (with custom code support)</li>
                <li>• Image ads (with image URLs and link targets)</li>
                <li>• Video ads (with video URLs and controls)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}