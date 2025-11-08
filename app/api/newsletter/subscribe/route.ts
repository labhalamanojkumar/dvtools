import { NextRequest, NextResponse } from "next/server";

interface NewsletterSubscription {
  email: string;
  source: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const body: NewsletterSubscription = await request.json();
    const { email, source, tags = [], metadata = {} } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check for existing subscription (in a real app, this would check your database)
    // For demo purposes, we'll simulate checking
    const existingSubscriptions = new Set<string>(); // This would be replaced with actual database check
    if (existingSubscriptions.has(email.toLowerCase())) {
      return NextResponse.json(
        { message: 'Email already subscribed' },
        { status: 200 }
      );
    }

    // Store subscription (in a real app, this would store in your database)
    existingSubscriptions.add(email.toLowerCase());

    // Simulate sending confirmation email
    console.log('Newsletter subscription:', {
      email,
      source,
      tags,
      metadata,
      timestamp: new Date().toISOString()
    });

    // In a real implementation, you might want to:
    // 1. Store in database
    // 2. Send confirmation email
    // 3. Add to email marketing service (Mailchimp, ConvertKit, etc.)
    // 4. Log analytics

    return NextResponse.json({
      message: 'Successfully subscribed to newsletter',
      email: email.toLowerCase(),
      tags,
      source
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Optional: Endpoint to check subscription status
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter required' },
      { status: 400 }
    );
  }

  // In a real implementation, check database
  const isSubscribed = false; // This would be replaced with actual database check

  return NextResponse.json({
    email,
    subscribed: isSubscribed
  });
}