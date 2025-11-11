"use client";

import { AdPlacement } from "./ad-placement";

interface AdPlacementWrapperProps {
  placementKey: string;
  className?: string;
  width?: number;
  height?: number;
  maxAds?: number;
  refreshInterval?: number;
  responsive?: boolean;
}

export function AdPlacementWrapper(props: AdPlacementWrapperProps) {
  return <AdPlacement {...props} />;
}
