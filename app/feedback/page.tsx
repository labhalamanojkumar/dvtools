"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Send, Loader2, Heart, MessageCircle, Lightbulb } from "lucide-react";
import { useToast } from "@/components/ui/toaster";

export default function FeedbackPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    toolUsed: "",
    feedbackType: "",
    feedback: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating before submitting.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, rating }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Feedback Submitted!",
          description: "Thank you for helping us improve! 🎉",
          duration: 5000,
        });
        setFormData({
          name: "",
          email: "",
          toolUsed: "",
          feedbackType: "",
          feedback: "",
        });
        setRating(0);
      } else {
        throw new Error(data.error || "Failed to submit feedback");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit feedback. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Share Your <span className="text-primary">Feedback</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your feedback helps us build better tools for everyone. Tell us what
          you love, what needs improvement, or suggest new features!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="pt-6 text-center">
            <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">What You Love</h3>
            <p className="text-sm text-muted-foreground">
              Tell us what works great
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <MessageCircle className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Issues & Bugs</h3>
            <p className="text-sm text-muted-foreground">
              Report problems you've found
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Lightbulb className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">New Ideas</h3>
            <p className="text-sm text-muted-foreground">
              Suggest new features
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>We Value Your Opinion</CardTitle>
          <CardDescription>
            Your feedback directly influences our roadmap and priorities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div className="space-y-2">
              <Label>
                Overall Rating <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  >
                    <Star
                      className={`h-8 w-8 transition-all ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground self-center">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </span>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name (optional)</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="toolUsed">Which tool did you use?</Label>
              <Input
                id="toolUsed"
                name="toolUsed"
                placeholder="e.g., JSON Formatter, JWT Decoder"
                value={formData.toolUsed}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedbackType">
                Feedback Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.feedbackType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, feedbackType: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive Feedback</SelectItem>
                  <SelectItem value="improvement">Suggestion for Improvement</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="usability">Usability Issue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">
                Your Feedback <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="feedback"
                name="feedback"
                placeholder="Share your thoughts, suggestions, or report an issue..."
                value={formData.feedback}
                onChange={handleChange}
                rows={8}
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Feedback is reviewed regularly and helps shape our development priorities
        </p>
        <p className="text-xs text-muted-foreground">
          By submitting feedback, you agree to our{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
