import { NextRequest, NextResponse } from 'next/server';
import { generateRSSFeedItems } from '@/lib/seo/blog-seo';
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

Format arrays with proper indentation and consistent spacing.

## Advanced Techniques

### Schema Validation

Use JSON Schema to validate your JSON structure.

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
      title: "Mastering JSON Formatting: Best Practices for Developers | DvTools",
      description: "Learn essential JSON formatting techniques, best practices, and tools for developers. Master JSON structure, validation, and formatting for better code quality.",
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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://malti-tool-platform.com';
    const currentDate = new Date().toUTCString();

    // Sort posts by published date (newest first)
    const sortedPosts = [...blogPosts].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    const slugs = sortedPosts.map(post => post.slug);
    const feedItems = sortedPosts.map((post, index) => ({
      title: post.title,
      description: post.excerpt,
      link: `${siteUrl}/blog/${post.slug}`,
      guid: `${siteUrl}/blog/${post.slug}`,
      pubDate: post.publishedAt,
      author: post.author.name,
      category: post.tags,
      enclosure: {
        url: post.seo.ogImage,
        type: 'image/jpeg',
      },
    }));

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Malti Tool Platform - Developer Tools Blog</title>
    <description>Latest articles about developer tools, productivity, and best practices from the Malti Tool Platform team.</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <pubDate>${currentDate}</pubDate>
    <ttl>60</ttl>
    <generator>Malti Tool Platform RSS Generator</generator>
    <managingEditor>editor@malti-tool-platform.com (Malti Tool Platform Team)</managingEditor>
    <webMaster>webmaster@malti-tool-platform.com (Malti Tool Platform Team)</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} Malti Tool Platform</copyright>
    <image>
      <url>${siteUrl}/logo.png</url>
      <title>Malti Tool Platform</title>
      <link>${siteUrl}</link>
      <width>144</width>
      <height>144</height>
      <description>Developer Tools and Best Practices</description>
    </image>
    
    ${feedItems.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.guid}</guid>
      <pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>
      <author>${item.author || 'Malti Tool Platform Team'}</author>
      ${item.category ? item.category.map(cat => `<category><![CDATA[${cat}]]></category>`).join('\n      ') : ''}
      ${item.enclosure ? `<enclosure url="${item.enclosure.url}" type="${item.enclosure.type}" />` : ''}
    </item>`).join('')}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 1 hour cache
      },
    });
  } catch (error) {
    console.error('RSS feed generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate RSS feed' },
      { status: 500 }
    );
  }
}

// Alternative XML sitemap endpoint for better SEO
export async function POST(request: NextRequest) {
  // Support for both RSS and XML sitemap generation
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'rss';

  if (format === 'sitemap') {
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://malti-tool-platform.com';
      
      const sortedPosts = [...blogPosts].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${sortedPosts.map(post => `
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

      return new NextResponse(sitemapXml, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=86400', // 24 hours cache
        },
      });
    } catch (error) {
      console.error('Sitemap generation error:', error);
      return NextResponse.json(
        { error: 'Failed to generate sitemap' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: 'Unsupported format' },
    { status: 400 }
  );
}