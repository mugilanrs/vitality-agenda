"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, SoftShadows } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import CampusCamera from "./CampusCamera";
import CampusArchitecture from "./CampusArchitecture";
import FishermanCove from "./FishermanCove";
import AirportDestination from "./AirportDestination";
import JourneyRoutes from "./JourneyRoutes";
import CampusHotspots from "./CampusHotspots";
import SpatialFocus from "./SpatialFocus";
import SpatialTiles from "./SpatialTiles";
import EB3Cutaway from "./EB3Cutaway";
import { detectQuality, type QualitySettings } from "@/lib/quality";
import { journey, subscribeJourney } from "@/lib/journey";
import { useThemedMaterials } from "@/lib/themedMaterials";

/** Keeps `scene.fog` + the GL clear colour in sync with the current theme. */
function SkyTone({ colorHex }: { colorHex: number }) {
  const { scene, gl } = useThree();
  useEffect(() => {
    const col = new THREE.Color(colorHex);
    scene.fog = new THREE.Fog(colorHex, 120, 240);
    gl.setClearColor(col, 1);
  }, [colorHex, scene, gl]);
  return null;
}

/**
 * Premium architectural daylight (Phase 3 baseline; Phase 6 tuning; Phase 7
 * adds interior room rendering).
 *
 * The scene renders one of two "stages":
 *   - Campus stage: architecture + hotspots + spatial focus
 *   - Interior stage: a mini board-room scene at an off-campus origin
 *
 * The stage is chosen by `journey.focus.level`. The campus stage is always
 * rendered so re-entry is instant; the interior is mounted only while
 * `level === "inside"`.
 */
export default function CampusScene() {
  const [quality, setQuality] = useState<QualitySettings>(() => detectQuality());
  const [inside, setInside] = useState(journey.focus.level === "inside");

  useThemedMaterials();

  useEffect(() => {
    const on = () => setQuality(detectQuality());
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  // React to focus stack change to toggle interior mount.
  useEffect(() => {
    return subscribeJourney(
      () => setInside(journey.focus.level === "inside"),
      "focus",
    );
  }, []);

  const useSoftShadows = quality.softShadows;
  const shadowMap = quality.shadowMap;

  const skyColorHex = 0xf0eceb;
  const styleBg = useMemo(
    () => ({
      background: "linear-gradient(180deg, #f4f1ef 0%, #f0eceb 55%, #e8e4e3 100%)",
    }),
    [],
  );

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={quality.dpr}
        shadows
        gl={{
          antialias: quality.tier !== "low",
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.82,
        }}
        style={styleBg}
        onCreated={({ scene, gl }) => {
          scene.fog = new THREE.Fog(skyColorHex, 120, 240);
          gl.setClearColor(new THREE.Color(skyColorHex), 1);
        }}
      >
        {useSoftShadows && (
          <SoftShadows size={12} samples={10} focus={0.85} />
        )}

        <ambientLight intensity={0.24} color={"#efe6e2"} />
        <hemisphereLight args={[0xf3eee9, 0xb7aaa4, 0.38]} />

        <directionalLight
          position={[14, 24, 8]}
          intensity={0.92}
          color={"#fff6f2"}
          castShadow
          shadow-mapSize-width={shadowMap}
          shadow-mapSize-height={shadowMap}
          shadow-camera-left={-36}
          shadow-camera-right={36}
          shadow-camera-top={36}
          shadow-camera-bottom={-36}
          shadow-camera-near={0.5}
          shadow-camera-far={68}
          shadow-bias={-0.0005}
          shadow-normalBias={0.02}
        />
        <directionalLight
          position={[-10, 10, -6]}
          intensity={0.12}
          color={"#efe6e4"}
        />

        <SkyTone colorHex={skyColorHex} />
        <CampusCamera />

        <Suspense fallback={null}>
          {/* Campus stage — hidden while the user is inside a room */}
          <group visible={!inside}>
            <CampusArchitecture />
            <JourneyRoutes />
            <FishermanCove />
            <AirportDestination />

            <ContactShadows
              position={[0, 0.02, 0]}
              opacity={0.5}
              scale={48}
              blur={2.4}
              far={5}
              resolution={quality.contactShadowsRes}
              color={"#d8c8ce"}
            />

            <SpatialFocus />
            <CampusHotspots />
            <SpatialTiles />
            <EB3Cutaway />
          </group>

        </Suspense>
      </Canvas>
    </div>
  );
}
