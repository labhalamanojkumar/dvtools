import React from 'react';
import { Breadcrumbs } from '@/components/blog/breadcrumbs';
import { NewsletterSubscription } from '@/components/blog/newsletter-subscription';

export const dynamic = 'auto';
export const revalidate = 3600; // Revalidate every hour

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/50">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={[]} />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Blog Content */}
          <article className="lg:col-span-3">
            <div className="prose dark:prose-invert max-w-none">
              {children}
            </div>
          </article>
          
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Newsletter Subscription */}
              <NewsletterSubscription />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
