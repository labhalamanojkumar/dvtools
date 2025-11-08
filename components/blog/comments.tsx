'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ThumbsUp, Reply, User, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
}

interface CommentsProps {
  postSlug: string;
  className?: string;
}

export function BlogComments({ postSlug, className = '' }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [newComment, setNewComment] = useState({ name: '', email: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/comments/${postSlug}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setError('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.content.trim() || !newComment.name.trim()) {
      setError('Name and content are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/comments/${postSlug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newComment,
          parentId: replyTo,
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        if (replyTo) {
          // Add reply to existing comment
          setComments(prevComments => 
            prevComments.map(comment => 
              comment.id === replyTo 
                ? { 
                    ...comment, 
                    replies: [...(comment.replies || []), newCommentData] 
                  }
                : comment
            )
          );
        } else {
          // Add new top-level comment
          setComments(prevComments => [newCommentData, ...prevComments]);
        }
        
        setNewComment({ name: '', email: '', content: '' });
        setShowCommentForm(false);
        setReplyTo(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${postSlug}/${commentId}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const { likes, isLiked } = await response.json();
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === commentId
              ? { ...comment, likes, likedBy: isLiked ? [...comment.likedBy, 'anonymous'] : comment.likedBy.filter(id => id !== 'anonymous') }
              : comment
          )
        );
      }
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-8 border-l-2 border-muted pl-4' : ''}`}>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {comment.author.avatar ? (
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm">{comment.author.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
                {comment.updatedAt !== comment.createdAt && (
                  <Badge variant="outline" className="text-xs">
                    Edited
                  </Badge>
                )}
              </div>
              
              <div className="prose prose-sm max-w-none mb-3">
                <p className="whitespace-pre-wrap">{comment.content}</p>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLikeComment(comment.id)}
                  className={`h-8 px-2 ${comment.likedBy.includes('anonymous') ? 'text-primary' : ''}`}
                >
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  {comment.likes}
                </Button>
                
                {!isReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyTo(comment.id)}
                    className="h-8 px-2"
                  >
                    <Reply className="w-3 h-3 mr-1" />
                    Reply
                  </Button>
                )}
              </div>
              
              {replyTo === comment.id && (
                <form onSubmit={handleSubmitComment} className="mt-4 space-y-3">
                  <Input
                    placeholder="Your name"
                    value={newComment.name}
                    onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Your email (optional)"
                    value={newComment.email}
                    onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                  />
                  <Textarea
                    placeholder="Write your reply..."
                    value={newComment.content}
                    onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                    rows={3}
                    required
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting} size="sm">
                      {isSubmitting ? 'Posting...' : 'Post Reply'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setReplyTo(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
    </div>
  );

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Comments ({comments.length})
            </CardTitle>
            <Button
              onClick={() => setShowCommentForm(!showCommentForm)}
              size="sm"
            >
              {showCommentForm ? 'Cancel' : 'Add Comment'}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          {showCommentForm && (
            <Card className="border-dashed">
              <CardContent className="p-4">
                <form onSubmit={handleSubmitComment} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Your name"
                      value={newComment.name}
                      onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Your email (optional)"
                      value={newComment.email}
                      onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                    />
                  </div>
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={newComment.content}
                    onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                    rows={4}
                    required
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCommentForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading comments...</p>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map(comment => renderComment(comment))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}