"use client";

import { STOPS, goToStop } from "@/lib/stops";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  BUILDINGS,
  MARKER_BUILDINGS,
  type BuildingSpec,
} from "@/data/buildings";
import {
  journey,
  subscribeJourney,
  openBuilding,
  enterRoom,
  setFocus,
  setHoverIndex,
} from "@/lib/journey";

/**
 * PHASE 10 (fix pass) — world-anchored interactive markers for EB3 and
 * the Signature Tower, with per-frame projection + viewport clamping.
 *
 * Previously the Signature Tower pill used a fixed `translate(66px, -20px)`
 * from a world anchor at TOWER_HEIGHT + 0.4. At the overview zoom that world
 * point projected to ≈ 30-50 px from the viewport top on 1280-1920 wide
 * displays, so the pill (centred on that point by drei) was clipped above
 * the viewport. The pill was DOM-mounted but invisible.
 *
 * The fix:
 *   1. markerPosition for the tower is derived from Tower.tsx's own crown
 *      formula (`TOWER_HEIGHT * 0.82`) so geometry + anchor never drift.
 *   2. The pill's preferred offset from the anchor is now semantic: the
 *      tower pill sits BELOW the crown (so it never pushes past the top),
 *      the EB3 pill sits beside the block on desktop / above it on mobile.
 *   3. useFrame projects the world anchor to screen coords and clamps the
 *      pill into a safe zone (viewport minus top/bottom/side margins), so
 *      no camera motion, zoom, or aspect ratio can push the pill off-screen.
 *   4. If the preferred offset would clip the pill, we FLIP the offset to
 *      the opposite side before falling back to the clamp.
 *   5. A short leader tick points back at the building so the lateral
 *      offset still reads as "attached" to the architecture.
 */

// ---------------- Mobile detection ----------------

function useMobile() {
  const [is, setIs] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => {
      const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
      setIs(window.innerWidth < 768 || (coarse && window.innerWidth < 900));
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);
  return is;
}

// ---------------- Pill helpers ----------------

/** Screen rects of pills placed this frame, used for collision avoidance. */
const placedPills = new Map<
  string,
  { index: number; x: number; y: number; halfW: number; halfH: number }
>();

/** Approximate pill half-dimensions for safe-zone clamping. */
function pillHalfSize(isMobile: boolean, id: string) {
  const halfW = isMobile
    ? 56
    : id === "fisherman-cove"
      ? 112
      : id === "signature-tower"
        ? 90
        : 70;
  const halfH = isMobile ? 16 : 18;
  return { halfW, halfH };
}

/**
 * Preferred CSS offset from the projected world anchor.
 *
 *   Signature Tower → BELOW the crown (dy > 0). Even on the shortest
 *                     landscape viewport the crown still projects above
 *                     the vertical centre, so pushing the pill down places
 *                     it comfortably inside the frame.
 *   EB3            → beside the block on desktop (leader tick back to it);
 *                     above the block on mobile (no horizontal offset so
 *                     the pill cannot escape the right edge).
 */
function preferredOffset(building: BuildingSpec, isMobile: boolean) {
  if (building.id === "signature-tower") {
    return { dx: 0, dy: isMobile ? 42 : 56 };
  }
  // Hotel sits at the top of the overview — keep the pill below the roof.
  // Airport sits at the bottom — keep the pill above the terminal.
  if (building.id === "fisherman-cove") {
    return { dx: 0, dy: isMobile ? 36 : 48 };
  }
  if (building.id === "airport") {
    return { dx: 0, dy: isMobile ? -36 : -46 };
  }
  if (isMobile) {
    return { dx: 0, dy: -30 };
  }
  return {
    dx: building.side === "left" ? -58 : 58,
    dy: -4,
  };
}

/** Short-form building label for mobile pills. */
function mobileLabel(id: string, full: string): string {
  if (id === "signature-tower") return "Tower";
  if (id === "eb3") return "EB3";
  return full;
}

// ---------------- Signature Tower direct-entry ----------------

function activate(building: BuildingSpec) {
  if (building.id === "fisherman-cove") {
    goToStop(STOPS.findIndex((s) => s.key === "fisherman-cove"));
    return;
  }
  if (building.directEntry && building.floors.length === 1 && building.floors[0].rooms.length === 1) {
    const room = building.floors[0].rooms[0];
    setFocus({
      level: "room",
      building: building.id,
      floor: building.floors[0].index,
      roomId: room.id,
    });
    // Short delay so the camera's "fly to the tower" move reads before we
    // dive into the dining interior.
    window.setTimeout(() => enterRoom(), 700);
    return;
  }
  openBuilding(building.id);
}

// ---------------- Component ----------------

export default function SpatialTiles() {
  const [visible, setVisible] = useState(journey.focus.level === "campus");
  const isMobile = useMobile();
  // drei's <Html> creates a React root in a layout effect. Mounting both
  // pills in the same first commit races that root (one portal stays empty).
  // Defer until after the canvas commit so both world anchors render.
  const [markersReady, setMarkersReady] = useState(false);

  useEffect(() => {
    const apply = () => setVisible(journey.focus.level === "campus");
    apply();
    return subscribeJourney(apply, "focus");
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => setMarkersReady(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <group>
      {markersReady && MARKER_BUILDINGS.map((id, i) => {
        const b = BUILDINGS[id];
        if (!b) return null;
        return (
          <Marker
            key={id}
            index={i}
            building={b}
            reveal={visible}
            icon={
              id === "eb3"
                ? "board"
                : id === "airport"
                  ? "plane"
                  : id === "fisherman-cove"
                    ? "hotel"
                    : "dining"
            }
            isMobile={isMobile}
          />
        );
      })}
    </group>
  );
}

function Marker({
  index,
  building,
  reveal,
  icon,
  isMobile,
}: {
  index: number;
  building: BuildingSpec;
  reveal: boolean;
  icon: "board" | "dining" | "hotel" | "plane";
  isMobile: boolean;
}) {
  const [hover, setHover] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { camera, size } = useThree();

  const anchor = useMemo(
    () =>
      new THREE.Vector3(
        building.markerPosition[0],
        building.markerPosition[1],
        building.markerPosition[2],
      ),
    [building.markerPosition],
  );
  const projected = useRef(new THREE.Vector3());

  useEffect(() => {
    const id = building.id;
    return () => {
      placedPills.delete(id);
    };
  }, [building.id]);

  const isTower = building.id === "signature-tower";

  // Per-frame projection + viewport safe-zone clamp. drei's <Html center>
  // positions the wrapper DIV at the world anchor's projected point. Our
  // inner wrapRef div's transform then nudges the pill into the safe zone.
  useFrame(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    // While hidden the opacity transition handles the fade; skip the maths.
    if (!reveal) {
      placedPills.delete(building.id);
      return;
    }

    projected.current.copy(anchor).project(camera);
    const sx = ((projected.current.x + 1) / 2) * size.width;
    const sy = (1 - (projected.current.y + 1) / 2) * size.height;

    const fallback = pillHalfSize(isMobile, building.id);
    // Prefer the real rendered size so long labels (Fisherman Cove) can't
    // escape the viewport on narrow screens.
    const measuredW = wrap.offsetWidth / 2;
    const measuredH = wrap.offsetHeight / 2;
    const halfW = measuredW > 0 ? measuredW : fallback.halfW;
    const halfH = measuredH > 0 ? measuredH : fallback.halfH;
    const { dx: prefDx, dy: prefDy } = preferredOffset(building, isMobile);

    // Safe zone — leave room for the header block / controls at the top (taller
    // on phones where the title wraps), agenda cards at the bottom, and
    // modest side gutters.
    const safeTop = isMobile ? 156 : 56;
    const safeBottom = size.height - 72;
    const safeLeft = 12 + halfW;
    const safeRight = size.width - 12 - halfW;

    let tx = sx + prefDx;
    let ty = sy + prefDy;

    // Try the preferred side first; if it clips vertically, flip to the
    // opposite side of the anchor before resorting to a hard clamp.
    if (prefDy < 0 && ty - halfH < safeTop) {
      ty = sy - prefDy; // flip below
    } else if (prefDy > 0 && ty + halfH > safeBottom) {
      ty = sy - prefDy; // flip above
    }

    // Horizontal flip for lateral desktop offsets.
    if (prefDx > 0 && tx + halfW > safeRight) {
      tx = sx - prefDx;
    } else if (prefDx < 0 && tx - halfW < safeLeft) {
      tx = sx - prefDx;
    }

    // Final hard clamp.
    ty = Math.max(safeTop + halfH, Math.min(safeBottom - halfH, ty));
    tx = Math.max(safeLeft, Math.min(safeRight, tx));

    // Pill-to-pill collision: markers are processed in MARKER_BUILDINGS order,
    // so each pill only yields to the ones already placed this frame. If it
    // overlaps one, nudge it vertically away from that pill's centre.
    const GAP = 6;
    for (const [otherId, o] of placedPills) {
      if (otherId === building.id || o.index > index) continue;
      const overlapX = Math.abs(tx - o.x) < halfW + o.halfW + GAP;
      const overlapY = Math.abs(ty - o.y) < halfH + o.halfH + GAP;
      if (overlapX && overlapY) {
        const dir = ty >= o.y ? 1 : -1;
        ty = o.y + dir * (halfH + o.halfH + GAP);
      }
    }
    ty = Math.max(safeTop + halfH, Math.min(safeBottom - halfH, ty));
    placedPills.set(building.id, { index, x: tx, y: ty, halfW, halfH });

    const finalDx = tx - sx;
    const finalDy = ty - sy;

    wrap.style.transform = `translate3d(${finalDx}px, ${finalDy}px, 0)`;
  });

  const label = isMobile ? mobileLabel(building.id, building.name) : building.name;

  const iconBoxClass = isMobile
    ? "flex h-4 w-4 items-center justify-center rounded-full"
    : "flex h-5 w-5 items-center justify-center rounded-full";
  const buttonPadClass = isMobile ? "px-2.5 py-1" : "px-3 py-1.5";
  const buttonGapClass = isMobile ? "gap-1.5" : "gap-2";
  const labelClass = isMobile
    ? "text-[9.5px] font-semibold uppercase tracking-[0.22em] text-slate-900"
    : "text-[10px] font-medium uppercase tracking-[0.28em] text-slate-900";

  return (
    <group position={[anchor.x, anchor.y, anchor.z]}>
      <Html
        center
        occlude={false}
        zIndexRange={[20, 10]}
        style={{
          pointerEvents: reveal ? "auto" : "none",
          userSelect: "none",
        }}
      >
        <div ref={wrapRef} style={{ willChange: "transform" }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              activate(building);
            }}
            onMouseEnter={() => {
              setHover(true);
              setHoverIndex(index);
            }}
            onMouseLeave={() => {
              setHover(false);
              if (journey.hoverIndex === index) setHoverIndex(null);
            }}
            onTouchStart={() => setHoverIndex(index)}
            onTouchEnd={() => {
              if (journey.hoverIndex === index) setHoverIndex(null);
            }}
            className={`group relative flex items-center rounded-full border focus:outline-none ${buttonGapClass} ${buttonPadClass}`}
            style={{
              background:
                "linear-gradient(140deg, rgba(255,248,246,0.94) 0%, rgba(255,228,234,0.82) 100%)",
              borderColor: hover
                ? "rgba(233,154,174,0.95)"
                : "rgba(196,164,172,0.85)",
              color: "#2a2428",
              backdropFilter: "blur(12px) saturate(160%)",
              WebkitBackdropFilter: "blur(12px) saturate(160%)",
              boxShadow: hover
                ? "0 12px 28px -12px rgba(244,163,193,0.65), 0 0 20px rgba(255,182,203,0.4), inset 0 1px 0 rgba(255,255,255,0.7)"
                : "0 8px 20px -12px rgba(244,163,193,0.45), inset 0 1px 0 rgba(255,255,255,0.6)",
              transform: hover
                ? "translateY(-2px)"
                : reveal
                  ? "translateY(0)"
                  : "translateY(4px)",
              opacity: reveal ? 1 : 0,
              filter: reveal ? "none" : "blur(4px)",
              transition:
                "opacity 380ms cubic-bezier(0.4,0,0.2,1), transform 320ms cubic-bezier(0.4,0,0.2,1), filter 380ms, background 200ms, box-shadow 200ms, border-color 200ms",
              whiteSpace: "nowrap",
            }}
          >
            <span
              aria-hidden
              className={iconBoxClass}
              style={{
                background: hover
                  ? "rgba(244,163,193,0.35)"
                  : "rgba(244,163,193,0.22)",
                color: "#7a2d47",
              }}
            >
              {icon === "board" ? (
                <BoardIcon size={isMobile ? 8 : 10} />
              ) : icon === "plane" ? (
                <PlaneIcon size={isMobile ? 8 : 10} />
              ) : icon === "hotel" ? (
                <HotelIcon size={isMobile ? 8 : 10} />
              ) : (
                <DiningIcon size={isMobile ? 8 : 10} />
              )}
            </span>
            <span className={labelClass}>{label}</span>

            {/* Leader tick back toward the building geometry.
                  tower   → vertical tick ABOVE the pill (pill sits below crown)
                  EB3     → horizontal tick toward the block (desktop only)
                mobile pills sit directly over the anchor and need no tick. */}
            {!isMobile && (isTower || building.id === "fisherman-cove") && (
              <span
                aria-hidden
                className="pointer-events-none absolute left-1/2 h-6 w-[1.5px]"
                style={{
                  top: "-26px",
                  background:
                    "linear-gradient(0deg, rgba(255,182,203,0.9), rgba(255,182,203,0))",
                  transform: "translateX(-50%)",
                  opacity: hover ? 1 : 0.7,
                  transition: "opacity 220ms",
                }}
              />
            )}
            {!isMobile && building.id === "airport" && (
              <span
                aria-hidden
                className="pointer-events-none absolute left-1/2 h-6 w-[1.5px]"
                style={{
                  bottom: "-26px",
                  background:
                    "linear-gradient(180deg, rgba(255,182,203,0.9), rgba(255,182,203,0))",
                  transform: "translateX(-50%)",
                  opacity: hover ? 1 : 0.7,
                  transition: "opacity 220ms",
                }}
              />
            )}
            {!isMobile && !isTower && building.id !== "fisherman-cove" && building.id !== "airport" && (
              <span
                aria-hidden
                className="pointer-events-none absolute top-1/2 h-[1.5px] w-3"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,182,203,0.9), rgba(255,182,203,0))",
                  [building.side === "left" ? "right" : "left"]: "-12px",
                  transform: `translateY(-50%) ${building.side === "left" ? "" : "scaleX(-1)"}`,
                  opacity: hover ? 1 : 0.6,
                  transition: "opacity 220ms",
                }}
              />
            )}
          </button>
        </div>
      </Html>
    </group>
  );
}

// ---------------- Icons ----------------

function BoardIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <rect x="1.5" y="2.5" width="9" height="6" rx="1" stroke="currentColor" strokeWidth="1.1" />
      <path d="M4 9v1.5M8 9v1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function HotelIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path d="M2 10V4.5L6 2.2 10 4.5V10" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M5 10V7.2h2V10" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function PlaneIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path
        d="M2 6.2h2.2L6 3.2l.7.4L6.2 6.2H9l.8.7H6.4L7 9.4 6.2 9.7 5.2 7.2H2.6L2 6.2Z"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DiningIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path d="M3 2v4a1 1 0 0 0 1 1v3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M5 2v3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M8.5 2c-1 0-1.5.8-1.5 2s.5 2 1.5 2v4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
