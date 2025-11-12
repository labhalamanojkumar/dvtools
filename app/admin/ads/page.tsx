"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  MousePointer,
  TrendingUp,
  DollarSign,
  Settings,
  Shield,
  BarChart3,
  Target,
  Calendar,
  Users,
  Zap,
  Globe
} from "lucide-react";
import { useToast } from "@/components/ui/toaster";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AdVendor {
  id: string;
  name: string;
  type: string;
  description: string;
  isActive: boolean;
  config: any;
  createdAt: string;
  updatedAt: string;
  _count: {
    campaigns: number;
  };
}

interface AdCampaign {
  id: string;
  name: string;
  status: string;
  title: string;
  contentDescription: string;
  imageUrl?: string;
  linkUrl?: string;
  callToAction?: string;
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
  priority: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  vendor: {
    name: string;
    type: string;
  };
  _count: {
    analytics: number;
  };
}

interface AdPlacement {
  id: string;
  key: string;
  name: string;
  type: string;
  isActive: boolean;
  sortOrder: number;
  maxAds: number;
  fallbackImage: string;
  createdAt: string;
  _count: {
    campaigns: number;
  };
}

interface AdAnalytics {
  id: string;
  eventType: string;
  revenue: number;
  timestamp: string;
  campaign: {
    name: string;
  };
  placement: {
    key: string;
    name: string;
  } | null;
}

export default function AdsAdmin() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Data states
  const [vendors, setVendors] = useState<AdVendor[]>([]);
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [placements, setPlacements] = useState<AdPlacement[]>([]);
  const [analytics, setAnalytics] = useState<AdAnalytics[]>([]);
  const [analyticsSummary, setAnalyticsSummary] = useState<any>({});

  // Form states
  const [showCreateVendor, setShowCreateVendor] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showCreatePlacement, setShowCreatePlacement] = useState(false);
  const [editingVendor, setEditingVendor] = useState<AdVendor | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<AdCampaign | null>(null);
  const [editingPlacement, setEditingPlacement] = useState<AdPlacement | null>(null);

  // New item forms
  const [newVendor, setNewVendor] = useState({
    name: "",
    type: "GOOGLE_ADSENSE",
    description: "",
    isActive: true,
    apiKey: "",
    apiSecret: "",
    siteId: "",
    publisherId: "",
    verificationCode: "",
    verificationFile: "",
    adsTxtEntry: "",
    isVerified: false
  });

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    vendorId: "",
    title: "",
    contentDescription: "",
    imageUrl: "",
    linkUrl: "",
    callToAction: "",
    status: "DRAFT",
    priority: 0,
    isFeatured: false,
    startDate: "",
    endDate: "",
    budget: "",
    deviceTypes: [] as string[]
  });

  const [newPlacement, setNewPlacement] = useState({
    name: "",
    key: "",
    description: "",
    type: "SIDEBAR",
    width: "",
    height: "",
    htmlClass: "",
    isActive: true,
    sortOrder: 0,
    maxAds: 1,
    refreshInterval: "",
    responsive: true,
    fallbackImage: "",
    fallbackUrl: "",
    pages: [] as string[],
    deviceTypes: [] as string[]
  });

  useEffect(() => {
    // Check if user is SUPERADMIN
    if (session?.user?.role !== "SUPERADMIN") {
      router.push("/admin");
      return;
    }

    loadData();
  }, [session, router]);

  // Populate form when editing a vendor
  useEffect(() => {
    if (editingVendor) {
      const config = editingVendor.config as any || {};
      setNewVendor({
        name: editingVendor.name,
        type: editingVendor.type,
        description: editingVendor.description || "",
        isActive: editingVendor.isActive,
        apiKey: config.apiKey || "",
        apiSecret: config.apiSecret || "",
        siteId: config.siteId || "",
        publisherId: config.publisherId || "",
        verificationCode: config.verificationCode || "",
        verificationFile: config.verificationFile || "",
        adsTxtEntry: config.adsTxtEntry || "",
        isVerified: config.isVerified || false
      });
    }
  }, [editingVendor]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load vendors
      const vendorsResponse = await fetch("/api/admin/ads/vendors");
      if (vendorsResponse.ok) {
        const vendorsData = await vendorsResponse.json();
        setVendors(vendorsData.vendors || []);
      }

      // Load campaigns
      const campaignsResponse = await fetch("/api/admin/ads/campaigns");
      if (campaignsResponse.ok) {
        const campaignsData = await campaignsResponse.json();
        setCampaigns(campaignsData.campaigns || []);
      }

      // Load placements
      const placementsResponse = await fetch("/api/admin/ads/placements");
      if (placementsResponse.ok) {
        const placementsData = await placementsResponse.json();
        setPlacements(placementsData.placements || []);
      }

      // Load analytics
      const analyticsResponse = await fetch("/api/ads/track?limit=100");
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData.analytics || []);
        setAnalyticsSummary(analyticsData.summary || {});
      }

    } catch (error) {
      console.error("Error loading ad data:", error);
      toast({
        title: "Error",
        description: "Failed to load ad data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createVendor = async () => {
    try {
      const response = await fetch("/api/admin/ads/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newVendor,
          config: {
            apiKey: newVendor.apiKey,
            apiSecret: newVendor.apiSecret,
            siteId: newVendor.siteId,
            publisherId: newVendor.publisherId,
            verificationCode: newVendor.verificationCode,
            verificationFile: newVendor.verificationFile,
            adsTxtEntry: newVendor.adsTxtEntry,
            isVerified: newVendor.isVerified
          }
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Ad vendor created successfully",
        });
        setShowCreateVendor(false);
        resetVendorForm();
        setEditingVendor(null);
        loadData();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to create vendor",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating vendor:", error);
      toast({
        title: "Error",
        description: "Failed to create vendor",
        variant: "destructive",
      });
    }
  };

  const updateVendor = async () => {
    if (!editingVendor) return;

    try {
      const response = await fetch(`/api/admin/ads/vendors?id=${editingVendor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newVendor.name,
          type: newVendor.type,
          description: newVendor.description,
          isActive: newVendor.isActive,
          config: {
            apiKey: newVendor.apiKey,
            apiSecret: newVendor.apiSecret,
            siteId: newVendor.siteId,
            publisherId: newVendor.publisherId,
            verificationCode: newVendor.verificationCode,
            verificationFile: newVendor.verificationFile,
            adsTxtEntry: newVendor.adsTxtEntry,
            isVerified: newVendor.isVerified
          }
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Ad vendor updated successfully",
        });
        setShowCreateVendor(false);
        resetVendorForm();
        setEditingVendor(null);
        loadData();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to update vendor",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
      toast({
        title: "Error",
        description: "Failed to update vendor",
        variant: "destructive",
      });
    }
  };

  const deleteVendor = async (vendorId: string, vendorName: string) => {
    if (!confirm(`Are you sure you want to delete "${vendorName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/ads/vendors?id=${vendorId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Ad vendor deleted successfully",
        });
        loadData();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to delete vendor",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast({
        title: "Error",
        description: "Failed to delete vendor",
        variant: "destructive",
      });
    }
  };

  const resetVendorForm = () => {
    setNewVendor({
      name: "",
      type: "GOOGLE_ADSENSE",
      description: "",
      isActive: true,
      apiKey: "",
      apiSecret: "",
      siteId: "",
      publisherId: "",
      verificationCode: "",
      verificationFile: "",
      adsTxtEntry: "",
      isVerified: false
    });
  };

  const getVendorTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      GOOGLE_ADSENSE: "bg-blue-600",
      MONETAGE: "bg-green-600",
      MEDIANET: "bg-purple-600",
      BUZZFEED_ADS: "bg-red-600",
      CUSTOM_HTML: "bg-gray-600",
      CUSTOM_IMAGE: "bg-orange-600",
      CUSTOM_VIDEO: "bg-pink-600",
      AMAZON_ASSOCIATES: "bg-yellow-600",
    };

    return (
      <Badge className={`${colors[type] || "bg-gray-500"} text-white`}>
        {type.replace(/_/g, " ")}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-600",
      DRAFT: "bg-yellow-600",
      PAUSED: "bg-orange-600",
      COMPLETED: "bg-blue-600",
      DISABLED: "bg-red-600",
    };

    return (
      <Badge className={`${colors[status] || "bg-gray-500"} text-white`}>
        {status}
      </Badge>
    );
  };

  if (session?.user?.role !== "SUPERADMIN") {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          You need SUPERADMIN privileges to access ad management.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ad Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage ad vendors, campaigns, and placements across your platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCreatePlacement(true)}
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Placement
          </Button>
          <Button
            onClick={() => setShowCreateCampaign(true)}
            variant="outline"
          >
            <Target className="w-4 h-4 mr-2" />
            Add Campaign
          </Button>
          <Button
            onClick={() => {
              setEditingVendor(null);
              resetVendorForm();
              setShowCreateVendor(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <p className="text-xs text-muted-foreground">
              {vendors.filter(v => v.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.status === "ACTIVE").length}
            </div>
            <p className="text-xs text-muted-foreground">
              of {campaigns.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsSummary.totalViews?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(analyticsSummary.totalRevenue || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {analyticsSummary.ctr?.toFixed(1) || 0}% CTR
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="placements">Placements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Ad Activity</CardTitle>
                <CardDescription>
                  Latest ad interactions across campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {event.eventType === 'view' ? (
                          <Eye className="w-4 h-4 text-blue-500" />
                        ) : event.eventType === 'click' ? (
                          <MousePointer className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-purple-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {event.campaign.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {event.eventType} • {event.placement?.name || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(event.timestamp).toLocaleDateString()}
                        </p>
                        {event.revenue > 0 && (
                          <p className="text-xs text-green-600">
                            ${event.revenue.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>
                  Views and clicks by campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={campaigns.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#3b82f6" name="Views" />
                      <Bar dataKey="clicks" fill="#10b981" name="Clicks" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ad Vendors</CardTitle>
              <CardDescription>
                Manage advertising network integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendors.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No ad vendors configured.</p>
                    <p className="text-sm mt-2">Add your first vendor to get started.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {vendors.map((vendor) => (
                      <Card key={vendor.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Globe className="w-8 h-8 text-blue-500" />
                            <div>
                              <h3 className="font-semibold">{vendor.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                {getVendorTypeBadge(vendor.type)}
                                <Badge variant={vendor.isActive ? "default" : "secondary"}>
                                  {vendor.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              {vendor.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {vendor.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span>{vendor._count.campaigns} campaigns</span>
                                <span>Created {new Date(vendor.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <span className="sr-only">Open menu</span>
                                  ⋮
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  setEditingVendor(vendor);
                                  setShowCreateVendor(true);
                                }}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  // Toggle vendor status
                                  fetch(`/api/admin/ads/vendors?id=${vendor.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ isActive: !vendor.isActive })
                                  })
                                    .then(response => response.json())
                                    .then(data => {
                                      if (data.success) {
                                        toast({
                                          title: "Success",
                                          description: `Vendor ${vendor.isActive ? "deactivated" : "activated"} successfully`,
                                        });
                                        loadData();
                                      } else {
                                        toast({
                                          title: "Error",
                                          description: data.error || "Failed to update vendor status",
                                          variant: "destructive",
                                        });
                                      }
                                    })
                                    .catch(error => {
                                      console.error("Error updating vendor:", error);
                                      toast({
                                        title: "Error",
                                        description: "Failed to update vendor status",
                                        variant: "destructive",
                                      });
                                    });
                                }}>
                                  <Settings className="w-4 h-4 mr-2" />
                                  {vendor.isActive ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => deleteVendor(vendor.id, vendor.name)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ad Campaigns</CardTitle>
              <CardDescription>
                Manage advertising campaigns across placements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No campaigns configured.</p>
                    <p className="text-sm mt-2">Create your first campaign to start serving ads.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {campaigns.map((campaign) => (
                      <Card key={campaign.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {campaign.imageUrl ? (
                              <div className="relative">
                                <img
                                  src={campaign.imageUrl}
                                  alt={campaign.title || campaign.name}
                                  className="w-16 h-12 rounded object-cover"
                                  onError={(e) => {
                                    // Hide image and show fallback if loading fails
                                    e.currentTarget.style.display = 'none';
                                    const nextEl = e.currentTarget.nextElementSibling as HTMLElement | null;
                                    nextEl?.classList.remove('hidden');
                                  }}
                                  onLoad={(e) => {
                                    // Show image and hide fallback if loading succeeds
                                    e.currentTarget.style.display = 'block';
                                    const nextEl = e.currentTarget.nextElementSibling as HTMLElement | null;
                                    nextEl?.classList.add('hidden');
                                  }}
                                />
                                <div className="w-16 h-12 rounded bg-gray-200 items-center justify-center hidden">
                                  <Target className="w-6 h-6 text-gray-400" />
                                </div>
                                {/* Image URL tooltip */}
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" title="Image available" />
                              </div>
                            ) : (
                              <div className="w-16 h-12 rounded bg-gray-200 flex items-center justify-center">
                                <Target className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{campaign.name}</h3>
                                {getStatusBadge(campaign.status)}
                                {campaign.isFeatured && (
                                  <Badge variant="outline">Featured</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {campaign.vendor.name} • Priority {campaign.priority}
                              </p>
                              {campaign.title && (
                                <p className="text-sm mt-1">{campaign.title}</p>
                              )}
                              {campaign.imageUrl && (
                                <div className="flex items-center gap-1 mt-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                                  <span className="text-xs text-muted-foreground truncate max-w-48" title={campaign.imageUrl}>
                                    {campaign.imageUrl}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-6 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {campaign.views.toLocaleString()} views
                                </span>
                                <span className="flex items-center gap-1">
                                  <MousePointer className="w-3 h-3" />
                                  {campaign.clicks.toLocaleString()} clicks
                                </span>
                                {campaign.revenue > 0 && (
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    ${campaign.revenue.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <span className="sr-only">Open menu</span>
                                  ⋮
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  setEditingCampaign(campaign);
                                  setShowCreateCampaign(true);
                                }}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  // Toggle campaign status
                                  const newStatus = campaign.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
                                  fetch(`/api/admin/ads/campaigns?id=${campaign.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: newStatus })
                                  })
                                    .then(response => response.json())
                                    .then(data => {
                                      if (data.success) {
                                        toast({
                                          title: "Success",
                                          description: `Campaign ${campaign.status === 'ACTIVE' ? "paused" : "activated"} successfully`,
                                        });
                                        loadData();
                                      } else {
                                        toast({
                                          title: "Error",
                                          description: data.error || "Failed to update campaign status",
                                          variant: "destructive",
                                        });
                                      }
                                    })
                                    .catch(error => {
                                      console.error("Error updating campaign:", error);
                                      toast({
                                        title: "Error",
                                        description: "Failed to update campaign status",
                                        variant: "destructive",
                                      });
                                    });
                                }}>
                                  <Settings className="w-4 h-4 mr-2" />
                                  {campaign.status === 'ACTIVE' ? "Pause" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <BarChart3 className="w-4 h-4 mr-2" />
                                  View Analytics
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="placements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ad Placements</CardTitle>
              <CardDescription>
                Configure ad display locations across your platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {placements.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No placements configured.</p>
                    <p className="text-sm mt-2">Create placement zones for displaying ads.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {placements.map((placement) => (
                      <Card key={placement.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-12 rounded bg-blue-100 flex items-center justify-center">
                              <Zap className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{placement.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{placement.key}</Badge>
                                <Badge variant={placement.isActive ? "default" : "secondary"}>
                                  {placement.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {placement.type.replace(/_/g, " ")} • {placement._count.campaigns} campaigns
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span>Max: {placement.maxAds} ads</span>
                                <span>Order: {placement.sortOrder}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <span className="sr-only">Open menu</span>
                                  ⋮
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  setEditingPlacement(placement);
                                  setShowCreatePlacement(true);
                                }}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  // Toggle placement status
                                  fetch(`/api/admin/ads/placements?id=${placement.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ isActive: !placement.isActive })
                                  })
                                    .then(response => response.json())
                                    .then(data => {
                                      if (data.success) {
                                        toast({
                                          title: "Success",
                                          description: `Placement ${placement.isActive ? "deactivated" : "activated"} successfully`,
                                        });
                                        loadData();
                                      } else {
                                        toast({
                                          title: "Error",
                                          description: data.error || "Failed to update placement status",
                                          variant: "destructive",
                                        });
                                      }
                                    })
                                    .catch(error => {
                                      console.error("Error updating placement:", error);
                                      toast({
                                        title: "Error",
                                        description: "Failed to update placement status",
                                        variant: "destructive",
                                      });
                                    });
                                }}>
                                  <Settings className="w-4 h-4 mr-2" />
                                  {placement.isActive ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View on Site
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>
                  Latest ad interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.map((event) => (
                    <div key={event.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {event.eventType === 'view' ? (
                          <Eye className="w-4 h-4 text-blue-500" />
                        ) : event.eventType === 'click' ? (
                          <MousePointer className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-purple-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{event.campaign.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.placement?.name || 'Unknown placement'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                        {event.revenue > 0 && (
                          <p className="text-xs text-green-600">
                            ${event.revenue.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>
                  Overall ad performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Views</span>
                    <span className="text-sm">{analyticsSummary.totalViews?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Clicks</span>
                    <span className="text-sm">{analyticsSummary.totalClicks?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Conversions</span>
                    <span className="text-sm">{analyticsSummary.totalConversions?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Click-Through Rate</span>
                    <span className="text-sm">{analyticsSummary.ctr?.toFixed(2) || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Conversion Rate</span>
                    <span className="text-sm">{analyticsSummary.conversionRate?.toFixed(2) || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Total Revenue</span>
                    <span className="text-sm font-bold text-green-600">
                      ${(analyticsSummary.totalRevenue || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Vendor Dialog */}
      <Dialog open={showCreateVendor} onOpenChange={setShowCreateVendor}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVendor ? "Edit Ad Vendor" : "Add New Ad Vendor"}
            </DialogTitle>
            <DialogDescription>
              Configure advertising network integration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor-name">Name *</Label>
                <Input
                  id="vendor-name"
                  value={newVendor.name}
                  onChange={(e) =>
                    setNewVendor({ ...newVendor, name: e.target.value })
                  }
                  placeholder="Vendor name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor-type">Type *</Label>
                <Select
                  value={newVendor.type}
                  onValueChange={(value) =>
                    setNewVendor({ ...newVendor, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GOOGLE_ADSENSE">Google AdSense</SelectItem>
                    <SelectItem value="MONETAGE">Monetage</SelectItem>
                    <SelectItem value="MEDIANET">MediaNet</SelectItem>
                    <SelectItem value="BUZZFEED_ADS">BuzzFeed Ads</SelectItem>
                    <SelectItem value="CUSTOM_HTML">Custom HTML</SelectItem>
                    <SelectItem value="CUSTOM_IMAGE">Custom Image</SelectItem>
                    <SelectItem value="CUSTOM_VIDEO">Custom Video</SelectItem>
                    <SelectItem value="AMAZON_ASSOCIATES">Amazon Associates</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor-description">Description</Label>
              <Textarea
                id="vendor-description"
                value={newVendor.description}
                onChange={(e) =>
                  setNewVendor({ ...newVendor, description: e.target.value })
                }
                placeholder="Describe the ad vendor and its purpose"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor-api-key">API Key</Label>
                <Input
                  id="vendor-api-key"
                  type="password"
                  value={newVendor.apiKey}
                  onChange={(e) =>
                    setNewVendor({ ...newVendor, apiKey: e.target.value })
                  }
                  placeholder="API key or client ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor-api-secret">API Secret</Label>
                <Input
                  id="vendor-api-secret"
                  type="password"
                  value={newVendor.apiSecret}
                  onChange={(e) =>
                    setNewVendor({ ...newVendor, apiSecret: e.target.value })
                  }
                  placeholder="API secret or client secret"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor-site-id">Site ID</Label>
                <Input
                  id="vendor-site-id"
                  value={newVendor.siteId}
                  onChange={(e) =>
                    setNewVendor({ ...newVendor, siteId: e.target.value })
                  }
                  placeholder="Site or publisher ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor-publisher-id">Publisher ID</Label>
                <Input
                  id="vendor-publisher-id"
                  value={newVendor.publisherId}
                  onChange={(e) =>
                    setNewVendor({ ...newVendor, publisherId: e.target.value })
                  }
                  placeholder="Publisher ID"
                />
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Vendor Verification
              </h3>
              <p className="text-sm text-muted-foreground">
                Add verification codes and settings to enable ad vendor verification on your site.
              </p>

              <div className="space-y-2">
                <Label htmlFor="vendor-verification-code">
                  Verification Code / Meta Tag
                </Label>
                <Input
                  id="vendor-verification-code"
                  value={newVendor.verificationCode}
                  onChange={(e) =>
                    setNewVendor({ ...newVendor, verificationCode: e.target.value })
                  }
                  placeholder="e.g., google-site-verification content value"
                />
                <p className="text-xs text-muted-foreground">
                  For Google: Enter the content value from the meta tag (e.g., "abc123xyz...")
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor-ads-txt">ads.txt Entry</Label>
                <Textarea
                  id="vendor-ads-txt"
                  value={newVendor.adsTxtEntry}
                  onChange={(e) =>
                    setNewVendor({ ...newVendor, adsTxtEntry: e.target.value })
                  }
                  placeholder="google.com, pub-XXXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  Format: domain, publisher_id, relationship_type, certification_authority_id
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor-verification-file">
                  Verification File (JSON)
                </Label>
                <Textarea
                  id="vendor-verification-file"
                  value={newVendor.verificationFile}
                  onChange={(e) =>
                    setNewVendor({ ...newVendor, verificationFile: e.target.value })
                  }
                  placeholder={'{"filename": "monetag-verify.html", "content": "<html>...</html>", "contentType": "text/html"}'}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Optional: JSON object with filename, content, and contentType for verification files
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="vendor-verified"
                  checked={newVendor.isVerified}
                  onCheckedChange={(checked) =>
                    setNewVendor({ ...newVendor, isVerified: checked })
                  }
                />
                <Label htmlFor="vendor-verified">Mark as Verified</Label>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="vendor-active"
                checked={newVendor.isActive}
                onCheckedChange={(checked) =>
                  setNewVendor({ ...newVendor, isActive: checked })
                }
              />
              <Label htmlFor="vendor-active">Active</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateVendor(false);
                  setEditingVendor(null);
                  resetVendorForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingVendor ? updateVendor : createVendor}
                disabled={!newVendor.name}
              >
                {editingVendor ? "Update Vendor" : "Create Vendor"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Campaign Dialog */}
      <Dialog open={showCreateCampaign} onOpenChange={setShowCreateCampaign}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign ? "Edit Campaign" : "Add New Campaign"}
            </DialogTitle>
            <DialogDescription>
              Create and configure an advertising campaign
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Campaign Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Campaign Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name *</Label>
                  <Input
                    id="campaign-name"
                    value={newCampaign.name}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, name: e.target.value })
                    }
                    placeholder="Enter campaign name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-vendor">Vendor *</Label>
                  <Select
                    value={newCampaign.vendorId}
                    onValueChange={(value) =>
                      setNewCampaign({ ...newCampaign, vendorId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.filter(v => v.isActive).map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name} ({vendor.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-title">Title</Label>
                <Input
                  id="campaign-title"
                  value={newCampaign.title}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, title: e.target.value })
                  }
                  placeholder="Campaign title (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-description">Description</Label>
                <Textarea
                  id="campaign-description"
                  value={newCampaign.contentDescription}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, contentDescription: e.target.value })
                  }
                  placeholder="Campaign description"
                  rows={3}
                />
              </div>
            </div>

            {/* Ad Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ad Content</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-image">Image URL</Label>
                  <Input
                    id="campaign-image"
                    value={newCampaign.imageUrl}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, imageUrl: e.target.value })
                    }
                    placeholder="https://example.com/ad-image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-link">Link URL</Label>
                  <Input
                    id="campaign-link"
                    value={newCampaign.linkUrl}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, linkUrl: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-cta">Call to Action</Label>
                <Input
                  id="campaign-cta"
                  value={newCampaign.callToAction}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, callToAction: e.target.value })
                  }
                  placeholder="Learn More, Shop Now, etc."
                />
              </div>
            </div>

            {/* Campaign Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Campaign Settings</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-status">Status</Label>
                  <Select
                    value={newCampaign.status}
                    onValueChange={(value) =>
                      setNewCampaign({ ...newCampaign, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="PAUSED">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-priority">Priority</Label>
                  <Input
                    id="campaign-priority"
                    type="number"
                    value={newCampaign.priority}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, priority: parseInt(e.target.value) || 0 })
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-budget">Budget ($)</Label>
                  <Input
                    id="campaign-budget"
                    type="number"
                    value={newCampaign.budget}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, budget: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-start">Start Date</Label>
                  <Input
                    id="campaign-start"
                    type="datetime-local"
                    value={newCampaign.startDate}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-end">End Date</Label>
                  <Input
                    id="campaign-end"
                    type="datetime-local"
                    value={newCampaign.endDate}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="campaign-featured"
                    checked={newCampaign.isFeatured}
                    onCheckedChange={(checked) =>
                      setNewCampaign({ ...newCampaign, isFeatured: checked })
                    }
                  />
                  <Label htmlFor="campaign-featured">Featured</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateCampaign(false);
                  setEditingCampaign(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Create campaign logic
                  console.log("Creating campaign:", newCampaign);
                }}
                disabled={!newCampaign.name || !newCampaign.vendorId}
              >
                {editingCampaign ? "Update Campaign" : "Create Campaign"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Placement Dialog */}
      <Dialog open={showCreatePlacement} onOpenChange={setShowCreatePlacement}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlacement ? "Edit Placement" : "Add New Placement"}
            </DialogTitle>
            <DialogDescription>
              Configure where ads will be displayed
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placement-name">Placement Name *</Label>
                <Input
                  id="placement-name"
                  value={newPlacement.name}
                  onChange={(e) =>
                    setNewPlacement({ ...newPlacement, name: e.target.value })
                  }
                  placeholder="Header Banner, Sidebar, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="placement-key">Placement Key *</Label>
                <Input
                  id="placement-key"
                  value={newPlacement.key}
                  onChange={(e) =>
                    setNewPlacement({ ...newPlacement, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })
                  }
                  placeholder="header_banner, sidebar, etc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="placement-description">Description</Label>
              <Textarea
                id="placement-description"
                value={newPlacement.description}
                onChange={(e) =>
                  setNewPlacement({ ...newPlacement, description: e.target.value })
                }
                placeholder="Describe where this placement appears"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placement-type">Type *</Label>
                <Select
                  value={newPlacement.type}
                  onValueChange={(value) =>
                    setNewPlacement({ ...newPlacement, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HEADER_BANNER">Header Banner</SelectItem>
                    <SelectItem value="SIDEBAR">Sidebar</SelectItem>
                    <SelectItem value="FOOTER">Footer</SelectItem>
                    <SelectItem value="CONTENT_MIDDLE">Content Middle</SelectItem>
                    <SelectItem value="CONTENT_TOP">Content Top</SelectItem>
                    <SelectItem value="CONTENT_BOTTOM">Content Bottom</SelectItem>
                    <SelectItem value="MODAL_POPUP">Modal Popup</SelectItem>
                    <SelectItem value="MOBILE_BOTTOM">Mobile Bottom</SelectItem>
                    <SelectItem value="MOBILE_BANNER">Mobile Banner</SelectItem>
                    <SelectItem value="ARTICLE_MIDDLE">Article Middle</SelectItem>
                    <SelectItem value="TOOL_PAGE_TOP">Tool Page Top</SelectItem>
                    <SelectItem value="TOOL_PAGE_BOTTOM">Tool Page Bottom</SelectItem>
                    <SelectItem value="CUSTOM">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="placement-html-class">CSS Class</Label>
                <Input
                  id="placement-html-class"
                  value={newPlacement.htmlClass}
                  onChange={(e) =>
                    setNewPlacement({ ...newPlacement, htmlClass: e.target.value })
                  }
                  placeholder="ad-banner, sidebar-ad, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placement-width">Width (px)</Label>
                <Input
                  id="placement-width"
                  type="number"
                  value={newPlacement.width}
                  onChange={(e) =>
                    setNewPlacement({ ...newPlacement, width: e.target.value })
                  }
                  placeholder="300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="placement-height">Height (px)</Label>
                <Input
                  id="placement-height"
                  type="number"
                  value={newPlacement.height}
                  onChange={(e) =>
                    setNewPlacement({ ...newPlacement, height: e.target.value })
                  }
                  placeholder="250"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placement-max-ads">Max Ads</Label>
                <Input
                  id="placement-max-ads"
                  type="number"
                  value={newPlacement.maxAds}
                  onChange={(e) =>
                    setNewPlacement({ ...newPlacement, maxAds: parseInt(e.target.value) || 1 })
                  }
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="placement-sort-order">Sort Order</Label>
                <Input
                  id="placement-sort-order"
                  type="number"
                  value={newPlacement.sortOrder}
                  onChange={(e) =>
                    setNewPlacement({ ...newPlacement, sortOrder: parseInt(e.target.value) || 0 })
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="placement-refresh">Refresh Interval (sec)</Label>
                <Input
                  id="placement-refresh"
                  type="number"
                  value={newPlacement.refreshInterval}
                  onChange={(e) =>
                    setNewPlacement({ ...newPlacement, refreshInterval: e.target.value })
                  }
                  placeholder="30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="placement-fallback-image">Fallback Image URL</Label>
              <Input
                id="placement-fallback-image"
                value={newPlacement.fallbackImage}
                onChange={(e) =>
                  setNewPlacement({ ...newPlacement, fallbackImage: e.target.value })
                }
                placeholder="https://example.com/fallback.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placement-fallback-url">Fallback URL</Label>
              <Input
                id="placement-fallback-url"
                value={newPlacement.fallbackUrl}
                onChange={(e) =>
                  setNewPlacement({ ...newPlacement, fallbackUrl: e.target.value })
                }
                placeholder="https://example.com"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="placement-active"
                  checked={newPlacement.isActive}
                  onCheckedChange={(checked) =>
                    setNewPlacement({ ...newPlacement, isActive: checked })
                  }
                />
                <Label htmlFor="placement-active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="placement-responsive"
                  checked={newPlacement.responsive}
                  onCheckedChange={(checked) =>
                    setNewPlacement({ ...newPlacement, responsive: checked })
                  }
                />
                <Label htmlFor="placement-responsive">Responsive</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreatePlacement(false);
                  setEditingPlacement(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Create placement logic
                  console.log("Creating placement:", newPlacement);
                }}
                disabled={!newPlacement.name || !newPlacement.key}
              >
                {editingPlacement ? "Update Placement" : "Create Placement"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}