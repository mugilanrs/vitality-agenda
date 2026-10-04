import { AGENDA_ROOMS } from "@/data/agendaRooms";
import { BUILDINGS } from "@/data/buildings";
import { setActiveSession, setFocus, type FocusState } from "@/lib/journey";

/**
 * The fixed visiting order used by the room "Previous / Next" buttons and the
 * main-map navigation card:
 *   Airport → EB3 Board Room Morning → Signature Tower →
 *   EB3 Board Room Afternoon → Fisherman Cove
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
};

function span(roomId: string): string {
  const room = AGENDA_ROOMS.find((r) => r.id === roomId);
  const first = room?.sessions[0]?.time.split("—")[0]?.trim() ?? "";
  const last = room?.sessions[room.sessions.length - 1]?.time.split("—")[1]?.trim() ?? "";
  return first && last ? `${first} – ${last}` : "";
}

function dayLine(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" · ");
}

export const STOPS: Stop[] = [
  {
    key: "airport",
    building: "Airport",
    label: "Airport",
    meta: BUILDINGS["airport"]?.external?.title ?? "Arrival / Departure",
    focus: { level: "building", building: "airport" },
  },
  {
    key: "eb3-board-morning",
    building: "EB3",
    label: "EB3 Board Room · Morning",
    meta: span("eb3-board-morning"),
    focus: { level: "inside", building: "eb3", floor: 1, roomId: "board-am" },
    agendaRoomId: "eb3-board-morning",
  },
  {
    key: "signature-tower",
    building: "Signature Tower",
    label: "Signature Tower",
    meta: dayLine("Lunch", span("signature-executive-dining")),
    focus: {
      level: "inside",
      building: "signature-tower",
      floor: 0,
      roomId: "executive-dining",
    },
    agendaRoomId: "signature-executive-dining",
  },
  {
    key: "eb3-board-afternoon",
    building: "EB3",
    label: "EB3 Board Room · Afternoon",
    meta: span("eb3-board-afternoon"),
    focus: { level: "inside", building: "eb3", floor: 2, roomId: "board-pm" },
    agendaRoomId: "eb3-board-afternoon",
  },
  {
    key: "fisherman-cove",
    building: "Fisherman Cove",
    label: "Fisherman Cove",
    meta: dayLine(
      BUILDINGS["fisherman-cove"]?.subtitle,
      BUILDINGS["fisherman-cove"]?.external?.time?.replace("—", "–"),
    ),
    focus: { level: "building", building: "fisherman-cove" },
  },
];

/** Index of the stop the given focus is on, or -1 (e.g. campus overview). */
export function stopIndexForFocus(focus: FocusState): number {
  return STOPS.findIndex((s) => {
    const f = s.focus;
    if (f.level !== focus.level || f.building !== focus.building) return false;
    if (f.level === "inside") return f.floor === focus.floor && f.roomId === focus.roomId;
    return true;
  });
}

export function goToStop(index: number) {
  const stop = STOPS[index];
  if (!stop) return;
  if (stop.agendaRoomId) {
    const room = AGENDA_ROOMS.find((r) => r.id === stop.agendaRoomId);
    setActiveSession(room?.sessions[0]?.id ?? null);
  }
  setFocus({ ...stop.focus });
}
