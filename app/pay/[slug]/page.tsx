"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  CreditCard,
  ArrowLeft,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Target,
  Users,
} from "lucide-react";
import { useToast } from "@/components/ui/toaster";

interface PaymentPageData {
  id: string;
  title: string;
  description: string | null;
  amount: number | null;
  currency: string;
  imageUrl: string | null;
  customMessage: string | null;
  successMessage: string | null;
  redirectUrl: string | null;
  donationCount: number;
  totalRaised: number;
  // Campaign information
  campaign?: {
    id: string;
    title: string;
    description: string | null;
    goalAmount: number | null;
    totalRaised: number;
    donorCount: number;
    progressPercentage: number;
  } | null;
}

interface PaymentGateway {
  gateway: string;
  displayName: string;
  description: string | null;
  publicKey: string | null;
  supportedCurrencies: string | null;
}

export default function DirectDonationPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { toast } = useToast();
  const [page, setPage] = useState<PaymentPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [customAmount, setCustomAmount] = useState("");

  useEffect(() => {
    if (slug) {
      loadPaymentPage(slug as string);
      loadPaymentGateways();
    }
  }, [slug]);

  const loadPaymentPage = async (slug: string) => {
    try {
      // First try to get specific page
      const response = await fetch(`/api/payment-page/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setPage(data.page);
        if (data.page.amount) {
          setCustomAmount(data.page.amount.toString());
        }
      } else {
        throw new Error("Payment page not found");
      }
    } catch (error) {
      console.error("Error loading payment page:", error);
      toast({
        title: "Page Not Found",
        description: "The payment page you're looking for doesn't exist.",
        variant: "destructive",
      });
      router.push("/donate");
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentGateways = async () => {
    try {
      const response = await fetch("/api/payment-gateways");
      if (response.ok) {
        const data = await response.json();
        setPaymentGateways(data.gateways || []);
        if (data.gateways && data.gateways.length > 0) {
          setSelectedGateway(data.gateways[0].gateway);
        }
      }
    } catch (error) {
      console.error("Error loading payment gateways:", error);
    }
  };

  const handleDonate = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please provide your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedGateway) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch("/api/donations/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          name: name || "Anonymous",
          email,
          tierId: `payment_page_${page?.id}`,
          gateway: selectedGateway,
          pageId: page?.id,
          pageSlug: slug,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to Payment Gateway Checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to process donation. Please try again.",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Loading payment page...</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The payment page you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/donate")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Donations
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-6">
        <Button
          onClick={() => router.push("/donate")}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Donations
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Payment Page Info */}
        <div>
          <Card>
            {page.imageUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <img
                  src={page.imageUrl}
                  alt={page.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{page.title}</CardTitle>
              {page.description && (
                <CardDescription className="text-base">
                  {page.description}
                </CardDescription>
              )}
              {/* Campaign Information */}
              {page.campaign && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800 dark:text-blue-200">
                      Part of: {page.campaign.title}
                    </span>
                  </div>
                  {page.campaign.description && (
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                      {page.campaign.description}
                    </p>
                  )}
                  {page.campaign.goalAmount && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-600">Campaign Progress</span>
                        <span className="font-medium">
                          ${page.campaign.totalRaised.toFixed(2)} / ${page.campaign.goalAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${page.campaign.progressPercentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-blue-600">
                        <span>{page.campaign.progressPercentage.toFixed(1)}% complete</span>
                        <span>{page.campaign.donorCount} donors</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {page.customMessage && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">{page.customMessage}</p>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {page.donationCount} donations
                </div>
                <div>
                  ${page.totalRaised.toFixed(2)} raised
                </div>
                {page.campaign && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {page.campaign.donorCount} campaign donors
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donation Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Support This Initiative</CardTitle>
              <CardDescription>
                Your contribution makes a difference
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount Section */}
              <div className="space-y-2">
                <Label htmlFor="amount">
                  {page.amount ? `Amount (Fixed: ${page.currency} ${page.amount})` : "Amount"}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {page.currency}
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="pl-7"
                    disabled={!!page.amount}
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              {paymentGateways.length > 0 && (
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="grid gap-2">
                    {paymentGateways.map((gateway) => (
                      <div
                        key={gateway.gateway}
                        className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedGateway === gateway.gateway
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedGateway(gateway.gateway)}
                      >
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="font-medium">{gateway.displayName}</div>
                          {gateway.description && (
                            <div className="text-sm text-muted-foreground">
                              {gateway.description}
                            </div>
                          )}
                        </div>
                        {gateway.supportedCurrencies && (
                          <Badge variant="secondary" className="text-xs">
                            {gateway.supportedCurrencies}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Donor Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name (optional)</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Donate Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleDonate}
                disabled={processing || paymentGateways.length === 0}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-5 w-5" />
                    Donate Now
                  </>
                )}
              </Button>

              {paymentGateways.length === 0 && (
                <p className="text-sm text-center text-muted-foreground">
                  No payment methods are currently available. Please try again later.
                </p>
              )}

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Secure payment processing • Donations are non-refundable
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12 text-center">
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Secure Payments
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Instant Receipt
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Transparent Use
          </div>
        </div>
      </div>
    </div>
  );
}