/**
 * Room chapters for the journey. The campus markers still use the
 * building/floor/room ids in buildings.ts; this file is the agenda
 * those rooms display.
 *
 * Speakers are placeholder codes (H1–H17) until real names are confirmed.
 * Attendees (A1–A5) are intentionally not modelled or shown yet.
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
  /** Presenters / hosts, one entry per person; "to be confirmed" when absent. */
  speakers?: readonly string[];
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

/** Speaker and host names, keyed by the codes used in the timetable. */
const H = {
  H1: "Commander Prasanna Madhu",
  H2: "Lakshmi Suchetha",
  H3: "Ranjit Sinha",
  H4: "Musthafa S",
  H5: "Ramanthan Murali",
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

export const AGENDA_ROOMS: AgendaRoom[] = [
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
      },
      {
        id: "ai-vision",
        time: "10:30 AM — 10:45 AM",
        title: "TCS AI Vision & Strategy",
        detail: "TCS AI Vision & Strategy",
        speakers: [H.H2],
        prop: "horizon",
        propSlot: [-2.4, -5.2],
      },
      {
        id: "ai-product-dev",
        time: "10:45 AM — 11:30 AM",
        title: "AI-Based Product Development",
        detail: "Ideation & Shaping",
        speakers: [H.H4, H.H5],
        prop: "ideation",
        propSlot: [0.4, -5.2],
      },
      {
        id: "rapid-build",
        time: "11:30 AM — 12:15 PM",
        title: "Rapid Build",
        detail: "Demo on Product & R&D Focused",
        speakers: [H.H6],
        prop: "sprint",
        propSlot: [5.4, -0.5],
      },
      {
        id: "qa-ai",
        time: "12:15 PM — 1:00 PM",
        title: "Quality Assurance & Testing Frameworks",
        detail: "Moving Towards AI Compatibility",
        speakers: [H.H7],
        prop: "aishield",
        propSlot: [1.8, 5.0],
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
        id: "ai-maturity-sel",
        label: "Two Sessions",
        time: "2:00 PM — 3:00 PM",
        title: "AI Maturity & AI AD — Software Engineering Loop",
        detail:
          "Two sessions:\n1. AI Maturity & Strategic Capabilities — Talent Transformation, Tokenomics, AI Governance\n2. AI AD — Software Engineering Loop",
        speakers: [H.H4, H.H5],
        prop: "maturityloop",
        propSlot: [-5.4, 0.5],
      },
      {
        id: "hm-ai-action",
        time: "3:00 PM — 3:45 PM",
        title: "TCS AI in Action",
        detail: "Demonstrating Level 3 AI Autonomy in H&M Account",
        speakers: [H.H13, H.H14],
        prop: "autonomy",
        propSlot: [-2.4, -5.2],
      },
      {
        id: "ai-ams",
        time: "3:45 PM — 4:30 PM",
        title: "TCS AI AMS",
        detail: "Roadmap & Transforming AMS in Vitality (1–2 Year)",
        speakers: [H.H13, H.H14],
        prop: "runcycle",
        propSlot: [1.0, -5.2],
      },
      {
        id: "gcp-partnership",
        time: "4:30 PM — 5:00 PM",
        title: "GCP Capabilities & Partnership",
        detail: "GCP Capabilities & Partnership",
        speakers: [H.H15, H.H16, H.H17],
        prop: "hexcloud",
        propSlot: [5.4, -0.5],
      },
      {
        id: "gcp-cases",
        time: "5:00 PM — 5:30 PM",
        title: "GCP Case Study Experience Sharing",
        detail: "EQUIFAX & LBG",
        speakers: [H.H15, H.H16, H.H17],
        prop: "casefiles",
        propSlot: [3.4, 4.8],
      },
      {
        id: "context-engineering",
        time: "5:30 PM — 6:00 PM",
        title: "Unpacking Context Engineering Squad",
        detail: "Unpacking Context Engineering Squad",
        speakers: [H.H8],
        prop: "contextstack",
        propSlot: [-2.6, 4.8],
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
      },
    ],
  },
];

export function agendaRoomByFocus(
  buildingId: string | undefined,
  floor: number | undefined,
  roomId: string | undefined,
): AgendaRoom | undefined {
  if (!buildingId || floor == null || !roomId) return undefined;
  return AGENDA_ROOMS.find(
    (r) => r.buildingId === buildingId && r.floor === floor && r.roomId === roomId,
  );
}

export const EB3_ROOM_CHOICES = AGENDA_ROOMS.filter((r) => r.buildingId === "eb3");
