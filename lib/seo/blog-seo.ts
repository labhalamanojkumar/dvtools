import { Metadata } from 'next';

export interface BlogPostSEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl?: string;
  author?: {
    name: string;
    bio?: string;
    avatar?: string;
    social?: {
      twitter?: string;
      linkedin?: string;
      website?: string;
    };
  };
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  category?: string;
  readTime: number;
  wordCount?: number;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  relatedPosts?: Array<{
    title: string;
    slug: string;
    description: string;
  }>;
}

export interface BlogPostStructuredData {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  author: {
    '@type': string;
    name: string;
    bio?: string;
    image?: string;
    url?: string;
  };
  publisher: {
    '@type': string;
    name: string;
    logo: {
      '@type': string;
      url: string;
    };
  };
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
  image?: string;
  keywords?: string[];
  articleSection?: string;
  wordCount?: number;
  timeRequired?: string;
  breadcrumb?: {
    '@type': string;
    itemListElement: Array<{
      '@type': string;
      position: number;
      name: string;
      item: string;
    }>;
  };
  faqSection?: {
    '@type': string;
    mainEntity: Array<{
      '@type': string;
      name: string;
      acceptedAnswer: {
        '@type': string;
        text: string;
      };
    }>;
  };
  relatedPosts?: {
    '@type': string;
    itemListElement: Array<{
      '@type': string;
      position: number;
      name: string;
      description: string;
      url: string;
    }>;
  };
}

/**
 * Generate metadata for blog posts with enhanced SEO
 */
export function generateBlogPostMetadata(seo: BlogPostSEO, slug: string): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://malti-tool-platform.com';
  const canonicalUrl = seo.canonicalUrl || `${siteUrl}/blog/${slug}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: seo.author ? [{ name: seo.author.name }] : undefined,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: 'article',
      url: canonicalUrl,
      siteName: 'Malti Tool Platform',
      publishedTime: seo.publishedAt,
      modifiedTime: seo.updatedAt,
      authors: seo.author ? [seo.author.name] : undefined,
      tags: seo.tags,
      images: [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage],
      creator: seo.author?.social?.twitter ? `@${seo.author.social.twitter.replace('@', '')}` : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'article:published_time': seo.publishedAt,
      'article:modified_time': seo.updatedAt,
      'article:author': seo.author?.name || '',
      'article:section': seo.category || 'Technology',
      'article:tag': seo.tags.join(', '),
    },
  };
}

/**
 * Generate JSON-LD structured data for blog posts
 */
export function generateBlogPostStructuredData(seo: BlogPostSEO, slug: string): BlogPostStructuredData {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://malti-tool-platform.com';
  const canonicalUrl = seo.canonicalUrl || `${siteUrl}/blog/${slug}`;
  const articleUrl = `${canonicalUrl}`;
  const readTimeISO = `PT${Math.ceil(seo.readTime)}M`; // ISO 8601 duration format

  const structuredData: BlogPostStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: seo.title,
    description: seo.description,
    author: {
      '@type': 'Person',
      name: seo.author?.name || 'Malti Tool Platform Team',
      bio: seo.author?.bio,
      image: seo.author?.avatar,
      url: seo.author?.social?.website,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Malti Tool Platform',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: seo.publishedAt,
    dateModified: seo.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    image: seo.ogImage,
    keywords: seo.keywords,
    articleSection: seo.category || 'Technology',
    wordCount: seo.wordCount,
    timeRequired: readTimeISO,
  };

  // Add breadcrumb navigation
  structuredData.breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: seo.title,
        item: articleUrl,
      },
    ],
  };

  // Add FAQ section if provided
  if (seo.faq && seo.faq.length > 0) {
    structuredData.faqSection = {
      '@type': 'FAQPage',
      mainEntity: seo.faq.map((item, index) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };
  }

  // Add related posts if provided
  if (seo.relatedPosts && seo.relatedPosts.length > 0) {
    structuredData.relatedPosts = {
      '@type': 'ItemList',
      itemListElement: seo.relatedPosts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: post.title,
        description: post.description,
        url: `${siteUrl}/blog/${post.slug}`,
      })),
    };
  }

  return structuredData;
}

/**
 * Generate RSS feed items from blog posts
 */
export interface RSSFeedItem {
  title: string;
  description: string;
  link: string;
  guid: string;
  pubDate: string;
  author?: string;
  category?: string[];
  enclosure?: {
    url: string;
    type: string;
  };
}

export function generateRSSFeedItems(posts: BlogPostSEO[], slugs: string[]): RSSFeedItem[] {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://malti-tool-platform.com';

  return posts.map((post, index) => ({
    title: post.title,
    description: post.description,
    link: `${siteUrl}/blog/${slugs[index]}`,
    guid: `${siteUrl}/blog/${slugs[index]}`,
    pubDate: post.publishedAt,
    author: post.author?.name || 'Malti Tool Platform Team',
    category: post.tags,
    enclosure: {
      url: post.ogImage,
      type: 'image/jpeg',
    },
  }));
}

/**
 * Estimate reading time based on word count
 */
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Extract keywords from content
 */
export function extractKeywords(content: string, existingKeywords: string[] = []): string[] {
  // Common stop words to filter out
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'will', 'with', 'this', 'you', 'your', 'we', 'our',
    'or', 'but', 'not', 'have', 'had', 'has', 'do', 'does', 'did',
    'can', 'could', 'should', 'would', 'may', 'might', 'must', 'shall',
    'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
    'some', 'such', 'no', 'nor', 'only', 'own', 'same', 'so', 'than',
    'too', 'very', 'just', 'now', 'here', 'there', 'when', 'where',
    'why', 'how', 'what', 'which', 'who', 'whom', 'whose', 'if', 'unless',
    'until', 'while', 'before', 'after', 'above', 'below', 'up', 'down',
    'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once'
  ]);

  // Extract words and count frequency
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  // Get most frequent words
  const topWords = Array.from(wordCount.entries())
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);

  // Combine with existing keywords, avoiding duplicates
  const allKeywords = [...new Set([...topWords, ...existingKeywords])];
  
  return allKeywords.slice(0, 15); // Limit to 15 keywords
}