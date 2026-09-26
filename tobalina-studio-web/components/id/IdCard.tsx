"use client";

// La web es un DNI a pantalla completa, con anverso y reverso.
// Escritorio: se cambia de cara con un fundido (botón, ← →, o R). Sin paso de hoja.
// Móvil (táctil): la orientación decide la cara. Vertical = anverso; horizontal = reverso.
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  DOC_NUMBER,
  EMAIL,
  FRONT_FIELDS,
  MRZ_LINES,
  STATEMENT_LINES,
  VERTICALS,
} from "@/lib/idcard";
import FitText from "./FitText";
import { useMediaQuery } from "./useMediaQuery";

type Face = "front" | "back";
const PAD = "max(16px, 3vmin)";
const GAP = "max(12px, 2.4vmin)";

export default function IdCard() {
  const reduce = useReducedMotion();
  const touchPortrait = useMediaQuery(
    "(pointer: coarse) and (orientation: portrait)",
  );
  const touchLandscape = useMediaQuery(
    "(pointer: coarse) and (orientation: landscape)",
  );
  const tall = useMediaQuery("(max-aspect-ratio: 1/1)");
  const short = useMediaQuery("(max-height: 520px)");
  const touch = touchPortrait || touchLandscape;
  const [side, setSide] = useState<Face>("front");
  const face: Face = touchPortrait ? "front" : touchLandscape ? "back" : side;

  useEffect(() => {
    if (touch) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setSide("back");
      if (e.key === "ArrowLeft") setSide("front");
      if (e.key.toLowerCase() === "r")
        setSide((s) => (s === "front" ? "back" : "front"));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [touch]);

  const flip = (to: Face) => (touch ? null : () => setSide(to));

  return (
    <div
      className="h-[100dvh] w-screen bg-ink"
      style={{ padding: "max(6px, 0.9vmin)" }}
    >
      <div
        className="card relative h-full w-full overflow-hidden text-ink"
        style={{ borderRadius: "max(14px, 2.2vmin)" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={face}
            className="absolute inset-0 flex flex-col"
            style={{ padding: PAD, gap: GAP }}
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {face === "front" ? (
              <Front tall={tall} touch={touch} onFlip={flip("back")} />
            ) : (
              <Back
                tall={tall}
                short={short}
                touch={touch}
                onFlip={flip("front")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Piezas comunes ---------- */

function Lbl({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
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
    <header
      className="hair flex items-center justify-between border-b"
      style={{ paddingBottom: "max(10px, 1.4vmin)" }}
    >
      <div className="flex items-center" style={{ gap: "max(10px, 1.4vmin)" }}>
        <Chip />
        <Lbl>{left}</Lbl>
      </div>
      <Lbl className="hidden sm:inline">Identity card</Lbl>
      <Lbl>{right}</Lbl>
    </header>
  );
}

function FlipControl({
  touch,
  onFlip,
  to,
}: {
  touch: boolean;
  onFlip: (() => void) | null;
  to: Face;
}) {
  if (touch) {
    return (
      <span className="lbl flex items-center gap-2">
        <svg
          className="rotate-phone"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <rect x="7" y="2.5" width="10" height="19" rx="1.5" />
        </svg>
        {to === "back" ? "Gira el móvil · Reverso" : "Gira el móvil · Anverso"}
      </span>
    );
  }
  return (
    <button type="button" onClick={onFlip ?? undefined} className="flip lbl">
      {to === "back" ? "Reverso →" : "← Anverso"}
    </button>
  );
}

function BottomRow({
  touch,
  onFlip,
  to,
}: {
  touch: boolean;
  onFlip: (() => void) | null;
  to: Face;
}) {
  return (
    <div
      className="hair relative z-10 flex items-center justify-between border-t"
      style={{ paddingTop: "max(10px, 1.3vmin)" }}
    >
      <a href={`mailto:${EMAIL}`} className="lbl link">
        {EMAIL}
      </a>
      <FlipControl touch={touch} onFlip={onFlip} to={to} />
      <Lbl className="hidden sm:inline">{DOC_NUMBER}</Lbl>
    </div>
  );
}

/* ---------- Anverso ---------- */

function Photo({ width }: { width: string }) {
  return (
    <div className="photo relative" style={{ width, aspectRatio: "3 / 4" }}>
      <span
        className="absolute inset-0 flex items-center justify-center font-display font-light"
        style={{ fontSize: "min(9vmin, 120px)" }}
      >
        T
      </span>
      <span className="holo absolute" aria-hidden="true" />
    </div>
  );
}

function Fields({ tall }: { tall: boolean }) {
  return (
    <dl
      className={`grid ${tall ? "grid-cols-2" : "grid-cols-5"}`}
      style={{ gap: "max(10px, 1.6vmin) max(14px, 2.4vmin)" }}
    >
      {FRONT_FIELDS.map((f) => (
        <div key={f.label} className={f.wide ? "col-span-2" : ""}>
          <dt className="lbl">{f.label}</dt>
          <dd className="val">{f.value}</dd>
        </div>
      ))}
      {tall && (
        <div className="col-span-2">
          <dt className="lbl">Nº / No.</dt>
          <dd className="val">{DOC_NUMBER}</dd>
        </div>
      )}
    </dl>
  );
}

function Statement({ lines }: { lines: string[] }) {
  return (
    <div>
      <h2 className="sr-only">{STATEMENT_LINES.join(" ")}</h2>
      {lines.map((l) => (
        <FitText
          key={l}
          className="pointer-events-none font-display font-light uppercase"
          aria-hidden="true"
        >
          {l}
        </FitText>
      ))}
    </div>
  );
}

function Front({
  tall,
  touch,
  onFlip,
}: {
  tall: boolean;
  touch: boolean;
  onFlip: (() => void) | null;
}) {
  return (
    <>
      <Header left="Documento de identidad" right="TBL" />
      {tall ? (
        <>
          <div
            className="grid grid-cols-[34%_1fr] items-center"
            style={{ gap: GAP }}
          >
            <Photo width="100%" />
            <Fields tall />
          </div>
          <div
            className="flex flex-1 flex-col justify-center"
            style={{ gap: "max(6px, 1vmin)" }}
          >
            <Lbl>Declaración / Statement</Lbl>
            <Statement lines={["No hacemos ruido.", "Hacemos", "identidad."]} />
          </div>
        </>
      ) : (
        <div
          className="grid min-h-0 flex-1 grid-cols-[auto_1fr] items-center"
          style={{ gap: "max(20px, 4.5vmin)" }}
        >
          <Photo width="min(24vw, 34vh)" />
          <div
            className="flex min-w-0 flex-col"
            style={{ gap: "max(16px, 3.4vmin)" }}
          >
            <div className="flex flex-col" style={{ gap: "max(8px, 1.4vmin)" }}>
              <Lbl>Declaración / Statement</Lbl>
              <Statement lines={STATEMENT_LINES} />
            </div>
            <Fields tall={false} />
          </div>
        </div>
      )}
      <BottomRow touch={touch} onFlip={onFlip} to="back" />
      <h1 className="sr-only">Tobalina</h1>
      <FitText
        className="pointer-events-none font-display font-light"
        aria-hidden="true"
      >
        TOBALINA
      </FitText>
    </>
  );
}

/* ---------- Reverso ---------- */

function Back({
  tall,
  short,
  touch,
  onFlip,
}: {
  tall: boolean;
  short: boolean;
  touch: boolean;
  onFlip: (() => void) | null;
}) {
  return (
    <>
      <Header left="Reverso · Servicios" right={DOC_NUMBER} />
      <div
        className={`grid min-h-0 flex-1 content-center ${tall ? "grid-cols-1" : "grid-cols-2"}`}
        style={{ gap: "max(16px, 5vmin)" }}
      >
        {VERTICALS.map((v, vi) => (
          <section key={v.key} aria-labelledby={`v-${v.key}`}>
            <div
              className="hair flex items-baseline justify-between border-b"
              style={{ paddingBottom: "max(6px, 1vmin)" }}
            >
              <h2
                id={`v-${v.key}`}
                className="font-display font-light uppercase"
                style={{
                  fontSize: short ? "15px" : "clamp(17px, 3.6vmin, 46px)",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                <span className="lbl mr-3 align-middle">0{vi + 1}</span>
                {v.title}
              </h2>
              {!short && (
                <Lbl className="hidden sm:inline">{v.destination}</Lbl>
              )}
            </div>
            <ol>
              {v.items.map((s, i) => (
                <li
                  key={s.title}
                  className="hair grid items-baseline border-b"
                  style={{
                    gridTemplateColumns: "3.2ch 1fr auto",
                    gap: "max(8px, 1.4vmin)",
                    paddingBlock: short ? "3px" : "max(5px, 1vmin)",
                  }}
                >
                  <Lbl>{String(i + 1).padStart(2, "0")}</Lbl>
                  <span
                    className="font-display font-light uppercase"
                    style={{
                      fontSize: short ? "12px" : "clamp(12px, 1.9vmin, 24px)",
                    }}
                  >
                    {s.title}
                  </span>
                  {!short && (
                    <Lbl className="hidden text-right md:inline">
                      {s.description}
                    </Lbl>
                  )}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      {!short && (
        <div
          className={`grid items-end ${tall ? "grid-cols-1" : "grid-cols-[2fr_1fr_1fr]"}`}
          style={{ gap: GAP }}
        >
          <div>
            <Lbl>Contacto / Contact</Lbl>
            <a
              href={`mailto:${EMAIL}?subject=${encodeURIComponent("Tobalina — Contacto")}`}
              className="link block font-display font-light"
              style={{ fontSize: "clamp(15px, 3vmin, 40px)" }}
            >
              {EMAIL}
            </a>
          </div>
          {!tall && (
            <>
              <div>
                <Lbl>Domicilio / Address</Lbl>
                <p className="val">Madrid</p>
              </div>
              <div>
                <Lbl>Firma / Signature</Lbl>
                <p className="val">{STATEMENT_LINES.join(" ")}</p>
              </div>
            </>
          )}
        </div>
      )}

      <BottomRow touch={touch} onFlip={onFlip} to="front" />
      <div className="mrz" aria-label="Zona de lectura mecánica">
        {MRZ_LINES.map((l) => (
          <FitText key={l} max={short ? 13 : 30}>
            {l}
          </FitText>
        ))}
      </div>
    </>
  );
}
