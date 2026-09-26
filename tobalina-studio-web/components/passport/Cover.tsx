"use client";

// Portada. Dos protagonistas, nada más: el statement y TOBALINA, a sangre.
import { EMAIL } from "@/lib/passport";
import FitText from "./FitText";
import { useMediaQuery } from "./useMediaQuery";

export default function Cover({ onOpen, portraitTouch }: { onOpen: () => void; portraitTouch: boolean }) {
  const tall = useMediaQuery("(max-aspect-ratio: 1/1)");
  const lines = tall ? ["NO HACEMOS RUIDO.", "HACEMOS", "IDENTIDAD."] : ["NO HACEMOS RUIDO.", "HACEMOS IDENTIDAD."];

  return (
    <div
      className="flex h-full w-full flex-col bg-ink text-paper"
      style={{ padding: "max(14px, 2.4vmin) max(14px, 2.4vmin) max(10px, 1.6vmin)" }}
    >
      <header className="label grid grid-cols-2 items-start sm:grid-cols-3">
        <span>Pasaporte</span>
        <span className="hidden text-center sm:block">Identidad — Identity</span>
        <span className="text-right">TBL — 01</span>
      </header>

      <div className="flex flex-1 flex-col justify-center" style={{ gap: "max(4px, 0.8vmin)" }}>
        <h2 className="sr-only">No hacemos ruido. Hacemos identidad.</h2>
        {lines.map((l) => (
          <FitText key={l} className="font-display font-bold" aria-hidden="true">
            {l}
          </FitText>
        ))}
      </div>

      <div
        className="label flex items-end justify-between border-t border-paper"
        style={{ paddingTop: "max(10px, 1.4vmin)", marginBottom: "max(8px, 1.2vmin)" }}
      >
        <a href={`mailto:${EMAIL}`} className="hover:underline">
          {EMAIL}
        </a>
        {portraitTouch ? (
          <span className="flex items-center gap-2">
            <svg className="rotate-phone" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="7" y="2.5" width="10" height="19" />
            </svg>
            Girar para abrir
          </span>
        ) : (
          <button type="button" onClick={onOpen} className="underline underline-offset-4 hover:no-underline">
            Abrir pasaporte
          </button>
        )}
      </div>

      <h1 className="sr-only">Tobalina</h1>
      <FitText className="font-display font-bold" aria-hidden="true">
        TOBALINA
      </FitText>
    </div>
  );
}
