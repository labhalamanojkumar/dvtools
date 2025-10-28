"use client";
"use client";

export default function ScrollToThemeBuilderButton() {
  const handleClick = () => {
    document.querySelector("button")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
    >
      Start Building Themes
    </button>
  );
}
