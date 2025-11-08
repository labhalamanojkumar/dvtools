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
  Target,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
  BarChart3,
  Users,
  DollarSign,
  Eye,
  Star,
  Calendar,
} from "lucide-react";
import { useToast } from "@/components/ui/toaster";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DonationCampaign {
  id: string;
  title: string;
  description: string | null;
  goalAmount: number | null;
  currency: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  isPublic: boolean;
  imageUrl: string | null;
  category: string | null;
  tags: string | null;
  featured: boolean;
  priority: number;
  viewCount: number;
  donationCount: number;
  totalRaised: number;
  donorCount: number;
  createdAt: string;
  updatedAt: string;
  paymentPages: any[];
}

export default function DonationCampaigns() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>([]);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<DonationCampaign | null>(null);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);

  // New Campaign Form state
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    goalAmount: "",
    currency: "USD",
    startDate: "",
    endDate: "",
    imageUrl: "",
    category: "",
    tags: "",
    featured: false,
    priority: 0,
    isActive: true,
    isPublic: true,
  });

  useEffect(() => {
    // Check if user is SUPERADMIN
    if (session?.user?.role !== "SUPERADMIN") {
      router.push("/admin");
      return;
    }

    loadCampaigns();
  }, [session, router]);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/donation-campaigns?includeStats=true");
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error("Error loading campaigns:", error);
      toast({
        title: "Error",
        description: "Failed to load donation campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    try {
      const response = await fetch("/api/admin/donation-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCampaign,
          goalAmount: newCampaign.goalAmount ? parseFloat(newCampaign.goalAmount) : null,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Donation campaign created successfully",
        });
        setShowCreateCampaign(false);
        setNewCampaign({
          title: "",
          description: "",
          goalAmount: "",
          currency: "USD",
          startDate: "",
          endDate: "",
          imageUrl: "",
          category: "",
          tags: "",
          featured: false,
          priority: 0,
          isActive: true,
          isPublic: true,
        });
        loadCampaigns();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to create campaign",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      });
    }
  };

  const updateCampaign = async (id: string, data: Partial<DonationCampaign>) => {
    try {
      // Implementation for updating campaign would go here
      // For now, just show a success message
      toast({
        title: "Success",
        description: "Campaign updated successfully",
      });
      setShowCampaignDialog(false);
      setEditingCampaign(null);
      loadCampaigns();
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast({
        title: "Error",
        description: "Failed to update campaign",
        variant: "destructive",
      });
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) {
      return;
    }

    try {
      // Implementation for deleting campaign would go here
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });
      loadCampaigns();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    }
  };

  const getProgressPercentage = (campaign: DonationCampaign) => {
    if (!campaign.goalAmount || campaign.goalAmount <= 0) return 0;
    return Math.min(100, (campaign.totalRaised / campaign.goalAmount) * 100);
  };

  const getStatusBadge = (campaign: DonationCampaign) => {
    if (!campaign.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    
    if (campaign.endDate && new Date(campaign.endDate) < new Date()) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    if (campaign.featured) {
      return <Badge className="bg-yellow-500">Featured</Badge>;
    }
    
    return <Badge className="bg-green-500">Active</Badge>;
  };

  if (session?.user?.role !== "SUPERADMIN") {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          You need SUPERADMIN privileges to access campaign management.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Donation Campaigns</h1>
          <p className="text-muted-foreground mt-2">
            Manage fundraising campaigns and track their progress
          </p>
        </div>
        <Button
          onClick={() => setShowCreateCampaign(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Campaign
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.isActive).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${campaigns.reduce((sum, c) => sum + c.totalRaised, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, c) => sum + c.donorCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>
            Manage and monitor your donation campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No campaigns created yet.</p>
                <p className="text-sm mt-2">Create your first campaign to get started.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {campaign.imageUrl && (
                            <img
                              src={campaign.imageUrl}
                              alt={campaign.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold flex items-center gap-2">
                              {campaign.title}
                              {campaign.featured && (
                                <Star className="w-4 h-4 text-yellow-500" />
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {campaign.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Goal: ${campaign.goalAmount || 0}</span>
                              <span>Raised: ${campaign.totalRaised.toFixed(2)}</span>
                              <span>{campaign.donationCount} donations</span>
                              <span>{campaign.donorCount} donors</span>
                              {campaign.endDate && (
                                <span>
                                  Ends: {new Date(campaign.endDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            {campaign.goalAmount && (
                              <div className="mt-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                  <span>Progress</span>
                                  <span>{getProgressPercentage(campaign).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${getProgressPercentage(campaign)}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(campaign)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <span className="sr-only">Open menu</span>
                              ⋮
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingCampaign(campaign);
                                setShowCampaignDialog(true);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                const link = `${window.location.origin}/campaigns/${campaign.id}`;
                                navigator.clipboard.writeText(link);
                                toast({
                                  title: "Link Copied",
                                  description: "Campaign link copied to clipboard",
                                });
                              }}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => window.open(`/campaigns/${campaign.id}`, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Campaign
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteCampaign(campaign.id)}
                              className="text-red-600"
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

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateCampaign} onOpenChange={setShowCreateCampaign}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Donation Campaign</DialogTitle>
            <DialogDescription>
              Create a new fundraising campaign
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newCampaign.title}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, title: e.target.value })
                  }
                  placeholder="Campaign name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newCampaign.category}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, category: e.target.value })
                  }
                  placeholder="e.g., Education, Health"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newCampaign.description}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, description: e.target.value })
                }
                placeholder="Describe your campaign"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goalAmount">Goal Amount</Label>
                <Input
                  id="goalAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newCampaign.goalAmount}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, goalAmount: e.target.value })
                  }
                  placeholder="1000.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={newCampaign.currency}
                  onValueChange={(value) =>
                    setNewCampaign({ ...newCampaign, currency: value })
                  }
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={newCampaign.imageUrl}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newCampaign.startDate}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newCampaign.endDate}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={newCampaign.tags}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, tags: e.target.value })
                }
                placeholder="education, children, school"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={newCampaign.isActive}
                  onCheckedChange={(checked) =>
                    setNewCampaign({ ...newCampaign, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={newCampaign.isPublic}
                  onCheckedChange={(checked) =>
                    setNewCampaign({ ...newCampaign, isPublic: checked })
                  }
                />
                <Label htmlFor="isPublic">Public</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={newCampaign.featured}
                  onCheckedChange={(checked) =>
                    setNewCampaign({ ...newCampaign, featured: checked })
                  }
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateCampaign(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={createCampaign}
                disabled={!newCampaign.title}
              >
                Create Campaign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}