"use client";

import { useEffect, useState } from "react";

/** The real current time, refreshed every `everyMs` (client only). */
export function useNow(everyMs = 1000): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, everyMs);
    return () => window.clearInterval(id);
  }, [everyMs]);
  return now;
}
