"use client";

// La web es un DNI a pantalla completa, con anverso y reverso. Sin scroll.
// Las caras cambian con un fundido (botón; en escritorio también ← → y R).
// Móvil: el documento SIEMPRE se compone en horizontal. Con el teléfono en
// vertical se muestra girado 90°, de modo que hay que girar el móvil para leerlo.
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DOC_NUMBER, EMAIL, MRZ_LINES, STATEMENT_LINES, VERTICALS } from "@/lib/idcard";
import FitText from "./FitText";
import { useMediaQuery } from "./useMediaQuery";

type Face = "front" | "back";
const PAD = "max(14px, 3vmin)";
const GAP = "max(10px, 2.4vmin)";

function useViewport() {
  const [vp, setVp] = useState({ w: 1440, h: 900 });
  useEffect(() => {
    const f = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return vp;
}

export default function IdCard() {
  const reduce = useReducedMotion();
  const touch = useMediaQuery("(pointer: coarse)");
  const vp = useViewport();
  const rotated = touch && vp.h > vp.w;
  const eff = rotated ? { w: vp.h, h: vp.w } : vp;
  const short = eff.h < 520;
  const [face, setFace] = useState<Face>("front");
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setFace("back");
      if (e.key === "ArrowLeft") setFace("front");
      if (e.key.toLowerCase() === "r") setFace((s) => (s === "front" ? "back" : "front"));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Aviso breve de "gira el móvil" cuando el documento aparece girado
  useEffect(() => {
    if (!rotated) return setHint(false);
    setHint(true);
    const t = setTimeout(() => setHint(false), 2600);
    return () => clearTimeout(t);
  }, [rotated]);

  const frame: CSSProperties = rotated
    ? { position: "absolute", top: 0, left: "100vw", width: "100dvh", height: "100vw", transform: "rotate(90deg)", transformOrigin: "top left" }
    : { position: "absolute", inset: 0 };

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-ink">
      <div style={{ ...frame, padding: "max(6px, 0.9vmin)" }}>
        <div className="card relative h-full w-full overflow-hidden text-ink" style={{ borderRadius: "max(14px, 2.2vmin)" }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={face}
              className="absolute inset-0 flex flex-col"
              style={{ padding: PAD, gap: GAP }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {face === "front" ? (
                <Front onFlip={() => setFace("back")} />
              ) : (
                <Back short={short} onFlip={() => setFace("front")} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {hint && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-ink/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-3 text-paper">
              <svg className="rotate-phone" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                <rect x="7" y="2.5" width="10" height="19" rx="1.5" />
              </svg>
              <span className="lbl" style={{ color: "#f4efe6" }}>
                Gira el móvil
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Piezas comunes ---------- */


function Lbl({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`lbl ${className}`}>{children}</span>;
}

function Chip() {
  return (
    <svg viewBox="0 0 40 30" className="chip" aria-hidden="true">
      <rect x="0.5" y="0.5" width="39" height="29" rx="5" />
      <path d="M0.5 10h11M0.5 20h11M28.5 10h11M28.5 20h11M11.5 0.5v29M28.5 0.5v29M11.5 15h17M20 0.5v7M20 22.5v7" />
    </svg>
  );
}

function Header({ left, right }: { left: string; right: string }) {
  return (
    <header className="hair flex items-center justify-between border-b" style={{ paddingBottom: "max(8px, 1.4vmin)" }}>
      <div className="flex items-center" style={{ gap: "max(10px, 1.4vmin)" }}>
        <Chip />
        <Lbl>{left}</Lbl>
      </div>
      <Lbl>{right}</Lbl>
    </header>
  );
}

function BottomRow({ onFlip, to }: { onFlip: () => void; to: Face }) {
  return (
    <div className="hair relative z-10 flex items-center justify-between border-t" style={{ paddingTop: "max(8px, 1.3vmin)" }}>
      <a href={`mailto:${EMAIL}`} className="lbl link">
        {EMAIL}
      </a>
      <button type="button" onClick={onFlip} className="flip lbl">
        {to === "back" ? "Servicios →" : "← Anverso"}
      </button>
    </div>
  );
}

/* ---------- Anverso: solo lo esencial ---------- */

function Front({ onFlip }: { onFlip: () => void }) {
  return (
    <>
      <Header left="Documento de identidad" right="TBL" />
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <h2 className="sr-only">{STATEMENT_LINES.join(" ")}</h2>
        <div className="mx-auto w-[82%]">
          {STATEMENT_LINES.map((l) => (
            <FitText key={l} className="pointer-events-none font-display font-light uppercase" aria-hidden="true">
              {l}
            </FitText>
          ))}
        </div>
      </div>
      <BottomRow onFlip={onFlip} to="back" />
      <h1 className="sr-only">Tobalina</h1>
      <FitText className="pointer-events-none font-display font-light" aria-hidden="true">
        TOBALINA
      </FitText>
    </>
  );
}

/* ---------- Reverso: servicios, contacto, zona de lectura mecánica ---------- */

function Back({ short, onFlip }: { short: boolean; onFlip: () => void }) {
  return (
    <>
      <Header left="Servicios" right={DOC_NUMBER} />
      <div className="grid min-h-0 flex-1 grid-cols-2 content-center" style={{ gap: "max(16px, 5vmin)" }}>
        {VERTICALS.map((v, vi) => (
          <section key={v.key} aria-labelledby={`v-${v.key}`}>
            <div className="hair flex items-baseline justify-between border-b" style={{ paddingBottom: "max(6px, 1vmin)" }}>
              <h2
                id={`v-${v.key}`}
                className="whitespace-nowrap font-display font-light uppercase"
                style={{ fontSize: short ? "14px" : "clamp(17px, 3.4vmin, 44px)", lineHeight: 1 }}
              >
                <span className="lbl mr-3 align-middle">0{vi + 1}</span>
                {v.title}
              </h2>
              {!short && <Lbl>{v.destination}</Lbl>}
            </div>
            <ol>
              {v.items.map((s) => (
                <li key={s.title} className="hair border-b" style={{ paddingBlock: short ? "5px" : "max(7px, 1.3vmin)" }}>
                  <p className="font-display font-normal uppercase" style={{ fontSize: short ? "12px" : "clamp(12px, 1.8vmin, 22px)", lineHeight: 1.1 }}>
                    {s.title}
                  </p>
                  <p className="desc" style={short ? { fontSize: "10px" } : undefined}>
                    {s.description}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
      <BottomRow onFlip={onFlip} to="front" />
      <div className="mrz" aria-label="Zona de lectura mecánica">
        {MRZ_LINES.map((l) => (
          <FitText key={l} max={short ? 11 : 24} lineHeight={1.3}>
            {l}
          </FitText>
        ))}
      </div>
    </>
  );
}
