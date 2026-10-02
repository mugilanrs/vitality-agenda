/**
 * Room chapters for the journey. The campus markers still use the
 * building/floor/room ids in buildings.ts; this file is the agenda
 * those rooms display.
 */

export type SessionProp =
  | "vision"
  | "product"
  | "qa"
  | "rapid"
  | "loop"
  | "cloud"
  | "governance"
  | "data"
  | "welcome"
  | "analytics"
  | "automation";

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

export type RoomType = "boardroom" | "odc" | "dining";

export type AgendaRoom = {
  id: string;
  buildingId: string;
  floor: number;
  roomId: string;
  name: string;
  type: RoomType;
  /** Morning and afternoon share BoardRoomScene; only props differ. */
  variant?: "morning" | "afternoon";
  sessions: AgendaSession[];
};

export type AgendaBreak = {
  id: "break";
  kind: "break";
  time: string;
  title: string;
};

export const AGENDA_BREAK: AgendaBreak = {
  id: "break",
  kind: "break",
  time: "4:00 — 4:15",
  title: "Break",
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
        id: "ai-vision",
        time: "10:30 — 11:00",
        title: "TCS AI Vision and Strategy",
        detail: "TCS AI Vision and Strategy",
        prop: "vision",
        propSlot: [0.4, -5.2],
      },
      {
        id: "ai-product-dev",
        time: "10:30 — 11:00",
        title: "AI Based Product Development",
        detail: "Ideation and Shaping",
        prop: "product",
        propSlot: [-3.8, -5.0],
      },
      {
        id: "qa-ai",
        time: "11:00 — 11:30",
        title: "Quality Assurance and Testing Frameworks",
        detail: "Moving towards AI compatibility",
        prop: "qa",
        propSlot: [5.4, -0.5],
      },
      {
        id: "ai-maturity",
        time: "11:30 — 12:45",
        title: "AI Maturity and Strategic Capabilities",
        detail: "Talent transformation, Tokenomics, AI governance",
        prop: "governance",
        propSlot: [-5.4, 0.5],
      },
      {
        id: "ai-ad-sel",
        label: "SEL",
        time: "11:30 — 12:45",
        title: "AI AD — Software Engineering Loop (SEL)",
        detail: "AI AD — Software Engineering Loop (SEL)",
        prop: "loop",
        propSlot: [-3.6, 4.8],
      },
      {
        id: "rapid-build",
        time: "12:45 — 1:15",
        title: "Rapid Build",
        detail: "Rapid Build",
        prop: "rapid",
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
        id: "ai-ams",
        time: "2:15 — 3:15",
        title: "TCS AI AMS",
        detail: "Roadmap and Transform AMS in Vitality — 1–2 year",
        prop: "loop",
        propSlot: [-4.5, -4.5],
      },
      {
        id: "gcp-partnership",
        time: "4:15 — 5:00",
        title: "GCP capabilities and partnership",
        detail: "GCP capabilities and partnership",
        prop: "cloud",
        propSlot: [5.0, 0],
      },
      {
        id: "gcp-cases",
        time: "5:00 — 5:30",
        title: "GCP case study experience sharing",
        detail: "EQUIFAX and LBG",
        prop: "analytics",
        propSlot: [0, 5.0],
      },
    ],
  },
  {
    id: "eb3-odc",
    buildingId: "eb3",
    floor: 0,
    roomId: "odc",
    name: "ODC",
    type: "odc",
    sessions: [
      {
        id: "odc-meet",
        time: "10:00 — 10:30",
        title: "Meet and Greet",
        detail: "Vitality ODC floorwalk",
        prop: "welcome",
        propSlot: [-3.2, 3.0],
      },
      {
        id: "odc-wrap",
        time: "5:30 — 6:00",
        title: "Wrap up",
        detail: "Wrap up",
        prop: "product",
        propSlot: [3.6, -2.8],
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
    sessions: [
      {
        id: "exec-lunch",
        time: "1:15 — 2:15",
        title: "TCS Executive Lunch",
        detail: "Meet and Greet",
        prop: "welcome",
        propSlot: [-5.2, -3.2],
      },
    ],
  },
  {
    id: "eb5-hm-odc",
    buildingId: "eb5",
    floor: 0,
    roomId: "hm-odc",
    name: "H&M ODC",
    type: "odc",
    sessions: [
      {
        id: "hm-ai-action",
        time: "3:15 — 4:00",
        title: "TCS AI in Action",
        detail: "Demonstration Level AI Autonomy in H&M",
        prop: "automation",
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
