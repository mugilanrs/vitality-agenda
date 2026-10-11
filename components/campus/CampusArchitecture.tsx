"use client";

import { useEffect, useState } from "react";
import Roads from "./Roads";
import CentralSpine from "./CentralSpine";
import CampusBuilding from "./CampusBuilding";
import Plaza from "./Plaza";
import WaterBodies from "./WaterBodies";
import Bridges from "./Bridges";
import Vegetation from "./Vegetation";
import CampusPerimeter from "./CampusPerimeter";
import VegetationOuter from "./VegetationOuter";
import {
  M_GROUND,
  M_GRASS,
  COLORS,
} from "@/lib/materials";
import { BLOCK_X, BLOCK_ROWS, BLOCK_SIZE, BUILDINGS, BUILDING_ORDER } from "@/data/buildings";
import { journey, subscribeJourney } from "@/lib/journey";

/**
 * PHASE 9 — the campus, composed to match the reference architecture.
 *
 *   ┌────── perimeter wall + entrance gate ──────┐
 *   │                                              │
 *   │ 6 primary blocks · central spine · tower     │
 *   │           · entrance lake                    │
 *   │                                              │
 *   └──────────── forest all around ───────────────┘
 *
 * The surroundings are a quiet forest that fades into the scene haze; the
 * inner campus stays natural (architecture, glass, green grass, water).
 */

function ExternalEnvironment() {
  // Outer ground only. The old pale "district" blocks and radial streets are
  // gone; VegetationOuter fills the surroundings with forest instead.
  return (
    <group>
      {/* Full outer ground disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[78, 96]} />
        <meshStandardMaterial color={COLORS.groundOutside} roughness={1} />
      </mesh>
    </group>
  );
}

function Terrain() {
  return (
    <group>
      {/* Campus site disc — the "green" ground plane inside the wall */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        material={M_GROUND}
        receiveShadow
      >
        <circleGeometry args={[16.4, 96]} />
      </mesh>

      {/* Central grass ellipse around the spine */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, 0]}
        material={M_GRASS}
        receiveShadow
      >
        <circleGeometry args={[9.6, 96]} />
      </mesh>

      {/* Faint darker grass boundary */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <ringGeometry args={[9.55, 9.75, 96]} />
        <meshStandardMaterial color={COLORS.grassDeep} roughness={1} />
      </mesh>

      {/* Small courtyard lawns beside each block row */}
      {(["rear", "middle", "front"] as const).map((row) => (
        <group key={row}>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[-BLOCK_X, 0.007, BLOCK_ROWS[row]]}
          >
            <circleGeometry args={[1.4, 32]} />
            <meshStandardMaterial color={COLORS.grassDeep} roughness={1} />
          </mesh>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[BLOCK_X, 0.007, BLOCK_ROWS[row]]}
          >
            <circleGeometry args={[1.4, 32]} />
            <meshStandardMaterial color={COLORS.grassDeep} roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function PrimaryBlocks() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const apply = () => {
      const f = journey.focus;
      setHidden(f.level !== "campus" && f.building === "eb3");
    };
    apply();
    return subscribeJourney(apply, "focus");
  }, []);

  return (
    <group visible={!hidden}>
      {BUILDING_ORDER.map((id, i) => {
        const b = BUILDINGS[id];
        const rotY = b.side === "left" ? Math.PI : 0;
        const [x, , z] = b.basePosition;
        const variant = i % 2 === 0 ? "default" : "stacked";
        return (
          <group key={id} position={[x, 0, z]} rotation={[0, rotY, 0]}>
            <CampusBuilding
              width={BLOCK_SIZE.width}
              depth={BLOCK_SIZE.depth}
              floors={BLOCK_SIZE.floors}
              floorHeight={BLOCK_SIZE.floorHeight}
              plan="curved"
              canopyOverhang={0.55}
              fins={11}
              variant={variant}
              isEB3={id === "eb3"}
            />
          </group>
        );
      })}
    </group>
  );
}

function BlockBridges() {
  const rows = Object.values(BLOCK_ROWS);
  const wings = [
    ...rows.map((z) => ({ z, xFrom: -BLOCK_X + BLOCK_SIZE.depth / 2, xTo: -1.2 })),
    ...rows.map((z) => ({ z, xFrom: 1.2, xTo: BLOCK_X - BLOCK_SIZE.depth / 2 })),
  ];
  return <Bridges wings={wings} />;
}

export default function CampusArchitecture() {
  return (
    <group>
      <ExternalEnvironment />
      <VegetationOuter />
      <Terrain />
      <Roads />
      <WaterBodies />

      <CentralSpine />
      <PrimaryBlocks />
      <BlockBridges />

      {/* Entrance plaza + lake, south of the spine */}
      <group position={[0, 0, 6.5]}>
        <Plaza />
      </group>

      <Vegetation />

      {/* Perimeter wall + entrance gate — frames the site */}
      <CampusPerimeter />
    </group>
  );
}
