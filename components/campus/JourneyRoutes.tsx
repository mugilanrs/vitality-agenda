"use client";

import { useMemo } from "react";
import * as THREE from "three";
import {
  AIRPORT_POSITION,
  CAMPUS_EDGE,
  FISHERMAN_COVE_POSITION,
} from "@/data/externalDestinations";
import { COLORS } from "@/lib/materials";

/**
 * Narrative paths that meet the campus boundary and stop there.
 * North path → Fisherman Cove. South path → Airport.
 * They do not enter the campus or cross its buildings.
 */

function ribbonGeometry(
  points: readonly (readonly [number, number])[],
  width: number,
) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(([x, z]) => new THREE.Vector3(x, 0, z)),
  );
  const samples = curve.getPoints(28);
  const positions: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i < samples.length; i++) {
    const prev = samples[Math.max(0, i - 1)];
    const next = samples[Math.min(samples.length - 1, i + 1)];
    let dx = next.x - prev.x;
    let dz = next.z - prev.z;
    const len = Math.hypot(dx, dz) || 1;
    dx /= len;
    dz /= len;
    const px = -dz * width * 0.5;
    const pz = dx * width * 0.5;
    const y = 0.07;
    positions.push(samples[i].x + px, y, samples[i].z + pz);
    positions.push(samples[i].x - px, y, samples[i].z - pz);
    if (i < samples.length - 1) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

function boundaryToward(x: number, z: number): [number, number] {
  const len = Math.hypot(x, z) || 1;
  return [(x / len) * CAMPUS_EDGE, (z / len) * CAMPUS_EDGE];
}

function bowed(
  a: readonly [number, number],
  b: readonly [number, number],
  bulge: number,
): [number, number][] {
  const mx = (a[0] + b[0]) / 2;
  const mz = (a[1] + b[1]) / 2;
  let dx = b[0] - a[0];
  let dz = b[1] - a[1];
  const len = Math.hypot(dx, dz) || 1;
  dx /= len;
  dz /= len;
  return [a as [number, number], [mx + -dz * bulge, mz + dx * bulge], b as [number, number]];
}

export default function JourneyRoutes() {
  const geometry = useMemo(() => {
    const hotelDoor: [number, number] = [
      FISHERMAN_COVE_POSITION[0],
      FISHERMAN_COVE_POSITION[2] + 3.4,
    ];
    const northEdge = boundaryToward(hotelDoor[0], hotelDoor[1]);
    const airportDoor: [number, number] = [
      AIRPORT_POSITION[0],
      AIRPORT_POSITION[2] - 3.2,
    ];
    const southEdge = boundaryToward(0, 1);

    const northPts = bowed(northEdge, hotelDoor, 0.85);
    const southPts = bowed(southEdge, airportDoor, -1.1);
    return {
      north: ribbonGeometry(northPts, 0.7),
      south: ribbonGeometry(southPts, 0.7),
      northLine: ribbonGeometry(northPts, 0.14),
      southLine: ribbonGeometry(southPts, 0.14),
    };
  }, []);

  return (
    <group>
      <mesh geometry={geometry.north} receiveShadow>
        <meshStandardMaterial color={"#e7d4da"} roughness={1} side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={-6} polygonOffsetUnits={-6} />
      </mesh>
      <mesh geometry={geometry.south} receiveShadow>
        <meshStandardMaterial color={"#e7d4da"} roughness={1} side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={-6} polygonOffsetUnits={-6} />
      </mesh>
      <mesh geometry={geometry.northLine} position={[0, 0.015, 0]}>
        <meshBasicMaterial color={COLORS.blossomPink} transparent opacity={0.85} side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={-8} polygonOffsetUnits={-8} />
      </mesh>
      <mesh geometry={geometry.southLine} position={[0, 0.015, 0]}>
        <meshBasicMaterial color={COLORS.blossomPink} transparent opacity={0.85} side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={-8} polygonOffsetUnits={-8} />
      </mesh>
    </group>
  );
}
