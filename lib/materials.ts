/**
 * Shared architectural material palette. Building components import these
 * refs so we don't allocate new MeshStandardMaterial per instance and so a
 * single theme edit propagates everywhere.
 *
 * Colours follow the real campus: blue-teal glass, sand roofs, green lawns,
 * teal water. Clean daylight — no emissive, no bloom. The teal
 * glass has enough metalness/roughness to catch the directional key light
 * without looking neon.
 */

import * as THREE from "three";

export const COLORS = {
  whiteShell: "#CBD7DF",
  whiteShellCool: "#BAC8D1",
  roofWhite: "#C2B89E",
  roofRim: "#8497A5",
  tealGlass: "#4FA9CC",
  tealGlassDeep: "#3688B3",
  concreteLight: "#D0D0C6",
  concreteWarm: "#B9B8AB",
  roadDark: "#3D4249",
  roadStripe: "#EDE9DB",
  grass: "#66A24F",
  grassDeep: "#478A3F",
  waterTurquoise: "#34A097",
  waterDeep: "#1E7F80",
  trunk: "#765845",
  leavesGreen: "#6FA276",
  palmGreen: "#8DB78D",
  blossomPink: "#E99AAE",
  solar: "#243046",
  metalDark: "#6F808C",
  ground: "#CCC7B2",
  groundOutside: "#5B8E4B",
  eb3Shell: "#DCE3E7",
  eb3Secondary: "#BCC9D1",
  eb3Roof: "#C2B89E",
  eb3Struct: "#8296A5",
  towerFacade: "#E4E9EC",
  towerBand: "#8FA7B8",
  towerGlass: "#4A82A4",
  towerRoof: "#2DB8D4",
  towerAccent: "#BFE9F3",
} as const;

// ---------------- Shared material singletons ----------------

export const M_WHITE_SHELL = new THREE.MeshStandardMaterial({
  color: COLORS.whiteShell,
  roughness: 0.72,
  metalness: 0,
});

export const M_ROOF_WHITE = new THREE.MeshStandardMaterial({
  color: COLORS.roofWhite,
  roughness: 0.65,
  metalness: 0,
});

export const M_ROOF_RIM = new THREE.MeshStandardMaterial({
  color: COLORS.roofRim,
  roughness: 0.75,
  metalness: 0,
});

export const M_TEAL_GLASS = new THREE.MeshStandardMaterial({
  color: COLORS.tealGlass,
  roughness: 0.22,
  metalness: 0.15,
  transparent: true,
  opacity: 0.93,
  envMapIntensity: 0.75,
});

export const M_TEAL_GLASS_DEEP = new THREE.MeshStandardMaterial({
  color: COLORS.tealGlassDeep,
  roughness: 0.25,
  metalness: 0.15,
  envMapIntensity: 0.7,
  transparent: true,
  opacity: 0.9,
});

// Highlight tint used when a building is hovered — very subtle emissive lift.
export const M_TEAL_GLASS_HOVER = new THREE.MeshStandardMaterial({
  color: COLORS.tealGlass,
  roughness: 0.2,
  metalness: 0.15,
  transparent: true,
  opacity: 0.55,
  emissive: COLORS.tealGlass,
  emissiveIntensity: 0.1,
});

export const M_CONCRETE_LIGHT = new THREE.MeshStandardMaterial({
  color: COLORS.concreteLight,
  roughness: 0.95,
});

export const M_ROAD = new THREE.MeshStandardMaterial({
  color: COLORS.roadDark,
  roughness: 0.95,
});

export const M_ROAD_STRIPE = new THREE.MeshStandardMaterial({
  color: COLORS.roadStripe,
  roughness: 0.7,
});

export const M_GRASS = new THREE.MeshStandardMaterial({
  color: COLORS.grass,
  roughness: 1,
});

export const M_WATER = new THREE.MeshStandardMaterial({
  color: COLORS.waterTurquoise,
  roughness: 0.12,
  metalness: 0.15,
  transparent: true,
  opacity: 1,
  envMapIntensity: 1.1,
});

export const M_GROUND = new THREE.MeshStandardMaterial({
  color: COLORS.ground,
  roughness: 1,
});

export const M_METAL_DARK = new THREE.MeshStandardMaterial({
  color: COLORS.metalDark,
  roughness: 0.5,
  metalness: 0.7,
});

export const M_EB3_SHELL = new THREE.MeshStandardMaterial({
  color: COLORS.eb3Shell,
  roughness: 0.74,
  metalness: 0,
});
export const M_EB3_SECONDARY = new THREE.MeshStandardMaterial({
  color: COLORS.eb3Secondary,
  roughness: 0.78,
  metalness: 0,
});
export const M_EB3_ROOF = new THREE.MeshStandardMaterial({
  color: COLORS.eb3Roof,
  roughness: 0.66,
  metalness: 0,
});
export const M_EB3_STRUCT = new THREE.MeshStandardMaterial({
  color: COLORS.eb3Struct,
  roughness: 0.72,
  metalness: 0.05,
});

export const M_TOWER_FACADE = new THREE.MeshStandardMaterial({
  color: COLORS.towerFacade,
  roughness: 0.7,
  metalness: 0,
});
export const M_TOWER_BAND = new THREE.MeshStandardMaterial({
  color: COLORS.towerBand,
  roughness: 0.62,
  metalness: 0.08,
});
export const M_TOWER_GLASS = new THREE.MeshStandardMaterial({
  color: COLORS.towerGlass,
  roughness: 0.22,
  metalness: 0.12,
  transparent: true,
  opacity: 0.95,
});
export const M_TOWER_ROOF = new THREE.MeshStandardMaterial({
  color: COLORS.towerRoof,
  roughness: 0.6,
  metalness: 0,
});
export const M_TOWER_ACCENT = new THREE.MeshStandardMaterial({
  color: COLORS.towerAccent,
  roughness: 0.45,
  metalness: 0.05,
});

// Placeholder wireframe for Phase 1 building slots.
export const M_PLACEHOLDER = new THREE.MeshStandardMaterial({
  color: COLORS.tealGlass,
  roughness: 0.4,
  metalness: 0.3,
  wireframe: true,
  transparent: true,
  opacity: 0.5,
});

export const M_PLACEHOLDER_SOLID = new THREE.MeshStandardMaterial({
  color: COLORS.whiteShell,
  roughness: 0.7,
  transparent: true,
  opacity: 0.35,
});
