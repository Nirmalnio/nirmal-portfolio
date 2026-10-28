"use client";

import * as m from "motion/react-m";
import { useTransform, type MotionValue } from "motion/react";

export type Sky = "clear" | "cloudy" | "fog" | "rain" | "storm";
export type Phase = "night" | "dawn" | "day" | "dusk";

type Props = {
  awake: boolean;
  phase: Phase;
  /** Sun is up (sun shown) or down (moon shown). */
  isDay: boolean;
  sky: Sky;
  /** 0 → 1 across today's daylight (or tonight's darkness); drives the sun or moon arc. */
  arc: number;
  /** Display time, e.g. "8:02:40 PM". */
  time: string;
  /** e.g. "Live in Bengaluru" */
  label: string;
  /** Pointer position, -0.5 → 0.5, for depth parallax. */
  px: MotionValue<number>;
  py: MotionValue<number>;
};

const SKIN = "#b0754f";
const HAIR = "#15110f";
const HOODIE = "#1d2731";

/* ---------- deterministic scenery (identical on server and client) ---------- */

function random(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

type Building = { x: number; w: number; h: number };
function skyline(seed: number, min: number, max: number): Building[] {
  const r = random(seed);
  const out: Building[] = [];
  for (let x = 0; x < 360; ) {
    const w = 16 + Math.floor(r() * 22);
    out.push({ x, w, h: min + Math.floor(r() * (max - min)) });
    x += w + Math.floor(r() * 3);
  }
  return out;
}
const FAR = skyline(11, 34, 78);
const NEAR = skyline(29, 18, 52);
const LIGHTS = (() => {
  const r = random(5);
  return NEAR.flatMap((b) => {
    const cells: { x: number; y: number; d: number }[] = [];
    for (let y = 220 - b.h + 6; y < 212; y += 8)
      for (let x = b.x + 4; x < b.x + b.w - 5; x += 7) if (r() > 0.62) cells.push({ x, y, d: r() * 6 });
    return cells;
  });
})();
const STARS = (() => {
  const r = random(3);
  return Array.from({ length: 34 }, () => ({ x: r() * 360, y: r() * 130, s: 0.5 + r() * 0.9, d: r() * 4 }));
})();

const SKY: Record<Phase, { clear: [string, string, string]; grey: [string, string, string] }> = {
  night: { clear: ["#030716", "#0b1430", "#1a2550"], grey: ["#05080f", "#111827", "#1f2937"] },
  dawn: { clear: ["#27306b", "#c86f7c", "#ffc98f"], grey: ["#3d4258", "#8f7f8c", "#c9b2a6"] },
  day: { clear: ["#2f7fe0", "#6fb1f2", "#cfe8ff"], grey: ["#6c7b90", "#98a6b8", "#cfd6df"] },
  dusk: { clear: ["#1b1f4d", "#b2507a", "#f7a35a"], grey: ["#2c3145", "#7b6577", "#bd9a87"] },
};

function useDepth(px: MotionValue<number>, py: MotionValue<number>, depth: number) {
  return {
    x: useTransform(px, (v) => v * depth),
    y: useTransform(py, (v) => v * depth * 0.6),
  };
}

function Cloud({ y, s, fill, dur, delay }: { y: number; s: number; fill: string; dur: number; delay: number }) {
  return (
    <g className="a-cloud" style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s` }}>
      <g transform={`translate(0 ${y}) scale(${s})`} fill={fill} filter="url(#ws-soft)">
        <ellipse cx="0" cy="10" rx="40" ry="11" />
        <ellipse cx="-14" cy="3" rx="20" ry="14" />
        <ellipse cx="12" cy="-2" rx="24" ry="18" />
        <ellipse cx="32" cy="6" rx="16" ry="11" />
      </g>
    </g>
  );
}

/** A four-car Purple Line train, drawn at x = 0 and moved by its parent's animation. */
function Train({ night, y, facing }: { night: boolean; y: number; facing: "left" | "right" }) {
  const cars = 4;
  const len = 26;
  const gap = 2;
  const total = cars * len + (cars - 1) * gap;
  const head = facing === "right" ? total : 0;
  return (
    <g transform={`translate(0 ${y})`}>
      {Array.from({ length: cars }, (_, c) => {
        const x = c * (len + gap);
        const nose = facing === "right" ? c === cars - 1 : c === 0;
        return (
          <g key={c}>
            <rect x={x} width={len} height="9" rx={nose ? 3.5 : 1.2} fill="#7b3fa0" />
            <rect x={x} y="6.4" width={len} height="1.3" fill="#d9b8f0" opacity=".85" />
            {[3, 9, 15, 20].map((wx) => (
              <rect key={wx} x={x + wx} y="1.8" width="3.6" height="3" rx=".6" fill={night ? "#ffe9a8" : "#d7dde8"} opacity={night ? 0.95 : 0.75} />
            ))}
          </g>
        );
      })}
      {/* headlight at the front, tail light at the back */}
      <circle cx={head} cy="4.5" r={night ? 1.6 : 1.1} fill="#fff6d0" />
      {night && <circle cx={head} cy="4.5" r="7" fill="#fff6d0" opacity=".18" />}
      <circle cx={facing === "right" ? 0 : total} cy="4.5" r="1" fill="#ff5a5a" opacity={night ? 1 : 0.7} />
    </g>
  );
}

function BigWindow({ phase, isDay, sky, arc }: Pick<Props, "phase" | "isDay" | "sky" | "arc">) {
  const grey = sky !== "clear";
  const [top, mid, bottom] = SKY[phase][grey ? "grey" : "clear"];
  const night = phase === "night";
  const sx = 30 + arc * 300;
  const sy = 182 - Math.sin(Math.PI * arc) * 140;
  const cloudFill = night
    ? "rgba(60,72,100,.55)"
    : phase === "day"
      ? grey
        ? "rgba(225,230,238,.92)"
        : "rgba(255,255,255,.95)"
      : "rgba(255,200,180,.75)";
  const clouds = { clear: 1, cloudy: 3, fog: 3, rain: 4, storm: 4 }[sky];
  const wet = sky === "rain" || sky === "storm";
  const farFill = night ? "#0d1428" : phase === "day" ? "#7d8ca6" : "#5a4f6b";
  const nearFill = night ? "#070b17" : phase === "day" ? "#53627b" : "#3a3248";
  const trackFill = night ? "#0a1022" : phase === "day" ? "#66738b" : "#463c55";

  return (
    <svg viewBox="0 0 360 230" aria-hidden className="h-auto w-full overflow-visible">
      <defs>
        <linearGradient id="ws-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} className="transition-[stop-color] duration-1000" />
          <stop offset=".55" stopColor={mid} className="transition-[stop-color] duration-1000" />
          <stop offset="1" stopColor={bottom} className="transition-[stop-color] duration-1000" />
        </linearGradient>
        <radialGradient id="ws-sun">
          <stop offset="0" stopColor="#fffaf0" stopOpacity=".95" />
          <stop offset=".18" stopColor="#fff1c8" stopOpacity=".55" />
          <stop offset=".5" stopColor="#ffe3a0" stopOpacity=".16" />
          <stop offset="1" stopColor="#ffe3a0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ws-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={phase === "day" ? "#eef4fb" : "#ffd2b0"} stopOpacity="0" />
          <stop offset="1" stopColor={phase === "day" ? "#eef4fb" : "#ffd2b0"} stopOpacity={grey ? 0.25 : 0.45} />
        </linearGradient>
        <filter id="ws-bloom" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <radialGradient id="ws-moon">
          <stop offset="0" stopColor="#dbe6ff" stopOpacity=".35" />
          <stop offset="1" stopColor="#dbe6ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ws-shoot" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ws-glare" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".1" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="ws-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <clipPath id="ws-glass">
          <rect x="12" y="12" width="336" height="200" rx="3" />
        </clipPath>
      </defs>

      <g clipPath="url(#ws-glass)">
        <rect x="0" y="0" width="360" height="230" fill="url(#ws-sky)" />

        {(night || phase === "dawn" || phase === "dusk") &&
          STARS.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.s}
              fill="#fff"
              opacity={night ? 0.9 : 0.35}
              className="a-twinkle"
              style={{ animationDelay: `${s.d}s`, animationDuration: `${2 + s.d}s` }}
            />
          ))}
        {night && sky === "clear" && (
          <g className="a-shoot">
            <line x1="250" y1="30" x2="290" y2="10" stroke="url(#ws-shoot)" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        )}

        {night && (
          <g className="a-plane">
            <circle cx="0" cy="44" r="1.4" fill="#ff6b6b" className="a-beacon" />
            <circle cx="-5" cy="44" r="1" fill="#fff" className="a-beacon" style={{ animationDelay: ".6s" }} />
          </g>
        )}

        {isDay ? (
          <g opacity={grey ? 0.5 : 1}>
            <circle cx={sx} cy={sy} r="80" fill="url(#ws-sun)" />
            <circle cx={sx} cy={sy} r="15" fill="#fff6dc" opacity=".7" filter="url(#ws-bloom)" />
            <circle cx={sx} cy={sy} r="8.5" fill="#fffdf6" />
          </g>
        ) : (
          <g opacity={grey ? 0.55 : 1}>
            <circle cx={sx} cy={sy} r="34" fill="url(#ws-moon)" />
            <circle cx={sx} cy={sy} r="11" fill="#eef2fb" />
            <circle cx={sx - 3} cy={sy - 3} r="2.4" fill="#cfd7e8" />
            <circle cx={sx + 4} cy={sy + 2} r="1.6" fill="#cfd7e8" />
            <circle cx={sx - 1} cy={sy + 5} r="1.1" fill="#cfd7e8" />
          </g>
        )}

        {Array.from({ length: clouds }, (_, i) => (
          <Cloud
            key={i}
            y={30 + ((i * 37) % 90)}
            s={0.55 + ((i * 0.23) % 0.5)}
            fill={wet ? "rgba(120,130,148,.85)" : cloudFill}
            dur={70 + i * 25}
            delay={-(i * 31) - 12}
          />
        ))}

        {phase !== "night" && !wet && (
          <g className="a-birds">
            {[
              [0, 0],
              [14, 6],
              [26, -4],
            ].map(([x, y], i) => (
              <path
                key={i}
                d={`M${x} ${80 + y}q4 -4 7 0q3 -4 7 0`}
                fill="none"
                stroke={phase === "day" ? "#2b3445" : "#2a1f2e"}
                strokeWidth="1.3"
                strokeLinecap="round"
                className="a-flap"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </g>
        )}

        {phase !== "night" && <rect x="0" y="96" width="360" height="124" fill="url(#ws-haze)" />}

        {/* Bengaluru skyline */}
        {FAR.map((b, i) => (
          <rect key={i} x={b.x} y={220 - b.h - 20} width={b.w} height={b.h + 20} fill={farFill} className="transition-[fill] duration-1000" />
        ))}
        {NEAR.map((b, i) => (
          <rect key={i} x={b.x} y={220 - b.h} width={b.w} height={b.h} fill={nearFill} className="transition-[fill] duration-1000" />
        ))}
        {phase !== "day" &&
          LIGHTS.map((l, i) => (
            <rect
              key={i}
              x={l.x}
              y={l.y}
              width="3"
              height="3"
              fill="#ffcf73"
              opacity={night ? 0.85 : 0.5}
              className="a-lights"
              style={{ animationDelay: `${l.d}s` }}
            />
          ))}

        {/* Namma Metro: elevated double track in front of the skyline, trains both ways */}
        <rect x="0" y="182" width="360" height="5" fill={trackFill} className="transition-[fill] duration-1000" />
        <rect x="0" y="182" width="360" height="1" fill={night ? "#26304d" : "#9aa5b8"} opacity=".7" />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={14 + i * 47} y="187" width="4" height="40" fill={trackFill} className="transition-[fill] duration-1000" />
        ))}
        <g className="a-metro-back" opacity=".85">
          <Train night={night} y={174} facing="left" />
        </g>
        <g className="a-metro">
          <Train night={night} y={173} facing="right" />
        </g>

        {sky === "fog" && <rect x="0" y="110" width="360" height="120" fill="#dfe3ea" opacity=".35" filter="url(#ws-soft)" />}
        {wet && (
          <>
            <g className="a-rain" stroke="#b9d3f2" strokeWidth="1" strokeLinecap="round" opacity=".55">
              {Array.from({ length: 40 }, (_, i) => (
                <line key={i} x1={(i * 37) % 360} y1={(i * 53) % 200} x2={((i * 37) % 360) - 4} y2={((i * 53) % 200) + 12} />
              ))}
            </g>
            {[40, 96, 150, 210, 268, 318].map((x, i) => (
              <circle key={x} cx={x} cy={30 + (i % 3) * 20} r="1.8" fill="#dce9f8" opacity=".7" className="a-drip" style={{ animationDelay: `${i * 0.7}s` }} />
            ))}
          </>
        )}
        {sky === "storm" && <rect x="0" y="0" width="360" height="230" fill="#fff" className="a-flash" />}

        <polygon points="12,12 150,12 60,212 12,212" fill="url(#ws-glare)" />
      </g>

      {/* frame, mullions, sill */}
      <rect x="6" y="6" width="348" height="212" rx="6" fill="none" stroke="#2a2f38" strokeWidth="12" />
      <rect x="6" y="6" width="348" height="212" rx="6" fill="none" stroke="#3a404b" strokeWidth="1.5" />
      <line x1="124" y1="12" x2="124" y2="212" stroke="#2a2f38" strokeWidth="6" />
      <line x1="236" y1="12" x2="236" y2="212" stroke="#2a2f38" strokeWidth="6" />
      <line x1="12" y1="78" x2="348" y2="78" stroke="#2a2f38" strokeWidth="5" />
      <rect x="-4" y="214" width="368" height="10" rx="3" fill="#30363f" />

      {/* curtains */}
      <path className="a-sway" d="M-14 -6H30C26 60 34 140 24 230H-14Z" fill="#3a2f33" opacity=".95" />
      <path className="a-sway" style={{ animationDelay: "-3s" }} d="M374 -6H330C334 60 326 140 336 230H374Z" fill="#3a2f33" opacity=".95" />
      {phase !== "night" && (
        <g fill="none" stroke={phase === "day" ? "#fff2d6" : "#ffc59a"} strokeOpacity=".35" strokeWidth="2">
          <path className="a-sway" d="M30 -6C26 60 34 140 24 230" />
          <path className="a-sway" style={{ animationDelay: "-3s" }} d="M330 -6C334 60 326 140 336 230" />
        </g>
      )}
      <rect x="-18" y="-10" width="396" height="6" rx="3" fill="#1d2027" />
    </svg>
  );
}

function Desk({ awake, phase, isDay, arc }: { awake: boolean; phase: Phase; isDay: boolean; arc: number }) {
  const lampOn = awake && phase !== "day";
  // Light comes from the window behind the desk, so shadows fall towards the viewer, nudged away from the sun.
  const shift = isDay ? (0.5 - arc) * 14 : 0;
  const shadow = isDay ? 0.55 : 0.4;
  const rim = phase === "night" ? null : phase === "day" ? "#fff3d9" : "#ffc59a";
  const sheenX = 12 + (30 + arc * 300) * 1.04;
  return (
    <svg viewBox="0 0 400 400" aria-hidden className="absolute inset-0 size-full">
      <defs>
        <linearGradient id="ws-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b4a33" />
          <stop offset="1" stopColor="#2e2017" />
        </linearGradient>
        <radialGradient id="ws-glow">
          <stop offset="0" stopColor="var(--color-accent)" stopOpacity=".3" />
          <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ws-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a3424" />
          <stop offset="1" stopColor="#7a5a40" />
        </linearGradient>
        <radialGradient id="ws-sheen">
          <stop offset="0" stopColor={phase === "day" ? "#fff4dc" : "#ffc290"} stopOpacity=".45" />
          <stop offset="1" stopColor={phase === "day" ? "#fff4dc" : "#ffc290"} stopOpacity="0" />
        </radialGradient>
        <filter id="ws-shadow" x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <linearGradient id="ws-hoodie" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a3644" />
          <stop offset="1" stopColor="#121820" />
        </linearGradient>
        <radialGradient id="ws-lamp">
          <stop offset="0" stopColor="#ffd28a" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffd28a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ws-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd28a" stopOpacity=".3" />
          <stop offset="1" stopColor="#ffd28a" stopOpacity="0" />
        </linearGradient>
        <clipPath id="ws-screen">
          <rect x="136" y="242" width="178" height="92" rx="2" />
        </clipPath>
      </defs>

      {/* desk top, window sheen on it, and contact shadows */}
      <rect x="-10" y="338" width="420" height="15" fill="url(#ws-top)" />
      {isDay && <ellipse cx={sheenX} cy="345" rx="140" ry="7" fill="url(#ws-sheen)" />}
      <g fill="#000" opacity={shadow} filter="url(#ws-shadow)">
        <ellipse cx={223 + shift} cy="352" rx="36" ry="3.5" />
        <ellipse cx={108 + shift} cy="351" rx="12" ry="2.5" />
        <ellipse cx={85 + shift} cy="351.5" rx="11" ry="2.5" />
        <ellipse cx={39 + shift} cy="351.5" rx="15" ry="2.5" />
      </g>

      {/* monitor */}
      {awake && <ellipse cx="226" cy="290" rx="150" ry="90" fill="url(#ws-glow)" opacity={phase === "day" ? 0.35 : 1} />}
      <rect x="216" y="336" width="14" height="18" fill="#2a2f38" />
      <ellipse cx="223" cy="354" rx="32" ry="4" fill="#2a2f38" />
      <rect x="130" y="236" width="190" height="104" rx="7" fill="#0a0d12" stroke="#2c323c" strokeWidth="3" />
      <g clipPath="url(#ws-screen)">
        {awake ? (
          <>
            <rect x="136" y="242" width="178" height="92" fill="#0d1117" />
            <rect x="136" y="242" width="178" height="8" fill="#161b22" />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={141 + i * 5} cy="246" r="1.6" fill={["#f87171", "#fbbf24", "#4ade80"][i]} />
            ))}
            <rect x="136" y="250" width="30" height="84" fill="#12161d" />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <rect key={i} x={140 + (i % 3 === 0 ? 0 : 4)} y={256 + i * 9} width={14 + (i % 2) * 6} height="3" rx="1.5" fill="#3b4250" />
            ))}
            <g className="a-scroll">
              {[0, 1].map((copy) =>
                [
                  [0, 50, "#7dd3fc"],
                  [6, 34, "var(--color-accent)"],
                  [12, 70, "#c4b5fd"],
                  [12, 44, "#fdba74"],
                  [6, 28, "var(--color-accent)"],
                  [12, 58, "#7dd3fc"],
                  [6, 20, "#c4b5fd"],
                  [0, 12, "var(--color-accent)"],
                ].map(([indent, w, c], i) => (
                  <g key={`${copy}-${i}`}>
                    <rect x="171" y={256 + copy * 72 + i * 9} width="5" height="3" rx="1" fill="#30363d" />
                    <rect x={180 + Number(indent)} y={256 + copy * 72 + i * 9} width={w} height="3" rx="1.5" fill={String(c)} opacity=".9" />
                  </g>
                )),
              )}
            </g>
            <rect x="214" y="318" width="2" height="6" fill="var(--color-accent)" className="a-blink" />
            <g className="a-toast">
              <rect x="246" y="316" width="62" height="13" rx="3" fill="#0f1a12" stroke="var(--color-accent)" strokeOpacity=".7" />
              <text x="252" y="325" fontSize="6.5" fontWeight="700" fill="var(--color-accent)" fontFamily="var(--font-mono)">
                {"\u2713 Deployed"}
              </text>
            </g>
          </>
        ) : (
          <rect x="136" y="242" width="178" height="92" fill="#040507" />
        )}
      </g>

      {/* desk */}
      <rect x="-10" y="352" width="420" height="60" fill="url(#ws-wood)" />
      <line x1="-10" y1="352.5" x2="410" y2="352.5" stroke="#8a6a4f" strokeOpacity=".6" />

      {/* small plant */}
      <path d="M26 322H52L49 352H29Z" fill="#c26a4a" />
      <path d="M38 322C30 306 20 300 10 300C16 312 26 320 38 322Z" fill="#3c8350" />
      <path d="M40 322C40 302 48 290 58 286C58 302 50 316 40 322Z" fill="#4c9a5f" />
      <path d="M37 322C34 306 36 292 42 282C44 298 42 312 37 322Z" fill="#3c8350" />

      {/* mug */}
      <rect x="76" y="332" width="16" height="20" rx="3" fill="var(--color-accent)" />
      <path d="M92 337a5 5 0 0 1 0 10" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
      {awake &&
        [0, 1].map((i) => (
          <path
            key={i}
            d={`M${80 + i * 6} 327c-3 -4 3 -6 0 -10`}
            fill="none"
            stroke="var(--color-muted)"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="a-steam"
            style={{ animationDelay: `${i * 1.2}s` }}
          />
        ))}

      {/* desk lamp */}
      {lampOn && (
        <>
          <polygon points="114,292 134,290 160,352 92,352" fill="url(#ws-cone)" />
          <ellipse cx="124" cy="354" rx="44" ry="9" fill="url(#ws-lamp)" />
        </>
      )}
      <ellipse cx="108" cy="351" rx="10" ry="2.5" fill="#262a31" />
      <path d="M108 350L102 306L124 288" fill="none" stroke="#2f343d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M118 282L136 292L130 298L114 288Z" fill="#3a404b" />
      {lampOn && <circle cx="126" cy="294" r="2.5" fill="#ffe2a8" />}

      {/* notebook + pen, phone */}
      <path d="M14 370L70 366L76 384L18 389Z" fill="#e9e3d5" />
      {[0, 1, 2].map((i) => (
        <line key={i} x1={22} y1={373 + i * 4.5} x2={68} y2={369.5 + i * 4.5} stroke="#c8bfae" strokeWidth=".8" />
      ))}
      <line x1="30" y1="392" x2="66" y2="380" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
      <path d="M112 374L138 372L141 382L114 384Z" fill="#111418" stroke="#2c323c" />
      <path d="M115 376L136 374.5L138 380.5L116.5 382Z" fill="var(--color-accent)" className={awake ? "a-notify" : "opacity-0"} />

      {/* keyboard + mouse */}
      <g fill="#000" opacity={shadow} filter="url(#ws-shadow)">
        <ellipse cx={226 + shift} cy="371" rx="66" ry="3" />
        <ellipse cx={310 + shift} cy="369" rx="8" ry="2" />
        <ellipse cx={127 + shift} cy="384" rx="16" ry="2" />
        <ellipse cx={46 + shift} cy="389" rx="32" ry="2.5" />
      </g>
      <path d="M168 358H284L290 370H162Z" fill="#1b2029" />
      <path d="M174 362H280" stroke="#2c323c" strokeWidth="2" strokeDasharray="4 2" />
      <ellipse cx="310" cy="365" rx="7" ry="4" fill="#1b2029" />

      {awake ? (
        <g>
          {/* me, from behind: typing elbows, breathing, an occasional glance away */}
          <ellipse cx="266" cy="362" rx="14" ry="10" fill={HOODIE} className="a-elbow" />
          <ellipse cx="394" cy="362" rx="14" ry="10" fill={HOODIE} className="a-elbow" style={{ animationDelay: "-.14s" }} />
          <g className="a-look">
            <rect x="320" y="294" width="20" height="26" fill="#94603f" />
            <ellipse cx="305" cy="283" rx="5" ry="8" fill={SKIN} />
            <ellipse cx="355" cy="283" rx="5" ry="8" fill={SKIN} />
            <ellipse cx="330" cy="280" rx="25" ry="29" fill={SKIN} />
            <path d="M304 280C302 252 316 242 330 242C346 242 358 254 356 280C354 292 346 300 330 300C314 300 306 292 304 280Z" fill={HAIR} />
            <path className="a-flicker" d="M306 276C304 258 314 246 328 244" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
            <line x1="298" y1="279" x2="309" y2="280" stroke="#0b0d10" strokeWidth="2" strokeLinecap="round" />
            <line x1="351" y1="280" x2="362" y2="279" stroke="#0b0d10" strokeWidth="2" strokeLinecap="round" />
            <path d="M318 252C324 248 334 248 340 252" fill="none" stroke="#2c2420" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M314 262C322 257 338 257 346 262" fill="none" stroke="#2c2420" strokeWidth="1.2" strokeLinecap="round" />
            {rim && (
              <path d="M306 266C308 250 320 242 331 242C344 242 354 251 355 266" fill="none" stroke={rim} strokeOpacity=".75" strokeWidth="1.8" strokeLinecap="round" />
            )}
            {/* headphones */}
            <path d="M303 282C300 246 360 246 357 282" fill="none" stroke="#0e1014" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="303" cy="285" rx="7" ry="11" fill="#1a1d23" stroke="var(--color-accent)" strokeOpacity=".5" />
            <ellipse cx="357" cy="285" rx="7" ry="11" fill="#1a1d23" stroke="var(--color-accent)" strokeOpacity=".5" />
          </g>
          <g className="a-breathe">
            <path d="M256 410C256 352 286 320 330 318C374 320 404 352 404 410Z" fill="url(#ws-hoodie)" />
            <path d="M300 324C306 304 354 304 360 324C352 336 308 336 300 324Z" fill="#26323e" />
            <path className="a-flicker" d="M262 378C266 346 290 326 318 320" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
            {rim && (
              <g fill="none" stroke={rim} strokeOpacity=".6" strokeWidth="1.8" strokeLinecap="round">
                <path d="M300 324C306 306 354 306 360 324" />
                <path d="M342 320C372 326 396 348 401 380" />
              </g>
            )}
          </g>
          <rect x="290" y="364" width="100" height="50" rx="18" fill="#14171c" stroke="#262a31" />
        </g>
      ) : (
        <g>
          {/* empty chair, hoodie draped over it */}
          <rect x="286" y="298" width="98" height="116" rx="22" fill="#14171c" stroke="#262a31" />
          <rect x="300" y="290" width="70" height="16" rx="8" fill="#191c22" stroke="#262a31" />
          <path d="M296 340C320 330 352 330 374 340" fill="none" stroke={HOODIE} strokeWidth="14" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

/**
 * Daylight from the window behind the desk: bloom around the sun that spills over the frame,
 * soft shafts falling towards the viewer, and dust drifting in them.
 */
function Daylight({ phase, arc, strength }: { phase: Phase; arc: number; strength: number }) {
  const warm = phase === "day" ? "255,244,214" : "255,182,128";
  // Sun position in the scene, as a percentage (window: left 3%, top 3%, 94% wide, 360x230 viewBox).
  const sunX = 3 + ((30 + arc * 300) / 360) * 94;
  const sunY = 3 + ((182 - Math.sin(Math.PI * arc) * 140) / 230) * 60;
  const lean = (0.5 - arc) * 18;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ opacity: strength }}>
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(38% 34% at ${sunX}% ${sunY}%, rgba(${warm},.38), rgba(${warm},.08) 55%, transparent 75%)` }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom, transparent 40%, rgba(${warm},.1) 62%, transparent 95%)` }}
      />
      <svg viewBox="0 0 400 400" className="absolute inset-0 size-full">
        <defs>
          <linearGradient id="ws-shaft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={`rgb(${warm})`} stopOpacity=".16" />
            <stop offset="1" stopColor={`rgb(${warm})`} stopOpacity="0" />
          </linearGradient>
          <filter id="ws-shaft-blur" x="-50%" y="-20%" width="200%" height="140%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        <g filter="url(#ws-shaft-blur)" className="a-ray">
          {[90, 200, 300].map((x) => (
            <polygon key={x} points={`${x},70 ${x + 50},70 ${x + 80 + lean * 3},400 ${x - 30 + lean * 3},400`} fill="url(#ws-shaft)" />
          ))}
        </g>
        {Array.from({ length: 16 }, (_, i) => {
          const t = (i * 0.618) % 1;
          const y = 120 + ((i * 53) % 200);
          const x = 80 + ((i * 97) % 250) + lean * 3 * (y / 400);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={0.6 + t * 0.9}
              fill={`rgb(${warm})`}
              opacity=".6"
              className="a-dust"
              style={{ animationDelay: `${-i * 0.9}s`, animationDuration: `${8 + t * 6}s` }}
            />
          );
        })}
      </svg>
    </div>
  );
}

const WALL: Record<Phase, string> = {
  night: "bg-[linear-gradient(#171a21,#0d0f14)]",
  dawn: "bg-[linear-gradient(#2c2429,#141317)]",
  day: "bg-[linear-gradient(#323740,#181b20)]",
  dusk: "bg-[linear-gradient(#2c2429,#141317)]",
};

const SHADE: Record<Phase, string> = {
  night: "bg-[#02040a]/35",
  dawn: "bg-[#2a1630]/15",
  day: "",
  dusk: "bg-[#2a1630]/20",
};

/** My home desk by a big window onto Bengaluru, mirroring the real time of day and weather. */
export function WorkspaceScene({ awake, phase, isDay, sky, arc, time, label, px, py }: Props) {
  const back = useDepth(px, py, -10);
  const front = useDepth(px, py, 14);
  const daylight = !isDay ? 0 : sky === "clear" ? 1 : sky === "cloudy" ? 0.65 : 0.35;

  return (
    <div
      role="img"
      aria-label={`Illustration: ${awake ? "Nirmal coding at his desk" : "Nirmal's empty desk"} beside a window onto Bengaluru, showing the current ${phase} sky`}
      className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-[#0f1116]"
    >
      <div aria-hidden className={`absolute inset-0 transition-colors duration-1000 ${WALL[phase]}`} />

      <m.div style={back} className="absolute left-[3%] top-[3%] w-[94%]">
        <BigWindow phase={phase} isDay={isDay} sky={sky} arc={arc} />
      </m.div>


      <m.div style={front} className="absolute -inset-2">
        <Desk awake={awake} phase={phase} isDay={isDay} arc={arc} />
      </m.div>

      {daylight > 0 && <Daylight phase={phase} arc={arc} strength={daylight} />}

      {SHADE[phase] && <div aria-hidden className={`pointer-events-none absolute inset-0 transition-colors duration-1000 ${SHADE[phase]}`} />}

      <p className="absolute left-1/2 top-[1.5%] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-black/55 px-3 py-1 text-[0.65rem] font-semibold text-white backdrop-blur-md sm:text-xs">
        <span aria-hidden className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
        {label}
        <span className="font-mono tabular-nums text-white/80" suppressHydrationWarning>
          {time}
        </span>
      </p>
    </div>
  );
}
