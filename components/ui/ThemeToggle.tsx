"use client";

import { useEffect, useState } from "react";

/**
 * Floating theme toggle, top-right. Matches the legacy `themebtn`:
 * a round pill with a sun/moon glyph that writes `data-theme` on <html>.
 * Falls back to the system scheme when no preference has been chosen.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tcs-theme") as
        | "light"
        | "dark"
        | null;
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
        document.documentElement.setAttribute("data-theme", saved);
      }
    } catch {
      // ignore storage errors (private mode, etc.)
    }
  }, []);

  const flip = () => {
    const current =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("tcs-theme", next);
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-label="Toggle theme"
      className="pointer-events-auto fixed z-30 inline-flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:-translate-y-0.5"
      style={{
        top: "max(0.95rem, env(safe-area-inset-top))",
        right: "max(1rem, env(safe-area-inset-right))",
        background: "var(--card)",
        border: "1px solid var(--line)",
        color: "var(--ink)",
        boxShadow: "var(--shadow)",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  );
}
