import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const dynamic = 'force-dynamic';

// In-memory storage for analytics events (in production, use a database)
let analyticsEvents: AnalyticsEvent[] = [];
let userSessions: Map<string, SessionData> = new Map();

interface AnalyticsEvent {
  id: string;
  eventType: string;
  eventName: string;
  userId?: string;
  sessionId: string;
  pageUrl: string;
  timestamp: string;
  properties: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
}

interface SessionData {
  sessionId: string;
  userId?: string;
  startTime: Date;
  lastActivity: Date;
  pageViews: number;
  events: number;
}

interface AnalyticsStats {
  totalEvents: number;
  uniqueUsers: number;
  totalSessions: number;
  avgSessionDuration: number;
  topPages: Array<{ page: string; views: number }>;
  topEvents: Array<{ event: string; count: number }>;
  conversionRate: number;
  bounceRate: number;
}

// GET /api/tools/usage-analytics - Fetch analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      eventType: searchParams.get("eventType") || undefined,
      eventName: searchParams.get("eventName") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      pageUrl: searchParams.get("pageUrl") || undefined,
      userId: searchParams.get("userId") || undefined,
      limit: parseInt(searchParams.get("limit") || "100"),
      offset: parseInt(searchParams.get("offset") || "0"),
    };

    // Filter events based on criteria
    let filteredEvents = analyticsEvents.filter(event => {
      if (filters.eventType && event.eventType !== filters.eventType) return false;
      if (filters.eventName && !event.eventName.toLowerCase().includes(filters.eventName.toLowerCase())) return false;
      if (filters.pageUrl && !event.pageUrl.includes(filters.pageUrl)) return false;
      if (filters.userId && event.userId !== filters.userId) return false;

      if (filters.startDate || filters.endDate) {
        const eventDate = new Date(event.timestamp);
        if (filters.startDate && eventDate < new Date(filters.startDate)) return false;
        if (filters.endDate && eventDate > new Date(filters.endDate + "T23:59:59")) return false;
      }

      return true;
    });

    // Sort by timestamp (newest first)
    filteredEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply pagination
    const total = filteredEvents.length;
    const paginatedEvents = filteredEvents.slice(filters.offset, filters.offset + filters.limit);

    // Calculate stats
    const stats = calculateAnalyticsStats(filteredEvents);

    return NextResponse.json({
      events: paginatedEvents,
      stats,
      pagination: {
        limit: filters.limit,
        offset: filters.offset,
        total,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data", success: false },
      { status: 500 }
    );
  }
}

// POST /api/tools/usage-analytics - Track new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.eventType || !body.eventName) {
      return NextResponse.json(
        { error: "Event type and event name are required", success: false },
        { status: 400 }
      );
    }

    // Get user information from request
    const userAgent = request.headers.get("user-agent") || undefined;
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : request.ip || undefined;

    // Generate or get session ID
    let sessionId = getSessionId(request);
    if (!sessionId) {
      sessionId = uuidv4();
      // Set session cookie
      const response = NextResponse.json({ success: true });
      response.cookies.set("analytics_session", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24 hours
      });
    }

    // Update session data
    updateSessionData(sessionId, body.userId);

    // Create analytics event
    const event: AnalyticsEvent = {
      id: uuidv4(),
      eventType: body.eventType,
      eventName: body.eventName,
      userId: body.userId,
      sessionId,
      pageUrl: body.pageUrl || "/",
      timestamp: new Date().toISOString(),
      properties: body.properties || {},
      userAgent,
      ipAddress,
    };

    // Store event
    analyticsEvents.push(event);

    // Clean up old events (keep last 30 days)
    cleanupOldEvents();

    return NextResponse.json({
      event,
      success: true,
    });
  } catch (error) {
    console.error("Error tracking event:", error);
    return NextResponse.json(
      { error: "Failed to track event", success: false },
      { status: 500 }
    );
  }
}

// Helper functions

function getSessionId(request: NextRequest): string | null {
  return request.cookies.get("analytics_session")?.value || null;
}

function updateSessionData(sessionId: string, userId?: string) {
  const now = new Date();
  let session = userSessions.get(sessionId);

  if (!session) {
    session = {
      sessionId,
      userId,
      startTime: now,
      lastActivity: now,
      pageViews: 0,
      events: 0,
    };
  }

  session.lastActivity = now;
  session.events += 1;

  // Count page views
  if (sessionId) {
    const recentPageViews = analyticsEvents
      .filter(e => e.sessionId === sessionId && e.eventType === "page_view")
      .filter(e => {
        const eventTime = new Date(e.timestamp);
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        return eventTime > fiveMinutesAgo;
      });

    session.pageViews = recentPageViews.length;
  }

  userSessions.set(sessionId, session);
}

function calculateAnalyticsStats(events: AnalyticsEvent[]): AnalyticsStats {
  const totalEvents = events.length;

  // Unique users
  const uniqueUsers = new Set(events.filter(e => e.userId).map(e => e.userId)).size;

  // Sessions
  const uniqueSessions = new Set(events.map(e => e.sessionId)).size;

  // Average session duration
  const sessions = Array.from(userSessions.values());
  const avgSessionDuration = sessions.length > 0
    ? sessions.reduce((sum, s) => sum + (s.lastActivity.getTime() - s.startTime.getTime()), 0) / sessions.length / 1000 / 60 // in minutes
    : 0;

  // Top pages
  const pageViews = events.filter(e => e.eventType === "page_view");
  const pageCount = new Map<string, number>();
  pageViews.forEach(e => {
    pageCount.set(e.pageUrl, (pageCount.get(e.pageUrl) || 0) + 1);
  });
  const topPages = Array.from(pageCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, views]) => ({ page, views }));

  // Top events
  const eventCount = new Map<string, number>();
  events.forEach(e => {
    eventCount.set(e.eventName, (eventCount.get(e.eventName) || 0) + 1);
  });
  const topEvents = Array.from(eventCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([event, count]) => ({ event, count }));

  // Conversion rate (simplified - events marked as conversion)
  const conversionEvents = events.filter(e => e.eventType === "conversion").length;
  const conversionRate = totalEvents > 0 ? conversionEvents / totalEvents : 0;

  // Bounce rate (sessions with only 1 page view)
  const bounceSessions = sessions.filter(s => s.pageViews <= 1).length;
  const bounceRate = sessions.length > 0 ? bounceSessions / sessions.length : 0;

  return {
    totalEvents,
    uniqueUsers,
    totalSessions: uniqueSessions,
    avgSessionDuration,
    topPages,
    topEvents,
    conversionRate,
    bounceRate,
  };
}

// DELETE /api/tools/usage-analytics - Clear all analytics data
export async function DELETE() {
  try {
    analyticsEvents = [];
    userSessions.clear();

    return NextResponse.json({
      message: "All analytics data cleared successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error clearing analytics data:", error);
    return NextResponse.json(
      { error: "Failed to clear analytics data", success: false },
      { status: 500 }
    );
  }
}

function cleanupOldEvents() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  analyticsEvents = analyticsEvents.filter(event =>
    new Date(event.timestamp) > thirtyDaysAgo
  );

  // Clean up old sessions
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  for (const [sessionId, session] of userSessions) {
    if (session.lastActivity < oneHourAgo) {
      userSessions.delete(sessionId);
    }
  }
}
