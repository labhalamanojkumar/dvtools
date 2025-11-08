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
  CreditCard,
  Save,
  Eye,
  EyeOff,
  RefreshCw,
  Check,
  X,
  AlertCircle,
  Plus,
  Link,
  Copy,
  Edit,
  Trash2,
  ExternalLink,
  BarChart3,
  Target,
} from "lucide-react";
import { useToast } from "@/components/ui/toaster";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface PaymentGatewayConfig {
  id: string;
  gateway: string;
  isEnabled: boolean;
  displayName: string;
  description: string | null;
  publicKey: string | null;
  secretKey: string | null;
  merchantId: string | null;
  webhookSecret: string | null;
  additionalConfig: any;
  displayOrder: number;
  supportedCurrencies: string | null;
  updatedAt: Date;
}

interface PaymentPage {
  id: string;
  title: string;
  description: string | null;
  amount: number | null;
  currency: string;
  slug: string;
  imageUrl: string | null;
  isActive: boolean;
  isPublic: boolean;
  customMessage: string | null;
  successMessage: string | null;
  redirectUrl: string | null;
  campaignId: string | null;
  donationCount: number;
  totalRaised: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function PaymentGatewayManagement() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>([]);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  // Payment Pages state
  const [paymentPages, setPaymentPages] = useState<PaymentPage[]>([]);
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [editingPage, setEditingPage] = useState<PaymentPage | null>(null);
  const [showPageDialog, setShowPageDialog] = useState(false);
  
  // Campaigns state
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");

  // New Payment Page Form state
  const [newPage, setNewPage] = useState({
    title: "",
    description: "",
    amount: "",
    currency: "USD",
    slug: "",
    imageUrl: "",
    customMessage: "",
    successMessage: "",
    redirectUrl: "",
    campaignId: "none",
    isActive: true,
    isPublic: true,
  });

  // Stripe state
  const [stripeConfig, setStripeConfig] = useState({
    isEnabled: false,
    displayName: "Stripe",
    description: "Accept credit card payments worldwide",
    publicKey: "",
    secretKey: "",
    webhookSecret: "",
    supportedCurrencies: "USD,EUR,GBP,CAD,INR",
  });

  // PayPal state
  const [paypalConfig, setPaypalConfig] = useState({
    isEnabled: false,
    displayName: "PayPal",
    description: "Accept PayPal payments",
    publicKey: "", // Client ID
    secretKey: "", // Secret
    webhookSecret: "",
    supportedCurrencies: "USD,EUR,GBP,CAD,AUD,INR",
    sandbox: false,
  });

  // DodoPay state
  const [dodoConfig, setDodoConfig] = useState({
    isEnabled: false,
    displayName: "DodoPay",
    description: "Fast and secure payments",
    secretKey: "", // API Key
    merchantId: "",
    webhookSecret: "",
    supportedCurrencies: "USD,EUR,INR",
    testMode: true,
  });

  // Razorpay state
  const [razorpayConfig, setRazorpayConfig] = useState({
    isEnabled: false,
    displayName: "Razorpay",
    description: "Accept payments in India and globally",
    publicKey: "", // Key ID
    secretKey: "", // Key Secret
    webhookSecret: "",
    supportedCurrencies: "INR,USD,EUR",
  });

  useEffect(() => {
    // Check if user is SUPERADMIN
    if (session?.user?.role !== "SUPERADMIN") {
      router.push("/admin");
      return;
    }

    loadGateways();
    loadPaymentPages();
    loadCampaigns();
  }, [session, router]);

  const loadGateways = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/payment-gateways");
      if (response.ok) {
        const data = await response.json();
        setGateways(data.gateways || []);
        
        // Load existing configurations
        data.gateways.forEach((gw: PaymentGatewayConfig) => {
          if (gw.gateway === "STRIPE") {
            setStripeConfig({
              isEnabled: gw.isEnabled,
              displayName: gw.displayName,
              description: gw.description || "",
              publicKey: gw.publicKey || "",
              secretKey: gw.secretKey || "",
              webhookSecret: gw.webhookSecret || "",
              supportedCurrencies: gw.supportedCurrencies || "USD,EUR,GBP,CAD,INR",
            });
          } else if (gw.gateway === "PAYPAL") {
            setPaypalConfig({
              isEnabled: gw.isEnabled,
              displayName: gw.displayName,
              description: gw.description || "",
              publicKey: gw.publicKey || "",
              secretKey: gw.secretKey || "",
              webhookSecret: gw.webhookSecret || "",
              supportedCurrencies: gw.supportedCurrencies || "USD,EUR,GBP,CAD,AUD,INR",
              sandbox: gw.additionalConfig?.sandbox || false,
            });
          } else if (gw.gateway === "DODOPAYMENTS") {
            setDodoConfig({
              isEnabled: gw.isEnabled,
              displayName: gw.displayName,
              description: gw.description || "",
              secretKey: gw.secretKey || "",
              merchantId: gw.merchantId || "",
              webhookSecret: gw.webhookSecret || "",
              supportedCurrencies: gw.supportedCurrencies || "USD,EUR,INR",
              testMode: gw.additionalConfig?.testMode || true,
            });
          } else if (gw.gateway === "RAZORPAY") {
            setRazorpayConfig({
              isEnabled: gw.isEnabled,
              displayName: gw.displayName,
              description: gw.description || "",
              publicKey: gw.publicKey || "",
              secretKey: gw.secretKey || "",
              webhookSecret: gw.webhookSecret || "",
              supportedCurrencies: gw.supportedCurrencies || "INR,USD,EUR",
            });
          }
        });
      }
    } catch (error) {
      console.error("Error loading gateways:", error);
      toast({
        title: "Error",
        description: "Failed to load payment gateways",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveGateway = async (gateway: string, config: any) => {
    setLoading(true);
    try {
      const payload = {
        gateway,
        ...config,
        additionalConfig: {},
      };

      // Add gateway-specific additional config
      if (gateway === "PAYPAL") {
        payload.additionalConfig = { sandbox: config.sandbox };
      } else if (gateway === "DODOPAYMENTS") {
        payload.additionalConfig = { testMode: config.testMode };
      }

      const response = await fetch("/api/admin/payment-gateways", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${config.displayName} configuration saved successfully`,
        });
        loadGateways();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to save configuration",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving gateway:", error);
      toast({
        title: "Error",
        description: "Failed to save payment gateway configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSecretVisibility = (gateway: string) => {
    setShowSecrets(prev => ({ ...prev, [gateway]: !prev[gateway] }));
  };

  const getGatewayStatus = (gateway: string) => {
    const gw = gateways.find(g => g.gateway === gateway);
    return gw?.isEnabled ? (
      <Badge className="bg-green-500">
        <Check className="w-3 h-3 mr-1" />
        Enabled
      </Badge>
    ) : (
      <Badge variant="secondary">
        <X className="w-3 h-3 mr-1" />
        Disabled
      </Badge>
    );
  };

  // Payment Pages Management Functions
  const loadPaymentPages = async () => {
    try {
      const response = await fetch("/api/admin/payment-pages?includeStats=true");
      if (response.ok) {
        const data = await response.json();
        setPaymentPages(data.pages || []);
      }
    } catch (error) {
      console.error("Error loading payment pages:", error);
      toast({
        title: "Error",
        description: "Failed to load payment pages",
        variant: "destructive",
      });
    }
  };

  const loadCampaigns = async () => {
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
        description: "Failed to load campaigns",
        variant: "destructive",
      });
    }
  };

  const createPaymentPage = async () => {
    try {
      const response = await fetch("/api/admin/payment-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPage,
          amount: newPage.amount ? parseFloat(newPage.amount) : null,
          campaignId: newPage.campaignId === "none" ? null : newPage.campaignId,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment page created successfully",
        });
        setShowCreatePage(false);
        setNewPage({
          title: "",
          description: "",
          amount: "",
          currency: "INR",
          slug: "",
          imageUrl: "",
          customMessage: "",
          successMessage: "",
          redirectUrl: "",
          campaignId: "none",
          isActive: true,
          isPublic: true,
        });
        loadPaymentPages();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to create payment page",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating payment page:", error);
      toast({
        title: "Error",
        description: "Failed to create payment page",
        variant: "destructive",
      });
    }
  };

  const updatePaymentPage = async (id: string, data: Partial<PaymentPage>) => {
    try {
      const response = await fetch("/api/admin/payment-pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment page updated successfully",
        });
        setShowPageDialog(false);
        setEditingPage(null);
        loadPaymentPages();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to update payment page",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating payment page:", error);
      toast({
        title: "Error",
        description: "Failed to update payment page",
        variant: "destructive",
      });
    }
  };

  const deletePaymentPage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment page?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/payment-pages?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment page deleted successfully",
        });
        loadPaymentPages();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to delete payment page",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting payment page:", error);
      toast({
        title: "Error",
        description: "Failed to delete payment page",
        variant: "destructive",
      });
    }
  };

  const copyPageLink = (slug: string) => {
    const link = `${window.location.origin}/pay/${slug}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Payment page link copied to clipboard",
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  if (session?.user?.role !== "SUPERADMIN") {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          You need SUPERADMIN privileges to access payment gateway management.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Gateway Management</h1>
          <p className="text-muted-foreground mt-2">
            Configure payment gateways to accept donations
          </p>
        </div>
        <Button onClick={loadGateways} variant="outline" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["STRIPE", "PAYPAL", "DODOPAYMENTS", "RAZORPAY"].map(gw => (
          <Card key={gw}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{gw}</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {getGatewayStatus(gw)}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stripe Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Stripe Configuration
              </CardTitle>
              <CardDescription className="mt-2">
                Accept credit card payments from customers worldwide
              </CardDescription>
            </div>
            {getGatewayStatus("STRIPE")}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={stripeConfig.isEnabled}
              onCheckedChange={(checked) =>
                setStripeConfig({ ...stripeConfig, isEnabled: checked })
              }
            />
            <Label>Enable Stripe</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stripe-display-name">Display Name</Label>
              <Input
                id="stripe-display-name"
                value={stripeConfig.displayName}
                onChange={(e) =>
                  setStripeConfig({ ...stripeConfig, displayName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripe-currencies">Supported Currencies</Label>
              <Input
                id="stripe-currencies"
                value={stripeConfig.supportedCurrencies}
                onChange={(e) =>
                  setStripeConfig({ ...stripeConfig, supportedCurrencies: e.target.value })
                }
                placeholder="USD,EUR,GBP,CAD"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripe-description">Description</Label>
            <Textarea
              id="stripe-description"
              value={stripeConfig.description}
              onChange={(e) =>
                setStripeConfig({ ...stripeConfig, description: e.target.value })
              }
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripe-public-key">Publishable Key</Label>
            <Input
              id="stripe-public-key"
              value={stripeConfig.publicKey}
              onChange={(e) =>
                setStripeConfig({ ...stripeConfig, publicKey: e.target.value })
              }
              placeholder="pk_test_..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripe-secret-key">Secret Key</Label>
            <div className="flex space-x-2">
              <Input
                id="stripe-secret-key"
                type={showSecrets["stripe"] ? "text" : "password"}
                value={stripeConfig.secretKey}
                onChange={(e) =>
                  setStripeConfig({ ...stripeConfig, secretKey: e.target.value })
                }
                placeholder="sk_test_..."
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleSecretVisibility("stripe")}
              >
                {showSecrets["stripe"] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripe-webhook-secret">Webhook Secret (Optional)</Label>
            <Input
              id="stripe-webhook-secret"
              type={showSecrets["stripe-webhook"] ? "text" : "password"}
              value={stripeConfig.webhookSecret}
              onChange={(e) =>
                setStripeConfig({ ...stripeConfig, webhookSecret: e.target.value })
              }
              placeholder="whsec_..."
            />
          </div>

          <Button
            onClick={() => saveGateway("STRIPE", stripeConfig)}
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Stripe Configuration
          </Button>
        </CardContent>
      </Card>

      {/* PayPal Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                PayPal Configuration
              </CardTitle>
              <CardDescription className="mt-2">
                Accept PayPal payments from customers worldwide
              </CardDescription>
            </div>
            {getGatewayStatus("PAYPAL")}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={paypalConfig.isEnabled}
              onCheckedChange={(checked) =>
                setPaypalConfig({ ...paypalConfig, isEnabled: checked })
              }
            />
            <Label>Enable PayPal</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={paypalConfig.sandbox}
              onCheckedChange={(checked) =>
                setPaypalConfig({ ...paypalConfig, sandbox: checked })
              }
            />
            <Label>Use Sandbox Mode (Testing)</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paypal-display-name">Display Name</Label>
              <Input
                id="paypal-display-name"
                value={paypalConfig.displayName}
                onChange={(e) =>
                  setPaypalConfig({ ...paypalConfig, displayName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paypal-currencies">Supported Currencies</Label>
              <Input
                id="paypal-currencies"
                value={paypalConfig.supportedCurrencies}
                onChange={(e) =>
                  setPaypalConfig({ ...paypalConfig, supportedCurrencies: e.target.value })
                }
                placeholder="USD,EUR,GBP,CAD,AUD"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paypal-description">Description</Label>
            <Textarea
              id="paypal-description"
              value={paypalConfig.description}
              onChange={(e) =>
                setPaypalConfig({ ...paypalConfig, description: e.target.value })
              }
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paypal-client-id">Client ID</Label>
            <Input
              id="paypal-client-id"
              value={paypalConfig.publicKey}
              onChange={(e) =>
                setPaypalConfig({ ...paypalConfig, publicKey: e.target.value })
              }
              placeholder="Client ID from PayPal Dashboard"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paypal-secret">Client Secret</Label>
            <div className="flex space-x-2">
              <Input
                id="paypal-secret"
                type={showSecrets["paypal"] ? "text" : "password"}
                value={paypalConfig.secretKey}
                onChange={(e) =>
                  setPaypalConfig({ ...paypalConfig, secretKey: e.target.value })
                }
                placeholder="Secret from PayPal Dashboard"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleSecretVisibility("paypal")}
              >
                {showSecrets["paypal"] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button
            onClick={() => saveGateway("PAYPAL", paypalConfig)}
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            Save PayPal Configuration
          </Button>
        </CardContent>
      </Card>

      {/* DodoPay Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                DodoPay Configuration
              </CardTitle>
              <CardDescription className="mt-2">
                Fast and secure payment processing
              </CardDescription>
            </div>
            {getGatewayStatus("DODOPAYMENTS")}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={dodoConfig.isEnabled}
              onCheckedChange={(checked) =>
                setDodoConfig({ ...dodoConfig, isEnabled: checked })
              }
            />
            <Label>Enable DodoPay</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={dodoConfig.testMode}
              onCheckedChange={(checked) =>
                setDodoConfig({ ...dodoConfig, testMode: checked })
              }
            />
            <Label>Use Test Mode</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dodo-display-name">Display Name</Label>
              <Input
                id="dodo-display-name"
                value={dodoConfig.displayName}
                onChange={(e) =>
                  setDodoConfig({ ...dodoConfig, displayName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dodo-currencies">Supported Currencies</Label>
              <Input
                id="dodo-currencies"
                value={dodoConfig.supportedCurrencies}
                onChange={(e) =>
                  setDodoConfig({ ...dodoConfig, supportedCurrencies: e.target.value })
                }
                placeholder="USD,EUR"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dodo-description">Description</Label>
            <Textarea
              id="dodo-description"
              value={dodoConfig.description}
              onChange={(e) =>
                setDodoConfig({ ...dodoConfig, description: e.target.value })
              }
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dodo-merchant-id">Merchant ID</Label>
            <Input
              id="dodo-merchant-id"
              value={dodoConfig.merchantId}
              onChange={(e) =>
                setDodoConfig({ ...dodoConfig, merchantId: e.target.value })
              }
              placeholder="Merchant ID from DodoPay"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dodo-api-key">API Key</Label>
            <div className="flex space-x-2">
              <Input
                id="dodo-api-key"
                type={showSecrets["dodo"] ? "text" : "password"}
                value={dodoConfig.secretKey}
                onChange={(e) =>
                  setDodoConfig({ ...dodoConfig, secretKey: e.target.value })
                }
                placeholder="API Key from DodoPay"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleSecretVisibility("dodo")}
              >
                {showSecrets["dodo"] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button
            onClick={() => saveGateway("DODOPAYMENTS", dodoConfig)}
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            Save DodoPay Configuration
          </Button>
        </CardContent>
      </Card>

      {/* Razorpay Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Razorpay Configuration
              </CardTitle>
              <CardDescription className="mt-2">
                Accept payments in India and globally
              </CardDescription>
            </div>
            {getGatewayStatus("RAZORPAY")}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={razorpayConfig.isEnabled}
              onCheckedChange={(checked) =>
                setRazorpayConfig({ ...razorpayConfig, isEnabled: checked })
              }
            />
            <Label>Enable Razorpay</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="razorpay-display-name">Display Name</Label>
              <Input
                id="razorpay-display-name"
                value={razorpayConfig.displayName}
                onChange={(e) =>
                  setRazorpayConfig({ ...razorpayConfig, displayName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="razorpay-currencies">Supported Currencies</Label>
              <Input
                id="razorpay-currencies"
                value={razorpayConfig.supportedCurrencies}
                onChange={(e) =>
                  setRazorpayConfig({ ...razorpayConfig, supportedCurrencies: e.target.value })
                }
                placeholder="INR,USD,EUR"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="razorpay-description">Description</Label>
            <Textarea
              id="razorpay-description"
              value={razorpayConfig.description}
              onChange={(e) =>
                setRazorpayConfig({ ...razorpayConfig, description: e.target.value })
              }
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="razorpay-key-id">Key ID</Label>
            <Input
              id="razorpay-key-id"
              value={razorpayConfig.publicKey}
              onChange={(e) =>
                setRazorpayConfig({ ...razorpayConfig, publicKey: e.target.value })
              }
              placeholder="rzp_test_... or rzp_live_..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="razorpay-key-secret">Key Secret</Label>
            <div className="flex space-x-2">
              <Input
                id="razorpay-key-secret"
                type={showSecrets["razorpay"] ? "text" : "password"}
                value={razorpayConfig.secretKey}
                onChange={(e) =>
                  setRazorpayConfig({ ...razorpayConfig, secretKey: e.target.value })
                }
                placeholder="Key Secret from Razorpay Dashboard"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleSecretVisibility("razorpay")}
              >
                {showSecrets["razorpay"] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button
            onClick={() => saveGateway("RAZORPAY", razorpayConfig)}
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Razorpay Configuration
          </Button>
        </CardContent>
      </Card>

      {/* Payment Pages Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Link className="w-5 h-5 mr-2" />
                Payment Pages
              </CardTitle>
              <CardDescription className="mt-2">
                Create direct donation links with custom pages
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowCreatePage(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Page
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Payment Pages Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
                <Link className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paymentPages.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Pages</CardTitle>
                <Check className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {paymentPages.filter(p => p.isActive).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${paymentPages.reduce((sum, p) => sum + p.totalRaised, 0).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Pages List */}
          <div className="space-y-4">
            {paymentPages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No payment pages created yet.</p>
                <p className="text-sm mt-2">Create your first payment page to get started.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {paymentPages.map((page) => (
                  <Card key={page.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{page.title}</h3>
                              {/* Campaign Tag */}
                              {page.campaignId && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  <Target className="w-3 h-3 mr-1" />
                                  Campaign Linked
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {page.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Slug: /pay/{page.slug}</span>
                              {page.amount && (
                                <span>Amount: {page.currency} {page.amount}</span>
                              )}
                              <span>Views: {page.viewCount}</span>
                              <span>Donations: {page.donationCount}</span>
                              <span>Raised: ${page.totalRaised.toFixed(2)}</span>
                              {/* Campaign Info */}
                              {page.campaignId && (
                                <span className="text-blue-600 font-medium">
                                  Part of campaign
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={page.isActive ? "default" : "secondary"}>
                          {page.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant={page.isPublic ? "default" : "outline"}>
                          {page.isPublic ? "Public" : "Private"}
                        </Badge>
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
                                setEditingPage(page);
                                setShowPageDialog(true);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => copyPageLink(page.slug)}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => window.open(`/pay/${page.slug}`, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Page
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deletePaymentPage(page.id)}
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

      {/* Create Payment Page Dialog */}
      <Dialog open={showCreatePage} onOpenChange={setShowCreatePage}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Payment Page</DialogTitle>
            <DialogDescription>
              Create a direct donation link with a custom page
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newPage.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setNewPage({
                      ...newPage,
                      title,
                      slug: newPage.slug || generateSlug(title),
                    });
                  }}
                  placeholder="Campaign or cause name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={newPage.slug}
                  onChange={(e) =>
                    setNewPage({ ...newPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })
                  }
                  placeholder="my-campaign"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newPage.description}
                onChange={(e) =>
                  setNewPage({ ...newPage, description: e.target.value })
                }
                placeholder="Describe your campaign or cause"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (Optional)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newPage.amount}
                  onChange={(e) =>
                    setNewPage({ ...newPage, amount: e.target.value })
                  }
                  placeholder="Leave empty for custom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={newPage.currency}
                  onValueChange={(value) =>
                    setNewPage({ ...newPage, currency: value })
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
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  value={newPage.imageUrl}
                  onChange={(e) =>
                    setNewPage({ ...newPage, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaignId">Campaign (Optional)</Label>
              <Select
                value={newPage.campaignId}
                onValueChange={(value) =>
                  setNewPage({ ...newPage, campaignId: value })
                }
              >
                <SelectTrigger id="campaignId">
                  <SelectValue placeholder="Select a campaign or leave empty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Campaign</SelectItem>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customMessage">Custom Message</Label>
              <Textarea
                id="customMessage"
                value={newPage.customMessage}
                onChange={(e) =>
                  setNewPage({ ...newPage, customMessage: e.target.value })
                }
                placeholder="Message to display on the donation page"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="successMessage">Success Message</Label>
              <Textarea
                id="successMessage"
                value={newPage.successMessage}
                onChange={(e) =>
                  setNewPage({ ...newPage, successMessage: e.target.value })
                }
                placeholder="Message to show after successful donation"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="redirectUrl">Redirect URL (Optional)</Label>
              <Input
                id="redirectUrl"
                value={newPage.redirectUrl}
                onChange={(e) =>
                  setNewPage({ ...newPage, redirectUrl: e.target.value })
                }
                placeholder="https://example.com/thank-you"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={newPage.isActive}
                  onCheckedChange={(checked) =>
                    setNewPage({ ...newPage, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={newPage.isPublic}
                  onCheckedChange={(checked) =>
                    setNewPage({ ...newPage, isPublic: checked })
                  }
                />
                <Label htmlFor="isPublic">Public</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreatePage(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={createPaymentPage}
                disabled={!newPage.title || !newPage.slug}
              >
                Create Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Payment Page Dialog */}
      <Dialog open={showPageDialog} onOpenChange={setShowPageDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Payment Page</DialogTitle>
            <DialogDescription>
              Update your payment page settings
            </DialogDescription>
          </DialogHeader>
          {editingPage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input
                    id="edit-title"
                    value={editingPage.title}
                    onChange={(e) =>
                      setEditingPage({ ...editingPage, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-slug">URL Slug *</Label>
                  <Input
                    id="edit-slug"
                    value={editingPage.slug}
                    onChange={(e) =>
                      setEditingPage({
                        ...editingPage,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingPage.description || ""}
                  onChange={(e) =>
                    setEditingPage({ ...editingPage, description: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-amount">Amount (Optional)</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingPage.amount || ""}
                    onChange={(e) =>
                      setEditingPage({
                        ...editingPage,
                        amount: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-currency">Currency</Label>
                  <Select
                    value={editingPage.currency}
                    onValueChange={(value) =>
                      setEditingPage({ ...editingPage, currency: value })
                    }
                  >
                    <SelectTrigger id="edit-currency">
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
                  <Label htmlFor="edit-imageUrl">Image URL (Optional)</Label>
                  <Input
                    id="edit-imageUrl"
                    value={editingPage.imageUrl || ""}
                    onChange={(e) =>
                      setEditingPage({ ...editingPage, imageUrl: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-campaignId">Campaign (Optional)</Label>
                <Select
                  value={editingPage.campaignId || "none"}
                  onValueChange={(value) =>
                    setEditingPage({ ...editingPage, campaignId: value === "none" ? null : value })
                  }
                >
                  <SelectTrigger id="edit-campaignId">
                    <SelectValue placeholder="Select a campaign or leave empty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Campaign</SelectItem>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-customMessage">Custom Message</Label>
                <Textarea
                  id="edit-customMessage"
                  value={editingPage.customMessage || ""}
                  onChange={(e) =>
                    setEditingPage({ ...editingPage, customMessage: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-successMessage">Success Message</Label>
                <Textarea
                  id="edit-successMessage"
                  value={editingPage.successMessage || ""}
                  onChange={(e) =>
                    setEditingPage({ ...editingPage, successMessage: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-redirectUrl">Redirect URL (Optional)</Label>
                <Input
                  id="edit-redirectUrl"
                  value={editingPage.redirectUrl || ""}
                  onChange={(e) =>
                    setEditingPage({ ...editingPage, redirectUrl: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isActive"
                    checked={editingPage.isActive}
                    onCheckedChange={(checked) =>
                      setEditingPage({ ...editingPage, isActive: checked })
                    }
                  />
                  <Label htmlFor="edit-isActive">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isPublic"
                    checked={editingPage.isPublic}
                    onCheckedChange={(checked) =>
                      setEditingPage({ ...editingPage, isPublic: checked })
                    }
                  />
                  <Label htmlFor="edit-isPublic">Public</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPageDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => updatePaymentPage(editingPage.id, editingPage)}
                  disabled={!editingPage.title || !editingPage.slug}
                >
                  Update Page
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Setup Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Stripe Setup</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Sign up at <a href="https://stripe.com" target="_blank" className="text-blue-500 hover:underline">stripe.com</a></li>
              <li>Get your API keys from Dashboard → Developers → API keys</li>
              <li>Use test keys (pk_test_... and sk_test_...) for testing</li>
              <li>Configure webhook endpoint at /api/webhooks/stripe for production</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold mb-2">PayPal Setup</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Sign up at <a href="https://developer.paypal.com" target="_blank" className="text-blue-500 hover:underline">developer.paypal.com</a></li>
              <li>Create a REST API app in your Dashboard</li>
              <li>Get your Client ID and Secret from the app settings</li>
              <li>Use sandbox mode for testing, disable for production</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold mb-2">DodoPay Setup</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Sign up at <a href="https://dodopayments.com" target="_blank" className="text-blue-500 hover:underline">dodopayments.com</a></li>
              <li>Get your Merchant ID and API Key from the dashboard</li>
              <li>Enable test mode for development</li>
              <li>Configure webhook endpoint at /api/webhooks/dodopay</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Razorpay Setup</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Sign up at <a href="https://razorpay.com" target="_blank" className="text-blue-500 hover:underline">razorpay.com</a></li>
              <li>Get your Key ID and Key Secret from Settings → API Keys</li>
              <li>Use test keys for development, live keys for production</li>
              <li>Configure webhook endpoint at /api/webhooks/razorpay</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
