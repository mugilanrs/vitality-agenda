"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

export type PropType =
  | "ai"
  | "code"
  | "cloud"
  | "nodes"
  | "screen"
  | "database"
  | "gcp"
  | "network";

type Props = {
  type: PropType;
  position: [number, number, number];
  rotationSpeed?: number;
  floatAmplitude?: number;
};

const PINK = "#E99AAE";
const INK = "#3a3338";
const GLASS = "#D7DEDC";
const TAUPE = "#C9BBC2";

function Shape({ type }: { type: PropType }) {
  if (type === "ai") {
    return (
      <group>
        <mesh>
          <boxGeometry args={[0.42, 0.42, 0.08]} />
          <meshStandardMaterial color={PINK} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[0.16, 0.16, 0.04]} />
          <meshStandardMaterial color={"#fff8f6"} roughness={0.4} />
        </mesh>
      </group>
    );
  }
  if (type === "code") {
    return (
      <group>
        <mesh position={[-0.16, 0, 0]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.08, 0.36, 0.06]} />
          <meshStandardMaterial color={INK} roughness={0.5} />
        </mesh>
        <mesh position={[0.16, 0, 0]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.08, 0.36, 0.06]} />
          <meshStandardMaterial color={INK} roughness={0.5} />
        </mesh>
      </group>
    );
  }
  if (type === "cloud") {
    return (
      <group>
        <mesh position={[-0.1, 0, 0]}>
          <sphereGeometry args={[0.16, 12, 10]} />
          <meshStandardMaterial color={"#f7f3f1"} roughness={0.6} />
        </mesh>
        <mesh position={[0.12, 0.04, 0]}>
          <sphereGeometry args={[0.2, 12, 10]} />
          <meshStandardMaterial color={"#f7f3f1"} roughness={0.6} />
        </mesh>
        <mesh position={[0.02, -0.06, 0]}>
          <sphereGeometry args={[0.14, 12, 10]} />
          <meshStandardMaterial color={GLASS} roughness={0.55} />
        </mesh>
      </group>
    );
  }
  if (type === "nodes") {
    return (
      <group>
        {[
          [-0.16, 0.1, 0],
          [0.16, 0.1, 0],
          [0, -0.14, 0],
        ].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]}>
            <sphereGeometry args={[0.07, 10, 8]} />
            <meshStandardMaterial color={i === 2 ? PINK : TAUPE} roughness={0.45} />
          </mesh>
        ))}
      </group>
    );
  }
  if (type === "screen") {
    return (
      <group>
        <mesh>
          <boxGeometry args={[0.46, 0.3, 0.04]} />
          <meshStandardMaterial color={GLASS} roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.06, 0.12, 0.04]} />
          <meshStandardMaterial color={TAUPE} roughness={0.6} />
        </mesh>
      </group>
    );
  }
  if (type === "database") {
    return (
      <mesh>
        <cylinderGeometry args={[0.16, 0.16, 0.28, 12]} />
        <meshStandardMaterial color={TAUPE} roughness={0.5} />
      </mesh>
    );
  }
  if (type === "gcp") {
    return (
      <mesh rotation={[0.4, 0.3, 0]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color={"#D7DEDC"} roughness={0.35} />
      </mesh>
    );
  }
  return (
    <group>
      <mesh position={[-0.12, 0, 0]}>
        <sphereGeometry args={[0.08, 10, 8]} />
        <meshStandardMaterial color={PINK} roughness={0.5} />
      </mesh>
      <mesh position={[0.12, 0.06, 0]}>
        <sphereGeometry args={[0.08, 10, 8]} />
        <meshStandardMaterial color={TAUPE} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.28, 0.03, 0.03]} />
        <meshStandardMaterial color={INK} roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function FloatingProp({
  type,
  position,
  rotationSpeed = 0.22,
  floatAmplitude = 0.08,
}: Props) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.rotation.y = t * rotationSpeed;
    g.position.y = position[1] + Math.sin(t * 0.7) * floatAmplitude;
  });
  return (
    <group ref={ref} position={position} scale={1.35}>
      <Shape type={type} />
    </group>
  );
}
