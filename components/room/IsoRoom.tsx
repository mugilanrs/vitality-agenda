"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AgendaRoom, SessionProp } from "@/data/agendaRooms";
import { setActiveSession, setFocus } from "@/lib/journey";

const S = 34;
const Ex = 0.866 * S;
const Ey = 0.5 * S;
const Dx = -0.866 * S;
const Dy = 0.5 * S;
const Uy = -S;

const WALL = "#F0E8EB";
const WALL_2 = "#DADADF";
const FLOOR = "#DDD6D8";
const RUG = "#F1F1F3";
const WOOD = "#75636A";
const WOOD_LT = "#9B898F";
const GLASS = "#D7E0DD";
const GREEN = "#759D78";
const PINK = "#E58FA5";
const INK = "#211A23";
const PAPER = "#F3F0EF";

type P = [number, number];

function wp(a: number, b: number, up = 0): P {
  return [Ex * a + Dx * b, Ey * a + Dy * b + Uy * up];
}

function pts(list: P[]) {
  return list.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
}

function shade(hex: string, f: number) {
  const h = hex.replace("#", "");
  const n = (i: number) =>
    Math.min(255, Math.round(parseInt(h.slice(i, i + 2), 16) * f));
  return `rgb(${n(0)},${n(2)},${n(4)})`;
}

function Box({
  a,
  b,
  w,
  d,
  h,
  up = 0,
  color,
}: {
  a: number;
  b: number;
  w: number;
  d: number;
  h: number;
  up?: number;
  color: string;
}) {
  const q = (la: number, lb: number, lu: number) => wp(a + la, b + lb, up + lu);
  const right: P[] = [q(w, 0, 0), q(w, d, 0), q(w, d, h), q(w, 0, h)];
  const left: P[] = [q(0, d, 0), q(w, d, 0), q(w, d, h), q(0, d, h)];
  const roof: P[] = [q(0, 0, h), q(w, 0, h), q(w, d, h), q(0, d, h)];
  return (
    <g>
      <polygon points={pts(right)} fill={shade(color, 0.72)} />
      <polygon points={pts(left)} fill={shade(color, 0.88)} />
      <polygon points={pts(roof)} fill={color} />
    </g>
  );
}

function Chair({ a, b, face }: { a: number; b: number; face: "n" | "s" | "w" | "e" }) {
  const seat = 0.58;
  const back =
    face === "n" ? (
      <Box a={a - seat / 2} b={b - seat / 2} w={seat} d={0.1} h={0.7} up={0.48} color={WOOD_LT} />
    ) : face === "s" ? (
      <Box a={a - seat / 2} b={b + seat / 2 - 0.1} w={seat} d={0.1} h={0.7} up={0.48} color={WOOD_LT} />
    ) : face === "w" ? (
      <Box a={a - seat / 2} b={b - seat / 2} w={0.1} d={seat} h={0.7} up={0.48} color={WOOD_LT} />
    ) : (
      <Box a={a + seat / 2 - 0.1} b={b - seat / 2} w={0.1} d={seat} h={0.7} up={0.48} color={WOOD_LT} />
    );
  return (
    <g>
      <Box a={a - seat / 2} b={b - seat / 2} w={seat} d={seat} h={0.1} up={0.4} color={WOOD} />
      {back}
    </g>
  );
}

function Plant({ a, b }: { a: number; b: number }) {
  const c = wp(a, b, 0.7);
  return (
    <g>
      <Box a={a - 0.28} b={b - 0.28} w={0.56} d={0.56} h={0.55} color={WOOD} />
      <ellipse cx={c[0]} cy={c[1] - 18} rx={16} ry={20} fill={GREEN} />
    </g>
  );
}

function Shell({
  fa,
  fb,
  wh,
  dining,
}: {
  fa: number;
  fb: number;
  wh: number;
  dining: boolean;
}) {
  const floor = [wp(-fa, -fb), wp(fa, -fb), wp(fa, fb), wp(-fa, fb)];
  const north = [wp(-fa, -fb, 0), wp(fa, -fb, 0), wp(fa, -fb, wh), wp(-fa, -fb, wh)];
  const west = [wp(-fa, -fb, 0), wp(-fa, fb, 0), wp(-fa, fb, wh), wp(-fa, -fb, wh)];
  const rugA = dining ? 6.4 : fa - 1.6;
  const rugB = dining ? 3.6 : fb - 2.4;
  const rug = [wp(-rugA, -rugB, 0.02), wp(rugA, -rugB, 0.02), wp(rugA, rugB, 0.02), wp(-rugA, rugB, 0.02)];
  const grids: P[][] = [];
  if (!dining) {
    for (let a = -fa + 1.8; a < fa; a += 1.8) grids.push([wp(a, -fb), wp(a, fb)]);
    for (let b = -fb + 1.8; b < fb; b += 1.8) grids.push([wp(-fa, b), wp(fa, b)]);
  }
  const T = 0.45;
  const SL = 0.55;
  const slabE = [wp(fa, -fb, 0), wp(fa, fb, 0), wp(fa, fb, -SL), wp(fa, -fb, -SL)];
  const slabS = [wp(-fa, fb, 0), wp(fa, fb, 0), wp(fa, fb, -SL), wp(-fa, fb, -SL)];
  const capN = [wp(-fa - T, -fb - T, wh), wp(fa, -fb - T, wh), wp(fa, -fb, wh), wp(-fa - T, -fb, wh)];
  const capW = [wp(-fa - T, -fb - T, wh), wp(-fa, -fb - T, wh), wp(-fa, fb, wh), wp(-fa - T, fb, wh)];
  const outerN = [wp(-fa - T, -fb - T, 0), wp(fa, -fb - T, 0), wp(fa, -fb - T, wh), wp(-fa - T, -fb - T, wh)];
  const outerW = [wp(-fa - T, -fb - T, 0), wp(-fa - T, fb, 0), wp(-fa - T, fb, wh), wp(-fa - T, -fb - T, wh)];
  const sh = wp(0, 0, -SL);
  // Boardrooms are neutral white; the dining room keeps its warm blush tones.
  const pal = dining
    ? {
        wallN0: "#F6EEF1", wallN1: "#E6D8DE", wallW0: "#E9DCE1", wallW1: "#D5C5CC",
        floor0: "#E6DEE1", floor1: "#D2C8CC", shadow: "rgba(90,50,70,.22)",
        slabE: "#8E7A83", slabS: "#A8949D", outerN: "#CDBCC4", outerW: "#BBA9B1",
        capN: "#FBF6F8", capW: "#F1E7EB", baseN: "#C9B8C0", baseW: "#B9A7AF", grid: "#C9BCC2",
      }
    : {
        wallN0: "#FFFFFF", wallN1: "#F1F1F3", wallW0: "#F6F6F8", wallW1: "#E5E5E8",
        floor0: "#FCFCFC", floor1: "#EBEBED", shadow: "rgba(60,45,60,.18)",
        slabE: "#B8B8BD", slabS: "#CFCFD4", outerN: "#EAEAED", outerW: "#DBDBDF",
        capN: "#FFFFFF", capW: "#F6F6F8", baseN: "#DDDDE1", baseW: "#CECED3", grid: "#D8D8DC",
      };
  return (
    <g>
      <defs>
        <linearGradient id="wallN" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={pal.wallN0} />
          <stop offset="1" stopColor={pal.wallN1} />
        </linearGradient>
        <linearGradient id="wallW" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={pal.wallW0} />
          <stop offset="1" stopColor={pal.wallW1} />
        </linearGradient>
        <linearGradient id="floorG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={pal.floor0} />
          <stop offset="1" stopColor={pal.floor1} />
        </linearGradient>
      </defs>
      <ellipse cx={sh[0]} cy={sh[1] + 40} rx={fa * 52} ry={fb * 22} fill={pal.shadow} style={{ filter: "blur(14px)" }} />
      <polygon points={pts(slabE)} fill={pal.slabE} />
      <polygon points={pts(slabS)} fill={pal.slabS} />
      <polygon points={pts(outerN)} fill={pal.outerN} />
      <polygon points={pts(outerW)} fill={pal.outerW} />
      <polygon points={pts(north)} fill={dining ? "#E7DFE2" : "url(#wallN)"} />
      <polygon points={pts(west)} fill="url(#wallW)" />
      <polygon points={pts(capN)} fill={pal.capN} />
      <polygon points={pts(capW)} fill={pal.capW} />
      <polygon points={pts(floor)} fill="url(#floorG)" />
      <polygon points={pts([wp(-fa, -fb, 0), wp(fa, -fb, 0), wp(fa, -fb, 0.22), wp(-fa, -fb, 0.22)])} fill={pal.baseN} />
      <polygon points={pts([wp(-fa, -fb, 0), wp(-fa, fb, 0), wp(-fa, fb, 0.22), wp(-fa, -fb, 0.22)])} fill={pal.baseW} />
      <polygon points={pts([wp(-fa, -fb, 0), wp(fa, -fb, 0), wp(fa, -fb + 1.6, 0), wp(-fa, -fb + 1.6, 0)])} fill="rgba(60,30,50,.07)" />
      <polygon points={pts([wp(-fa, -fb, 0), wp(-fa + 1.6, -fb, 0), wp(-fa + 1.6, fb, 0), wp(-fa, fb, 0)])} fill="rgba(60,30,50,.09)" />
      {grids.map((g, i) => (
        <polyline key={i} points={pts(g)} fill="none" stroke={pal.grid} strokeWidth={1} opacity={0.45} />
      ))}
      <polygon points={pts(rug)} fill={RUG} opacity={0.9} />
    </g>
  );
}

function wallRect(a0: number, a1: number, u0: number, u1: number, fb: number, fill: string) {
  return (
    <polygon
      points={pts([wp(a0, -fb, u0), wp(a1, -fb, u0), wp(a1, -fb, u1), wp(a0, -fb, u1)])}
      fill={fill}
    />
  );
}

function westRect(b0: number, b1: number, u0: number, u1: number, fa: number, fill: string) {
  return (
    <polygon
      points={pts([wp(-fa, b0, u0), wp(-fa, b1, u0), wp(-fa, b1, u1), wp(-fa, b0, u1)])}
      fill={fill}
    />
  );
}

function WindowPanel({ a0, a1, u0, u1, fb }: { a0: number; a1: number; u0: number; u1: number; fb: number }) {
  const span = a1 - a0;
  const panes = Math.max(2, Math.round(span / 1.4));
  const mullions: number[] = [];
  for (let i = 1; i < panes; i++) mullions.push(a0 + (span * i) / panes);
  const midU = (u0 + u1) / 2;
  return (
    <g>
      {wallRect(a0, a1, u0, u1, fb, GLASS)}
      {wallRect(a0, a1, u0, u0 + 0.08, fb, WALL_2)}
      {wallRect(a0, a1, u1 - 0.08, u1, fb, WALL_2)}
      <polyline points={pts([wp(a0, -fb, midU), wp(a1, -fb, midU)])} fill="none" stroke={WALL_2} strokeWidth={1.4} />
      {mullions.map((a) => (
        <polyline key={a} points={pts([wp(a, -fb, u0), wp(a, -fb, u1)])} fill="none" stroke={WALL_2} strokeWidth={1.8} />
      ))}
    </g>
  );
}

function WestWindowPanel({ b0, b1, u0, u1, fa }: { b0: number; b1: number; u0: number; u1: number; fa: number }) {
  const span = b1 - b0;
  const panes = Math.max(2, Math.round(span / 1.4));
  const mullions: number[] = [];
  for (let i = 1; i < panes; i++) mullions.push(b0 + (span * i) / panes);
  const midU = (u0 + u1) / 2;
  return (
    <g>
      {westRect(b0, b1, u0, u1, fa, GLASS)}
      {westRect(b0, b1, u0, u0 + 0.08, fa, WALL_2)}
      {westRect(b0, b1, u1 - 0.08, u1, fa, WALL_2)}
      <polyline points={pts([wp(-fa, b0, midU), wp(-fa, b1, midU)])} fill="none" stroke={WALL_2} strokeWidth={1.4} />
      {mullions.map((b) => (
        <polyline key={b} points={pts([wp(-fa, b, u0), wp(-fa, b, u1)])} fill="none" stroke={WALL_2} strokeWidth={1.8} />
      ))}
    </g>
  );
}

function AcUnit({ a, fb }: { a: number; fb: number }) {
  return (
    <g>
      <polygon points={pts([wp(a - 1.0, -fb, 2.65), wp(a + 1.0, -fb, 2.65), wp(a + 1.0, -fb, 3.1), wp(a - 1.0, -fb, 3.1)])} fill={PAPER} />
      <polygon points={pts([wp(a - 1.0, -fb, 2.65), wp(a + 1.0, -fb, 2.65), wp(a + 1.0, -fb, 2.72), wp(a - 1.0, -fb, 2.72)])} fill={WALL_2} />
      {[-0.5, 0, 0.5].map((d) => (
        <polyline key={d} points={pts([wp(a + d - 0.3, -fb, 2.82), wp(a + d + 0.3, -fb, 2.82)])} fill="none" stroke="#C9BCC2" strokeWidth={1} />
      ))}
      <circle cx={wp(a + 0.6, -fb, 2.88)[0]} cy={wp(a + 0.6, -fb, 2.88)[1]} r={2} fill={GREEN} />
    </g>
  );
}

function WestAcUnit({ b, fa }: { b: number; fa: number }) {
  return (
    <g>
      <polygon points={pts([wp(-fa, b - 0.9, 2.65), wp(-fa, b + 0.9, 2.65), wp(-fa, b + 0.9, 3.1), wp(-fa, b - 0.9, 3.1)])} fill={PAPER} />
      <polygon points={pts([wp(-fa, b - 0.9, 2.65), wp(-fa, b + 0.9, 2.65), wp(-fa, b + 0.9, 2.72), wp(-fa, b - 0.9, 2.72)])} fill={WALL_2} />
      {[-0.4, 0, 0.4].map((d) => (
        <polyline key={d} points={pts([wp(-fa, b + d - 0.25, 2.82), wp(-fa, b + d + 0.25, 2.82)])} fill="none" stroke="#C9BCC2" strokeWidth={1} />
      ))}
    </g>
  );
}

function Projector({ fb }: { fb: number }) {
  return (
    <g>
      {wallRect(-2.8, 2.8, 0.9, 2.75, fb, PAPER)}
      <polyline points={pts([wp(-2.2, -fb, 2.2), wp(2.2, -fb, 2.2)])} fill="none" stroke={PINK} strokeWidth={2.4} />
      <polyline points={pts([wp(-1.8, -fb, 1.75), wp(1.8, -fb, 1.75)])} fill="none" stroke={INK} strokeWidth={1.6} opacity={0.4} />
      <polyline points={pts([wp(-1.4, -fb, 1.4), wp(1.4, -fb, 1.4)])} fill="none" stroke={INK} strokeWidth={1.2} opacity={0.25} />
      {wallRect(-2.82, -2.78, 0.88, 2.78, fb, WOOD_LT)}
      {wallRect(2.78, 2.82, 0.88, 2.78, fb, WOOD_LT)}
      {wallRect(-2.82, 2.82, 0.86, 0.92, fb, WOOD_LT)}
      {wallRect(-2.82, 2.82, 2.72, 2.78, fb, WOOD_LT)}
    </g>
  );
}

function CeilingPendant({ a, b }: { a: number; b: number }) {
  const top = wp(a, b, 3.4);
  const bot = wp(a, b, 2.85);
  return (
    <g>
      <line x1={top[0]} y1={top[1]} x2={bot[0]} y2={bot[1]} stroke={WOOD_LT} strokeWidth={1.2} />
      <ellipse cx={bot[0]} cy={bot[1]} rx={6} ry={3} fill={PINK} opacity={0.7} />
      <ellipse cx={bot[0]} cy={bot[1] + 2} rx={12} ry={5} fill="rgba(229,143,165,.06)" />
    </g>
  );
}

function BoardDressing({ fb, fa }: { fb: number; fa: number }) {
  return (
    <g>
      <WindowPanel a0={-6.4} a1={-3.2} u0={1.0} u1={2.9} fb={fb} />
      <WindowPanel a0={3.8} a1={6.4} u0={1.0} u1={2.9} fb={fb} />
      <WestWindowPanel b0={-5.5} b1={-2.0} u0={1.0} u1={2.9} fa={fa} />
      <WestWindowPanel b0={2.0} b1={5.5} u0={1.0} u1={2.9} fa={fa} />
      <Projector fb={fb} />
      <AcUnit a={-5.0} fb={fb} />
      <AcUnit a={5.0} fb={fb} />
      <WestAcUnit b={0} fa={fa} />
      <CeilingPendant a={-3.0} b={-2.0} />
      <CeilingPendant a={0} b={0} />
      <CeilingPendant a={3.0} b={2.0} />
      <Plant a={-6.4} b={-6.8} />
      <Plant a={6.4} b={-6.8} />
      <Plant a={-6.4} b={6.6} />
      <Plant a={6.4} b={6.6} />
    </g>
  );
}

function BoardFurniture() {
  const ta = 3.15;
  const tb = 1.65;
  const cc = 0.85;
  const th = 0.95;
  const oct: [number, number][] = [
    [-ta + cc, -tb],
    [ta - cc, -tb],
    [ta, -tb + cc],
    [ta, tb - cc],
    [ta - cc, tb],
    [-ta + cc, tb],
    [-ta, tb - cc],
    [-ta, -tb + cc],
  ];
  const top = oct.map(([a, b]) => wp(a, b, th + 0.18));
  const bot = oct.map(([a, b]) => wp(a, b, th));
  const sides = oct.map((_, i) => {
    const n = (i + 1) % oct.length;
    return (
      <polygon
        key={i}
        points={pts([bot[i], bot[n], top[n], top[i]])}
        fill={shade(WOOD, i % 2 ? 0.82 : 0.68)}
      />
    );
  });
  const shadow = wp(0, 0.15, 0);
  const chairs: { a: number; b: number; face: "n" | "s" | "w" | "e" }[] = [
    { a: -1.6, b: -tb - 0.85, face: "n" },
    { a: 0, b: -tb - 0.85, face: "n" },
    { a: 1.6, b: -tb - 0.85, face: "n" },
    { a: -1.6, b: tb + 0.7, face: "s" },
    { a: 0, b: tb + 0.7, face: "s" },
    { a: 1.6, b: tb + 0.7, face: "s" },
    { a: -ta - 0.75, b: 0, face: "w" },
    { a: ta + 0.75, b: 0, face: "e" },
  ];
  return (
    <g>
      <ellipse cx={shadow[0]} cy={shadow[1] + 8} rx={120} ry={42} fill="rgba(33,26,35,0.13)" />
      {chairs.filter((c) => c.face === "n" || c.face === "w").map((c) => (
        <Chair key={`${c.a}-${c.b}`} {...c} />
      ))}
      {sides}
      <polygon points={pts(top)} fill={WOOD} />
      <polyline points={pts([...top, top[0]])} fill="none" stroke={shade(WOOD, 0.55)} strokeWidth={1.2} />
      {chairs.filter((c) => c.face === "s" || c.face === "e").map((c) => (
        <Chair key={`${c.a}-${c.b}`} {...c} />
      ))}
    </g>
  );
}

function OdcDressing({ fb, fa }: { fb: number; fa: number }) {
  const desks = [
    [-3.2, -1.6],
    [-0.6, -1.6],
    [2.0, -1.6],
    [-3.2, 1.3],
    [-0.6, 1.3],
    [2.0, 1.3],
  ];
  return (
    <g>
      <WindowPanel a0={-4.0} a1={-0.8} u0={1.2} u1={2.65} fb={fb} />
      <WindowPanel a0={0.8} a1={4.0} u0={1.2} u1={2.65} fb={fb} />
      <WestWindowPanel b0={-3.5} b1={-0.5} u0={1.2} u1={2.65} fa={fa} />
      <AcUnit a={-2.2} fb={fb} />
      <AcUnit a={2.2} fb={fb} />
      <CeilingPendant a={-2.0} b={0} />
      <CeilingPendant a={2.0} b={0} />
      {desks.map(([a, b]) => (
        <g key={`${a}-${b}`}>
          <Box a={a} b={b} w={1.35} d={0.7} h={0.08} up={0.62} color={PAPER} />
          <Box a={a + 0.35} b={b + 0.08} w={0.55} d={0.06} h={0.32} up={0.72} color={GLASS} />
          <Box a={a + 0.95} b={b + 0.42} w={0.28} d={0.28} h={0.08} up={0.42} color={WOOD_LT} />
        </g>
      ))}
      <Box a={-0.7} b={-0.15} w={1.5} d={0.9} h={0.08} up={0.4} color={WOOD_LT} />
      <Plant a={-5.4} b={4.2} />
      <Plant a={5.2} b={-4.6} />
      <Plant a={-5.4} b={-4.2} />
    </g>
  );
}

function Chandelier({ a, b }: { a: number; b: number }) {
  const top = wp(a, b, 3.4);
  const bot = wp(a, b, 2.55);
  const arms = [-22, -11, 0, 11, 22];
  return (
    <g>
      <line x1={top[0]} y1={top[1]} x2={bot[0]} y2={bot[1]} stroke="#B89A5A" strokeWidth={1.4} />
      <ellipse cx={bot[0]} cy={bot[1] + 14} rx={46} ry={20} fill="rgba(255,214,150,.16)" />
      <ellipse cx={bot[0]} cy={bot[1] + 4} rx={26} ry={8} fill="none" stroke="#B89A5A" strokeWidth={2.2} />
      <ellipse cx={bot[0]} cy={bot[1] + 8} rx={18} ry={5} fill="none" stroke="#D8BE82" strokeWidth={1.4} />
      {arms.map((dx) => (
        <g key={dx}>
          <line x1={bot[0] + dx} y1={bot[1] + 4} x2={bot[0] + dx} y2={bot[1] - 3} stroke="#B89A5A" strokeWidth={1.2} />
          <ellipse cx={bot[0] + dx} cy={bot[1] - 5} rx={2.4} ry={3.6} fill="#FFE9B8" />
        </g>
      ))}
    </g>
  );
}

function Drape({ b0, b1, fa }: { b0: number; b1: number; fa: number }) {
  const folds = 5;
  const step = (b1 - b0) / folds;
  return (
    <g>
      {Array.from({ length: folds }).map((_, i) => (
        <polygon
          key={i}
          points={pts([
            wp(-fa + 0.05, b0 + i * step, 0.05),
            wp(-fa + 0.05, b0 + (i + 1) * step, 0.05),
            wp(-fa + 0.05, b0 + (i + 1) * step, 3.25),
            wp(-fa + 0.05, b0 + i * step, 3.25),
          ])}
          fill={i % 2 ? "#8E3A55" : "#A24A66"}
        />
      ))}
    </g>
  );
}

function PlaceSetting({ a, b, face }: { a: number; b: number; face: 1 | -1 }) {
  const th = 1.07;
  const plate = wp(a, b, th);
  const glass = wp(a + 0.55, b - 0.1 * face, th);
  const fork = wp(a - 0.6, b, th);
  const knife = wp(a + 0.4, b, th);
  const napkin = wp(a - 0.05, b + 0.4 * face, th);
  return (
    <g>
      <ellipse cx={plate[0]} cy={plate[1]} rx={13} ry={7} fill="#FFFDFB" stroke="#D8BE82" strokeWidth={1.4} />
      <ellipse cx={plate[0]} cy={plate[1]} rx={7.5} ry={4} fill="none" stroke="#E9DCC0" strokeWidth={1} />
      <line x1={fork[0]} y1={fork[1] - 5} x2={fork[0]} y2={fork[1] + 5} stroke="#B9B2AE" strokeWidth={1.4} />
      <line x1={knife[0]} y1={knife[1] - 5} x2={knife[0]} y2={knife[1] + 5} stroke="#B9B2AE" strokeWidth={1.4} />
      <polygon points={`${napkin[0] - 6},${napkin[1]} ${napkin[0]},${napkin[1] - 5} ${napkin[0] + 6},${napkin[1]} ${napkin[0]},${napkin[1] + 4}`} fill="#8E3A55" />
      <ellipse cx={glass[0]} cy={glass[1]} rx={3.6} ry={1.8} fill="rgba(255,255,255,.7)" stroke="#9AA6AC" strokeWidth={0.8} />
      <line x1={glass[0]} y1={glass[1]} x2={glass[0]} y2={glass[1] - 9} stroke="#9AA6AC" strokeWidth={0.9} />
      <ellipse cx={glass[0]} cy={glass[1] - 11} rx={4.4} ry={5} fill="rgba(142,58,85,.55)" stroke="#9AA6AC" strokeWidth={0.8} />
    </g>
  );
}

function Candle({ a, b }: { a: number; b: number }) {
  const base = wp(a, b, 1.07);
  return (
    <g>
      <rect x={base[0] - 2.2} y={base[1] - 20} width={4.4} height={20} fill="#F6E7C8" />
      <rect x={base[0] - 5} y={base[1] - 2} width={10} height={3} fill="#B89A5A" />
      <ellipse cx={base[0]} cy={base[1] - 25} rx={3} ry={5} fill="#FFC857" />
      <ellipse cx={base[0]} cy={base[1] - 25} rx={9} ry={11} fill="rgba(255,200,87,.18)" />
    </g>
  );
}

function DiningRoom({ fa, fb, wh }: { fa: number; fb: number; wh: number }) {
  const sky = [
    [0.62, wh - 0.15, "#EBDCE2"],
    [0.28, 0.66, "#D9C6CE"],
    [0.08, 0.34, "#E8CFC6"],
  ] as const;
  const blocks = [-6.2, -4.6, -3.1, -1.4, 0.2, 1.9, 3.5, 5.2];
  const seats = [-4.2, -1.4, 1.4, 4.2];
  const th = 1.0;
  const TA = 5.4;
  const TB = 1.35;
  const cloth = [wp(-TA, -TB, th), wp(TA, -TB, th), wp(TA, TB, th), wp(-TA, TB, th)];
  return (
    <g>
      {sky.map(([u0, u1, fill]) => (
        <polygon
          key={fill}
          points={pts([wp(-fa + 0.4, -fb, u0), wp(fa - 0.4, -fb, u0), wp(fa - 0.4, -fb, u1), wp(-fa + 0.4, -fb, u1)])}
          fill={fill}
        />
      ))}
      {blocks.map((a, i) => {
        const h = 0.7 + ((i * 5) % 7) * 0.16;
        return (
          <polygon
            key={a}
            points={pts([wp(a, -fb, 0.2), wp(a + 0.7, -fb, 0.2), wp(a + 0.7, -fb, 0.2 + h), wp(a, -fb, 0.2 + h)])}
            fill={i % 2 ? "#6E656C" : WOOD}
          />
        );
      })}
      {[-5.5, -2.2, 1.1, 4.4].map((a) => (
        <polyline key={a} points={pts([wp(a, -fb, 0.15), wp(a, -fb, wh - 0.15)])} fill="none" stroke="#B89A5A" strokeWidth={2.4} />
      ))}
      <polyline points={pts([wp(-fa + 0.4, -fb, wh - 0.15), wp(fa - 0.4, -fb, wh - 0.15)])} fill="none" stroke="#B89A5A" strokeWidth={3} />
      <polyline points={pts([wp(-fa + 0.4, -fb, 0.08), wp(fa - 0.4, -fb, 0.08)])} fill="none" stroke="#B89A5A" strokeWidth={3} />

      <polygon points={pts([wp(-fa, -fb, 0), wp(-fa, fb, 0), wp(-fa, fb, 1.1), wp(-fa, -fb, 1.1)])} fill="#6F3447" />
      <polyline points={pts([wp(-fa, -fb, 1.1), wp(-fa, fb, 1.1)])} fill="none" stroke="#B89A5A" strokeWidth={2.4} />
      <polygon points={pts([wp(-fa, -2.4, 1.5), wp(-fa, 0.4, 1.5), wp(-fa, 0.4, 2.8), wp(-fa, -2.4, 2.8)])} fill="#B89A5A" />
      <polygon points={pts([wp(-fa, -2.2, 1.65), wp(-fa, 0.2, 1.65), wp(-fa, 0.2, 2.65), wp(-fa, -2.2, 2.65)])} fill="#E7C9CF" />
      <polygon points={pts([wp(-fa, -1.7, 1.85), wp(-fa, -0.3, 1.85), wp(-fa, -0.3, 2.45), wp(-fa, -1.7, 2.45)])} fill={PINK} opacity={0.8} />
      <Drape b0={2.4} b1={4.6} fa={fa} />
      {[-0.9, 1.9].map((b) => {
        const p = wp(-fa, b, 2.2);
        return (
          <g key={b}>
            <rect x={p[0] - 3} y={p[1] - 6} width={6} height={12} rx={2} fill="#B89A5A" />
            <ellipse cx={p[0]} cy={p[1] - 9} rx={3} ry={4.5} fill="#FFE9B8" />
            <ellipse cx={p[0]} cy={p[1] - 9} rx={12} ry={14} fill="rgba(255,214,150,.16)" />
          </g>
        );
      })}

      <polygon points={pts([wp(-6.8, -3.4, 0.03), wp(6.8, -3.4, 0.03), wp(6.8, 3.4, 0.03), wp(-6.8, 3.4, 0.03)])} fill="#7A3A4F" />
      <polygon points={pts([wp(-6.4, -3.0, 0.04), wp(6.4, -3.0, 0.04), wp(6.4, 3.0, 0.04), wp(-6.4, 3.0, 0.04)])} fill="none" stroke="#D8BE82" strokeWidth={2} />
      <ellipse cx={wp(0, 0.1)[0]} cy={wp(0, 0.1)[1] + 12} rx={170} ry={52} fill="rgba(33,26,35,0.16)" />

      {seats.map((a) => (
        <Chair key={`n${a}`} a={a} b={-2.45} face="n" />
      ))}

      {[-3.8, 3.8].map((a) => (
        <Box key={a} a={a - 0.25} b={-0.25} w={0.5} d={0.5} h={th} color="#5C3B2A" />
      ))}
      <polygon points={pts([wp(-TA, TB, th), wp(TA, TB, th), wp(TA, TB, th - 0.55), wp(-TA, TB, th - 0.55)])} fill="#E9E2DE" />
      <polygon points={pts([wp(TA, -TB, th), wp(TA, TB, th), wp(TA, TB, th - 0.55), wp(TA, -TB, th - 0.55)])} fill="#D6CEC9" />
      <polygon points={pts(cloth)} fill="#FBF7F4" />
      <polyline points={pts([...cloth, cloth[0]])} fill="none" stroke="#D8BE82" strokeWidth={1.6} />
      <polygon
        points={pts([wp(-TA + 0.4, -0.22, th + 0.01), wp(TA - 0.4, -0.22, th + 0.01), wp(TA - 0.4, 0.22, th + 0.01), wp(-TA + 0.4, 0.22, th + 0.01)])}
        fill="#8E3A55"
        opacity={0.85}
      />

      {seats.map((a) => (
        <PlaceSetting key={`pn${a}`} a={a} b={-0.8} face={-1} />
      ))}
      {[-3.0, 0, 3.0].map((a) => (
        <Candle key={`c${a}`} a={a} b={0} />
      ))}
      {[-1.5, 1.5].map((a) => {
        const p = wp(a, 0, 1.07);
        return (
          <g key={`f${a}`}>
            <rect x={p[0] - 5} y={p[1] - 10} width={10} height={10} rx={2} fill="#EDE4DC" stroke="#D8BE82" />
            <circle cx={p[0] - 5} cy={p[1] - 16} r={5} fill="#E58FA5" />
            <circle cx={p[0] + 4} cy={p[1] - 18} r={5} fill="#F3C1CE" />
            <circle cx={p[0]} cy={p[1] - 23} r={4.5} fill="#FFF3F5" />
            <circle cx={p[0] + 1} cy={p[1] - 14} r={4} fill={GREEN} />
          </g>
        );
      })}
      {seats.map((a) => (
        <PlaceSetting key={`ps${a}`} a={a} b={0.8} face={1} />
      ))}

      {seats.map((a) => (
        <Chair key={`s${a}`} a={a} b={1.95} face="s" />
      ))}
      <Chair a={-TA - 0.8} b={0} face="w" />
      <Chair a={TA + 0.8} b={0} face="e" />

      <Box a={-3.2} b={-fb + 0.3} w={6.4} d={0.8} h={1.1} color="#5C3B2A" />
      <polyline points={pts([wp(-3.2, -fb + 1.1, 1.1), wp(3.2, -fb + 1.1, 1.1)])} fill="none" stroke="#B89A5A" strokeWidth={1.4} />
      {[-2, 0, 2].map((a) => {
        const p = wp(a, -fb + 0.7, 1.1);
        return (
          <g key={`sb${a}`}>
            <ellipse cx={p[0]} cy={p[1] + 1} rx={9} ry={4} fill="#D8BE82" />
            <rect x={p[0] - 3} y={p[1] - 12} width={6} height={12} rx={2.4} fill="#6E8A74" />
          </g>
        );
      })}

      <Chandelier a={-3.2} b={0} />
      <Chandelier a={3.2} b={0} />
      <Plant a={fa - 1.6} b={fb - 1.5} />
      <Plant a={-fa + 1.8} b={fb - 1.6} />
      <Plant a={fa - 1.8} b={-fb + 1.8} />
    </g>
  );
}

/** Solid badge colour behind each prop glyph (white glyph on top). */
const PROP_SOLID: Record<SessionProp, string> = {
  reception: "#C2185B",
  horizon: "#6D4AE0",
  ideation: "#2E7D32",
  sprint: "#E65100",
  aishield: "#00796B",
  cloche: "#7B1FA2",
  maturityloop: "#283593",
  autonomy: "#C62828",
  runcycle: "#1565C0",
  hexcloud: "#455A64",
  casefiles: "#6D4C41",
  contextstack: "#1B1B2F",
};

const ACCENT = "#FFD54F";

function hexPts(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 180) * (60 * k + 30);
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

function PropGlyph({ type }: { type: SessionProp }) {
  // Glyphs are drawn white on a solid badge. Inside this function PAPER/INK are
  // the badge colour (cut-outs) and PINK is the accent highlight.
  const c = "#FFFFFF";
  const PAPER = PROP_SOLID[type];
  const PINK = ACCENT;
  switch (type) {
    case "reception":
      // Professional greeting: a handshake between two sleeved forearms.
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <polygon points="-25,-6 -17,-9 -12,11 -20,14" fill={c} opacity={0.55} />
          <polygon points="25,-6 17,-9 12,11 20,14" fill={c} />
          <path d="M-15 -6 L-5 -11 L3 -8 L10 -9 L16 -4 L15 5 L7 12 L-3 13 L-12 7 Z" fill={c} />
          <path d="M-5 -11 L-1 -3 L7 -4" fill="none" stroke={PAPER} strokeWidth={2} />
          <g fill="none" stroke={PAPER} strokeWidth={2}>
            <path d="M3 0 L9 6" />
            <path d="M-1 4 L5 10" />
            <path d="M-5 7 L0 12" />
          </g>
        </g>
      );
    case "horizon":
      // Drawn by <VisionProp /> (eye above five rotating pillars).
      return null;
    case "ideation":
      // Lightbulb whose base becomes an isometric cube.
      return (
        <g>
          <circle cx={0} cy={-10} r={11} fill="none" stroke={c} strokeWidth={3} />
          <path d="M-4 -9 L0 -4 L4 -9" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <polygon points="0,4 9,9 9,18 0,23 -9,18 -9,9" fill={c} />
          <path d="M0 14 L9 9 M0 14 L-9 9 M0 14 V23" stroke={PAPER} strokeWidth={1.6} fill="none" />
        </g>
      );
    case "sprint":
      // Stopwatch with a bolt for a hand and three bricks stacking below.
      return (
        <g>
          <rect x={-3} y={-20} width={6} height={4} rx={1} fill={c} />
          <circle cx={0} cy={0} r={15} fill={PAPER} stroke={c} strokeWidth={3} />
          <polygon points="2,-9 -5,3 0,3 -2,11 6,-2 1,-2" fill={c} />
          <rect x={-14} y={19} width={8} height={4} fill={c} />
          <rect x={-4} y={19} width={8} height={4} fill={c} opacity={0.8} />
          <rect x={6} y={19} width={8} height={4} fill={c} opacity={0.6} />
        </g>
      );
    case "aishield":
      // Shield with circuit-trace check and a magnifier.
      return (
        <g>
          <path d="M0 -20 L16 -12 V2 C16 14 8 20 0 24 C-8 20 -16 14 -16 2 V-12 Z" fill={c} />
          <g fill="none" stroke={PAPER} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M-8 -4 H-2 L2 0 V8" />
            <path d="M8 -8 V-3 H4" />
          </g>
          <circle cx={-8} cy={-4} r={2} fill={PAPER} />
          <circle cx={8} cy={-8} r={2} fill={PAPER} />
          <circle cx={12} cy={12} r={6} fill={PINK} stroke={PAPER} strokeWidth={2.5} />
          <line x1={16.5} y1={16.5} x2={22} y2={22} stroke={c} strokeWidth={3} strokeLinecap="round" />
        </g>
      );
    case "cloche":
      // Serving dome with steam and two chat dots.
      return (
        <g transform="translate(0 4)">
          <path d="M-18 8 A18 18 0 0 1 18 8 Z" fill={c} />
          <circle cx={0} cy={-12} r={2.5} fill={c} />
          <rect x={-22} y={8} width={44} height={3} rx={1.5} fill={c} />
          <g fill="none" stroke={c} strokeWidth={2} strokeLinecap="round">
            <path d="M-6 -17 q-3 -4 0 -8" />
            <path d="M6 -17 q-3 -4 0 -8" />
          </g>
          <circle cx={-4} cy={17} r={2} fill={c} />
          <circle cx={4} cy={17} r={2} fill={c} />
        </g>
      );
    case "maturityloop":
      // Infinity loop: stair bars (maturity) on one side, loop arrow on the other.
      return (
        <g>
          <path
            d="M0 0 C-6 -12 -22 -12 -22 0 C-22 12 -6 12 0 0 C6 -12 22 -12 22 0 C22 12 6 12 0 0 Z"
            fill="none"
            stroke={c}
            strokeWidth={3.5}
            strokeLinejoin="round"
          />
          <rect x={8} y={1} width={3} height={4} fill={c} />
          <rect x={12.5} y={-2} width={3} height={7} fill={c} />
          <rect x={17} y={-5} width={3} height={10} fill={c} />
          <polygon points="-8,-9 -15,-13 -15,-5" fill={c} />
        </g>
      );
    case "autonomy": {
      // Five-segment autonomy dial with level 3 lit.
      const r = 18;
      return (
        <g>
          {[0, 1, 2, 3, 4].map((k) => {
            const a0 = Math.PI + (k * Math.PI) / 5 + 0.06;
            const a1 = Math.PI + ((k + 1) * Math.PI) / 5 - 0.06;
            const x0 = (r * Math.cos(a0)).toFixed(1);
            const y0 = (10 + r * Math.sin(a0)).toFixed(1);
            const x1 = (r * Math.cos(a1)).toFixed(1);
            const y1 = (10 + r * Math.sin(a1)).toFixed(1);
            return (
              <path
                key={k}
                d={`M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`}
                fill="none"
                stroke={k === 2 ? PINK : c}
                strokeWidth={5}
                opacity={k === 2 ? 1 : 0.55}
              />
            );
          })}
          <line x1={0} y1={10} x2={0} y2={-5} stroke={c} strokeWidth={3} strokeLinecap="round" />
          <circle cx={0} cy={10} r={3.5} fill={c} />
          <text x={0} y={23} textAnchor="middle" style={{ fontSize: "9px", fontWeight: 800, fill: c }}>
            L3
          </text>
        </g>
      );
    }
    case "runcycle":
      // Gear inside a circular arrow.
      return (
        <g>
          {[0, 45, 90, 135].map((a) => (
            <rect key={a} x={-2.5} y={-12} width={5} height={24} rx={1.5} fill={c} transform={`rotate(${a})`} />
          ))}
          <circle cx={0} cy={0} r={8} fill={c} />
          <circle cx={0} cy={0} r={3.5} fill={PAPER} />
          <path d="M-12 -17 A21 21 0 1 1 -19 6" fill="none" stroke={PINK} strokeWidth={2.6} strokeLinecap="round" />
          <polygon points="-20,-18 -10,-21 -12,-11" fill={PINK} />
        </g>
      );
    case "hexcloud":
      // Cloud assembled from hexagon nodes.
      return (
        <g strokeLinejoin="round">
          <polygon points={hexPts(-11, 6, 8)} fill={c} opacity={0.7} />
          <polygon points={hexPts(3, 6, 8)} fill={c} />
          <polygon points={hexPts(17, 6, 8)} fill={c} opacity={0.7} />
          <polygon points={hexPts(-4, -7, 8)} fill={c} opacity={0.85} />
          <polygon points={hexPts(10, -7, 8)} fill={c} opacity={0.6} />
        </g>
      );
    case "casefiles":
      // Two case cards, a rising bar chart and a ribbon.
      return (
        <g>
          <rect x={-18} y={-14} width={24} height={30} rx={3} fill="none" stroke={c} strokeWidth={2.5} transform="rotate(-8)" />
          <rect x={-8} y={-10} width={26} height={30} rx={3} fill={PAPER} stroke={c} strokeWidth={3} />
          <rect x={-3} y={10} width={4} height={6} fill={c} />
          <rect x={3} y={5} width={4} height={11} fill={c} />
          <rect x={9} y={0} width={4} height={16} fill={c} />
          <polygon points="10,-14 18,-14 18,-4 14,-8 10,-4" fill={PINK} />
        </g>
      );
    case "contextstack":
      // Stacked context layers inside focus brackets.
      return (
        <g>
          <polygon points="0,-12 16,-4 0,4 -16,-4" fill={c} opacity={0.3} />
          <polygon points="0,-2 16,6 0,14 -16,6" fill={c} opacity={0.6} />
          <polygon points="0,8 16,16 0,24 -16,16" fill={c} />
          <g fill="none" stroke={PINK} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M-22 -10 V-20 H-12" />
            <path d="M22 -10 V-20 H12" />
          </g>
        </g>
      );
  }
}

const PROP_LABELS: Record<SessionProp, string> = {
  reception: "Welcome",
  horizon: "AI Vision",
  ideation: "Product",
  sprint: "Rapid Build",
  aishield: "AI QA",
  cloche: "Lunch",
  maturityloop: "Maturity",
  autonomy: "AI in Action",
  runcycle: "AI AMS",
  hexcloud: "GCP",
  casefiles: "GCP Cases",
  contextstack: "Context",
};

const PILLARS: { x: number; z: number; h: number }[] = [
  { x: -11, z: -11, h: 17 },
  { x: 11, z: -11, h: 21 },
  { x: -11, z: 11, h: 19 },
  { x: 11, z: 11, h: 15 },
  { x: 0, z: 0, h: 30 },
];

/** An eye above five square pillars (one in the centre) that rotate. */
function VisionProp({ active }: { active: boolean }) {
  const [ang, setAng] = useState(0.6);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      setAng((a) => a + (t - last) * 0.0006);
      last = t;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const base = PROP_SOLID.horizon;
  const cos = Math.cos(ang);
  const sin = Math.sin(ang);
  const proj = (x: number, z: number, h: number): P => [(x - z) * 0.87, (x + z) * 0.5 - h];
  const half = 5.5;
  const corners: [number, number][] = [[-half, -half], [half, -half], [half, half], [-half, half]];

  const placed = PILLARS.map((pl) => {
    const cx = pl.x * cos - pl.z * sin;
    const cz = pl.x * sin + pl.z * cos;
    return { ...pl, cx, cz };
  }).sort((p1, p2) => p1.cx + p1.cz - (p2.cx + p2.cz));

  return (
    <g transform="translate(0 26) scale(1.55)" style={{ filter: "drop-shadow(0 3px 4px rgba(33,26,35,.35))" }}>
      {placed.map((pl, k) => {
        const g = corners.map(([lx, lz]) => [
          pl.cx + lx * cos - lz * sin,
          pl.cz + lx * sin + lz * cos,
        ] as [number, number]);
        const faces = g
          .map((pt, i) => {
            const n = g[(i + 1) % 4];
            const mx = (pt[0] + n[0]) / 2 - pl.cx;
            const mz = (pt[1] + n[1]) / 2 - pl.cz;
            return { i, n, mx, mz, vis: mx + mz > 0 };
          })
          .filter((f) => f.vis);
        return (
          <g key={k} stroke="rgba(255,255,255,.45)" strokeWidth={0.8} strokeLinejoin="round">
            {faces.map((f) => (
              <polygon
                key={f.i}
                points={pts([
                  proj(g[f.i][0], g[f.i][1], 0),
                  proj(f.n[0], f.n[1], 0),
                  proj(f.n[0], f.n[1], pl.h),
                  proj(g[f.i][0], g[f.i][1], pl.h),
                ])}
                fill={shade(base, f.mx > f.mz ? 0.95 : 0.7)}
              />
            ))}
            <polygon points={pts(g.map(([x, z]) => proj(x, z, pl.h)))} fill={shade(base, 1.22)} />
          </g>
        );
      })}
      <g transform="translate(0 -42)">
        {active && <circle r={17} fill="none" stroke={PINK} strokeWidth={3} opacity={0.9} />}
        <circle r={13} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
        <path d="M-7 0 C-4 -5 4 -5 7 0 C4 5 -4 5 -7 0 Z" fill="none" stroke={INK} strokeWidth={1.8} />
        <circle r={2.2} fill={INK} />
      </g>
    </g>
  );
}

const RAIL_ICONS = [
  {
    id: "calendar",
    label: "Details",
    title: "Day plan",
    paths: ["M5.5 4.5h13a2.5 2.5 0 012.5 2.5v11a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 18V7a2.5 2.5 0 012.5-2.5z", "M3 9h18M8 2.5v4M16 2.5v4"],
    rows: [["Date", "Thu · 2026-10-02"], ["From", "09:00"], ["To", "17:30"], ["Venue", "TCS Siruseri"]],
  },
  {
    id: "phone",
    label: "Call",
    title: "On the day",
    paths: ["M4 5.5c0-.8.7-1.5 1.5-1.5H8l1.5 4-2 1.2a12 12 0 0 0 5.8 5.8l1.2-2 4 1.5v2.5c0 .8-.7 1.5-1.5 1.5A15.5 15.5 0 0 1 4 5.5z"],
    rows: [["Reception", "Ext. 1200"], ["Guest desk", "Ext. 1201"], ["Logistics", "Ext. 1250"]],
  },
] as const;

const ANIM_PROFILES = [
  { floatAmp: 11, floatDur: 4.2, rotStyle: "tilt",   rotDur: 18 },
  { floatAmp: 14, floatDur: 5.1, rotStyle: "wobble", rotDur: 6  },
  { floatAmp: 9,  floatDur: 3.8, rotStyle: "tilt",   rotDur: 7  },
  { floatAmp: 13, floatDur: 4.8, rotStyle: "tilt",   rotDur: 22 },
  { floatAmp: 10, floatDur: 5.6, rotStyle: "wobble", rotDur: 5  },
  { floatAmp: 15, floatDur: 4.0, rotStyle: "tilt",   rotDur: 8  },
  { floatAmp: 12, floatDur: 5.3, rotStyle: "tilt",   rotDur: 15 },
  { floatAmp: 8,  floatDur: 4.5, rotStyle: "wobble", rotDur: 7  },
  { floatAmp: 11, floatDur: 3.6, rotStyle: "tilt",   rotDur: 9  },
  { floatAmp: 14, floatDur: 5.0, rotStyle: "tilt",   rotDur: 20 },
  { floatAmp: 10, floatDur: 4.3, rotStyle: "wobble", rotDur: 6  },
] as const;

function buildPropStyles(count: number) {
  let css = "";
  for (let i = 0; i < count; i++) {
    const p = ANIM_PROFILES[i % ANIM_PROFILES.length];
    css += `
@keyframes propFloat${i} {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-${p.floatAmp}px); }
}
@keyframes propShadow${i} {
  0%, 100% { transform: scale(1); opacity: .9; }
  50% { transform: scale(${(1 - p.floatAmp * 0.012).toFixed(2)}); opacity: .45; }
}`;
    if (p.rotStyle === "wobble") {
      css += `
@keyframes propRot${i} {
  0%, 100% { transform: rotate(-9deg); }
  50% { transform: rotate(9deg); }
}`;
    } else {
      css += `
@keyframes propRot${i} {
  0%, 100% { transform: rotate(-7deg) skewY(-2deg); }
  50% { transform: rotate(7deg) skewY(2deg); }
}`;
    }
    css += `
.iso-room .prop-body-${i} { animation: propFloat${i} ${p.floatDur}s ease-in-out infinite; }
.iso-room .prop-shadow-${i} { animation: propShadow${i} ${p.floatDur}s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.iso-room .prop-rot-${i} { transform-box: fill-box; transform-origin: center; animation: propRot${i} ${p.rotDur}s ease-in-out infinite; }
.iso-room .prop-hit.active .prop-rot-${i} { animation-duration: ${Math.max(3, p.rotDur * 0.6)}s; }
`;
  }
  return css;
}

function startTime(time: string) {
  return time.split("—")[0]?.trim() ?? time;
}

/** Bottom-right: what you are looking at now, plus where to go next. */
function NavPanel({
  room,
  activeIndex,
  place,
}: {
  room: AgendaRoom;
  activeIndex: number;
  place: string;
}) {
  const sessions = room.sessions;
  const active = sessions[activeIndex];
  if (!active) return null;
  const next = sessions[activeIndex + 1];
  const go = (i: number) => setActiveSession(sessions[(i + sessions.length) % sessions.length].id);
  return (
    <div
      className="pointer-events-auto absolute bottom-5 right-5 w-[min(340px,calc(100vw-2.5rem))] rounded-[18px] border p-3.5"
      style={{
        background: "rgba(255,255,255,.94)",
        borderColor: "rgba(33,26,35,.1)",
        boxShadow: "0 14px 34px rgba(90,40,70,.18)",
        color: INK,
      }}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: PINK }}>
        Now · Session {activeIndex + 1} of {sessions.length}
      </p>
      <p className="mt-1 text-[14px] font-extrabold leading-tight">{active.title}</p>
      <p className="mt-0.5 text-[12px] font-bold tabular-nums" style={{ color: PINK }}>
        {active.time}
      </p>
      <dl className="mt-2 grid grid-cols-[4.2rem_1fr] gap-x-2 gap-y-0.5 text-[11.5px]" style={{ color: "#5c5160" }}>
        <dt className="font-bold" style={{ color: INK }}>Speaker</dt>
        <dd>{active.speaker ?? "To be confirmed"}</dd>
        <dt className="font-bold" style={{ color: INK }}>Where</dt>
        <dd>{place}</dd>
        {next && (
          <>
            <dt className="font-bold" style={{ color: INK }}>Up next</dt>
            <dd>{startTime(next.time)} · {next.title}</dd>
          </>
        )}
      </dl>
      {sessions.length > 1 && (
        <>
          <ol className="mt-2.5 hidden max-h-[26vh] flex-col gap-1 overflow-y-auto sm:flex">
            {sessions.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setActiveSession(s.id)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-[11.5px]"
                  style={{
                    background: i === activeIndex ? "rgba(229,143,165,.2)" : "transparent",
                    fontWeight: i === activeIndex ? 800 : 600,
                  }}
                >
                  <span
                    className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{
                      background: i === activeIndex ? PINK : "rgba(33,26,35,.08)",
                      color: i === activeIndex ? "#fff" : INK,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="w-[4.6rem] shrink-0 tabular-nums" style={{ color: "#5c5160" }}>
                    {startTime(s.time)}
                  </span>
                  <span className="truncate">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <button
              type="button"
              className="rounded-full border px-3 py-1 text-xs font-bold"
              style={{ borderColor: "rgba(33,26,35,.15)" }}
              onClick={() => go(activeIndex - 1)}
            >
              ‹ Previous
            </button>
            <button
              type="button"
              className="rounded-full px-3.5 py-1 text-xs font-bold text-white"
              style={{ background: INK }}
              onClick={() => go(activeIndex + 1)}
            >
              Next ›
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function IsoRoom({
  room,
  sessionId,
}: {
  room: AgendaRoom;
  sessionId: string | null;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1200, h: 800 });
  const active =
    room.sessions.find((s) => s.id === sessionId) ?? room.sessions[0];
  const activeIndex = Math.max(
    0,
    room.sessions.findIndex((s) => s.id === active?.id),
  );

  useEffect(() => {
    if (!room.sessions.some((s) => s.id === sessionId)) {
      setActiveSession(room.sessions[0]?.id ?? null);
    }
  }, [room, sessionId]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const obs = new ResizeObserver(measure);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [modal, setModal] = useState<"details" | null>(null);
  const [rail, setRail] = useState<string | null>(null);

  useEffect(() => {
    setModal(null);
    setRail(null);
  }, [room.id]);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setModal(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal]);

  const dining = room.type === "dining";
  const fa = dining ? 8.2 : room.type === "odc" ? 6.6 : 7.4;
  const fb = dining ? 5.6 : room.type === "odc" ? 5.4 : 7.6;
  const wh = 3.4;

  const propCss = useMemo(() => buildPropStyles(room.sessions.length), [room.sessions.length]);

  const frame = useMemo(() => {
    const corners = [
      wp(-fa, -fb, 0),
      wp(fa, -fb, wh),
      wp(-fa, fb, 0),
      wp(fa, fb, 0),
      wp(-fa, -fb, wh),
    ];
    const xs = corners.map((c) => c[0]);
    const ys = corners.map((c) => c[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const occupy = size.w < 820 ? 0.72 : 0.9;
    const sc = Math.min((size.w * occupy) / (maxX - minX), (size.h * occupy) / (maxY - minY));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    return {
      sc,
      tx: size.w / 2 - cx * sc,
      ty: size.h / 2 - cy * sc,
    };
  }, [fa, fb, wh, size.w, size.h]);

  const place =
    room.buildingId === "signature-tower"
      ? "Signature Tower · Executive Dining"
      : room.buildingId === "eb5"
        ? "EB5 · H&M ODC"
        : `EB3 · ${room.name}`;

  return (
    <div className="iso-room pointer-events-auto">
      <style>{`
        .iso-room { position: fixed; inset: 0; z-index: 28; overflow: hidden;
          background: radial-gradient(90% 80% at 50% 45%, #F6E4EA 0%, #EFD5DE 55%, #E3BFCC 100%);
          animation: isoIn .55s ease; }
        @keyframes isoIn { from { opacity: 0; } to { opacity: 1; } }
        .iso-room .room-cam { transition: transform 1.15s cubic-bezier(.22,.61,.36,1); }
        @media (prefers-reduced-motion: reduce) {
          .iso-room, .iso-room .room-cam { animation: none; transition: none; }
          .iso-room [class*="prop-body-"],
          .iso-room [class*="prop-shadow-"],
          .iso-room [class*="prop-rot-"] { animation: none; }
        }
        ${propCss}
      `}</style>

      <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-col items-start gap-2">
        <button
          type="button"
          className="pointer-events-auto rounded-full border px-3.5 py-2 text-[12px] font-bold"
          style={{ background: "rgba(255,255,255,.9)", borderColor: "rgba(33,26,35,.12)", color: INK }}
          onClick={() => setFocus({ level: "campus" })}
        >
          ← Back to map
        </button>
        {room.buildingId === "eb3" && (
          <button
            type="button"
            className="pointer-events-auto rounded-full border px-3.5 py-2 text-[12px] font-bold"
            style={{ background: "rgba(255,255,255,.9)", borderColor: "rgba(33,26,35,.12)", color: INK }}
            onClick={() => setFocus({ level: "building", building: "eb3" })}
          >
            ← Rooms
          </button>
        )}
        <div className="pointer-events-auto mt-2 flex flex-col gap-2">
          {RAIL_ICONS.map((r) => (
            <div key={r.id} className="relative">
              <button
                type="button"
                aria-label={r.label}
                title={r.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border"
                style={{
                  background: rail === r.id ? PINK : "rgba(255,255,255,.92)",
                  borderColor: rail === r.id ? PINK : "rgba(33,26,35,.12)",
                  color: rail === r.id ? "#fff" : INK,
                  boxShadow: "0 6px 16px -8px rgba(90,50,70,.4)",
                }}
                onClick={() => setRail(rail === r.id ? null : r.id)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {r.paths.map((d) => (
                    <path key={d} d={d} />
                  ))}
                </svg>
              </button>
              {rail === r.id && (
                <div
                  className="absolute left-14 top-0 w-[220px] rounded-2xl border p-3.5"
                  style={{ background: "#FFF9FB", borderColor: "rgba(229,143,165,.45)", boxShadow: "0 18px 40px -18px rgba(90,50,70,.5)" }}
                >
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: PINK }}>{r.label}</p>
                  <h3 className="font-display mb-2 mt-1 text-[17px] font-extrabold" style={{ color: INK }}>{r.title}</h3>
                  <ul className="flex flex-col gap-2">
                    {r.rows.map(([k, v]) => (
                      <li key={k} className="flex justify-between gap-2 text-[12px]" style={{ color: "#5c5160" }}>
                        <span>{k}</span>
                        <b style={{ color: INK }}>{v}</b>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center p-4"
          style={{ background: "rgba(33,26,35,.28)", backdropFilter: "blur(3px)" }}
          onClick={() => setModal(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-[min(92vw,460px)] rounded-2xl p-6"
            style={{ background: "#FFF9FB", border: "1px solid rgba(229,143,165,.45)", boxShadow: "0 24px 60px -20px rgba(90,50,70,.5)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: PINK }}>
                {`Session ${activeIndex + 1} of ${room.sessions.length}`}
              </p>
              <button
                type="button"
                aria-label="Close"
                className="-mt-1 h-7 w-7 rounded-full text-lg leading-none"
                style={{ color: INK, background: "rgba(33,26,35,.06)" }}
                onClick={() => setModal(null)}
              >
                ×
              </button>
            </div>
            {modal === "details" && active && (
              <>
                <h2 className="font-display mt-2 text-[22px] font-extrabold leading-tight" style={{ color: INK }}>
                  {active.title}
                </h2>
                <dl className="mt-4 grid grid-cols-[84px_1fr] gap-x-3 gap-y-3 text-[14px]" style={{ color: "#5c5160" }}>
                  <dt className="font-bold" style={{ color: INK }}>Timing</dt>
                  <dd className="font-bold tabular-nums" style={{ color: PINK }}>{active.time}</dd>
                  <dt className="font-bold" style={{ color: INK }}>Speaker</dt>
                  <dd>{active.speaker ?? "To be confirmed"}</dd>
                  <dt className="font-bold" style={{ color: INK }}>Location</dt>
                  <dd>{place}</dd>
                  <dt className="font-bold" style={{ color: INK }}>About</dt>
                  <dd style={{ whiteSpace: "pre-line" }}>{active.detail}</dd>
                </dl>
              </>
            )}
          </div>
        </div>
      )}

      <div ref={stageRef} className="absolute inset-0">
        <svg width="100%" height="100%" className="block">
          <g className="room-cam" transform={`translate(${frame.tx.toFixed(1)} ${frame.ty.toFixed(1)}) scale(${frame.sc.toFixed(3)})`}>
            <Shell fa={fa} fb={fb} wh={wh} dining={dining} />
            {room.type === "boardroom" && (
              <>
                <BoardDressing fb={fb} fa={fa} />
                <BoardFurniture />
              </>
            )}
            {room.type === "odc" && <OdcDressing fb={fb} fa={fa} />}
            {dining && <DiningRoom fa={fa} fb={fb} wh={wh} />}
            {room.sessions.map((session, i) => {
              const slot = session.propSlot;
              const isActive = session.id === active?.id;
              const isHovered = session.id === hoveredId;
              const ground = wp(slot[0], slot[1], 0);
              const hover = wp(slot[0], slot[1], dining ? 2.05 : 1.7);
              const labelPos = wp(slot[0], slot[1], -0.3);
              const num = String(i + 1).padStart(2, "0");
              const label = session.label ?? PROP_LABELS[session.prop] ?? session.prop;
              const sc = isActive ? 1.15 : isHovered ? 1.05 : 1.0;
              return (
                <g
                  key={session.id}
                  className={`prop-hit${isActive ? " active" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setActiveSession(session.id);
                    setModal("details");
                  }}
                  onMouseEnter={() => setHoveredId(session.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <rect
                    x={ground[0] - 40}
                    y={hover[1] - 40}
                    width={80}
                    height={ground[1] - hover[1] + 70}
                    fill="transparent"
                  />
                  <ellipse
                    className={`prop-shadow-${i}`}
                    cx={ground[0]}
                    cy={ground[1] + 6}
                    rx={24}
                    ry={10}
                    fill={isActive ? "rgba(229,143,165,.3)" : "rgba(33,26,35,.2)"}
                  />
                  {isActive && (
                    <ellipse
                      cx={ground[0]}
                      cy={ground[1] + 2}
                      rx={30}
                      ry={14}
                      fill="none"
                      stroke={PINK}
                      strokeWidth={2.5}
                      opacity={0.6}
                    />
                  )}
                  <g transform={`translate(${hover[0].toFixed(1)} ${hover[1].toFixed(1)}) scale(${sc})`}>
                    <g className={`prop-body-${i}`}>
                      {session.prop === "horizon" ? (
                        <VisionProp active={isActive} />
                      ) : (
                        <g style={{ filter: "drop-shadow(0 4px 5px rgba(33,26,35,.35))" }}>
                          {isActive && (
                            <circle cx={0} cy={0} r={35} fill="none" stroke={PINK} strokeWidth={3} opacity={0.9} />
                          )}
                          <circle cx={0} cy={0} r={29} fill={PROP_SOLID[session.prop]} stroke="#FFFFFF" strokeWidth={3} />
                          <g className={`prop-rot-${i}`}>
                            <PropGlyph type={session.prop} />
                          </g>
                        </g>
                      )}
                    </g>
                  </g>
                  <text
                    x={labelPos[0]}
                    y={labelPos[1] + 16}
                    textAnchor="middle"
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      fill: isActive ? PINK : "#5c4e54",
                      opacity: isActive ? 1 : isHovered ? 1 : 0.8,
                      transition: "fill 0.2s, opacity 0.2s",
                      pointerEvents: "none",
                    }}
                  >
                    {label}
                  </text>
                  <text
                    x={labelPos[0]}
                    y={labelPos[1] + 30}
                    textAnchor="middle"
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      fill: isActive ? PINK : "#9B898F",
                      opacity: isActive ? 1 : isHovered ? 0.9 : 0.65,
                      transition: "fill 0.2s, opacity 0.2s",
                      pointerEvents: "none",
                    }}
                  >
                    {num}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="pointer-events-none absolute top-5 w-[min(56vw,560px)] text-right" style={{ right: "4.75rem" }}>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: PINK }}>
          {place}
        </p>
        <h1
          className="font-display mt-1.5 text-[clamp(18px,2.3vw,28px)] font-extrabold leading-[1.08] tracking-[-0.02em]"
          style={{ color: INK }}
        >
          {active?.title}
        </h1>
        <p className="mt-1.5 text-[13px] font-bold tabular-nums" style={{ color: PINK }}>
          {active?.time}
        </p>
        {room.sessions.length > 1 && (
          <div className="pointer-events-auto mt-3 inline-flex items-center gap-2">
            <button
              type="button"
              className="rounded-full border px-3 py-1 text-xs font-bold"
              style={{ borderColor: "rgba(33,26,35,.15)", color: INK, background: "rgba(255,255,255,.88)" }}
              onClick={() => {
                const prev = room.sessions[(activeIndex - 1 + room.sessions.length) % room.sessions.length];
                setActiveSession(prev.id);
              }}
            >
              ‹
            </button>
            <span className="text-[11px] font-bold tabular-nums" style={{ color: "#5c5160" }}>
              {activeIndex + 1} / {room.sessions.length}
            </span>
            <button
              type="button"
              className="rounded-full border px-3 py-1 text-xs font-bold"
              style={{ borderColor: "rgba(33,26,35,.15)", color: INK, background: "rgba(255,255,255,.88)" }}
              onClick={() => {
                const next = room.sessions[(activeIndex + 1) % room.sessions.length];
                setActiveSession(next.id);
              }}
            >
              Next ›
            </button>
          </div>
        )}
      </div>

      <NavPanel room={room} activeIndex={activeIndex} place={place} />
    </div>
  );
}
