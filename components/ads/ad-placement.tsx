"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ExternalLink, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AdCampaign {
  id: string;
  name: string;
  title: string;
  contentDescription: string;
  imageUrl: string;
  fallbackImage: string;
  videoUrl: string;
  htmlCode: string;
  linkUrl: string;
  callToAction: string;
  vendor: {
    id: string;
    name: string;
    type: string;
  };
}

interface AdPlacement {
  id: string;
  key: string;
  name: string;
  type: string;
  width: number;
  height: number;
  htmlClass: string;
  maxAds: number;
  refreshInterval: number;
  responsive: boolean;
  fallbackImage: string;
  fallbackUrl: string;
}

interface AdPlacementProps {
  placementKey: string;
  className?: string;
  width?: number;
  height?: number;
  maxAds?: number;
  refreshInterval?: number;
  responsive?: boolean;
}

export function AdPlacement({
  placementKey,
  className = "",
  width,
  height,
  maxAds = 1,
  refreshInterval,
  responsive = true
}: AdPlacementProps) {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [placement, setPlacement] = useState<AdPlacement | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [DOMPurify, setDOMPurify] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const viewedAdsRef = useRef<Set<string>>(new Set());

  // Load DOMPurify on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('dompurify').then((module) => {
        setDOMPurify(module.default);
      });
    }
  }, []);

  useEffect(() => {
    fetchPlacement();
  }, [placementKey]);

  useEffect(() => {
    if (campaigns.length > 0 && refreshInterval) {
      intervalRef.current = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % campaigns.length);
      }, refreshInterval * 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [campaigns.length, refreshInterval]);

  const fetchPlacement = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ads/placement/${placementKey}`);
      if (response.ok) {
        const data = await response.json();
        setPlacement(data.placement);
        setCampaigns(data.campaigns || []);
        
        // Track ad view
        if (data.campaigns && data.campaigns.length > 0) {
          trackAdView(data.campaigns[0].id, data.placement?.id);
        }
      }
    } catch (error) {
      console.error("Error fetching ad placement:", error);
    } finally {
      setLoading(false);
    }
  };

  const trackAdView = async (campaignId: string, placementId?: string) => {
    try {
      if (!viewedAdsRef.current.has(campaignId)) {
        viewedAdsRef.current.add(campaignId);
        await fetch("/api/ads/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            campaignId,
            placementId,
            eventType: "view"
          })
        });
      }
    } catch (error) {
      console.error("Error tracking ad view:", error);
    }
  };

  const handleAdClick = async (campaignId: string, linkUrl: string) => {
    try {
      // Track click
      await fetch("/api/ads/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          placementId: placement?.id,
          eventType: "click"
        })
      });
      
      // Open link
      window.open(linkUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error tracking ad click:", error);
    }
  };

  if (loading) {
    return (
      <div className={`ad-placement ad-placement--loading ${className}`}>
        <div className="bg-gray-100 animate-pulse rounded flex items-center justify-center" 
             style={{ width: width || 300, height: height || 250 }}>
          <div className="text-gray-400 text-sm">Loading ad...</div>
        </div>
      </div>
    );
  }

  if (!campaigns.length || !placement) {
    // Show fallback content
    return (
      <div className={`ad-placement ad-placement--fallback ${className}`}>
        {placement?.fallbackImage ? (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <a 
                href={placement.fallbackUrl || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Image
                  src={placement.fallbackImage}
                  alt="Advertisement"
                  width={width || 300}
                  height={height || 250}
                  className="w-full h-auto"
                />
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center">
            <div className="text-gray-400 text-sm">
              <Eye className="w-4 h-4 mx-auto mb-1" />
              Advertisement space
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentCampaign = campaigns[currentAdIndex];

  // Render different ad types based on vendor
  const renderAd = () => {
    if (currentCampaign.htmlCode) {
      // Custom HTML ad - sanitize to prevent XSS
      const sanitizedHtml = DOMPurify 
        ? DOMPurify.sanitize(currentCampaign.htmlCode, {
            ALLOWED_TAGS: ['a', 'b', 'br', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'i', 'img', 'li', 'ol', 'p', 'span', 'strong', 'u', 'ul'],
            ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'id', 'style']
          })
        : currentCampaign.htmlCode;
      return (
        <div
          className="ad-content ad-content--html"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      );
    }

    if (currentCampaign.videoUrl) {
      // Video ad
      return (
        <video
          src={currentCampaign.videoUrl}
          width={width || placement.width}
          height={height || placement.height}
          controls
          autoPlay
          muted
          loop
          className="w-full h-auto rounded"
        />
      );
    }

    // Image ad
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-0">
          <button
            onClick={() => handleAdClick(currentCampaign.id, currentCampaign.linkUrl || "#")}
            className="block w-full text-left"
          >
            <div className="relative">
              <Image
                src={currentCampaign.imageUrl || currentCampaign.fallbackImage || "/placeholder-ad.jpg"}
                alt={currentCampaign.title || currentCampaign.name}
                width={width || placement.width || 300}
                height={height || placement.height || 250}
                className="w-full h-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== currentCampaign.fallbackImage) {
                    target.src = currentCampaign.fallbackImage || "/placeholder-ad.jpg";
                  }
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                <div className="text-sm font-medium">{currentCampaign.title}</div>
                {currentCampaign.contentDescription && (
                  <div className="text-xs opacity-90 mt-1">{currentCampaign.contentDescription}</div>
                )}
              </div>
            </div>
            {currentCampaign.callToAction && (
              <div className="p-2 bg-gray-50 flex items-center justify-between">
                <span className="text-sm text-blue-600 font-medium">{currentCampaign.callToAction}</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </div>
            )}
          </button>
        </CardContent>
      </Card>
    );
  };

  const containerStyle = {
    width: width || placement.width || 300,
    height: placement.type === 'HEADER_BANNER' ? 'auto' : (height || placement.height || 250),
  };

  return (
    <div
      className={`ad-placement ad-placement--${placement.type.toLowerCase()} ${className}`}
      style={containerStyle}
      data-placement-key={placementKey}
    >
      {renderAd()}
      
      {campaigns.length > 1 && (
        <div className="ad-indicators mt-2 flex justify-center space-x-1">
          {campaigns.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentAdIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentAdIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-label={`View ad ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}