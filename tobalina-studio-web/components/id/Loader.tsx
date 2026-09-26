"use client";

// Pantalla de carga: "verificando identidad". Espera a fuentes y carga completa
// (con un mínimo para que la animación respire) y sale como un telón que sube.
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MIN_MS = 1700;

export default function Loader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let ready = false;
    let p = 0;
    let raf = 0;
    const loaded = new Promise<void>((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", () => r(), { once: true })));
    Promise.all([document.fonts?.ready ?? Promise.resolve(), loaded]).then(() => (ready = true));

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / MIN_MS);
      const goal = ready ? t : Math.min(t, 0.9);
      p += (goal - p) * 0.09;
      setPct(Math.round(p * 100));
      if (ready && t >= 1 && p > 0.995) {
        setPct(100);
        setVerified(true);
        setTimeout(onDone, 550);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      className="loader fixed inset-0 z-50 flex flex-col items-center justify-center"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      role="status"
      aria-live="polite"
    >
      <div className="flex w-[min(78vw,420px)] flex-col" style={{ gap: 18 }}>
        <div className="flex items-baseline justify-between">
          <span className="loader-lbl">{verified ? "Identidad verificada" : "Verificando identidad"}</span>
          <span className="loader-num">{String(pct).padStart(3, "0")}</span>
        </div>
        <div className="loader-track">
          <div className="loader-bar" style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <div className="flex justify-between">
          <span className="loader-lbl">Tobalina</span>
          <span className="loader-lbl">TBLN—ID.01</span>
        </div>
      </div>
    </motion.div>
  );
}
