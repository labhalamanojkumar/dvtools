import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardStats } from '../../components/admin/dashboard-stats';
import { UsageChart } from '../../components/admin/usage-chart';
import { RecentActivity } from '../../components/admin/recent-activity';
import { UserManagement } from '../../components/admin/user-management';
import { SystemHealth } from '../../components/admin/system-health';
import { ApiMonitoring } from '../../components/admin/api-monitoring';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Multi-Tool Platform',
  description: 'Admin dashboard for monitoring tool usage, analytics, and platform management.',
  keywords: 'admin, dashboard, analytics, monitoring, management',
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN';

  if (!isAdmin) {
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor platform usage, analytics, and manage your tools
          </p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <DashboardStats />
        </div>

        {/* Charts and Analytics */}
        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          <UsageChart />
          <RecentActivity />
        </div>

        {/* Admin Features */}
        <div className="space-y-8">
          <UserManagement />
          <div className="grid gap-8 lg:grid-cols-2">
            <SystemHealth />
            <ApiMonitoring />
          </div>
        </div>
      </div>
    </div>
  );
}