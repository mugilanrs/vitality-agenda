"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { setWelcome, journey } from "@/lib/journey";
import { getAttendeeName } from "@/lib/agendaStore";
import JourneyShell from "@/components/ui/JourneyShell";

/**
 * Opening screen after login: the same split-screen frame as the login page
 * (campus photo + journey route beside a cream panel) with the attendee's
 * name and a "Tap to continue" button. Tap anywhere (or the button) and the
 * screen slides away to reveal the 3D map.
 */
export default function WelcomeIntro() {
  const [dismissed, setDismissed] = useState(false);
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const dismiss = () => {
    if (dismissed) return;
    setDismissed(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setWelcome(false);
        setGone(true);
      },
    });

    if (journey.reducedMotion) {
      tl.to(rootRef.current, { opacity: 0, duration: 0.4, ease: "power1.out" });
      return;
    }

    tl.to(panelRef.current, { y: -30, opacity: 0, duration: 0.45, ease: "power2.in" }, 0);
    tl.to(rootRef.current, { opacity: 0, duration: 0.8, ease: "power1.out" }, 0.3);
  };

  useEffect(() => {
    setWelcome(true);
  }, []);

  if (gone) return null;

  const name = getAttendeeName();

  return (
    <div ref={rootRef} onClick={dismiss} className="fixed inset-0 z-[60] cursor-pointer">
      <JourneyShell panelRef={panelRef}>
        <div className="js-lock" aria-hidden>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
            <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />
          </svg>
        </div>
        <div className="js-eyebrow">An AI-first day at TCS Siruseri</div>
        <h1 className="font-display js-title" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
          {name ? `Welcome, ${name}` : "Welcome to TCS"}
        </h1>
        <p className="js-copy">Your personal journey is ready: your sessions, rooms and timings, all on one map.</p>
        <button type="button" className="js-btn" style={{ marginTop: 24 }}>
          Tap to continue
        </button>
        <div className="js-hint">Thu 8 Oct 2026 · TCS Siruseri</div>
      </JourneyShell>
    </div>
  );
}
