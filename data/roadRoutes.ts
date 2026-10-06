/**
 * Centre lines of the two roads that leave the campus (x, z), shared by the
 * road meshes (JourneyRoutes) and the traffic (CarTraffic) so they always
 * line up.
 *
 * South: boulevard → entrance gate → airport forecourt.
 * North: ring road → north gate → Fisherman Cove lobby.
 */

/** Asphalt width of both roads. */
export const ROAD_WIDTH = 1.1;

/** Entrance gate (south) and north gate positions on the perimeter wall. */
export const SOUTH_GATE_X = 0;
export const NORTH_GATE_X = 1.0;

export const SOUTH_ROAD: readonly (readonly [number, number])[] = [
  [0, 12.2],
  [0, 16.5],
  [-0.15, 18.6],
  [-0.55, 21],
  [-0.8, 23],
];

export const NORTH_ROAD: readonly (readonly [number, number])[] = [
  [0, -11.6],
  [0.5, -13.9],
  [NORTH_GATE_X, -16.5],
  [1.2, -18.7],
  [1.2, -21],
];
