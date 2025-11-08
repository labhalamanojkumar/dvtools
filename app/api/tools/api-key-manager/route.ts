import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface APIKey {
  id: string;
  name: string;
  keyHash: string;
  prefix: string;
  quotaLimit: number;
  quotaPeriod: "daily" | "weekly" | "monthly";
  usageCount: number;
  status: "active" | "revoked" | "expired";
  createdAt: string;
  expiresAt?: string;
  metadata?: Record<string, string>;
}

const apiKeys = new Map<string, APIKey>();

function generateAPIKey(prefix: string = "sk"): string {
  const randomPart = crypto.randomBytes(24).toString("base64").replace(/[+/=]/g, "").substring(0, 32);
  return `${prefix}_${randomPart}`;
}

function hashAPIKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "create") {
      const { name, prefix = "sk", quotaLimit = 1000, quotaPeriod = "daily", expirationDays } = body;

      if (!name) {
        return NextResponse.json(
          { error: "Key name is required" },
          { status: 400 }
        );
      }

      // server-side validation: enforce maximum quotas per period
      const maxPerPeriod: Record<string, number> = {
        daily: 100,
        weekly: 700,
        monthly: 3000,
      };

      const parsedQuota = Number(quotaLimit || 0);
      const maxAllowed = maxPerPeriod[quotaPeriod] ?? 0;
      if (parsedQuota < 0 || parsedQuota > maxAllowed) {
        return NextResponse.json(
          { error: `Quota limit for ${quotaPeriod} must be between 0 and ${maxAllowed}` },
          { status: 400 }
        );
      }

      const apiKey = generateAPIKey(prefix);
      const keyHash = hashAPIKey(apiKey);

      const expiresAt = expirationDays 
        ? new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000).toISOString()
        : undefined;

      const keyData: APIKey = {
        id: crypto.randomBytes(16).toString("hex"),
        name,
        keyHash,
        prefix,
        quotaLimit,
        quotaPeriod,
        usageCount: 0,
        status: "active",
        createdAt: new Date().toISOString(),
        expiresAt
      };

      apiKeys.set(keyData.id, keyData);

      return NextResponse.json({
        success: true,
        keyId: keyData.id,
        key: apiKey, // Only returned once during creation
        expiresAt
      });
    }

    if (action === "validate") {
      const { apiKey } = body;

      if (!apiKey) {
        return NextResponse.json(
          { error: "API key is required" },
          { status: 400 }
        );
      }

      const keyHash = hashAPIKey(apiKey);
      let foundKey: APIKey | null = null;

      for (const key of apiKeys.values()) {
        if (key.keyHash === keyHash) {
          foundKey = key;
          break;
        }
      }

      if (!foundKey) {
        return NextResponse.json(
          { valid: false, error: "Invalid API key" },
          { status: 401 }
        );
      }

      if (foundKey.status === "revoked") {
        return NextResponse.json(
          { valid: false, error: "API key has been revoked" },
          { status: 401 }
        );
      }

      if (foundKey.expiresAt && new Date(foundKey.expiresAt) < new Date()) {
        foundKey.status = "expired";
        return NextResponse.json(
          { valid: false, error: "API key has expired" },
          { status: 401 }
        );
      }

      if (foundKey.usageCount >= foundKey.quotaLimit) {
        return NextResponse.json(
          { valid: false, error: "Quota limit exceeded" },
          { status: 429 }
        );
      }

      // Increment usage
      foundKey.usageCount++;

      return NextResponse.json({
        valid: true,
        keyId: foundKey.id,
        usageCount: foundKey.usageCount,
        quotaLimit: foundKey.quotaLimit,
        quotaPeriod: foundKey.quotaPeriod
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("API Key Manager POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const keys = Array.from(apiKeys.values()).map(key => ({
      id: key.id,
      name: key.name,
      prefix: key.prefix,
      quotaLimit: key.quotaLimit,
      quotaPeriod: key.quotaPeriod,
      usageCount: key.usageCount,
      status: key.status,
      createdAt: key.createdAt,
      expiresAt: key.expiresAt,
      metadata: key.metadata
    }));

    return NextResponse.json({
      success: true,
      keys
    });
  } catch (error) {
    console.error("API Key Manager GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyId } = body;

    if (!keyId) {
      return NextResponse.json(
        { error: "Key ID is required" },
        { status: 400 }
      );
    }

    const key = apiKeys.get(keyId);
    if (!key) {
      return NextResponse.json(
        { error: "API key not found" },
        { status: 404 }
      );
    }

    key.status = "revoked";

    return NextResponse.json({
      success: true,
      message: "API key revoked"
    });
  } catch (error) {
    console.error("API Key Manager DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
