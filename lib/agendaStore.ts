/**
 * The logged-in attendee's rooms, loaded once from /api/me before the map
 * mounts. A plain module-level store (like `journey`) — nothing in it
 * changes after login, so components just read it.
 */

import type { AgendaRoom } from "@/data/agendaRooms";
import { MARKER_BUILDINGS } from "@/data/buildings";
import type { BuildingId } from "@/lib/journey";

let rooms: AgendaRoom[] = [];

export function setAgendaRooms(next: AgendaRoom[]) {
  rooms = next;
}

export function getAgendaRooms(): AgendaRoom[] {
  return rooms;
}

export function agendaRoomByFocus(
  buildingId: string | undefined,
  floor: number | undefined,
  roomId: string | undefined,
): AgendaRoom | undefined {
  if (!buildingId || floor == null || !roomId) return undefined;
  return rooms.find(
    (r) => r.buildingId === buildingId && r.floor === floor && r.roomId === roomId,
  );
}

export function eb3RoomChoices(): AgendaRoom[] {
  return rooms.filter((r) => r.buildingId === "eb3");
}

/** Marker buildings this attendee actually visits (the airport is for all). */
export function visibleMarkerBuildings(): BuildingId[] {
  return MARKER_BUILDINGS.filter(
    (id) => id === "airport" || rooms.some((r) => r.buildingId === id),
  );
}
