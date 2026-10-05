"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { setWelcome, journey } from "@/lib/journey";

/**
 * Opening screen: a blurred, warm-graded campus photo with a sharp window onto
 * the campus in the middle, pink glowing screen edges, and a frosted glass card
 * carrying the welcome copy.
 *
 * Photos (replace these two files with the real TCS campus photos):
 *   /public/welcome/campus.png       portrait crop, used under 768px wide (phones)
 *   /public/welcome/campus-wide.jpg  landscape, at least 2400px wide (tablets/laptops)
 * Nothing else needs to change; the files are picked in the CSS at the bottom.
 *
 * Tap anywhere → the card slips away, the sharp window opens out to fill the
 * screen and the whole screen dissolves into the 3D map.
 */
const WARM = "sepia(.55) saturate(1.8) hue-rotate(-12deg) contrast(1.12)";

export default function WelcomeIntro() {
  const [dismissed, setDismissed] = useState(false);
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const sharpRef = useRef<HTMLDivElement | null>(null);
  const edgeRef = useRef<HTMLDivElement | null>(null);

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

    tl.to(
      cardRef.current,
      { y: 60, opacity: 0, scale: 0.97, duration: 0.5, ease: "power2.in" },
      0,
    );
    // Open the sharp window until it covers the screen.
    tl.to(
      sharpRef.current,
      { "--a": "150%", "--b": "210%", duration: 1.1, ease: "power2.inOut" },
      0.05,
    );
    tl.to(edgeRef.current, { opacity: 0, duration: 0.8, ease: "power1.out" }, 0.1);
    tl.to(rootRef.current, { opacity: 0, duration: 0.7, ease: "power1.out" }, 0.8);
  };

  useEffect(() => {
    setWelcome(true);
  }, []);

  if (gone) return null;

  const photoLayer: React.CSSProperties = {
    position: "absolute",
    inset: "-8%",
    backgroundSize: "cover",
    backgroundPosition: "48% 54%",
  };

  return (
    <div
      ref={rootRef}
      onClick={dismiss}
      className="fixed inset-0 z-[60] cursor-pointer overflow-hidden"
      style={{ background: "linear-gradient(165deg, #F9C9B2, #E8A9C0)" }}
    >
      {/* Blurred, warm-graded photo */}
      <div className="welcome-photo" style={{ ...photoLayer, filter: `blur(7px) ${WARM}` }} />

      {/* Sharp window onto the campus */}
      <div
        ref={sharpRef}
        className="welcome-photo"
        style={
          {
            ...photoLayer,
            "--a": "38%",
            "--b": "70%",
            filter: "saturate(1.35) contrast(1.06)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 54%, #000 0, #000 var(--a), transparent var(--b))",
            maskImage:
              "radial-gradient(circle at 50% 54%, #000 0, #000 var(--a), transparent var(--b))",
          } as React.CSSProperties
        }
      />

      {/* Soft pink glow around the screen edges */}
      <div
        ref={edgeRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: "inset 0 0 90px 26px rgba(255,92,165,.3)",
          background:
            "radial-gradient(circle at 50% 54%, transparent 42%, rgba(255,120,180,.38) 100%)",
        }}
      />

      {/* Frosted glass card with a pink border */}
      <div
        ref={cardRef}
        className="absolute inset-x-[7%] bottom-[6%] mx-auto flex h-[250px] max-w-[520px] flex-col items-center justify-center rounded-[30px] px-6 text-center"
        style={{
          background: "rgba(255,236,244,.62)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          border: "2px solid rgba(255,105,170,.95)",
          boxShadow:
            "0 0 0 5px rgba(255,170,205,.35), 0 20px 60px rgba(120,20,80,.35)",
          animation: "welcomeFloat 900ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div
          className="text-[12px] font-extrabold uppercase tracking-[0.24em]"
          style={{ color: "#9E0F48" }}
        >
          A day across the TCS Siruseri
        </div>
        <h1
          className="font-display mt-3 text-5xl font-extrabold md:text-6xl"
          style={{
            color: "#16203A",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            textWrap: "balance",
          }}
        >
          Welcome to TCS
        </h1>
        <div
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
          style={{
            color: "#2F2836",
            animation: "tapPulse 1.8s ease-in-out infinite",
          }}
        >
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: "#D81B60" }}
          />
          Tap to continue
        </div>
      </div>

      <style jsx global>{`
        .welcome-photo {
          background-image: url(/welcome/campus.png);
        }
        @media (min-width: 768px) {
          .welcome-photo {
            background-image: url(/welcome/campus-wide.jpg);
          }
        }
        @keyframes welcomeFloat {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes tapPulse {
          0%,
          100% {
            opacity: 0.55;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
