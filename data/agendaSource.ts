/**
 * The full timetable, including who attends each session.
 *
 * SERVER ONLY — import this from route handlers, never from client
 * components. The browser only ever receives the logged-in attendee's own
 * rooms (see agendaForAttendee), with the `attendees` field stripped.
 */

import type { AgendaRoom, AgendaSession } from "@/data/agendaRooms";
import { ATTENDEES } from "@/data/attendees";

export type AttendeeId = "a1" | "a2" | "a3" | "a4" | "a5" | "a6" | "a7";
/** An attendee, or the admin who sees everything. */
export type ViewerId = AttendeeId | "admin";

type SourceSession = AgendaSession & { attendees: readonly AttendeeId[] };
type SourceRoom = Omit<AgendaRoom, "sessions"> & { sessions: SourceSession[] };

/** Host names, keyed by the codes used in the timetable. */
const H = {
  H1: "Jane Doe",
  H2: "Jane Doe",
  H3: "Jane Doe",
  H4: "Jane Doe",
  H6: "Jane Doe",
  H7: "Jane Doe",
  H8: "Jane Doe",
  H9: "Jane Doe",
  H10: "Jane Doe",
  H11: "Jane Doe",
  H12: "Jane Doe",
  H13: "Jane Doe",
  H14: "Jane Doe",
  H15: "Jane Doe",
  H16: "Jane Doe",
  H17: "Jane Doe",
} as const;

const A1_A2: AttendeeId[] = ["a1", "a2"];
const A1_A7: AttendeeId[] = ["a1", "a2", "a3", "a4", "a5", "a6", "a7"];
const A1_A5_A7: AttendeeId[] = ["a1", "a2", "a3", "a4", "a5", "a7"];
const A1_A5: AttendeeId[] = ["a1", "a2", "a3", "a4", "a5"];
const A3_A5: AttendeeId[] = ["a3", "a4", "a5"];
const A2_A7: AttendeeId[] = ["a2", "a3", "a4", "a5", "a6", "a7"];

const AGENDA_SOURCE: SourceRoom[] = [
  {
    id: "eb3-board-morning",
    buildingId: "eb3",
    floor: 1,
    roomId: "board-am",
    name: "Board Room — Morning",
    type: "boardroom",
    variant: "morning",
    sessions: [
      {
        id: "session-1",
        time: "10:00 AM — 10:30 AM",
        title: "Session Title 1",
        detail: "Session description",
        speakers: [H.H1, H.H2, H.H3],
        prop: "reception",
        propSlot: [-5.4, 0.5],
        attendees: A1_A2,
      },
      {
        id: "session-2",
        time: "10:30 AM — 10:45 AM",
        title: "Session Title 2",
        detail: "Session description",
        speakers: [H.H2],
        prop: "horizon",
        propSlot: [-2.4, -5.2],
        attendees: A1_A2,
      },
      {
        id: "session-3",
        time: "10:45 AM — 11:30 AM",
        title: "Session Title 3",
        detail: "Session description",
        speakers: [H.H4],
        prop: "ideation",
        propSlot: [0.4, -5.2],
        attendees: A1_A2,
      },
      {
        id: "session-4",
        time: "11:30 AM — 12:15 PM",
        title: "Session Title 4",
        detail: "Session description",
        speakers: [H.H6],
        prop: "sprint",
        propSlot: [5.4, -0.5],
        attendees: A1_A7,
      },
      {
        id: "session-5",
        label: "Two Sessions",
        time: "12:15 PM — 1:00 PM",
        title: "Session Title 5",
        detail:
          "Two sessions:\n1. Session description\n2. Session description",
        speakers: [H.H4],
        prop: "maturityloop",
        propSlot: [1.8, 5.0],
        attendees: A1_A7,
      },
    ],
  },
  {
    id: "eb3-board-afternoon",
    buildingId: "eb3",
    floor: 2,
    roomId: "board-pm",
    name: "Board Room — Afternoon",
    type: "boardroom",
    variant: "afternoon",
    sessions: [
      {
        id: "session-6",
        time: "2:00 PM — 3:00 PM",
        title: "Session Title 6",
        detail: "Session description",
        speakers: [H.H7],
        prop: "aishield",
        propSlot: [-5.4, 0.5],
        attendees: A1_A5_A7,
      },
      {
        id: "session-7",
        time: "3:45 PM — 4:30 PM",
        title: "Session Title 7",
        detail: "Session description",
        speakers: [H.H13, H.H14],
        prop: "runcycle",
        propSlot: [-2.4, -5.2],
        attendees: A1_A5_A7,
      },
      {
        id: "session-8",
        time: "4:30 PM — 5:00 PM",
        title: "Session Title 8",
        detail: "Session description",
        speakers: [H.H15, H.H16, H.H17],
        prop: "hexcloud",
        propSlot: [5.4, -0.5],
        attendees: A1_A5,
      },
      {
        id: "session-9",
        time: "5:00 PM — 5:30 PM",
        title: "Session Title 9",
        detail: "Session description",
        speakers: [H.H15, H.H16, H.H17],
        prop: "casefiles",
        propSlot: [3.4, 4.8],
        attendees: A3_A5,
      },
      {
        id: "session-10",
        time: "5:30 PM — 6:00 PM",
        title: "Session Title 10",
        detail: "Session description",
        speakers: [H.H8],
        prop: "contextstack",
        propSlot: [-2.6, 4.8],
        attendees: A3_A5,
      },
    ],
  },
  {
    id: "eb5-account-room",
    buildingId: "eb5",
    floor: 0,
    roomId: "account-room",
    name: "Account Room",
    type: "odc",
    sessions: [
      {
        id: "session-11",
        time: "3:00 PM — 3:45 PM",
        title: "Session Title 11",
        detail: "Session description",
        speakers: [H.H13, H.H14],
        prop: "autonomy",
        propSlot: [0, 0],
        attendees: A1_A5_A7,
      },
    ],
  },
  {
    id: "signature-executive-dining",
    buildingId: "signature-tower",
    floor: 0,
    roomId: "executive-dining",
    name: "Executive Dining Room",
    type: "dining",
    peopleLabel: "Hosts",
    sessions: [
      {
        id: "lunch",
        time: "1:00 PM — 2:00 PM",
        title: "Lunch",
        detail: "Session description",
        speakers: [H.H1, H.H2, H.H3, H.H8, H.H9, H.H10, H.H11, H.H12],
        prop: "cloche",
        propSlot: [0, 2.9],
        attendees: A1_A7,
      },
    ],
  },
  {
    id: "dinner-venue-dinner",
    buildingId: "dinner-venue",
    floor: 0,
    roomId: "dinner-pavilion",
    name: "Dinner Pavilion",
    type: "pavilion",
    peopleLabel: "Hosts",
    sessions: [
      {
        id: "dinner",
        time: "6:30 PM — 9:00 PM",
        title: "Dinner",
        detail: "Session description",
        speakers: ["Hosts to be confirmed"],
        prop: "candle",
        propSlot: [0, 0],
        attendees: A2_A7,
      },
    ],
  },
];

/**
 * The attendee's own rooms: only sessions they attend, rooms with none are
 * dropped, and the `attendees` field is removed so nothing about other
 * people reaches the browser.
 */
export function agendaForAttendee(id: ViewerId): AgendaRoom[] {
  if (id === "admin") return agendaForAdmin();
  const rooms: AgendaRoom[] = [];
  for (const room of AGENDA_SOURCE) {
    const sessions = room.sessions
      .filter((s) => s.attendees.includes(id))
      .map((s) => {
        const { attendees, ...session } = s;
        void attendees;
        return session;
      });
    if (sessions.length > 0) rooms.push({ ...room, sessions });
  }
  return rooms;
}

/** Admin view: every room and session, with the names of who attends. */
function agendaForAdmin(): AgendaRoom[] {
  const nameOf = new Map(ATTENDEES.map((a) => [a.id, a.fullName]));
  return AGENDA_SOURCE.map((room) => ({
    ...room,
    sessions: room.sessions.map((s) => ({
      ...s,
      attendeeNames: s.attendees.map((id) => nameOf.get(id) ?? id),
    })),
  }));
}
