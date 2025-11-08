"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Heart,
  Coffee,
  Sparkles,
  Crown,
  CheckCircle2,
  Loader2,
  Users,
  TrendingUp,
  Shield,
  CreditCard,
} from "lucide-react";
import { useToast } from "@/components/ui/toaster";

interface PaymentGateway {
  gateway: string;
  displayName: string;
  description: string | null;
  publicKey: string | null;
  supportedCurrencies: string | null;
}

const donationTiers = [
  {
    id: "coffee",
    name: "Buy us a Coffee",
    amount: 5,
    icon: <Coffee className="h-8 w-8" />,
    description: "Help keep our servers running",
    perks: ["Our eternal gratitude", "Supporter badge"],
  },
  {
    id: "supporter",
    name: "Supporter",
    amount: 15,
    icon: <Heart className="h-8 w-8" />,
    description: "Support ongoing development",
    perks: ["Supporter badge", "Priority support", "Early access to features"],
    popular: true,
  },
  {
    id: "champion",
    name: "Champion",
    amount: 50,
    icon: <Sparkles className="h-8 w-8" />,
    description: "Become a champion of open tools",
    perks: [
      "Champion badge",
      "Priority support",
      "Early access to features",
      "Your name in credits",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Sponsor",
    amount: 200,
    icon: <Crown className="h-8 w-8" />,
    description: "Enterprise-level support",
    perks: [
      "All Champion perks",
      "Logo on website",
      "Dedicated support channel",
      "Custom feature requests",
    ],
  },
];

export default function DonatePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingGateways, setLoadingGateways] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [donationSettings, setDonationSettings] = useState({
    minimumAmount: 1,
    enableDonations: true,
    thankYouMessage: "Thank you for your generous donation! Your support helps us keep all 67+ tools free forever.",
  });
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<string>("");

  useEffect(() => {
    loadPaymentGateways();
    loadDonationSettings();
  }, []);

  const loadDonationSettings = async () => {
    try {
      const response = await fetch("/api/donation-settings");
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setDonationSettings(data.settings);
        }
      }
    } catch (error) {
      console.error("Error loading donation settings:", error);
    }
  };

  const loadPaymentGateways = async () => {
    setLoadingGateways(true);
    try {
      const response = await fetch("/api/payment-gateways");
      if (response.ok) {
        const data = await response.json();
        setPaymentGateways(data.gateways || []);
        // Auto-select first available gateway
        if (data.gateways && data.gateways.length > 0) {
          setSelectedGateway(data.gateways[0].gateway);
        }
      }
    } catch (error) {
      console.error("Error loading payment gateways:", error);
    } finally {
      setLoadingGateways(false);
    }
  };

  const handleDonate = async (amount: number) => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please provide your email address.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!selectedGateway) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setLoading(true);

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
          tierId: selectedTier || "custom",
          gateway: selectedGateway,
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
        duration: 5000,
      });
      setLoading(false);
    }
  };

  const handleTierSelect = (tierId: string, amount: number) => {
    setSelectedTier(tierId);
    setShowCustom(false);
    setCustomAmount("");
  };

  const handleCustomDonate = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount < donationSettings.minimumAmount) {
      toast({
        title: "Invalid Amount",
        description: `Please enter a valid amount (minimum $${donationSettings.minimumAmount}).`,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    handleDonate(amount);
  };

  if (!donationSettings.enableDonations) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Donations Currently Unavailable
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're currently not accepting donations. Please check back later or contact us for other ways to support the platform.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Support <span className="text-primary">Malti Tool Platform</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          {donationSettings.thankYouMessage || "We're committed to keeping all 67+ tools free forever. Your donation helps us maintain servers, add new features, and support the open-source community."}
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Badge variant="secondary" className="gap-1">
            <Users className="h-3 w-3" />
            50K+ Active Users
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <TrendingUp className="h-3 w-3" />
            1M+ Monthly Requests
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Shield className="h-3 w-3" />
            100% Open Source
          </Badge>
        </div>
      </div>

      {/* Donation Tiers */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {donationTiers.map((tier) => (
          <Card
            key={tier.id}
            className={`relative cursor-pointer transition-all hover:shadow-lg ${
              selectedTier === tier.id
                ? "border-primary ring-2 ring-primary"
                : ""
            } ${tier.popular ? "border-primary" : ""}`}
            onClick={() => handleTierSelect(tier.id, tier.amount)}
          >
            {tier.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center pb-4">
              <div className="text-primary mb-3 flex justify-center">
                {tier.icon}
              </div>
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <div className="text-3xl font-bold text-primary mt-2">
                ${tier.amount}
              </div>
              <CardDescription className="mt-2">
                {tier.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tier.perks.map((perk, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Amount */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {showCustom ? "Custom Amount" : "Or choose your own amount"}
          </CardTitle>
          <CardDescription>
            Every contribution helps, no matter the size
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showCustom ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setShowCustom(true);
                setSelectedTier(null);
              }}
            >
              Enter Custom Amount
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customAmount">Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="customAmount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      {(selectedTier || showCustom) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Choose Payment Method</CardTitle>
            <CardDescription>
              Select your preferred payment gateway
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingGateways ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : paymentGateways.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No payment methods are currently available.</p>
                <p className="text-sm mt-2">Please contact support.</p>
              </div>
            ) : (
              <RadioGroup value={selectedGateway} onValueChange={setSelectedGateway}>
                <div className="grid gap-4">
                  {paymentGateways.map((gateway) => (
                    <div key={gateway.gateway} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={gateway.gateway}
                        id={gateway.gateway}
                      />
                      <Label
                        htmlFor={gateway.gateway}
                        className="flex items-center justify-between w-full cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{gateway.displayName}</div>
                            {gateway.description && (
                              <div className="text-sm text-muted-foreground">
                                {gateway.description}
                              </div>
                            )}
                          </div>
                        </div>
                        {gateway.supportedCurrencies && (
                          <Badge variant="secondary" className="text-xs">
                            {gateway.supportedCurrencies}
                          </Badge>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </CardContent>
        </Card>
      )}

      {/* Donor Information */}
      {(selectedTier || showCustom) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>
              We'll send you a receipt and keep you updated (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
      )}

      {/* Donate Button */}
      {(selectedTier || showCustom) && (
        <div className="text-center">
          <Button
            size="lg"
            className="w-full md:w-auto min-w-64"
            onClick={() => {
              if (showCustom) {
                handleCustomDonate();
              } else {
                const tier = donationTiers.find((t) => t.id === selectedTier);
                if (tier) handleDonate(tier.amount);
              }
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Heart className="mr-2 h-5 w-5" />
                Complete Donation
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Secure payment processing • Donations are non-refundable
          </p>
        </div>
      )}

      {/* Why Donate Section */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <Card>
          <CardContent className="pt-6">
            <Users className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Community Driven</h3>
            <p className="text-sm text-muted-foreground">
              100% of donations go directly to development, hosting, and
              maintaining tools for the community.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Shield className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Always Free</h3>
            <p className="text-sm text-muted-foreground">
              All tools remain free forever. Donations simply help us grow and
              improve faster.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <TrendingUp className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Transparent</h3>
            <p className="text-sm text-muted-foreground">
              We're fully transparent about how donations are used. Check our
              public roadmap and financials.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          Thank you for considering supporting Malti Tool Platform! 💙
        </p>
        <p className="mt-2">
          Questions about donations?{" "}
          <a href="/contact" className="text-primary hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
