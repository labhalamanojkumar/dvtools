import { DashboardStats } from "../../components/admin/dashboard-stats";
import { UsageChart } from "../../components/admin/usage-chart";
import { RecentActivity } from "../../components/admin/recent-activity";
import { UserManagement } from "../../components/admin/user-management";
import { SystemHealth } from "../../components/admin/system-health";
import { ApiMonitoring } from "../../components/admin/api-monitoring";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div>
        <DashboardStats />
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-8 lg:grid-cols-2">
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
  );
}
