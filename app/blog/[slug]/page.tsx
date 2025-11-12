import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
} from "lucide-react";
// Enhanced components
import { TableOfContents } from "@/components/blog/table-of-contents";
import { AuthorCard } from "@/components/blog/author-card";
import { SocialSharing } from "@/components/blog/social-sharing";
import { BlogComments } from "@/components/blog/comments";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";

// Fetch post from database
async function getPost(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/blog/${slug}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Mock data for backwards compatibility with tool blogs
const toolBlogPosts = [
  {
    id: "1",
    title: "Mastering JSON Formatting: Best Practices for Developers",
    slug: "mastering-json-formatting-best-practices",
    excerpt:
      "Learn the essential techniques and best practices for formatting, validating, and working with JSON data in your applications.",
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

\`\`\`json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "preferences": {
      "theme": "dark",
      "notifications": true
    }
  }
}
\`\`\`

### 2. Proper Key-Value Pair Structure

Always use double quotes for both keys and string values. Keys should be meaningful and follow a consistent naming convention.

### 3. Array Formatting

Format arrays with proper indentation and consistent spacing:

\`\`\`json
{
  "tags": [
    "javascript",
    "json",
    "formatting"
  ],
  "categories": [
    {
      "id": 1,
      "name": "Development"
    },
    {
      "id": 2,
      "name": "Tools"
    }
  ]
}
\`\`\`

## Advanced Techniques

### Schema Validation

Use JSON Schema to validate your JSON structure:

\`\`\`json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1
    },
    "email": {
      "type": "string",
      "format": "email"
    }
  },
  "required": ["name", "email"]
}
\`\`\`

### Pretty Printing vs Minification

Choose the appropriate format based on your use case:
- **Development**: Pretty-printed for readability
- **Production**: Minified for performance
- **Logs**: Pretty-printed for debugging

## Tools and Best Practices

### Online JSON Formatters

Several excellent online tools can help you format JSON:
- Built-in browser developer tools
- Online JSON validators and formatters
- IDE extensions and plugins

### Automation

Integrate JSON formatting into your development workflow:
- Pre-commit hooks
- CI/CD pipelines
- Code editors with auto-formatting

## Common Pitfalls to Avoid

1. **Trailing Commas**: JSON doesn't allow trailing commas
2. **Comments**: JSON doesn't support comments (use JSON5 for development)
3. **Single Quotes**: Always use double quotes for strings
4. **Undefined Values**: Use null instead of undefined

## Conclusion

Mastering JSON formatting is an essential skill for modern developers. By following these best practices, you'll create more maintainable, readable, and error-free JSON structures that will serve your applications well into the future.`,
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
      title:
        "Mastering JSON Formatting: Best Practices for Developers | DvTools",
      description:
        "Learn essential JSON formatting techniques, best practices, and tools for developers. Master JSON structure, validation, and formatting for better code quality.",
      keywords: [
        "JSON formatting",
        "JSON best practices",
        "JavaScript",
        "data interchange",
        "API development",
      ],
      ogImage: "/blog/json-formatting-og.jpg",
    },
  },
  {
    id: "2",
    title: "The Complete Guide to JWT Authentication",
    slug: "complete-guide-jwt-authentication",
    excerpt:
      "Everything you need to know about JSON Web Tokens, from basic concepts to advanced security implementations.",
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

### 3. Signature Verification

Always verify JWT signatures on the server side before trusting the payload.

## Security Considerations

### Common Vulnerabilities

1. **Algorithm Confusion**: Always specify the algorithm explicitly
2. **Weak Secrets**: Use strong, randomly generated secrets
3. **Token Leakage**: Implement proper token invalidation

### Best Practices

- Use HS256 for symmetric encryption
- Implement proper token refresh mechanisms
- Validate all claims on the server
- Use HTTPS everywhere

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
      description:
        "Master JWT authentication with this comprehensive guide covering implementation, security best practices, and common pitfalls.",
      keywords: ["JWT", "authentication", "security", "tokens", "API security"],
      ogImage: "/blog/jwt-auth-og.jpg",
    },
  },
  {
    id: "3",
    title: "Regular Expressions: From Beginner to Expert",
    slug: "regular-expressions-beginner-to-expert",
    excerpt:
      "Master regular expressions with practical examples, advanced techniques, and real-world applications.",
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
- \`{n}\` - Exactly n times
- \`{n,}\` - n or more times
- \`{n,m}\` - Between n and m times

## Advanced Techniques

### Lookahead and Lookbehind
- \`(?=...)\` - Positive lookahead
- \`(?!...)\` - Negative lookahead
- \`(?<=...)\` - Positive lookbehind
- \`(?<!...)\` - Negative lookbehind

### Groups and Capturing
- \`(...)\` - Capturing group
- \`(?:...)\` - Non-capturing group
- \`\\1\` - Backreference to first group

## Real-World Applications

### Email Validation
\`\`\`regex
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$
\`\`\`

### URL Matching
\`\`\`regex
https?://(?:[-\\w.]|(?:%[\\da-fA-F]{2}))+
\`\`\`

### Phone Number Formatting
\`\`\`regex
^(\\+?1)?[.-]?\\(?([0-9]{3})\\)?[.-]?([0-9]{3})[.-]?([0-9]{4})$
\`\`\`

## Performance Considerations

### Optimization Tips
1. Use anchors (^ and $) when possible
2. Avoid nested quantifiers
3. Use character classes instead of alternation
4. Test regex performance with large inputs

## Tools and Testing

### Online Regex Testers
- RegEx101
- Regexr
- RegEx Tester (our tool!)

### Best Practices
- Comment complex regex patterns
- Use raw strings in your programming language
- Test thoroughly with various inputs
- Consider readability vs performance trade-offs

## Conclusion

Regular expressions are indispensable tools for text processing. With practice and the right techniques, you can solve complex text manipulation challenges efficiently.`,
    author: {
      name: "Alex Rodriguez",
      avatar: "/avatars/alex.jpg",
    },
    publishedAt: "2024-01-05T09:15:00Z",
    updatedAt: "2024-01-05T09:15:00Z",
    tags: [
      "Regex",
      "Regular Expressions",
      "Pattern Matching",
      "Text Processing",
    ],
    readTime: 12,
    featured: false,
    seo: {
      title: "Regular Expressions: From Beginner to Expert | DvTools",
      description:
        "Master regular expressions with practical examples and advanced techniques for pattern matching and text processing.",
      keywords: [
        "regular expressions",
        "regex",
        "pattern matching",
        "text processing",
        "programming",
      ],
      ogImage: "/blog/regex-guide-og.jpg",
    },
  },
];

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Try to fetch from database first
  let post = await getPost(params.slug);
  
  // Fallback to tool blog posts
  if (!post) {
    post = toolBlogPosts.find((p) => p.slug === params.slug);
  }

  if (!post) {
    return {
      title: "Post Not Found | DvTools Blog",
    };
  }

  // Handle database post metadata
  if (post.metaTitle || post.author?.name) {
    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      keywords: post.metaKeywords ? post.metaKeywords.split(',') : [],
      authors: post.author ? [{ name: post.author.name }] : [],
      openGraph: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        type: "article",
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        authors: post.author ? [post.author.name] : [],
        images: post.ogImage ? [post.ogImage] : [],
      },
    };
  }

  // Handle tool blog post metadata
  return {
    title: post.seo.title,
    description: post.seo.description,
    keywords: post.seo.keywords,
    openGraph: {
      title: post.seo.title,
      description: post.seo.description,
      type: "article",
      url: `/blog/${post.slug}`,
      siteName: "DvTools",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: post.seo.ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.title,
      description: post.seo.description,
      images: [post.seo.ogImage],
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
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
  };
}

export default async function BlogPostPage({ params }: Props) {
  // First try to fetch from database
  let post = await getPost(params.slug);
  
  // Fallback to tool blog posts if not found in database
  if (!post) {
    post = toolBlogPosts.find((p) => p.slug === params.slug);
  }

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  // Calculate read time for database posts that don't have it
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };
  
  const readTime = post.readTime || calculateReadTime(post.content || '');
  const authorName = post.author?.name || post.author;
  const authorAvatar = post.author?.image || post.author?.avatar || '/avatars/default.png';
  const authorBio = post.author?.bio || 'Technical writer and developer advocate passionate about sharing knowledge with the community.';

  // Prepare tags for structured data - handle both array of objects and array of strings
  const tagsArray = post.tags ? (
    Array.isArray(post.tags) && post.tags.length > 0
      ? post.tags.map((t: any) => typeof t === 'string' ? t : (t.tag?.name || t.name || '')).filter(Boolean)
      : []
  ) : [];

  // Get OG image - handle both database posts (ogImage) and tool blogs (seo.ogImage)
  const ogImageUrl = post.ogImage || post.seo?.ogImage || '';

  // Detect whether post.content contains HTML tags. If true, we'll render
  // it using `dangerouslySetInnerHTML` so <img> and other tags are processed
  // correctly. Otherwise treat the content as Markdown.
  const contentIsHtml = /<\/?[a-z][\s\S]*>/i.test(post.content || '');
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            author: {
              "@type": "Person",
              name: authorName,
            },
            publisher: {
              "@type": "Organization",
              name: "DvTools",
              logo: {
                "@type": "ImageObject",
                url: "https://dvtools.in/logo.png",
              },
            },
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://dvtools.in/blog/${post.slug}`,
            },
            keywords: tagsArray.join(", "),
            articleSection: tagsArray[0] || "Blog",
            image: ogImageUrl,
          }),
        }}
      />

      {/* Back Navigation */}
      <div className="mb-8">
        <Link href="/blog">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <Clock className="h-4 w-4" />
          <span>{readTime} min read</span>
          {post.featured && (
            <>
              <span>•</span>
              <Badge variant="secondary">Featured</Badge>
            </>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          {post.title}
        </h1>

        <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>

        {/* Author Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">{authorName}</p>
              <p className="text-sm text-muted-foreground">Author</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {post.tags && post.tags.length > 0 && post.tags.map((tag: any) => {
            const tagName = typeof tag === 'string' ? tag : (tag.tag?.name || tag.name);
            const tagSlug = typeof tag === 'string' ? tag.toLowerCase() : (tag.tag?.slug || tag.slug);
            return (
              <Link key={tagSlug || tagName} href={`/blog?tag=${tagSlug}`}>
                <Badge
                  variant="outline"
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {tagName}
                </Badge>
              </Link>
            );
          })}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Article Content */}
          <article className="prose prose-lg max-w-none dark:prose-invert">
            {/*
              post.content can be either Markdown or pre-rendered HTML depending on
              how the post was created (editor -> HTML or markdown). If the content
              contains HTML tags (e.g. <img>), render it as HTML. Otherwise treat it
              as Markdown and use the MarkdownRenderer.
            */}
            {typeof post.markdownContent === 'string' && post.markdownContent.trim().length > 0 ? (
              <MarkdownRenderer content={post.markdownContent} />
            ) : contentIsHtml ? (
              // content appears to contain HTML tags; render as HTML
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              // fallback: treat as markdown
              <MarkdownRenderer content={post.content || ''} />
            )}
          </article>

          {/* Author Card */}
          <div className="mt-8">
            <AuthorCard
              author={{
                name: authorName,
                avatar: authorAvatar,
                bio: authorBio,
                role: 'Technical Writer',
              }}
              publishedAt={post.publishedAt}
              readTime={readTime}
            />
          </div>

          {/* Social Sharing */}
          <div className="mt-6">
            <SocialSharing
              title={post.title}
              url={`/blog/${post.slug}`}
              description={post.excerpt}
              className="mb-6"
            />
          </div>

          {/* Comments Section */}
          <div className="mt-12">
            <BlogComments postSlug={post.slug} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Table of Contents */}
            <TableOfContents content={post.content} />
            
            {/* More sidebar content can be added here */}
          </div>
        </div>
      </div>

      {/* Article Footer */}
      <footer className="mt-12 pt-8 border-t">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Last updated: {formatDate(post.updatedAt)}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share Article
            </Button>
          </div>
        </div>
      </footer>

      {/* Related Articles */}
      <section className="mt-12">
        <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {toolBlogPosts
            .filter((p: any) => p.id !== post.id)
            .slice(0, 2)
            .map((relatedPost: any) => (
              <Card
                key={relatedPost.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <h4 className="font-semibold mb-2 hover:text-primary transition-colors">
                      {relatedPost.title}
                    </h4>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{relatedPost.author.name}</span>
                    <span>{formatDate(relatedPost.publishedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </section>
    </div>
  );
}
