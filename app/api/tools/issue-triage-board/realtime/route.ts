import { NextRequest } from "next/server";
import { eventEmitter } from "../realtime-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Priority = "critical" | "high" | "medium" | "low";
type Status = "new" | "in_progress" | "review" | "resolved";

interface Issue {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignee: string;
  errorDetails?: string;
  alertSource?: string;
  ticketId?: string;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
  slaStatus: "on-track" | "at-risk" | "breached";
}

interface Comment {
  id: string;
  issueId: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Activity {
  id: string;
  issueId: string;
  user: string;
  action: string;
  details: string;
  timestamp: string;
}

interface RealtimeMessage {
  type: 'issue_update' | 'issue_create' | 'issue_delete' | 'comment_add' | 'activity_add' | 'bulk_update' | 'sla_alert';
  payload: any;
  timestamp: string;
}

// EventEmitter and utility functions are imported from realtime-utils

export async function GET(request: NextRequest) {
  try {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    };

    const stream = new ReadableStream({
      start(controller) {
        const sendMessage = (message: RealtimeMessage) => {
          const data = `data: ${JSON.stringify(message)}\n\n`;
          controller.enqueue(new TextEncoder().encode(data));
        };

        // Send connection success message
        sendMessage({
          type: 'issue_update',
          payload: { connected: true, message: 'Real-time connection established' },
          timestamp: new Date().toISOString()
        });

        // Listen for real-time events
        const handleIssueUpdate = (data: any) => {
          sendMessage({
            type: 'issue_update',
            payload: data,
            timestamp: new Date().toISOString()
          });
        };

        const handleIssueCreate = (data: any) => {
          sendMessage({
            type: 'issue_create',
            payload: data,
            timestamp: new Date().toISOString()
          });
        };

        const handleIssueDelete = (data: any) => {
          sendMessage({
            type: 'issue_delete',
            payload: data,
            timestamp: new Date().toISOString()
          });
        };

        const handleCommentAdd = (data: any) => {
          sendMessage({
            type: 'comment_add',
            payload: data,
            timestamp: new Date().toISOString()
          });
        };

        const handleActivityAdd = (data: any) => {
          sendMessage({
            type: 'activity_add',
            payload: data,
            timestamp: new Date().toISOString()
          });
        };

        const handleSLAAlert = (data: any) => {
          sendMessage({
            type: 'sla_alert',
            payload: data,
            timestamp: new Date().toISOString()
          });
        };

        // Register event listeners
        eventEmitter.on('issue_update', handleIssueUpdate);
        eventEmitter.on('issue_create', handleIssueCreate);
        eventEmitter.on('issue_delete', handleIssueDelete);
        eventEmitter.on('comment_add', handleCommentAdd);
        eventEmitter.on('activity_add', handleActivityAdd);
        eventEmitter.on('sla_alert', handleSLAAlert);

        // Heartbeat every 30 seconds
        const heartbeat = setInterval(() => {
          try {
            // Check if controller is still active before sending heartbeat
            if (controller.desiredSize !== null && controller.desiredSize >= 0) {
              sendMessage({
                type: 'issue_update',
                payload: { heartbeat: true },
                timestamp: new Date().toISOString()
              });
            } else {
              // Controller is closed, clean up
              clearInterval(heartbeat);
            }
          } catch (error) {
            console.error("Failed to send heartbeat:", error);
            clearInterval(heartbeat);
          }
        }, 30000);

        // Cleanup on close
        const cleanup = () => {
          clearInterval(heartbeat);
          eventEmitter.off('issue_update', handleIssueUpdate);
          eventEmitter.off('issue_create', handleIssueCreate);
          eventEmitter.off('issue_delete', handleIssueDelete);
          eventEmitter.off('comment_add', handleCommentAdd);
          eventEmitter.off('activity_add', handleActivityAdd);
          eventEmitter.off('sla_alert', handleSLAAlert);
        };

        // Handle client disconnect
        (request as any).signal?.addEventListener('abort', cleanup);
      },
    });

    return new Response(stream, { headers });
  } catch (error) {
    console.error('SSE Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Utility functions are imported from realtime-utils.ts