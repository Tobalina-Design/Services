"use client";

// La web es un DNI a pantalla completa, con anverso y reverso. Sin scroll.
// Las caras cambian con un fundido (botón; en escritorio también ← → y R).
// Móvil: el documento SIEMPRE se compone en horizontal. Con el teléfono en
// vertical se muestra girado 90°, de modo que hay que girar el móvil para leerlo.
import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { DOC_NUMBER, EMAIL, MRZ_LINES, STATEMENT_LINES, VERTICALS } from "@/lib/idcard";
import FitText from "./FitText";
import { useMediaQuery } from "./useMediaQuery";

type Face = "front" | "back";
type Theme = "light" | "dark";

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({ theme: "light", toggle: () => {} });
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

  // Modo claro / oscuro (se recuerda en este navegador; por defecto, el del sistema)
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("tbl-theme");
    } catch {}
    if (saved === "light" || saved === "dark") setTheme(saved);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
  }, []);
  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "light" ? "dark" : "light";
      try {
        localStorage.setItem("tbl-theme", next);
      } catch {}
      return next;
    });
  }, []);

  // Giro de la tarjeta al cambiar de cara: se inclina hasta ponerse de canto,
  // cambia el contenido sin que se vea y vuelve a su sitio desde el otro lado.
  const flipY = useMotionValue(0);
  const flipScale = useTransform(flipY, [-90, 0, 90], [0.84, 1, 0.84]);
  const faceRef = useRef<Face>("front");
  const busy = useRef(false);
  const turnTo = useCallback(
    async (target: Face) => {
      if (busy.current || target === faceRef.current) return;
      faceRef.current = target;
      if (reduce) return setFace(target);
      busy.current = true;
      const dir = target === "back" ? -1 : 1;
      await animate(flipY, 90 * dir, { duration: 0.34, ease: [0.55, 0, 0.8, 0.35] });
      setFace(target);
      flipY.set(-90 * dir);
      await animate(flipY, 0, { duration: 0.6, ease: [0.16, 1, 0.3, 1] });
      busy.current = false;
    },
    [flipY, reduce]
  );

  // Tilt: la tarjeta se inclina siguiendo el cursor (solo ratón, no en móvil)
  const fine = useMediaQuery("(pointer: fine)");
  const tilt = fine && !rotated && !reduce;
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 140, damping: 18 });
  const sy = useSpring(ry, { stiffness: 140, damping: 18 });
  const gx = useTransform(sy, [-3.5, 3.5], [20, 80]);
  const gy = useTransform(sx, [-2.5, 2.5], [80, 20]);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.45), rgba(255,255,255,0) 45%)`;
  const glareOpacity = useTransform([sx, sy], ([x, y]: number[]) => Math.min(1, (Math.abs(x) + Math.abs(y)) / 3.5));
  const rotY = useTransform([sy, flipY], ([a, b]: number[]) => (tilt ? a : 0) + b);

  function onMove(e: React.MouseEvent) {
    if (!tilt) return;
    const px = e.clientX / window.innerWidth;
    const py = e.clientY / window.innerHeight;
    ry.set((px - 0.5) * 7);
    rx.set((0.5 - py) * 5);
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") turnTo("back");
      if (e.key === "ArrowLeft") turnTo("front");
      if (e.key.toLowerCase() === "r") turnTo(faceRef.current === "front" ? "back" : "front");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turnTo]);

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
    <ThemeCtx.Provider value={{ theme, toggle: toggleTheme }}>
    <div
      className={`theme-${theme} page relative h-[100dvh] w-screen overflow-hidden`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div style={{ ...frame, padding: tilt ? "max(14px, 3.4vmin)" : "max(6px, 0.9vmin)", perspective: 3600 }}>
        <motion.div
          className="card relative h-full w-full overflow-hidden"
          style={{
            borderRadius: "max(14px, 2.2vmin)",
            rotateX: tilt ? sx : 0,
            rotateY: rotY,
            scale: flipScale,
            boxShadow: tilt ? "0 30px 80px rgba(0,0,0,0.45)" : undefined,
          }}
        >
          <div className="absolute inset-0 flex flex-col" style={{ padding: PAD, gap: GAP }}>
            {face === "front" ? (
              <Front onFlip={() => turnTo("back")} />
            ) : (
              <Back short={short} onFlip={() => turnTo("front")} />
            )}
          </div>
          {tilt && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10"
              style={{ background: glare, opacity: glareOpacity, mixBlendMode: "soft-light" }}
            />
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {hint && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/60"
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
    </ThemeCtx.Provider>
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
      <div className="flex items-center" style={{ gap: "max(12px, 2vmin)" }}>
        <ThemeToggle />
        <Lbl className="hidden sm:inline">{right}</Lbl>
      </div>
    </header>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useContext(ThemeCtx);
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="theme-toggle lbl flex items-center"
    >
      <span className={dark ? "" : "is-on"}>Claro</span>
      <span aria-hidden="true" className="mx-2 opacity-40">/</span>
      <span className={dark ? "is-on" : ""}>Oscuro</span>
    </button>
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
