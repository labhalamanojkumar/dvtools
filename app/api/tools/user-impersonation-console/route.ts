import { NextRequest, NextResponse } from "next/server";

// Real-time clients storage (using Server-Sent Events)
const clients = new Set<{ id: string; res: ReadableStreamDefaultController }>();

interface User {
  id: string;
  email: string;
  name: string;
  accountType: string;
  lastActive: string;
}

interface Activity {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}

interface ImpersonationSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  initiator: string;
  reason: string;
  startTime: string;
  endTime: string | null;
  duration: number;
  status: "active" | "ended";
  activities: Activity[];
}

interface AuditLog {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  initiator: string;
  reason: string;
  startTime: string;
  endTime: string;
  duration: number;
  activityCount: number;
}

// In-memory storage (use database in production)
const usersStore = new Map<string, User>();
const sessionsStore = new Map<string, ImpersonationSession>();
const auditLogsStore: AuditLog[] = [];

// Real-time event broadcasting
function broadcastEvent(type: string, data: any) {
  const event = `data: ${JSON.stringify({ type, data, timestamp: new Date().toISOString() })}\n\n`;
  clients.forEach(client => {
    try {
      client.res.enqueue(event);
    } catch (error) {
      clients.delete(client);
    }
  });
}

// CSV parsing utility
function parseCSV(csvContent: string): User[] {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const users: User[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length >= headers.length) {
      const user: User = {
        id: Date.now().toString() + i,
        email: '',
        name: '',
        accountType: 'Free',
        lastActive: new Date().toISOString().split('T')[0] + ' 00:00:00'
      };

      headers.forEach((header, index) => {
        const value = values[index]?.trim();
        if (value) {
          if (header.includes('email')) user.email = value;
          else if (header.includes('name')) user.name = value;
          else if (header.includes('account') || header.includes('type')) user.accountType = value;
          else if (header.includes('active') || header.includes('last')) user.lastActive = value;
        }
      });

      if (user.email && user.name) {
        users.push(user);
      }
    }
  }

  return users;
}

// Generate CSV from users
function generateUsersCSV(users: User[]): string {
  const headers = ['email', 'name', 'accountType', 'lastActive'];
  const csvContent = [
    headers.join(','),
    ...users.map(user => [
      user.email,
      user.name,
      user.accountType,
      user.lastActive
    ].join(','))
  ].join('\n');

  return csvContent;
}

// Initialize with mock data
function initializeMockData() {
  if (usersStore.size === 0) {
    const mockUsers: User[] = [
      {
        id: "1",
        email: "alice.customer@example.com",
        name: "Alice Customer",
        accountType: "Enterprise",
        lastActive: "2024-01-20 14:30:00",
      },
      {
        id: "2",
        email: "bob.user@example.com",
        name: "Bob User",
        accountType: "Professional",
        lastActive: "2024-01-20 09:15:00",
      },
      {
        id: "3",
        email: "carol.client@example.com",
        name: "Carol Client",
        accountType: "Enterprise",
        lastActive: "2024-01-19 16:45:00",
      },
      {
        id: "4",
        email: "david.member@example.com",
        name: "David Member",
        accountType: "Free",
        lastActive: "2024-01-20 11:20:00",
      },
      {
        id: "5",
        email: "eve.subscriber@example.com",
        name: "Eve Subscriber",
        accountType: "Professional",
        lastActive: "2024-01-20 10:05:00",
      },
    ];

    mockUsers.forEach(user => usersStore.set(user.id, user));

    // Initialize some completed sessions
    const mockSessions: ImpersonationSession[] = [
      {
        id: "1",
        userId: "1",
        userName: "Alice Customer",
        userEmail: "alice.customer@example.com",
        initiator: "support@example.com",
        reason: "Debug dashboard loading issue reported by user",
        startTime: "2024-01-19 10:00:00",
        endTime: "2024-01-19 10:25:00",
        duration: 30,
        status: "ended",
        activities: [
          {
            id: "1",
            action: "Viewed Dashboard",
            details: "Checked user's dashboard for issues",
            timestamp: "2024-01-19 10:02:00",
          },
          {
            id: "2",
            action: "Reproduced Issue",
            details: "Successfully reproduced reported bug",
            timestamp: "2024-01-19 10:10:00",
          },
          {
            id: "3",
            action: "Fixed Configuration",
            details: "Corrected misconfiguration in user settings",
            timestamp: "2024-01-19 10:20:00",
          },
        ],
      },
      {
        id: "2",
        userId: "2",
        userName: "Bob User",
        userEmail: "bob.user@example.com",
        initiator: "support@example.com",
        reason: "Investigate billing discrepancy",
        startTime: "2024-01-18 14:00:00",
        endTime: "2024-01-18 14:15:00",
        duration: 15,
        status: "ended",
        activities: [
          {
            id: "1",
            action: "Checked Settings",
            details: "Reviewed billing configuration",
            timestamp: "2024-01-18 14:05:00",
          },
        ],
      },
    ];

    mockSessions.forEach(session => sessionsStore.set(session.id, session));

    // Initialize audit logs
    const mockLogs: AuditLog[] = [
      {
        id: "1",
        sessionId: "1",
        userId: "1",
        userName: "Alice Customer",
        initiator: "support@example.com",
        reason: "Debug dashboard loading issue reported by user",
        startTime: "2024-01-19 10:00:00",
        endTime: "2024-01-19 10:25:00",
        duration: 25,
        activityCount: 3,
      },
      {
        id: "2",
        sessionId: "2",
        userId: "2",
        userName: "Bob User",
        initiator: "support@example.com",
        reason: "Investigate billing discrepancy",
        startTime: "2024-01-18 14:00:00",
        endTime: "2024-01-18 14:15:00",
        duration: 15,
        activityCount: 1,
      },
    ];

    auditLogsStore.push(...mockLogs);
  }
}

// Handle Server-Sent Events for real-time updates
export async function GET(request: NextRequest) {
  if (request.headers.get('accept') === 'text/event-stream') {
    const stream = new ReadableStream({
      start(controller) {
        const clientId = Date.now().toString();
        const client = { id: clientId, res: controller };
        clients.add(client);

        // Send initial connection message
        controller.enqueue(`data: ${JSON.stringify({
          type: 'connected',
          message: 'Real-time connection established',
          timestamp: new Date().toISOString()
        })}\n\n`);

        // Send heartbeat every 30 seconds
        const heartbeat = setInterval(() => {
          try {
            // Check if controller is still active before sending heartbeat
            if (controller.desiredSize !== null && controller.desiredSize >= 0) {
              controller.enqueue(`data: ${JSON.stringify({
                type: 'heartbeat',
                timestamp: new Date().toISOString()
              })}\n\n`);
            } else {
              // Controller is closed, clean up
              clearInterval(heartbeat);
            }
          } catch (error) {
            console.error("Failed to send heartbeat:", error);
            clearInterval(heartbeat);
          }
        }, 30000);

        // Clean up on client disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(heartbeat);
          clients.delete(client);
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });
  }

  return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });
}

export async function POST(request: NextRequest) {
  try {
    initializeMockData();

    const body = await request.json();
    const { action, userId, reason, duration, sessionId, activityAction, activityDetails, fileContent, fileName } = body;

    switch (action) {
      case "getUsers": {
        const users = Array.from(usersStore.values());
        return NextResponse.json({ users });
      }

      case "getSessions": {
        const sessions = Array.from(sessionsStore.values())
          .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        return NextResponse.json({ sessions });
      }

      case "getAuditLogs": {
        return NextResponse.json({ logs: auditLogsStore });
      }

      case "importUsers": {
        if (!fileContent || !fileName) {
          return NextResponse.json(
            { error: "File content and filename are required" },
            { status: 400 }
          );
        }

        let importedUsers: User[] = [];
        let error = null;

        try {
          if (fileName.toLowerCase().endsWith('.csv')) {
            importedUsers = parseCSV(fileContent);
          } else if (fileName.toLowerCase().endsWith('.json')) {
            const parsedData = JSON.parse(fileContent);
            if (Array.isArray(parsedData)) {
              importedUsers = parsedData.map((user, index) => ({
                ...user,
                id: user.id || (Date.now() + index).toString(),
                lastActive: user.lastActive || new Date().toISOString().split('T')[0] + ' 00:00:00'
              }));
            } else {
              throw new Error("Invalid JSON format");
            }
          } else {
            throw new Error("Unsupported file format. Use CSV or JSON.");
          }

          // Add imported users to store
          let addedCount = 0;
          importedUsers.forEach(user => {
            if (user.email && user.name) {
              usersStore.set(user.id, user);
              addedCount++;
            }
          });

          if (addedCount === 0) {
            return NextResponse.json(
              { error: "No valid users found in file" },
              { status: 400 }
            );
          }

          broadcastEvent('users_imported', { count: addedCount, users: importedUsers });
          return NextResponse.json({
            success: true,
            imported: addedCount,
            message: `Successfully imported ${addedCount} users`
          });

        } catch (parseError) {
          return NextResponse.json(
            { error: `Failed to parse file: ${parseError instanceof Error ? parseError.message : 'Unknown error'}` },
            { status: 400 }
          );
        }
      }

      case "exportUsers": {
        const users = Array.from(usersStore.values());
        const csvContent = generateUsersCSV(users);
        
        return new Response(csvContent, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="users-export-${new Date().toISOString().split('T')[0]}.csv"`
          }
        });
      }

      case "uploadSessionFile": {
        if (!sessionId || !fileContent || !fileName) {
          return NextResponse.json(
            { error: "Session ID, file content, and filename are required" },
            { status: 400 }
          );
        }

        const session = sessionsStore.get(sessionId);
        if (!session) {
          return NextResponse.json(
            { error: "Session not found" },
            { status: 404 }
          );
        }

        // Add file upload activity
        const activity: Activity = {
          id: Date.now().toString(),
          action: "File Uploaded",
          details: `User uploaded file: ${fileName} (${Math.round(fileContent.length / 1024)}KB)`,
          timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
        };

        session.activities.push(activity);
        sessionsStore.set(sessionId, session);

        broadcastEvent('session_file_uploaded', {
          sessionId,
          fileName,
          activity
        });

        return NextResponse.json({
          success: true,
          message: "File uploaded and logged",
          activity
        });
      }

      case "startSession": {
        if (!userId || !reason) {
          return NextResponse.json(
            { error: "User ID and reason are required" },
            { status: 400 }
          );
        }

        // Check if there's already an active session
        const activeSessions = Array.from(sessionsStore.values()).filter(s => s.status === "active");
        if (activeSessions.length > 0) {
          return NextResponse.json(
            { error: "An impersonation session is already active" },
            { status: 400 }
          );
        }

        const user = usersStore.get(userId);
        if (!user) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        const id = Date.now().toString();
        const startTime = new Date().toISOString().replace('T', ' ').split('.')[0];

        const session: ImpersonationSession = {
          id,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          initiator: "support@example.com",
          reason,
          startTime,
          endTime: null,
          duration: duration || 30,
          status: "active",
          activities: [
            {
              id: "1",
              action: "Session Started",
              details: "Impersonation session initiated",
              timestamp: startTime,
            },
          ],
        };

        sessionsStore.set(id, session);

        // Broadcast real-time event
        broadcastEvent('session_started', { session });

        return NextResponse.json({ session });
      }

      case "endSession": {
        if (!sessionId) {
          return NextResponse.json(
            { error: "Session ID is required" },
            { status: 400 }
          );
        }

        const session = sessionsStore.get(sessionId);
        if (!session) {
          return NextResponse.json(
            { error: "Session not found" },
            { status: 404 }
          );
        }

        const endTime = new Date().toISOString().replace('T', ' ').split('.')[0];
        const start = new Date(session.startTime).getTime();
        const end = new Date(endTime).getTime();
        const actualDuration = Math.round((end - start) / 1000 / 60);

        // Add end activity
        const endActivity: Activity = {
          id: Date.now().toString(),
          action: "Session Ended",
          details: "Impersonation session terminated",
          timestamp: endTime,
        };
        session.activities.push(endActivity);

        session.status = "ended";
        session.endTime = endTime;
        sessionsStore.set(sessionId, session);

        // Create audit log
        const auditLog: AuditLog = {
          id: Date.now().toString(),
          sessionId: session.id,
          userId: session.userId,
          userName: session.userName,
          initiator: session.initiator,
          reason: session.reason,
          startTime: session.startTime,
          endTime,
          duration: actualDuration,
          activityCount: session.activities.length,
        };
        auditLogsStore.unshift(auditLog);

        // Broadcast real-time event
        broadcastEvent('session_ended', { session, auditLog });

        return NextResponse.json({ session });
      }

      case "logActivity": {
        if (!sessionId || !activityAction) {
          return NextResponse.json(
            { error: "Session ID and activity action are required" },
            { status: 400 }
          );
        }

        const session = sessionsStore.get(sessionId);
        if (!session) {
          return NextResponse.json(
            { error: "Session not found" },
            { status: 404 }
          );
        }

        if (session.status !== "active") {
          return NextResponse.json(
            { error: "Cannot log activity for inactive session" },
            { status: 400 }
          );
        }

        const activity: Activity = {
          id: Date.now().toString(),
          action: activityAction,
          details: activityDetails || "",
          timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
        };

        session.activities.push(activity);
        sessionsStore.set(sessionId, session);

        // Broadcast real-time event
        broadcastEvent('activity_logged', { sessionId, activity });

        return NextResponse.json({ session });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("User impersonation console error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
