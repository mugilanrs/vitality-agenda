"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  AIRPORT_POSITION,
  CAMPUS_EDGE,
  FISHERMAN_COVE_POSITION,
} from "@/data/externalDestinations";
import { detectQuality } from "@/lib/quality";

/**
 * Forest that fills the ground outside the campus wall. It is deliberately
 * quiet (dark/mid greens, no shadows) and fades into the scene haze, so the
 * campus stays the focus. Low-poly canopies match the in-campus trees.
 *
 * Kept clear of: the campus + its wall, both external destination lawns, and
 * the north/south approach corridors.
 */

const TREE_COUNT = 3200;
const R_MIN = CAMPUS_EDGE + 1.8;
const R_MAX = 60;
const GREENS = ["#2F6B35", "#3E7F40", "#2A5A31", "#4C8F46", "#356F3A"];

/** Small deterministic PRNG so the forest is identical on every load. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function buildTrees(count: number) {
  const r = rng(11);
  const [cx, , cz] = FISHERMAN_COVE_POSITION;
  const [ax, , az] = AIRPORT_POSITION;
  const out: { x: number; z: number; s: number; c: THREE.Color }[] = [];
  for (let i = 0; i < count * 1.3 && out.length < count; i++) {
    const a = r() * Math.PI * 2;
    const d = R_MIN + Math.sqrt(r()) * (R_MAX - R_MIN);
    const x = Math.cos(a) * d;
    const z = Math.sin(a) * d;
    if (Math.hypot(x - cx, z - cz) < 7.6) continue;
    if (Math.hypot(x - ax, z - az) < 9.5) continue;
    if (Math.abs(x) < 1.1 && Math.abs(z) < 25) continue;
    out.push({
      x,
      z,
      s: 0.7 + r() * 0.7,
      c: new THREE.Color(GREENS[Math.floor(r() * GREENS.length)]),
    });
  }
  return out;
}

export default function VegetationOuter() {
  const trees = useMemo(
    () => buildTrees(Math.round(TREE_COUNT * detectQuality().vegetationScale)),
    [],
  );
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    trees.forEach((t, i) => {
      m.compose(
        new THREE.Vector3(t.x, t.s * 0.85, t.z),
        q,
        new THREE.Vector3(t.s, t.s * 1.15, t.s),
      );
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, t.c);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.frustumCulled = false;
  }, [trees]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, trees.length]}>
      <icosahedronGeometry args={[0.62, 0]} />
      <meshStandardMaterial roughness={0.9} />
    </instancedMesh>
  );
}
