/**
 * The full timetable, including who attends each session.
 *
 * SERVER ONLY — import this from route handlers, never from client
 * components. The browser only ever receives the logged-in attendee's own
 * rooms (see agendaForAttendee), with the `attendees` field stripped.
 */

import type { AgendaRoom, AgendaSession } from "@/data/agendaRooms";

export type AttendeeId = "a1" | "a2" | "a3" | "a4" | "a5" | "a6" | "a7";

type SourceSession = AgendaSession & { attendees: readonly AttendeeId[] };
type SourceRoom = Omit<AgendaRoom, "sessions"> & { sessions: SourceSession[] };

/** Host names, keyed by the codes used in the timetable. */
const H = {
  H1: "Commander Prasanna Madhu",
  H2: "Lakshmi Suchetha",
  H3: "Ranjit Sinha",
  H4: "Musthafa S",
  H6: "Sri Vidya",
  H7: "Balasubramanian S",
  H8: "Ramesh Balan",
  H9: "K S Krishnamoorthy",
  H10: "TBC",
  H11: "TBC",
  H12: "TBC",
  H13: "Hemasundara Ponnana",
  H14: "Kanagaraj Kumar V",
  H15: "Karthikeyan Murugesan",
  H16: "Vaithalingam sundram",
  H17: "Naveen Pathak",
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
        id: "welcome-reception",
        time: "10:00 AM — 10:30 AM",
        title: "Welcome & Reception",
        detail: "Welcome & Reception",
        speakers: [H.H1, H.H2, H.H3],
        prop: "reception",
        propSlot: [-5.4, 0.5],
        attendees: A1_A2,
      },
      {
        id: "ai-vision",
        time: "10:30 AM — 10:45 AM",
        title: "TCS AI Vision & Strategy",
        detail: "TCS AI Vision & Strategy",
        speakers: [H.H2],
        prop: "horizon",
        propSlot: [-2.4, -5.2],
        attendees: A1_A2,
      },
      {
        id: "ai-product-dev",
        time: "10:45 AM — 11:30 AM",
        title: "AI-Based Product Development",
        detail: "Ideation & Shaping — Master Craft Team",
        speakers: [H.H4],
        prop: "ideation",
        propSlot: [0.4, -5.2],
        attendees: A1_A2,
      },
      {
        id: "rapid-build",
        time: "11:30 AM — 12:15 PM",
        title: "Rapid Build",
        detail: "Demo on Product & R&D Focused",
        speakers: [H.H6],
        prop: "sprint",
        propSlot: [5.4, -0.5],
        attendees: A1_A7,
      },
      {
        id: "ai-maturity-sel",
        label: "Two Sessions",
        time: "12:15 PM — 1:00 PM",
        title: "AI Maturity & AI AD — Software Engineering Loop",
        detail:
          "Two sessions:\n1. AI Maturity & Strategic Capabilities — Talent Transformation, Tokenomics, AI Governance\n2. AI AD — Software Engineering Loop",
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
        id: "qa-ai",
        time: "2:00 PM — 3:00 PM",
        title: "Quality Assurance & Testing Frameworks",
        detail: "Moving Towards AI Compatibility",
        speakers: [H.H7],
        prop: "aishield",
        propSlot: [-5.4, 0.5],
        attendees: A1_A5_A7,
      },
      {
        id: "ai-ams",
        time: "3:45 PM — 4:30 PM",
        title: "TCS AI AMS",
        detail: "Roadmap & Transforming AMS in Vitality (1–2 Year)",
        speakers: [H.H13, H.H14],
        prop: "runcycle",
        propSlot: [-2.4, -5.2],
        attendees: A1_A5_A7,
      },
      {
        id: "gcp-partnership",
        time: "4:30 PM — 5:00 PM",
        title: "GCP Capabilities & Partnership",
        detail: "GCP Capabilities & Partnership",
        speakers: [H.H15, H.H16, H.H17],
        prop: "hexcloud",
        propSlot: [5.4, -0.5],
        attendees: A1_A5,
      },
      {
        id: "gcp-cases",
        time: "5:00 PM — 5:30 PM",
        title: "GCP Case Study Experience Sharing",
        detail: "EQUIFAX & LBG",
        speakers: [H.H15, H.H16, H.H17],
        prop: "casefiles",
        propSlot: [3.4, 4.8],
        attendees: A3_A5,
      },
      {
        id: "context-engineering",
        time: "5:30 PM — 6:00 PM",
        title: "Unpacking Context Engineering Squad",
        detail: "Unpacking Context Engineering Squad",
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
        id: "hm-ai-action",
        time: "3:00 PM — 3:45 PM",
        title: "TCS AI in Action",
        detail: "Demonstrating Level 3 AI Autonomy in account",
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
        id: "exec-lunch",
        time: "1:00 PM — 2:00 PM",
        title: "Lunch, Meet & Greet",
        detail: "Lunch, Meet & Greet",
        speakers: [H.H1, H.H2, H.H3, H.H8, H.H9, H.H10, H.H11, H.H12],
        prop: "cloche",
        propSlot: [0, 2.9],
        attendees: A1_A7,
      },
    ],
  },
  {
    id: "fisherman-cove-dinner",
    buildingId: "fisherman-cove",
    floor: 0,
    roomId: "dinner-pavilion",
    name: "Dinner Pavilion",
    type: "pavilion",
    peopleLabel: "Hosts",
    sessions: [
      {
        id: "exec-dinner",
        time: "6:30 PM — 9:00 PM",
        title: "Executive Dinner",
        detail: "Executive Dinner — TCS",
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
export function agendaForAttendee(id: AttendeeId): AgendaRoom[] {
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
