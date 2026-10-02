"use client";

import { useEffect } from "react";
import * as THREE from "three";
import {
  COLORS,
  M_CONCRETE_LIGHT,
  M_GRASS,
  M_GROUND,
  M_METAL_DARK,
  M_PLACEHOLDER_SOLID,
  M_ROAD,
  M_ROAD_STRIPE,
  M_ROOF_RIM,
  M_ROOF_WHITE,
  M_TEAL_GLASS,
  M_TEAL_GLASS_DEEP,
  M_TEAL_GLASS_HOVER,
  M_WATER,
  M_WHITE_SHELL,
} from "@/lib/materials";

/**
 * Theme-reactive material palette.
 *
 * The shared singletons in `materials.ts` are shipped with their "light" tint
 * (warm whites, teal glass, pale terrain). This hook watches `data-theme` on
 * <html> and re-tints each material in place so the whole 3D campus follows
 * the same light / dark palette as the HTML chrome.
 *
 * In dark mode the massing shifts toward the legacy's dark-purple building
 * language (`--bld-roof`, `--bld-left`, `--bld-right` from the SVG site), the
 * glass goes to a deeper blue-grey, the ground to a near-black purple, and
 * water + grass are muted so nothing competes with the pink UI.
 */

type Palette = {
  whiteShell: string;
  whiteShellCool: string;
  roofWhite: string;
  roofRim: string;
  tealGlass: string;
  tealGlassDeep: string;
  grass: string;
  water: string;
  road: string;
  roadStripe: string;
  ground: string;
  concreteLight: string;
  metalDark: string;
};

const LIGHT: Palette = {
  whiteShell: COLORS.whiteShell,
  whiteShellCool: COLORS.whiteShellCool,
  roofWhite: COLORS.roofWhite,
  roofRim: COLORS.roofRim,
  tealGlass: COLORS.tealGlass,
  tealGlassDeep: COLORS.tealGlassDeep,
  grass: COLORS.grass,
  water: COLORS.waterTurquoise,
  road: COLORS.roadDark,
  roadStripe: COLORS.roadStripe,
  ground: COLORS.ground,
  concreteLight: COLORS.concreteLight,
  metalDark: COLORS.metalDark,
};

// Dark palette — ported from the legacy SVG site's dark CSS variables.
// --bld-roof #40384c, --bld-left #322a3d, --bld-right #27202f, --glass #3a4551,
// --ground  #1a141f, --road #241a26, --water #152430, --leaf #33422f.
const DARK: Palette = {
  whiteShell: COLORS.whiteShell,
  whiteShellCool: COLORS.whiteShellCool,
  roofWhite: COLORS.roofWhite,
  roofRim: COLORS.roofRim,
  tealGlass: COLORS.tealGlass,
  tealGlassDeep: COLORS.tealGlassDeep,
  grass: COLORS.grass,
  water: COLORS.waterTurquoise,
  road: COLORS.roadDark,
  roadStripe: COLORS.roadStripe,
  ground: COLORS.ground,
  concreteLight: COLORS.concreteLight,
  metalDark: COLORS.metalDark,
};

function applyPalette(p: Palette) {
  M_WHITE_SHELL.color.set(p.whiteShell);
  M_ROOF_WHITE.color.set(p.roofWhite);
  M_ROOF_RIM.color.set(p.roofRim);
  M_TEAL_GLASS.color.set(p.tealGlass);
  M_TEAL_GLASS_DEEP.color.set(p.tealGlassDeep);
  M_TEAL_GLASS_HOVER.color.set(p.tealGlass);
  (M_TEAL_GLASS_HOVER as THREE.MeshStandardMaterial).emissive?.set(p.tealGlass);
  M_CONCRETE_LIGHT.color.set(p.concreteLight);
  M_ROAD.color.set(p.road);
  M_ROAD_STRIPE.color.set(p.roadStripe);
  M_GRASS.color.set(p.grass);
  M_WATER.color.set(p.water);
  M_GROUND.color.set(p.ground);
  M_METAL_DARK.color.set(p.metalDark);
  M_PLACEHOLDER_SOLID.color.set(p.whiteShell);

  M_WHITE_SHELL.needsUpdate = true;
  M_ROOF_WHITE.needsUpdate = true;
  M_ROOF_RIM.needsUpdate = true;
  M_TEAL_GLASS.needsUpdate = true;
  M_TEAL_GLASS_DEEP.needsUpdate = true;
  M_TEAL_GLASS_HOVER.needsUpdate = true;
  M_CONCRETE_LIGHT.needsUpdate = true;
  M_ROAD.needsUpdate = true;
  M_ROAD_STRIPE.needsUpdate = true;
  M_GRASS.needsUpdate = true;
  M_WATER.needsUpdate = true;
  M_GROUND.needsUpdate = true;
  M_METAL_DARK.needsUpdate = true;
  M_PLACEHOLDER_SOLID.needsUpdate = true;
}

function resolveMode(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const t = document.documentElement.getAttribute("data-theme");
  if (t === "dark") return "dark";
  if (t === "light") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useThemedMaterials() {
  useEffect(() => {
    const sync = () => applyPalette(resolveMode() === "dark" ? DARK : LIGHT);
    sync();

    // Observe <html data-theme> changes so a toggle instantly repaints.
    const html = document.documentElement;
    const obs = new MutationObserver(sync);
    obs.observe(html, { attributes: true, attributeFilter: ["data-theme"] });

    // Also react to system scheme flips when no explicit theme is set.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onMedia = () => sync();
    mq.addEventListener?.("change", onMedia);

    return () => {
      obs.disconnect();
      mq.removeEventListener?.("change", onMedia);
    };
  }, []);
}
