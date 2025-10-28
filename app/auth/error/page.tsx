"use client";

import { Suspense } from "react";
import AuthErrorContent from "./auth-error-content";

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
