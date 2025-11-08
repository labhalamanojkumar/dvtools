'use client';

import { useState } from 'react';
import { Share2, Twitter, Linkedin, Link as LinkIcon, Facebook, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialSharingProps {
  title: string;
  url: string;
  description?: string;
  className?: string;
}

export function SocialSharing({ title, url, description, className = '' }: SocialSharingProps) {
  const [copied, setCopied] = useState(false);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground mr-2">Share:</span>
      
      {/* Twitter */}
      <Button
        variant="outline"
        size="sm"
        asChild
        className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
      >
        <a
          href={shareUrls.twitter}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Twitter"
        >
          <Twitter className="h-4 w-4 text-blue-500" />
        </a>
      </Button>

      {/* LinkedIn */}
      <Button
        variant="outline"
        size="sm"
        asChild
        className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
      >
        <a
          href={shareUrls.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4 text-blue-600" />
        </a>
      </Button>

      {/* Facebook */}
      <Button
        variant="outline"
        size="sm"
        asChild
        className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
      >
        <a
          href={shareUrls.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-4 w-4 text-blue-700" />
        </a>
      </Button>

      {/* Copy Link */}
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="h-8 w-8 p-0 hover:bg-gray-50"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <LinkIcon className="h-4 w-4" />
        )}
      </Button>

      {/* Native Web Share API for mobile */}
      {typeof navigator !== 'undefined' && navigator.share && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.share({
              title,
              text: description || title,
              url,
            });
          }}
          className="h-8 w-8 p-0 md:hidden"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}