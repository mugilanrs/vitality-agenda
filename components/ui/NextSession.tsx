"use client";

import { getAgendaRooms } from "@/lib/agendaStore";
import { nextUp } from "@/lib/schedule";
import { getStops, goToStop, roomLabel } from "@/lib/stops";
import { setActiveSession } from "@/lib/journey";
import { useNow } from "@/lib/useNow";

/**
 * Small card under the Sign out button: the attendee's first session until it
 * starts, then "Now" while a session runs, then the next one, then "done".
 */
export default function NextSession() {
  const now = useNow(15_000);
  if (now == null) return null;
  const up = nextUp(getAgendaRooms(), now);
  if (!up) return null;

  const heading =
    up.kind === "first" ? "First session" : up.kind === "now" ? "Happening now" : up.kind === "next" ? "Up next" : "Your day";

  if (up.kind === "done") {
    return (
      <Card heading={heading}>
        <div className="text-[13px] font-bold" style={{ color: "#182033" }}>
          All done for today. Thank you!
        </div>
      </Card>
    );
  }

  const { session, room } = up.item;
  const open = () => {
    const stops = getStops();
    const i = stops.findIndex((s) => s.sessionIds?.includes(session.id));
    if (i < 0) return;
    setActiveSession(session.id);
    goToStop(i);
    setActiveSession(session.id);
  };

  return (
    <Card heading={heading} onClick={open}>
      <div className="text-[13px] font-bold leading-tight" style={{ color: "#182033" }}>
        {session.title}
      </div>
      <div className="mt-1 text-[11.5px] font-semibold tabular-nums" style={{ color: "#B0124F" }}>
        {session.time.replace("—", "–")}
      </div>
      <div className="text-[11.5px]" style={{ color: "#4A3A44" }}>
        {roomLabel(room)}
      </div>
    </Card>
  );
}

function Card({
  heading,
  onClick,
  children,
}: {
  heading: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className="pointer-events-auto mt-2 block w-[min(15rem,calc(100vw-7rem))] rounded-2xl border px-3 py-2 text-left"
      style={{
        background: "rgba(255,255,255,.88)",
        borderColor: "rgba(33,26,35,.12)",
        boxShadow: "0 6px 18px rgba(33,26,35,.12)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="text-[10px] font-extrabold uppercase tracking-[0.18em]" style={{ color: "#D81B60" }}>
        {heading}
      </div>
      <div className="mt-0.5">{children}</div>
    </Tag>
  );
}
