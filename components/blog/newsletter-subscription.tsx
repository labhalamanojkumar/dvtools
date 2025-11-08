'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NewsletterSubscriptionProps {
  className?: string;
  variant?: 'inline' | 'card';
}

export function NewsletterSubscription({ 
  className = '', 
  variant = 'card' 
}: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      // Simulate API call - replace with actual newsletter subscription logic
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'blog-post',
          tags: ['developer-tools', 'best-practices'],
        }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Successfully subscribed! Check your email for confirmation.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage('Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'inline') {
    return (
      <div className={`bg-muted/30 rounded-lg p-4 ${className}`}>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Get the latest developer tools and best practices delivered to your inbox.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 min-w-0 sm:min-w-[300px]">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" disabled={isSubmitting} size="sm">
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        </div>
        {status !== 'idle' && (
          <div className={`flex items-center gap-2 mt-2 text-sm ${
            status === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {status === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={`border-border/50 ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Stay Updated</CardTitle>
          <Badge variant="secondary">Free</Badge>
        </div>
        <CardDescription>
          Join our newsletter to receive the latest developer tools, tutorials, and best practices.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
          </Button>
        </form>

        {status !== 'idle' && (
          <div className={`flex items-center gap-2 text-sm ${
            status === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {status === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {message}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>✓ Weekly newsletter with curated content</p>
          <p>✓ No spam, unsubscribe anytime</p>
          <p>✓ Exclusive access to new tools and features</p>
        </div>
      </CardContent>
    </Card>
  );
}