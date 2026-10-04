"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { setWelcome, journey } from "@/lib/journey";

/**
 * Pink / dark themed cloud intro — the opening screen from the legacy site,
 * ported into R3F chrome. Palette, typography and copy follow the current
 * theme; the cloud dispersal animation is kept from the vital-visit WelcomeIntro.
 *
 * - Eyebrow: "A DAY ACROSS THE TCS SIRUSERI" in pink
 * - Title: "Welcome to TCS" in Bricolage Grotesque, 800
 * - "Tap to continue" with pulsing pink dot
 * - Click anywhere → clouds fan outward, the campus fades in
 */
export default function WelcomeIntro() {
  const [dismissed, setDismissed] = useState(false);
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const cloudRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setCloud = (i: number) => (el: HTMLDivElement | null) => {
    cloudRefs.current[i] = el;
  };

  const dismiss = () => {
    if (dismissed) return;
    setDismissed(true);

    const reduce = journey.reducedMotion;
    const tl = gsap.timeline({
      onComplete: () => {
        setWelcome(false);
        setGone(true);
      },
    });

    if (reduce) {
      tl.to(rootRef.current, { opacity: 0, duration: 0.4, ease: "power1.out" });
      return;
    }

    tl.to(
      titleRef.current,
      { y: -40, opacity: 0, scale: 0.96, duration: 0.55, ease: "power2.in" },
      0,
    );

    cloudRefs.current.forEach((el, i) => {
      if (!el) return;
      const dir = CLOUDS[i].fan;
      const dist = 600 + Math.random() * 200;
      tl.to(
        el,
        {
          x: `+=${dir.x * dist}`,
          y: `+=${dir.y * dist}`,
          scale: 1.6 + i * 0.05,
          opacity: 0,
          rotation: dir.x > 0 ? 6 : -6,
          filter: "blur(48px)",
          duration: 1.4,
          ease: "power2.inOut",
        },
        0.12 + i * 0.05,
      );
    });

    tl.to(rootRef.current, { opacity: 0, duration: 0.8, ease: "power1.out" }, 0.9);
  };

  useEffect(() => {
    setWelcome(true);
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      onClick={dismiss}
      className="fixed inset-0 z-[60] flex cursor-pointer items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(130% 110% at 50% 34%, var(--world-a), var(--world-b))",
      }}
    >
      {CLOUDS.map((c, i) => (
        <div
          key={i}
          ref={setCloud(i)}
          aria-hidden
          className="absolute"
          style={{
            top: c.top,
            left: c.left,
            right: c.right,
            bottom: c.bottom,
            zIndex: c.z,
            width: c.w,
            height: c.h,
            filter: `blur(${c.blur}px)`,
            willChange: "transform, opacity, filter",
            pointerEvents: "none",
          }}
        >
          <CloudShape opacity={c.opacity} tone={c.tone} />
        </div>
      ))}

      <div
        ref={titleRef}
        className="relative z-30 flex flex-col items-center px-6 text-center"
        style={{
          animation: "welcomeFloat 900ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* The clouds are always white, so the text uses fixed dark colours
            (not theme tokens, which turn near-white in dark mode) and sits on
            a soft light scrim so it never gets lost in a gap between clouds. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-10 -inset-y-12 -z-10"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,255,255,.92) 0%, rgba(255,255,255,.78) 55%, rgba(255,255,255,0) 100%)",
            filter: "blur(6px)",
          }}
        />
        <div
          className="text-[12px] font-extrabold uppercase tracking-[0.24em]"
          style={{ color: "#A3104A" }}
        >
          A day across the TCS Siruseri
        </div>
        <h1
          className="font-display mt-3 text-5xl font-extrabold md:text-6xl"
          style={{
            color: "#182033",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            textWrap: "balance",
          }}
        >
          Welcome to TCS
        </h1>
        <div
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
          style={{
            color: "#3B3340",
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
            opacity: 0.45;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// ---------------- Cloud shape ----------------

function CloudShape({ opacity, tone }: { opacity: number; tone: string }) {
  const blob = (
    left: string,
    top: string,
    w: string,
    h: string,
    o: number,
  ): React.CSSProperties => ({
    position: "absolute",
    left,
    top,
    width: w,
    height: h,
    background: `radial-gradient(closest-side, ${tone} 0%, ${tone} 45%, rgba(255,255,255,0) 78%)`,
    opacity: o,
    borderRadius: "50%",
  });
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", opacity }}>
      <div style={blob("10%", "20%", "70%", "80%", 1.0)} />
      <div style={blob("0%", "35%", "55%", "65%", 0.95)} />
      <div style={blob("40%", "10%", "60%", "70%", 0.9)} />
      <div style={blob("30%", "40%", "70%", "60%", 0.85)} />
      <div style={blob("55%", "25%", "45%", "65%", 0.95)} />
      <div style={blob("20%", "55%", "60%", "45%", 0.9)} />
    </div>
  );
}

// ---------------- Cloud layout ----------------

type CloudSpec = {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  w: string;
  h: string;
  opacity: number;
  blur: number;
  tone: string;
  z: number;
  fan: { x: number; y: number };
};

const CLOUDS: CloudSpec[] = [
  { top: "-10%", left: "-15%", w: "80vw", h: "70vh", opacity: 0.85, blur: 30, tone: "#ffffff", z: 5, fan: { x: -1, y: -0.6 } },
  { top: "-8%", right: "-15%", w: "80vw", h: "70vh", opacity: 0.82, blur: 32, tone: "#f5f8fc", z: 6, fan: { x: 1, y: -0.5 } },
  { top: "10%", left: "-12%", w: "60vw", h: "55vh", opacity: 0.92, blur: 20, tone: "#ffffff", z: 10, fan: { x: -1, y: 0.2 } },
  { top: "18%", right: "-10%", w: "62vw", h: "58vh", opacity: 0.9, blur: 22, tone: "#fdfefd", z: 11, fan: { x: 1, y: 0.1 } },
  { bottom: "-5%", left: "5%", w: "60vw", h: "55vh", opacity: 0.88, blur: 24, tone: "#ffffff", z: 9, fan: { x: -0.6, y: 1 } },
  { bottom: "-8%", right: "0%", w: "60vw", h: "58vh", opacity: 0.9, blur: 24, tone: "#fbfcfe", z: 10, fan: { x: 0.6, y: 1 } },
  { top: "5%", left: "20%", w: "36vw", h: "35vh", opacity: 0.95, blur: 12, tone: "#ffffff", z: 20, fan: { x: -0.5, y: -1 } },
  { top: "8%", right: "18%", w: "36vw", h: "35vh", opacity: 0.95, blur: 12, tone: "#ffffff", z: 20, fan: { x: 0.5, y: -1 } },
  { bottom: "5%", left: "35%", w: "40vw", h: "35vh", opacity: 0.92, blur: 14, tone: "#ffffff", z: 22, fan: { x: 0, y: 1 } },
  { top: "28%", left: "30%", w: "42vw", h: "35vh", opacity: 0.5, blur: 30, tone: "#ffe0eb", z: 25, fan: { x: 0, y: -0.6 } },
];
