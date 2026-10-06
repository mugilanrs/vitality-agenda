import type { BuildingSpec } from "@/data/buildings";
import type { CameraState } from "@/lib/camera";

/**
 * World anchors for the two external journey stops.
 *
 * Campus sits on the origin. North (−Z) is behind the campus and reads as
 * the top of the isometric view; south (+Z) is the entrance side and reads
 * as the front. Both stops sit outside the perimeter (radius 16.5) on that
 * axis, with a small lateral shift so the isometric frame keeps them clear
 * of the side rails.
 */

const OFFSET: readonly [number, number, number] = [9, 11, 11];

function fromTarget(
  target: readonly [number, number, number],
  zoom: number,
): CameraState {
  return {
    position: [target[0] + OFFSET[0], target[1] + OFFSET[1], target[2] + OFFSET[2]],
    rotation: [0, 0, 0],
    target: [target[0], target[1], target[2]],
    zoom,
  };
}

/** North of the campus, outside the perimeter. */
export const FISHERMAN_COVE_POSITION = [1.2, 0, -22.4] as const;
/** South of the campus, beyond the entrance gate. */
export const AIRPORT_POSITION = [-0.8, 0, 24.4] as const;

export const CAMPUS_EDGE = 16.7;

export const BUILDING_FISHERMAN_COVE: BuildingSpec = {
  id: "fisherman-cove",
  name: "Fisherman Cove",
  subtitle: "Executive Dinner",
  accent: "#f4a3c1",
  side: "right",
  row: "rear",
  camera: fromTarget(
    [FISHERMAN_COVE_POSITION[0], 0.7, FISHERMAN_COVE_POSITION[2]],
    1.22,
  ),
  markerPosition: [
    FISHERMAN_COVE_POSITION[0],
    1.45,
    FISHERMAN_COVE_POSITION[2],
  ],
  basePosition: FISHERMAN_COVE_POSITION,
  floors: [],
  external: {
    title: "Executive Dinner — TCS",
    time: "6:30 — 9:00",
    host: "TCS",
  },
};

const TBI = "To be included";

/** Pickup details on the Airport card — placeholders until real values exist. */
export const AIRPORT_DETAILS = [
  { label: "Flight number", value: TBI },
  { label: "Arrival time", value: TBI },
  { label: "Host", value: TBI },
  { label: "Cab number", value: TBI },
  { label: "Cab plate number", value: TBI },
  { label: "Driver name", value: TBI },
];

export const BUILDING_AIRPORT: BuildingSpec = {
  id: "airport",
  name: "Airport",
  subtitle: "Arrival / Departure",
  accent: "#f4a3c1",
  side: "right",
  row: "front",
  camera: fromTarget(
    [AIRPORT_POSITION[0], 0.55, AIRPORT_POSITION[2]],
    1.38,
  ),
  markerPosition: [AIRPORT_POSITION[0], 1.25, AIRPORT_POSITION[2]],
  basePosition: AIRPORT_POSITION,
  floors: [],
  external: {
    title: "Arrival / Departure",
    details: AIRPORT_DETAILS,
  },
};
