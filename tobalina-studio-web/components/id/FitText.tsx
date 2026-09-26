"use client";

// Texto que se ajusta exactamente al ancho de su contenedor (tipografía a sangre).
import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function FitText({
  children,
  className = "",
  style,
  max = 2000,
  "aria-hidden": ariaHidden,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  max?: number;
  "aria-hidden"?: boolean | "true";
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const txt = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const w = wrap.current;
    const t = txt.current;
    if (!w || !t) return;
    const fit = () => {
      t.style.fontSize = "100px";
      const ratio = w.clientWidth / t.scrollWidth;
      t.style.fontSize = `${Math.min(100 * ratio, max)}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(w);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [children, max]);

  return (
    <div ref={wrap} className={`w-full ${className}`} style={style} aria-hidden={ariaHidden}>
      <span ref={txt} className="inline-block whitespace-nowrap" style={{ fontSize: "8vw", lineHeight: 0.84 }}>
        {children}
      </span>
    </div>
  );
}
