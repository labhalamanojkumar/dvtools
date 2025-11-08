"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Heart,
  MessageSquare,
  Mail,
  TrendingUp,
  DollarSign,
  Users,
  Settings,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "@/components/ui/toaster";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DonationManagementPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    donorCount: 0,
    pendingContacts: 0,
    pendingFeedback: 0,
  });
  const [settings, setSettings] = useState({
    stripePublishableKey: "",
    stripeSecretKey: "",
    minimumAmount: 1,
    enableDonations: true,
    thankYouMessage: "",
  });
  const [donations, setDonations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    // Check if user is SUPERADMIN
    if (session?.user?.role !== "SUPERADMIN") {
      router.push("/admin");
      return;
    }

    loadData();
  }, [session, router]);

  const loadData = async () => {
    try {
      // Load donation settings
      const settingsRes = await fetch("/api/admin/donation-settings");
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      }

      // Load stats
      const statsRes = await fetch("/api/admin/donation-stats");
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }

      // Load recent donations
      const donationsRes = await fetch("/api/admin/donations?limit=10");
      if (donationsRes.ok) {
        const data = await donationsRes.json();
        setDonations(data.donations || []);
      }

      // Load contacts
      const contactsRes = await fetch("/api/admin/contacts?limit=10");
      if (contactsRes.ok) {
        const data = await contactsRes.json();
        setContacts(data.contacts || []);
      }

      // Load feedbacks
      const feedbacksRes = await fetch("/api/admin/feedbacks?limit=10");
      if (feedbacksRes.ok) {
        const data = await feedbacksRes.json();
        setFeedbacks(data.feedbacks || []);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/donation-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast({
          title: "Settings Saved",
          description: "Donation settings have been updated successfully.",
        });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (session?.user?.role !== "SUPERADMIN") {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          You need SUPERADMIN privileges to access donation management.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Donation & Communication Management</h1>
        <p className="text-muted-foreground">
          Manage donations, payment settings, contacts, and user feedback
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Donations</p>
                <p className="text-2xl font-bold">{stats.totalDonations}</p>
              </div>
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">${stats.totalAmount.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Donors</p>
                <p className="text-2xl font-bold">{stats.donorCount}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contacts</p>
                <p className="text-2xl font-bold">{stats.pendingContacts}</p>
              </div>
              <Mail className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Feedback</p>
                <p className="text-2xl font-bold">{stats.pendingFeedback}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Payment Settings
          </TabsTrigger>
          <TabsTrigger value="donations">
            <Heart className="h-4 w-4 mr-2" />
            Donations
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <Mail className="h-4 w-4 mr-2" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <MessageSquare className="h-4 w-4 mr-2" />
            Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Stripe Payment Configuration</CardTitle>
              <CardDescription>
                Configure Stripe payment integration for accepting donations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="publishableKey">Stripe Publishable Key</Label>
                <Input
                  id="publishableKey"
                  placeholder="pk_test_..."
                  value={settings.stripePublishableKey}
                  onChange={(e) =>
                    setSettings({ ...settings, stripePublishableKey: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secretKey">Stripe Secret Key</Label>
                <div className="relative">
                  <Input
                    id="secretKey"
                    type={showSecretKey ? "text" : "password"}
                    placeholder="sk_test_..."
                    value={settings.stripeSecretKey}
                    onChange={(e) =>
                      setSettings({ ...settings, stripeSecretKey: e.target.value })
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                  >
                    {showSecretKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimumAmount">Minimum Donation Amount ($)</Label>
                <Input
                  id="minimumAmount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={settings.minimumAmount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      minimumAmount: parseFloat(e.target.value) || 1,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thankYouMessage">Thank You Message</Label>
                <Input
                  id="thankYouMessage"
                  placeholder="Custom message for donors..."
                  value={settings.thankYouMessage}
                  onChange={(e) =>
                    setSettings({ ...settings, thankYouMessage: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableDonations"
                  checked={settings.enableDonations}
                  onChange={(e) =>
                    setSettings({ ...settings, enableDonations: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="enableDonations" className="cursor-pointer">
                  Enable donation feature
                </Label>
              </div>
              <Button onClick={handleSaveSettings} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donations">
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>View and manage donation transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No donations yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    donations.map((donation: any) => (
                      <TableRow key={donation.id}>
                        <TableCell>
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{donation.donorName}</TableCell>
                        <TableCell>${donation.amount.toFixed(2)}</TableCell>
                        <TableCell>{donation.tierId}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              donation.status === "COMPLETED"
                                ? "default"
                                : donation.status === "PENDING"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {donation.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contact Messages</CardTitle>
              <CardDescription>User inquiries and support requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No contact messages
                      </TableCell>
                    </TableRow>
                  ) : (
                    contacts.map((contact: any) => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {contact.subject}
                        </TableCell>
                        <TableCell>
                          <Badge>{contact.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>User Feedback</CardTitle>
              <CardDescription>Feature requests, bugs, and suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No feedback submitted
                      </TableCell>
                    </TableRow>
                  ) : (
                    feedbacks.map((feedback: any) => (
                      <TableRow key={feedback.id}>
                        <TableCell>
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{feedback.name}</TableCell>
                        <TableCell>{feedback.feedbackType}</TableCell>
                        <TableCell>
                          <div className="flex">
                            {Array.from({ length: feedback.rating }).map((_, i) => (
                              <span key={i} className="text-yellow-400">★</span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge>{feedback.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
