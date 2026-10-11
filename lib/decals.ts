import type { Material } from "three";

/**
 * Flat ground layers (lawns, aprons, roads, route ribbons) sit only a few
 * thousandths of a unit apart. A depth buffer cannot reliably order surfaces
 * that close, so they z-fight and flicker as the camera drifts.
 *
 * `decal(material, level)` returns a copy of the material with a depth bias
 * that grows with `level`, so a higher level always draws on top of a lower one
 * regardless of depth precision. Copies are cached per (material, level).
 */
const cache = new Map<string, Material>();

export function decal<T extends Material>(base: T, level: number): T {
  const key = `${base.uuid}:${level}`;
  let m = cache.get(key) as T | undefined;
  if (!m) {
    m = base.clone() as T;
    m.polygonOffset = true;
    m.polygonOffsetFactor = -level;
    m.polygonOffsetUnits = -level;
    cache.set(key, m);
  }
  return m;
}
