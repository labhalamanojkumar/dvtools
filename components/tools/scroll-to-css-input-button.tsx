"use client";

import { Button } from "@/components/ui/button";

export default function ScrollToCssInputButton() {
  const handleClick = () => {
    const el = document.getElementById("css-input");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Optional: focus after scroll for accessibility
      if (el instanceof HTMLTextAreaElement || el instanceof HTMLElement) {
        el.focus({ preventScroll: true });
      }
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
    >
      Start Optimizing CSS
    </Button>
  );
}
