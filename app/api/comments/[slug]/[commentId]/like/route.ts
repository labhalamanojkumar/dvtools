import { NextRequest, NextResponse } from "next/server";

// This would be imported from the main comments route file in a real implementation
// For simplicity, I'm duplicating the types and storage logic

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

// Mock user identifier - in a real app, this would come from authentication
function getCurrentUserId(): string {
  // This could be from cookies, session, or authentication token
  return 'anonymous';
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string; commentId: string } }
) {
  try {
    const postSlug = params.slug;
    const commentId = params.commentId;
    const userId = getCurrentUserId();

    const comments = commentsStore.get(postSlug) || [];
    let targetComment: Comment | undefined;
    let parentArray: Comment[] | undefined;

    // Find the comment (could be a top-level comment or a reply)
    targetComment = comments.find(comment => comment.id === commentId);
    
    if (!targetComment) {
      // Check if it's a reply
      for (const comment of comments) {
        if (comment.replies) {
          const reply = comment.replies.find(reply => reply.id === commentId);
          if (reply) {
            targetComment = reply;
            parentArray = comment.replies;
            break;
          }
        }
      }
    }

    if (!targetComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    const isCurrentlyLiked = targetComment.likedBy.includes(userId);
    
    if (isCurrentlyLiked) {
      // Remove like
      targetComment.likes = Math.max(0, targetComment.likes - 1);
      targetComment.likedBy = targetComment.likedBy.filter(id => id !== userId);
    } else {
      // Add like
      targetComment.likes += 1;
      targetComment.likedBy.push(userId);
    }

    // Update the store
    if (parentArray) {
      // This was a reply, update in the parent array
      const parentCommentIndex = comments.findIndex(comment => 
        comment.replies?.some(reply => reply.id === commentId)
      );
      if (parentCommentIndex !== -1) {
        const parentComment = comments[parentCommentIndex];
        const replyIndex = parentComment.replies!.findIndex(reply => reply.id === commentId);
        if (replyIndex !== -1) {
          parentComment.replies![replyIndex] = targetComment;
        }
      }
    } else {
      // This was a top-level comment
      const commentIndex = comments.findIndex(comment => comment.id === commentId);
      if (commentIndex !== -1) {
        comments[commentIndex] = targetComment;
      }
    }

    commentsStore.set(postSlug, comments);

    return NextResponse.json({
      likes: targetComment.likes,
      isLiked: !isCurrentlyLiked,
      message: isCurrentlyLiked ? 'Like removed' : 'Comment liked',
    });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; commentId: string } }
) {
  try {
    const postSlug = params.slug;
    const commentId = params.commentId;
    const userId = getCurrentUserId();

    const comments = commentsStore.get(postSlug) || [];
    let targetComment: Comment | undefined;

    // Find the comment
    targetComment = comments.find(comment => comment.id === commentId);
    
    if (!targetComment) {
      // Check if it's a reply
      for (const comment of comments) {
        if (comment.replies) {
          const reply = comment.replies.find(reply => reply.id === commentId);
          if (reply) {
            targetComment = reply;
            break;
          }
        }
      }
    }

    if (!targetComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    const isLiked = targetComment.likedBy.includes(userId);

    return NextResponse.json({
      likes: targetComment.likes,
      isLiked,
    });
  } catch (error) {
    console.error('Error fetching comment like status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch like status' },
      { status: 500 }
    );
  }
}