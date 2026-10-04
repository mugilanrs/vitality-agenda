"use client";

import { useEffect, useState } from "react";
import { journey, subscribeJourney } from "@/lib/journey";
import { STOPS, goToStop, stopIndexForFocus } from "@/lib/stops";

/**
 * Legacy-ported side rails:
 *   left  — small round icon buttons that pop a detail card (calendar, phone)
 *   right — one "Navigate" card: every stop in visiting order, with times
 *
 * On desktop both rails are fixed to the viewport mid-height. On tablet /
 * mobile they fold into a slide-up sheet toggled by an "Info & options" pill
 * at the top of the viewport.
 *
 * Hidden while the welcome intro is up or when the user is inside an interior
 * room (so interior chrome never fights the room's own leave button).
 */
export default function SideRails() {
  const [welcome, setWelcome] = useState(journey.welcome);
  const [focus, setFocusState] = useState(() => ({ ...journey.focus }));
  const [openIcon, setOpenIcon] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const applyW = () => setWelcome(journey.welcome);
    const applyF = () => setFocusState({ ...journey.focus });
    applyW();
    applyF();
    const un1 = subscribeJourney(applyW, "welcome");
    const un2 = subscribeJourney(applyF, "focus");
    return () => {
      un1();
      un2();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setNarrow(window.innerWidth < 1160);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (welcome) return null;
  if (focus.level === "inside") return null;
  // Destination screens (EB3 chooser, Airport, Fisherman Cove) have their own
  // Previous / Next room buttons, so the rails would only get in the way.
  if (focus.level === "building") return null;

  const currentStop = stopIndexForFocus(focus);

  const content = (
    <>
      {/* ------- Left rail ------- */}
      <div className="rail rail-left pointer-events-none">
        <IconButton
          id="calendar"
          open={openIcon === "calendar"}
          onToggle={(x) => setOpenIcon(openIcon === x ? null : x)}
          label="When"
          detailTitle="Day plan"
          detailBody={
            <ul className="rail-list">
              <li>
                <span>Date</span>
                <b>Thu · 2026-10-02</b>
              </li>
              <li>
                <span>From</span>
                <b>09:00</b>
              </li>
              <li>
                <span>To</span>
                <b>17:30</b>
              </li>
              <li>
                <span>Venue</span>
                <b>TCS Siruseri</b>
              </li>
            </ul>
          }
          icon={
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
              <path d="M3 9h18M8 2.5v4M16 2.5v4" />
            </svg>
          }
        />
        <IconButton
          id="phone"
          open={openIcon === "phone"}
          onToggle={(x) => setOpenIcon(openIcon === x ? null : x)}
          label="Contact"
          detailTitle="On the day"
          detailBody={
            <ul className="rail-list">
              <li>
                <span>Reception</span>
                <b>Ext. 1200</b>
              </li>
              <li>
                <span>Guest desk</span>
                <b>Ext. 1201</b>
              </li>
              <li>
                <span>Logistics</span>
                <b>Ext. 1250</b>
              </li>
            </ul>
          }
          icon={
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 5.5c0-.8.7-1.5 1.5-1.5H8l1.5 4-2 1.2a12 12 0 0 0 5.8 5.8l1.2-2 4 1.5v2.5c0 .8-.7 1.5-1.5 1.5A15.5 15.5 0 0 1 4 5.5z" />
            </svg>
          }
        />
      </div>

      {/* ------- Right rail: one navigation card ------- */}
      <div className="rail rail-right pointer-events-none">
        <div className="rail-card">
          <div className="rail-eyebrow">Navigate</div>
          <ul className="rail-jump">
            {STOPS.map((stop, i) => (
              <li key={stop.key} aria-current={i === currentStop || undefined}>
                <button type="button" onClick={() => goToStop(i)}>
                  <span className="rn">{String(i + 1).padStart(2, "0")}</span>
                  <span className="rtxt">
                    <span className="rnm">{stop.label}</span>
                    {stop.meta && <span className="rmeta">{stop.meta}</span>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );

  const sheetContent = (
    <>
      <div className="sheet-head">
        <b>Info &amp; navigation</b>
        <button
          type="button"
          className="sheet-close"
          onClick={() => setSheetOpen(false)}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      {content}
    </>
  );

  return (
    <>
      <style jsx global>{railStyles}</style>

      {narrow ? (
        <>
          <button
            type="button"
            className="menu-btn"
            onClick={() => setSheetOpen((x) => !x)}
          >
            Info &amp; navigation
          </button>
          {sheetOpen && (
            <div
              className="sheet-backdrop"
              onClick={() => setSheetOpen(false)}
            />
          )}
          <div className={`railwrap${sheetOpen ? " open" : ""}`}>
            {sheetContent}
          </div>
        </>
      ) : (
        content
      )}
    </>
  );
}

// ---------------- Icon button ----------------

function IconButton({
  id,
  open,
  onToggle,
  label,
  detailTitle,
  detailBody,
  icon,
}: {
  id: string;
  open: boolean;
  onToggle: (id: string) => void;
  label: string;
  detailTitle: string;
  detailBody: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className={`rail-item${open ? " open" : ""}`}>
      <button
        type="button"
        className="rail-icon"
        onClick={() => onToggle(id)}
        aria-label={label}
      >
        {icon}
      </button>
      <div className="rail-pop">
        <div className="rail-card">
          <div className="rail-eyebrow">{label}</div>
          <h3>{detailTitle}</h3>
          {detailBody}
        </div>
      </div>
    </div>
  );
}

// ---------------- Styles (ported from legacy index.html) ----------------

const railStyles = `
  .rail {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    z-index: 25;
    width: 214px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    pointer-events: none;
  }
  .rail-left { left: 22px; }
  .rail-right { right: 22px; width: 262px; }
  .rail-card {
    pointer-events: auto;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 14px 15px;
    box-shadow: var(--shadow);
    color: var(--ink);
  }
  .rail-eyebrow {
    margin: 0 0 9px;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--pink);
  }
  .rail-card h3 {
    margin: 0 0 11px;
    font-family: var(--font-bricolage), "Bricolage Grotesque", serif;
    font-weight: 800;
    font-size: 17px;
    letter-spacing: -0.01em;
    color: var(--ink);
  }
  .rail-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .rail-list li {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    font-size: 12px;
    color: var(--muted);
  }
  .rail-list li b {
    color: var(--ink);
    font-weight: 600;
  }
  .rail-jump {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .rail-jump button {
    width: 100%;
    display: grid;
    grid-template-columns: 22px 1fr;
    gap: 8px;
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 9px;
    padding: 7px 8px;
    cursor: pointer;
    text-align: left;
    color: var(--ink);
    font: inherit;
    transition: background-color 0.15s ease;
  }
  .rail-jump button:hover {
    background: var(--soft);
  }
  .rail-jump li[aria-current="true"] button {
    background: var(--soft);
  }
  .rail-jump li[aria-current="true"] .rn {
    color: var(--pink);
  }
  .rail-jump li[aria-current="true"] .rnm {
    color: var(--deep);
  }
  .rail-jump .rn {
    font-family: var(--font-bricolage), "Bricolage Grotesque", serif;
    font-weight: 800;
    font-size: 11px;
    color: var(--muted);
  }
  .rail-jump .rtxt {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }
  .rail-jump .rnm {
    font-weight: 700;
    font-size: 13px;
  }
  .rail-jump .rmeta {
    font-size: 11px;
    font-weight: 500;
    color: var(--muted);
  }
  .rail-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .rail-chip {
    font: inherit;
    font-weight: 600;
    font-size: 12px;
    color: var(--deep);
    background: var(--soft);
    border: 0;
    border-radius: 999px;
    padding: 6px 12px;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
  }
  .rail-chip:hover {
    background: var(--pink);
    color: #fff;
  }

  .rail-item {
    position: relative;
    pointer-events: auto;
  }
  .rail-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 1px solid var(--line);
    background: var(--card);
    box-shadow: var(--shadow);
    color: var(--deep);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
  }
  .rail-icon:hover {
    background: var(--soft);
    transform: translateY(-1px);
  }
  .rail-item.open .rail-icon {
    background: var(--pink);
    color: #fff;
    border-color: var(--pink);
  }
  .rail-pop {
    position: absolute;
    top: 0;
    left: 64px;
    width: 214px;
    z-index: 6;
    opacity: 0;
    visibility: hidden;
    transform: translateX(-6px);
    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
  }
  .rail-item.open .rail-pop {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
  }

  .railwrap { display: contents; }
  .menu-btn, .sheet-head, .sheet-backdrop { display: none; }

  @media (max-width: 1160px) {
    .rail-left, .rail-right {
      position: static;
      transform: none;
      width: auto;
      left: auto;
      right: auto;
    }
    .rail-icon { display: none; }
    .rail-item { position: static; }
    .rail-pop {
      position: static;
      width: auto;
      opacity: 1;
      visibility: visible;
      transform: none;
    }
    .railwrap {
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 29;
      max-height: 84vh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      background: var(--paper);
      border-radius: 22px 22px 0 0;
      padding: 14px 16px calc(20px + env(safe-area-inset-bottom, 0px));
      box-shadow: 0 -22px 55px -20px rgba(0, 0, 0, 0.45);
      transform: translateY(104%);
      transition: transform 0.4s cubic-bezier(0.22, 0.9, 0.36, 1);
    }
    .railwrap.open { transform: translateY(0); }
    .sheet-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 2px 4px;
    }
    .sheet-head b {
      font-family: var(--font-bricolage), "Bricolage Grotesque", serif;
      font-weight: 800;
      font-size: 15px;
    }
    .sheet-close {
      width: 30px;
      height: 30px;
      border: 0;
      border-radius: 50%;
      background: var(--soft);
      color: var(--deep);
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
    }
    .menu-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      position: fixed;
      z-index: 28;
      top: calc(14px + env(safe-area-inset-top, 0px));
      left: 50%;
      transform: translateX(-50%);
      font: inherit;
      font-weight: 700;
      font-size: 13px;
      color: var(--ink);
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 9px 16px;
      box-shadow: var(--shadow);
      cursor: pointer;
    }
    .sheet-backdrop {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 27;
      background: rgba(10, 14, 24, 0.42);
    }
  }
`;
