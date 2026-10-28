import type { ProjectVisual as Kind } from "@/content/projects";

const CANDLES = [
  [268, 250, 280, 244],
  [250, 258, 262, 246],
  [258, 226, 262, 220],
  [226, 232, 240, 222],
  [232, 196, 236, 190],
  [196, 208, 214, 190],
  [208, 170, 212, 164],
  [170, 160, 176, 154],
  [160, 140, 164, 134],
] as const;

function Learning() {
  const cards = [
    { x: 24, w: 96, p: 132 },
    { x: 200, w: 110, p: 132 },
    { x: 376, w: 84, p: 132 },
  ];
  return (
    <>
      <rect x="24" y="22" width="90" height="12" rx="6" fill="var(--color-ink)" opacity=".85" />
      <rect x="488" y="18" width="48" height="20" rx="10" fill="var(--color-accent)" />
      <rect x="24" y="62" width="260" height="22" rx="6" fill="var(--color-ink)" />
      <rect x="24" y="92" width="200" height="22" rx="6" fill="var(--color-ink)" />
      <rect x="24" y="128" width="230" height="9" rx="4.5" fill="var(--color-muted)" opacity=".5" />
      <rect x="24" y="144" width="170" height="9" rx="4.5" fill="var(--color-muted)" opacity=".5" />
      <rect x="24" y="168" width="104" height="30" rx="15" fill="var(--color-accent)" />
      <rect x="320" y="58" width="216" height="142" rx="14" fill="var(--color-raised)" />
      <polyline
        points="336,176 370,160 398,168 430,128 460,138 490,96 520,84"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {cards.map((c, i) => (
        <g key={c.x}>
          <rect x={c.x} y="222" width="160" height="88" rx="12" fill="var(--color-bg)" stroke="var(--color-line-strong)" />
          <rect x={c.x + 14} y="238" width={c.w} height="10" rx="5" fill="var(--color-ink)" opacity=".8" />
          <rect x={c.x + 14} y="256" width={60 + i * 8} height="8" rx="4" fill="var(--color-muted)" opacity=".45" />
          <rect x={c.x + 14} y="284" width="132" height="8" rx="4" fill="var(--color-line-strong)" />
          <rect x={c.x + 14} y="284" width={c.p - i * 30} height="8" rx="4" fill="var(--color-accent)" />
        </g>
      ))}
    </>
  );
}

function Research() {
  return (
    <>
      <rect x="24" y="22" width="300" height="30" rx="15" fill="var(--color-bg)" stroke="var(--color-line-strong)" />
      <circle cx="44" cy="37" r="6" fill="none" stroke="var(--color-muted)" strokeWidth="2" />
      <rect x="58" y="33" width="120" height="8" rx="4" fill="var(--color-muted)" opacity=".4" />
      <rect x="24" y="72" width="120" height="14" rx="7" fill="var(--color-ink)" opacity=".85" />
      <rect x="24" y="94" width="70" height="20" rx="6" fill="var(--color-ink)" />
      <rect x="102" y="98" width="46" height="14" rx="7" fill="var(--color-accent)" opacity=".25" />
      {[150, 200, 250, 300].map((y) => (
        <line key={y} x1="24" x2="356" y1={y} y2={y} stroke="var(--color-line-strong)" />
      ))}
      {CANDLES.map(([open, close, high, low], i) => {
        const x = 52 + i * 36;
        const up = close < open;
        const color = up ? "var(--color-accent)" : "var(--color-faint)";
        return (
          <g key={x} opacity=".55">
            <line x1={x} x2={x} y1={low} y2={high} stroke={color} strokeWidth="2" />
            <rect x={x - 6} y={Math.min(open, close)} width="12" height={Math.max(4, Math.abs(open - close))} rx="2" fill={color} />
          </g>
        );
      })}
      <polyline
        points="34,268 70,250 106,258 142,226 178,232 214,196 250,208 286,170 322,160 350,140"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="380" y="72" width="156" height="236" rx="12" fill="var(--color-bg)" stroke="var(--color-line-strong)" />
      <rect x="394" y="88" width="70" height="9" rx="4.5" fill="var(--color-ink)" opacity=".8" />
      {[1, 0, 1, 1, 0, 1].map((up, i) => (
        <g key={i}>
          <rect x="394" y={116 + i * 31} width={56 + (i % 3) * 10} height="8" rx="4" fill="var(--color-muted)" opacity=".45" />
          <rect
            x="486"
            y={113 + i * 31}
            width="36"
            height="14"
            rx="7"
            fill={up ? "var(--color-accent)" : "var(--color-faint)"}
            opacity=".3"
          />
        </g>
      ))}
    </>
  );
}

/** Schematic stand-in used until a real screenshot is added to the project data. */
export function ProjectVisual({ kind, label }: { kind: Kind; label: string }) {
  return (
    <svg viewBox="0 0 560 330" role="img" aria-label={label} className="h-auto w-full">
      {kind === "learning" ? <Learning /> : <Research />}
    </svg>
  );
}
