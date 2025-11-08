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
    const slug = searchParams.get('slug');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const author = searchParams.get('author') || '';
    const limit = parseInt(searchParams.get('limit') || '3');
    const excludeCurrent = searchParams.get('excludeCurrent') !== 'false';

    if (!slug && !tags.length && !author) {
      return NextResponse.json(
        { error: 'At least one parameter (slug, tags, or author) is required' },
        { status: 400 }
      );
    }

    // Find the current post if slug is provided
    let currentPost = null;
    if (slug) {
      currentPost = blogPosts.find(post => post.slug === slug);
      if (!currentPost) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }
    }

    // Score posts based on relatedness
    const scoredPosts = blogPosts.map(post => {
      let score = 0;
      const reasons: string[] = [];

      // Exclude current post if requested
      if (excludeCurrent && currentPost && post.id === currentPost.id) {
        return null;
      }

      // Tag similarity (highest weight)
      if (currentPost) {
        const commonTags = post.tags.filter(tag => currentPost.tags.includes(tag));
        score += commonTags.length * 10;
        if (commonTags.length > 0) {
          reasons.push(`Shares ${commonTags.length} tag(s): ${commonTags.join(', ')}`);
        }
      }

      // If tags filter is provided, boost matching tags
      if (tags.length > 0) {
        const matchingTags = post.tags.filter(tag => 
          tags.some(filterTag => tag.includes(filterTag))
        );
        score += matchingTags.length * 15;
        if (matchingTags.length > 0) {
          reasons.push(`Matches ${matchingTags.length} filter tag(s): ${matchingTags.join(', ')}`);
        }
      }

      // Author similarity
      if (currentPost) {
        if (post.author.name === currentPost.author.name) {
          score += 5;
          reasons.push('Same author');
        }
      }

      if (author && post.author.name.toLowerCase().includes(author.toLowerCase())) {
        score += 8;
        reasons.push('Same author filter');
      }

      // Publication date proximity (recent posts get slight boost)
      if (currentPost) {
        const currentDate = new Date(currentPost.publishedAt).getTime();
        const postDate = new Date(post.publishedAt).getTime();
        const daysDiff = Math.abs(currentDate - postDate) / (1000 * 60 * 60 * 24);
        
        if (daysDiff <= 30) {
          score += 3;
          reasons.push('Published within 30 days');
        }
      }

      // Content similarity (basic keyword matching)
      if (currentPost) {
        const currentWords = currentPost.content.toLowerCase().split(/\s+/);
        const postWords = post.content.toLowerCase().split(/\s+/);
        const commonWords = currentWords.filter(word => 
          word.length > 3 && postWords.includes(word)
        );
        
        if (commonWords.length > 0) {
          score += Math.min(commonWords.length, 5); // Cap at 5 points
          reasons.push(`Shares ${commonWords.length} keyword(s)`);
        }
      }

      return { post, score, reasons };
    }).filter(Boolean);

    // Sort by score and take the top results
    const relatedPosts = scoredPosts
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => (b.score - a.score))
      .slice(0, limit)
      .map(item => ({
        ...item.post,
        relatedScore: item.score,
        relatedReasons: item.reasons
      }));

    return NextResponse.json({
      relatedPosts,
      total: relatedPosts.length,
      currentPost: currentPost ? {
        slug: currentPost.slug,
        title: currentPost.title,
        tags: currentPost.tags,
        author: currentPost.author.name
      } : null,
      algorithm: {
        factors: ['tag_similarity', 'author_match', 'content_keywords', 'publication_date'],
        weights: {
          tag_similarity: 10,
          author_match: 5,
          content_keywords: 3,
          publication_date: 3
        }
      }
    });

  } catch (error) {
    console.error('Related posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related posts' },
      { status: 500 }
    );
  }
}