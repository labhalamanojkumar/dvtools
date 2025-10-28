import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Key,
  Shield,
  Settings,
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import ProfileForm from "@/components/profile/profile-form";
import ApiKeysManager from "@/components/profile/api-keys-manager";
import AccountSettings from "@/components/profile/account-settings";

export const metadata: Metadata = {
  title: "Profile | DevTools Hub - Manage Your Account",
  description:
    "Update your profile information, manage API keys, and configure your account settings.",
  keywords: [
    "profile",
    "account settings",
    "API keys",
    "user management",
    "account configuration",
  ],
  openGraph: {
    title: "Profile | DevTools Hub - Manage Your Account",
    description: "Update your profile and manage your account settings.",
    type: "website",
    url: "/profile",
    siteName: "DevTools Hub",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const isAdmin =
    session.user.role === "ADMIN" || session.user.role === "SUPERADMIN";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, API keys, and account preferences.
        </p>
        {isAdmin && (
          <Badge variant="secondary" className="mt-2">
            Administrator Access
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <ProfileForm user={session.user} />
          <ApiKeysManager />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <AccountSettings user={session.user} isAdmin={isAdmin} />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/dashboard">
                  <User className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/settings/export">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Link>
              </Button>
              {isAdmin && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plan</span>
                <Badge variant="secondary">Free (Limited Time)</Badge>
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
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Member Since</span>
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
