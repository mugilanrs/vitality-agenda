"use client";

import { useEffect, useState } from "react";
import { INTERIOR_ORIGINS, type InteriorKey } from "@/data/buildings";
import { agendaRoomByFocus } from "@/lib/agendaStore";
import { journey, subscribeJourney } from "@/lib/journey";
import { BoardRoomScene, DiningRoomScene, ODCScene } from "./RoomScenes";

function Stage({ interiorKey }: { interiorKey: InteriorKey }) {
  const [sessionId, setSessionId] = useState(journey.sessionId);
  useEffect(() => subscribeJourney(() => setSessionId(journey.sessionId), "session"), []);

  const [buildingId, floorStr, roomId] = interiorKey.split("::");
  const chapter = agendaRoomByFocus(buildingId, Number(floorStr), roomId);
  const origin = INTERIOR_ORIGINS[interiorKey];
  if (!chapter) return null;

  const variant = chapter.variant ?? (sessionId === "odc-wrap" ? "afternoon" : "morning");

  return (
    <group position={[origin[0], 0, origin[2]]}>
      {chapter.type === "boardroom" && (
        <BoardRoomScene
          variant={variant === "afternoon" ? "afternoon" : "morning"}
          sessionId={sessionId}
        />
      )}
      {chapter.type === "odc" && <ODCScene sessionId={sessionId} />}
      {chapter.type === "dining" && <DiningRoomScene />}
    </group>
  );
}

export function ActiveInterior() {
  const [focus, setFocus] = useState(journey.focus);
  useEffect(() => subscribeJourney(() => setFocus({ ...journey.focus }), "focus"), []);
  if (focus.level !== "inside" || !focus.building || focus.floor == null || !focus.roomId) {
    return null;
  }
  const key = `${focus.building}::${focus.floor}::${focus.roomId}` as InteriorKey;
  if (!(key in INTERIOR_ORIGINS)) return null;
  return <Stage interiorKey={key} />;
}
