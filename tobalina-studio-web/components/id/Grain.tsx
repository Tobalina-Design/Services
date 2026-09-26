"use client";

// Grano de fondo: "ruido" visual que el cursor silencia a su paso.
// Sin cursor (móvil o inactividad) el claro de silencio deriva solo, despacio.
import { useEffect, useRef } from "react";

const TILE = 180;
const TILES = 4;
const FPS = 24;

function makeTiles(rgb: [number, number, number]) {
  return Array.from({ length: TILES }, () => {
    const c = document.createElement("canvas");
    c.width = c.height = TILE;
    const ctx = c.getContext("2d")!;
    const img = ctx.createImageData(TILE, TILE);
    for (let i = 0; i < img.data.length; i += 4) {
      const on = Math.random() < 0.28;
      img.data[i] = rgb[0];
      img.data[i + 1] = rgb[1];
      img.data[i + 2] = rgb[2];
      img.data[i + 3] = on ? 18 + Math.random() * 46 : 0;
    }
    ctx.putImageData(img, 0, 0);
    return c;
  });
}

function parseRgb(color: string): [number, number, number] {
  const m = color.match(/\d+/g);
  return m ? [+m[0], +m[1], +m[2]] : [35, 46, 44];
}

export default function Grain({ className = "", reduce = false }: { className?: string; reduce?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0,
      h = 0,
      raf = 0,
      last = 0,
      color = "",
      tiles: HTMLCanvasElement[] = [];
    const spot = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let lastPointer = -1e9;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w;
      canvas.height = h;
    };
    const refreshColor = () => {
      const c = getComputedStyle(canvas).color;
      if (c !== color) {
        color = c;
        tiles = makeTiles(parseRgb(c));
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      spot.tx = (e.clientX - r.left) / r.width;
      spot.ty = (e.clientY - r.top) / r.height;
      lastPointer = performance.now();
    };

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 1000 / FPS || document.hidden) return;
      last = t;
      if (Math.floor(t / 1000) !== Math.floor((t - 1000 / FPS) / 1000)) refreshColor();

      // Sin cursor reciente: el claro deriva en una trayectoria lenta
      if (t - lastPointer > 2500) {
        spot.tx = 0.5 + 0.28 * Math.sin(t * 0.00021);
        spot.ty = 0.55 + 0.16 * Math.sin(t * 0.00033 + 1);
      }
      spot.x += (spot.tx - spot.x) * 0.08;
      spot.y += (spot.ty - spot.y) * 0.08;

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      const tile = tiles[Math.floor(Math.random() * TILES)];
      if (!tile) return;
      const pat = ctx.createPattern(tile, "repeat")!;
      ctx.save();
      ctx.translate(-Math.random() * TILE, -Math.random() * TILE);
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, w + TILE, h + TILE);
      ctx.restore();

      // Silencio: se borra el grano alrededor del cursor
      const R = Math.min(w, h) * 0.42;
      const g = ctx.createRadialGradient(spot.x * w, spot.y * h, 0, spot.x * w, spot.y * h, R);
      g.addColorStop(0, "rgba(0,0,0,1)");
      g.addColorStop(0.55, "rgba(0,0,0,0.85)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    resize();
    refreshColor();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onPointer);
    if (reduce) {
      draw(1e6);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, [reduce]);

  return <canvas ref={ref} aria-hidden="true" className={`grain pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
