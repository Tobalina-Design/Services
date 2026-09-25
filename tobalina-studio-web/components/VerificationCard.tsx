"use client";

// Capa de verificación: tarjeta tipo carnet de identidad.
// Reacciona al cursor (tilt 3D). El foil y el microtexto secundario
// solo se revelan al inclinar — son la "prueba de autenticidad",
// nunca el portador del mensaje principal (ese vive en IdentityMark).
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const REVEAL_THRESHOLD = 0.55;

export default function VerificationCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springX = useSpring(rotX, { stiffness: 150, damping: 18 });
  const springY = useSpring(rotY, { stiffness: 150, damping: 18 });

  const foilOpacity = useTransform([springX, springY], ([x, y]: number[]) => {
    const amount = Math.min(1, (Math.abs(x) + Math.abs(y)) / 14);
    return amount;
  });

  function handleMove(clientX: number, clientY: number) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;
    const newRotY = (px - 0.5) * 20;
    const newRotX = (0.5 - py) * 14;
    rotX.set(newRotX);
    rotY.set(newRotY);

    const amount = Math.min(1, (Math.abs(newRotX) + Math.abs(newRotY)) / 14);
    setRevealed(amount > REVEAL_THRESHOLD);
  }

  function reset() {
    rotX.set(0);
    rotY.set(0);
    setRevealed(false);
  }

  return (
    <div
      style={{ perspective: 1000 }}
      className="w-full max-w-sm mx-auto"
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseLeave={reset}
      onTouchMove={(e) => {
        const t = e.touches[0];
        handleMove(t.clientX, t.clientY);
      }}
      onTouchEnd={reset}
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: "preserve-3d",
        }}
        className="relative aspect-[1.6/1] rounded-xl border border-ink/15 bg-paper/60 backdrop-blur-sm overflow-hidden px-6 py-5"
      >
        <p className="font-body text-[10px] uppercase tracking-[0.15em] text-ink/40">
          documento verificable
        </p>
        <p className="font-body text-[11px] text-ink/40 mt-8">
          emitido por criterio, no por consenso
        </p>

        {/* Foil holográfico — solo visible al inclinar */}
        <motion.div
          style={{ opacity: foilOpacity }}
          className="absolute inset-0 pointer-events-none mix-blend-soft-light"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-foil/60 to-transparent" />
        </motion.div>

        {/* Microtexto — statement secundario, solo tras umbral de tilt */}
        <div
          className={`absolute inset-0 flex items-center justify-center px-8 text-center transition-opacity duration-200 pointer-events-none ${
            revealed ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="font-body text-[10px] tracking-[0.05em] text-ink/60 leading-relaxed">
            no hacemos ruido. hacemos identidad.
          </p>
        </div>
      </motion.div>
      <p className="font-body text-xs text-ink/40 text-center mt-3">
        inclina con el cursor para verificar
      </p>
    </div>
  );
}
