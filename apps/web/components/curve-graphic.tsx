type Props = {
  tall?: boolean;
  caption?: string;
};

export function CurveGraphic({ tall = false, caption = "price vs tokens sold" }: Props) {
  const w = 400;
  const h = tall ? 460 : 300;
  const pad = { l: 44, r: 18, t: 22, b: 36 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;

  const points: [number, number][] = [];
  for (let i = 0; i <= 48; i++) {
    const t = i / 48;
    const x = pad.l + t * innerW;
    const yNorm = 1 - (0.08 + 0.92 * (t * t * 0.55 + t * t * t * 0.45));
    const y = pad.t + yNorm * innerH;
    points.push([x, y]);
  }
  const d = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const last = points[Math.floor(points.length * 0.72)];
  const area = `${d} L ${pad.l + innerW} ${pad.t + innerH} L ${pad.l} ${pad.t + innerH} Z`;

  const gridX = [0.25, 0.5, 0.75, 1];
  const gridY = [0.25, 0.5, 0.75, 1];

  return (
    <figure className="frame overflow-hidden bg-cream">
      <svg viewBox={`0 0 ${w} ${h}`} className="block h-auto w-full" role="img" aria-label="Bonding curve">
        <rect width={w} height={h} fill="#f4efe0" />
        {gridX.map((g) => (
          <line
            key={`x${g}`}
            x1={pad.l + g * innerW}
            x2={pad.l + g * innerW}
            y1={pad.t}
            y2={pad.t + innerH}
            stroke="#d8d0b8"
            strokeWidth="1"
          />
        ))}
        {gridY.map((g) => (
          <line
            key={`y${g}`}
            x1={pad.l}
            x2={pad.l + innerW}
            y1={pad.t + (1 - g) * innerH}
            y2={pad.t + (1 - g) * innerH}
            stroke="#d8d0b8"
            strokeWidth="1"
          />
        ))}
        <line x1={pad.l} x2={pad.l} y1={pad.t} y2={pad.t + innerH} stroke="#1b2c21" strokeWidth="1.25" />
        <line
          x1={pad.l}
          x2={pad.l + innerW}
          y1={pad.t + innerH}
          y2={pad.t + innerH}
          stroke="#1b2c21"
          strokeWidth="1.25"
        />
        <path d={area} fill="#3a5f45" fillOpacity="0.1" />
        <path d={d} fill="none" stroke="#3a5f45" strokeWidth="2.25" strokeLinejoin="round" />
        <circle cx={last[0]} cy={last[1]} r="4.5" fill="#c4a227" stroke="#1b2c21" strokeWidth="1" />
        <text x={pad.l - 10} y={pad.t + 8} fill="#6b6556" fontSize="10" textAnchor="end" fontFamily="ui-sans-serif">
          price
        </text>
        <text
          x={pad.l + innerW}
          y={pad.t + innerH + 22}
          fill="#6b6556"
          fontSize="10"
          textAnchor="end"
          fontFamily="ui-sans-serif"
        >
          sold
        </text>
      </svg>
      <figcaption className="border-t border-rule px-4 py-2.5 font-ui text-[11px] uppercase tracking-[0.14em] text-mist">
        {caption}
      </figcaption>
    </figure>
  );
}
