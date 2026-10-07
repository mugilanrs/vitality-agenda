"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setAgendaRooms, setArrivals, setProfile, type ArrivalGroup, type Contact } from "@/lib/agendaStore";
import type { AgendaRoom } from "@/data/agendaRooms";
import CampusScene from "@/components/campus/CampusScene";
import CampusJourney, {
  type JourneyHandle,
} from "@/components/campus/CampusJourney";
import WelcomeIntro from "@/components/ui/WelcomeIntro";
import AgendaOverlay from "@/components/ui/AgendaOverlay";
import BrandMark from "@/components/ui/BrandMark";
import TopMist from "@/components/ui/TopMist";
import DebugOverlay from "@/components/ui/DebugOverlay";
import SideRails from "@/components/ui/SideRails";
import WebGLBoundary from "@/components/ui/WebGLBoundary";

/**
 * Composition:
 *   fixed z0    <CampusScene>    — R3F canvas; campus + interior rooms
 *   in-flow     <CampusJourney>  — invisible scroll spacer (kept intact from
 *                                  Phase 5; still lets the user scroll through
 *                                  the campus while on the 'campus' focus)
 *   fixed z20   <BrandMark>      — small TCS · Vitality brand mark
 *   fixed z30   <AgendaOverlay>  — pink glass tiles + drill-down
 *   fixed z40   <DebugOverlay>   — Shift+D, dev only
 *   fixed z60   <WelcomeIntro>   — cloud opening, dismisses on click
 */
export default function Home() {
  const journeyRef = useRef<JourneyHandle | null>(null);
  const router = useRouter();
  const [ready, setReady] = useState(false);

  // Load the signed-in attendee's own rooms before anything is drawn; without
  // a valid session, go to the login page.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/me", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("unauthorised");
        const data = (await res.json()) as {
          name: string;
          rooms: AgendaRoom[];
          contacts: Contact[];
          arrivals: ArrivalGroup[];
        };
        if (cancelled) return;
        setAgendaRooms(data.rooms);
        setArrivals(data.arrivals);
        setProfile(data.name, data.contacts);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) router.replace("/login");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) {
    return (
      <div
        className="fixed inset-0"
        style={{ background: "linear-gradient(180deg, #FBE8D2, #F2C2D6)" }}
      />
    );
  }

  return (
    <>
      {/* The canvas fills the DYNAMIC viewport (100dvh) rather than 100vh so
          iOS Safari's collapsing URL bar can't reintroduce a letterbox on the
          bottom. Width uses 100vw + safe-area insets so home-bar padding on
          landscape iPhones doesn't crop the campus. */}
      <div
        className="fixed left-0 top-0 z-0"
        style={{
          width: "100vw",
          height: "100dvh",
          // 100dvh is unsupported on old Safari — fall back cleanly.
          minHeight: "100vh",
        }}
      >
        <WebGLBoundary>
          <CampusScene />
        </WebGLBoundary>
        <TopMist />
      </div>

      <CampusJourney ref={journeyRef} onActive={() => {}} />

      <div
        className="pointer-events-none fixed left-0 top-0 z-20"
        style={{ width: "100vw", height: "100dvh" }}
      >
        <BrandMark />
      </div>

      <AgendaOverlay />

      <SideRails />

      <div
        className="pointer-events-none fixed left-0 top-0 z-40"
        style={{ width: "100vw", height: "100dvh" }}
      >
        <DebugOverlay />
      </div>

      <WelcomeIntro />
    </>
  );
}
