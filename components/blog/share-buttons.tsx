'use client';

import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" asChild>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin className="h-4 w-4 mr-2" />
          LinkedIn
        </a>
      </Button>
      <Button variant="outline" size="sm" onClick={handleCopyLink}>
        <LinkIcon className="h-4 w-4 mr-2" />
        Copy Link
      </Button>
    </div>
  );
}
