"use client";

import { AIRPORT_POSITION } from "@/data/externalDestinations";
import { decal } from "@/lib/decals";
import {
  M_CONCRETE_LIGHT,
  M_GRASS,
  M_METAL_DARK,
  M_ROAD,
  M_ROAD_STRIPE,
  M_ROOF_RIM,
  M_ROOF_WHITE,
  M_TEAL_GLASS,
  M_WHITE_SHELL,
  COLORS,
} from "@/lib/materials";

/**
 * Compact airport terminal south of the campus. Silhouette first:
 * a long roof, a glass front, a striped control tower, two aircraft, jet
 * bridges, an apron with taxi lines, a short runway and a few service
 * vehicles.
 */

const PINK = COLORS.blossomPink;
const TAXI_LINE = "#E8C95A";

function Aircraft({
  position = [3.15, 0.28, 1.55],
  rotationY = 0.7,
  scale = 1,
}: {
  position?: [number, number, number];
  rotationY?: number;
  scale?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <mesh castShadow material={M_WHITE_SHELL} position={[0, 0.12, 0]}>
        <boxGeometry args={[1.7, 0.22, 0.22]} />
      </mesh>
      <mesh castShadow material={M_WHITE_SHELL} position={[0.15, 0.16, 0]}>
        <boxGeometry args={[0.42, 0.05, 1.45]} />
      </mesh>
      <mesh castShadow material={M_WHITE_SHELL} position={[-0.72, 0.32, 0]}>
        <boxGeometry args={[0.28, 0.32, 0.05]} />
      </mesh>
      <mesh castShadow material={M_ROOF_RIM} position={[-0.72, 0.42, 0]}>
        <boxGeometry args={[0.22, 0.04, 0.42]} />
      </mesh>
      <mesh position={[0.72, 0.16, 0]}>
        <boxGeometry args={[0.16, 0.1, 0.1]} />
        <meshStandardMaterial color={COLORS.blossomPink} roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function AirportDestination() {
  const [x, , z] = AIRPORT_POSITION;
  const length = 6.6;
  const depth = 2.15;
  const height = 0.72;

  return (
    <group position={[x, 0, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.4, 0.02, 0.3]} material={decal(M_GRASS, 1)} receiveShadow>
        <circleGeometry args={[5.1, 36]} />
      </mesh>

      {/* Apron */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[1.4, 0.04, 0.7]}
        material={decal(M_CONCRETE_LIGHT, 4)}
        receiveShadow
      >
        <planeGeometry args={[length + 2.4, depth + 2.6]} />
      </mesh>

      {/* Access road toward the campus (−Z) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, -depth / 2 - 2.1]}
        material={decal(M_CONCRETE_LIGHT, 5)}
        receiveShadow
      >
        <planeGeometry args={[1.05, 3.6]} />
      </mesh>

      {/* Terminal body */}
      <mesh
        castShadow
        receiveShadow
        position={[0, height / 2, 0]}
        material={M_WHITE_SHELL}
      >
        <boxGeometry args={[length, height, depth]} />
      </mesh>

      {/* Glass front, facing the camera / south */}
      <mesh position={[0, height * 0.48, depth / 2 + 0.02]} material={M_TEAL_GLASS}>
        <boxGeometry args={[length * 0.86, height * 0.55, 0.04]} />
      </mesh>
      {[-2.2, -0.7, 0.8, 2.3].map((wx) => (
        <mesh key={wx} position={[wx, height * 0.48, depth / 2 + 0.045]} material={M_ROOF_RIM}>
          <boxGeometry args={[0.04, height * 0.55, 0.02]} />
        </mesh>
      ))}

      {/* Entrance canopy */}
      <mesh
        castShadow
        position={[0, height + 0.02, depth / 2 + 0.45]}
        material={M_ROOF_WHITE}
      >
        <boxGeometry args={[2.4, 0.05, 1.05]} />
      </mesh>
      {[-0.7, 0.7].map((px) => (
        <mesh
          key={px}
          position={[px, height * 0.45, depth / 2 + 0.55]}
          material={M_METAL_DARK}
        >
          <boxGeometry args={[0.06, height * 0.9, 0.06]} />
        </mesh>
      ))}

      {/* Long terminal roof */}
      <mesh castShadow position={[0, height + 0.08, 0]} material={M_ROOF_WHITE}>
        <boxGeometry args={[length + 1.3, 0.07, depth + 0.85]} />
      </mesh>
      <mesh position={[0, height + 0.12, 0]} material={M_ROOF_RIM}>
        <boxGeometry args={[length + 0.4, 0.03, depth + 0.15]} />
      </mesh>

      {/* Stub tower so the silhouette reads as an airport */}
      <mesh castShadow position={[-length / 2 + 0.15, 1.05, -0.15]} material={M_WHITE_SHELL}>
        <boxGeometry args={[0.55, 1.15, 0.55]} />
      </mesh>
      <mesh position={[-length / 2 + 0.15, 1.42, -0.15]} material={M_TEAL_GLASS}>
        <boxGeometry args={[0.62, 0.28, 0.62]} />
      </mesh>
      <mesh castShadow position={[-length / 2 + 0.15, 1.62, -0.15]} material={M_ROOF_WHITE}>
        <cylinderGeometry args={[0.42, 0.42, 0.06, 8]} />
      </mesh>

      <Aircraft />

      {/* Terminal detail: pink fascia over the glass, rooftop plant */}
      <mesh position={[0, height * 0.82, depth / 2 + 0.05]}>
        <boxGeometry args={[length * 0.86, 0.05, 0.03]} />
        <meshStandardMaterial color={PINK} roughness={0.6} />
      </mesh>
      {[-2.4, -0.5, 1.9].map((rx) => (
        <mesh key={rx} castShadow position={[rx, height + 0.2, -0.3]} material={M_WHITE_SHELL}>
          <boxGeometry args={[0.55, 0.14, 0.4]} />
        </mesh>
      ))}

      {/* Control tower: pink stripes + antenna */}
      {[0.78, 1.0].map((ty) => (
        <mesh key={ty} position={[-length / 2 + 0.15, ty, -0.15]}>
          <boxGeometry args={[0.58, 0.05, 0.58]} />
          <meshStandardMaterial color={PINK} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[-length / 2 + 0.15, 1.9, -0.15]} material={M_METAL_DARK}>
        <cylinderGeometry args={[0.015, 0.015, 0.5, 5]} />
      </mesh>

      {/* Landside kerb for drop-off, behind the terminal */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.045, -depth / 2 - 0.45]}
        material={M_CONCRETE_LIGHT}
        receiveShadow
      >
        <planeGeometry args={[length - 0.4, 0.55]} />
      </mesh>

      {/* Taxi lines on the apron: stand line, lead-in and a connector to the runway */}
      {[
        { p: [3.1, 0.051, 1.55], r: 0.7, s: [3.2, 0.04] },
        { p: [-1.2, 0.051, 2.45], r: 0, s: [2.6, 0.04] },
        { p: [3.9, 0.051, 3.9], r: Math.PI / 2, s: [1.7, 0.04] },
      ].map((l, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, l.r]}
          position={l.p as [number, number, number]}
        >
          <planeGeometry args={l.s as [number, number]} />
          <meshStandardMaterial color={TAXI_LINE} roughness={0.8} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} />
        </mesh>
      ))}

      {/* Second aircraft at the gate + its jet bridge */}
      <Aircraft position={[-1.2, 0.28, 2.45]} rotationY={0} scale={0.82} />
      <group position={[-0.62, 0, 1.75]}>
        <mesh castShadow position={[0, 0.34, 0]} material={M_WHITE_SHELL}>
          <boxGeometry args={[0.16, 0.12, 1.1]} />
        </mesh>
        <mesh castShadow position={[0, 0.34, 0.6]} material={M_ROOF_WHITE}>
          <cylinderGeometry args={[0.14, 0.14, 0.14, 8]} />
        </mesh>
        <mesh position={[0, 0.17, -0.45]} material={M_METAL_DARK}>
          <boxGeometry args={[0.05, 0.34, 0.05]} />
        </mesh>
      </group>

      {/* Short runway beyond the apron, with centre dashes and threshold bars */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[1.3, 0.035, 4.75]}
        material={M_ROAD}
        receiveShadow
      >
        <planeGeometry args={[10.4, 1.15]} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-3.4 + i * 0.85, 0.04, 4.75]}
          material={M_ROAD_STRIPE}
        >
          <planeGeometry args={[0.42, 0.06]} />
        </mesh>
      ))}
      {[-3.85, 6.45].flatMap((bx) =>
        [-0.36, -0.12, 0.12, 0.36].map((bz) => (
          <mesh
            key={`${bx}-${bz}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[bx, 0.04, 4.75 + bz]}
            material={M_ROAD_STRIPE}
          >
            <planeGeometry args={[0.34, 0.06]} />
          </mesh>
        )),
      )}

      {/* Service vehicles on the apron */}
      <mesh castShadow position={[1.0, 0.1, 2.35]}>
        <boxGeometry args={[0.3, 0.12, 0.17]} />
        <meshStandardMaterial color={"#E9C46A"} roughness={0.6} />
      </mesh>
      <mesh castShadow position={[-3.05, 0.1, 2.2]} material={M_WHITE_SHELL}>
        <boxGeometry args={[0.34, 0.14, 0.18]} />
      </mesh>
      <mesh castShadow position={[4.9, 0.11, 2.9]} rotation={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 10]} />
        <meshStandardMaterial color={PINK} roughness={0.6} />
      </mesh>

      {/* Apron floodlight poles */}
      {[
        [-2.7, 3.0],
        [0.9, 3.05],
        [4.7, 3.0],
      ].map(([lx, lz]) => (
        <group key={lx} position={[lx, 0, lz]}>
          <mesh position={[0, 0.34, 0]} material={M_METAL_DARK}>
            <cylinderGeometry args={[0.018, 0.025, 0.68, 6]} />
          </mesh>
          <mesh position={[0, 0.7, 0]} material={M_ROOF_WHITE}>
            <boxGeometry args={[0.16, 0.03, 0.08]} />
          </mesh>
        </group>
      ))}

      {/* A few trees, kept sparse */}
      {[
        [-3.6, 2.2],
        [4.4, -1.6],
        [-2.8, -1.8],
      ].map(([tx, tz], i) => (
        <group key={i} position={[tx, 0, tz]}>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.04, 0.07, 0.44, 5]} />
            <meshStandardMaterial color={COLORS.trunk} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.55, 0]} castShadow>
            <icosahedronGeometry args={[0.28, 0]} />
            <meshStandardMaterial color={COLORS.leavesGreen} roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
