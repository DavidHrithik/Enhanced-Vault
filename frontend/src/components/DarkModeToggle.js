import React, { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") setDark(true);
    if (stored === "light") setDark(false);
  }, []);

  return (
    <button
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed top-4 left-4 z-50 bg-white/70 dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700 rounded-full p-2 shadow hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
      onClick={() => setDark((v) => !v)}
      tabIndex={0}
    >
      {dark ? (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-yellow-300">
          <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.07 6.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-gray-700">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}
