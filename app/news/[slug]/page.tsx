import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  User,
  Eye,
  Heart,
  ArrowLeft,
  BookOpen,
  Newspaper,
  Sparkles,
  Megaphone,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import { Post } from "@/types";
import { ShareButtons } from "@/components/blog/share-buttons";

interface PageProps {
  params: {
    slug: string;
  };
}

// This will be properly typed after schema migration
async function getPost(slug: string): Promise<Post | null> {
  try {
    const { prisma } = await import("@/lib/db");

    const post = await prisma.post.findUnique({
      where: {
        slug: slug,
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
          where: {
            isApproved: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    });

    return post as unknown as Post | null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

async function getRelatedPosts(postId: string, categories: string[]): Promise<Post[]> {
  try {
    const { prisma } = await import("@/lib/db");

    const relatedPosts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          lte: new Date(),
        },
        id: {
          not: postId,
        },
        categories: {
          some: {
            categoryId: {
              in: categories,
            },
          },
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
      take: 4,
    });

    return relatedPosts as unknown as Post[];
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found | DvTools News",
    };
  }

  // Type assertion since we know post exists at this point
  const validPost = post as Post;

  return {
    title: `${validPost.metaTitle || validPost.title} | DvTools News`,
    description: validPost.metaDescription || validPost.excerpt || "",
    keywords: validPost.metaKeywords?.split(",") || [],
    authors: [{ name: validPost.author?.name || "DvTools Team" }],
    openGraph: {
      title: validPost.metaTitle || validPost.title,
      description: validPost.metaDescription || validPost.excerpt || "",
      type: "article",
      url: `https://dvtools.in/news/${validPost.slug}`,
      siteName: "DvTools",
      images: validPost.ogImage
        ? [
            {
              url: validPost.ogImage,
              width: 1200,
              height: 630,
              alt: validPost.title,
            },
          ]
        : [],
      publishedTime: validPost.publishedAt?.toISOString(),
      modifiedTime: validPost.updatedAt.toISOString(),
      authors: [validPost.author?.name || "DvTools Team"],
      tags: validPost.tags?.map((t) => t.tag.name) || [],
    },
    twitter: {
      card: "summary_large_image",
      title: validPost.metaTitle || validPost.title,
      description: validPost.metaDescription || validPost.excerpt || "",
      images: validPost.ogImage ? [validPost.ogImage] : [],
      creator: "@dvtools",
    },
    alternates: {
      canonical: `/news/${validPost.slug}`,
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

const postTypeIcons = {
  BLOG: BookOpen,
  NEWS: Newspaper,
  UPDATE: Sparkles,
  ANNOUNCEMENT: Megaphone,
  TUTORIAL: BookOpen,
  ARTICLE: BookOpen,
};

const postTypeColors = {
  BLOG: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  NEWS: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  UPDATE: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  ANNOUNCEMENT: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  TUTORIAL: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  ARTICLE: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
};

export default async function PostPage({ params }: PageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  // Type assertion since we know post exists after the null check
  const validPost = post as Post;

  const relatedPosts = await getRelatedPosts(
    validPost.id,
    validPost.categories?.map((c) => c.category.id) || []
  );

  const Icon = postTypeIcons[validPost.type as keyof typeof postTypeIcons];
  const shareUrl = `https://dvtools.in/news/${validPost.slug}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: validPost.title,
            description: validPost.excerpt || "",
            image: validPost.ogImage || "",
            url: shareUrl,
            datePublished: validPost.publishedAt?.toISOString(),
            dateModified: validPost.updatedAt.toISOString(),
            author: {
              "@type": "Person",
              name: validPost.author?.name || "DvTools Team",
            },
            publisher: {
              "@type": "Organization",
              name: "DvTools",
              logo: {
                "@type": "ImageObject",
                url: "https://dvtools.in/logo.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": shareUrl,
            },
            keywords: validPost.metaKeywords || "",
          }),
        }}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article>
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className={postTypeColors[validPost.type as keyof typeof postTypeColors]}
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {validPost.type}
                  </Badge>
                  {validPost.categories?.slice(0, 3).map((pc) => (
                    <Badge key={pc.category.id} variant="outline">
                      {pc.category.name}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-5xl font-bold tracking-tight mb-6">
                  {validPost.title}
                </h1>

                {validPost.excerpt && (
                  <p className="text-xl text-muted-foreground mb-6">
                    {validPost.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {validPost.author?.image && (
                        <Image
                          src={validPost.author.image}
                          alt={validPost.author.name || "Author"}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="font-medium">
                            {validPost.author?.name || "DvTools Team"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {validPost.publishedAt &&
                        format(new Date(validPost.publishedAt), "MMMM dd, yyyy")}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {Math.ceil(validPost.content.split(" ").length / 200)} min read
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      {validPost.views}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      {validPost.likes}
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {validPost.ogImage && (
                <div className="relative w-full h-96 rounded-lg overflow-hidden mb-8">
                  <Image
                    src={validPost.ogImage}
                    alt={validPost.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <Separator className="mb-8" />

              {/* Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {validPost.markdownContent ? (
                  <MarkdownRenderer
                    content={validPost.markdownContent}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeSanitize]}
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: validPost.content }} />
                )}
              </div>

              {/* Tags */}
              {validPost.tags && validPost.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t">
                  <h3 className="text-lg font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {validPost.tags.map((pt) => (
                      <Badge key={pt.tag.id} variant="secondary">
                        {pt.tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">Share this post</h3>
                <ShareButtons url={shareUrl} title={validPost.title} />
              </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl font-bold mb-8">Related Posts</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedPosts.slice(0, 4).map((relatedPost) => {
                    const RelatedIcon = postTypeIcons[relatedPost.type as keyof typeof postTypeIcons];
                    return (
                      <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <Badge
                            variant="secondary"
                            className={`${postTypeColors[relatedPost.type as keyof typeof postTypeColors]} mb-3`}
                          >
                            <RelatedIcon className="h-3 w-3 mr-1" />
                            {relatedPost.type}
                          </Badge>
                          <h3 className="text-xl font-bold mb-2">
                            <Link
                              href={`/news/${relatedPost.slug}`}
                              className="hover:text-primary transition-colors"
                            >
                              {relatedPost.title}
                            </Link>
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                            {relatedPost.excerpt}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {relatedPost.publishedAt &&
                              formatDistanceToNow(new Date(relatedPost.publishedAt), {
                                addSuffix: true,
                              })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Author */}
              {validPost.author && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">About the Author</h3>
                    <div className="flex items-start gap-3">
                      {validPost.author.image && (
                        <Image
                          src={validPost.author.image}
                          alt={validPost.author.name || "Author"}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium">{validPost.author.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Content Writer & Developer
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Table of Contents */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Table of Contents</h3>
                  <nav className="space-y-2 text-sm">
                    {/* This would be dynamically generated from headings */}
                    <p className="text-muted-foreground">
                      Scroll to navigate through the article
                    </p>
                  </nav>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-primary/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Stay Updated</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get the latest news and updates from DvTools
                  </p>
                  <Button className="w-full" asChild>
                    <Link href="/news">View All Posts</Link>
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
