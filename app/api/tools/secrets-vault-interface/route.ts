import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Redis from "ioredis";

interface VaultConfig {
  encryptionKey: string;
  storageType: "redis";
  redisConfig: {
    host: string;
    port: number;
    password?: string;
    db?: number;
    tls?: boolean;
  };
}

interface Secret {
  id: string;
  name: string;
  value: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  accessCount: number;
  lastAccessed?: string;
}

interface VaultRequest {
  config: VaultConfig;
  action: "list_secrets" | "get_secret" | "create_secret" | "update_secret" | "delete_secret" | "search_secrets" | "export_secrets" | "import_secrets";
  secretId?: string;
  secret?: Partial<Secret>;
  searchQuery?: string;
  tags?: string[];
  exportData?: any[];
}

interface VaultResponse {
  success: boolean;
  secrets?: Secret[];
  secret?: Secret;
  message?: string;
  error?: string;
}

// Redis connection management
const redisConnections = new Map<string, Redis>();
let vaultConfig: VaultConfig | null = null;

function getRedisKey(config: VaultConfig['redisConfig']): string {
  return `${config.host}:${config.port}:${config.db || 0}`;
}

async function getRedisClient(config: VaultConfig['redisConfig']): Promise<Redis> {
  const key = getRedisKey(config);

  if (redisConnections.has(key)) {
    const client = redisConnections.get(key)!;
    try {
      await client.ping();
      return client;
    } catch (error) {
      redisConnections.delete(key);
    }
  }

  const client = new Redis({
    host: config.host,
    port: config.port,
    password: config.password,
    db: config.db || 0,
    tls: config.tls ? {} : undefined,
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    connectTimeout: 10000,
  });

  try {
    await client.connect();
    redisConnections.set(key, client);
    return client;
  } catch (error: any) {
    throw new Error(`Failed to connect to Redis: ${error.message}`);
  }
}

async function disconnectRedis(config: VaultConfig['redisConfig']): Promise<void> {
  const key = getRedisKey(config);
  const client = redisConnections.get(key);
  if (client) {
    await client.disconnect();
    redisConnections.delete(key);
  }
}

// Encryption utilities
function encrypt(text: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key, "hex"), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(encryptedText: string, key: string): string {
  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key, "hex"), iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function generateSecretId(): string {
  return crypto.randomBytes(16).toString("hex");
}

function validateEncryptionKey(key: string): boolean {
  return /^[a-fA-F0-9]{64}$/.test(key); // 256-bit key in hex
}

function isSecretExpired(secret: Secret): boolean {
  if (!secret.expiresAt) return false;
  return new Date(secret.expiresAt) < new Date();
}

export async function POST(request: NextRequest) {
  try {
    const body: VaultRequest = await request.json();
    const { config, action } = body;

    // Validate encryption key
    if (!validateEncryptionKey(config.encryptionKey)) {
      return NextResponse.json(
        { error: "Invalid encryption key format. Must be 64-character hexadecimal string." },
        { status: 400 }
      );
    }

    vaultConfig = config;

    switch (action) {
      case "list_secrets":
        return await listSecrets();

      case "get_secret":
        return await getSecret(body.secretId!);

      case "create_secret":
        return await createSecret(body.secret!);

      case "update_secret":
        return await updateSecret(body.secretId!, body.secret!);

      case "delete_secret":
        return await deleteSecret(body.secretId!);

      case "search_secrets":
        return await searchSecrets(body.searchQuery, body.tags);

      case "export_secrets":
        return await exportSecrets();

      case "import_secrets":
        return await importSecrets(body.exportData!);

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error("Secrets Vault error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

async function listSecrets(): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(vaultConfig!.redisConfig);

    // Get all secret keys
    const secretKeys = await client.keys("secrets:*");
    const secrets: Secret[] = [];

    for (const key of secretKeys) {
      const secretData = await client.get(key);
      if (secretData) {
        const secret: Secret = JSON.parse(secretData);
        if (!isSecretExpired(secret)) {
          secrets.push({
            ...secret,
            value: "[ENCRYPTED]", // Don't expose actual values in list
          });
        }
      }
    }

    // Sort by updatedAt descending
    secrets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return NextResponse.json({
      success: true,
      secrets,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to list secrets: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(vaultConfig!.redisConfig);
    }
  }
}

async function getSecret(secretId: string): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(vaultConfig!.redisConfig);

    const secretData = await client.get(`secrets:${secretId}`);
    if (!secretData) {
      return NextResponse.json(
        { error: "Secret not found" },
        { status: 404 }
      );
    }

    const secret: Secret = JSON.parse(secretData);

    if (isSecretExpired(secret)) {
      return NextResponse.json(
        { error: "Secret has expired" },
        { status: 410 }
      );
    }

    // Decrypt the value
    const decryptedValue = decrypt(secret.value, vaultConfig!.encryptionKey);

    // Update access tracking
    secret.accessCount++;
    secret.lastAccessed = new Date().toISOString();
    await client.set(`secrets:${secretId}`, JSON.stringify(secret));

    return NextResponse.json({
      success: true,
      secret: {
        ...secret,
        value: decryptedValue,
      },
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to get secret: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(vaultConfig!.redisConfig);
    }
  }
}

async function createSecret(secretData: Partial<Secret>): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(vaultConfig!.redisConfig);

    if (!secretData.name || !secretData.value) {
      return NextResponse.json(
        { error: "Secret name and value are required" },
        { status: 400 }
      );
    }

    // Check for duplicate names - get all secrets and check
    const secretKeys = await client.keys("secrets:*");
    for (const key of secretKeys) {
      const secretDataStr = await client.get(key);
      if (secretDataStr) {
        const existingSecret: Secret = JSON.parse(secretDataStr);
        if (existingSecret.name.toLowerCase() === secretData.name!.toLowerCase()) {
          return NextResponse.json(
            { error: "A secret with this name already exists" },
            { status: 409 }
          );
        }
      }
    }

    const now = new Date().toISOString();
    const secretId = generateSecretId();

    // Encrypt the value
    const encryptedValue = encrypt(secretData.value, vaultConfig!.encryptionKey);

    const newSecret: Secret = {
      id: secretId,
      name: secretData.name,
      value: encryptedValue,
      description: secretData.description || "",
      tags: secretData.tags || [],
      createdAt: now,
      updatedAt: now,
      expiresAt: secretData.expiresAt,
      accessCount: 0,
    };

    await client.set(`secrets:${secretId}`, JSON.stringify(newSecret));

    return NextResponse.json({
      success: true,
      secret: {
        ...newSecret,
        value: "[ENCRYPTED]", // Don't expose the actual value
      },
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to create secret: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(vaultConfig!.redisConfig);
    }
  }
}

async function updateSecret(secretId: string, updates: Partial<Secret>): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(vaultConfig!.redisConfig);

    const secretData = await client.get(`secrets:${secretId}`);
    if (!secretData) {
      return NextResponse.json(
        { error: "Secret not found" },
        { status: 404 }
      );
    }

    const secret: Secret = JSON.parse(secretData);

    // Check for name conflicts if name is being updated
    if (updates.name && updates.name.toLowerCase() !== secret.name.toLowerCase()) {
      const secretKeys = await client.keys("secrets:*");
      for (const key of secretKeys) {
        const existingData = await client.get(key);
        if (existingData) {
          const existingSecret: Secret = JSON.parse(existingData);
          if (existingSecret.id !== secretId && existingSecret.name.toLowerCase() === updates.name!.toLowerCase()) {
            return NextResponse.json(
              { error: "A secret with this name already exists" },
              { status: 409 }
            );
          }
        }
      }
    }

    // Encrypt new value if provided
    let encryptedValue = secret.value;
    if (updates.value) {
      encryptedValue = encrypt(updates.value, vaultConfig!.encryptionKey);
    }

    const updatedSecret: Secret = {
      ...secret,
      ...updates,
      value: encryptedValue,
      updatedAt: new Date().toISOString(),
    };

    await client.set(`secrets:${secretId}`, JSON.stringify(updatedSecret));

    return NextResponse.json({
      success: true,
      secret: {
        ...updatedSecret,
        value: "[ENCRYPTED]", // Don't expose the actual value
      },
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to update secret: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(vaultConfig!.redisConfig);
    }
  }
}

async function deleteSecret(secretId: string): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(vaultConfig!.redisConfig);

    const secretData = await client.get(`secrets:${secretId}`);
    if (!secretData) {
      return NextResponse.json(
        { error: "Secret not found" },
        { status: 404 }
      );
    }

    await client.del(`secrets:${secretId}`);

    return NextResponse.json({
      success: true,
      message: "Secret deleted successfully",
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to delete secret: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(vaultConfig!.redisConfig);
    }
  }
}

async function searchSecrets(searchQuery?: string, tags?: string[]): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(vaultConfig!.redisConfig);

    const secretKeys = await client.keys("secrets:*");
    let secrets: Secret[] = [];

    for (const key of secretKeys) {
      const secretData = await client.get(key);
      if (secretData) {
        const secret: Secret = JSON.parse(secretData);
        if (!isSecretExpired(secret)) {
          secrets.push(secret);
        }
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      secrets = secrets.filter(secret =>
        secret.name.toLowerCase().includes(query) ||
        secret.description?.toLowerCase().includes(query) ||
        secret.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by tags
    if (tags && tags.length > 0) {
      secrets = secrets.filter(secret =>
        tags.some(tag => secret.tags.includes(tag))
      );
    }

    // Return without exposing actual values
    const result = secrets.map(secret => ({
      ...secret,
      value: "[ENCRYPTED]",
    }));

    return NextResponse.json({
      success: true,
      secrets: result,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to search secrets: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(vaultConfig!.redisConfig);
    }
  }
}

async function exportSecrets(): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(vaultConfig!.redisConfig);

    const secretKeys = await client.keys("secrets:*");
    const secrets: Secret[] = [];

    for (const key of secretKeys) {
      const secretData = await client.get(key);
      if (secretData) {
        const secret: Secret = JSON.parse(secretData);
        if (!isSecretExpired(secret)) {
          secrets.push(secret);
        }
      }
    }

    return NextResponse.json({
      success: true,
      secrets,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to export secrets: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(vaultConfig!.redisConfig);
    }
  }
}

async function importSecrets(importData: any[]): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(vaultConfig!.redisConfig);

    let importedCount = 0;
    let skippedCount = 0;

    for (const item of importData) {
      try {
        // Validate the imported secret structure
        if (!item.name || !item.value) {
          skippedCount++;
          continue;
        }

        // Check for existing secret with same name
        const secretKeys = await client.keys("secrets:*");
        let nameExists = false;
        for (const key of secretKeys) {
          const existingData = await client.get(key);
          if (existingData) {
            const existingSecret: Secret = JSON.parse(existingData);
            if (existingSecret.name.toLowerCase() === item.name.toLowerCase()) {
              nameExists = true;
              break;
            }
          }
        }

        if (nameExists) {
          // Skip duplicates
          skippedCount++;
          continue;
        }

        const now = new Date().toISOString();
        const secretId = generateSecretId();

        // Ensure the value is encrypted (assume imported data is already encrypted)
        const encryptedValue = item.value;

        const newSecret: Secret = {
          id: secretId,
          name: item.name,
          value: encryptedValue,
          description: item.description || "",
          tags: item.tags || [],
          createdAt: item.createdAt || now,
          updatedAt: now,
          expiresAt: item.expiresAt,
          accessCount: item.accessCount || 0,
        };

        await client.set(`secrets:${secretId}`, JSON.stringify(newSecret));
        importedCount++;

      } catch (error) {
        console.warn(`Failed to import secret ${item.name}:`, error);
        skippedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Imported ${importedCount} secrets, skipped ${skippedCount} items`,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to import secrets: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(vaultConfig!.redisConfig);
    }
  }
}