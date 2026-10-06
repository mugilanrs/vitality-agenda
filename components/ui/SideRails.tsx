"use client";

import { useEffect, useState } from "react";
import { journey, subscribeJourney } from "@/lib/journey";
import { getStops, goToStop, stopIndexForFocus } from "@/lib/stops";
import { getAgendaRooms, getContacts } from "@/lib/agendaStore";
import { dayHours, IST } from "@/lib/schedule";
import { useNow } from "@/lib/useNow";

/**
 * Legacy-ported side rails:
 *   left  — small round icon buttons that pop a detail card (calendar, phone)
 *   right — a Navigate icon (closed by default) that opens one card: every
 *           stop in visiting order, with times
 *
 * On desktop both rails are fixed to the viewport mid-height. On tablet /
 * mobile they fold into a slide-up sheet toggled by an "Info & options" pill
 * at the top of the viewport.
 *
 * Hidden while the welcome intro is up or when the user is inside an interior
 * room (so interior chrome never fights the room's own leave button).
 */
const HINT_KEY = "vv_nav_hint_seen";

export default function SideRails() {
  const [welcome, setWelcome] = useState(journey.welcome);
  const [focus, setFocusState] = useState(() => ({ ...journey.focus }));
  const [openIcon, setOpenIcon] = useState<string | null>(null);
  // The Navigate card starts closed on every screen size.
  const [navOpen, setNavOpen] = useState(false);
  // "Tap here to navigate" hint: shown until the user taps it or the icon.
  const [hint, setHint] = useState(false);

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

  // Show the hint once the map is up, unless this device has dismissed it.
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(HINT_KEY) === "1";
    } catch {
      // Storage blocked: just show it for this visit.
    }
    if (seen) return;
    const t = window.setTimeout(() => setHint(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  const dismissHint = () => {
    setHint(false);
    try {
      localStorage.setItem(HINT_KEY, "1");
    } catch {
      // ignore
    }
  };

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
          detailBody={<CalendarDetail />}
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
          detailBody={<ContactsDetail />}
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

      {/* ------- Right rail: navigation icon, opens the stop list ------- */}
      <div className={`rail rail-right pointer-events-none${navOpen ? "" : " closed"}`}>
        {navOpen ? (
          <div className="rail-card">
            <div className="rail-head">
              <div className="rail-eyebrow">Navigate</div>
              <button
                type="button"
                className="rail-close"
                aria-label="Close navigation"
                onClick={() => setNavOpen(false)}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <ul className="rail-jump">
              {getStops().map((stop, i) => (
                <li key={stop.key} aria-current={i === currentStop || undefined}>
                  <button
                    type="button"
                    onClick={() => {
                      setNavOpen(false);
                      goToStop(i);
                    }}
                  >
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
        ) : (
          <div className="rail-item rail-nav">
            {hint && (
              <button type="button" className="rail-hint" onClick={dismissHint}>
                Tap here to navigate
              </button>
            )}
            <button
              type="button"
              className="rail-icon"
              aria-label="Navigate"
              aria-expanded="false"
              onClick={() => {
                dismissHint();
                setNavOpen(true);
              }}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l7 17-7-4-7 4z" />
              </svg>
              {currentStop >= 0 && <span className="rail-dot" aria-hidden="true" />}
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <style jsx global>{railStyles}</style>
      {content}
    </>
  );
}

// ---------------- Calendar + contacts ----------------

function CalendarDetail() {
  const now = useNow(1000);
  const hours = dayHours(getAgendaRooms());
  const date = (opts: Intl.DateTimeFormatOptions) =>
    now == null ? "" : new Intl.DateTimeFormat("en-GB", { timeZone: IST, ...opts }).format(now);
  return (
    <ul className="rail-list">
      <li>
        <span>Event day</span>
        <b>Thu · 8 Oct 2026</b>
      </li>
      {hours && (
        <>
          <li>
            <span>From</span>
            <b>{hours.from}</b>
          </li>
          <li>
            <span>To</span>
            <b>{hours.to}</b>
          </li>
        </>
      )}
      <li>
        <span>Venue</span>
        <b>TCS Siruseri</b>
      </li>
      <li>
        <span>Today (IST)</span>
        <b suppressHydrationWarning>
          {date({ weekday: "short", day: "numeric", month: "short", year: "numeric" })}
        </b>
      </li>
      <li>
        <span>Time now</span>
        <b className="tabular-nums" suppressHydrationWarning>
          {date({ hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
        </b>
      </li>
    </ul>
  );
}

function ContactsDetail() {
  const contacts = getContacts();
  if (contacts.length === 0) {
    return <p style={{ margin: 0, fontSize: 12, color: "var(--muted)" }}>Contacts will be shared soon.</p>;
  }
  return (
    <ul className="rail-list">
      {contacts.map((c, i) => (
        <li key={`${c.phone}-${i}`}>
          <span>{c.role || c.name}</span>
          <b>
            {c.role && c.name ? `${c.name} · ` : ""}
            <a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} style={{ color: "var(--pink)" }}>
              {c.phone}
            </a>
          </b>
        </li>
      ))}
    </ul>
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
  /* Navigate: bottom-centre on every screen, raised off the browser bar. */
  .rail-right {
    top: auto;
    right: auto;
    left: 50%;
    transform: translateX(-50%);
    bottom: calc(2.75rem + env(safe-area-inset-bottom, 0px));
    width: 262px;
  }
  .rail-right.closed { width: auto; align-items: center; }
  .rail-nav { position: relative; display: flex; justify-content: center; }
  .rail-hint {
    position: absolute;
    bottom: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    pointer-events: auto;
    border: 1px solid rgba(24, 32, 51, 0.08);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.92);
    color: #5b5560;
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    padding: 7px 14px;
    box-shadow: 0 6px 18px -8px rgba(24, 32, 51, 0.3);
    cursor: pointer;
    animation: rail-hint-in 0.5s ease both;
  }
  .rail-hint::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -5px;
    width: 9px;
    height: 9px;
    background: rgba(255, 255, 255, 0.92);
    border-right: 1px solid rgba(24, 32, 51, 0.08);
    border-bottom: 1px solid rgba(24, 32, 51, 0.08);
    transform: translateX(-50%) rotate(45deg);
  }
  @keyframes rail-hint-in {
    from { opacity: 0; transform: translate(-50%, 4px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .rail-hint { animation: none; }
  }
  .rail-head { display: flex; align-items: center; justify-content: space-between; }
  .rail-head .rail-eyebrow { margin-bottom: 9px; }
  .rail-close {
    width: 28px;
    height: 28px;
    margin: -6px -6px 0 0;
    border: 0;
    border-radius: 50%;
    background: var(--soft);
    color: var(--deep);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .rail-icon { position: relative; }
  .rail-dot {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--pink);
    border: 2px solid var(--card);
  }
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

  /* Tablets and phones: the day-plan / contact icons sit top-right as round
     icons, and the Navigate card opens along the bottom (icon when closed). */
  @media (max-width: 1160px) {
    .rail-left {
      top: calc(14px + env(safe-area-inset-top, 0px));
      right: calc(14px + env(safe-area-inset-right, 0px));
      left: auto;
      transform: none;
      width: auto;
      align-items: flex-end;
      gap: 10px;
    }
    .rail-icon { width: 44px; height: 44px; }
    .rail-pop {
      left: auto;
      right: 54px;
      width: 230px;
      transform: translateX(6px);
    }
    .rail-item.open .rail-pop { transform: translateX(0); }
    .rail-right {
      transform: none;
      left: 12px;
      right: 12px;
      bottom: calc(12px + env(safe-area-inset-bottom, 0px));
      width: auto;
    }
    /* Closed: back to the centred, raised icon. */
    .rail-right.closed {
      left: 50%;
      right: auto;
      transform: translateX(-50%);
      bottom: calc(2.75rem + env(safe-area-inset-bottom, 0px));
    }
    .rail-right .rail-card {
      padding: 12px 13px;
      max-height: calc(100dvh - 12rem);
      overflow-y: auto;
    }
    .rail-right .rail-jump button { padding: 5px 8px; }
  }

  /* Phones: one line per stop (name left, time right) so the whole card fits. */
  @media (max-width: 640px) {
    .rail-right {
      left: 10px;
      right: 10px;
      bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    }
    .rail-right .rail-card { padding: 9px 10px; }
    .rail-right .rail-eyebrow { margin-bottom: 3px; font-size: 10px; }
    .rail-right .rail-jump { gap: 0; }
    .rail-right .rail-jump button {
      grid-template-columns: 18px 1fr;
      gap: 6px;
      padding: 4px 6px;
    }
    .rail-right .rail-jump .rtxt {
      flex-direction: row;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
    }
    .rail-right .rail-jump .rnm {
      font-size: 12px;
      white-space: nowrap;
    }
    .rail-right .rail-jump .rmeta {
      font-size: 10.5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }
  }
`;
