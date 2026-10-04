"use client";

import { useEffect, useState } from "react";
import { journey, subscribeJourney } from "@/lib/journey";

/**
 * Top-left brand mark, themed per the legacy site:
 * pink eyebrow + display headline, respecting safe-area insets so it
 * doesn't collide with notches / status bars.
 * Hidden once the user leaves the campus overview, so room chrome owns that corner.
 */
export default function BrandMark() {
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
      // Below 1160px the "Info & options" pill and theme toggle share the top
      // row, so the header drops beneath them and is width-limited.
      className="pointer-events-none absolute max-w-[min(20rem,calc(100vw-2.2rem))] min-[1160px]:max-w-none"
      style={{
        top: "var(--brand-top)",
        left: "max(1.1rem, env(safe-area-inset-left))",
      }}
    >
      <div
        className="text-[11px] font-bold uppercase"
        style={{
          color: "var(--pink)",
          letterSpacing: "0.22em",
        }}
      >
        Explore · Our Journey
      </div>
      <div
        className="font-display mt-1 text-xl font-extrabold md:text-2xl"
        style={{
          color: "#182033",
          lineHeight: 1.02,
          letterSpacing: "-0.02em",
        }}
      >
        Tap a building to explore.
      </div>
      <div
        className="mt-1.5 text-[12px] font-medium"
        style={{ color: "#5c5160" }}
      >
        A day across the company — six stops, one map.
      </div>
    </div>
  );
}
