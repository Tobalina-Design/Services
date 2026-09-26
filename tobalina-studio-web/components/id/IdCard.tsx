"use client";

// La web es un DNI a pantalla completa, con anverso y reverso reales en 3D.
// - Carga: "verificando identidad", sale como un telón.
// - Anverso: grano de fondo que el cursor silencia ("no hacemos ruido").
// - Volteo lento: la tarjeta se eleva, gira 180° y se asienta; las capas de
//   contenido están a distinta profundidad, así que se desplazan entre sí (paralaje).
// - Tilt con el cursor en escritorio. Modo claro / oscuro.
// - Móvil: el documento siempre se compone en horizontal; en vertical aparece girado.
import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { DOC_NUMBER, EMAIL, MRZ_LINES, STATEMENT_LINES, VERTICALS } from "@/lib/idcard";
import FitText from "./FitText";
import Grain from "./Grain";
import Loader from "./Loader";
import { useMediaQuery } from "./useMediaQuery";

type Face = "front" | "back";
type Theme = "light" | "dark";

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({ theme: "dark", toggle: () => {} });
const PAD = "max(14px, 3.2vmin)";
const GAP = "max(10px, 2.4vmin)";
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

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
  const reduce = !!useReducedMotion();
  const touch = useMediaQuery("(pointer: coarse)");
  const fine = useMediaQuery("(pointer: fine)");
  const vp = useViewport();
  const rotated = touch && vp.h > vp.w;
  const eff = rotated ? { w: vp.h, h: vp.w } : vp;
  const short = eff.h < 520;
  const tiny = eff.h < 400;

  const [ready, setReady] = useState(false);
  const onLoaded = useCallback(() => setReady(true), []);
  const [face, setFace] = useState<Face>("front");
  const [turning, setTurning] = useState(false);
  const [hint, setHint] = useState(false);

  // Tema
  // Oscuro por defecto; si el visitante eligió otro modo, se respeta
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("tbl-theme");
    } catch {}
    if (saved === "light" || saved === "dark") setTheme(saved);
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

  // Tilt con el cursor (muelle lento)
  const tilt = fine && !rotated && !reduce;
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 60, damping: 18, mass: 1.2 });
  const sy = useSpring(ry, { stiffness: 60, damping: 18, mass: 1.2 });
  const gx = useTransform(sy, [-4, 4], [20, 80]);
  const gy = useTransform(sx, [-3, 3], [80, 20]);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.4), rgba(255,255,255,0) 45%)`;
  const glareOpacity = useTransform([sx, sy], ([x, y]: number[]) => Math.min(0.9, (Math.abs(x) + Math.abs(y)) / 4));

  // Volteo
  const flip = useMotionValue(0);
  const rotY = useTransform([sy, flip], ([a, b]: number[]) => (tilt ? a : 0) + b);
  const lift = useTransform(flip, [0, 90, 180], [1, 0.84, 1]);
  const faceRef = useRef<Face>("front");
  const busy = useRef(false);
  const turnTo = useCallback(
    async (target: Face) => {
      if (busy.current || target === faceRef.current) return;
      faceRef.current = target;
      const angle = target === "back" ? 180 : 0;
      if (reduce) {
        flip.set(angle);
        setFace(target);
        return;
      }
      busy.current = true;
      setTurning(true);
      const t = setTimeout(() => setFace(target), 850);
      await animate(flip, angle, { duration: 1.7, ease: [0.7, 0, 0.2, 1] });
      clearTimeout(t);
      setFace(target);
      setTurning(false);
      busy.current = false;
    },
    [flip, reduce]
  );

  function onMove(e: React.MouseEvent) {
    if (!tilt) return;
    ry.set((e.clientX / window.innerWidth - 0.5) * 8);
    rx.set((0.5 - e.clientY / window.innerHeight) * 6);
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

  useEffect(() => {
    if (!rotated || !ready) return setHint(false);
    setHint(true);
    const t = setTimeout(() => setHint(false), 2600);
    return () => clearTimeout(t);
  }, [rotated, ready]);

  const frame: CSSProperties = rotated
    ? { position: "absolute", top: 0, left: "100vw", width: "100dvh", height: "100vw", transform: "rotate(90deg)", transformOrigin: "top left" }
    : { position: "absolute", inset: 0 };

  return (
    <ThemeCtx.Provider value={{ theme, toggle: toggleTheme }}>
      <div className={`theme-${theme} page relative h-[100dvh] w-screen overflow-hidden`} onMouseMove={onMove} onMouseLeave={onLeave}>
        <div style={{ ...frame, padding: tilt ? "max(16px, 3.8vmin)" : "max(6px, 0.9vmin)", perspective: 2600 }}>
          <motion.div
            className="relative h-full w-full"
            style={{ rotateX: tilt ? sx : 0, rotateY: rotY, scale: lift, transformStyle: "preserve-3d" }}
            initial={false}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1.3, ease: EASE_OUT, delay: ready ? 0.35 : 0 }}
          >
            <FaceShell side="front" active={face === "front"} shown={face === "front" || turning} glare={tilt ? glare : null} glareOpacity={glareOpacity}>
              <Grain reduce={reduce} paused={!(face === "front" || turning)} className="layer" />
              <Front ready={ready} reduce={reduce} onFlip={() => turnTo("back")} />
            </FaceShell>
            <FaceShell side="back" active={face === "back"} shown={face === "back" || turning} glare={tilt ? glare : null} glareOpacity={glareOpacity}>
              <Grain reduce={reduce} paused={!(face === "back" || turning)} className="layer" />
              <Back short={short} tiny={tiny} onFlip={() => turnTo("front")} />
            </FaceShell>
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
                <span className="loader-lbl">Gira el móvil</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>{!ready && <Loader key="loader" onDone={onLoaded} />}</AnimatePresence>
      </div>
    </ThemeCtx.Provider>
  );
}

/* ---------- Cara (anverso o reverso) ---------- */

function FaceShell({
  side,
  active,
  shown,
  children,
  glare,
  glareOpacity,
}: {
  side: Face;
  active: boolean;
  shown: boolean;
  children: ReactNode;
  glare: MotionValue<string> | null;
  glareOpacity: MotionValue<number>;
}) {
  // La cara oculta no recibe foco ni clics
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (active) ref.current.removeAttribute("inert");
    else ref.current.setAttribute("inert", "");
  }, [active]);
  return (
    <div
      ref={ref}
      className="face"
      style={{
        transform: side === "back" ? "rotateY(180deg)" : undefined,
        pointerEvents: active ? "auto" : "none",
        visibility: shown ? "visible" : "hidden",
      }}
      aria-hidden={!active}
    >
      <div className="face-bg layer" />
      <div className="face-content" style={{ padding: PAD, gap: GAP }}>
        {children}
      </div>
      {glare && (
        <motion.div
          aria-hidden="true"
          className="layer pointer-events-none absolute inset-0"
          style={{ background: glare, opacity: glareOpacity, mixBlendMode: "soft-light", borderRadius: "inherit", translateZ: 2 }}
        />
      )}
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
      <span className={dark ? "is-on" : ""}>Oscuro</span>
      <span aria-hidden="true" className="mx-2 opacity-40">
        /
      </span>
      <span className={dark ? "" : "is-on"}>Claro</span>
    </button>
  );
}

function Header({ left, right }: { left: string; right: string }) {
  return (
    <header className="layer d1 hair flex items-center justify-between border-b" style={{ paddingBottom: "max(8px, 1.4vmin)" }}>
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

function BottomRow({ onFlip, to }: { onFlip: () => void; to: Face }) {
  return (
    <div className="layer d1 hair flex items-center justify-between border-t" style={{ paddingTop: "max(8px, 1.3vmin)" }}>
      <a href={`mailto:${EMAIL}`} className="lbl link">
        {EMAIL}
      </a>
      <button type="button" onClick={onFlip} className="flip lbl">
        {to === "back" ? "Servicios →" : "← Anverso"}
      </button>
    </div>
  );
}

/* ---------- Anverso ---------- */

function Front({ ready, reduce, onFlip }: { ready: boolean; reduce: boolean; onFlip: () => void }) {
  const t = (delay: number) => ({ duration: reduce ? 0 : 1.3, delay: reduce ? 0 : delay, ease: EASE_OUT });
  return (
    <>
      <Header left="Documento de identidad" right="TBL" />

      {/* Logotipo: espaciado, discreto, alineado con la declaración */}
      <motion.p
        className="layer d2 wordmark font-display"
        style={{ marginTop: "max(14px, 4vmin)" }}
        initial={false}
        animate={ready ? { opacity: 1, letterSpacing: "0.46em" } : { opacity: 0, letterSpacing: "0.9em" }}
        transition={t(0.5)}
      >
        TOBALINA
      </motion.p>

      <div className="layer flex-1" />

      {/* Declaración: protagonista */}
      <div className="layer d3">
        <motion.p className="lbl" initial={false} animate={{ opacity: ready ? 1 : 0 }} transition={t(0.9)}>
          Declaración / Statement
        </motion.p>
        <h2 className="statement font-display font-light" style={{ marginTop: "max(8px, 1.4vmin)" }}>
          {STATEMENT_LINES.map((l, i) => (
            <span key={l} className="block overflow-hidden pb-[0.08em]">
              <motion.span className="block" initial={false} animate={{ y: ready ? "0%" : "110%" }} transition={t(0.6 + i * 0.14)}>
                {l}
              </motion.span>
            </span>
          ))}
        </h2>
      </div>

      {/* Detalle de documento en el canto */}
      <p aria-hidden="true" className="layer d1 lbl edge-note">
        {DOC_NUMBER} · Madrid · Validez atemporal
      </p>

      <BottomRow onFlip={onFlip} to="back" />
    </>
  );
}

/* ---------- Reverso ---------- */

function Back({ short, tiny, onFlip }: { short: boolean; tiny: boolean; onFlip: () => void }) {
  return (
    <>
      <Header left="Servicios" right={DOC_NUMBER} />
      <div className="layer d3 grid min-h-0 flex-1 grid-cols-2 content-center" style={{ gap: "max(16px, 5vmin)" }}>
        {VERTICALS.map((v, vi) => (
          <section key={v.key} aria-labelledby={`v-${v.key}`}>
            <div className="hair flex items-baseline justify-between border-b" style={{ paddingBottom: "max(6px, 1vmin)" }}>
              <h2
                id={`v-${v.key}`}
                className="whitespace-nowrap font-display font-light uppercase"
                style={{ fontSize: short ? "15px" : "clamp(18px, 3.6vmin, 46px)", lineHeight: 1 }}
              >
                <span className="lbl mr-3 align-middle">0{vi + 1}</span>
                {v.title}
              </h2>
              {!short && <Lbl>{v.destination}</Lbl>}
            </div>
            <ol>
              {v.items.map((s) => (
                <li key={s.title} className="hair border-b" style={{ paddingBlock: short ? "4px" : "max(7px, 1.3vmin)" }}>
                  <p className="font-display font-normal uppercase" style={{ fontSize: short ? "13px" : "clamp(14px, 2.25vmin, 27px)", lineHeight: 1.1 }}>
                    {s.title}
                  </p>
                  <p className="desc" style={short ? { fontSize: "11px" } : undefined}>
                    {s.description}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
      <BottomRow onFlip={onFlip} to="front" />
      {!tiny && (
        <div className="layer d1 mrz" aria-label="Zona de lectura mecánica">
          {MRZ_LINES.map((l) => (
            <FitText key={l} max={short ? 11 : 24} lineHeight={1.3}>
              {l}
            </FitText>
          ))}
        </div>
      )}
    </>
  );
}
