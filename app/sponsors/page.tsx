"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Star, 
  ExternalLink, 
  Award, 
  Users, 
  TrendingUp,
  Sparkles,
  Crown,
  Gem,
  Shield
} from "lucide-react";
import Link from "next/link";

interface Sponsor {
  id: string;
  name: string;
  email?: string;
  company?: string;
  website?: string;
  logo?: string;
  amount?: number;
  tier?: string;
  description?: string;
  message?: string;
  isFeatured: boolean;
}

const tierIcons = {
  "Platinum": Crown,
  "Gold": Gem,
  "Silver": Award,
  "Bronze": Shield
};

const tierColors = {
  "Platinum": "from-purple-500 to-pink-500",
  "Gold": "from-yellow-400 to-orange-500",
  "Silver": "from-gray-400 to-gray-600",
  "Bronze": "from-orange-600 to-red-600"
};

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [featuredSponsors, setFeaturedSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [animateCount, setAnimateCount] = useState(0);

  useEffect(() => {
    loadSponsors();
  }, []);

  useEffect(() => {
    // Animate counters
    const timer = setTimeout(() => {
      if (animateCount < 3) {
        setAnimateCount(prev => prev + 1);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [animateCount]);

  const loadSponsors = async () => {
    try {
      // Load featured sponsors
      const featuredResponse = await fetch('/api/sponsors?featured=true&limit=6');
      if (featuredResponse.ok) {
        const featuredData = await featuredResponse.json();
        setFeaturedSponsors(featuredData.sponsors || []);
      }

      // Load all sponsors
      const sponsorsResponse = await fetch('/api/sponsors');
      if (sponsorsResponse.ok) {
        const sponsorsData = await sponsorsResponse.json();
        setSponsors(sponsorsData.sponsors || []);
      }
    } catch (error) {
      console.error('Error loading sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const AnimatedCounter = ({ value, label, delay = 0 }: { value: number; label: string; delay?: number }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      if (animateCount >= delay) {
        const timer = setTimeout(() => {
          const increment = value / 30;
          const counter = setInterval(() => {
            setDisplayValue(prev => {
              if (prev >= value) {
                clearInterval(counter);
                return value;
              }
              return Math.min(prev + increment, value);
            });
          }, 50);
          return () => clearInterval(counter);
        }, delay * 200);
        return () => clearTimeout(timer);
      }
    }, [value, delay, animateCount]);

    return (
      <div className="text-center animate-in fade-in-50 slide-in-from-bottom-4" style={{ animationDelay: `${delay * 200}ms` }}>
        <div className="text-3xl font-bold text-primary">{Math.round(displayValue)}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    );
  };

  const SponsorCard = ({ sponsor, featured = false }: { sponsor: Sponsor; featured?: boolean }) => {
    const TierIcon = sponsor.tier ? tierIcons[sponsor.tier as keyof typeof tierIcons] : Users;
    const tierColorClass = sponsor.tier ? tierColors[sponsor.tier as keyof typeof tierColors] : "from-blue-500 to-cyan-500";

    return (
      <Card className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-in fade-in-0 zoom-in-95 ${
        featured ? 'border-primary shadow-md' : ''
      }`}>
        <CardHeader className="relative">
          {sponsor.isFeatured && (
            <div className="absolute -top-2 -right-2">
              <Badge className={`bg-gradient-to-r ${tierColorClass} text-white border-0`}>
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            {sponsor.logo ? (
              <img 
                src={sponsor.logo} 
                alt={sponsor.company || sponsor.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
              />
            ) : (
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${tierColorClass} flex items-center justify-center text-white`}>
                <TierIcon className="w-6 h-6" />
              </div>
            )}
            <div className="flex-1">
              <CardTitle className="text-lg">{sponsor.name}</CardTitle>
              {sponsor.company && (
                <CardDescription>{sponsor.company}</CardDescription>
              )}
            </div>
            {sponsor.tier && (
              <Badge variant="outline" className="text-xs">
                {sponsor.tier}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {sponsor.description && (
            <p className="text-sm text-muted-foreground">{sponsor.description}</p>
          )}
          
          {sponsor.message && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm italic">"{sponsor.message}"</p>
            </div>
          )}
          
          {sponsor.amount && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Donated:</span>
              <span className="font-semibold text-green-600">${sponsor.amount.toFixed(2)}</span>
            </div>
          )}
          
          {sponsor.website && (
            <Button variant="outline" size="sm" asChild className="w-full">
              <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Website
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading our amazing sponsors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-in fade-in-0 slide-in-from-top-8 duration-1000">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-6">
                Our Amazing Sponsors
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                These generous supporters make our mission possible. Thank you for believing in open-source development and community empowerment.
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <AnimatedCounter value={sponsors.length} label="Total Sponsors" delay={0} />
              <AnimatedCounter value={featuredSponsors.length} label="Featured Sponsors" delay={1} />
              <AnimatedCounter 
                value={sponsors.reduce((sum, sponsor) => sum + (sponsor.amount || 0), 0)} 
                label="Total Raised" 
                delay={2} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sponsors */}
      {featuredSponsors.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                <Star className="w-8 h-8 text-yellow-500" />
                Featured Sponsors
                <Star className="w-8 h-8 text-yellow-500" />
              </h2>
              <p className="text-muted-foreground">
                Our most generous supporters who go above and beyond
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSponsors.map((sponsor, index) => (
                <div
                  key={sponsor.id}
                  className="animate-in fade-in-0 zoom-in-95"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <SponsorCard sponsor={sponsor} featured={true} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Sponsors */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">All Our Sponsors</h2>
            <p className="text-muted-foreground">
              Every contribution matters. Thank you to all our supporters!
            </p>
          </div>
          
          {sponsors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sponsors.map((sponsor, index) => (
                <div
                  key={sponsor.id}
                  className="animate-in fade-in-0 zoom-in-95"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <SponsorCard sponsor={sponsor} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No sponsors yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to support our mission and become a sponsor!
              </p>
              <Button asChild>
                <Link href="/donate">
                  <Heart className="w-4 h-4 mr-2" />
                  Support Us
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Join Our Sponsors?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your support helps us continue building amazing tools for the developer community. 
            Every contribution makes a difference and helps us grow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/donate">
                <Heart className="w-5 h-5 mr-2" />
                Make a Donation
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">
                <TrendingUp className="w-5 h-5 mr-2" />
                Become a Sponsor
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}