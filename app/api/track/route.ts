import { NextRequest, NextResponse } from 'next/server';

// In a real app, this would store data in a database
// For now, we'll just log the usage
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tool, action, userAgent, timestamp } = body;

    // Validate required fields
    if (!tool || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: tool and action' },
        { status: 400 }
      );
    }

    // Log the usage (in a real app, save to database)
    console.log('Tool usage tracked:', {
      tool,
      action,
      userAgent: userAgent || request.headers.get('user-agent'),
      timestamp: timestamp || new Date().toISOString(),
      ip: request.ip || 'unknown',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking usage:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve usage statistics
export async function GET() {
  // Mock data - in a real app, this would query the database
  const stats = {
    totalUses: 45678,
    tools: {
      'json-formatter': 1234,
      'base64': 987,
      'jwt-decoder': 756,
      'code-beautifier': 654,
      'url-encoder': 543,
      'regexp-tester': 432,
    },
    recentActivity: [
      {
        tool: 'JSON Formatter',
        action: 'Formatted JSON data',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      },
      {
        tool: 'Base64 Encoder',
        action: 'Encoded file to Base64',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
    ],
  };

  return NextResponse.json(stats);
}