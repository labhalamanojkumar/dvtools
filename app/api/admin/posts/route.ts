import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "SUPERADMIN" && session.user.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (type && type !== "all") {
      where.type = type;
    }
    if (status && status !== "all") {
      where.status = status;
    }

    // Fetch posts from database
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
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
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "SUPERADMIN" && session.user.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Use transaction to ensure atomicity
    const post = await prisma.$transaction(async (tx) => {
      // First, create the post without relations
      const newPost = await tx.post.create({
        data: {
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt,
          type: data.type || "BLOG",
          status: data.status || "DRAFT",
          publishedAt: data.status === "PUBLISHED" ? new Date() : null,
          authorId: session.user.id,
          metaTitle: data.metaTitle || data.title,
          metaDescription: data.metaDescription || data.excerpt,
        },
      });

      // Handle categories
      if (data.categories && data.categories.length > 0) {
        for (const categoryName of data.categories) {
          // Find or create category
          const category = await tx.category.upsert({
            where: { name: categoryName },
            update: {},
            create: {
              name: categoryName,
              slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
            },
          });

          // Create PostCategory junction
          await tx.postCategory.create({
            data: {
              postId: newPost.id,
              categoryId: category.id,
            },
          });
        }
      }

      // Handle tags
      if (data.tags && data.tags.length > 0) {
        for (const tagName of data.tags) {
          // Find or create tag
          const tag = await tx.tag.upsert({
            where: { name: tagName },
            update: { useCount: { increment: 1 } },
            create: {
              name: tagName,
              slug: tagName.toLowerCase().replace(/\s+/g, '-'),
              useCount: 1,
            },
          });

          // Create PostTag junction
          await tx.postTag.create({
            data: {
              postId: newPost.id,
              tagId: tag.id,
            },
          });
        }
      }

      // Fetch the complete post with relations
      return await tx.post.findUnique({
        where: { id: newPost.id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
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
      });
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
