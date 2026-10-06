"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NORTH_ROAD, SOUTH_ROAD } from "@/data/roadRoutes";

/**
 * A handful of plain white cars circulating on the campus roads:
 *
 *   airport → south road → ring road (west) → north road → Fisherman Cove,
 *   turn around, back down the north road → ring road (east) → south road →
 *   airport, turn around, repeat.
 *
 * One closed loop built from the same centre lines as the road meshes
 * (data/roadRoutes.ts). Traffic keeps to the right-hand lane. The cars are
 * three InstancedMeshes (body, cabin, glass) moved along the loop each frame.
 */

// Ring road (mirrors Roads.tsx).
const RING_RX = 13.6;
const RING_RZ = 11.6;

const CAR_COUNT = 12;
const SPEED = 1.5; // world units / second
const LANE = 0.27; // lateral offset from the road's centre line
const GROUND = 0.075; // just above the road surface
const TAPER = 1.4; // blend lane offset to zero this far from ring junctions

type XZ = readonly [number, number];

/** Evenly spaced samples (x, z, travel-direction) along a polyline. */
function sampleLine(points: readonly XZ[], reverse: boolean) {
  const pts = (reverse ? [...points].reverse() : [...points]).map(
    ([x, z]) => new THREE.Vector3(x, 0, z),
  );
  const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
  const n = Math.max(8, Math.ceil(curve.getLength() / 0.25));
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const p = curve.getPointAt(t);
    const d = curve.getTangentAt(t);
    return { x: p.x, z: p.z, dx: d.x, dz: d.z };
  });
}

/** Ring-road arc between two angles (angles increase south → west → north). */
function sampleArc(from: number, to: number) {
  const n = Math.ceil(((Math.abs(to - from) * (RING_RX + RING_RZ)) / 2) / 0.25);
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = from + ((to - from) * i) / n;
    return {
      x: Math.cos(a) * RING_RX,
      z: Math.sin(a) * RING_RZ,
      dx: -RING_RX * Math.sin(a),
      dz: RING_RZ * Math.cos(a),
    };
  });
}

type Sample = ReturnType<typeof sampleLine>[number];

/** Shift a leg to the right-hand lane, easing back to the centre at its ends. */
function laned(samples: Sample[], taperStart: boolean, taperEnd: boolean) {
  const last = samples.length - 1;
  return samples.map((s, i) => {
    const len = Math.hypot(s.dx, s.dz) || 1;
    // Distance (≈ index × 0.25) from either end of the leg.
    const fromStart = i * 0.25;
    const fromEnd = (last - i) * 0.25;
    let k = 1;
    if (taperStart) k = Math.min(k, Math.min(1, fromStart / TAPER));
    if (taperEnd) k = Math.min(k, Math.min(1, fromEnd / TAPER));
    const off = LANE * (k * k * (3 - 2 * k));
    return new THREE.Vector3(s.x + (-s.dz / len) * off, 0, s.z + (s.dx / len) * off);
  });
}

/** Half-circle that carries a car from one lane to the other at a dead end. */
function uTurn(from: THREE.Vector3, to: THREE.Vector3, bulge: THREE.Vector3) {
  const mid = from.clone().add(to).multiplyScalar(0.5);
  const r = from.distanceTo(to) / 2;
  const axis = bulge.clone().normalize();
  const side = from.clone().sub(mid).normalize();
  return [1, 2, 3, 4, 5].map((k) => {
    const a = (k / 6) * Math.PI;
    return mid
      .clone()
      .add(side.clone().multiplyScalar(Math.cos(a) * r))
      .add(axis.clone().multiplyScalar(Math.sin(a) * r));
  });
}

function buildLoop() {
  const southIn = laned(sampleLine(SOUTH_ROAD, false), true, false); // junction → airport
  const southOut = laned(sampleLine(SOUTH_ROAD, true), false, true); // airport → junction
  const northOut = laned(sampleLine(NORTH_ROAD, false), true, false); // ring → cove
  const northIn = laned(sampleLine(NORTH_ROAD, true), false, true); // cove → ring
  const west = laned(sampleArc(Math.PI / 2, (3 * Math.PI) / 2), true, true);
  const east = laned(sampleArc((3 * Math.PI) / 2, (5 * Math.PI) / 2), true, true);

  const heading = (pts: THREE.Vector3[]) =>
    pts[pts.length - 1].clone().sub(pts[pts.length - 2]);
  const last = (pts: THREE.Vector3[]) => pts[pts.length - 1];

  return [
    ...southIn,
    ...uTurn(last(southIn), southOut[0], heading(southIn)),
    ...southOut,
    ...west,
    ...northOut,
    ...uTurn(last(northOut), northIn[0], heading(northOut)),
    ...northIn,
    ...east,
  ];
}

const CAR_L = 0.56;
const CAR_W = 0.26;

export default function CarTraffic() {
  const loop = useMemo(() => {
    const pts = buildLoop();
    const curve = new THREE.CatmullRomCurve3(pts, true, "centripetal");
    curve.arcLengthDivisions = 1500;
    return { curve, length: curve.getLength() };
  }, []);

  const body = useRef<THREE.InstancedMesh>(null);
  const cabin = useRef<THREE.InstancedMesh>(null);
  const glass = useRef<THREE.InstancedMesh>(null);

  const tmp = useMemo(
    () => ({
      m: new THREE.Matrix4(),
      q: new THREE.Quaternion(),
      up: new THREE.Vector3(0, 1, 0),
      pos: new THREE.Vector3(),
      s: new THREE.Vector3(1, 1, 1),
    }),
    [],
  );

  const place = (time: number) => {
    const { curve, length } = loop;
    for (let i = 0; i < CAR_COUNT; i++) {
      const u = (((i / CAR_COUNT) * length + time * SPEED) % length) / length;
      const p = curve.getPointAt(u);
      const t = curve.getTangentAt(u);
      tmp.q.setFromAxisAngle(tmp.up, Math.atan2(-t.z, t.x));
      const set = (mesh: THREE.InstancedMesh | null, y: number, dx = 0) => {
        if (!mesh) return;
        tmp.pos.set(p.x + t.x * dx, GROUND + y, p.z + t.z * dx);
        tmp.m.compose(tmp.pos, tmp.q, tmp.s);
        mesh.setMatrixAt(i, tmp.m);
      };
      set(body.current, 0.055);
      set(cabin.current, 0.135, -0.025);
      set(glass.current, 0.138, -0.025);
    }
    for (const mesh of [body.current, cabin.current, glass.current]) {
      if (mesh) mesh.instanceMatrix.needsUpdate = true;
    }
  };

  useLayoutEffect(() => {
    place(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loop]);

  useFrame(({ clock }) => place(clock.elapsedTime));

  return (
    <group>
      <instancedMesh ref={body} args={[undefined, undefined, CAR_COUNT]} frustumCulled={false} castShadow>
        <boxGeometry args={[CAR_L, 0.11, CAR_W]} />
        <meshStandardMaterial color={"#ffffff"} roughness={0.35} />
      </instancedMesh>
      <instancedMesh ref={cabin} args={[undefined, undefined, CAR_COUNT]} frustumCulled={false} castShadow>
        <boxGeometry args={[CAR_L * 0.5, 0.075, CAR_W * 0.86]} />
        <meshStandardMaterial color={"#ffffff"} roughness={0.35} />
      </instancedMesh>
      <instancedMesh ref={glass} args={[undefined, undefined, CAR_COUNT]} frustumCulled={false}>
        <boxGeometry args={[CAR_L * 0.5 + 0.012, 0.045, CAR_W * 0.86 + 0.012]} />
        <meshStandardMaterial color={"#4d6772"} roughness={0.2} />
      </instancedMesh>
    </group>
  );
}
