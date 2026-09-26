"use client";

// La web ENTERA es el carnet de identidad — no una página que contiene una tarjeta.
// Un solo viewport, sin scroll. El documento tiene DOS CARAS, como un DNI/pasaporte real:
// - Frente: identidad de marca (nombre + statement). Siempre lo primero que se ve.
// - Reverso: servicios de la vertical activa + franja tipo zona de lectura mecánica.
// El tilt 3D vive solo en el frente (capa de verificación: foil + microtexto).
// El giro de cara es una acción explícita del usuario, no automática.
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { documents, documentOrder, type DocumentKey } from "@/lib/documents";
import { services, mrz } from "@/lib/services";

const REVEAL_THRESHOLD = 0.55;

export default function IdentityExperience() {
  const [active, setActive] = useState<DocumentKey>("corporativo");
  const [revealed, setRevealed] = useState(false);
  const [flipped, setFlipped] = useState(false);
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
    if (flipped) return;
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

  function selectDocument(key: DocumentKey) {
    setActive(key);
    setFlipped(false);
    reset();
  }

  const doc = documents[active];
  const docServices = services[active];
  const docMrz = mrz[active];
  const isDark = doc.tone === "dark";
  const faceTone = isDark ? "bg-ink text-paper" : "bg-paper text-ink";

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
          className="relative h-full w-full"
          style={{ perspective: 1400 }}
        >
          {/* Contenedor que gira: frente y reverso, como una tarjeta física */}
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* FRENTE — identidad, siempre lo primero, sin condición de interacción */}
            <motion.div
              style={{
                rotateX: springX,
                rotateY: springY,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
              className={`absolute inset-0 flex flex-col justify-between px-8 py-10 md:px-16 md:py-14 ${faceTone}`}
            >
              <div className="flex items-start justify-between">
                <p className="font-body text-xs md:text-sm uppercase tracking-[0.25em] opacity-50">
                  documento de identidad
                </p>
                <p className="font-body text-xs md:text-sm uppercase tracking-[0.25em] opacity-50">
                  {doc.type}
                </p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
                <h1 className="font-display font-light text-[16vw] leading-[0.9] md:text-[8vw]">
                  {doc.name}
                </h1>
                <div>
                  <p className="font-body text-lg md:text-2xl opacity-90">{doc.statement}</p>
                  <p className="font-body text-sm md:text-base opacity-50 mt-2">{doc.subline}</p>
                </div>
              </div>

              <p className="font-body text-xs md:text-sm opacity-40">{doc.issuedBy}</p>

              {/* Foil holográfico — capa de verificación, solo visible al inclinar */}
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

              {/* Microtexto — statement secundario, solo tras umbral de tilt */}
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

            {/* REVERSO — servicios de la vertical activa + franja MRZ */}
            <div
              style={{
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
              }}
              className={`absolute inset-0 flex flex-col justify-between px-8 py-10 md:px-16 md:py-14 ${faceTone}`}
            >
              <div className="flex items-start justify-between">
                <p className="font-body text-xs md:text-sm uppercase tracking-[0.25em] opacity-50">
                  servicios
                </p>
                <p className="font-body text-xs md:text-sm uppercase tracking-[0.25em] opacity-50">
                  {doc.type}
                </p>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 content-center max-w-3xl mx-auto w-full">
                {docServices.map((service) => (
                  <div key={service.title} className="border-t border-current/20 pt-3">
                    <h3 className="font-display font-light text-xl md:text-2xl">
                      {service.title}
                    </h3>
                    <p className="font-body text-sm opacity-60 mt-1">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Franja MRZ — puramente decorativa, textura de documento oficial */}
              <div className="font-mono text-[10px] md:text-xs tracking-[0.15em] opacity-30 space-y-1">
                {docMrz.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Botón de giro — acción explícita, no automática */}
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? "Ver frente del documento" : "Ver servicios"}
        className={`absolute top-6 right-6 md:top-10 md:right-16 font-body text-xs uppercase tracking-[0.15em] opacity-60 hover:opacity-100 transition-opacity z-10 ${
          isDark ? "text-paper" : "text-ink"
        }`}
      >
        {flipped ? "← identidad" : "servicios →"}
      </button>

      {/* Selector de documento — cambia de carnet por clic, nunca por scroll */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {documentOrder.map((key) => (
          <button
            key={key}
            type="button"
            aria-label={`Ver documento: ${documents[key].type}`}
            aria-pressed={active === key}
            onClick={() => selectDocument(key)}
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
