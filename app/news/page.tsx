import { Metadata } from "next";
import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  User,
  Eye,
  Heart,
  Share2,
  Search,
  Filter,
  TrendingUp,
  ArrowRight,
  Newspaper,
  Sparkles,
  Megaphone,
  BookOpen,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Post, Category, PostType } from "@/types";

export const metadata: Metadata = {
  title: "Latest News & Updates | DvTools - Developer Tools Platform",
  description: "Stay updated with the latest news, feature releases, tutorials, and announcements from DvTools. Get insights into new developer tools, platform updates, and industry trends.",
  keywords: [
    "DvTools news",
    "developer tools updates",
    "platform announcements",
    "feature releases",
    "developer blog",
    "tech news",
    "tool updates",
    "tutorials",
    "developer resources",
  ],
  openGraph: {
    title: "Latest News & Updates | DvTools",
    description: "Stay updated with the latest news, features, and tutorials from DvTools - Your complete developer tools platform.",
    type: "website",
    url: "https://dvtools.dev/news",
    siteName: "DvTools",
    images: [
      {
        url: "/og-news.jpg",
        width: 1200,
        height: 630,
        alt: "DvTools News & Updates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Latest News & Updates | DvTools",
    description: "Stay updated with the latest news, features, and tutorials from DvTools.",
    images: ["/og-news.jpg"],
  },
  alternates: {
    canonical: "/news",
    types: {
      "application/rss+xml": "/rss",
    },
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

async function getPosts(): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          lte: new Date(),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          take: 0, // Don't load comments for performance
        },
      },
      orderBy: [
        { isPinned: "desc" },
        { featured: "desc" },
        { publishedAt: "desc" },
      ],
      take: 50,
    });

    return posts as unknown as Post[];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

async function getFeaturedPost(): Promise<Post | null> {
  try {
    const post = await prisma.post.findFirst({
      where: {
        status: "PUBLISHED",
        featured: true,
        publishedAt: {
          lte: new Date(),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    return post as unknown as Post | null;
  } catch (error) {
    console.error("Error fetching featured post:", error);
    return null;
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isVisible: true,
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    return categories as unknown as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

const postTypeIcons: Record<PostType, React.ComponentType<any>> = {
  BLOG: BookOpen,
  NEWS: Newspaper,
  UPDATE: Sparkles,
  ANNOUNCEMENT: Megaphone,
  TUTORIAL: BookOpen,
  ARTICLE: BookOpen,
};

const postTypeColors: Record<PostType, string> = {
  BLOG: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  NEWS: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  UPDATE: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  ANNOUNCEMENT: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  TUTORIAL: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  ARTICLE: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
};

export default async function NewsPage() {
  const [posts, featuredPost, categories] = await Promise.all([
    getPosts(),
    getFeaturedPost(),
    getCategories(),
  ]);

  const pinnedPosts: Post[] = posts.filter((post: Post) => post.isPinned);
  const regularPosts: Post[] = posts.filter((post: Post) => !post.isPinned);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "DvTools News & Updates",
            description: "Latest news, updates, and tutorials from DvTools",
            url: "https://dvtools.dev/news",
            publisher: {
              "@type": "Organization",
              name: "DvTools",
              logo: {
                "@type": "ImageObject",
                url: "https://dvtools.dev/logo.png",
              },
            },
            blogPost: posts.slice(0, 10).map((post: Post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt || "",
              url: `https://dvtools.dev/news/${post.slug}`,
              datePublished: post.publishedAt?.toISOString(),
              dateModified: post.updatedAt.toISOString(),
              author: {
                "@type": "Person",
                name: post.author.name || "DvTools Team",
              },
              publisher: {
                "@type": "Organization",
                name: "DvTools",
              },
            })),
          }),
        }}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Stay Updated</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            News & Updates
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay informed about the latest features, updates, tutorials, and announcements from DvTools
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Card className="mb-12 overflow-hidden border-2 border-primary/20 shadow-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative h-64 md:h-full">
                <Image
                  src={featuredPost.ogImage || "/placeholder-news.jpg"}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              </div>
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <Badge
                    variant="secondary"
                    className={postTypeColors[featuredPost.type]}
                  >
                    {featuredPost.type}
                  </Badge>
                  {featuredPost.categories.slice(0, 2).map((pc) => (
                    <Badge key={pc.category.id} variant="outline">
                      {pc.category.name}
                    </Badge>
                  ))}
                </div>
                <h2 className="text-3xl font-bold mb-3">
                  <Link
                    href={`/news/${featuredPost.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {featuredPost.author.name || "DvTools Team"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.publishedAt &&
                      formatDistanceToNow(new Date(featuredPost.publishedAt), {
                        addSuffix: true,
                      })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {featuredPost.views} views
                  </div>
                </div>
                <Button asChild>
                  <Link href={`/news/${featuredPost.slug}`}>
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Pinned Posts */}
            {pinnedPosts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Pinned Posts
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {pinnedPosts.map((post: Post) => {
                    const Icon = postTypeIcons[post.type];
                    return (
                      <Card key={post.id} className="hover:shadow-lg transition-shadow border-primary/20">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <Badge
                              variant="secondary"
                              className={postTypeColors[post.type]}
                            >
                              <Icon className="h-3 w-3 mr-1" />
                              {post.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Pinned
                            </Badge>
                          </div>
                          <CardTitle className="text-xl">
                            <Link
                              href={`/news/${post.slug}`}
                              className="hover:text-primary transition-colors"
                            >
                              {post.title}
                            </Link>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {post.publishedAt &&
                                formatDistanceToNow(new Date(post.publishedAt), {
                                  addSuffix: true,
                                })}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {post.views}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {post.likes}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Regular Posts */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">All Posts</h2>
              {regularPosts.map((post: Post) => {
                const Icon = postTypeIcons[post.type];
                return (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="relative h-48 md:h-full rounded-l-lg overflow-hidden">
                        <Image
                          src={post.ogImage || "/placeholder-news.jpg"}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="md:col-span-3 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant="secondary"
                            className={postTypeColors[post.type]}
                          >
                            <Icon className="h-3 w-3 mr-1" />
                            {post.type}
                          </Badge>
                          {post.categories.slice(0, 2).map((pc) => (
                            <Badge key={pc.category.id} variant="outline">
                              {pc.category.name}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-2xl font-bold mb-2">
                          <Link
                            href={`/news/${post.slug}`}
                            className="hover:text-primary transition-colors"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {post.author.name || "DvTools Team"}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {post.publishedAt &&
                                formatDistanceToNow(new Date(post.publishedAt), {
                                  addSuffix: true,
                                })}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.views}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {post.likes}
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/news/${post.slug}`}>
                                Read More
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {posts.length === 0 && (
              <Card className="p-12 text-center">
                <Newspaper className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">No posts yet</h3>
                <p className="text-muted-foreground">
                  Check back soon for the latest news and updates!
                </p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category: Category) => (
                      <Link
                        key={category.id}
                        href={`/news?category=${category.slug}`}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                        <Badge variant="secondary">
                          {category._count.posts}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Subscribe */}
              <Card className="bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">Stay Updated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get the latest news and updates delivered to your inbox.
                  </p>
                  <form className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-background"
                    />
                    <Button className="w-full">Subscribe</Button>
                  </form>
                </CardContent>
              </Card>

              {/* RSS Feed */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">RSS Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Subscribe to our RSS feed for updates
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/rss">
                      <Newspaper className="mr-2 h-4 w-4" />
                      Subscribe via RSS
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
