import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schemas
const createApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
});

const updateApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
});

// Generate a secure API key
function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'key_';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// GET /api/api-keys - Get all API keys for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId: session.user.id,
        revokedAt: null, // Only return non-revoked keys
      },
      select: {
        id: true,
        name: true,
        key: true,
        lastUsedAt: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Mask the API keys for security
    const maskedKeys = apiKeys.map((apiKey: any) => ({
      ...apiKey,
      key: maskApiKey(apiKey.key),
    }));

    return NextResponse.json({ apiKeys: maskedKeys });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/api-keys - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name } = createApiKeySchema.parse(body);

    // Check if user already has too many API keys (limit to 10)
    const existingKeysCount = await prisma.apiKey.count({
      where: {
        userId: session.user.id,
        revokedAt: null,
      },
    });

    if (existingKeysCount >= 10) {
      return NextResponse.json({ error: 'Maximum number of API keys reached' }, { status: 400 });
    }

    // Generate a unique API key
    let apiKey: string;
    let attempts = 0;
    do {
      apiKey = generateApiKey();
      attempts++;
      if (attempts > 10) {
        return NextResponse.json({ error: 'Failed to generate unique API key' }, { status: 500 });
      }
    } while (await prisma.apiKey.findUnique({ where: { key: apiKey } }));

    const newApiKey = await prisma.apiKey.create({
      data: {
        userId: session.user.id,
        name,
        key: apiKey,
      },
      select: {
        id: true,
        name: true,
        key: true,
        createdAt: true,
      },
    });

    // Log the API key creation
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'API_KEY_CREATED',
        resource: 'api_key',
        resourceId: newApiKey.id,
        details: { name: newApiKey.name },
      },
    });

    return NextResponse.json({
      apiKey: newApiKey,
      message: 'API key created successfully. Make sure to copy it now as it won\'t be shown again.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    console.error('Error creating API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/api-keys/[id] - Update an API key
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'API key ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { name } = updateApiKeySchema.parse(body);

    // Check if the API key belongs to the user
    const existingKey = await prisma.apiKey.findFirst({
      where: {
        id,
        userId: session.user.id,
        revokedAt: null,
      },
    });

    if (!existingKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    const updatedKey = await prisma.apiKey.update({
      where: { id },
      data: { name },
      select: {
        id: true,
        name: true,
        key: true,
        lastUsedAt: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    return NextResponse.json({ apiKey: { ...updatedKey, key: maskApiKey(updatedKey.key) } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    console.error('Error updating API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/api-keys/[id] - Revoke an API key
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'API key ID is required' }, { status: 400 });
    }

    // Check if the API key belongs to the user
    const existingKey = await prisma.apiKey.findFirst({
      where: {
        id,
        userId: session.user.id,
        revokedAt: null,
      },
    });

    if (!existingKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    // Revoke the API key
    await prisma.apiKey.update({
      where: { id },
      data: { revokedAt: new Date() },
    });

    // Log the API key revocation
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'API_KEY_REVOKED',
        resource: 'api_key',
        resourceId: id,
        details: { name: existingKey.name },
      },
    });

    return NextResponse.json({ message: 'API key revoked successfully' });
  } catch (error) {
    console.error('Error revoking API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to mask API keys
function maskApiKey(key: string): string {
  if (key.length <= 16) return key;
  return `${key.substring(0, 8)}${'•'.repeat(key.length - 16)}${key.substring(key.length - 8)}`;
}