import { estimateReadingTime, extractKeywords } from '@/lib/seo/blog-seo';

export interface BlogPostContent {
  title: string;
  content: string;
  excerpt?: string;
  author: {
    name: string;
    email?: string;
    bio?: string;
    avatar?: string;
  };
  tags: string[];
  category?: string;
  publishedAt?: string;
  updatedAt?: string;
  featured?: boolean;
  seo?: {
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
}

export interface ContentAnalysis {
  wordCount: number;
  readingTime: number;
  readabilityScore: number;
  seoScore: number;
  suggestions: string[];
  keywords: string[];
  readabilityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  issues: ContentIssue[];
  improvements: string[];
}

export interface ContentIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  position?: number;
  suggestion?: string;
}

export class BlogContentManager {
  /**
   * Analyze blog post content for quality and SEO
   */
  static analyzeContent(post: BlogPostContent): ContentAnalysis {
    const issues: ContentIssue[] = [];
    const suggestions: string[] = [];
    const improvements: string[] = [];

    // Basic metrics
    const wordCount = this.countWords(post.content);
    const readingTime = estimateReadingTime(post.content);
    const keywords = extractKeywords(post.content, post.seo?.keywords || post.tags);

    // Content validation
    this.validateStructure(post, issues, suggestions);
    this.validateSEO(post, issues, suggestions);
    this.validateContent(post, issues, improvements);
    this.validateAccessibility(post, issues, suggestions);

    // Calculate scores
    const readabilityScore = this.calculateReadabilityScore(post.content, wordCount);
    const seoScore = this.calculateSEOScore(post, wordCount, keywords, issues);

    // Generate suggestions
    suggestions.push(...this.generateContentSuggestions(wordCount, readingTime, post));
    improvements.push(...this.generateImprovements(issues));

    return {
      wordCount,
      readingTime,
      readabilityScore,
      seoScore,
      suggestions,
      keywords,
      readabilityGrade: this.getReadabilityGrade(readabilityScore),
      issues,
      improvements,
    };
  }

  /**
   * Validate blog post structure
   */
  private static validateStructure(
    post: BlogPostContent,
    issues: ContentIssue[],
    suggestions: string[]
  ): void {
    // Title validation
    if (!post.title || post.title.trim().length === 0) {
      issues.push({
        type: 'error',
        message: 'Title is required',
        suggestion: 'Add a descriptive and engaging title for your blog post',
      });
    } else if (post.title.length < 30) {
      issues.push({
        type: 'warning',
        message: 'Title might be too short for SEO',
        suggestion: 'Consider making your title more descriptive (30-60 characters)',
      });
    } else if (post.title.length > 60) {
      issues.push({
        type: 'warning',
        message: 'Title might be too long for search results',
        suggestion: 'Consider shortening your title (under 60 characters for better display)',
      });
    }

    // Content validation
    if (!post.content || post.content.trim().length === 0) {
      issues.push({
        type: 'error',
        message: 'Content is required',
        suggestion: 'Add meaningful content to your blog post',
      });
    } else if (this.countWords(post.content) < 300) {
      issues.push({
        type: 'warning',
        message: 'Content might be too short for good SEO',
        suggestion: 'Consider adding more detailed content (minimum 300 words recommended)',
      });
    }

    // Author validation
    if (!post.author?.name) {
      issues.push({
        type: 'error',
        message: 'Author name is required',
        suggestion: 'Add the author name for proper attribution',
      });
    }

    // Tags validation
    if (!post.tags || post.tags.length === 0) {
      issues.push({
        type: 'warning',
        message: 'No tags specified',
        suggestion: 'Add relevant tags to help with content discovery and SEO',
      });
    } else if (post.tags.length > 10) {
      issues.push({
        type: 'info',
        message: 'Many tags specified',
        suggestion: 'Consider using fewer, more specific tags (3-7 recommended)',
      });
    }
  }

  /**
   * Validate SEO aspects
   */
  private static validateSEO(
    post: BlogPostContent,
    issues: ContentIssue[],
    suggestions: string[]
  ): void {
    // Meta description
    if (!post.seo?.description) {
      issues.push({
        type: 'warning',
        message: 'Meta description missing',
        suggestion: 'Add a compelling meta description (150-160 characters) for better search results',
      });
    } else if (post.seo.description.length < 120) {
      issues.push({
        type: 'info',
        message: 'Meta description might be too short',
        suggestion: 'Consider expanding your meta description (120-160 characters optimal)',
      });
    } else if (post.seo.description.length > 160) {
      issues.push({
        type: 'warning',
        message: 'Meta description might be too long',
        suggestion: 'Shorten your meta description to under 160 characters for better display',
      });
    }

    // Keywords
    if (!post.seo?.keywords || post.seo.keywords.length === 0) {
      issues.push({
        type: 'info',
        message: 'SEO keywords not specified',
        suggestion: 'Add relevant keywords for better search engine optimization',
      });
    }

    // Content structure analysis
    const headings = this.extractHeadings(post.content);
    if (headings.length === 0) {
      issues.push({
        type: 'info',
        message: 'No headings found',
        suggestion: 'Add headings (H2, H3) to improve content structure and readability',
      });
    }

    // Internal links check
    const internalLinks = this.extractLinks(post.content, 'internal');
    if (internalLinks.length === 0) {
      issues.push({
        type: 'info',
        message: 'No internal links found',
        suggestion: 'Consider adding internal links to related content for better SEO',
      });
    }
  }

  /**
   * Validate content quality
   */
  private static validateContent(
    post: BlogPostContent,
    issues: ContentIssue[],
    improvements: string[]
  ): void {
    const { content } = post;
    
    // Check for code blocks
    const codeBlocks = this.extractCodeBlocks(content);
    if (codeBlocks.length === 0) {
      improvements.push('Consider adding code examples or snippets to make your content more practical');
    }

    // Check for lists
    const lists = this.extractLists(content);
    if (lists.length === 0) {
      improvements.push('Consider using bullet points or numbered lists to improve readability');
    }

    // Check for images
    const images = this.extractImages(content);
    if (images.length === 0) {
      improvements.push('Consider adding relevant images to enhance your content and break up text');
    }

    // Check for external links
    const externalLinks = this.extractLinks(content, 'external');
    if (externalLinks.length === 0) {
      improvements.push('Consider adding links to authoritative sources to strengthen your content');
    }
  }

  /**
   * Validate accessibility aspects
   */
  private static validateAccessibility(
    post: BlogPostContent,
    issues: ContentIssue[],
    suggestions: string[]
  ): void {
    // Check heading hierarchy
    const headings = this.extractHeadings(post.content);
    const hasProperHierarchy = this.checkHeadingHierarchy(headings);
    
    if (!hasProperHierarchy) {
      issues.push({
        type: 'warning',
        message: 'Heading hierarchy might be improper',
        suggestion: 'Ensure headings follow a logical hierarchy (H1 → H2 → H3)',
      });
    }

    // Check for alt text in images
    const images = this.extractImages(post.content);
    const imagesWithoutAlt = images.filter(img => !img.alt);
    
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        type: 'warning',
        message: `${imagesWithoutAlt.length} image(s) missing alt text`,
        suggestion: 'Add descriptive alt text to all images for screen reader accessibility',
      });
    }
  }

  /**
   * Calculate readability score (simplified Flesch Reading Ease)
   */
  private static calculateReadabilityScore(content: string, wordCount: number): number {
    if (wordCount === 0) return 0;

    const sentences = this.countSentences(content);
    const syllables = this.countSyllables(content);
    
    if (sentences === 0 || syllables === 0) return 0;

    // Simplified Flesch Reading Ease formula
    const score = 206.835 - (1.015 * (wordCount / sentences)) - (84.6 * (syllables / wordCount));
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Calculate SEO score
   */
  private static calculateSEOScore(
    post: BlogPostContent,
    wordCount: number,
    keywords: string[],
    issues: ContentIssue[]
  ): number {
    let score = 100;

    // Deduct points for issues
    issues.forEach(issue => {
      switch (issue.type) {
        case 'error':
          score -= 15;
          break;
        case 'warning':
          score -= 8;
          break;
        case 'info':
          score -= 3;
          break;
      }
    });

    // Bonus points for good practices
    if (wordCount >= 1000) score += 5;
    if (post.seo?.description && post.seo.description.length >= 120) score += 5;
    if (keywords.length >= 5) score += 5;
    if (post.tags.length >= 3) score += 3;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Utility methods
   */
  private static countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  private static countSentences(text: string): number {
    return (text.match(/[.!?]+/g) || []).length;
  }

  private static countSyllables(text: string): number {
    // Simplified syllable counting
    const words = text.toLowerCase().split(/\s+/);
    let syllableCount = 0;

    words.forEach(word => {
      word = word.replace(/[^a-z]/g, '');
      if (word.length === 0) return;

      if (word.length <= 3) {
        syllableCount += 1;
      } else {
        // Remove silent 'e'
        word = word.replace(/e$/, '');
        // Count vowel groups
        const vowelGroups = word.match(/[aeiouy]+/g);
        syllableCount += vowelGroups ? vowelGroups.length : 1;
      }
    });

    return syllableCount;
  }

  private static extractHeadings(content: string): Array<{ level: number; text: string }> {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: Array<{ level: number; text: string }> = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
      });
    }

    return headings;
  }

  private static extractCodeBlocks(content: string): string[] {
    const codeBlockRegex = /```[\s\S]*?```/g;
    return content.match(codeBlockRegex) || [];
  }

  private static extractLists(content: string): string[] {
    const listRegex = /^\s*[-*+]\s+.+$/gm;
    return content.match(listRegex) || [];
  }

  private static extractImages(content: string): Array<{ src: string; alt: string }> {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const images: Array<{ src: string; alt: string }> = [];
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      images.push({
        src: match[2],
        alt: match[1] || '',
      });
    }

    return images;
  }

  private static extractLinks(content: string, type: 'internal' | 'external' = 'internal'): string[] {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links: string[] = [];
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const url = match[2];
      const isExternal = url.startsWith('http') && !url.includes(process.env.NEXT_PUBLIC_SITE_URL || 'localhost');
      
      if ((type === 'internal' && !isExternal) || (type === 'external' && isExternal)) {
        links.push(url);
      }
    }

    return links;
  }

  private static checkHeadingHierarchy(headings: Array<{ level: number; text: string }>): boolean {
    let previousLevel = 0;

    for (const heading of headings) {
      if (heading.level > previousLevel + 1) {
        return false; // Skipped heading level
      }
      previousLevel = heading.level;
    }

    return true;
  }

  private static getReadabilityGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }

  private static generateContentSuggestions(
    wordCount: number,
    readingTime: number,
    post: BlogPostContent
  ): string[] {
    const suggestions: string[] = [];

    if (wordCount < 500) {
      suggestions.push('Consider expanding your content to at least 500 words for better engagement');
    }

    if (readingTime > 10) {
      suggestions.push('Consider breaking long content into smaller sections with subheadings');
    }

    if (!post.excerpt) {
      suggestions.push('Add a compelling excerpt to summarize your post');
    }

    return suggestions;
  }

  private static generateImprovements(issues: ContentIssue[]): string[] {
    const improvements: string[] = [];

    const errors = issues.filter(issue => issue.type === 'error');
    if (errors.length > 0) {
      improvements.push('Fix all critical errors before publishing');
    }

    const warnings = issues.filter(issue => issue.type === 'warning');
    if (warnings.length > 0) {
      improvements.push('Address warnings to improve content quality');
    }

    return improvements;
  }
}

/**
 * Utility function to create a new blog post with default structure
 */
export function createBlogPostTemplate(): Partial<BlogPostContent> {
  return {
    title: '',
    content: '',
    excerpt: '',
    author: {
      name: '',
      email: '',
      bio: '',
    },
    tags: [],
    category: '',
    featured: false,
    seo: {
      description: '',
      keywords: [],
      ogImage: '',
    },
  };
}

/**
 * Utility function to sanitize and validate content
 */
export function sanitizeContent(content: string): string {
  // Remove potentially harmful content
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}