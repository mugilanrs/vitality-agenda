import type { AgendaRoom } from "@/data/agendaRooms";
import { BUILDINGS } from "@/data/buildings";
import { getAgendaRooms } from "@/lib/agendaStore";
import { journey, setActiveSession, setFocus, type FocusState } from "@/lib/journey";

/**
 * The visiting order used by the room "Previous / Next" buttons and the
 * main-map navigation card, built from the logged-in attendee's own sessions:
 * Airport, then each room in time order. A room that is left and revisited
 * (e.g. the EB3 afternoon room around the EB5 session) gives two stops.
 */

export type Stop = {
  key: string;
  /** Short building name, e.g. "EB3". */
  building: string;
  label: string;
  /** One-line summary: time range, or what happens there. */
  meta: string;
  focus: FocusState;
  /** Agenda room id for stops that open an isometric room. */
  agendaRoomId?: string;
  /** The attendee's sessions covered by this stop, in order. */
  sessionIds?: string[];
};

const ROOM_LABELS: Record<string, { building: string; label: string; lead?: string }> = {
  "eb3-board-morning": { building: "EB3", label: "EB3 Board Room · Morning" },
  "eb3-board-afternoon": { building: "EB3", label: "EB3 Board Room · Afternoon" },
  "eb5-account-room": { building: "EB5", label: "EB5 · Account Room" },
  "signature-executive-dining": { building: "Signature Tower", label: "Signature Tower", lead: "Lunch" },
  "fisherman-cove-dinner": { building: "Fisherman Cove", label: "Fisherman Cove", lead: "Dinner" },
};

/** Display name for a room, e.g. "EB5 · Account Room". */
export function roomLabel(room: AgendaRoom): string {
  return ROOM_LABELS[room.id]?.label ?? room.name;
}

function startMinutes(time: string): number {
  const m = /(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(time.split("—")[0] ?? "");
  if (!m) return 0;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return h * 60 + Number(m[2]);
}

function span(sessions: { time: string }[]): string {
  const first = sessions[0]?.time.split("—")[0]?.trim() ?? "";
  const last = sessions[sessions.length - 1]?.time.split("—")[1]?.trim() ?? "";
  return first && last ? `${first} – ${last}` : "";
}

function dayLine(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" · ");
}

function buildStops(rooms: AgendaRoom[]): Stop[] {
  const stops: Stop[] = [
    {
      key: "airport",
      building: "Airport",
      label: "Airport",
      meta: BUILDINGS["airport"]?.external?.title ?? "Arrival / Departure",
      focus: { level: "building", building: "airport" },
    },
  ];

  // Every session in time order, tagged with its room; consecutive sessions in
  // the same room form one stop.
  const flat = rooms
    .flatMap((room) => room.sessions.map((session) => ({ room, session })))
    .sort((a, b) => startMinutes(a.session.time) - startMinutes(b.session.time));

  const runs: { room: AgendaRoom; sessions: AgendaRoom["sessions"] }[] = [];
  for (const { room, session } of flat) {
    const last = runs[runs.length - 1];
    if (last && last.room.id === room.id) last.sessions.push(session);
    else runs.push({ room, sessions: [session] });
  }

  const seen = new Map<string, number>();
  for (const { room, sessions } of runs) {
    const n = (seen.get(room.id) ?? 0) + 1;
    seen.set(room.id, n);
    const info = ROOM_LABELS[room.id] ?? { building: room.name, label: room.name };
    stops.push({
      key: n === 1 ? room.id : `${room.id}#${n}`,
      building: info.building,
      label: info.label,
      meta: dayLine(info.lead, span(sessions)),
      focus: { level: "inside", building: room.buildingId, floor: room.floor, roomId: room.roomId },
      agendaRoomId: room.id,
      sessionIds: sessions.map((s) => s.id),
    });
  }
  return stops;
}

let cache: { rooms: AgendaRoom[]; stops: Stop[] } | null = null;

/** The attendee's stops (rebuilt only when their rooms change). */
export function getStops(): Stop[] {
  const rooms = getAgendaRooms();
  if (!cache || cache.rooms !== rooms) cache = { rooms, stops: buildStops(rooms) };
  return cache.stops;
}

/** Index of the stop the given focus is on, or -1 (e.g. campus overview). */
export function stopIndexForFocus(focus: FocusState): number {
  const stops = getStops();
  const matches: number[] = [];
  stops.forEach((s, i) => {
    const f = s.focus;
    if (f.level !== focus.level || f.building !== focus.building) return;
    if (f.level === "inside" && (f.floor !== focus.floor || f.roomId !== focus.roomId)) return;
    matches.push(i);
  });
  if (matches.length <= 1) return matches[0] ?? -1;
  // Same room visited twice: the active session says which visit this is.
  return (
    matches.find((i) => journey.sessionId && stops[i].sessionIds?.includes(journey.sessionId)) ??
    matches[0]
  );
}

export function goToStop(index: number) {
  const stop = getStops()[index];
  if (!stop) return;
  if (stop.sessionIds?.[0]) setActiveSession(stop.sessionIds[0]);
  setFocus({ ...stop.focus });
}
