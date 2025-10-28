import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Key,
  Download,
  Settings,
  Shield,
  Database,
  FileText,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import ApiKeysManager from '@/components/profile/api-keys-manager';
import ExportData from '@/components/settings/export-data';
import AccountSettings from '@/components/profile/account-settings';

export const metadata: Metadata = {
  title: 'Settings | DevTools Hub - Manage Your Account',
  description: 'Manage your API keys, export data, and configure your account settings.',
  keywords: [
    'settings',
    'API keys',
    'export data',
    'account management',
    'configuration'
  ],
  openGraph: {
    title: 'Settings | DevTools Hub - Manage Your Account',
    description: 'Manage your API keys and account settings.',
    type: 'website',
    url: '/settings',
    siteName: 'DevTools Hub',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your API keys, export data, and configure your account preferences.
        </p>
        {isAdmin && (
          <Badge variant="destructive" className="mt-2">
            Administrator Access - Full Features Enabled
          </Badge>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <Link href="#api-keys" className="block">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Key className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">API Keys</h3>
                  <p className="text-sm text-muted-foreground">Manage your keys</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <Link href="#export" className="block">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Export Data</h3>
                  <p className="text-sm text-muted-foreground">Download your data</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <Link href="/profile" className="block">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Profile</h3>
                  <p className="text-sm text-muted-foreground">Edit your profile</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <Link href="/admin" className="block">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Admin Panel</h3>
                    <p className="text-sm text-muted-foreground">Full access</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* API Keys Section */}
        <div id="api-keys">
          <ApiKeysManager />
        </div>

        {/* Export Data Section */}
        <div id="export">
          <ExportData />
        </div>

        {/* Account Settings */}
        <AccountSettings user={session.user} isAdmin={isAdmin} />

        {/* Admin Features */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Administrator Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/admin">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/admin/users">
                    <Database className="mr-2 h-4 w-4" />
                    User Management
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/admin/analytics">
                    <FileText className="mr-2 h-4 w-4" />
                    Analytics
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/admin/system">
                    <Settings className="mr-2 h-4 w-4" />
                    System Settings
                  </Link>
                </Button>
              </div>
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Administrator Access:</strong> You have 100% access to all features, unlimited API calls, and full system control.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}