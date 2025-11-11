"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BlogEditor from "@/components/admin/blog-editor";
import { toast } from "sonner";

export default function NewPostPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleSave = async (postData: any) => {
    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        toast.success('Post created successfully');
        router.push('/admin/posts');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create post');
        throw new Error(error.error || 'Failed to create post');
      }
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    router.push('/admin/posts');
  };

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
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground mt-2">
          Write and publish blog posts, news articles, tutorials, and more.
        </p>
      </div>

      <BlogEditor
        isOpen={isOpen}
        onClose={handleClose}
        onSave={handleSave}
        mode="create"
      />
    </div>
  );
}
