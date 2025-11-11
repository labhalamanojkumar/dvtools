import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const featured = searchParams.get("featured") === "true";
    const tag = searchParams.get("tag");
    const offset = parseInt(searchParams.get("offset") || "0");

    const skip = offset || (page - 1) * limit;

    const where: any = {
      status: "PUBLISHED",
      type: "BLOG",
    };

    if (featured) {
      where.featured = true;
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            slug: tag,
          },
        },
      };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
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
        orderBy: [
          { featured: "desc" },
          { publishedAt: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      total,
      hasMore: skip + limit < total,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
