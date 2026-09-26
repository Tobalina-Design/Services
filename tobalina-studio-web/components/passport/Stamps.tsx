"use client";

// Sellos de pasaporte. Entran con un "golpe" (escala + giro) al llegar la
// página; en la hoja que está pasando (still) se pintan ya estampados.
import { useId, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { u } from "@/lib/passport";

export function Slam({
  children,
  rotate = 0,
  delay = 0,
  still = false,
  className,
  opacity = 0.9,
}: {
  children: ReactNode;
  rotate?: number;
  delay?: number;
  still?: boolean;
  className?: string;
  opacity?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`stamp-blend ${className ?? ""}`}
      initial={still || reduce ? false : { opacity: 0, scale: 1.7, rotate: rotate - 7 }}
      animate={{ opacity, scale: 1, rotate }}
      transition={{ type: "spring", stiffness: 420, damping: 24, delay }}
    >
      {children}
    </motion.div>
  );
}

export function RoundStamp({
  top,
  bottom,
  center,
  sub,
  size,
}: {
  top: string;
  bottom: string;
  center: string;
  sub?: string;
  size: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 200" style={{ width: size, height: size, color: "var(--pg-ink2)" }} aria-hidden="true">
      <defs>
        <path id={`${id}t`} d="M 22 100 A 78 78 0 0 1 178 100" />
        <path id={`${id}b`} d="M 30 100 A 70 70 0 0 0 170 100" />
      </defs>
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="100" cy="100" r="89" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text fill="currentColor" fontSize="13" letterSpacing="2.5" fontFamily="Inter, sans-serif" fontWeight="500">
        <textPath href={`#${id}t`} startOffset="50%" textAnchor="middle">
          {top}
        </textPath>
      </text>
      <text fill="currentColor" fontSize="12" letterSpacing="2" fontFamily="Inter, sans-serif" fontWeight="500">
        <textPath href={`#${id}b`} startOffset="50%" textAnchor="middle" dominantBaseline="hanging">
          {bottom}
        </textPath>
      </text>
      <text x="100" y="108" textAnchor="middle" fill="currentColor" fontSize="34" fontFamily="'Red Rose', serif" fontWeight="300">
        {center}
      </text>
      {sub && (
        <text x="100" y="128" textAnchor="middle" fill="currentColor" fontSize="9" letterSpacing="2" fontFamily="Inter, sans-serif">
          {sub}
        </text>
      )}
      <text x="22" y="104" fill="currentColor" fontSize="10">★</text>
      <text x="170" y="104" fill="currentColor" fontSize="10">★</text>
    </svg>
  );
}

export function EntryStamp({ index, title, description }: { index: number; title: string; description: string }) {
  return (
    <div
      className="flex h-full flex-col rounded-[3px] border-2"
      style={{
        color: "var(--pg-ink2)",
        borderColor: "currentColor",
        padding: u(1.6, 8),
        outline: "1px solid currentColor",
        outlineOffset: u(0.5, 2),
      }}
    >
      <div
        className="flex items-center justify-between font-body uppercase"
        style={{ fontSize: u(1.2, 8), letterSpacing: "0.18em" }}
      >
        <span>Entrada</span>
        <span>Nº {String(index + 1).padStart(2, "0")}</span>
      </div>
      <p className="font-display font-normal leading-tight" style={{ fontSize: u(2.5, 13), marginTop: u(1, 4), color: "var(--pg-fg)" }}>
        {title}
      </p>
      <p className="font-body leading-snug" style={{ fontSize: u(1.45, 10), marginTop: u(0.6, 3), color: "var(--pg-fg)", opacity: 0.72 }}>
        {description}
      </p>
    </div>
  );
}
