"use client";

import { useEffect, useState } from "react";
import { journey, subscribeJourney } from "@/lib/journey";

/**
 * Pale sky-mist at the top of the campus overview. It sits under the map pills
 * (inside the canvas stacking context) but over the 3D scene, so:
 *  - the top-left heading always has a light backdrop to read on, and
 *  - the top edge of the forest fades into a bright, hazy sky.
 * The strong part is weighted to the left so the Fisherman Cove building at the
 * top-right is not washed out.
 */
export default function TopMist() {
  const [on, setOn] = useState(
    () => journey.focus.level === "campus" && !journey.welcome,
  );
  useEffect(
    () =>
      subscribeJourney(() => {
        setOn(journey.focus.level === "campus" && !journey.welcome);
      }),
    [],
  );
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0"
      style={{
        height: "clamp(150px, 30vh, 280px)",
        zIndex: 5,
        opacity: on ? 1 : 0,
        transition: "opacity 400ms ease",
        background: [
          // light veil across the full width
          "linear-gradient(to bottom, rgba(226,239,247,0.55) 0%, rgba(226,239,247,0.22) 55%, rgba(226,239,247,0) 100%)",
          // stronger backdrop behind the heading (left side only)
          "radial-gradient(ellipse 62% 100% at 0% 0%, rgba(232,243,249,0.96) 0%, rgba(232,243,249,0.82) 38%, rgba(232,243,249,0) 100%)",
        ].join(", "),
      }}
    />
  );
}
