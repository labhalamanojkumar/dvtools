'use client';
"use client";
"use client";

export default function ScrollToPlaygroundButton() {
  const handleClick = () => {
    document.querySelector('textarea')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
    >
      Start Exploring Components
    </button>
  );
}