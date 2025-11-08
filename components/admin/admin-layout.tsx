"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  Users,
  Settings,
  CreditCard,
  Heart,
  Activity,
  Shield,
  ArrowLeft,
  Target,
  BookOpen,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const adminNavigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: BarChart3,
    description: "Overview and analytics",
  },
  {
    name: "Posts",
    href: "/admin/posts",
    icon: BookOpen,
    description: "Blog and content management",
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    description: "User management",
  },
  {
    name: "Ad Management",
    href: "/admin/ads",
    icon: Target,
    description: "Manage ads and vendors",
    superAdminOnly: true,
  },
  {
    name: "Payment Gateways",
    href: "/admin/payment-gateways",
    icon: CreditCard,
    description: "Configure payment methods",
  },
  {
    name: "Donations",
    href: "/admin/donations",
    icon: Heart,
    description: "Donation management",
  },
  {
    name: "Sponsors",
    href: "/admin/sponsors",
    icon: Heart,
    description: "Sponsor management",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: Activity,
    description: "Platform analytics",
  },
  {
    name: "System",
    href: "/admin/system",
    icon: Shield,
    description: "System health & monitoring",
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    const isAdmin =
      session.user?.role === "ADMIN" || session.user?.role === "SUPERADMIN";

    if (!isAdmin) {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isAdmin =
    session.user?.role === "ADMIN" || session.user?.role === "SUPERADMIN";

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Platform
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground mt-1">
                Manage your platform settings and monitor usage
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Logged in as: <span className="font-medium">{session.user?.name}</span>
            <br />
            Role: <span className="font-medium text-primary">{session.user?.role}</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
                <CardDescription>Admin panel sections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {adminNavigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  // Check if this item requires SUPERADMIN
                  if (item.superAdminOnly && session.user?.role !== 'SUPERADMIN') {
                    return null;
                  }
                  
                  return (
                    <Link key={item.name} href={item.href}>
                      <div
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-accent ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs opacity-75">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}