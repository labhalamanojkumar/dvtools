"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import BlogEditor from "@/components/admin/blog-editor";
import { toast } from "sonner";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = (params?.id as string) || '';
  
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId]);

  const loadPost = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        toast.error("Failed to load post");
        router.push('/admin/posts');
      }
    } catch (error) {
      console.error("Error loading post:", error);
      toast.error("Error loading post");
      router.push('/admin/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (postData: any) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        toast.success('Post updated successfully');
        router.push('/admin/posts');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update post');
        throw new Error(error.error || 'Failed to update post');
      }
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    router.push('/admin/posts');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading post...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Post not found</p>
          <Button
            onClick={() => router.push('/admin/posts')}
            className="mt-4"
          >
            Back to Posts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/posts')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Posts
        </Button>
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <p className="text-muted-foreground mt-2">
          Update your post content, settings, and metadata.
        </p>
      </div>

      <BlogEditor
        isOpen={isOpen}
        onClose={handleClose}
        onSave={handleSave}
        initialData={post}
        mode="edit"
      />
    </div>
  );
}
