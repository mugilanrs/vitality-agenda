/**
 * Shared architectural material palette. Building components import these
 * refs so we don't allocate new MeshStandardMaterial per instance and so a
 * single theme edit propagates everywhere.
 *
 * Colours are tuned for clean daylight — no emissive, no bloom. The teal
 * glass has enough metalness/roughness to catch the directional key light
 * without looking neon.
 */

import * as THREE from "three";

export const COLORS = {
  whiteShell: "#EEE7EA",
  whiteShellCool: "#DED3D8",
  roofWhite: "#F5EFF1",
  roofRim: "#C9BBC2",
  tealGlass: "#D7DEDC",
  tealGlassDeep: "#D5C8CE",
  concreteLight: "#E2DDDF",
  concreteWarm: "#D5C8CE",
  roadDark: "#D0CBCE",
  roadStripe: "#AAA4A7",
  grass: "#D4DFD0",
  grassDeep: "#C7D5C3",
  waterTurquoise: "#D5DDDA",
  waterDeep: "#C5D0CC",
  trunk: "#765845",
  leavesGreen: "#6FA276",
  palmGreen: "#8DB78D",
  blossomPink: "#E99AAE",
  solar: "#243046",
  metalDark: "#C9BBC2",
  ground: "#E8E4E3",
  groundOutside: "#F0ECEB",
  outsideMistPink: "#F0ECEB",
  outsideBlockWhite: "#E4DFDC",
  outsidePathPink: "#BBB5B8",
  eb3Shell: "#EAE3E6",
  eb3Secondary: "#DCD1D6",
  eb3Roof: "#F3EDEF",
  eb3Struct: "#C8BAC1",
  towerFacade: "#E7DEE3",
  towerBand: "#C8BAC2",
  towerGlass: "#D4DCDB",
  towerRoof: "#F1EAED",
  towerAccent: "#E39AAF",
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
  opacity: 0.55,
  envMapIntensity: 0.75,
});

export const M_TEAL_GLASS_DEEP = new THREE.MeshStandardMaterial({
  color: COLORS.tealGlassDeep,
  roughness: 0.25,
  metalness: 0.15,
  envMapIntensity: 0.7,
  transparent: true,
  opacity: 0.5,
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
  roughness: 0.15,
  metalness: 0.75,
  transparent: true,
  opacity: 0.92,
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
  opacity: 0.72,
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
