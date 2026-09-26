"use client";

// La web ENTERA evoca un DNI: fondo de página con textura de seguridad +
// documento centrado con proporción real de tarjeta de identidad (ISO ID-1).
//
// Desktop: botón explícito "servicios →" gira la tarjeta en 3D (frente/reverso).
// Móvil: el giro es FÍSICO — el usuario rota el teléfono. La cara visible la
// decide la orientación real del dispositivo (ver reglas @media en globals.css),
// nunca una animación por clic.
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

  // Tilt de cursor: solo tiene sentido en escritorio (ratón). En móvil la
  // "inclinación" del documento es la orientación real del teléfono, así que
  // no se engancha ningún gesto táctil aquí.
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-5 py-8 px-4">
      {/* Pestañas de vertical — siempre visibles, nunca giran, nunca ambiguas.
          flex-wrap: si no caben en una fila, cada pestaña baja entera a la
          siguiente — nunca se parte el texto dentro de una pestaña. */}
      <div className="flex flex-wrap justify-center gap-2 z-10 px-2">
        {documentOrder.map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={active === key}
            onClick={() => selectDocument(key)}
            className={`font-body text-xs md:text-sm uppercase tracking-[0.12em] px-4 py-2 rounded-full border whitespace-nowrap transition-colors ${
              active === key
                ? "bg-paper text-ink border-paper"
                : "bg-transparent text-paper/70 border-paper/30 hover:border-paper/60"
            }`}
          >
            {documents[key].tabLabel}
          </button>
        ))}
      </div>

      <div
        ref={stageRef}
        style={{ perspective: 1400 }}
        className="id-card-shell w-full max-w-[420px] md:max-w-none relative rounded-2xl border border-sand/40 shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden"
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseLeave={reset}
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
            {/* Contenedor que gira (solo escritorio; en móvil se neutraliza por CSS) */}
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
              className="doc-flip-wrapper relative h-full w-full"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* FRENTE — campos tipo DNI: caja de marca + datos, siempre lo primero visible */}
              <motion.div
                style={{
                  rotateX: springX,
                  rotateY: springY,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
                className={`doc-front-face relative flex flex-col md:absolute md:inset-0 ${faceTone}`}
              >
                <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-5 border-b border-current/15">
                  <div className="flex items-center gap-2">
                    <div
                      aria-hidden="true"
                      className="w-6 h-5 md:w-8 md:h-6 rounded-[3px] border border-current/40 grid grid-rows-3 gap-[1.5px] p-[2px]"
                    >
                      <div className="bg-current/40 rounded-[1px]" />
                      <div className="bg-current/40 rounded-[1px]" />
                      <div className="bg-current/40 rounded-[1px]" />
                    </div>
                    <p className="font-body text-[9px] md:text-xs uppercase tracking-[0.2em] opacity-50">
                      documento de identidad
                    </p>
                  </div>
                  <p className="font-body text-[9px] md:text-xs uppercase tracking-[0.2em] opacity-50">
                    {doc.type}
                  </p>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] gap-3 md:gap-8 px-4 py-3 md:px-8 md:py-6 items-center">
                  {/* Caja tipo foto — monograma, nunca un retrato real.
                      Pequeña y a la izquierda en móvil; columna completa en escritorio. */}
                  <div className="flex justify-start md:h-full md:justify-center md:items-center">
                    <div className="w-16 h-20 md:w-full md:h-auto md:aspect-[3/4] md:max-h-full rounded-md border border-current/30 flex items-center justify-center">
                      <span className="font-display font-light text-2xl md:text-5xl opacity-80">
                        T
                      </span>
                    </div>
                  </div>

                  {/* Campos, como en un carnet real: etiqueta pequeña + valor */}
                  <div className="flex flex-col justify-center gap-2 md:gap-4 min-w-0">
                    <div>
                      <p className="font-body text-[8px] md:text-[10px] uppercase tracking-[0.18em] opacity-45">
                        marca
                      </p>
                      <h1 className="font-display font-light text-3xl md:text-4xl leading-tight truncate">
                        {doc.name}
                      </h1>
                    </div>
                    <div>
                      <p className="font-body text-[8px] md:text-[10px] uppercase tracking-[0.18em] opacity-45">
                        declaración
                      </p>
                      <p className="font-body text-sm md:text-base leading-snug">
                        {doc.statement}
                      </p>
                      <p className="font-body text-xs opacity-50 mt-1">
                        {doc.subline}
                      </p>
                    </div>
                    <div className="flex gap-6">
                      <div>
                        <p className="font-body text-[8px] md:text-[10px] uppercase tracking-[0.18em] opacity-45">
                          ref.
                        </p>
                        <p className="font-mono text-xs md:text-sm">{doc.refCode}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="font-body text-[8px] md:text-xs opacity-40 px-4 pb-3 md:px-8 md:pb-5">
                  {doc.issuedBy}
                </p>

                {/* Foil holográfico — capa de verificación, solo visible al inclinar (escritorio) */}
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

                {/* Microtexto — solo tras umbral de tilt (escritorio) */}
                <div
                  className={`absolute inset-0 flex items-center justify-center px-10 text-center pointer-events-none transition-opacity duration-200 ${
                    revealed ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <p className="font-body text-[9px] md:text-xs tracking-[0.08em] opacity-60 max-w-md">
                    {doc.microtext}
                  </p>
                </div>
              </motion.div>

              {/* REVERSO — servicios en lista de una columna, sin solapes a ningún ancho */}
              <div
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
                className={`doc-back-face flex flex-col md:absolute md:inset-0 ${faceTone}`}
              >
                <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-5 border-b border-current/15">
                  <p className="font-body text-[9px] md:text-xs uppercase tracking-[0.2em] opacity-50">
                    servicios
                  </p>
                  <p className="font-body text-[9px] md:text-xs uppercase tracking-[0.2em] opacity-50">
                    {doc.type}
                  </p>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-3 md:gap-3 px-4 py-4 md:px-8 md:py-0 overflow-hidden">
                  {docServices.map((service) => (
                    <div
                      key={service.title}
                      className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-0.5 md:gap-4 border-b border-current/10 pb-1.5 md:pb-2"
                    >
                      <h3 className="font-display font-light text-base md:text-lg shrink-0">
                        {service.title}
                      </h3>
                      <p className="font-body text-xs opacity-55 md:text-right leading-snug">
                        {service.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="font-mono text-[7px] md:text-[10px] tracking-[0.12em] opacity-30 px-4 py-3 md:px-8 md:py-5 space-y-0.5">
                  {docMrz.map((line) => (
                    <p key={line} className="truncate">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Botón de giro — SOLO escritorio, fuera de la tarjeta por completo:
          así nunca puede solaparse con ningún contenido de ninguna cara. */}
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? "Ver frente del documento" : "Ver servicios"}
        className="desktop-flip-control font-body text-xs uppercase tracking-[0.15em] text-paper/70 hover:text-paper transition-colors"
      >
        {flipped ? "← ver identidad" : "ver servicios →"}
      </button>

      {/* Aviso de giro físico — SOLO móvil, solo en vertical (portrait), fuera
          de la tarjeta: nunca se superpone al contenido del documento. */}
      <div className="mobile-rotate-hint hidden items-center gap-2 text-paper/70">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M3 12a9 9 0 1 1 3 6.7" />
          <path d="M3 17v-5h5" />
        </svg>
        <p className="font-body text-[11px] uppercase tracking-[0.15em]">
          gira tu móvil para ver servicios
        </p>
      </div>
    </div>
  );
}
