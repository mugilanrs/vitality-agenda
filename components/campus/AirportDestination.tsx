"use client";

import { AIRPORT_POSITION } from "@/data/externalDestinations";
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
 * Compact airport terminal south of the campus. Silhouette first:
 * a long roof, a glass front, a stub control tower, and one aircraft.
 */

function Aircraft() {
  return (
    <group position={[3.15, 0.28, 1.55]} rotation={[0, 0.7, 0]}>
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.4, 0.02, 0.3]} material={M_GRASS} receiveShadow>
        <circleGeometry args={[5.1, 36]} />
      </mesh>

      {/* Apron */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[1.4, 0.03, 0.7]}
        material={M_CONCRETE_LIGHT}
        receiveShadow
      >
        <planeGeometry args={[length + 2.4, depth + 2.6]} />
      </mesh>

      {/* Access road toward the campus (−Z) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.035, -depth / 2 - 2.1]}
        material={M_CONCRETE_LIGHT}
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
