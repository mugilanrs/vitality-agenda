/**
 * SERVER ONLY — Chennai arrival details per attendee. Flight and time live
 * here; pickup-person and driver names/phones come from env vars
 * (PICKUP_P1_NAME, DRIVER_D1_PHONE, … see .env.example). An attendee only
 * ever receives their own rows; admin receives everyone's.
 */

import type { AttendeeId, ViewerId } from "@/data/agendaSource";
import { ATTENDEES } from "@/data/attendees";

export type ArrivalRow = { label: string; value: string; href?: string };
export type ArrivalGroup = { who?: string; rows: ArrivalRow[] };

const NA = "NA";

type Arrival = {
  flight: string;
  time: string;
  pickup?: "P1" | "P2" | "P3";
  driver?: "D1" | "D2" | "D3";
};

const IGO_243 = "6E 243 · IndiGo";
const IGO_371 = "6E 371 · IndiGo";
const AI_9774 = "AI 9774 · Air India";

const ARRIVALS: Record<AttendeeId, Arrival> = {
  a1: { flight: IGO_243, time: "08:25", pickup: "P1", driver: "D1" },
  a2: { flight: IGO_243, time: "08:25", pickup: "P1", driver: "D1" },
  a3: { flight: AI_9774, time: "09:40", pickup: "P3", driver: "D3" },
  a4: { flight: IGO_371, time: "09:20", pickup: "P2", driver: "D2" },
  a5: { flight: IGO_371, time: "09:20", pickup: "P2", driver: "D2" },
  a6: { flight: AI_9774, time: NA },
  a7: { flight: AI_9774, time: "09:40", pickup: "P3", driver: "D3" },
};

function envText(name: string): string {
  return process.env[name]?.trim().slice(0, 80) ?? "";
}

function person(prefix: "PICKUP" | "DRIVER", key?: string) {
  if (!key) return { name: NA, phone: NA, href: undefined };
  const name = envText(`${prefix}_${key}_NAME`) || NA;
  const phone = envText(`${prefix}_${key}_PHONE`);
  const dial = phone.replace(/[^\d+]/g, "");
  return { name, phone: phone || NA, href: dial ? `tel:${dial}` : undefined };
}

function rowsFor(a: Arrival): ArrivalRow[] {
  const p = person("PICKUP", a.pickup);
  const d = person("DRIVER", a.driver);
  return [
    { label: "Flight", value: a.flight },
    { label: "Arrival time", value: a.time },
    { label: "Pickup person", value: p.name },
    { label: "Pickup number", value: p.phone, href: p.href },
    { label: "Driver", value: d.name },
    { label: "Driver number", value: d.phone, href: d.href },
  ];
}

export function arrivalsForViewer(id: ViewerId): ArrivalGroup[] {
  if (id === "admin") {
    return ATTENDEES.map((a) => ({ who: a.fullName, rows: rowsFor(ARRIVALS[a.id]) }));
  }
  return [{ rows: rowsFor(ARRIVALS[id]) }];
}
