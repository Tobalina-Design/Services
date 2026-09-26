"use client";

// Sello: bloque rectangular, tinta plana, mayúsculas. Entra de golpe al llegar
// la página; en la hoja que está girando (still) aparece ya estampado.
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { u } from "@/lib/passport";

export function Slam({
  children,
  rotate = 0,
  delay = 0,
  still = false,
  className,
}: {
  children: ReactNode;
  rotate?: number;
  delay?: number;
  still?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={still || reduce ? false : { opacity: 0, scale: 2.2, rotate: rotate - 10 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{ type: "spring", stiffness: 520, damping: 26, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Stamp({ top, main, bottom }: { top: string; main: string; bottom: string }) {
  return (
    <div
      className="flex flex-col items-center border-[3px] text-center uppercase"
      style={{ borderColor: "var(--pg-fg)", color: "var(--pg-fg)", padding: `${u(0.9, 5)} ${u(2, 10)}` }}
    >
      <span className="font-body" style={{ fontSize: u(1.05, 7), letterSpacing: "0.3em" }}>
        {top}
      </span>
      <span className="font-display font-bold leading-none" style={{ fontSize: u(3.6, 16), marginBlock: u(0.5, 2) }}>
        {main}
      </span>
      <span className="font-body" style={{ fontSize: u(1.05, 7), letterSpacing: "0.3em" }}>
        {bottom}
      </span>
    </div>
  );
}
