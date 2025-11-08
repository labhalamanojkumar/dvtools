import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Globe, Twitter, Linkedin, Github } from 'lucide-react';

interface Author {
  name: string;
  avatar: string;
  bio?: string;
  role?: string;
  email?: string;
  website?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

interface AuthorCardProps {
  author: Author;
  publishedAt?: string;
  readTime?: number;
  className?: string;
}

export function AuthorCard({ 
  author, 
  publishedAt, 
  readTime, 
  className = '' 
}: AuthorCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatUrl = (url: string) => {
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <Card className={`border border-border/50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Author Avatar */}
          <div className="flex-shrink-0">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={`${author.name} avatar`}
                className="w-16 h-16 rounded-full object-cover border-2 border-border"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                        <span class="text-lg font-semibold text-muted-foreground">
                          ${author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                    `;
                  }
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                <span className="text-lg font-semibold text-muted-foreground">
                  {author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold">{author.name}</h3>
                {author.role && (
                  <p className="text-sm text-muted-foreground">{author.role}</p>
                )}
                {author.bio && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {author.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Metadata */}
            {(publishedAt || readTime) && (
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-3">
                {publishedAt && (
                  <span>Published: {formatDate(publishedAt)}</span>
                )}
                {readTime && <span>{readTime} min read</span>}
              </div>
            )}

            {/* Social Links & Contact */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {/* Email */}
              {author.email && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 px-2"
                >
                  <a href={`mailto:${author.email}`}>
                    <Mail className="w-3 h-3 mr-1" />
                    <span className="text-xs">Email</span>
                  </a>
                </Button>
              )}

              {/* Website */}
              {author.website && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 px-2"
                >
                  <a href={formatUrl(author.website)} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-3 h-3 mr-1" />
                    <span className="text-xs">Website</span>
                  </a>
                </Button>
              )}

              {/* Twitter */}
              {author.social?.twitter && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
                >
                  <a 
                    href={`https://twitter.com/${author.social.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow ${author.name} on Twitter`}
                  >
                    <Twitter className="w-3 h-3 text-blue-500" />
                  </a>
                </Button>
              )}

              {/* LinkedIn */}
              {author.social?.linkedin && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
                >
                  <a 
                    href={formatUrl(author.social.linkedin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Connect with ${author.name} on LinkedIn`}
                  >
                    <Linkedin className="w-3 h-3 text-blue-600" />
                  </a>
                </Button>
              )}

              {/* GitHub */}
              {author.social?.github && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 w-8 p-0 hover:bg-gray-50"
                >
                  <a 
                    href={`https://github.com/${author.social.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${author.name}'s GitHub profile`}
                  >
                    <Github className="w-3 h-3" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}