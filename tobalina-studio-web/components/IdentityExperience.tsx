"use client";

// La web ENTERA es el carnet de identidad — no una página que contiene una tarjeta.
// Un solo viewport, sin scroll. El tilt se aplica a toda la pantalla.
// Las dos verticales son documentos distintos que se intercambian por clic
// (nunca por scroll), cada uno ocupando la pantalla completa.
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { documents, documentOrder, type DocumentKey } from "@/lib/documents";

const REVEAL_THRESHOLD = 0.55;

export default function IdentityExperience() {
  const [active, setActive] = useState<DocumentKey>("corporativo");
  const [revealed, setRevealed] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springX = useSpring(rotX, { stiffness: 120, damping: 20 });
  const springY = useSpring(rotY, { stiffness: 120, damping: 20 });

  const foilOpacity = useTransform([springX, springY], ([x, y]: number[]) => {
    return Math.min(1, (Math.abs(x) + Math.abs(y)) / 10);
  });
  const foilAngle = useTransform(springY, (y) => 115 + y * 2);

  function handleMove(clientX: number, clientY: number) {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;
    const newRotY = (px - 0.5) * 10;
    const newRotX = (0.5 - py) * 7;
    rotX.set(newRotX);
    rotY.set(newRotY);

    const amount = Math.min(1, (Math.abs(newRotX) + Math.abs(newRotY)) / 10);
    setRevealed(amount > REVEAL_THRESHOLD);
  }

  function reset() {
    rotX.set(0);
    rotY.set(0);
    setRevealed(false);
  }

  const doc = documents[active];
  const isDark = doc.tone === "dark";

  return (
    <div
      ref={stageRef}
      style={{ perspective: 1400 }}
      className="h-screen w-full overflow-hidden"
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseLeave={reset}
      onTouchMove={(e) => {
        const t = e.touches[0];
        handleMove(t.clientX, t.clientY);
      }}
      onTouchEnd={reset}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={doc.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{
            rotateX: springX,
            rotateY: springY,
            transformStyle: "preserve-3d",
          }}
          className={`relative h-full w-full flex flex-col justify-between px-8 py-10 md:px-16 md:py-14 ${
            isDark ? "bg-ink text-paper" : "bg-paper text-ink"
          }`}
        >
          {/* Cabecera: tipo de documento */}
          <div className="flex items-start justify-between">
            <p className="font-body text-xs md:text-sm uppercase tracking-[0.25em] opacity-50">
              documento de identidad
            </p>
            <p className="font-body text-xs md:text-sm uppercase tracking-[0.25em] opacity-50">
              {doc.type}
            </p>
          </div>

          {/* Cuerpo: nombre y statement, siempre visibles, sin condición de interacción */}
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
            <h1 className="font-display font-light text-[16vw] leading-[0.9] md:text-[8vw]">
              {doc.name}
            </h1>
            <div>
              <p className="font-body text-lg md:text-2xl opacity-90">{doc.statement}</p>
              <p className="font-body text-sm md:text-base opacity-50 mt-2">{doc.subline}</p>
            </div>
          </div>

          {/* Pie: autoridad emisora */}
          <p className="font-body text-xs md:text-sm opacity-40">{doc.issuedBy}</p>

          {/* Foil holográfico — capa de verificación, cubre toda la pantalla, solo visible al inclinar */}
          <motion.div
            style={{ opacity: foilOpacity }}
            className="absolute inset-0 pointer-events-none mix-blend-soft-light"
          >
            <motion.div
              style={{
                background: useTransform(
                  foilAngle,
                  (a) =>
                    `linear-gradient(${a}deg, transparent 30%, rgba(201,194,180,0.55) 50%, transparent 70%)`
                ),
              }}
              className="absolute inset-0"
            />
          </motion.div>

          {/* Microtexto — statement secundario de verificación, solo tras umbral de tilt */}
          <div
            className={`absolute inset-0 flex items-center justify-center px-10 text-center pointer-events-none transition-opacity duration-200 ${
              revealed ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="font-body text-[10px] md:text-xs tracking-[0.08em] opacity-60 max-w-md">
              {doc.microtext}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Selector de documento — cambia de carnet por clic, nunca por scroll */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {documentOrder.map((key) => (
          <button
            key={key}
            type="button"
            aria-label={`Ver documento: ${documents[key].type}`}
            aria-pressed={active === key}
            onClick={() => setActive(key)}
            className={`h-1.5 rounded-full transition-all ${
              active === key
                ? "w-8 bg-current opacity-80"
                : "w-1.5 bg-current opacity-30"
            } ${isDark ? "text-paper" : "text-ink"}`}
          />
        ))}
      </div>
    </div>
  );
}
