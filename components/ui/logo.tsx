"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "gradient";
}

export function Logo({ className = "", size = "md", variant = "default" }: LogoProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl"
  };

  const variantClasses = {
    default: "text-primary",
    minimal: "text-muted-foreground",
    gradient: "bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
  };

  return (
    <div className={`font-mono font-bold ${sizeClasses[size]} ${className}`}>
      <span className={`${variantClasses[variant]} transition-all duration-200`}>&#123;</span>
      <span className={`${variant === "gradient" ? "bg-gradient-to-r from-foreground to-gray-700 bg-clip-text text-transparent" : "text-foreground"} transition-all duration-200`}>
        DT
      </span>
      <span className={`${variantClasses[variant]} transition-all duration-200`}>&#125;</span>
    </div>
  );
}