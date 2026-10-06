"use client";

import { FISHERMAN_COVE_POSITION } from "@/data/externalDestinations";
import { decal } from "@/lib/decals";
import {
  M_CONCRETE_LIGHT,
  M_GRASS,
  M_METAL_DARK,
  M_ROOF_RIM,
  M_ROOF_WHITE,
  M_TEAL_GLASS,
  M_WHITE_SHELL,
  COLORS,
} from "@/lib/materials";

/**
 * Fisherman Cove — a low, long resort hotel north of the campus.
 * Simplified 2.5D massing: curved bar, two window bands, balcony rails, a
 * lobby with a drive-up porch, a pool terrace, a fountain court, palms and a
 * small lawn. No interiors.
 */

const PINK = COLORS.blossomPink;

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

function Palm({ position, lean = 0 }: { position: [number, number, number]; lean?: number }) {
  return (
    <group position={position} rotation={[0, lean, 0]}>
      <mesh position={[0, 0.34, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.05, 0.68, 6]} />
        <meshStandardMaterial color={COLORS.trunk} roughness={0.9} />
      </mesh>
      {[0, 1, 2, 3, 4].map((k) => (
        <mesh
          key={k}
          position={[Math.cos((k / 5) * Math.PI * 2) * 0.16, 0.7, Math.sin((k / 5) * Math.PI * 2) * 0.16]}
          rotation={[Math.sin((k / 5) * Math.PI * 2) * 0.55, 0, -Math.cos((k / 5) * Math.PI * 2) * 0.55]}
          castShadow
        >
          <boxGeometry args={[0.46, 0.015, 0.1]} />
          <meshStandardMaterial color={COLORS.palmGreen} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function Umbrella({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.17, 0]} material={M_METAL_DARK}>
        <cylinderGeometry args={[0.01, 0.01, 0.34, 5]} />
      </mesh>
      <mesh position={[0, 0.36, 0]} castShadow>
        <coneGeometry args={[0.2, 0.1, 8]} />
        <meshStandardMaterial color={PINK} roughness={0.7} />
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


      {/* Balcony rails along every bay */}
      {Array.from({ length: BAYS }, (_, i) => {
        const t = (i + 0.5) / BAYS;
        return (
          <mesh
            key={`rail-${i}`}
            position={[(t - 0.5) * span, 0.52, Math.sin(t * Math.PI) * 0.42 + DEPTH / 2 + 0.29]}
            material={M_ROOF_RIM}
          >
            <boxGeometry args={[BAY_W - 0.2, 0.05, 0.015]} />
          </mesh>
        );
      })}

      {/* Pink fascia over the lobby, rooftop plant */}
      <mesh position={[0, 0.93, DEPTH / 2 + 0.11]}>
        <boxGeometry args={[1.35, 0.05, 0.02]} />
        <meshStandardMaterial color={PINK} roughness={0.6} />
      </mesh>
      {[-2.9, 1.7, 3.4].map((rx) => (
        <mesh key={rx} castShadow position={[rx, HEIGHT + 0.2, 0.1]} material={M_WHITE_SHELL}>
          <boxGeometry args={[0.6, 0.14, 0.4]} />
        </mesh>
      ))}

      {/* Drive-up porch: columns either side of the entrance road */}
      {[-0.95, 0.95].map((cx) => (
        <mesh key={cx} castShadow position={[cx, 0.47, DEPTH / 2 + 0.78]} material={M_METAL_DARK}>
          <boxGeometry args={[0.06, 0.94, 0.06]} />
        </mesh>
      ))}

      {/* Pool terrace east of the lobby */}
      <mesh position={[3.45, 0.03, 2.55]} material={M_CONCRETE_LIGHT} receiveShadow>
        <boxGeometry args={[3.5, 0.04, 1.9]} />
      </mesh>
      <mesh position={[3.45, 0.055, 2.55]} material={M_WHITE_SHELL}>
        <boxGeometry args={[2.3, 0.03, 1.0]} />
      </mesh>
      <mesh position={[3.45, 0.075, 2.55]}>
        <boxGeometry args={[2.16, 0.02, 0.86]} />
        <meshStandardMaterial color={COLORS.waterTurquoise} roughness={0.25} />
      </mesh>
      {[2.55, 3.0, 3.45, 3.9, 4.35].map((lx) => (
        <mesh key={`lg-${lx}`} castShadow position={[lx, 0.1, 3.38]} material={M_WHITE_SHELL}>
          <boxGeometry args={[0.28, 0.05, 0.1]} />
        </mesh>
      ))}
      <Umbrella position={[2.8, 0.05, 3.2]} />
      <Umbrella position={[4.1, 0.05, 3.2]} />

      {/* Fountain court west of the lobby */}
      <mesh position={[-2.9, 0.04, 2.7]} material={M_CONCRETE_LIGHT} receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.06, 20]} />
      </mesh>
      <mesh position={[-2.9, 0.075, 2.7]}>
        <cylinderGeometry args={[0.55, 0.55, 0.04, 20]} />
        <meshStandardMaterial color={COLORS.waterTurquoise} roughness={0.25} />
      </mesh>
      <mesh position={[-2.9, 0.2, 2.7]}>
        <coneGeometry args={[0.1, 0.24, 8]} />
        <meshStandardMaterial color={COLORS.tealGlass} roughness={0.3} />
      </mesh>

      {/* Garden path from the lobby road to the fountain court */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-1.4, 0.032, 2.75]}
        material={M_CONCRETE_LIGHT}
        receiveShadow
      >
        <planeGeometry args={[1.7, 0.3]} />
      </mesh>

      {/* Palms along the front */}
      <Palm position={[-1.9, 0, 3.3]} lean={0.3} />
      <Palm position={[-3.9, 0, 3.4]} lean={1.1} />
      <Palm position={[-4.5, 0, 3.0]} lean={2.0} />
      <Palm position={[1.9, 0, 4.1]} lean={0.8} />
      <Palm position={[5.5, 0, 3.7]} lean={1.6} />

      {/* Lamp posts along the entrance road */}
      {[
        [-0.85, 3.4],
        [0.85, 4.5],
      ].map(([lx, lz]) => (
        <group key={lz} position={[lx, 0, lz]}>
          <mesh position={[0, 0.3, 0]} material={M_METAL_DARK}>
            <cylinderGeometry args={[0.015, 0.02, 0.6, 6]} />
          </mesh>
          <mesh position={[0, 0.62, 0]} material={M_ROOF_WHITE}>
            <sphereGeometry args={[0.05, 8, 6]} />
          </mesh>
        </group>
      ))}

      <MiniTree position={[-4.6, 0, 2.4]} />
      <MiniTree position={[6.0, 0, 1.6]} />
      <MiniTree position={[-3.4, 0, -2.3]} />
      <MiniTree position={[3.6, 0, -2.15]} />
      <MiniTree position={[-5.3, 0, 3.3]} />
    </group>
  );
}
