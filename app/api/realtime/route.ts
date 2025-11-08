import { NextRequest } from "next/server";

export const runtime = "nodejs";

interface Client {
  id: string;
  channel: string;
  controller: ReadableStreamDefaultController;
}

const channels = new Map<string, Set<Client>>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get("channel") || "default";
  const clientId = Math.random().toString(36).substring(7);

  // Create headers for SSE
  const encoder = new TextEncoder();

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Client object
      const client: Client = {
        id: clientId,
        channel,
        controller,
      };

      // Add client to channel
      if (!channels.has(channel)) {
        channels.set(channel, new Set());
      }
      channels.get(channel)!.add(client);

      console.log(`Client ${clientId} connected to channel: ${channel}`);

      // Send initial connection message
      const connectionMessage = `data: ${JSON.stringify({
        type: "connection",
        data: {
          clientId,
          channel,
          message: `Connected to ${channel} channel`,
          totalClients: channels.get(channel)?.size || 0,
        },
        timestamp: new Date().toISOString(),
      })}\n\n`;

      controller.enqueue(encoder.encode(connectionMessage));

      // Send periodic heartbeats to keep connection alive
      const heartbeatInterval = setInterval(() => {
        try {
          // Check if controller is still active before sending heartbeat
          if (controller.desiredSize !== null && controller.desiredSize >= 0) {
            const heartbeat = `data: ${JSON.stringify({
              type: "heartbeat",
              data: { channel },
              timestamp: new Date().toISOString(),
            })}\n\n`;
            controller.enqueue(encoder.encode(heartbeat));
          } else {
            // Controller is closed, clean up
            clearInterval(heartbeatInterval);
          }
        } catch (error) {
          console.error("Failed to send heartbeat:", error);
          clearInterval(heartbeatInterval);
        }
      }, 30000); // Every 30 seconds

      // Store cleanup function
      (controller as any).cleanup = () => {
        clearInterval(heartbeatInterval);
      };
    },

    cancel() {
      // Remove client when connection closes
      const channelClients = channels.get(channel);
      if (channelClients) {
        channelClients.forEach((client) => {
          if (client.id === clientId) {
            channelClients.delete(client);
            if (channelClients.size === 0) {
              channels.delete(channel);
            }
            // Call cleanup function if it exists
            if ((client.controller as any).cleanup) {
              (client.controller as any).cleanup();
            }
          }
        });
      }
      console.log(`Client ${clientId} disconnected from channel: ${channel}`);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  });
}

// Helper function to broadcast to a specific channel
// Note: This is not exported to avoid Next.js route handler type errors
// Use the POST endpoint to broadcast messages instead
function broadcastToChannel(channel: string, message: any) {
  const channelClients = channels.get(channel);
  if (channelClients && channelClients.size > 0) {
    const encoder = new TextEncoder();
    const messageStr = `data: ${JSON.stringify({
      ...message,
      timestamp: new Date().toISOString(),
    })}\n\n`;

    // Create a copy of clients to avoid modification during iteration
    const clientsToRemove: Client[] = [];

    channelClients.forEach((client) => {
      try {
        // Check if controller is still active
        if (client.controller.desiredSize !== null && client.controller.desiredSize >= 0) {
          client.controller.enqueue(encoder.encode(messageStr));
        } else {
          // Controller is closed, mark for removal
          clientsToRemove.push(client);
        }
      } catch (err) {
        console.error("Failed to broadcast to client:", err);
        clientsToRemove.push(client);
      }
    });

    // Remove closed clients
    clientsToRemove.forEach((client) => {
      channelClients.delete(client);
      // Call cleanup function if it exists
      if ((client.controller as any).cleanup) {
        (client.controller as any).cleanup();
      }
    });

    // Clean up empty channels
    if (channelClients.size === 0) {
      channels.delete(channel);
    }
  }
}

// Helper function to broadcast to all channels
// Note: This is not exported to avoid Next.js route handler type errors
// Use the POST endpoint to broadcast messages instead
function broadcastToAll(message: any) {
  channels.forEach((_, channel) => {
    broadcastToChannel(channel, message);
  });
}