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
  Heart,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Crown,
  Star,
  Calendar,
  Users,
  DollarSign,
  Building,
  Globe,
  Mail,
} from "lucide-react";
import { useToast } from "@/components/ui/toaster";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Sponsor {
  id: string;
  name: string;
  email: string;
  company: string | null;
  website: string | null;
  logo: string | null;
  amount: number;
  tier: string;
  description: string | null;
  message: string | null;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  donation: {
    id: string;
    amount: number;
    donorName: string | null;
    createdAt: string;
  } | null;
}

export default function SponsorsAdmin() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [showCreateSponsor, setShowCreateSponsor] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [showSponsorDialog, setShowSponsorDialog] = useState(false);
  const [filter, setFilter] = useState("all");

  // New Sponsor Form state
  const [newSponsor, setNewSponsor] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    logo: "",
    amount: "",
    tier: "Bronze",
    description: "",
    message: "",
    isActive: true,
    isFeatured: false,
    displayOrder: 0,
    startDate: "",
    endDate: "",
  });

  const tiers = ["Bronze", "Silver", "Gold", "Platinum"];

  useEffect(() => {
    // Check if user is SUPERADMIN
    if (session?.user?.role !== "SUPERADMIN") {
      router.push("/admin");
      return;
    }

    loadSponsors();
  }, [session, router, filter]);

  const loadSponsors = async () => {
    setLoading(true);
    try {
      const queryParam = filter !== "all" ? `?filter=${filter}` : "";
      const response = await fetch(`/api/admin/sponsors${queryParam}`);
      if (response.ok) {
        const data = await response.json();
        setSponsors(data.sponsors || []);
      }
    } catch (error) {
      console.error("Error loading sponsors:", error);
      toast({
        title: "Error",
        description: "Failed to load sponsors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSponsor = async () => {
    try {
      const response = await fetch("/api/admin/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newSponsor,
          amount: newSponsor.amount ? parseFloat(newSponsor.amount) : 0,
          displayOrder: parseInt(newSponsor.displayOrder.toString()) || 0,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Sponsor created successfully",
        });
        setShowCreateSponsor(false);
        setNewSponsor({
          name: "",
          email: "",
          company: "",
          website: "",
          logo: "",
          amount: "",
          tier: "Bronze",
          description: "",
          message: "",
          isActive: true,
          isFeatured: false,
          displayOrder: 0,
          startDate: "",
          endDate: "",
        });
        loadSponsors();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to create sponsor",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating sponsor:", error);
      toast({
        title: "Error",
        description: "Failed to create sponsor",
        variant: "destructive",
      });
    }
  };

  const updateSponsor = async (id: string, data: Partial<Sponsor>) => {
    try {
      const response = await fetch(`/api/admin/sponsors?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Sponsor updated successfully",
        });
        setShowSponsorDialog(false);
        setEditingSponsor(null);
        loadSponsors();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to update sponsor",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating sponsor:", error);
      toast({
        title: "Error",
        description: "Failed to update sponsor",
        variant: "destructive",
      });
    }
  };

  const deleteSponsor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sponsor?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/sponsors?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Sponsor deleted successfully",
        });
        loadSponsors();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to delete sponsor",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting sponsor:", error);
      toast({
        title: "Error",
        description: "Failed to delete sponsor",
        variant: "destructive",
      });
    }
  };

  const getTierBadge = (tier: string) => {
    const colors: Record<string, string> = {
      Bronze: "bg-amber-700",
      Silver: "bg-gray-400",
      Gold: "bg-yellow-500",
      Platinum: "bg-purple-500",
    };
    
    return (
      <Badge className={`${colors[tier] || colors.Bronze} text-white`}>
        {tier}
      </Badge>
    );
  };

  const getTotalAmount = () => {
    return sponsors.reduce((sum, sponsor) => sum + sponsor.amount, 0);
  };

  const getFeaturedCount = () => {
    return sponsors.filter(s => s.isFeatured).length;
  };

  const getActiveCount = () => {
    return sponsors.filter(s => s.isActive).length;
  };

  if (session?.user?.role !== "SUPERADMIN") {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          You need SUPERADMIN privileges to access sponsor management.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sponsors Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage sponsors who have contributed significantly to your cause
          </p>
        </div>
        <Button
          onClick={() => setShowCreateSponsor(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Sponsor
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sponsors</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sponsors.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sponsors</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getActiveCount()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Sponsors</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getFeaturedCount()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${getTotalAmount().toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Label>Filter:</Label>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sponsors</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="featured">Featured Only</SelectItem>
            <SelectItem value="platinum">Platinum Tier</SelectItem>
            <SelectItem value="gold">Gold Tier</SelectItem>
            <SelectItem value="silver">Silver Tier</SelectItem>
            <SelectItem value="bronze">Bronze Tier</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sponsors List */}
      <Card>
        <CardHeader>
          <CardTitle>All Sponsors</CardTitle>
          <CardDescription>
            Manage and review your sponsor relationships
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sponsors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No sponsors found.</p>
                <p className="text-sm mt-2">Add your first sponsor to get started.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {sponsors.map((sponsor) => (
                  <Card key={sponsor.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {sponsor.logo ? (
                            <img
                              src={sponsor.logo}
                              alt={sponsor.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                              <Building className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold flex items-center gap-2">
                              {sponsor.name}
                              {sponsor.isFeatured && (
                                <Crown className="w-4 h-4 text-yellow-500" />
                              )}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              {sponsor.company && (
                                <span className="flex items-center gap-1">
                                  <Building className="w-3 h-3" />
                                  {sponsor.company}
                                </span>
                              )}
                              {sponsor.website && (
                                <span className="flex items-center gap-1">
                                  <Globe className="w-3 h-3" />
                                  {sponsor.website}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {sponsor.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                ${sponsor.amount.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              {getTierBadge(sponsor.tier)}
                              {!sponsor.isActive && (
                                <Badge variant="secondary">Inactive</Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                Order: {sponsor.displayOrder}
                              </span>
                              {sponsor.startDate && (
                                <span className="text-xs text-muted-foreground">
                                  Starts: {new Date(sponsor.startDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            {(sponsor.description || sponsor.message) && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {sponsor.description || sponsor.message}
                              </p>
                            )}
                            {sponsor.donation && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Linked to donation #{sponsor.donation.id} (${sponsor.donation.amount.toFixed(2)})
                              </p>
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
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingSponsor(sponsor);
                                setShowSponsorDialog(true);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateSponsor(sponsor.id, { isFeatured: !sponsor.isFeatured })}
                            >
                              <Crown className="w-4 h-4 mr-2" />
                              {sponsor.isFeatured ? "Remove Featured" : "Make Featured"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateSponsor(sponsor.id, { isActive: !sponsor.isActive })}
                            >
                              <Star className="w-4 h-4 mr-2" />
                              {sponsor.isActive ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => window.open("/sponsors", '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View on Site
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteSponsor(sponsor.id)}
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

      {/* Create Sponsor Dialog */}
      <Dialog open={showCreateSponsor} onOpenChange={setShowCreateSponsor}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Sponsor</DialogTitle>
            <DialogDescription>
              Create a new sponsor entry manually or link to a donation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newSponsor.name}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, name: e.target.value })
                  }
                  placeholder="Sponsor name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newSponsor.email}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, email: e.target.value })
                  }
                  placeholder="sponsor@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={newSponsor.company}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, company: e.target.value })
                  }
                  placeholder="Company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={newSponsor.website}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, website: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={newSponsor.logo}
                onChange={(e) =>
                  setNewSponsor({ ...newSponsor, logo: e.target.value })
                }
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newSponsor.amount}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, amount: e.target.value })
                  }
                  placeholder="199.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tier">Tier *</Label>
                <Select
                  value={newSponsor.tier}
                  onValueChange={(value) =>
                    setNewSponsor({ ...newSponsor, tier: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiers.map((tier) => (
                      <SelectItem key={tier} value={tier}>
                        {tier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={newSponsor.displayOrder}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, displayOrder: parseInt(e.target.value) || 0 })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newSponsor.description}
                onChange={(e) =>
                  setNewSponsor({ ...newSponsor, description: e.target.value })
                }
                placeholder="Describe the sponsor or their contribution"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={newSponsor.message}
                onChange={(e) =>
                  setNewSponsor({ ...newSponsor, message: e.target.value })
                }
                placeholder="Optional message from the sponsor"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newSponsor.startDate}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newSponsor.endDate}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={newSponsor.isActive}
                  onCheckedChange={(checked) =>
                    setNewSponsor({ ...newSponsor, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={newSponsor.isFeatured}
                  onCheckedChange={(checked) =>
                    setNewSponsor({ ...newSponsor, isFeatured: checked })
                  }
                />
                <Label htmlFor="isFeatured">Featured</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateSponsor(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={createSponsor}
                disabled={!newSponsor.name || !newSponsor.email || !newSponsor.amount}
              >
                Create Sponsor
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Sponsor Dialog */}
      <Dialog open={showSponsorDialog} onOpenChange={setShowSponsorDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Sponsor</DialogTitle>
            <DialogDescription>
              Update sponsor information
            </DialogDescription>
          </DialogHeader>
          {editingSponsor && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name *</Label>
                  <Input
                    id="edit-name"
                    value={editingSponsor.name}
                    onChange={(e) =>
                      setEditingSponsor({ ...editingSponsor, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingSponsor.email}
                    onChange={(e) =>
                      setEditingSponsor({ ...editingSponsor, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Company</Label>
                  <Input
                    id="edit-company"
                    value={editingSponsor.company || ""}
                    onChange={(e) =>
                      setEditingSponsor({ ...editingSponsor, company: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-website">Website</Label>
                  <Input
                    id="edit-website"
                    value={editingSponsor.website || ""}
                    onChange={(e) =>
                      setEditingSponsor({ ...editingSponsor, website: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-logo">Logo URL</Label>
                <Input
                  id="edit-logo"
                  value={editingSponsor.logo || ""}
                  onChange={(e) =>
                    setEditingSponsor({ ...editingSponsor, logo: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-amount">Amount *</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingSponsor.amount}
                    onChange={(e) =>
                      setEditingSponsor({ ...editingSponsor, amount: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tier">Tier *</Label>
                  <Select
                    value={editingSponsor.tier}
                    onValueChange={(value) =>
                      setEditingSponsor({ ...editingSponsor, tier: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tiers.map((tier) => (
                        <SelectItem key={tier} value={tier}>
                          {tier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-displayOrder">Display Order</Label>
                  <Input
                    id="edit-displayOrder"
                    type="number"
                    value={editingSponsor.displayOrder}
                    onChange={(e) =>
                      setEditingSponsor({ ...editingSponsor, displayOrder: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingSponsor.description || ""}
                  onChange={(e) =>
                    setEditingSponsor({ ...editingSponsor, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-message">Message</Label>
                <Textarea
                  id="edit-message"
                  value={editingSponsor.message || ""}
                  onChange={(e) =>
                    setEditingSponsor({ ...editingSponsor, message: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={editingSponsor.startDate || ""}
                    onChange={(e) =>
                      setEditingSponsor({ ...editingSponsor, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">End Date</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={editingSponsor.endDate || ""}
                    onChange={(e) =>
                      setEditingSponsor({ ...editingSponsor, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isActive"
                    checked={editingSponsor.isActive}
                    onCheckedChange={(checked) =>
                      setEditingSponsor({ ...editingSponsor, isActive: checked })
                    }
                  />
                  <Label htmlFor="edit-isActive">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isFeatured"
                    checked={editingSponsor.isFeatured}
                    onCheckedChange={(checked) =>
                      setEditingSponsor({ ...editingSponsor, isFeatured: checked })
                    }
                  />
                  <Label htmlFor="edit-isFeatured">Featured</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSponsorDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => updateSponsor(editingSponsor.id, editingSponsor)}
                  disabled={!editingSponsor.name || !editingSponsor.email}
                >
                  Update Sponsor
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}