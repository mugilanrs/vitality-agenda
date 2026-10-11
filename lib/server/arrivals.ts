/**
 * SERVER ONLY — placeholder arrival details. Every attendee gets the same
 * placeholder rows; admin gets one group per attendee. Replace the values
 * in code with real ones when needed.
 */

import { ATTENDEES } from "@/data/attendees";
import type { ViewerId } from "@/data/agendaSource";

export type ArrivalRow = { label: string; value: string; href?: string };
export type ArrivalGroup = { who?: string; rows: ArrivalRow[] };

const PLACEHOLDER_PHONE = "+00 00000 00000";

const ROWS: readonly ArrivalRow[] = [
  { label: "Flight", value: "XX 000 · Airline" },
  { label: "Arrival time", value: "00:00" },
  { label: "Pickup person", value: "Jane Doe" },
  { label: "Pickup number", value: PLACEHOLDER_PHONE, href: "tel:+000000000000" },
  { label: "Driver", value: "Jane Doe" },
  { label: "Driver number", value: PLACEHOLDER_PHONE, href: "tel:+000000000000" },
];

export function arrivalsForViewer(id: ViewerId): ArrivalGroup[] {
  if (id === "admin") {
    return ATTENDEES.map((a) => ({ who: a.fullName, rows: [...ROWS] }));
  }
  return [{ rows: [...ROWS] }];
}
