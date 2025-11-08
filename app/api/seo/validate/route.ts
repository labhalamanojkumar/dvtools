import { NextRequest, NextResponse } from 'next/server';
import { SEOValidator } from '@/lib/seo/seo-validator';

interface BlogPostContent {
  title: string;
  content: string;
  description?: string;
  keywords?: string[];
  tags?: string[];
  author?: {
    name: string;
    bio?: string;
    image?: string;
    social?: {
      twitter?: string;
      linkedin?: string;
      website?: string;
    };
  };
  category?: string;
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: number;
  faq?: Array<{ question: string; answer: string }>;
  seo?: {
    description?: string;
    keywords?: string[];
    ogImage?: string;
    canonicalUrl?: string;
  };
}

interface ValidateRequest {
  content?: BlogPostContent;
  html?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ValidateRequest = await request.json();
    const { content, html } = body;

    if (!content && !html) {
      return NextResponse.json(
        { error: 'Please provide either content or html for validation' },
        { status: 400 }
      );
    }

    let validationResult;
    let testResults;

    if (content) {
      // Validate provided content
      const tempSlug = `temp-${Date.now()}`;
      validationResult = SEOValidator.validateBlogPost({ ...content, slug: tempSlug } as any);
      
      // Generate test HTML for structured data testing
      const testHTML = generateTestHTML(content, tempSlug);
      testResults = SEOValidator.testStructuredData(testHTML);
    } else if (html) {
      // Test structured data in provided HTML
      testResults = SEOValidator.testStructuredData(html);
      validationResult = null;
    }

    const response = {
      timestamp: new Date().toISOString(),
      validation: validationResult,
      structuredData: testResults,
      summary: {
        score: validationResult?.score || 0,
        issues: validationResult?.issues.length || 0,
        structuredDataValid: testResults?.isValid || false,
        schemas: testResults?.schemas || [],
      },
      recommendations: generateRecommendations(validationResult, testResults),
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('SEO validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error during SEO validation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Please provide a slug parameter' },
        { status: 400 }
      );
    }

    // For now, return a simple validation since we don't have actual blog posts to load
    // In a real implementation, you would load posts from your database
    if (slug === 'all') {
      return NextResponse.json({
        message: 'Bulk validation requires actual blog post data. Use POST with content objects.',
        total: 0,
        results: [],
        summary: {
          averageScore: 0,
          totalIssues: 0,
          validPosts: 0,
        },
      });
    } else {
      return NextResponse.json({
        message: 'Individual post validation requires content. Use POST with content object.',
        slug,
        validation: null,
        report: null,
      });
    }

  } catch (error) {
    console.error('SEO validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error during SEO validation' },
      { status: 500 }
    );
  }
}

/**
 * Generate test HTML for structured data validation
 */
function generateTestHTML(post: BlogPostContent, slug: string): string {
  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.seo?.description || post.description || '',
    "author": {
      "@type": "Person",
      "name": post.author?.name || 'Unknown Author',
      ...(post.author?.bio && { description: post.author.bio })
    },
    "publisher": {
      "@type": "Organization",
      "name": "Malti Tool Platform",
      "logo": {
        "@type": "ImageObject",
        "url": "https://example.com/logo.png"
      }
    },
    "datePublished": post.publishedAt || new Date().toISOString(),
    "dateModified": post.updatedAt || post.publishedAt || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://example.com/blog/${slug}`
    },
    "url": `https://example.com/blog/${slug}`,
    "image": post.seo?.ogImage ? [post.seo.ogImage] : [],
    "articleSection": post.category,
    "keywords": post.seo?.keywords || post.tags || []
  };

  if (post.faq && post.faq.length > 0) {
    structuredData.mainEntity = {
      "@type": "FAQPage",
      "mainEntity": post.faq.map((item) => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <title>${post.title}</title>
  <meta name="description" content="${post.seo?.description || post.description || ''}" />
  <meta property="og:title" content="${post.title}" />
  <meta property="og:description" content="${post.seo?.description || post.description || ''}" />
  ${post.seo?.ogImage ? `<meta property="og:image" content="${post.seo.ogImage}" />` : ''}
  <script type="application/ld+json">
    ${JSON.stringify(structuredData)}
  </script>
</head>
<body>
  <article>
    <h1>${post.title}</h1>
    <div class="content">
      ${post.content.substring(0, 1000)}... <!-- Simplified content -->
    </div>
  </article>
</body>
</html>
  `.trim();
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(validation: any, testResults: any): string[] {
  const recommendations: string[] = [];

  if (validation) {
    // Meta tag recommendations
    if (!validation.metaTagsValid) {
      recommendations.push('Fix meta tag issues - this is critical for search engine visibility');
    }

    // Structured data recommendations
    if (!validation.structuredDataValid) {
      recommendations.push('Implement comprehensive structured data markup for rich search results');
    }

    // Content recommendations
    if (validation.score < 70) {
      recommendations.push('Content needs significant SEO improvements for better search performance');
    } else if (validation.score < 85) {
      recommendations.push('Good foundation - implement suggested improvements for better ranking potential');
    }

    // Accessibility recommendations
    if (validation.accessibilityScore < 80) {
      recommendations.push('Improve accessibility features for better user experience and SEO');
    }

    // Performance recommendations
    if (validation.performanceScore < 80) {
      recommendations.push('Optimize content performance factors for better loading speeds');
    }
  }

  if (testResults) {
    if (!testResults.isValid) {
      recommendations.push(`Structured data errors found: ${testResults.errors.join(', ')}`);
    }
    
    if (testResults.schemas.length === 0) {
      recommendations.push('Add structured data markup to enable rich search results');
    }
  }

  if (recommendations.length === 0) {
    recommendations.push('Excellent SEO implementation! Content is well-optimized for search engines.');
  }

  return recommendations;
}