import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | DevTools Hub - Developer Insights & Tutorials",
  description:
    "Stay updated with the latest developer tools, tutorials, best practices, and insights. Learn about JSON formatting, JWT authentication, regex patterns, and more.",
  keywords: [
    "developer blog",
    "programming tutorials",
    "JSON best practices",
    "JWT authentication",
    "regular expressions",
    "web development",
    "coding tips",
    "developer tools",
  ],
  openGraph: {
    title: "Blog | DevTools Hub - Developer Insights & Tutorials",
    description:
      "Stay updated with the latest developer tools, tutorials, best practices, and insights.",
    type: "website",
    url: "/blog",
    siteName: "DevTools Hub",
    images: [
      {
        url: "/blog-og.jpg",
        width: 1200,
        height: 630,
        alt: "DevTools Hub Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | DevTools Hub - Developer Insights & Tutorials",
    description:
      "Stay updated with the latest developer tools, tutorials, best practices, and insights.",
    images: ["/blog-og.jpg"],
  },
  alternates: {
    canonical: "/blog",
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

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  tags: string[];
  readTime: number;
  featured: boolean;
}

// This would typically come from your CMS or database
const featuredPosts: BlogPost[] = [
  {
    id: "1",
    title: "Mastering JSON Formatting: Best Practices for Developers",
    slug: "mastering-json-formatting-best-practices",
    excerpt:
      "Learn the essential techniques and best practices for formatting, validating, and working with JSON data in your applications.",
    author: {
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
    },
    publishedAt: "2024-01-15T10:00:00Z",
    tags: ["JSON", "JavaScript", "Best Practices"],
    readTime: 5,
    featured: true,
  },
];

const recentPosts: BlogPost[] = [
  {
    id: "2",
    title: "The Complete Guide to JWT Authentication",
    slug: "complete-guide-jwt-authentication",
    excerpt:
      "Everything you need to know about JSON Web Tokens, from basic concepts to advanced security implementations.",
    author: {
      name: "Mike Chen",
      avatar: "/avatars/mike.jpg",
    },
    publishedAt: "2024-01-10T14:30:00Z",
    tags: ["JWT", "Authentication", "Security"],
    readTime: 8,
    featured: false,
  },
  {
    id: "3",
    title: "Regular Expressions: From Beginner to Expert",
    slug: "regular-expressions-beginner-to-expert",
    excerpt:
      "Master regular expressions with practical examples, advanced techniques, and real-world applications.",
    author: {
      name: "Alex Rodriguez",
      avatar: "/avatars/alex.jpg",
    },
    publishedAt: "2024-01-05T09:15:00Z",
    tags: ["Regex", "Pattern Matching", "Text Processing"],
    readTime: 12,
    featured: false,
  },
];

const categories = [
  { name: "All Posts", count: 15, active: true },
  { name: "JSON", count: 5, active: false },
  { name: "Authentication", count: 3, active: false },
  { name: "Security", count: 4, active: false },
  { name: "Tools", count: 6, active: false },
  { name: "Best Practices", count: 8, active: false },
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BlogPostCard({
  post,
  featured = false,
}: {
  post: BlogPost;
  featured?: boolean;
}) {
  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 ${featured ? "border-primary/50 bg-primary/5" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <Clock className="h-4 w-4" />
          <span>{post.readTime} min read</span>
          {featured && (
            <>
              <span>•</span>
              <Badge variant="secondary" className="text-xs">
                Featured
              </Badge>
            </>
          )}
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3
            className={`font-semibold leading-tight group-hover:text-primary transition-colors ${featured ? "text-xl" : "text-lg"}`}
          >
            {post.title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">{post.author.name}</span>
          </div>

          <div className="flex items-center gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 2 && (
              <span className="text-xs text-muted-foreground">
                +{post.tags.length - 2}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <Link href={`/blog/${post.slug}`}>
            <Button
              variant="ghost"
              className="p-0 h-auto font-medium text-primary hover:text-primary/80"
            >
              Read more
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BlogPage({
  searchParams,
}: {
  searchParams?: { tag?: string; category?: string; page?: string };
}) {
  const tagFilter = searchParams?.tag;
  const categoryFilter = searchParams?.category;
  const page = parseInt(searchParams?.page || "1", 10) || 1;
  const PAGE_SIZE = 6;

  // Combine featured + recent as the source of truth for now
  const allPosts = [...featuredPosts, ...recentPosts];

  // Helper to filter by category/tag
  const matchesFilter = (post: BlogPost) => {
    if (tagFilter) {
      return post.tags
        .map((t) => t.toLowerCase())
        .includes(tagFilter.toLowerCase());
    }
    if (categoryFilter) {
      // category names are simple strings like 'JSON' or 'Authentication'
      return post.tags
        .map((t) => t.toLowerCase())
        .includes(categoryFilter.toLowerCase());
    }
    return true;
  };

  const filteredPosts = allPosts.filter(matchesFilter);
  const start = (page - 1) * PAGE_SIZE;
  const paginatedPosts = filteredPosts.slice(start, start + PAGE_SIZE);
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "DevTools Hub Blog",
            description:
              "Developer insights, tutorials, and best practices for modern web development",
            url: "https://devtoolshub.com/blog",
            publisher: {
              "@type": "Organization",
              name: "DevTools Hub",
              logo: {
                "@type": "ImageObject",
                url: "https://devtoolshub.com/logo.png",
              },
            },
            blogPost: featuredPosts.concat(recentPosts).map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              author: {
                "@type": "Person",
                name: post.author.name,
              },
              datePublished: post.publishedAt,
              url: `https://devtoolshub.com/blog/${post.slug}`,
              keywords: post.tags.join(", "),
            })),
          }),
        }}
      />

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Developer <span className="text-primary">Insights</span> & Tutorials
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Stay updated with the latest developer tools, best practices,
          tutorials, and insights to enhance your development workflow.
        </p>

        {/* Newsletter Signup */}
        <Card className="max-w-md mx-auto p-6 bg-primary/5 border-primary/20">
          <h3 className="font-semibold mb-2">Subscribe to our newsletter</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get the latest tutorials and updates delivered to your inbox.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 text-sm border rounded-md"
            />
            <Button size="sm">Subscribe</Button>
          </div>
        </Card>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((categoryItem) => (
          <Link
            key={categoryItem.name}
            href={`/blog?category=${encodeURIComponent(categoryItem.name.toLowerCase())}`}
            className="rounded-full"
          >
            <Button
              variant={categoryItem.active ? "default" : "outline"}
              size="sm"
              className="rounded-full"
            >
              {categoryItem.name}
              <Badge variant="secondary" className="ml-2 text-xs">
                {categoryItem.count}
              </Badge>
            </Button>
          </Link>
        ))}
      </div>

      {/* Featured Post */}
      {featuredPosts.length > 0 && !tagFilter && !categoryFilter && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Featured Article
          </h2>
          <div className="grid md:grid-cols-1 gap-8">
            {featuredPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} featured={true} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          {tagFilter
            ? `Articles tagged "${tagFilter}"`
            : categoryFilter
              ? `${categoryFilter} Articles`
              : "Recent Articles"}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          {start + PAGE_SIZE < filteredPosts.length ? (
            <Link
              href={`/blog?${tagFilter ? `tag=${encodeURIComponent(tagFilter)}` : categoryFilter ? `category=${encodeURIComponent(categoryFilter)}` : ""}${tagFilter || categoryFilter ? "&" : ""}page=${page + 1}`}
            >
              <Button variant="outline" size="lg">
                Load More Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="lg" disabled>
              No more articles
            </Button>
          )}
        </div>
      </section>

      {/* Popular Tags */}
      <section className="mt-16 pt-12 border-t">
        <h3 className="text-xl font-semibold mb-6 text-center">
          Popular Topics
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            "JSON",
            "JavaScript",
            "Authentication",
            "Security",
            "API",
            "React",
            "Node.js",
            "TypeScript",
            "Best Practices",
            "Tools",
          ].map((tag) => (
            <Link key={tag} href={`/blog?tag=${tag.toLowerCase()}`}>
              <Badge
                variant="outline"
                className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
