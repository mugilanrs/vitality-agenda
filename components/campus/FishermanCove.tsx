"use client";

import { FISHERMAN_COVE_POSITION } from "@/data/externalDestinations";
import { decal } from "@/lib/decals";
import {
  M_CONCRETE_LIGHT,
  M_GRASS,
  M_ROOF_RIM,
  M_ROOF_WHITE,
  M_TEAL_GLASS,
  M_WHITE_SHELL,
  COLORS,
} from "@/lib/materials";

/**
 * Fisherman Cove — a low, long resort hotel north of the campus.
 * Simplified 2.5D massing: curved bar, two window bands, a lobby canopy,
 * and a small lawn. No interiors.
 */

const BAYS = 8;
const BAY_W = 1.08;
const DEPTH = 2.55;
const HEIGHT = 0.92;

function MiniTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.56, 6]} />
        <meshStandardMaterial color={COLORS.trunk} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <icosahedronGeometry args={[0.36, 0]} />
        <meshStandardMaterial color={COLORS.leavesGreen} roughness={0.85} />
      </mesh>
    </group>
  );
}

export default function FishermanCove() {
  const [x, , z] = FISHERMAN_COVE_POSITION;
  const span = BAYS * BAY_W;

  return (
    <group position={[x, 0, z]}>
      {/* Lawn — lighter than the campus grounds */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0.2]} material={decal(M_GRASS, 1)} receiveShadow>
        <circleGeometry args={[6.4, 40]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 0.2]}>
        <ringGeometry args={[6.15, 6.4, 40]} />
        <meshStandardMaterial color={COLORS.grassDeep} roughness={1} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} />
      </mesh>

      {/* Walkway toward the campus (south, +Z) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, DEPTH / 2 + 1.7]}
        material={decal(M_CONCRETE_LIGHT, 4)}
        receiveShadow
      >
        <planeGeometry args={[1.15, 3.2]} />
      </mesh>

      {/* Curved bar of room bays */}
      {Array.from({ length: BAYS }, (_, i) => {
        const t = (i + 0.5) / BAYS;
        const bx = (t - 0.5) * span;
        const bow = Math.sin(t * Math.PI) * 0.42;
        return (
          <group key={i} position={[bx, 0, bow]}>
            <mesh
              castShadow
              receiveShadow
              position={[0, HEIGHT / 2, 0]}
              material={M_WHITE_SHELL}
            >
              <boxGeometry args={[BAY_W - 0.08, HEIGHT, DEPTH]} />
            </mesh>
            {/* Floor line */}
            <mesh position={[0, HEIGHT * 0.5, DEPTH / 2 + 0.01]} material={M_ROOF_RIM}>
              <boxGeometry args={[BAY_W - 0.16, 0.045, 0.04]} />
            </mesh>
            {/* Two window bands on the campus-facing side */}
            {[0.28, 0.66].map((wy) => (
              <mesh
                key={wy}
                position={[0, wy, DEPTH / 2 + 0.02]}
                material={M_TEAL_GLASS}
              >
                <boxGeometry args={[BAY_W * 0.62, 0.22, 0.04]} />
              </mesh>
            ))}
            {/* Shallow balcony */}
            <mesh
              castShadow
              position={[0, 0.46, DEPTH / 2 + 0.16]}
              material={M_CONCRETE_LIGHT}
            >
              <boxGeometry args={[BAY_W - 0.18, 0.04, 0.28]} />
            </mesh>
          </group>
        );
      })}

      {/* Continuous roof, slightly longer than the bar */}
      <mesh castShadow position={[0, HEIGHT + 0.06, 0.15]} material={M_ROOF_WHITE}>
        <boxGeometry args={[span + 0.55, 0.08, DEPTH + 0.7]} />
      </mesh>
      <mesh position={[0, HEIGHT + 0.02, 0.15]} material={M_ROOF_RIM}>
        <boxGeometry args={[span + 0.62, 0.025, DEPTH + 0.78]} />
      </mesh>

      {/* Lobby — a slightly taller glass bay and a small canopy */}
      <mesh position={[0, 0.55, DEPTH / 2 + 0.08]} material={M_TEAL_GLASS}>
        <boxGeometry args={[1.35, 0.7, 0.06]} />
      </mesh>
      <mesh
        castShadow
        position={[0, 0.95, DEPTH / 2 + 0.45]}
        material={M_ROOF_WHITE}
      >
        <boxGeometry args={[2.1, 0.05, 0.9]} />
      </mesh>
      <mesh position={[0, 0.04, DEPTH / 2 + 0.55]} material={M_CONCRETE_LIGHT}>
        <boxGeometry args={[1.6, 0.06, 0.7]} />
      </mesh>

      <MiniTree position={[-4.6, 0, 2.4]} />
      <MiniTree position={[4.8, 0, 2.2]} />
      <MiniTree position={[-3.4, 0, -2.3]} />
      <MiniTree position={[3.6, 0, -2.15]} />
      <MiniTree position={[0.2, 0, 3.6]} />
    </group>
  );
}
