/**
 * Room chapters for the journey. The campus markers still use the
 * building/floor/room ids in buildings.ts; this file is the agenda
 * those rooms display.
 *
 * Types only. The full timetable (with who attends what) lives in
 * data/agendaSource.ts and is only ever read on the server; the browser
 * receives just the logged-in attendee's rooms via /api/me.
 */

export type SessionProp =
  | "reception"
  | "horizon"
  | "ideation"
  | "sprint"
  | "aishield"
  | "cloche"
  | "maturityloop"
  | "autonomy"
  | "runcycle"
  | "hexcloud"
  | "casefiles"
  | "contextstack"
  | "candle";

export type AgendaSession = {
  id: string;
  time: string;
  title: string;
  detail: string;
  /** Overrides the default label under the room prop. */
  label?: string;
  /** Hosts, one entry per person; "to be confirmed" when absent. */
  speakers?: readonly string[];
  /** Who attends. Only ever set for the admin view. */
  attendeeNames?: readonly string[];
  /** Which floating prop represents this session in the room. */
  prop: SessionProp;
  /** Fixed isometric slot for this session's hotspot [a, b]. */
  propSlot: readonly [number, number];
};

export type RoomType = "boardroom" | "odc" | "dining" | "pavilion";

export type AgendaRoom = {
  id: string;
  buildingId: string;
  floor: number;
  roomId: string;
  name: string;
  type: RoomType;
  /** Morning and afternoon share BoardRoomScene; only props differ. */
  variant?: "morning" | "afternoon";
  /** Heading for the people line in pop-ups; defaults to "Speaker". */
  peopleLabel?: string;
  sessions: AgendaSession[];
};
