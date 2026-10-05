"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NextSession from "@/components/ui/NextSession";
import { journey, subscribeJourney } from "@/lib/journey";

/**
 * Top-left brand mark, themed per the legacy site:
 * pink eyebrow + display headline, respecting safe-area insets so it
 * doesn't collide with notches / status bars.
 * Hidden once the user leaves the campus overview, so room chrome owns that corner.
 */
export default function BrandMark() {
  const router = useRouter();
  const signOut = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      router.replace("/login");
    }
  };
  const [onCampus, setOnCampus] = useState(
    () => journey.focus.level === "campus" && !journey.welcome,
  );
  useEffect(
    () =>
      subscribeJourney(() => {
        setOnCampus(journey.focus.level === "campus" && !journey.welcome);
      }),
    [],
  );
  if (!onCampus) return null;
  return (
    <div
      // Narrow screens: keep clear of the round icons on the right.
      className="pointer-events-none absolute max-w-[calc(100vw-5.5rem)] min-[1160px]:max-w-none"
      style={{
        top: "var(--brand-top)",
        left: "max(1.1rem, env(safe-area-inset-left))",
      }}
    >
      <div
        className="text-[12px] font-extrabold uppercase"
        style={{
          color: "#4A0F2E",
          letterSpacing: "0.2em",
          textShadow: "0 0 10px rgba(255,255,255,.85), 0 1px 0 rgba(255,255,255,.6)",
        }}
      >
        Explore · Your Journey
      </div>
      <div
        className="font-display mt-1 text-xl font-extrabold md:text-2xl"
        style={{
          color: "#182033",
          textShadow: "0 0 14px rgba(255,255,255,.9)",
          lineHeight: 1.02,
          letterSpacing: "-0.02em",
        }}
      >
        Tap a building to explore.
      </div>
      <div
        className="mt-1.5 text-[12px] font-medium"
        style={{ color: "#1d1722", textShadow: "0 0 10px rgba(255,255,255,.9), 0 1px 0 rgba(255,255,255,.6)" }}
      >
        A day across the company — one map, your stops.
      </div>
      <button
        type="button"
        onClick={signOut}
        className="pointer-events-auto mt-2 rounded-full border px-3 py-1 text-[11px] font-bold"
        style={{
          background: "rgba(255,255,255,.8)",
          borderColor: "rgba(33,26,35,.15)",
          color: "#4A0F2E",
        }}
      >
        Sign out
      </button>
      <NextSession />
    </div>
  );
}
