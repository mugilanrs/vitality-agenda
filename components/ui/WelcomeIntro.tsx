"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { setWelcome, journey } from "@/lib/journey";

/**
 * Opening screen ("haze fade"): the campus photo is hazy and blurred at the
 * top and sharpens toward the bottom. A cream, pink-bordered box carries the
 * welcome copy at the top and a "Tap to continue" pill sits at the bottom.
 *
 * The photo is /public/welcome/campus.jpg — replace that one file with a larger
 * original any time (portrait is fine). On tablets/laptops the sharp photo is
 * centred at full height with a blurred copy filling the sides, so a portrait
 * photo is never stretched.
 *
 * Tap anywhere → the haze lifts (the whole photo comes into focus), the copy
 * slips away and the screen dissolves into the 3D map.
 */
export default function WelcomeIntro() {
  const [dismissed, setDismissed] = useState(false);
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const sharpRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const tapRef = useRef<HTMLDivElement | null>(null);

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

    tl.to(titleRef.current, { y: -40, opacity: 0, duration: 0.5, ease: "power2.in" }, 0);
    tl.to(tapRef.current, { y: 30, opacity: 0, duration: 0.4, ease: "power2.in" }, 0);
    // Lift the haze: the sharp mask now starts above the top of the screen.
    tl.to(sharpRef.current, { "--s": "-45%", duration: 1.0, ease: "power2.inOut" }, 0.05);
    tl.to(fillRef.current, { opacity: 0, duration: 0.9, ease: "power1.out" }, 0.1);
    tl.to(rootRef.current, { opacity: 0, duration: 0.8, ease: "power1.out" }, 0.8);
  };

  useEffect(() => {
    setWelcome(true);
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      onClick={dismiss}
      className="fixed inset-0 z-[60] cursor-pointer overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FBE8D2, #F2C2D6)" }}
    >
      {/* Blurred copy of the photo: the haze (phone) and the side fill (laptop) */}
      <div ref={fillRef} className="welcome-fill absolute" />

      {/* Sharp photo, fading from hazy at the top to crisp at the bottom */}
      <div
        ref={sharpRef}
        className="welcome-sharp absolute"
        style={{ "--s": "18%" } as React.CSSProperties}
      />

      {/* Warm haze over the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,236,214,.65), rgba(255,236,214,0) 45%)",
        }}
      />

      {/* Title box */}
      <div
        ref={titleRef}
        className="absolute inset-x-[8%] mx-auto max-w-[560px] rounded-[26px] px-4 py-4 text-center"
        style={{
          top: "max(8%, calc(env(safe-area-inset-top) + 1rem))",
          background: "rgba(255,246,238,.74)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "2px solid rgba(255,105,170,.92)",
          boxShadow: "0 18px 50px rgba(120,20,80,.22)",
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
          className="font-display mt-2 text-5xl font-extrabold md:text-6xl"
          style={{
            color: "#16203A",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            textWrap: "balance",
          }}
        >
          Welcome to TCS
        </h1>
      </div>

      {/* Tap pill */}
      <div
        className="pointer-events-none absolute inset-x-0 flex justify-center"
        style={{ bottom: "max(6%, calc(env(safe-area-inset-bottom) + 1rem))" }}
      >
        <div
          ref={tapRef}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
          style={{
            color: "#2F2836",
            background: "rgba(255,246,238,.88)",
            boxShadow: "0 8px 24px rgba(120,20,80,.2)",
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
        .welcome-fill {
          inset: -6%;
          background: url(/welcome/campus.jpg) 50% 50% / cover no-repeat;
          filter: blur(14px);
          will-change: opacity;
        }
        .welcome-sharp {
          inset: 0;
          background: url(/welcome/campus.jpg) 51% 50% / auto 100% no-repeat;
          will-change: mask-image;
          -webkit-mask-image: linear-gradient(
            180deg,
            transparent var(--s),
            #000 calc(var(--s) + 40%)
          );
          mask-image: linear-gradient(
            180deg,
            transparent var(--s),
            #000 calc(var(--s) + 40%)
          );
        }
        @media (min-width: 768px) {
          .welcome-fill {
            inset: -3%;
            filter: blur(18px);
          }
          .welcome-sharp {
            left: 50%;
            right: auto;
            width: 770px;
            margin-left: -385px;
            background-size: cover;
            background-position: 50% 50%;
            -webkit-mask-image: linear-gradient(
                180deg,
                transparent var(--s),
                #000 calc(var(--s) + 40%)
              ),
              linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent);
            -webkit-mask-composite: source-in;
            mask-image: linear-gradient(
                180deg,
                transparent var(--s),
                #000 calc(var(--s) + 40%)
              ),
              linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent);
            mask-composite: intersect;
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
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
