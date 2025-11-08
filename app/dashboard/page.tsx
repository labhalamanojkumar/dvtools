import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Zap,
  Clock,
  Database,
  Settings,
  Key,
  Users,
  Activity,
} from "lucide-react";
import Link from "next/link";
import UsageStats from "@/components/dashboard/usage-stats";
import RecentActivity from "@/components/dashboard/recent-activity";
import QuickActions from "@/components/dashboard/quick-actions";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard | DvTools - Your Developer Workspace",
  description:
    "Access your personal dashboard, track usage, manage API keys, and monitor your development activities.",
  keywords: [
    "dashboard",
    "developer tools",
    "usage analytics",
    "API keys",
    "activity tracking",
  ],
  openGraph: {
    title: "Dashboard | DvTools - Your Developer Workspace",
    description:
      "Access your personal dashboard and manage your development activities.",
    type: "website",
    url: "/dashboard",
    siteName: "DvTools",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const isAdmin =
    session.user.role === "ADMIN" || session.user.role === "SUPERADMIN";

  // Fetch real user stats from database
  let userStats;
  try {
    const userId = session.user.id;

    // Get user's tool sessions for the current month
    const currentMonth = new Date();
    currentMonth.setDate(1); // Start of current month

    const toolSessions = await prisma.toolSession.count({
      where: {
        userId,
        createdAt: {
          gte: currentMonth,
        },
      },
    });

    // Get total tool sessions for the user
    const totalSessions = await prisma.toolSession.count({
      where: {
        userId,
      },
    });

    // Get unique tools used this month
    const uniqueToolsThisMonth = await prisma.toolSession.findMany({
      where: {
        userId,
        createdAt: {
          gte: currentMonth,
        },
      },
      select: {
        toolType: true,
      },
      distinct: ["toolType"],
    });

    // Get last activity
    const lastActivity = await prisma.toolSession.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    });

    // Get user's API keys count
    const apiKeysCount = await prisma.apiKey.count({
      where: {
        userId,
      },
    });

    // For storage, we'll use a mock calculation since we don't have file storage tracking
    // In a real app, you'd track uploaded files, snippets, etc.
    const storageUsed = Math.max(0.1, (apiKeysCount * 0.01) + (totalSessions * 0.001));

    userStats = {
      totalApiCalls: totalSessions,
      monthlyLimit: isAdmin ? -1 : 300, // -1 means unlimited
      storageUsed: Math.round(storageUsed * 100) / 100, // Round to 2 decimal places
      storageLimit: isAdmin ? -1 : 1, // GB
      toolsUsed: uniqueToolsThisMonth.length,
      apiKeysCount,
      lastActivity: lastActivity?.createdAt?.toISOString() || null,
      isAdmin,
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    // Fallback to mock data if database query fails
    userStats = isAdmin
      ? {
          totalApiCalls: 9999,
          monthlyLimit: -1,
          storageUsed: 0.2,
          storageLimit: -1,
          toolsUsed: 8,
          apiKeysCount: 0,
          lastActivity: new Date().toISOString(),
          isAdmin: true,
        }
      : {
          totalApiCalls: 145,
          monthlyLimit: 300,
          storageUsed: 0.2,
          storageLimit: 1,
          toolsUsed: 8,
          apiKeysCount: 0,
          lastActivity: new Date().toISOString(),
          isAdmin: false,
        };
  }

  const usagePercentage = isAdmin
    ? 0
    : (userStats.totalApiCalls / userStats.monthlyLimit) * 100;
  const storagePercentage = isAdmin
    ? 0
    : (userStats.storageUsed / userStats.storageLimit) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {session.user.name}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your development activities and usage
          statistics.
        </p>
        {isAdmin && (
          <Badge variant="secondary" className="mt-2">
            Administrator Access
          </Badge>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isAdmin ? "Unlimited" : userStats.totalApiCalls}
            </div>
            <p className="text-xs text-muted-foreground">
              {isAdmin
                ? "No API call limits"
                : `of ${userStats.monthlyLimit} this month`}
            </p>
            {!isAdmin && <Progress value={usagePercentage} className="mt-2" />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.storageUsed}GB</div>
            <p className="text-xs text-muted-foreground">
              {isAdmin
                ? "Unlimited storage"
                : `of ${userStats.storageLimit}GB limit`}
            </p>
            {!isAdmin && (
              <Progress value={storagePercentage} className="mt-2" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tools Used</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.toolsUsed}</div>
            <p className="text-xs text-muted-foreground">
              different tools this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.apiKeysCount}</div>
            <p className="text-xs text-muted-foreground">
              active API keys
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.lastActivity
                ? new Date(userStats.lastActivity).toLocaleDateString()
                : "Never"}
            </div>
            <p className="text-xs text-muted-foreground">
              {userStats.lastActivity
                ? `${Math.floor((Date.now() - new Date(userStats.lastActivity).getTime()) / (1000 * 60 * 60 * 24))} days ago`
                : "No activity yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Usage Stats & Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          <UsageStats />
          <QuickActions />
        </div>

        {/* Right Column - Recent Activity & Account Info */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plan</span>
                <Badge variant="secondary">
                  {isAdmin
                    ? "Administrator (Unlimited)"
                    : "Free (Limited Time)"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Role</span>
                <Badge variant={isAdmin ? "destructive" : "outline"}>
                  {isAdmin ? "Administrator" : "User"}
                </Badge>
              </div>
              <div className="pt-4 space-y-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href="/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href="/settings">
                    <Key className="mr-2 h-4 w-4" />
                    API Keys
                  </Link>
                </Button>
                {isAdmin && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href="/admin">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
