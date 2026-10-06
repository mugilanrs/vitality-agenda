"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { COLORS } from "@/lib/materials";
import { NORTH_ROAD, ROAD_WIDTH, SOUTH_ROAD } from "@/data/roadRoutes";

/**
 * The two roads that leave the campus: south to the Airport, north to
 * Fisherman Cove. Each is a real asphalt road — pale kerb, dark carriageway,
 * dashed white centre line and thin pink edge lines — that joins the existing
 * boulevard / ring road and passes through an opening in the perimeter wall.
 * Centre lines live in data/roadRoutes.ts (shared with the traffic).
 */

const SAMPLES = 40;
const Y = 0.07;

function curveFor(points: readonly (readonly [number, number])[]) {
  return new THREE.CatmullRomCurve3(
    points.map(([x, z]) => new THREE.Vector3(x, 0, z)),
  );
}

/** Flat ribbon along the curve, `offset` to the side of the centre line. */
function ribbonGeometry(curve: THREE.CatmullRomCurve3, width: number, offset = 0) {
  const samples = curve.getPoints(SAMPLES);
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
    const nx = -dz;
    const nz = dx;
    const cx = samples[i].x + nx * offset;
    const cz = samples[i].z + nz * offset;
    positions.push(cx + nx * width * 0.5, Y, cz + nz * width * 0.5);
    positions.push(cx - nx * width * 0.5, Y, cz - nz * width * 0.5);
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

/** Dashed centre line: short quads laid along the curve in one geometry. */
function dashGeometry(curve: THREE.CatmullRomCurve3, dash = 0.2, gap = 0.2, width = 0.06) {
  const total = curve.getLength();
  const step = dash + gap;
  const positions: number[] = [];
  const indices: number[] = [];
  for (let d = gap; d + dash < total; d += step) {
    const a = curve.getPointAt(d / total);
    const b = curve.getPointAt((d + dash) / total);
    let dx = b.x - a.x;
    let dz = b.z - a.z;
    const len = Math.hypot(dx, dz) || 1;
    dx /= len;
    dz /= len;
    const nx = -dz * width * 0.5;
    const nz = dx * width * 0.5;
    const i = positions.length / 3;
    positions.push(a.x + nx, Y, a.z + nz, a.x - nx, Y, a.z - nz);
    positions.push(b.x + nx, Y, b.z + nz, b.x - nx, Y, b.z - nz);
    indices.push(i, i + 1, i + 2, i + 1, i + 3, i + 2);
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

function buildRoad(points: readonly (readonly [number, number])[]) {
  const curve = curveFor(points);
  return {
    kerb: ribbonGeometry(curve, ROAD_WIDTH + 0.26),
    asphalt: ribbonGeometry(curve, ROAD_WIDTH),
    edgeL: ribbonGeometry(curve, 0.05, ROAD_WIDTH / 2 - 0.07),
    edgeR: ribbonGeometry(curve, 0.05, -(ROAD_WIDTH / 2 - 0.07)),
    dashes: dashGeometry(curve),
  };
}

type RoadGeometry = ReturnType<typeof buildRoad>;

const layer = (n: number) => ({
  polygonOffset: true,
  polygonOffsetFactor: -n,
  polygonOffsetUnits: -n,
});

function Road({ geometry }: { geometry: RoadGeometry }) {
  return (
    <group>
      <mesh geometry={geometry.kerb} receiveShadow>
        <meshStandardMaterial color={"#e6e0d1"} roughness={1} side={THREE.DoubleSide} {...layer(6)} />
      </mesh>
      <mesh geometry={geometry.asphalt} receiveShadow>
        <meshStandardMaterial color={COLORS.roadDark} roughness={0.95} side={THREE.DoubleSide} {...layer(7)} />
      </mesh>
      <mesh geometry={geometry.edgeL}>
        <meshBasicMaterial color={"#EE5A8F"} side={THREE.DoubleSide} {...layer(8)} />
      </mesh>
      <mesh geometry={geometry.edgeR}>
        <meshBasicMaterial color={"#EE5A8F"} side={THREE.DoubleSide} {...layer(8)} />
      </mesh>
      <mesh geometry={geometry.dashes}>
        <meshStandardMaterial color={COLORS.roadStripe} roughness={0.7} side={THREE.DoubleSide} {...layer(9)} />
      </mesh>
    </group>
  );
}

export default function JourneyRoutes() {
  const roads = useMemo(
    () => ({ south: buildRoad(SOUTH_ROAD), north: buildRoad(NORTH_ROAD) }),
    [],
  );

  return (
    <group>
      <Road geometry={roads.south} />
      <Road geometry={roads.north} />
    </group>
  );
}
