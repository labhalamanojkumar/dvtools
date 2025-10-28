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

export const metadata: Metadata = {
  title: "Dashboard | DevTools Hub - Your Developer Workspace",
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
    title: "Dashboard | DevTools Hub - Your Developer Workspace",
    description:
      "Access your personal dashboard and manage your development activities.",
    type: "website",
    url: "/dashboard",
    siteName: "DevTools Hub",
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

  // Mock data - in a real app, this would come from your database
  const userStats = isAdmin
    ? {
        totalApiCalls: 9999,
        monthlyLimit: -1, // unlimited
        storageUsed: 0.2,
        storageLimit: -1, // unlimited
        toolsUsed: 8,
        lastActivity: new Date().toISOString(),
      }
    : {
        totalApiCalls: 145,
        monthlyLimit: 300,
        storageUsed: 0.2,
        storageLimit: 1,
        toolsUsed: 8,
        lastActivity: new Date().toISOString(),
      };

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground">Active user</p>
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
