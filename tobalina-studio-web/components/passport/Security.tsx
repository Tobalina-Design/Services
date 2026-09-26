// Elementos de seguridad de pasaporte: guilloché (roseta + ondas) y fibras.
// Las geometrías se generan una vez y se definen como <symbol> reutilizable,
// para no inflar el HTML repitiendo miles de puntos en cada página.
import type { CSSProperties } from "react";

const TAU = Math.PI * 2;
const r1 = (n: number) => Math.round(n * 10) / 10;

function polar(fn: (t: number) => number, cx: number, cy: number, step = 0.05) {
  let d = "";
  for (let t = 0; t <= TAU + step; t += step) {
    const r = fn(t);
    d += `${d ? "L" : "M"}${r1(cx + r * Math.cos(t))} ${r1(cy + r * Math.sin(t))}`;
  }
  return d + "Z";
}

const ROSETTE: string[] = [
  ...Array.from({ length: 18 }, (_, i) => {
    const p = (i * TAU) / 18;
    return polar((t) => 150 + 30 * Math.sin(9 * t + p) + 12 * Math.sin(3 * t - p), 200, 200);
  }),
  ...Array.from({ length: 12 }, (_, i) => {
    const p = (i * TAU) / 12;
    return polar((t) => 72 + 18 * Math.sin(12 * t + p), 200, 200);
  }),
];

const WAVES: string[] = Array.from({ length: 18 }, (_, i) => {
  let d = "";
  for (let x = 0; x <= 400; x += 8) {
    const y = 12 + i * 22 + 9 * Math.sin(x * 0.035 + i * 0.5) + 4 * Math.sin(x * 0.09 - i);
    d += `${d ? "L" : "M"}${x} ${r1(y)}`;
  }
  return d;
});

export function SecurityDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <symbol id="g-rosette" viewBox="0 0 400 400">
          {ROSETTE.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth="0.45" />
          ))}
        </symbol>
        <symbol id="g-waves" viewBox="0 0 400 400" preserveAspectRatio="none">
          {WAVES.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </symbol>
      </defs>
    </svg>
  );
}

export function Rosette({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} aria-hidden="true">
      <use href="#g-rosette" width="100%" height="100%" />
    </svg>
  );
}

export function Waves({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} preserveAspectRatio="none" aria-hidden="true">
      <use href="#g-waves" width="100%" height="100%" />
    </svg>
  );
}

// Fibras de seguridad: trazos cortos pseudoaleatorios (semilla fija por página
// para que servidor y cliente generen lo mismo). Brillan en modo UV.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Fibers({ seed }: { seed: number }) {
  const rand = mulberry32(seed * 9973);
  const fibers = Array.from({ length: 26 }, () => {
    const x = rand() * 100;
    const y = rand() * 100;
    const a = rand() * TAU;
    const len = 1.2 + rand() * 2.2;
    const x2 = x + Math.cos(a) * len;
    const y2 = y + Math.sin(a) * len;
    const cx = (x + x2) / 2 + (rand() - 0.5) * 1.6;
    const cy = (y + y2) / 2 + (rand() - 0.5) * 1.6;
    return `M${r1(x)} ${r1(y)}Q${r1(cx)} ${r1(cy)} ${r1(x2)} ${r1(y2)}`;
  });
  return (
    <svg
      className="fibers pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {fibers.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="var(--pg-fiber)"
          strokeWidth="0.9"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
