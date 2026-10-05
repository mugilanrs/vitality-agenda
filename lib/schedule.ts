/**
 * Event clock. Session times are written in IST (e.g. "10:00 AM — 10:30 AM")
 * on the event day; these helpers turn them into real timestamps so the UI
 * can follow the actual date and time.
 */

import type { AgendaRoom, AgendaSession } from "@/data/agendaRooms";

export const EVENT_DATE = { year: 2026, month: 10, day: 8 }; // Thu 8 Oct 2026
const IST_OFFSET_MIN = 330;

function minutesOfDay(text: string | undefined): number | null {
  const m = /(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(text ?? "");
  if (!m) return null;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return h * 60 + Number(m[2]);
}

function toEpoch(minutes: number): number {
  return (
    Date.UTC(EVENT_DATE.year, EVENT_DATE.month - 1, EVENT_DATE.day, 0, minutes) -
    IST_OFFSET_MIN * 60_000
  );
}

export type TimedSession = {
  session: AgendaSession;
  room: AgendaRoom;
  start: number;
  end: number;
};

/** All of the attendee's sessions with real start/end timestamps, in order. */
export function timedSessions(rooms: AgendaRoom[]): TimedSession[] {
  const out: TimedSession[] = [];
  for (const room of rooms) {
    for (const session of room.sessions) {
      const [a, b] = session.time.split("—");
      const s = minutesOfDay(a);
      const e = minutesOfDay(b);
      if (s == null || e == null) continue;
      out.push({ session, room, start: toEpoch(s), end: toEpoch(e) });
    }
  }
  return out.sort((x, y) => x.start - y.start);
}

export type NextUp =
  | { kind: "first" | "now" | "next"; item: TimedSession }
  | { kind: "done" }
  | null;

/**
 * Before their first session (or before the event day): the first session.
 * During a session: that session ("now"). Between sessions: the next one.
 * After their last session: "done".
 */
export function nextUp(rooms: AgendaRoom[], now: number): NextUp {
  const all = timedSessions(rooms);
  if (all.length === 0) return null;
  if (now < all[0].start) return { kind: "first", item: all[0] };
  const current = all.find((t) => now >= t.start && now < t.end);
  if (current) return { kind: "now", item: current };
  const upcoming = all.find((t) => t.start > now);
  return upcoming ? { kind: "next", item: upcoming } : { kind: "done" };
}

/** "11:30 AM" / "9:00 PM" for the first start and last end of the day. */
export function dayHours(rooms: AgendaRoom[]): { from: string; to: string } | null {
  const sessions = rooms.flatMap((r) => r.sessions);
  if (sessions.length === 0) return null;
  const byStart = [...sessions].sort(
    (a, b) => (minutesOfDay(a.time.split("—")[0]) ?? 0) - (minutesOfDay(b.time.split("—")[0]) ?? 0),
  );
  const byEnd = [...sessions].sort(
    (a, b) => (minutesOfDay(a.time.split("—")[1]) ?? 0) - (minutesOfDay(b.time.split("—")[1]) ?? 0),
  );
  return {
    from: byStart[0].time.split("—")[0].trim(),
    to: byEnd[byEnd.length - 1].time.split("—")[1].trim(),
  };
}

export const IST = "Asia/Kolkata";
