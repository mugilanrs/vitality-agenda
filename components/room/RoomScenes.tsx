"use client";

import FloatingProp, { type PropType } from "./FloatingProp";

const WALL = "#F7F2F0";
const TABLE = "#5c514c";
const CHAIR = "#c4b09a";
const SCREEN = "#D7DEDC";
const PLANT = "#6FA276";
const PINK = "#E99AAE";

function StageLight({ warm = false }: { warm?: boolean }) {
  return (
    <group>
      <ambientLight intensity={0.62} color={warm ? "#fff1e6" : "#f7f1ee"} />
      <directionalLight
        position={[3.2, 6.5, 4.2]}
        intensity={1.15}
        color={warm ? "#fff4ea" : "#fff8f4"}
      />
      <directionalLight position={[-3, 3.5, -1]} intensity={0.28} color={"#e7d4da"} />
    </group>
  );
}

function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.16, 8]} />
        <meshStandardMaterial color={"#E2DDDF"} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <sphereGeometry args={[0.16, 10, 8]} />
        <meshStandardMaterial color={PLANT} roughness={0.85} />
      </mesh>
    </group>
  );
}

function Chair({ position, yaw }: { position: [number, number, number]; yaw: number }) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[0.32, 0.06, 0.32]} />
        <meshStandardMaterial color={CHAIR} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.4, -0.12]} castShadow>
        <boxGeometry args={[0.32, 0.28, 0.06]} />
        <meshStandardMaterial color={CHAIR} roughness={0.7} />
      </mesh>
    </group>
  );
}

export function BoardRoomScene({
  variant,
  sessionId,
}: {
  variant: "morning" | "afternoon";
  sessionId?: string | null;
}) {
  const props: PropType[] =
    variant === "afternoon"
      ? sessionId === "ai-ams"
        ? ["cloud", "nodes", "screen"]
        : ["gcp", "cloud", "database"]
      : sessionId === "qa-ai"
        ? ["code", "screen", "nodes"]
        : sessionId === "ai-maturity"
          ? ["ai", "network", "database"]
          : sessionId === "rapid-build"
            ? ["code", "ai", "screen"]
            : ["ai", "code", "nodes"];
  return (
    <group rotation={[0, variant === "afternoon" ? 0.18 : -0.04, 0]}>
      <StageLight warm={variant === "afternoon"} />
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[7.2, 0.1, 4.6]} />
        <meshStandardMaterial color={"#D9D0CC"} roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.01, 0]}>
        <planeGeometry args={[7.2, 4.6]} />
        <meshStandardMaterial color={"#F3EEEA"} roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.15, -2.2]} receiveShadow>
        <boxGeometry args={[7.2, 2.3, 0.08]} />
        <meshStandardMaterial color={WALL} roughness={0.8} />
      </mesh>
      <mesh position={[-3.55, 1.15, 0]} receiveShadow>
        <boxGeometry args={[0.08, 2.3, 4.6]} />
        <meshStandardMaterial color={"#EEE7EA"} roughness={0.82} />
      </mesh>
      <mesh position={[-3.48, 1.25, 0.4]}>
        <boxGeometry args={[0.04, 0.55, 0.55]} />
        <meshStandardMaterial color={PINK} roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.35, -2.12]}>
        <boxGeometry args={[1.9, 1.05, 0.04]} />
        <meshStandardMaterial color={SCREEN} roughness={0.35} metalness={0.08} />
      </mesh>
      <mesh position={[-0.35, 1.45, -2.08]}>
        <boxGeometry args={[0.7, 0.06, 0.02]} />
        <meshStandardMaterial color={variant === "morning" ? PINK : "#b7c4c8"} />
      </mesh>
      <mesh position={[0.15, 1.28, -2.08]}>
        <boxGeometry args={[0.9, 0.05, 0.02]} />
        <meshStandardMaterial color={variant === "morning" ? "#3a3338" : "#8aa0a6"} />
      </mesh>
      <mesh position={[0, 0.38, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.08, 1.15]} />
        <meshStandardMaterial color={TABLE} roughness={0.55} />
      </mesh>
      {[-1.15, 0, 1.15].map((x) => (
        <Chair key={`n${x}`} position={[x, 0, -0.7]} yaw={0} />
      ))}
      {[-1.15, 0, 1.15].map((x) => (
        <Chair key={`s${x}`} position={[x, 0, 1.0]} yaw={Math.PI} />
      ))}
      <Plant position={[2.6, 0, 1.5]} />
      <FloatingProp type={props[0]} position={[-2.15, 2.05, 1.15]} rotationSpeed={0.18} />
      <FloatingProp type={props[1]} position={[2.15, 2.15, 1.05]} rotationSpeed={0.28} floatAmplitude={0.06} />
      <FloatingProp type={props[2]} position={[0.15, 2.35, 1.55]} rotationSpeed={0.15} floatAmplitude={0.1} />
    </group>
  );
}

export function ODCScene({ sessionId }: { sessionId?: string | null }) {
  const desks = [-1.6, -0.4, 0.8];
  return (
    <group>
      <StageLight />
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[7.4, 0.1, 4.8]} />
        <meshStandardMaterial color={"#D9D0CC"} roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.01, 0]}>
        <planeGeometry args={[7.4, 4.8]} />
        <meshStandardMaterial color={"#F3EEEA"} roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.15, -2.3]}>
        <boxGeometry args={[7.4, 2.3, 0.08]} />
        <meshStandardMaterial color={WALL} roughness={0.82} />
      </mesh>
      <mesh position={[3.65, 1.15, 0]}>
        <boxGeometry args={[0.08, 2.3, 4.8]} />
        <meshStandardMaterial color={"#EEE7EA"} roughness={0.82} />
      </mesh>
      <mesh position={[0, 1.4, -2.22]}>
        <boxGeometry args={[1.6, 0.8, 0.04]} />
        <meshStandardMaterial color={SCREEN} roughness={0.3} />
      </mesh>
      {desks.map((z) =>
        [-1.5, 0.2].map((x) => (
          <group key={`${x}-${z}`} position={[x, 0, z]}>
            <mesh position={[0, 0.36, 0]} castShadow>
              <boxGeometry args={[1.05, 0.05, 0.55]} />
              <meshStandardMaterial color={"#E2DDDF"} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.52, -0.12]}>
              <boxGeometry args={[0.42, 0.26, 0.03]} />
              <meshStandardMaterial color={SCREEN} roughness={0.35} />
            </mesh>
            <mesh position={[0.38, 0.22, 0.15]}>
              <cylinderGeometry args={[0.1, 0.1, 0.08, 8]} />
              <meshStandardMaterial color={"#C9BBC2"} roughness={0.6} />
            </mesh>
            <mesh position={[0.38, 0.42, 0.15]}>
              <sphereGeometry args={[0.09, 8, 6]} />
              <meshStandardMaterial color={"#DED3D8"} roughness={0.7} />
            </mesh>
          </group>
        )),
      )}
      <Plant position={[-2.8, 0, 1.6]} />
      <Plant position={[2.8, 0, -1.4]} />
      <FloatingProp type={sessionId === "odc-wrap" ? "screen" : "network"} position={[-2.5, 2.05, 1.35]} rotationSpeed={0.2} />
      <FloatingProp type={sessionId === "hm-ai-action" ? "ai" : "code"} position={[2.35, 2.15, 1.2]} rotationSpeed={0.16} floatAmplitude={0.07} />
      <FloatingProp type="nodes" position={[0.2, 2.35, 1.7]} rotationSpeed={0.24} />
    </group>
  );
}

function Place({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0.5, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.13, 14]} />
        <meshStandardMaterial color={"#fbfaf8"} roughness={0.3} />
      </mesh>
      <mesh position={[-0.16, 0.06, 0.02]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color={"#e7c9d0"} roughness={0.25} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

export function DiningRoomScene() {
  const seats = [-1.35, -0.45, 0.45, 1.35];
  const skyline = [
    [-2.4, 0.7],
    [-1.55, 1.05],
    [-0.7, 0.62],
    [0.15, 1.2],
    [1.05, 0.78],
    [1.9, 0.95],
    [2.6, 0.55],
  ] as const;
  return (
    <group>
      <StageLight warm />
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[7.4, 0.1, 4.8]} />
        <meshStandardMaterial color={"#CDB9A4"} roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.01, 0]}>
        <planeGeometry args={[7.4, 4.8]} />
        <meshStandardMaterial color={"#E4D6C8"} roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0.15]}>
        <planeGeometry args={[4.6, 2.6]} />
        <meshStandardMaterial color={"#efe6dc"} roughness={0.95} />
      </mesh>
      <mesh position={[-3.55, 1.2, 0]}>
        <boxGeometry args={[0.08, 2.4, 4.8]} />
        <meshStandardMaterial color={"#E7DDD6"} roughness={0.82} />
      </mesh>
      <mesh position={[-3.48, 1.35, -0.2]}>
        <boxGeometry args={[0.03, 0.9, 1.5]} />
        <meshStandardMaterial color={"#C98A5A"} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.55, -2.28]}>
        <planeGeometry args={[6.6, 0.7]} />
        <meshBasicMaterial color={"#d7c4c8"} />
      </mesh>
      <mesh position={[0, 0.85, -2.27]}>
        <planeGeometry args={[6.6, 0.7]} />
        <meshBasicMaterial color={"#e7d3c4"} />
      </mesh>
      {skyline.map(([x, h], i) => (
        <mesh key={i} position={[x, 0.35 + h / 2, -2.24]}>
          <boxGeometry args={[0.38, h, 0.04]} />
          <meshStandardMaterial color={i % 2 ? "#8a7d84" : "#6e656c"} roughness={0.8} />
        </mesh>
      ))}
      {[-2.2, -0.7, 0.8, 2.2].map((x) => (
        <mesh key={x} position={[x, 1.2, -2.22]}>
          <boxGeometry args={[0.035, 2.15, 0.02]} />
          <meshStandardMaterial color={"#C9BBC2"} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.42, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.1, 1.35]} />
        <meshStandardMaterial color={"#6b5348"} roughness={0.48} />
      </mesh>
      <mesh position={[0, 0.48, 0.15]}>
        <boxGeometry args={[3.4, 0.015, 0.28]} />
        <meshStandardMaterial color={"#efe6dc"} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.58, 0.15]}>
        <boxGeometry args={[0.42, 0.12, 0.28]} />
        <meshStandardMaterial color={"#3f3338"} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.74, 0.15]}>
        <sphereGeometry args={[0.14, 10, 8]} />
        <meshStandardMaterial color={PLANT} roughness={0.85} />
      </mesh>
      {seats.map((x) => (
        <group key={x}>
          <Place x={x} z={-0.22} />
          <Place x={x} z={0.52} />
          <Chair position={[x, 0, -0.85]} yaw={0} />
          <Chair position={[x, 0, 1.15]} yaw={Math.PI} />
        </group>
      ))}
      <Plant position={[2.85, 0, 1.55]} />
      <FloatingProp type="ai" position={[-2.15, 2.15, 1.35]} rotationSpeed={0.16} floatAmplitude={0.06} />
      <FloatingProp type="screen" position={[2.2, 2.25, 1.15]} rotationSpeed={0.2} />
    </group>
  );
}
