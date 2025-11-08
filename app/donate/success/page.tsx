"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Heart, Home, Mail } from "lucide-react";

function DonationSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const [loading, setLoading] = useState(true);
  const [donationData, setDonationData] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // Verify the donation with backend
      fetch(`/api/donations/verify?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setDonationData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to verify donation:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <div className="animate-pulse">
          <div className="h-16 w-16 bg-muted rounded-full mx-auto mb-4"></div>
          <div className="h-8 bg-muted rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="text-center border-primary">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle2 className="h-20 w-20 text-green-500" />
          </div>
          <CardTitle className="text-3xl">
            Thank You for Your Support! 💙
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Your generous donation helps us keep Malti Tool Platform free and
            accessible for everyone.
          </p>

          {donationData && (
            <div className="bg-muted/50 rounded-lg p-6 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold text-lg">
                  ${donationData.amount?.toFixed(2)}
                </span>
              </div>
              {donationData.donorName && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-semibold">{donationData.donorName}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date:</span>
                <span>
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">What happens next?</h3>
            <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
              <li className="flex gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>You'll receive a receipt via email shortly</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Your support goes directly to development and hosting</span>
              </li>
              <li className="flex gap-2">
                <Heart className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>You're helping keep tools free for 50,000+ developers</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/tools">
                <Home className="mr-2 h-5 w-5" />
                Explore Tools
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/feedback">
                <Mail className="mr-2 h-5 w-5" />
                Share Feedback
              </Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground pt-4">
            Questions about your donation?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact us
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <div className="animate-pulse">
            <div className="h-16 w-16 bg-muted rounded-full mx-auto mb-4"></div>
            <div className="h-8 bg-muted rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      }
    >
      <DonationSuccessContent />
    </Suspense>
  );
}
