import { NextRequest, NextResponse } from "next/server";

// Mock analytics data - in a real app, this would query the database
const mockAnalytics = {
  overview: {
    totalUsers: 1234,
    totalUses: 45678,
    popularTool: "JSON Formatter",
    avgSessionTime: 272, // in seconds
  },
  usageByTool: [
    { name: "JSON Formatter", uses: 1234, percentage: 23 },
    { name: "Base64 Encoder", uses: 987, percentage: 18 },
    { name: "JWT Decoder", uses: 756, percentage: 14 },
    { name: "Code Beautifier", uses: 654, percentage: 12 },
    { name: "URL Encoder", uses: 543, percentage: 10 },
    { name: "Regexp Tester", uses: 432, percentage: 8 },
  ],
  usageOverTime: [
    { date: "2024-01-01", uses: 1200 },
    { date: "2024-01-02", uses: 1350 },
    { date: "2024-01-03", uses: 1180 },
    { date: "2024-01-04", uses: 1420 },
    { date: "2024-01-05", uses: 1380 },
    { date: "2024-01-06", uses: 1520 },
    { date: "2024-01-07", uses: 1450 },
  ],
  recentActivity: [
    {
      id: 1,
      tool: "JSON Formatter",
      action: "Formatted JSON data",
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      userAgent: "Mozilla/5.0...",
    },
    {
      id: 2,
      tool: "Base64 Encoder",
      action: "Encoded file to Base64",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      userAgent: "Mozilla/5.0...",
    },
    {
      id: 3,
      tool: "JWT Decoder",
      action: "Decoded JWT token",
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      userAgent: "Mozilla/5.0...",
    },
    {
      id: 4,
      tool: "Code Beautifier",
      action: "Formatted JavaScript code",
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      userAgent: "Mozilla/5.0...",
    },
    {
      id: 5,
      tool: "URL Encoder",
      action: "Encoded URL parameters",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      userAgent: "Mozilla/5.0...",
    },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    switch (type) {
      case "overview":
        return NextResponse.json(mockAnalytics.overview);

      case "usage-by-tool":
        return NextResponse.json(mockAnalytics.usageByTool);

      case "usage-over-time":
        return NextResponse.json(mockAnalytics.usageOverTime);

      case "recent-activity":
        return NextResponse.json(mockAnalytics.recentActivity);

      default:
        return NextResponse.json(mockAnalytics);
    }
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
