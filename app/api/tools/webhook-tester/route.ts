import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface WebhookRequest {
  id: string;
  timestamp: string;
  method: string;
  headers: Record<string, string>;
  body: any;
  signature?: string;
  signatureValid?: boolean;
}

interface Webhook {
  id: string;
  requests: WebhookRequest[];
  createdAt: string;
}

const webhooks = new Map<string, Webhook>();

function generateSignature(payload: string, secret: string, type: "hmac-sha256" | "hmac-sha512"): string {
  const algorithm = type === "hmac-sha256" ? "sha256" : "sha512";
  return crypto.createHmac(algorithm, secret).update(payload).digest("hex");
}

function verifySignature(payload: string, signature: string, secret: string, type: "hmac-sha256" | "hmac-sha512"): boolean {
  const expectedSignature = generateSignature(payload, secret, type);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "create") {
      const webhookId = crypto.randomBytes(16).toString("hex");
      const webhook: Webhook = {
        id: webhookId,
        requests: [],
        createdAt: new Date().toISOString()
      };

      webhooks.set(webhookId, webhook);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const webhookUrl = `${baseUrl}/api/tools/webhook-tester/receive/${webhookId}`;

      return NextResponse.json({
        success: true,
        webhookId,
        webhookUrl
      });
    }

    if (action === "send") {
      const { webhookId, payload, signatureSecret, signatureType } = body;

      if (!webhookId || !payload) {
        return NextResponse.json(
          { error: "Webhook ID and payload are required" },
          { status: 400 }
        );
      }

      const webhook = webhooks.get(webhookId);
      if (!webhook) {
        return NextResponse.json(
          { error: "Webhook not found" },
          { status: 404 }
        );
      }

      const payloadString = JSON.stringify(payload);
      let signature: string | undefined;
      let signatureValid = true;

      if (signatureSecret && signatureType && signatureType !== "none") {
        signature = generateSignature(payloadString, signatureSecret, signatureType);
      }

      const webhookRequest: WebhookRequest = {
        id: crypto.randomBytes(8).toString("hex"),
        timestamp: new Date().toISOString(),
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(signature && { "x-webhook-signature": signature })
        },
        body: payload,
        signature,
        signatureValid
      };

      webhook.requests.unshift(webhookRequest);

      return NextResponse.json({
        success: true,
        requestId: webhookRequest.id
      });
    }

    if (action === "replay") {
      const { targetUrl, payload, headers } = body;

      if (!targetUrl || !payload) {
        return NextResponse.json(
          { error: "Target URL and payload are required" },
          { status: 400 }
        );
      }

      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers
        },
        body: JSON.stringify(payload)
      });

      return NextResponse.json({
        success: true,
        status: response.status,
        statusText: response.statusText
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Webhook tester API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const webhookId = searchParams.get("webhookId");

    if (!webhookId) {
      return NextResponse.json(
        { error: "Webhook ID is required" },
        { status: 400 }
      );
    }

    const webhook = webhooks.get(webhookId);
    if (!webhook) {
      return NextResponse.json(
        { error: "Webhook not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      requests: webhook.requests
    });
  } catch (error) {
    console.error("Webhook tester GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
