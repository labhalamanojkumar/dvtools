"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import AdPlacement with no SSR
const AdPlacement = dynamic(() => import('./ad-placement').then(mod => mod.AdPlacement), {
  ssr: false,
  loading: () => <div className="h-24 w-full" />
});

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
  return (
    <Suspense fallback={<div className="h-24 w-full" />}>
      <AdPlacement {...props} />
    </Suspense>
  );
}
