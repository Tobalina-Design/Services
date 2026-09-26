"use client";

// Portada del pasaporte, a pantalla completa. Es lo primero que se ve:
// la identidad (TOBALINA + statement) sin ninguna condición de interacción.
import { useRef } from "react";
import { EMAIL, STATEMENT } from "@/lib/passport";
import { Rosette } from "./Security";

export default function Cover({ onOpen, portraitTouch }: { onOpen: () => void; portraitTouch: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  // Brillo del foil que sigue al cursor
  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--fx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--fy", `${((e.clientY - r.top) / r.height) * 100}%`);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className="cover relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-ink text-paper"
      style={{ padding: "max(24px, 5vh) max(20px, 5vw)" }}
    >
      <Rosette
        className="pointer-events-none absolute text-sand"
        style={{ width: "120vmin", height: "120vmin", left: "50%", top: "50%", transform: "translate(-50%,-50%)", opacity: 0.07 }}
      />
      <div className="foil-sheen pointer-events-none absolute inset-0" />

      <div className="relative text-center font-body uppercase text-sand/80" style={{ fontSize: "clamp(9px, 1.1vmin, 13px)", letterSpacing: "0.4em" }}>
        <p>Pasaporte de identidad</p>
        <p className="mt-1 text-sand/50">Identity passport</p>
      </div>

      <div className="relative flex flex-col items-center text-center" style={{ gap: "clamp(14px, 3vmin, 36px)" }}>
        {/* Emblema */}
        <div
          className="foil-border flex items-center justify-center rounded-full"
          style={{ width: "clamp(78px, 15vmin, 170px)", height: "clamp(78px, 15vmin, 170px)" }}
        >
          <span className="foil-text font-display font-light" style={{ fontSize: "clamp(40px, 8vmin, 92px)", lineHeight: 1 }}>
            T
          </span>
        </div>
        <h1
          className="foil-text font-display font-light leading-none"
          style={{ fontSize: "clamp(44px, 13vmin, 190px)", letterSpacing: "0.06em" }}
        >
          TOBALINA
        </h1>
        <p className="font-body text-paper/85" style={{ fontSize: "clamp(14px, 2.2vmin, 24px)" }}>
          {STATEMENT}
        </p>
      </div>

      <div className="relative flex w-full flex-col items-center" style={{ gap: "clamp(12px, 2.4vmin, 24px)" }}>
        {portraitTouch ? (
          <div className="flex flex-col items-center gap-3 text-paper/80">
            <svg className="rotate-phone" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="7" y="2.5" width="10" height="19" rx="2" />
              <path d="M11 18.5h2" />
            </svg>
            <p className="font-body uppercase" style={{ fontSize: 11, letterSpacing: "0.25em" }}>
              Gira tu móvil para abrir el pasaporte
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpen}
            className="rounded-full border border-sand/50 font-body uppercase text-paper transition-colors hover:bg-paper hover:text-ink"
            style={{ fontSize: "clamp(10px, 1.2vmin, 13px)", letterSpacing: "0.3em", padding: "14px 28px" }}
          >
            Abrir pasaporte →
          </button>
        )}
        <div className="flex w-full items-center justify-between font-body text-sand/70" style={{ fontSize: "clamp(10px, 1.2vmin, 13px)" }}>
          {/* Símbolo de pasaporte electrónico (chip) */}
          <svg width="30" height="20" viewBox="0 0 30 20" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
            <rect x="1" y="1" width="28" height="18" rx="1.5" />
            <rect x="9" y="5" width="12" height="10" rx="5" />
            <path d="M1 10h8M21 10h8" />
          </svg>
          <a href={`mailto:${EMAIL}`} className="underline-offset-4 hover:text-paper hover:underline">
            {EMAIL}
          </a>
          <span className="font-mono tracking-[0.2em]">TBL</span>
        </div>
      </div>
    </div>
  );
}
