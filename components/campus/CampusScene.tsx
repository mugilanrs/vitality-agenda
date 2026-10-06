"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { SoftShadows } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import CampusCamera from "./CampusCamera";
import CampusArchitecture from "./CampusArchitecture";
import FishermanCove from "./FishermanCove";
import AirportDestination from "./AirportDestination";
import JourneyRoutes from "./JourneyRoutes";
import CarTraffic from "./CarTraffic";
import CampusHotspots from "./CampusHotspots";
import SpatialFocus from "./SpatialFocus";
import SpatialTiles from "./SpatialTiles";
import EB3Cutaway from "./EB3Cutaway";
import { detectQuality, type QualitySettings } from "@/lib/quality";
import { journey, subscribeJourney } from "@/lib/journey";
import { useThemedMaterials } from "@/lib/themedMaterials";

/**
 * Depth haze: the campus sits in the clear, the surroundings fade into mist.
 * Distances are view-space (orthographic), measured from the camera.
 */
const FOG_NEAR = 26;
const FOG_FAR = 52;

/** Keeps `scene.fog` + the GL clear colour in sync with the current theme. */
function SkyTone({ colorHex }: { colorHex: number }) {
  const { scene, gl } = useThree();
  useEffect(() => {
    const col = new THREE.Color(colorHex);
    scene.fog = new THREE.Fog(colorHex, FOG_NEAR, FOG_FAR);
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

  const skyColorHex = 0xd0e4ef;
  const styleBg = useMemo(
    () => ({
      background: "linear-gradient(180deg, #e3f0f7 0%, #d0e4ef 55%, #bcd6e6 100%)",
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
          toneMappingExposure: 1.25,
        }}
        style={styleBg}
        onCreated={({ scene, gl }) => {
          scene.fog = new THREE.Fog(skyColorHex, FOG_NEAR, FOG_FAR);
          gl.setClearColor(new THREE.Color(skyColorHex), 1);
        }}
      >
        {useSoftShadows && (
          <SoftShadows size={12} samples={10} focus={0.85} />
        )}

        <ambientLight intensity={0.4} color={"#e9eef2"} />
        <hemisphereLight args={[0xe6f0f8, 0x9fb0a0, 0.45]} />

        <directionalLight
          position={[14, 24, 8]}
          intensity={1.35}
          color={"#fff3e0"}
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
            <CarTraffic />
            <FishermanCove />
            <AirportDestination />

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
