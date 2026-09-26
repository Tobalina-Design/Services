"use client";

// Motor del pasaporte a pantalla completa.
// - Portada cerrada → se abre en doble página.
// - Paso de hoja 3D real: la hoja gira sobre el lomo mostrando anverso y reverso.
// - Navegación: flechas, teclado (← → Esc, U), esquinas de página, swipe, índice.
// - Modo UV: revela tintas ocultas y fibras fluorescentes, como un pasaporte real.
// - Móvil (puntero táctil): girar el teléfono ES abrir el pasaporte.
//   Vertical = portada cerrada; horizontal = pasaporte abierto. Sin botón de abrir.
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SPREADS, type PageId } from "@/lib/passport";
import Cover from "./Cover";
import { renderPage } from "./Pages";
import { SecurityDefs } from "./Security";
import { useMediaQuery } from "./useMediaQuery";

type Turn = { from: number; to: number; dir: 1 | -1 };
const EASE = [0.645, 0.045, 0.355, 1] as const;

export default function Passport() {
  const reduce = useReducedMotion();
  const touchPortrait = useMediaQuery("(pointer: coarse) and (orientation: portrait)");
  const touchLandscape = useMediaQuery("(pointer: coarse) and (orientation: landscape)");

  const [opened, setOpened] = useState(false);
  const [spread, setSpread] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);
  const [uv, setUv] = useState(false);
  const touchX = useRef<number | null>(null);

  const showCover = touchPortrait || (!touchLandscape && !opened);

  const goTo = useCallback(
    (to: number) => {
      if (turn || to === spread || to < 0 || to >= SPREADS.length) return;
      if (reduce) return setSpread(to);
      setTurn({ from: spread, to, dir: to > spread ? 1 : -1 });
    },
    [turn, spread, reduce]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (showCover) {
        if (!touchPortrait && ["Enter", " ", "ArrowRight"].includes(e.key)) setOpened(true);
        return;
      }
      if (e.key === "ArrowRight") goTo(spread + 1);
      if (e.key === "ArrowLeft") goTo(spread - 1);
      if (e.key === "Escape" && !touchLandscape) setOpened(false);
      if (e.key.toLowerCase() === "u") setUv((v) => !v);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showCover, touchPortrait, touchLandscape, goTo, spread]);

  // Qué páginas quedan fijas mientras una hoja está girando
  const [leftId, rightId]: [PageId, PageId] = turn
    ? turn.dir === 1
      ? [SPREADS[turn.from].pages[0], SPREADS[turn.to].pages[1]]
      : [SPREADS[turn.to].pages[0], SPREADS[turn.from].pages[1]]
    : SPREADS[spread].pages;

  const leaf = turn
    ? {
        front: turn.dir === 1 ? SPREADS[turn.from].pages[1] : SPREADS[turn.from].pages[0],
        back: turn.dir === 1 ? SPREADS[turn.to].pages[0] : SPREADS[turn.to].pages[1],
      }
    : null;

  const current = turn ? turn.to : spread;

  return (
    <div className={`passport relative h-[100dvh] w-screen overflow-hidden bg-ink ${uv ? "uv" : ""}`}>
      <SecurityDefs />
      <AnimatePresence mode="popLayout" initial={false}>
        {showCover ? (
          <motion.div
            key="cover"
            className="absolute inset-0 z-30"
            style={{ transformOrigin: "left center", transformPerspective: 2000 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={reduce ? { opacity: 0 } : { rotateY: -100, opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <Cover onOpen={() => setOpened(true)} portraitTouch={touchPortrait} />
          </motion.div>
        ) : (
          <motion.div
            key="book"
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (dx < -45) goTo(spread + 1);
              if (dx > 45) goTo(spread - 1);
            }}
          >
            <div className="relative h-full w-full" style={{ perspective: 2600 }}>
              {/* Páginas fijas */}
              <div key={leftId} className="absolute inset-y-0 left-0 w-1/2">
                {renderPage(leftId, { onJump: goTo })}
              </div>
              <div key={rightId} className="absolute inset-y-0 right-0 w-1/2">
                {renderPage(rightId, { onJump: goTo })}
              </div>

              {/* Hoja que gira sobre el lomo */}
              {turn && leaf && (
                <motion.div
                  key={`${turn.from}-${turn.to}`}
                  className={`absolute inset-y-0 z-20 w-1/2 ${turn.dir === 1 ? "right-0" : "left-0"}`}
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: turn.dir === 1 ? "left center" : "right center",
                  }}
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: turn.dir === 1 ? -180 : 180 }}
                  transition={{ duration: 0.95, ease: EASE }}
                  onAnimationComplete={() => {
                    setSpread(turn.to);
                    setTurn(null);
                  }}
                >
                  <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                    {renderPage(leaf.front, { still: true })}
                    <motion.div
                      className="pointer-events-none absolute inset-0 bg-black"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.28 }}
                      transition={{ duration: 0.95, ease: "easeIn" }}
                    />
                  </div>
                  <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    {renderPage(leaf.back, { still: true })}
                    <motion.div
                      className="pointer-events-none absolute inset-0 bg-black"
                      initial={{ opacity: 0.28 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 0.95, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Lomo */}
              <div
                className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-px -translate-x-1/2"
                style={{ background: "rgba(0,0,0,0.25)" }}
              />

              {/* Esquinas para pasar página (escritorio) */}
              {current > 0 && (
                <button
                  type="button"
                  aria-label="Página anterior"
                  onClick={() => goTo(spread - 1)}
                  className="corner corner-left absolute bottom-0 left-0 z-10"
                />
              )}
              {current < SPREADS.length - 1 && (
                <button
                  type="button"
                  aria-label="Página siguiente"
                  onClick={() => goTo(spread + 1)}
                  className="corner corner-right absolute bottom-0 right-0 z-10"
                />
              )}
            </div>

            {/* Navegación */}
            <nav
              aria-label="Navegación del pasaporte"
              className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full bg-ink/85 px-1.5 py-1 font-body text-paper shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-blur"
              style={{ fontSize: 11 }}
            >
              <button
                type="button"
                onClick={() => goTo(spread - 1)}
                disabled={current === 0}
                aria-label="Página anterior"
                className="nav-btn"
              >
                ←
              </button>
              <span className="min-w-0 truncate px-2 uppercase tracking-[0.16em]" aria-live="polite">
                <span className="font-mono text-sand/70">
                  {String(current + 1).padStart(2, "0")}/{String(SPREADS.length).padStart(2, "0")}
                </span>
                <span className="ml-2 hidden sm:inline">{SPREADS[current].label}</span>
              </span>
              <button
                type="button"
                onClick={() => goTo(spread + 1)}
                disabled={current === SPREADS.length - 1}
                aria-label="Página siguiente"
                className="nav-btn"
              >
                →
              </button>
              <span className="mx-1 h-4 w-px bg-paper/20" />
              <button
                type="button"
                onClick={() => setUv((v) => !v)}
                aria-pressed={uv}
                aria-label="Luz ultravioleta: revelar tintas ocultas"
                title="Luz UV (U)"
                className={`nav-btn px-3 uppercase tracking-[0.16em] ${uv ? "bg-paper text-ink" : ""}`}
              >
                UV
              </button>
              {!touchLandscape && (
                <button type="button" onClick={() => setOpened(false)} aria-label="Cerrar pasaporte" title="Cerrar (Esc)" className="nav-btn">
                  ×
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
