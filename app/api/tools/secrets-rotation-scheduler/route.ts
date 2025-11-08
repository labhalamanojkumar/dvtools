import { NextRequest, NextResponse } from "next/server";

interface Secret {
  id: string;
  name: string;
  type: "api-key" | "database" | "certificate" | "oauth-token" | "ssh-key";
  lastRotated: string;
  nextRotation: string;
  status: "healthy" | "expiring-soon" | "expired";
  rotationInterval: number;
}

interface RotationLog {
  id: string;
  secretName: string;
  action: "rotated" | "failed" | "scheduled";
  timestamp: string;
  user: string;
  details: string;
}

interface Notification {
  id: string;
  secretName: string;
  type: "expiring" | "expired" | "rotated";
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

// In-memory storage (use database in production)
const secretsStore = new Map<string, Secret>();
const logsStore: RotationLog[] = [];
const notificationsStore: Notification[] = [];

// Initialize with mock data
function initializeMockData() {
  if (secretsStore.size === 0) {
    const mockSecrets: Secret[] = [
      {
        id: "1",
        name: "production-api-key",
        type: "api-key",
        lastRotated: "2024-12-15",
        nextRotation: "2025-02-15",
        status: "healthy",
        rotationInterval: 60
      },
      {
        id: "2",
        name: "database-master-password",
        type: "database",
        lastRotated: "2024-11-01",
        nextRotation: "2025-01-30",
        status: "expiring-soon",
        rotationInterval: 90
      },
      {
        id: "3",
        name: "tls-certificate",
        type: "certificate",
        lastRotated: "2024-01-15",
        nextRotation: "2025-01-15",
        status: "expired",
        rotationInterval: 365
      },
      {
        id: "4",
        name: "oauth-client-secret",
        type: "oauth-token",
        lastRotated: "2024-12-01",
        nextRotation: "2025-03-01",
        status: "healthy",
        rotationInterval: 90
      }
    ];

    mockSecrets.forEach(secret => secretsStore.set(secret.id, secret));
  }

  if (logsStore.length === 0) {
    logsStore.push(
      {
        id: "1",
        secretName: "production-api-key",
        action: "rotated",
        timestamp: "2024-12-15 10:30:00",
        user: "admin@example.com",
        details: "Automatic rotation completed successfully"
      },
      {
        id: "2",
        secretName: "database-master-password",
        action: "rotated",
        timestamp: "2024-11-01 08:15:00",
        user: "system",
        details: "Scheduled rotation completed"
      },
      {
        id: "3",
        secretName: "tls-certificate",
        action: "failed",
        timestamp: "2024-12-20 14:45:00",
        user: "system",
        details: "Certificate renewal failed: Invalid CSR"
      },
      {
        id: "4",
        secretName: "oauth-client-secret",
        action: "scheduled",
        timestamp: "2025-03-01 00:00:00",
        user: "system",
        details: "Next rotation scheduled"
      }
    );
  }

  if (notificationsStore.length === 0) {
    notificationsStore.push(
      {
        id: "1",
        secretName: "tls-certificate",
        type: "expired",
        message: "Certificate has expired and needs immediate renewal",
        timestamp: "2025-01-16 09:00:00",
        acknowledged: false
      },
      {
        id: "2",
        secretName: "database-master-password",
        type: "expiring",
        message: "Password will expire in 7 days",
        timestamp: "2025-01-23 10:00:00",
        acknowledged: false
      },
      {
        id: "3",
        secretName: "production-api-key",
        type: "rotated",
        message: "API key was successfully rotated",
        timestamp: "2024-12-15 10:30:00",
        acknowledged: true
      }
    );
  }
}

function calculateNextRotation(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

function calculateStatus(nextRotation: string): Secret["status"] {
  const next = new Date(nextRotation);
  const now = new Date();
  const daysUntil = Math.floor((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntil < 0) return "expired";
  if (daysUntil <= 14) return "expiring-soon";
  return "healthy";
}

export async function POST(request: NextRequest) {
  try {
    initializeMockData();

    const body = await request.json();
    const { action, secretId, name, type, rotationInterval } = body;

    switch (action) {
      case "getSecrets": {
        const secrets = Array.from(secretsStore.values());
        return NextResponse.json({ secrets });
      }

      case "addSecret": {
        if (!name || !type || !rotationInterval) {
          return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
          );
        }

        const newSecret: Secret = {
          id: Date.now().toString(),
          name,
          type,
          lastRotated: new Date().toISOString().split('T')[0],
          nextRotation: calculateNextRotation(rotationInterval),
          status: "healthy",
          rotationInterval
        };

        secretsStore.set(newSecret.id, newSecret);

        // Add log entry
        logsStore.unshift({
          id: Date.now().toString(),
          secretName: name,
          action: "scheduled",
          timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
          user: "user@example.com",
          details: `Secret registered with ${rotationInterval}-day rotation interval`
        });

        return NextResponse.json({ secret: newSecret });
      }

      case "rotateSecret": {
        if (!secretId) {
          return NextResponse.json(
            { error: "Secret ID is required" },
            { status: 400 }
          );
        }

        const secret = secretsStore.get(secretId);
        if (!secret) {
          return NextResponse.json(
            { error: "Secret not found" },
            { status: 404 }
          );
        }

        // Update secret
        secret.lastRotated = new Date().toISOString().split('T')[0];
        secret.nextRotation = calculateNextRotation(secret.rotationInterval);
        secret.status = calculateStatus(secret.nextRotation);
        secretsStore.set(secretId, secret);

        // Add log entry
        logsStore.unshift({
          id: Date.now().toString(),
          secretName: secret.name,
          action: "rotated",
          timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
          user: "user@example.com",
          details: "Manual rotation completed successfully"
        });

        // Add notification
        notificationsStore.unshift({
          id: Date.now().toString(),
          secretName: secret.name,
          type: "rotated",
          message: `${secret.name} was successfully rotated`,
          timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
          acknowledged: false
        });

        return NextResponse.json({ success: true });
      }

      case "getRotationLogs": {
        return NextResponse.json({ logs: logsStore });
      }

      case "getNotifications": {
        return NextResponse.json({ notifications: notificationsStore });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Secrets rotation scheduler error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
