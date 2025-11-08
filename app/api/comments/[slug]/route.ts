import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';

// Mock comments storage - in production, this would be a database
interface Comment {
  id: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  likedBy: string[];
  replies?: Comment[];
  parentId?: string;
  postSlug: string;
}

const commentsStore: Map<string, Comment[]> = new Map();

// Generate a simple hash for email-based avatars
function generateAvatarHash(email: string): string {
  return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
}

// Generate a random ID for comments
function generateId(): string {
  return crypto.randomUUID();
}

// Basic content moderation
function moderateContent(content: string): { isApproved: boolean; reason?: string } {
  const blockedWords = ['spam', 'malicious', 'inappropriate']; // Add real blocked words
  const lowerContent = content.toLowerCase();
  
  for (const word of blockedWords) {
    if (lowerContent.includes(word)) {
      return { isApproved: false, reason: 'Content contains inappropriate language' };
    }
  }
  
  return { isApproved: true };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const postSlug = params.slug;
    const comments = commentsStore.get(postSlug) || [];
    
    // Sort comments by creation date (newest first) and replies by date
    const sortedComments = comments
      .filter(comment => !comment.parentId) // Only top-level comments
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(comment => ({
        ...comment,
        replies: comments
          .filter(reply => reply.parentId === comment.id)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      }));

    return NextResponse.json({
      comments: sortedComments,
      total: sortedComments.length,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const postSlug = params.slug;
    const body = await request.json();
    const { name, email, content, parentId } = body;

    // Validate required fields
    if (!name?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      );
    }

    // Validate content length
    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment is too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    // Moderate content
    const moderationResult = moderateContent(content);
    if (!moderationResult.isApproved) {
      return NextResponse.json(
        { error: moderationResult.reason || 'Comment failed moderation' },
        { status: 400 }
      );
    }

    // Create new comment
    const newComment: Comment = {
      id: generateId(),
      author: {
        name: name.trim(),
        email: email?.trim() || '',
        avatar: email ? `https://www.gravatar.com/avatar/${generateAvatarHash(email)}?d=identicon&s=64` : undefined,
      },
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      replies: [],
      parentId: parentId || undefined,
      postSlug,
    };

    // Check if this is a reply to an existing comment
    if (parentId) {
      const postComments = commentsStore.get(postSlug) || [];
      const parentComment = postComments.find(comment => comment.id === parentId);
      
      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }

      // Add reply
      parentComment.replies = parentComment.replies || [];
      parentComment.replies.push(newComment);
      
      // Update store
      commentsStore.set(postSlug, postComments);
    } else {
      // Add new top-level comment
      const existingComments = commentsStore.get(postSlug) || [];
      existingComments.push(newComment);
      commentsStore.set(postSlug, existingComments);
    }

    // Return the new comment (without storing email for privacy)
    const responseComment = {
      ...newComment,
      author: {
        ...newComment.author,
        email: undefined, // Don't return email for privacy
      },
    };

    return NextResponse.json(responseComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove comments (for moderation)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const postSlug = params.slug;
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');

    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    const comments = commentsStore.get(postSlug) || [];
    const filteredComments = comments.filter(comment => comment.id !== commentId);

    commentsStore.set(postSlug, filteredComments);

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}

// PUT endpoint to update comments
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const postSlug = params.slug;
    const body = await request.json();
    const { id, content } = body;

    if (!id || !content?.trim()) {
      return NextResponse.json(
        { error: 'Comment ID and content are required' },
        { status: 400 }
      );
    }

    // Moderate updated content
    const moderationResult = moderateContent(content);
    if (!moderationResult.isApproved) {
      return NextResponse.json(
        { error: moderationResult.reason || 'Content failed moderation' },
        { status: 400 }
      );
    }

    const comments = commentsStore.get(postSlug) || [];
    const commentIndex = comments.findIndex(comment => comment.id === id);

    if (commentIndex === -1) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Update comment
    comments[commentIndex] = {
      ...comments[commentIndex],
      content: content.trim(),
      updatedAt: new Date().toISOString(),
    };

    commentsStore.set(postSlug, comments);

    const updatedComment = {
      ...comments[commentIndex],
      author: {
        ...comments[commentIndex].author,
        email: undefined, // Don't return email for privacy
      },
    };

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}