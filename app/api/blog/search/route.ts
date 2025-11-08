import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

// Mock blog posts data - in production, this would come from your CMS or database
const blogPosts = [
  {
    id: "1",
    title: "Mastering JSON Formatting: Best Practices for Developers",
    slug: "mastering-json-formatting-best-practices",
    excerpt: "Learn the essential techniques and best practices for formatting, validating, and working with JSON data in your applications.",
    content: `# Mastering JSON Formatting: Best Practices for Developers

JSON (JavaScript Object Notation) has become the de facto standard for data interchange in modern web applications. Whether you're building APIs, working with configuration files, or handling data storage, understanding JSON formatting best practices is crucial for any developer.

## Why JSON Formatting Matters

Proper JSON formatting isn't just about aesthetics—it's about:
- **Readability**: Well-formatted JSON is easier to read and debug
- **Maintainability**: Clean structure makes code easier to maintain
- **Collaboration**: Team members can quickly understand data structures
- **Error Prevention**: Proper formatting helps catch syntax errors early

## Essential Formatting Rules

### 1. Consistent Indentation

Use consistent indentation throughout your JSON files. Most developers prefer 2 spaces or 4 spaces for indentation.

### 2. Proper Key-Value Pair Structure

Always use double quotes for both keys and string values.

## Conclusion

Mastering JSON formatting is an essential skill for modern developers.`,
    author: {
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
    },
    publishedAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    tags: ["JSON", "JavaScript", "Best Practices", "Development"],
    readTime: 5,
    featured: true,
    seo: {
      title: "Mastering JSON Formatting: Best Practices for Developers | DvTools",
      description: "Learn essential JSON formatting techniques, best practices, and tools for developers.",
      keywords: ["JSON formatting", "JSON best practices", "JavaScript", "data interchange", "API development"],
      ogImage: "/blog/json-formatting-og.jpg",
    },
  },
  {
    id: "2",
    title: "The Complete Guide to JWT Authentication",
    slug: "complete-guide-jwt-authentication",
    excerpt: "Everything you need to know about JSON Web Tokens, from basic concepts to advanced security implementations.",
    content: `# The Complete Guide to JWT Authentication

JSON Web Tokens (JWT) have revolutionized authentication in modern web applications. This comprehensive guide covers everything from basic concepts to advanced security implementations.

## What is JWT?

JWT is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object.

## JWT Structure

A JWT consists of three parts separated by dots:
- **Header**: Contains the type of token and signing algorithm
- **Payload**: Contains the claims (user data, expiration, etc.)
- **Signature**: Ensures the token hasn't been altered

## Implementation Best Practices

### 1. Secure Token Storage

Never store JWTs in localStorage in production. Use httpOnly cookies instead.

### 2. Token Expiration

Always set reasonable expiration times and implement refresh token patterns.

## Conclusion

JWT authentication, when implemented correctly, provides a robust and scalable solution for modern web applications.`,
    author: {
      name: "Mike Chen",
      avatar: "/avatars/mike.jpg",
    },
    publishedAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
    tags: ["JWT", "Authentication", "Security", "API"],
    readTime: 8,
    featured: false,
    seo: {
      title: "Complete Guide to JWT Authentication | DvTools",
      description: "Master JWT authentication with this comprehensive guide covering implementation, security best practices, and common pitfalls.",
      keywords: ["JWT", "authentication", "security", "tokens", "API security"],
      ogImage: "/blog/jwt-auth-og.jpg",
    },
  },
  {
    id: "3",
    title: "Regular Expressions: From Beginner to Expert",
    slug: "regular-expressions-beginner-to-expert",
    excerpt: "Master regular expressions with practical examples, advanced techniques, and real-world applications.",
    content: `# Regular Expressions: From Beginner to Expert

Regular expressions (regex) are powerful tools for pattern matching and text manipulation. This guide takes you from basic concepts to advanced techniques.

## Basic Syntax

### Character Classes
- \`.\` - Any character except newline
- \`\\d\` - Digit (0-9)
- \`\\w\` - Word character (a-z, A-Z, 0-9, _)
- \`\\s\` - Whitespace character

### Quantifiers
- \`*\` - Zero or more
- \`+\` - One or more
- \`?\` - Zero or one

## Real-World Applications

### Email Validation
\`\`\`regex
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$
\`\`\`

## Conclusion

Regular expressions are indispensable tools for text processing.`,
    author: {
      name: "Alex Rodriguez",
      avatar: "/avatars/alex.jpg",
    },
    publishedAt: "2024-01-05T09:15:00Z",
    updatedAt: "2024-01-05T09:15:00Z",
    tags: ["Regex", "Regular Expressions", "Pattern Matching", "Text Processing"],
    readTime: 12,
    featured: false,
    seo: {
      title: "Regular Expressions: From Beginner to Expert | DvTools",
      description: "Master regular expressions with practical examples and advanced techniques for pattern matching and text processing.",
      keywords: ["regular expressions", "regex", "pattern matching", "text processing", "programming"],
      ogImage: "/blog/regex-guide-og.jpg",
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const author = searchParams.get('author') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query.trim()) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Normalize search query
    const normalizedQuery = query.toLowerCase().trim();
    
    // Score posts based on relevance
    const scoredPosts = blogPosts.map(post => {
      let score = 0;
      const title = post.title.toLowerCase();
      const content = post.content.toLowerCase();
      const excerpt = post.excerpt.toLowerCase();
      const titleWords = title.split(' ');
      const contentWords = content.split(' ');
      const excerptWords = excerpt.split(' ');
      const tagsLower = post.tags.map(tag => tag.toLowerCase());

      // Title matches (highest weight)
      if (title.includes(normalizedQuery)) {
        score += 10;
      }
      titleWords.forEach(word => {
        if (word.includes(normalizedQuery) && word.length > 3) {
          score += 5;
        }
      });

      // Excerpt matches (medium weight)
      if (excerpt.includes(normalizedQuery)) {
        score += 7;
      }
      excerptWords.forEach(word => {
        if (word.includes(normalizedQuery) && word.length > 3) {
          score += 3;
        }
      });

      // Content matches (lower weight)
      if (content.includes(normalizedQuery)) {
        score += 5;
      }
      contentWords.forEach(word => {
        if (word.includes(normalizedQuery) && word.length > 3) {
          score += 1;
        }
      });

      // Tag matches (medium weight)
      if (tagsLower.some(tag => tag.includes(normalizedQuery))) {
        score += 8;
      }

      // Tag filter
      if (tags.length > 0) {
        const hasMatchingTag = tags.some(filterTag => 
          post.tags.some(postTag => 
            postTag.toLowerCase().includes(filterTag.toLowerCase())
          )
        );
        if (hasMatchingTag) {
          score += 15; // Bonus for tag match
        } else {
          score = 0; // Exclude if no tag matches
        }
      }

      // Author filter
      if (author && !post.author.name.toLowerCase().includes(author.toLowerCase())) {
        score = 0; // Exclude if author doesn't match
      }

      return { post, score };
    });

    // Filter out posts with score 0 and sort by relevance
    const relevantPosts = scoredPosts
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(offset, offset + limit)
      .map(item => ({
        ...item.post,
        searchScore: item.score,
        relevance: item.score >= 20 ? 'high' : item.score >= 10 ? 'medium' : 'low'
      }));

    return NextResponse.json({
      posts: relevantPosts,
      total: relevantPosts.length,
      query,
      suggestions: generateSuggestions(normalizedQuery, blogPosts),
      facets: generateFacets(blogPosts)
    });

  } catch (error) {
    console.error('Blog search error:', error);
    return NextResponse.json(
      { error: 'Failed to search blog posts' },
      { status: 500 }
    );
  }
}

function generateSuggestions(query: string, posts: any[]): string[] {
  const suggestions = new Set<string>();
  
  posts.forEach(post => {
    post.tags.forEach((tag: string) => {
      if (tag.toLowerCase().includes(query)) {
        suggestions.add(tag);
      }
    });
  });

  return Array.from(suggestions).slice(0, 5);
}

function generateFacets(posts: any[]): { tags: { name: string; count: number }[]; authors: { name: string; count: number }[] } {
  const tagCounts = new Map<string, number>();
  const authorCounts = new Map<string, number>();

  posts.forEach(post => {
    // Count tags
    post.tags.forEach((tag: string) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });

    // Count authors
    authorCounts.set(post.author.name, (authorCounts.get(post.author.name) || 0) + 1);
  });

  return {
    tags: Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ name: tag, count })),
    authors: Array.from(authorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([author, count]) => ({ name: author, count }))
  };
}