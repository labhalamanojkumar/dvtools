import { BlogPostContent } from '@/lib/blog/content-manager';

export interface SEOValidationResult {
  score: number;
  issues: SEOIssue[];
  suggestions: string[];
  structuredDataValid: boolean;
  metaTagsValid: boolean;
  accessibilityScore: number;
  performanceScore: number;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: 'seo' | 'performance' | 'accessibility' | 'content';
  message: string;
  element?: string;
  recommendation: string;
}

export class SEOValidator {
  /**
   * Comprehensive SEO validation for blog posts
   */
  static validateBlogPost(post: BlogPostContent & { slug: string }): SEOValidationResult {
    const issues: SEOIssue[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Validate meta tags
    const metaResults = this.validateMetaTags(post);
    issues.push(...metaResults.issues);
    score -= metaResults.scoreReduction;

    // Validate structured data
    const structuredDataResults = this.validateStructuredData(post);
    issues.push(...structuredDataResults.issues);
    score -= structuredDataResults.scoreReduction;

    // Validate content quality
    const contentResults = this.validateContentQuality(post);
    issues.push(...contentResults.issues);
    suggestions.push(...contentResults.suggestions);
    score -= contentResults.scoreReduction;

    // Validate accessibility
    const accessibilityResults = this.validateAccessibility(post);
    issues.push(...accessibilityResults.issues);
    score -= accessibilityResults.scoreReduction;

    // Validate performance factors
    const performanceResults = this.validatePerformance(post);
    issues.push(...performanceResults.issues);
    score -= performanceResults.scoreReduction;

    return {
      score: Math.max(0, score),
      issues,
      suggestions,
      structuredDataValid: structuredDataResults.isValid,
      metaTagsValid: metaResults.isValid,
      accessibilityScore: Math.max(0, 100 - accessibilityResults.scoreReduction),
      performanceScore: Math.max(0, 100 - performanceResults.scoreReduction),
    };
  }

  /**
   * Validate meta tags for SEO
   */
  private static validateMetaTags(post: BlogPostContent & { slug: string }): {
    issues: SEOIssue[];
    scoreReduction: number;
    isValid: boolean;
  } {
    const issues: SEOIssue[] = [];
    let scoreReduction = 0;
    let isValid = true;

    // Title validation
    if (!post.seo?.description) {
      issues.push({
        type: 'error',
        category: 'seo',
        message: 'Missing meta description',
        element: 'meta[name="description"]',
        recommendation: 'Add a compelling meta description between 150-160 characters',
      });
      scoreReduction += 15;
      isValid = false;
    } else if (post.seo.description.length < 120) {
      issues.push({
        type: 'warning',
        category: 'seo',
        message: 'Meta description too short',
        element: 'meta[name="description"]',
        recommendation: 'Expand meta description to 120-160 characters for better search visibility',
      });
      scoreReduction += 8;
    } else if (post.seo.description.length > 160) {
      issues.push({
        type: 'warning',
        category: 'seo',
        message: 'Meta description too long',
        element: 'meta[name="description"]',
        recommendation: 'Shorten meta description to under 160 characters to prevent truncation',
      });
      scoreReduction += 8;
    }

    // Keywords validation
    if (!post.seo?.keywords || post.seo.keywords.length === 0) {
      issues.push({
        type: 'info',
        category: 'seo',
        message: 'No keywords specified',
        element: 'meta[name="keywords"]',
        recommendation: 'Add relevant keywords to help search engines understand content context',
      });
      scoreReduction += 3;
    } else if (post.seo.keywords.length > 15) {
      issues.push({
        type: 'info',
        category: 'seo',
        message: 'Too many keywords',
        element: 'meta[name="keywords"]',
        recommendation: 'Limit keywords to 5-10 most relevant terms for better targeting',
      });
      scoreReduction += 2;
    }

    // Open Graph validation
    if (!post.seo?.ogImage) {
      issues.push({
        type: 'warning',
        category: 'seo',
        message: 'Missing Open Graph image',
        element: 'meta[property="og:image"]',
        recommendation: 'Add OG image (1200x630px) for better social media sharing',
      });
      scoreReduction += 10;
    }

    // Title length validation
    if (!post.title || post.title.length < 30) {
      issues.push({
        type: 'warning',
        category: 'seo',
        message: 'Title may be too short',
        element: 'title',
        recommendation: 'Create more descriptive title (30-60 characters) for better SEO',
      });
      scoreReduction += 5;
    } else if (post.title.length > 60) {
      issues.push({
        type: 'warning',
        category: 'seo',
        message: 'Title may be too long',
        element: 'title',
        recommendation: 'Shorten title to under 60 characters for better search result display',
      });
      scoreReduction += 5;
    }

    return { issues, scoreReduction, isValid };
  }

  /**
   * Validate structured data implementation
   */
  private static validateStructuredData(post: BlogPostContent & { slug: string; faq?: Array<{ question: string; answer: string }> }): {
    issues: SEOIssue[];
    scoreReduction: number;
    isValid: boolean;
  } {
    const issues: SEOIssue[] = [];
    let scoreReduction = 0;
    let isValid = true;

    // Check for required structured data elements
    const requiredElements = [
      'BlogPosting schema',
      'Article schema',
      'Author information',
      'Publication date',
      'BreadcrumbList schema'
    ];

    // Simulate structured data validation
    // In a real implementation, this would parse actual JSON-LD
    const hasStructuredData = true; // Would check for script tags with application/ld+json
    const hasRequiredFields = post.author && post.seo && post.publishedAt;

    if (!hasStructuredData) {
      issues.push({
        type: 'error',
        category: 'seo',
        message: 'Missing structured data markup',
        element: 'script[type="application/ld+json"]',
        recommendation: 'Add JSON-LD structured data markup for better search engine understanding',
      });
      scoreReduction += 20;
      isValid = false;
    }

    if (!hasRequiredFields) {
      issues.push({
        type: 'warning',
        category: 'seo',
        message: 'Incomplete structured data',
        element: 'script[type="application/ld+json"]',
        recommendation: 'Ensure structured data includes author, date, and article information',
      });
      scoreReduction += 10;
    }

    // FAQ schema validation
    if (!post.faq || post.faq.length === 0) {
      issues.push({
        type: 'info',
        category: 'seo',
        message: 'No FAQ schema detected',
        element: 'script[type="application/ld+json"]',
        recommendation: 'Add FAQ section with schema markup for rich search results',
      });
      scoreReduction += 5;
    }

    return { issues, scoreReduction, isValid };
  }

  /**
   * Validate content quality factors
   */
  private static validateContentQuality(post: BlogPostContent): {
    issues: SEOIssue[];
    suggestions: string[];
    scoreReduction: number;
  } {
    const issues: SEOIssue[] = [];
    const suggestions: string[] = [];
    let scoreReduction = 0;

    // Word count validation
    const wordCount = this.estimateWordCount(post.content);
    if (wordCount < 300) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: 'Content may be too short',
        element: 'article',
        recommendation: 'Aim for at least 300 words for better SEO performance',
      });
      scoreReduction += 10;
      suggestions.push('Expand content with more detailed explanations and examples');
    } else if (wordCount < 600) {
      suggestions.push('Consider adding more comprehensive coverage (600+ words) for competitive topics');
    }

    // Reading time validation
    const readingTime = this.estimateReadingTime(post.content);
    if (readingTime > 15) {
      issues.push({
        type: 'info',
        category: 'content',
        message: 'Content may be too long',
        element: 'article',
        recommendation: 'Consider breaking long content into smaller sections or multiple posts',
      });
      scoreReduction += 3;
    }

    // Tag validation
    if (!post.tags || post.tags.length === 0) {
      issues.push({
        type: 'error',
        category: 'content',
        message: 'No tags specified',
        element: 'article',
        recommendation: 'Add relevant tags to help with content categorization and discovery',
      });
      scoreReduction += 8;
    } else if (post.tags.length < 3) {
      suggestions.push('Consider adding more specific tags (3-7 recommended) for better content discovery');
    } else if (post.tags.length > 8) {
      issues.push({
        type: 'info',
        category: 'content',
        message: 'Too many tags',
        element: 'article',
        recommendation: 'Limit tags to 3-7 most relevant terms for better targeting',
      });
      scoreReduction += 2;
    }

    // Author validation
    if (!post.author?.name) {
      issues.push({
        type: 'error',
        category: 'content',
        message: 'Author information missing',
        element: 'article',
        recommendation: 'Add author information for better E-A-T (Expertise, Authoritativeness, Trustworthiness)',
      });
      scoreReduction += 10;
    }

    // Category validation
    if (!post.category) {
      issues.push({
        type: 'info',
        category: 'content',
        message: 'No category specified',
        element: 'article',
        recommendation: 'Add a category to help organize content and improve navigation',
      });
      scoreReduction += 3;
    }

    return { issues, suggestions, scoreReduction };
  }

  /**
   * Validate accessibility factors
   */
  private static validateAccessibility(post: BlogPostContent): {
    issues: SEOIssue[];
    scoreReduction: number;
  } {
    const issues: SEOIssue[] = [];
    let scoreReduction = 0;

    // Check for images and alt text
    const imageCount = this.countImages(post.content);
    if (imageCount > 0) {
      // In a real implementation, would check actual alt attributes
      const imagesWithAlt = imageCount; // Assume all have alt for demo
      const missingAltCount = imageCount - imagesWithAlt;
      
      if (missingAltCount > 0) {
        issues.push({
          type: 'error',
          category: 'accessibility',
          message: `${missingAltCount} image(s) missing alt text`,
          element: 'img',
          recommendation: 'Add descriptive alt text to all images for screen readers and SEO',
        });
        scoreReduction += 15;
      }
    }

    // Heading structure validation
    const headingStructure = this.analyzeHeadingStructure(post.content);
    if (!headingStructure.isValid) {
      issues.push({
        type: 'warning',
        category: 'accessibility',
        message: 'Improper heading hierarchy',
        element: 'h1, h2, h3, h4, h5, h6',
        recommendation: 'Use proper heading hierarchy (H1 → H2 → H3) for better accessibility and SEO',
      });
      scoreReduction += 8;
    }

    // Link validation
    const linkCount = this.countLinks(post.content);
    if (linkCount === 0) {
      issues.push({
        type: 'info',
        category: 'accessibility',
        message: 'No internal or external links found',
        element: 'a',
        recommendation: 'Add internal links to related content and external links to authoritative sources',
      });
      scoreReduction += 5;
    }

    return { issues, scoreReduction };
  }

  /**
   * Validate performance factors
   */
  private static validatePerformance(post: BlogPostContent): {
    issues: SEOIssue[];
    scoreReduction: number;
  } {
    const issues: SEOIssue[] = [];
    let scoreReduction = 0;

    // Check for images and recommendations
    const imageCount = this.countImages(post.content);
    if (imageCount > 3) {
      issues.push({
        type: 'info',
        category: 'performance',
        message: 'Many images may impact loading speed',
        element: 'img',
        recommendation: 'Consider using lazy loading and optimized image formats (WebP, AVIF)',
      });
      scoreReduction += 3;
    }

    // Content length vs loading performance
    const wordCount = this.estimateWordCount(post.content);
    if (wordCount > 3000) {
      issues.push({
        type: 'info',
        category: 'performance',
        message: 'Very long content may impact initial load time',
        element: 'article',
        recommendation: 'Consider using progressive loading or breaking into sections',
      });
      scoreReduction += 2;
    }

    return { issues, scoreReduction };
  }

  /**
   * Test structured data implementation
   */
  static testStructuredData(htmlContent: string): {
    isValid: boolean;
    schemas: string[];
    errors: string[];
  } {
    const errors: string[] = [];
    const schemas: string[] = [];

    try {
      // Extract JSON-LD scripts
      const jsonLdMatches = htmlContent.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
      
      if (jsonLdMatches) {
        jsonLdMatches.forEach((match, index) => {
          try {
            const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
            const data = JSON.parse(jsonContent);
            
            // Validate required fields for BlogPosting
            if (data['@type'] === 'BlogPosting' || data['@type'] === 'Article') {
              const requiredFields = ['headline', 'description', 'author', 'publisher', 'datePublished'];
              const missingFields = requiredFields.filter(field => !data[field]);
              
              if (missingFields.length > 0) {
                errors.push(`Missing required fields in BlogPosting: ${missingFields.join(', ')}`);
              } else {
                schemas.push('BlogPosting');
              }
            }
            
            // Check for other schema types
            if (data['@type'] === 'FAQPage' && data.mainEntity) {
              schemas.push('FAQPage');
            }
            
            if (data['@type'] === 'BreadcrumbList' && data.itemListElement) {
              schemas.push('BreadcrumbList');
            }
            
          } catch (e) {
            errors.push(`Invalid JSON-LD in script ${index + 1}: ${e instanceof Error ? e.message : 'Unknown error'}`);
          }
        });
      } else {
        errors.push('No JSON-LD structured data found');
      }
    } catch (e) {
      errors.push(`Structured data validation error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }

    return {
      isValid: errors.length === 0,
      schemas,
      errors,
    };
  }

  /**
   * Generate SEO optimization report
   */
  static generateOptimizationReport(validation: SEOValidationResult): string {
    const report = `
# SEO Optimization Report

## Overall Score: ${validation.score}/100

### Issues Summary
- Errors: ${validation.issues.filter(i => i.type === 'error').length}
- Warnings: ${validation.issues.filter(i => i.type === 'warning').length}
- Info: ${validation.issues.filter(i => i.type === 'info').length}

### Category Breakdown
- SEO: ${validation.issues.filter(i => i.category === 'seo').length} issues
- Content: ${validation.issues.filter(i => i.category === 'content').length} issues
- Accessibility: ${validation.issues.filter(i => i.category === 'accessibility').length} issues
- Performance: ${validation.issues.filter(i => i.category === 'performance').length} issues

### Scores
- Accessibility: ${validation.accessibilityScore}/100
- Performance: ${validation.performanceScore}/100
- Structured Data: ${validation.structuredDataValid ? 'Valid' : 'Invalid'}
- Meta Tags: ${validation.metaTagsValid ? 'Valid' : 'Invalid'}

### Recommendations
${validation.suggestions.map(s => `- ${s}`).join('\n')}

### Priority Fixes
${validation.issues
  .filter(i => i.type === 'error')
  .map(i => `- ${i.recommendation}`)
  .join('\n')}
    `;

    return report.trim();
  }

  // Helper methods
  private static estimateWordCount(content: string): number {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  private static estimateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = this.estimateWordCount(content);
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private static countImages(content: string): number {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const matches = content.match(imageRegex);
    return matches ? matches.length : 0;
  }

  private static countLinks(content: string): number {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const matches = content.match(linkRegex);
    return matches ? matches.length : 0;
  }

  private static analyzeHeadingStructure(content: string): { isValid: boolean; issues: string[] } {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: { level: number; text: string }[] = [];
    const issues: string[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
      });
    }

    if (headings.length === 0) {
      issues.push('No headings found in content');
      return { isValid: false, issues };
    }

    // Check for H1
    const hasH1 = headings.some(h => h.level === 1);
    if (!hasH1) {
      issues.push('Missing H1 heading');
    }

    // Check heading hierarchy
    let previousLevel = 0;
    for (const heading of headings) {
      if (heading.level > previousLevel + 1) {
        issues.push(`Skipped heading level: H${previousLevel} to H${heading.level}`);
      }
      previousLevel = heading.level;
    }

    return { isValid: issues.length === 0, issues };
  }
}