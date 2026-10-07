"use client";

import { useEffect, useState } from "react";
import { BUILDINGS, type BuildingSpec } from "@/data/buildings";
import type { AgendaRoom } from "@/data/agendaRooms";
import { agendaRoomByFocus, eb3RoomChoices, getArrivals } from "@/lib/agendaStore";
import {
  journey,
  subscribeJourney,
  openRoom,
  enterRoom,
  focusBack,
  setFocus,
  setActiveSession,
} from "@/lib/journey";
import IsoRoom from "@/components/room/IsoRoom";
import StopNav from "@/components/ui/StopNav";

/**
 * Agenda overlay — ported to the legacy site's pink callout language.
 *
 * Theme tokens drive everything (`--pink`, `--soft`, `--card`, `--ink`,
 * `--muted`, `--shadow`), so light / dark mode come along for free.
 *
 * States (from journey.focus.level):
 *   campus   — nothing rendered; the in-scene hotspots carry discovery.
 *   building — not reached (vital-visit's two interactive buildings skip it).
 *   floor    — floor picker card.
 *   room     — the single-session callout with "Enter the building ↵".
 *   inside   — a slim "You are inside …" pill with a leave button.
 */
export default function AgendaOverlay() {
  const [focus, setFocusState] = useState(() => ({ ...journey.focus }));
  const [welcome, setWelcomeState] = useState(journey.welcome);
  const [sessionId, setSessionId] = useState(journey.sessionId);

  useEffect(() => {
    const unsubFocus = subscribeJourney(
      () => setFocusState({ ...journey.focus }),
      "focus",
    );
    const unsubWelcome = subscribeJourney(
      () => setWelcomeState(journey.welcome),
      "welcome",
    );
    const unsubSession = subscribeJourney(
      () => setSessionId(journey.sessionId),
      "session",
    );
    return () => {
      unsubFocus();
      unsubWelcome();
      unsubSession();
    };
  }, []);

  if (welcome) return null;

  const building = focus.building != null ? BUILDINGS[focus.building] : null;
  const floor =
    building && focus.floor != null
      ? building.floors.find((f) => f.index === focus.floor) ?? null
      : null;
  const room =
    floor && focus.roomId
      ? floor.rooms.find((r) => r.id === focus.roomId)
      : null;

  if (focus.level === "campus") return null;

  const insideSignatureRoom =
    focus.level === "room" && building?.directEntry === true;
  const chapter =
    focus.level === "inside"
      ? agendaRoomByFocus(focus.building, focus.floor, focus.roomId)
      : undefined;

  if (chapter) {
    return <IsoRoom room={chapter} sessionId={sessionId} />;
  }

  if (focus.level === "building" && building?.id === "eb3") {
    return <Eb3Chooser />;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {focus.level === "building" && building?.external && <StopNav />}
      <div
        className="pointer-events-none absolute inset-x-0 flex justify-center"
        style={{
          top: "calc(max(1.5rem, env(safe-area-inset-top)) + 0.5rem)",
        }}
      >
        <BreadCrumb
          focusLevel={focus.level}
          building={building}
          floor={floor}
          chapter={agendaRoomByFocus(focus.building, focus.floor, focus.roomId)}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 flex justify-center px-4"
        style={{
          bottom: "calc(max(1.5rem, env(safe-area-inset-bottom)) + 0.75rem)",
        }}
      >
        {focus.level === "building" && building?.external && (
          <DestinationCard building={building} />
        )}
        {focus.level === "floor" && building && floor && (
          <FloorCard building={building} floor={floor} />
        )}
        {focus.level === "room" &&
          building &&
          floor &&
          room &&
          !insideSignatureRoom && (
            <RoomCallout
              buildingName={building.name}
              buildingSubtitle={building.subtitle}
              floorLabel={floor.label}
              room={room}
            />
          )}
        {focus.level === "inside" && !agendaRoomByFocus(focus.building, focus.floor, focus.roomId) && building && floor && room && (
          <InsideBar
            buildingName={building.name}
            floorLabel={floor.label}
            roomName={room.name}
          />
        )}
      </div>
    </div>
  );
}

// ---------------- Cards ----------------

function DestinationCard({ building }: { building: BuildingSpec }) {
  const info = building.external;
  if (!info) return null;
  return (
    <CalloutShell>
      <Chip>{building.name}</Chip>
      <h2
        className="font-display mt-2 text-[22px] font-extrabold leading-[1.06] tracking-[-0.02em]"
        style={{ color: "var(--ink)" }}
      >
        {info.title}
      </h2>
      {info.time && (
        <div
          className="mt-1.5 text-[13px] font-bold font-mono tabular-nums"
          style={{ color: "var(--deep)" }}
        >
          {info.time}
        </div>
      )}
      {info.host && (
        <div
          className="mt-2.5 text-[14px] leading-[1.55]"
          style={{ color: "var(--ink)", opacity: 0.9 }}
        >
          {info.host}
        </div>
      )}
      {info.perAttendee && (
        <div className="mt-3 max-h-[34vh] overflow-y-auto">
          {getArrivals().map((g, i) => (
            <DetailGrid key={g.who ?? i} title={g.who} rows={g.rows} />
          ))}
        </div>
      )}
      {info.details && info.details.length > 0 && (
        <div className="mt-3 max-h-[34vh] overflow-y-auto">
          <DetailGrid rows={info.details} />
        </div>
      )}
      <div className="mt-3 flex items-center gap-2.5">
        <button
          type="button"
          onClick={focusBack}
          className="pointer-events-auto rounded-full border px-3.5 py-1.5 text-xs font-bold"
          style={{
            borderColor: "var(--line-strong)",
            color: "var(--ink)",
          }}
        >
          ← Back
        </button>
      </div>
    </CalloutShell>
  );
}

function DetailGrid({
  title,
  rows,
}: {
  title?: string;
  rows: { label: string; value: string; href?: string }[];
}) {
  return (
    <section className="border-t pt-3 first:border-t-0 [&:not(:first-child)]:mt-3" style={{ borderColor: "var(--line)" }}>
      {title && (
        <h3 className="mb-2 text-[13px] font-extrabold" style={{ color: "var(--deep)" }}>
          {title}
        </h3>
      )}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        {rows.map((d) => (
          <div key={d.label} className="min-w-0">
            <dt
              className="text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: "var(--muted)" }}
            >
              {d.label}
            </dt>
            <dd
              className="mt-0.5 text-[13px] font-semibold leading-snug"
              style={{ color: "var(--ink)" }}
            >
              {d.href ? (
                <a href={d.href} className="pointer-events-auto underline">
                  {d.value}
                </a>
              ) : (
                d.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function roomSpan(room: AgendaRoom) {
  const start = room.sessions[0]?.time.split("—")[0]?.trim() ?? "";
  const end = room.sessions[room.sessions.length - 1]?.time.split("—")[1]?.trim() ?? "";
  return `${start} – ${end}`;
}

function Eb3Chooser() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(243,240,239,0.55)" }}
      />
      <button
        type="button"
        className="pointer-events-auto absolute left-4 top-4 rounded-full border px-3.5 py-2 text-[12px] font-bold"
        style={{ background: "rgba(255,255,255,.92)", borderColor: "rgba(33,26,35,.12)", color: "#211A23" }}
        onClick={() => setFocus({ level: "campus" })}
      >
        ← Back to map
      </button>
      <div className="absolute left-4 top-16 sm:left-8 sm:top-[4.5rem]">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: "#E58FA5" }}>
          EB3
        </p>
        <h1 className="font-display mt-1 text-2xl font-extrabold tracking-[-0.02em]" style={{ color: "#211A23" }}>
          Choose a room
        </h1>
      </div>
      <div
        className="pointer-events-auto absolute inset-x-0 flex justify-center px-4"
        style={{ bottom: "6vh" }}
      >
        <div className="flex w-[min(96vw,880px)] flex-col gap-3 sm:flex-row">
          {eb3RoomChoices().map((room) => (
            <button
              key={room.id}
              type="button"
              data-room-choice={room.id}
              onClick={() => {
                setActiveSession(room.sessions[0]?.id ?? null);
                setFocus({
                  level: "inside",
                  building: room.buildingId,
                  floor: room.floor,
                  roomId: room.roomId,
                });
              }}
              className="flex-1 rounded-[18px] border px-3.5 py-3 text-left focus:outline-none"
              style={{
                background: "rgba(255,255,255,0.94)",
                borderColor: "rgba(33,26,35,0.08)",
                boxShadow: "0 10px 28px rgba(33,26,35,0.08)",
              }}
            >
              <RoomThumb type={room.type} />
              <div className="mt-2 text-[12px] font-extrabold uppercase tracking-[0.08em]" style={{ color: "#211A23" }}>
                {room.name}
              </div>
              <div className="mt-1 text-[12px] font-bold tabular-nums" style={{ color: "#E58FA5" }}>
                {room.type === "odc"
                  ? room.sessions.map((s) => s.time.replace("—", "–")).join("  ·  ")
                  : roomSpan(room)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoomThumb({ type }: { type: AgendaRoom["type"] }) {
  if (type === "odc") {
    return (
      <svg viewBox="0 0 220 92" className="h-[72px] w-full" aria-hidden>
        <polygon points="18,70 110,86 202,70 110,54" fill="#DDD6D8" />
        <polygon points="18,28 110,44 110,86 18,70" fill="#F0E8EB" />
        <polygon points="110,44 202,28 202,70 110,86" fill="#E1D5DA" />
        <rect x="78" y="22" width="44" height="16" fill="#D7E0DD" />
        <rect x="46" y="58" width="28" height="8" fill="#F7F4F2" />
        <rect x="86" y="62" width="28" height="8" fill="#F7F4F2" />
        <rect x="126" y="58" width="28" height="8" fill="#F7F4F2" />
        <rect x="52" y="50" width="12" height="8" fill="#D7E0DD" />
        <rect x="92" y="54" width="12" height="8" fill="#D7E0DD" />
        <rect x="132" y="50" width="12" height="8" fill="#D7E0DD" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 220 92" className="h-[72px] w-full" aria-hidden>
      <polygon points="18,70 110,86 202,70 110,54" fill="#DDD6D8" />
      <polygon points="18,28 110,44 110,86 18,70" fill="#F0E8EB" />
      <polygon points="110,44 202,28 202,70 110,86" fill="#E1D5DA" />
      <rect x="86" y="20" width="36" height="14" fill="#D7E0DD" />
      <polygon points="70,60 150,60 158,68 62,68" fill="#75636A" />
      <rect x="64" y="54" width="10" height="8" fill="#9B898F" />
      <rect x="146" y="54" width="10" height="8" fill="#9B898F" />
      <rect x="92" y="52" width="10" height="8" fill="#9B898F" />
      <rect x="118" y="52" width="10" height="8" fill="#9B898F" />
    </svg>
  );
}

function FloorCard({
  building,
  floor,
}: {
  building: BuildingSpec;
  floor: (typeof building.floors)[number];
}) {
  return (
    <CalloutShell>
      <div className="flex items-center gap-2.5">
        <Chip>{building.name}</Chip>
        <Place>{floor.label}</Place>
      </div>
      <h2 className="font-display mt-2 text-[22px] font-extrabold leading-[1.06] tracking-[-0.02em]"
          style={{ color: "var(--ink)" }}>
        {floor.name}
      </h2>
      <div className="mt-4 flex flex-col gap-2">
        {floor.rooms.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => openRoom(r.id)}
            className="group pointer-events-auto flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all hover:-translate-y-0.5 focus:outline-none"
            style={{
              background: "var(--soft)",
              borderColor: "var(--line)",
              color: "var(--ink)",
            }}
          >
            <div>
              <div
                className="text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "var(--muted)" }}
              >
                {r.time} · {r.host}
              </div>
              <div className="mt-0.5 text-sm font-semibold">{r.name}</div>
            </div>
            <span
              className="text-xs font-bold uppercase tracking-[0.18em] transition-transform group-hover:translate-x-1"
              style={{ color: "var(--deep)" }}
            >
              Open →
            </span>
          </button>
        ))}
      </div>
    </CalloutShell>
  );
}

function RoomCallout({
  buildingName,
  buildingSubtitle,
  floorLabel,
  room,
}: {
  buildingName: string;
  buildingSubtitle: string;
  floorLabel: string;
  room: {
    name: string;
    session: string;
    host: string;
    time: string;
    capacity: string;
  };
}) {
  return (
    <CalloutShell>
      <div className="flex items-center gap-2.5">
        <Chip>{buildingName}</Chip>
        <Place>{floorLabel}</Place>
      </div>
      <h2
        className="font-display mt-2 text-[22px] font-extrabold leading-[1.06] tracking-[-0.02em]"
        style={{ color: "var(--ink)" }}
      >
        {room.session}
      </h2>
      <div
        className="mt-1.5 text-[13px] font-bold font-mono tabular-nums"
        style={{ color: "var(--deep)" }}
      >
        {room.time}
      </div>
      <p
        className="mt-2.5 text-[14px] leading-[1.55]"
        style={{ color: "var(--ink)", opacity: 0.9 }}
      >
        {room.name} · {buildingSubtitle}. {room.capacity}.
      </p>
      <div
        className="mt-3 border-t pt-2.5 text-[12.5px]"
        style={{ borderColor: "var(--line)", color: "var(--muted)" }}
      >
        Hosted by <b style={{ color: "var(--ink)" }}>{room.host}</b>
      </div>

      <button
        type="button"
        onClick={enterRoom}
        className="pointer-events-auto mt-3 block w-full rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:brightness-105 focus:outline-none"
        style={{ background: "var(--pink)" }}
      >
        Enter the building →
      </button>

      <div className="mt-3 flex items-center gap-2.5">
        <button
          type="button"
          onClick={focusBack}
          className="pointer-events-auto rounded-full border px-3.5 py-1.5 text-xs font-bold"
          style={{
            borderColor: "var(--line-strong)",
            color: "var(--ink)",
          }}
        >
          ← Back
        </button>
      </div>
    </CalloutShell>
  );
}

function InsideBar({
  buildingName,
  floorLabel,
  roomName,
}: {
  buildingName: string;
  floorLabel: string;
  roomName: string;
}) {
  return (
    <div
      className="pointer-events-auto flex items-center gap-4 rounded-full border px-5 py-2.5"
      style={{
        background: "var(--card)",
        borderColor: "var(--line)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div>
        <div
          className="text-[10px] font-bold uppercase tracking-[0.22em]"
          style={{ color: "var(--pink)" }}
        >
          {buildingName} · {floorLabel}
        </div>
        <div
          className="text-[13px] font-semibold"
          style={{ color: "var(--ink)" }}
        >
          {roomName}
        </div>
      </div>
      <button
        type="button"
        onClick={focusBack}
        className="rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors"
        style={{
          borderColor: "var(--line-strong)",
          color: "var(--ink)",
        }}
      >
        ← Leave room
      </button>
    </div>
  );
}

// ---------------- Shared bits ----------------

function CalloutShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="pointer-events-auto relative w-[min(94vw,420px)] rounded-[18px] border px-5 py-4"
      style={{
        background: "var(--card)",
        borderColor: "var(--line)",
        boxShadow: "var(--shadow)",
      }}
    >
      <span
        className="absolute left-1/2 top-[-9px] block h-[18px] w-[18px] -translate-x-1/2 rotate-45 rounded-[3px] border-l border-t"
        style={{ background: "var(--card)", borderColor: "var(--line)" }}
      />
      {children}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-display rounded-full px-3 py-1 text-xs font-extrabold text-white"
      style={{ background: "var(--pink)" }}
    >
      {children}
    </span>
  );
}

function Place({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[11px] font-bold uppercase tracking-[0.16em]"
      style={{ color: "var(--muted)" }}
    >
      {children}
    </span>
  );
}

// ---------------- Top breadcrumb ----------------

type CrumbProps = {
  focusLevel: string;
  building: BuildingSpec | null;
  floor: { label: string } | null;
  chapter?: AgendaRoom;
};

function BreadCrumb({ focusLevel, building, floor, chapter }: CrumbProps) {
  if (focusLevel === "campus") return null;
  if (chapter && focusLevel === "inside") {
    return (
      <div
        className="pointer-events-auto flex items-center gap-2 rounded-full border px-4 py-1.5"
        style={{ background: "var(--card)", borderColor: "var(--line)", boxShadow: "var(--shadow)" }}
      >
        <button
          type="button"
          onClick={() => setFocus({ level: "campus" })}
          className="text-[11px] font-bold uppercase tracking-[0.2em]"
          style={{ color: "var(--muted)" }}
        >
          Campus
        </button>
        <span className="text-[10px]" style={{ color: "var(--muted)" }}>/</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--ink)" }}>
          {chapter.name}
        </span>
      </div>
    );
  }

  const external = building?.external != null;
  const bits: { label: string; onClick: () => void; muted?: boolean }[] = [
    {
      label: external ? "Journey" : "Campus",
      onClick: () => setFocus({ level: "campus" }),
      muted: true,
    },
  ];
  if (building) {
    bits.push({
      label: building.name,
      onClick: () => setFocus({ level: "building", building: building.id }),
      muted: focusLevel !== "building",
    });
  }
  if (floor && building && !external) {
    bits.push({
      label: floor.label,
      onClick: () =>
        setFocus({
          level: "floor",
          building: building.id,
          floor: building.floors.find((f) => f.label === floor.label)?.index,
        }),
      muted: focusLevel !== "floor",
    });
  }

  return (
    <div
      className="pointer-events-auto flex items-center gap-2 rounded-full border px-4 py-1.5"
      style={{
        background: "var(--card)",
        borderColor: "var(--line)",
        boxShadow: "var(--shadow)",
      }}
    >
      {bits.map((b, i) => (
        <div key={i} className="flex items-center gap-2">
          <button
            type="button"
            onClick={b.onClick}
            className="text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
            style={{
              color: b.muted ? "var(--muted)" : "var(--ink)",
            }}
          >
            {b.label}
          </button>
          {i < bits.length - 1 && (
            <span className="text-[10px]" style={{ color: "var(--muted)" }}>
              /
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
