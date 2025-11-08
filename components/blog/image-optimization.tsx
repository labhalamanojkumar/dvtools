'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'empty' | 'blur';
  blurDataURL?: string;
  fill?: boolean;
  sizes?: string;
  // Note: onLoad and onError are handled internally and not exposed via props
  // to avoid serialization issues with MDX
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  fill = false,
  sizes,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    // Call onLoad if provided (internally)
  };

  const handleError = () => {
    setError(true);
    // Call onError if provided (internally)
  };

  // Generate blur placeholder if not provided
  const defaultBlurDataURL = blurDataURL || `data:image/svg+xml;base64,${btoa(`
    <svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial" font-size="14">
        Loading...
      </text>
    </svg>
  `)}`;

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden',
        fill ? 'h-full w-full' : '',
        className
      )}
      {...props}
    >
      {error ? (
        // Fallback for broken images
        <div className="flex items-center justify-center bg-muted text-muted-foreground">
          <div className="text-center p-4">
            <svg
              className="w-12 h-12 mx-auto mb-2 opacity-50"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      ) : (
        <>
          {/* Loading placeholder */}
          {!isLoaded && (
            <div
              className={cn(
                'absolute inset-0 bg-muted animate-pulse flex items-center justify-center',
                fill ? 'h-full w-full' : ''
              )}
            >
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-muted-foreground/20 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-muted-foreground/20 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-4 h-4 bg-muted-foreground/20 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}

          {/* Actual image */}
          {isInView && (
            <Image
              src={src}
              alt={alt}
              width={fill ? undefined : width}
              height={fill ? undefined : height}
              className={cn(
                'transition-opacity duration-300',
                isLoaded ? 'opacity-100' : 'opacity-0',
                fill ? 'object-cover' : '',
                className
              )}
              priority={priority}
              quality={quality}
              placeholder={placeholder}
              blurDataURL={placeholder === 'blur' ? defaultBlurDataURL : undefined}
              fill={fill}
              sizes={sizes}
              onLoad={handleLoad}
              onError={handleError}
            />
          )}
        </>
      )}
    </div>
  );
}

// Blog post hero image component
interface BlogHeroImageProps {
  src: string;
  alt: string;
  title: string;
  className?: string;
}

export function BlogHeroImage({ src, alt, title, className }: BlogHeroImageProps) {
  return (
    <div className={cn('relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden', className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        quality={85}
        priority
        placeholder="blur"
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      />
      {/* Overlay for better text readability if needed */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}

// Blog card image component
interface BlogCardImageProps {
  src: string;
  alt: string;
  title: string;
  className?: string;
}

export function BlogCardImage({ src, alt, title, className }: BlogCardImageProps) {
  return (
    <div className={cn('relative h-48 rounded-lg overflow-hidden', className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        quality={75}
        placeholder="blur"
        className="object-cover transition-transform duration-300 hover:scale-105"
        sizes="(max-width: 768px) 100vw, 300px"
      />
    </div>
  );
}