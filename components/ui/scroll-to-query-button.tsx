"use client";

import React from "react";

export default function ScrollToQueryButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const handleClick = () => {
    document.querySelector('[data-query-input]')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
