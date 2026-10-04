"use client";

import { useEffect, useState } from "react";
import { journey, subscribeJourney } from "@/lib/journey";
import { STOPS, goToStop, stopIndexForFocus } from "@/lib/stops";

/**
 * Floating "Previous room / Next room" buttons on the right edge. They walk the
 * fixed loop in lib/stops.ts and hide at either end of it.
 */
export default function StopNav({ docked = false }: { docked?: boolean }) {
  const [index, setIndex] = useState(() => stopIndexForFocus(journey.focus));

  useEffect(() => {
    const apply = () => setIndex(stopIndexForFocus(journey.focus));
    apply();
    return subscribeJourney(apply, "focus");
  }, []);

  if (index < 0) return null;
  const prev = STOPS[index - 1];
  const next = STOPS[index + 1];
  if (!prev && !next) return null;

  return (
    <div
      // Phones: a slim row in the free band under the room. Larger screens:
      // a column floating on the right edge, mid-height — or, when `docked`,
      // a normal row that sits inside its parent (above the room's info panel).
      className={
        docked
          ? "pointer-events-none fixed left-3 top-3 flex flex-row-reverse items-center justify-between gap-2 sm:static sm:w-full sm:translate-y-0"
          : "pointer-events-none fixed top-[69%] -translate-y-1/2 flex flex-row-reverse items-center gap-2 sm:top-1/2 sm:flex-col sm:items-end sm:gap-2.5"
      }
      style={{
        right: "max(0.75rem, env(safe-area-inset-right))",
        zIndex: 31,
      }}
    >
      {next && (
        <button
          type="button"
          onClick={() => goToStop(index + 1)}
          aria-label={`Next room: ${next.label}`}
          className={`pointer-events-auto rounded-2xl px-3 py-2 text-left shadow-lg sm:px-3.5 sm:py-2.5${docked ? " sm:flex-1" : ""}`}
          style={{ background: "#211A23", color: "#fff", maxWidth: docked ? undefined : "11.5rem" }}
        >
          <span className="block text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "#F4A3C1" }}>
            Next room ›
          </span>
          <span className="mt-0.5 hidden text-[12px] font-bold leading-tight sm:block">{next.label}</span>
        </button>
      )}
      {prev && (
        <button
          type="button"
          onClick={() => goToStop(index - 1)}
          aria-label={`Previous room: ${prev.label}`}
          className={`pointer-events-auto rounded-2xl border px-3 py-2 text-left shadow-lg sm:px-3.5 sm:py-2.5${docked ? " sm:flex-1" : ""}${docked && !next ? " max-sm:mr-auto" : ""}`}
          style={{
            background: "rgba(255,255,255,.96)",
            borderColor: "rgba(33,26,35,.15)",
            color: "#211A23",
            maxWidth: docked ? undefined : "11.5rem",
          }}
        >
          <span className="block text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "#B0124F" }}>
            ‹ Previous room
          </span>
          <span className="mt-0.5 hidden text-[12px] font-bold leading-tight sm:block">{prev.label}</span>
        </button>
      )}
    </div>
  );
}
