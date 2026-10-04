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
  /** Presenter(s); shown as "to be confirmed" when absent. */
  speaker?: string;
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
        speaker: "H1 / H2 / H3",
        prop: "reception",
        propSlot: [-5.4, 0.5],
      },
      {
        id: "ai-vision",
        time: "10:30 AM — 10:45 AM",
        title: "TCS AI Vision & Strategy",
        detail: "TCS AI Vision & Strategy",
        speaker: "H2",
        prop: "horizon",
        propSlot: [-2.4, -5.2],
      },
      {
        id: "ai-product-dev",
        time: "10:45 AM — 11:30 AM",
        title: "AI-Based Product Development",
        detail: "Ideation & Shaping",
        speaker: "H4 / H5",
        prop: "ideation",
        propSlot: [0.4, -5.2],
      },
      {
        id: "rapid-build",
        time: "11:30 AM — 12:15 PM",
        title: "Rapid Build",
        detail: "Demo on Product & R&D Focused",
        speaker: "H6",
        prop: "sprint",
        propSlot: [5.4, -0.5],
      },
      {
        id: "qa-ai",
        time: "12:15 PM — 1:00 PM",
        title: "Quality Assurance & Testing Frameworks",
        detail: "Moving Towards AI Compatibility",
        speaker: "H7",
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
        speaker: "H4 / H5",
        prop: "maturityloop",
        propSlot: [-5.4, 0.5],
      },
      {
        id: "hm-ai-action",
        time: "3:00 PM — 3:45 PM",
        title: "TCS AI in Action",
        detail: "Demonstrating Level 3 AI Autonomy in H&M Account",
        speaker: "H13 / H14",
        prop: "autonomy",
        propSlot: [-2.4, -5.2],
      },
      {
        id: "ai-ams",
        time: "3:45 PM — 4:30 PM",
        title: "TCS AI AMS",
        detail: "Roadmap & Transforming AMS in Vitality (1–2 Year)",
        speaker: "H13 / H14",
        prop: "runcycle",
        propSlot: [1.0, -5.2],
      },
      {
        id: "gcp-partnership",
        time: "4:30 PM — 5:00 PM",
        title: "GCP Capabilities & Partnership",
        detail: "GCP Capabilities & Partnership",
        speaker: "H15 / H16 / H17",
        prop: "hexcloud",
        propSlot: [5.4, -0.5],
      },
      {
        id: "gcp-cases",
        time: "5:00 PM — 5:30 PM",
        title: "GCP Case Study Experience Sharing",
        detail: "EQUIFAX & LBG",
        speaker: "H15 / H16 / H17",
        prop: "casefiles",
        propSlot: [3.4, 4.8],
      },
      {
        id: "context-engineering",
        time: "5:30 PM — 6:00 PM",
        title: "Unpacking Context Engineering Squad",
        detail: "Unpacking Context Engineering Squad",
        speaker: "H8",
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
        speaker: "H1 / H2 / H3 / H8 / H9 / H10 / H11 / H12",
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
        speaker: "Hosts to be confirmed",
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
