// Capa fija: identidad de marca. Siempre visible, sin condición de interacción.
// No lleva tilt ni retardo — es lo primero que se lee al abrir la web.
export default function IdentityMark() {
  return (
    <div className="text-center select-none">
      <p className="text-xs uppercase tracking-[0.25em] text-ink/50 font-body mb-4">
        estudio de diseño e identidad
      </p>
      <h1 className="font-display font-light text-[13vw] leading-[0.9] text-ink md:text-[7vw]">
        TOBALINA
      </h1>
      <p className="font-body text-base md:text-xl text-ink/80 mt-6 max-w-xl mx-auto">
        No hacemos ruido. Hacemos identidad.
      </p>
      <p className="font-body text-sm text-ink/50 mt-2 max-w-md mx-auto">
        Diseñamos para perdurar, no solo para llamar la atención.
      </p>
    </div>
  );
}
